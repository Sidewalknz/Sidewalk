'use client';
import { useState } from 'react';

export default function LoginPage() {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [err, setErr] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type':'application/json' },
      body: JSON.stringify({ user, pass })
    });
    if (res.ok) window.location.href = '/dashboard';
    else setErr('Invalid login');
  };

  return (
    <main style={{maxWidth:360, margin:'64px auto', fontFamily:'system-ui'}}>
      <h1>Dashboard Login</h1>
      <form onSubmit={submit}>
        <label>Username<br/>
          <input value={user} onChange={e=>setUser(e.target.value)} required />
        </label>
        <br/><br/>
        <label>Password<br/>
          <input type="password" value={pass} onChange={e=>setPass(e.target.value)} required />
        </label>
        <br/><br/>
        <button type="submit">Sign in</button>
      </form>
      {err && <p style={{color:'crimson'}}>{err}</p>}
    </main>
  );
}
