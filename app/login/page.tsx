'use client'
import { useState } from 'react'
import { supabase } from '../../supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('A entrar...')
    
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Sessão iniciada! A redirecionar...')
      router.push('/home')
    }
  }

  return (
    <main className="min-h-screen bg-[#07070d] text-[#f7f5ff] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#0c0c14] border border-[#282834] rounded-[30px] p-8 shadow-2xl">
        <h1 className="text-3xl font-extrabold mb-2">Bem-vindo de volta.</h1>
        <p className="text-[#9c99aa] text-sm mb-8">Entre com o seu e-mail para ver os seus matches.</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-bold mb-2">E-mail</label>
            <input 
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#11111a] border border-[#30303c] text-white rounded-xl p-4 outline-none focus:border-[#8247ff]"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-2">Palavra-passe</label>
            <input 
              type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#11111a] border border-[#30303c] text-white rounded-xl p-4 outline-none focus:border-[#8247ff]"
              required
            />
          </div>
          <button type="submit" className="w-full mt-4 bg-gradient-to-r from-[#7b35ff] to-[#f13c91] text-white font-bold py-4 rounded-xl hover:opacity-90 transition-opacity">
            Entrar no RolêMatch →
          </button>
        </form>

        {message && <div className="mt-4 p-3 text-center text-[#d3a8ff] bg-[#7c3cff15] rounded-lg">{message}</div>}

        <Link href="/cadastro" className="block text-center mt-6 text-sm text-[#9c99aa] hover:text-white transition-colors">
          Ainda não tem conta? Criar uma
        </Link>
      </div>
    </main>
  )
}