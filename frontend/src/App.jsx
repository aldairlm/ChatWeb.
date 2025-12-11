import React, { useState, useEffect } from 'react'
import Auth from './pages/Auth'
import Chat from './pages/Chat'

export default function App(){
  const [user, setUser] = useState(()=>{
    const s = localStorage.getItem('chat_user');
    return s?JSON.parse(s):null
  })

  useEffect(()=>{
    if(user) localStorage.setItem('chat_user', JSON.stringify(user));
    else localStorage.removeItem('chat_user');
  },[user])

  return (
    <div className="container">
      <h1>Chat Web</h1>
      {user ? <Chat user={user} onLogout={()=>setUser(null)} /> : <Auth onLogin={(u)=>setUser(u)} />}
    </div>
  )
}
