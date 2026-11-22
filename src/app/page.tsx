import HomePage from '@/components/HomePage';
import { readPublicContent } from '@/lib/site-content';

export const dynamic = 'force-dynamic';
export default async function Page() {
  const content = await readPublicContent();
  return <HomePage content={content} />;
}
