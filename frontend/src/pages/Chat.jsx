import React, { useEffect, useState, useRef } from 'react'
import { getMessages, getPosts, createPost, reactPost, commentPost } from '../api'
import { io } from 'socket.io-client'

export default function Chat({ user, onLogout }){
  const [messages, setMessages] = useState([])
  const [posts, setPosts] = useState([])
  const [postContent, setPostContent] = useState('')
  const socketRef = useRef(null)
  const msgRef = useRef(null)

  useEffect(()=>{
    async function load(){
      const msgs = await getMessages();
      setMessages(msgs || [])
      const ps = await getPosts();
      setPosts(ps || [])
    }
    load();

    const s = io('http://localhost:4000', { auth: { token: user.token }})
    socketRef.current = s
    s.on('chat message', (m)=>{
      setMessages(prev=>[...prev, m])
    })
    return ()=> s.disconnect()
  },[])

  async function handleSend(msg){
    if(!msg) return
    socketRef.current.emit('chat message', { content: msg })
    if(msgRef.current) msgRef.current.value=''
  }

  async function handleCreatePost(){
    if(!postContent) return
    await createPost(user.token, postContent)
    setPostContent('')
    const ps = await getPosts(); setPosts(ps||[])
  }

  async function handleReact(postId){
    await reactPost(user.token, postId)
    const ps = await getPosts(); setPosts(ps||[])
  }

  async function handleComment(postId, content){
    if(!content) return
    await commentPost(user.token, postId, content)
    const ps = await getPosts(); setPosts(ps||[])
  }

  return (
    <div className="chat-page">
      <div className="header">Conectado como <strong>{user.username}</strong> <button onClick={onLogout}>Cerrar sesión</button></div>

      <section className="chat-box">
        <h3>Chat Global</h3>
        <div className="messages">
          {messages.map((m,i)=>(<div key={i} className="msg"><b>{m.user}:</b> {m.content}</div>))}
        </div>
        <div className="send">
          <input ref={msgRef} placeholder="Mensaje..." />
          <button onClick={()=>handleSend(msgRef.current.value)}>Enviar</button>
        </div>
      </section>

      <section className="posts">
        <h3>Publicaciones</h3>
        <textarea value={postContent} onChange={e=>setPostContent(e.target.value)} placeholder="Escribe una publicación" />
        <button onClick={handleCreatePost}>Publicar</button>
        <div className="posts-list">
          {posts.map(p=> (
            <div key={p._id} className="post">
              <div className="post-author">{p.author?.username || 'anon'}</div>
              <div className="post-content">{p.content}</div>
              <div className="post-actions">
                <button onClick={()=>handleReact(p._id)}>Me gusta ({p.reactions?.length||0})</button>
              </div>
              <div className="comments">
                {(p.comments||[]).map(c=> <div key={c._id}><b>{c.author.username}:</b> {c.content}</div>)}
                <CommentBox postId={p._id} onComment={handleComment} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function CommentBox({ postId, onComment }){
  const [text, setText] = useState('')
  return (
    <div className="comment-box">
      <input value={text} onChange={e=>setText(e.target.value)} placeholder="Comentar..." />
      <button onClick={()=>{ onComment(postId, text); setText('') }}>Comentar</button>
    </div>
  )
}
