'use client'
import { useState } from 'react'
import { supabase } from '../../supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function CadastroPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [idade, setIdade] = useState('')
  const [cidade, setCidade] = useState('')
  const [message, setMessage] = useState('')

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('A criar a sua conta...')
    
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setMessage(error.message)
      return
    }

    if (data.user) {
      const { error: dbError } = await supabase.from('perfis').insert([{ 
        id: data.user.id, 
        nome: nome,
        idade: parseInt(idade), // Converte para número inteiro, corrigindo o erro do banco
        cidade: cidade
      }])

      if (dbError) {
        setMessage(dbError.message)
      } else {
        router.push('/home')
      }
    }
  }

  return (
    <main className="min-h-screen bg-[#07070d] text-[#f7f5ff] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-[#0c0c14] border border-[#282834] rounded-[30px] p-8 shadow-2xl relative">
        {step === 2 && (
          <button onClick={() => setStep(1)} className="absolute top-6 left-6 text-xl text-[#9c99aa] hover:text-white">{'<'}</button>
        )}
        
        <div className="pt-4">
          <h1 className="text-3xl font-extrabold mb-2">
            {step === 1 ? 'Crie a sua conta.' : 'Vamos conhecer-te melhor!'}
          </h1>
          <p className="text-[#9c99aa] text-sm mb-8">
            {step === 1 ? 'Comece pelo básico para guardar os seus favoritos.' : 'Responda rapidinho para encontrarmos os melhores rolês.'}
          </p>

          {step === 1 ? (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="flex flex-col gap-4">
              <input 
                type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="E-mail"
                className="w-full bg-[#11111a] border border-[#30303c] text-white rounded-xl p-4 outline-none focus:border-[#7b35ff]" required
              />
              <input 
                type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Palavra-passe"
                className="w-full bg-[#11111a] border border-[#30303c] text-white rounded-xl p-4 outline-none focus:border-[#7b35ff]" required
              />
              <button type="submit" className="w-full mt-4 bg-[#7b35ff] text-white font-bold py-4 rounded-xl hover:opacity-90">
                Continuar
              </button>
            </form>
          ) : (
            <form onSubmit={handleCadastro} className="flex flex-col gap-4">
              <input 
                type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Como te podemos chamar?"
                className="w-full bg-[#11111a] border border-[#30303c] text-white rounded-xl p-4 outline-none focus:border-[#7b35ff]" required
              />
              <div className="flex gap-4">
                <input 
                  type="number" value={idade} onChange={(e) => setIdade(e.target.value)} placeholder="Idade (ex: 20)"
                  className="w-1/3 bg-[#11111a] border border-[#30303c] text-white rounded-xl p-4 outline-none focus:border-[#7b35ff]" required
                />
                <input 
                  type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Cidade (ex: São Paulo, SP)"
                  className="w-2/3 bg-[#11111a] border border-[#30303c] text-white rounded-xl p-4 outline-none focus:border-[#7b35ff]" required
                />
              </div>
              <button type="submit" className="w-full mt-4 bg-[#7b35ff] text-white font-bold py-4 rounded-xl hover:opacity-90">
                Finalizar Registo
              </button>
            </form>
          )}

          {message && <div className="mt-4 p-3 text-center text-[#f13c91] text-sm">{message}</div>}

          {step === 1 && (
            <Link href="/login" className="block text-center mt-6 text-sm text-[#9c99aa] hover:text-white">
              Já tem uma conta? Entrar
            </Link>
          )}
        </div>
      </div>
    </main>
  )
}