'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../supabase'

export default function RootPage() {
  const router = useRouter()

  useEffect(() => {
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        // Se tem sessão, vai para a sua nova pasta separada
        router.push('/home')
      } else {
        // Se não tem, vai para o login
        router.push('/login')
      }
    }
    
    checkUser()
  }, [router])

  // Um ecrã de carregamento minimalista enquanto decide para onde enviar o utilizador
  return (
    <main className="min-h-screen bg-[#07070d] flex items-center justify-center text-[#f7f5ff]">
      <div className="animate-pulse flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7b35ff] to-[#f13c91] flex items-center justify-center font-bold text-white">
          RM
        </div>
        <span className="text-sm text-[#9c99aa]">A carregar o RolêMatch...</span>
      </div>
    </main>
  )
}