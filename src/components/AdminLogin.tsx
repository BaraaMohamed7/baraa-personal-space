'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AdminLogin(){
  const router = useRouter();
  const [password,setPassword]=useState('');
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  async function login(event:FormEvent<HTMLFormElement>){
    event.preventDefault();setBusy(true);setError('');
    try {
      const response=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password})});
      const data=await response.json() as {error?:string};
      if(!response.ok)throw new Error(data.error||'Unable to sign in');
      router.refresh();
    }catch(e){setError(e instanceof Error?e.message:'Unable to sign in');setBusy(false);}
  }
  return <main className="admin-shell admin-login-shell"><form className="admin-login-card" onSubmit={login}>
    <Link href="/" className="admin-back">← Back to website</Link>
    <span className="admin-eyebrow">Baraa / Studio</span>
    <h1>Content Studio</h1>
    <p>Sign in to edit and publish your website content.</p>
    <label htmlFor="password">Admin password</label>
    <input id="password" type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)} />
    {error&&<p className="admin-error" role="alert">{error}</p>}
    <button className="admin-save" type="submit" disabled={busy}>{busy?'Signing in…':'Sign in'}</button>
  </form></main>;
}
