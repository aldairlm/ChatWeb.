import React, { useState } from 'react'
import { register, login } from '../api'

export default function Auth({ onLogin }){
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  async function handleSubmit(e){
    e.preventDefault();
    try{
      if(mode==='login'){
        const res = await login(username, password)
        onLogin({ username: res.user.username, token: res.token })
      } else {
        const res = await register(username, password)
        onLogin({ username: res.user.username, token: res.token })
      }
    }catch(err){
      alert(err.response?.data?.message || 'Error')
    }
  }

  return (
    <div className="auth">
      <h3>{mode==='login'? 'Iniciar sesión' : 'Registro'}</h3>
      <form onSubmit={handleSubmit}>
        <input value={username} onChange={e=>setUsername(e.target.value)} placeholder="usuario" />
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" placeholder="contraseña" />
        <button type="submit">{mode==='login'? 'Entrar' : 'Crear cuenta'}</button>
      </form>
      <p>
        {mode==='login' ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
        <button onClick={()=>setMode(mode==='login'?'register':'login')}>{mode==='login'?'Registrarse':'Ir a login'}</button>
      </p>
    </div>
  )
}
