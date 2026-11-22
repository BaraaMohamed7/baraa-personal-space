import { randomUUID } from 'node:crypto';
import { defaultSiteContent, type SiteContent } from '@/data/content-defaults';

// Content releases are immutable blobs. The newest release is the published site.
const PREFIX = 'portfolio/releases/';
const API = 'https://vercel.com/api/blob';

function blobHeaders(): Record<string, string> | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) return null;
  const storeId = token.split('_')[3];
  if (!storeId) throw new Error('Invalid BLOB_READ_WRITE_TOKEN');
  return {
    authorization: `Bearer ${token}`,
    'x-vercel-blob-store-id': storeId,
    'x-api-version': '12',
  };
}

type ListedBlob = { pathname: string; url: string; uploadedAt: string };
type BlobList = { blobs: ListedBlob[]; hasMore: boolean; cursor?: string };

export type ContentSnapshot = { content: SiteContent; revision: string };

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}
function textValue(v: unknown, limit = 3000): v is string {
  return typeof v === 'string' && v.length <= limit;
}
function safeUrl(v: unknown): v is string {
  if (!textValue(v, 2000)) return false;
  if (v === '') return true;
  if (v.startsWith('/images/')) return /^\/images\/[a-zA-Z0-9._/-]+$/.test(v);
  try { const u = new URL(v); return u.protocol === 'https:' || u.protocol === 'http:'; } catch { return false; }
}
function bilingual(v: unknown, limit = 3000): boolean {
  return isPlainObject(v) && textValue(v.en, limit) && textValue(v.ar, limit);
}

// Validates the full document server-side. No unchecked client data is published.
export function validateContent(input: unknown): SiteContent {
  if (!isPlainObject(input)) throw new Error('Expected a content document');
  const { copy, roles, projects, experiences, socials, images, sections } = input;
  if (!isPlainObject(copy) || !isPlainObject(copy.en) || !isPlainObject(copy.ar)) throw new Error('Invalid translations');
  for (const language of ['en','ar'] as const) {
    for (const key of Object.keys(defaultSiteContent.copy[language])) {
      if (!textValue((copy[language] as Record<string, unknown>)[key], 8000)) throw new Error(`Invalid translation: ${language}.${key}`);
    }
  }
  if (!isPlainObject(roles) || !['en','ar'].every(l => Array.isArray(roles[l]) && (roles[l] as unknown[]).length <= 20 && (roles[l] as unknown[]).every(x=>textValue(x,120)))) throw new Error('Invalid roles');
  if (!Array.isArray(projects) || projects.length > 100) throw new Error('Invalid projects');
  if (!Array.isArray(experiences) || experiences.length > 100) throw new Error('Invalid experience');
  const ids = new Set<string>();
  for (const p of projects) {
    if (!isPlainObject(p) || !textValue(p.id,80) || !/^[\w-]+$/.test(p.id) || !bilingual(p.title,160) || !bilingual(p.description,4000)
    || !Array.isArray(p.stack) || p.stack.length > 30 || !p.stack.every(s=>textValue(s,70))
    || !textValue(p.domain,120) || typeof p.featured !== 'boolean' || typeof p.published !== 'boolean'
    || (p.href !== undefined && !safeUrl(p.href))) throw new Error('Invalid project data');
    if (ids.has(p.id)) throw new Error('Duplicate project ID'); ids.add(p.id);
  }
  ids.clear();
  for (const e of experiences) {
    if (!isPlainObject(e) || !textValue(e.id,80) || !/^[\w-]+$/.test(e.id)
    || !bilingual(e.role,200) || !bilingual(e.body,4000) || !textValue(e.period,100)) throw new Error('Invalid experience data');
    if (ids.has(e.id)) throw new Error('Duplicate experience ID'); ids.add(e.id);
  }
  if (!isPlainObject(socials) || !safeUrl(socials.github) || !safeUrl(socials.linkedin)) throw new Error('Invalid social links');
  if (!isPlainObject(images) || !['hero','sea','event'].every(k=>safeUrl(images[k]) && Boolean(images[k]))) throw new Error('Invalid image URLs');
  if (!isPlainObject(sections) || !['work','experience','about','now','contact'].every(k=>typeof sections[k] === 'boolean')) throw new Error('Invalid section visibility');
  return input as unknown as SiteContent;
}

async function latestRelease(): Promise<ListedBlob | null> {
  const headers = blobHeaders();
  if (!headers) return null; // local development works without Vercel configuration.
  const result = await fetch(`${API}?prefix=${encodeURIComponent(PREFIX)}&limit=1000`, { headers, cache: 'no-store' });
  if (!result.ok) throw new Error(`Blob listing failed (${result.status})`);
  const data = await result.json() as BlobList;
  if (data.hasMore) throw new Error('Content history limit reached; archive old releases');
  return data.blobs.sort((a,b)=>Date.parse(b.uploadedAt)-Date.parse(a.uploadedAt))[0] ?? null;
}

export async function readContent(): Promise<ContentSnapshot> {
  const release = await latestRelease();
  if (!release) return { content: structuredClone(defaultSiteContent), revision: 'initial' };
  const response = await fetch(release.url, { cache: 'no-store' });
  if (!response.ok) throw new Error(`Content fetch failed (${response.status})`);
  const input: unknown = await response.json();
  return { content: validateContent(input), revision: release.pathname };
}

export async function readPublicContent(): Promise<SiteContent> {
  try { return (await readContent()).content; }
  catch (e) { console.error('Portfolio content unavailable', e); return defaultSiteContent; }
}

async function uploadBlob(path: string, data: Uint8Array | string, mime: string): Promise<string> {
  const headers = blobHeaders();
  if (!headers) throw new Error('Blob storage not configured');
  const resp = await fetch(`${API}/?pathname=${encodeURIComponent(path)}`, {
    method:'PUT',
    headers: {
      ...headers, 'x-vercel-blob-access':'public', 'x-content-type':mime,
      'x-add-random-suffix':'0', 'x-allow-overwrite':'0',
      'x-cache-control-max-age':'60',
    },
    body: typeof data === 'string' ? data : Buffer.from(data),
    cache: 'no-store',
  });
  if (!resp.ok) throw new Error(`Blob upload failed (${resp.status}): ${(await resp.text()).slice(0,300)}`);
  const result = await resp.json() as {url:string};
  if (!result.url) throw new Error('Blob upload returned no URL');
  return result.url;
}

export async function publishContent(input: unknown, revision: string): Promise<string> {
  const content = validateContent(input);
  const current = await readContent();
  if (revision !== current.revision) throw new Error('CONTENT_CONFLICT');
  const path = `${PREFIX}${new Date().toISOString().replace(/[:.]/g,'-')}-${randomUUID()}.json`;
  await uploadBlob(path, JSON.stringify(content), 'application/json');
  return path;
}

export async function uploadImage(bytes: Uint8Array, mime: string): Promise<string> {
  if (bytes.length > 3_000_000) throw new Error('Image exceeds 3 MB');
  const ext: Record<string,string> = {'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/gif':'gif'};
  if (!ext[mime]) throw new Error('Only PNG, JPG, WEBP or GIF images supported');
  const b=bytes;
  const png = mime === 'image/png' && b[0]===137 && b[1]===80 && b[2]===78 && b[3]===71;
  const jpg = mime === 'image/jpeg' && b[0]===255 && b[1]===216 && b[2]===255;
  const webp = mime === 'image/webp' && String.fromCharCode(...b.slice(0,4))==='RIFF' && String.fromCharCode(...b.slice(8,12))==='WEBP';
  const gif = mime === 'image/gif' && String.fromCharCode(...b.slice(0,3))==='GIF';
  if (!(png || jpg || webp || gif)) throw new Error('File signature does not match image type');
  return uploadBlob(`portfolio/media/${randomUUID()}.${ext[mime]}`, bytes, mime);
}
