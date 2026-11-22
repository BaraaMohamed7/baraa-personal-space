'use client';

import { useEffect, useState, type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import type { SiteContent } from '@/data/content-defaults';
import type { Experience, Project, Language } from '@/data/site';

type Snapshot = { content: SiteContent; revision: string };
type Tab = 'text' | 'roles' | 'projects' | 'experience' | 'links' | 'media' | 'sections';
type CopyKey = keyof SiteContent['copy']['en'];
type ImageKey = keyof SiteContent['images'];
type SectionKey = keyof SiteContent['sections'];
const tabs: {id:Tab;label:string}[] = [
  {id:'text',label:'Page copy'}, {id:'roles',label:'Typing roles'}, {id:'projects',label:'Projects'},
  {id:'experience',label:'Experience'}, {id:'links',label:'Social links'},
  {id:'media',label:'Images'}, {id:'sections',label:'Sections'},
];
const copyGroups = [
  {label:'Hero',key:'hero'}, {label:'Projects',key:'work'}, {label:'Experience',key:'exp'},
  {label:'About',key:'about'}, {label:'Now',key:'now'}, {label:'Contact',key:'contact'},
  {label:'Navigation',key:'nav'}, {label:'Other',key:'other'},
];
function copyGroup(key:string){
  if(key.startsWith('hero') || key.startsWith('cta') || key.startsWith('typing'))return 'hero';
  if(key.startsWith('work') || key.startsWith('filter') || key==='featured' || key==='project' || key==='viewProject' || key==='inProgress' || key==='noProjects'||key==='manage'||key==='finishManaging'||key==='show'||key==='hide'||key==='projectNote')return 'work';
  if(key.startsWith('exp'))return 'exp';
  if(key.startsWith('about')||key.startsWith('tag'))return 'about';
  if(key.startsWith('now'))return 'now';
  if(key.startsWith('contact'))return 'contact';
  if(key.startsWith('nav'))return 'nav';
  return 'other';
}
function Field({label,children}: {label:string; children:ReactNode}){
  return <label className="admin-field"><span>{label}</span>{children}</label>;
}
function TextInput({value,onChange,large=false,placeholder=''}:{value:string;onChange:(value:string)=>void;large?:boolean;placeholder?:string}){
  return large?<textarea value={value} placeholder={placeholder} rows={3} onChange={e=>onChange(e.target.value)} />
    :<input type="text" value={value} placeholder={placeholder} onChange={e=>onChange(e.target.value)} />;
}
function TwoLanguages({label,value,onChange,large=false}:{label:string;value:{en:string;ar:string};onChange:(lang:Language,value:string)=>void;large?:boolean}){
  return <div className="admin-bilingual"><h4>{label}</h4><div className="admin-translate-grid">
    <Field label="English"><TextInput value={value.en} large={large} onChange={v=>onChange('en',v)} /></Field>
    <Field label="العربية"><div dir="rtl"><TextInput value={value.ar} large={large} onChange={v=>onChange('ar',v)} /></div></Field>
  </div></div>;
}

export default function AdminPanel(){
  const router = useRouter();
  const [snapshot,setSnapshot]=useState<Snapshot|null>(null);
  const [tab,setTab]=useState<Tab>('text');
  const [group,setGroup]=useState('hero');
  const [status,setStatus]=useState('');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  useEffect(()=>{
    let mounted=true;
    fetch('/api/admin/content',{cache:'no-store'})
      .then(async res=>{const data=await res.json();if(!res.ok)throw new Error(data.error||'Cannot load content');return data as Snapshot;})
      .then(data=>{if(mounted)setSnapshot(data);})
      .catch(e=>{if(mounted)setError(e instanceof Error?e.message:'Cannot load content');});
    return ()=>{mounted=false;};
  },[]);
  function update(mutator:(draft:SiteContent)=>void){
    setSnapshot(current=>{
      if(!current)return current;
      const draft=structuredClone(current.content);
      mutator(draft);
      return {...current,content:draft};
    });
    setStatus('Unsaved changes');
  }
  async function save(){
    if(!snapshot||busy)return;setBusy(true);setError('');setStatus('Publishing…');
    try {
      const response=await fetch('/api/admin/content',{method:'PUT',headers:{'Content-Type':'application/json'},
        body:JSON.stringify(snapshot)});
      const result=await response.json() as {revision?:string;error?:string};
      if(!response.ok||!result.revision)throw new Error(result.error||'Publishing failed');
      setSnapshot(current=>current?{...current,revision:result.revision!}:current);
      setStatus('Published! The website is updated.');
    }catch(e){setError(e instanceof Error?e.message:'Publishing failed');setStatus('Not published');}
    finally{setBusy(false);}
  }
  async function logout(){
    await fetch('/api/admin/logout',{method:'POST'});
    router.refresh();
  }
  async function uploadFile(key:ImageKey,file:File){
    setBusy(true);setError('');setStatus('Uploading image…');
    try{
      const body=new FormData();body.append('file',file);
      const response=await fetch('/api/admin/upload',{method:'POST',body});
      const result=await response.json() as {url?:string;error?:string};
      if(!response.ok||!result.url)throw new Error(result.error||'Upload failed');
      update(d=>{d.images[key]=result.url!;});
      setStatus('Image uploaded. Click Publish changes to make it live.');
    }catch(e){setError(e instanceof Error?e.message:'Upload failed');setStatus('Upload failed');}
    finally{setBusy(false);}
  }
  function updateProject(index:number,change:(p:Project)=>void){
    update(d=>{change(d.projects[index]);});
  }
  function updateExperience(index:number,change:(p:Experience)=>void){
    update(d=>{change(d.experiences[index]);});
  }
  function moveItem(key:'projects'|'experiences',index:number,dir:number){
    update(d=>{const array=d[key];const target=index+dir;if(target<0||target>=array.length)return;
      const a=array[index];const b=array[target];
      // Both collections are homogeneous; swap in place.
      (array as Array<Project|Experience>)[index]=b;
      (array as Array<Project|Experience>)[target]=a;
    });
  }
  const content=snapshot?.content;
  return <div className="admin-shell">
    <header className="admin-topbar"><div><span className="admin-eyebrow">Baraa / Studio</span><h1>Content Studio</h1></div>
      <div className="admin-top-actions">
        <a href="/" target="_blank" rel="noopener noreferrer">View site ↗</a>
        <button type="button" onClick={logout}>Sign out</button>
      </div>
    </header>
    <div className="admin-body">
      <aside className="admin-sidebar"><p>Manage content</p>
        {tabs.map(item=><button type="button" key={item.id} className={tab===item.id?'is-selected':''}
          onClick={()=>setTab(item.id)}>{item.label}</button>)}
      </aside>
      <main className="admin-main">
        {error&&<div role="alert" className="admin-error">{error}</div>}
        {!content?<p>{error?'Please refresh or check the site configuration.':'Loading your content…'}</p>:<>
          <div className="admin-section-head"><div><span className="admin-eyebrow">Editable site content</span>
            <h2>{tabs.find(x=>x.id===tab)?.label}</h2></div>
            <div className="admin-publish"><span role="status">{status}</span>
              <button type="button" className="admin-save" disabled={busy} onClick={save}>{busy?'Working…':'Publish changes'}</button>
            </div>
          </div>
          {tab==='text'&&<div>
            <div className="admin-subnav">{copyGroups.map(g=><button key={g.key} type="button"
              className={group===g.key?'selected':''} onClick={()=>setGroup(g.key)}>{g.label}</button>)}</div>
            <p className="admin-hint">Edit both languages. All content changes become public only when you publish.</p>
            {(Object.keys(content.copy.en) as CopyKey[]).filter(key=>copyGroup(key)===group && key!=='heroEyebrow')
              .map(key=><TwoLanguages key={key} label={key} value={{en:content.copy.en[key],ar:content.copy.ar[key]}}
                large={/(Description|Text|Intro|body|aboutText|contactText)/i.test(key)}
                onChange={(lang,value)=>update(d=>{d.copy[lang][key]=value;})}/>)}
          </div>}
          {tab==='roles'&&<div className="admin-card">
            <p className="admin-hint">Each line becomes one rotating role in the Hero typing effect.</p>
            {(['en','ar'] as Language[]).map(lang=><Field key={lang} label={lang==='en'?'English roles':'الأدوار بالعربي'}>
              <textarea dir={lang==='ar'?'rtl':'ltr'} rows={6} value={content.roles[lang].join('\n')}
                onChange={e=>update(d=>{d.roles[lang]=e.target.value.split('\n').map(s=>s.trim()).filter(Boolean);})} />
            </Field>)}
          </div>}
          {tab==='projects'&&<div>
            <div className="admin-list-actions"><p className="admin-hint">Add, reorder, feature, publish or hide a project for everyone.</p>
              <button type="button" className="admin-add" onClick={()=>update(d=>d.projects.push({
                id:'project-'+Date.now(),title:{en:'New project',ar:'مشروع جديد'},description:{en:'',ar:''},
                stack:[],domain:'General',published:false,featured:false,href:''
              }))}>+ Add project</button></div>
            {content.projects.map((project,index)=><details className="admin-item" key={project.id}>
              <summary><span>{project.title.en||'Untitled'} <small>{project.published?'Published':'Hidden'}{project.featured?' · Featured':''}</small></span><span>Edit ▾</span></summary>
              <div className="admin-item-body">
                <TwoLanguages label="Project name" value={project.title} onChange={(l,v)=>updateProject(index,p=>{p.title[l]=v;})}/>
                <TwoLanguages label="Description" value={project.description} large onChange={(l,v)=>updateProject(index,p=>{p.description[l]=v;})}/>
                <div className="admin-translate-grid"><Field label="Technology stack (comma-separated)">
                  <TextInput value={project.stack.join(', ')} onChange={v=>updateProject(index,p=>{p.stack=v.split(',').map(s=>s.trim()).filter(Boolean);})}/></Field>
                  <Field label="Domain"><TextInput value={project.domain} onChange={v=>updateProject(index,p=>{p.domain=v;})}/></Field></div>
                <Field label="Project URL (optional)"><TextInput value={project.href||''} onChange={v=>updateProject(index,p=>{p.href=v;})}/></Field>
                <div className="admin-checkboxes"><label><input type="checkbox" checked={project.published} onChange={e=>updateProject(index,p=>{p.published=e.target.checked;})}/> Show on website</label>
                  <label><input type="checkbox" checked={project.featured} onChange={e=>updateProject(index,p=>{p.featured=e.target.checked;})}/> Featured</label></div>
                <div className="admin-item-actions"><button type="button" disabled={index===0} onClick={()=>moveItem('projects',index,-1)}>↑ Up</button>
                  <button type="button" disabled={index===content.projects.length-1} onClick={()=>moveItem('projects',index,1)}>↓ Down</button>
                  <button className="admin-danger" type="button" onClick={()=>{if(window.confirm('Delete this project?'))update(d=>{d.projects.splice(index,1);});}}>Delete</button></div>
              </div>
            </details>)}
          </div>}
          {tab==='experience'&&<div>
            <div className="admin-list-actions"><p className="admin-hint">Edit your professional journey and reorder the timeline.</p>
              <button type="button" className="admin-add" onClick={()=>update(d=>d.experiences.push({
                id:'experience-'+Date.now(),role:{en:'New role',ar:'وظيفة جديدة'},period:'2026',body:{en:'',ar:''}
              }))}>+ Add experience</button></div>
            {content.experiences.map((item,index)=><details className="admin-item" key={item.id}>
              <summary><span>{item.role.en||'New role'} <small>{item.period}</small></span><span>Edit ▾</span></summary>
              <div className="admin-item-body">
                <TwoLanguages label="Position / Organization" value={item.role} onChange={(l,v)=>updateExperience(index,e=>{e.role[l]=v;})}/>
                <Field label="Period"><TextInput value={item.period} onChange={v=>updateExperience(index,e=>{e.period=v;})}/></Field>
                <TwoLanguages label="Responsibilities and achievements" value={item.body} large onChange={(l,v)=>updateExperience(index,e=>{e.body[l]=v;})}/>
                <div className="admin-item-actions"><button type="button" disabled={index===0} onClick={()=>moveItem('experiences',index,-1)}>↑ Up</button>
                  <button type="button" disabled={index===content.experiences.length-1} onClick={()=>moveItem('experiences',index,1)}>↓ Down</button>
                  <button className="admin-danger" type="button" onClick={()=>{if(window.confirm('Delete this experience?'))update(d=>{d.experiences.splice(index,1);});}}>Delete</button></div>
              </div>
            </details>)}
          </div>}
          {tab==='links'&&<div className="admin-card">
            {(['github','linkedin'] as const).map(key=><Field key={key} label={key}><TextInput value={content.socials[key]}
              onChange={v=>update(d=>{d.socials[key]=v;})}/></Field>)}
          </div>}
          {tab==='media'&&<div className="admin-media-grid">
            {(['hero','sea','event'] as ImageKey[]).map(key=><div className="admin-card" key={key}>
              <h3>{key==='hero'?'Hero portrait':key==='sea'?'About — main picture':'About — event picture'}</h3>
              <div className="admin-image-preview">{/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={content.images[key]} alt={key} /></div>
              <Field label="Image URL"><TextInput value={content.images[key]} onChange={v=>update(d=>{d.images[key]=v;})}/></Field>
              <Field label="Upload replacement (PNG, JPG, WEBP, GIF · max 3 MB)">
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" disabled={busy}
                  onChange={e=>{const file=e.target.files?.[0];if(file)void uploadFile(key,file);e.currentTarget.value='';}} />
              </Field>
            </div>)}
          </div>}
          {tab==='sections'&&<div className="admin-card"><p className="admin-hint">Hide or show complete sections of the public homepage.</p>
            {(Object.keys(content.sections) as SectionKey[]).map(key=><label className="admin-section-toggle" key={key}>
              <span>{key.charAt(0).toUpperCase()+key.slice(1)}</span>
              <input type="checkbox" checked={content.sections[key]} onChange={e=>update(d=>{d.sections[key]=e.target.checked;})}/>
            </label>)}
          </div>}
          <div className="admin-bottom-actions"><span role="status">{status}</span>
            <button type="button" disabled={busy} className="admin-save" onClick={save}>Publish changes</button>
          </div>
        </>}
      </main>
    </div>
  </div>;
}
