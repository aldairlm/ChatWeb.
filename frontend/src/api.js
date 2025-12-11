import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000/api'

export const api = axios.create({ baseURL: API_BASE })

export async function register(username, password){
  const res = await api.post('/auth/register', { username, password });
  return res.data
}

export async function login(username, password){
  const res = await api.post('/auth/login', { username, password });
  return res.data
}

export async function getMessages(){
  const res = await api.get('/messages');
  return res.data
}

export async function getPosts(){
  const res = await api.get('/posts');
  return res.data
}

export async function createPost(token, content){
  return api.post('/posts', { content }, { headers: { Authorization: 'Bearer '+token } })
}

export async function reactPost(token, postId){
  return api.post(`/posts/${postId}/react`, null, { headers: { Authorization: 'Bearer '+token } })
}

export async function commentPost(token, postId, content){
  return api.post(`/posts/${postId}/comments`, { content }, { headers: { Authorization: 'Bearer '+token } })
}
