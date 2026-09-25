'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../supabase'

const eventosMock = [
  { id: 1, title: 'Noite Neon', type: 'Festa / Balada', music: ['Eletrónica', 'Pop'], city: 'Uberlândia, MG', date: '25 SET', dow: 'SEX', time: '23:00', price: 'R$ 60', priceNum: 60, place: 'Arena Central', match: 96, age: '18+', cover: 'bg-gradient-to-br from-[#7b35ff] via-[#b224ef] to-[#ff0844]', desc: 'A casa mais lendária da cena eletrónica de Uberlândia. Line-up pesado com DJs convidados, luzes neon e pista insana até ao amanhecer.' },
  { id: 2, title: 'Festival Sons do Cerrado', type: 'Show / Música', music: ['Rock', 'Indie'], city: 'Uberlândia, MG', date: '26 SET', dow: 'SÁB', time: '16:00', price: 'R$ 80', priceNum: 80, place: 'Parque do Sabiá', match: 89, age: '18+', cover: 'bg-gradient-to-br from-[#f83600] to-[#f9d423]', desc: 'Um palco aberto com as melhores bandas independentes de Rock e Indie. Experiência ao ar livre incrível.' },
  { id: 3, title: 'Sabores da Cidade', type: 'Gastronomia', music: ['MPB'], city: 'Uberlândia, MG', date: '27 SET', dow: 'DOM', time: '12:00', price: 'R$ 30', priceNum: 30, place: 'Mercado Municipal', match: 84, age: 'Livre', cover: 'bg-gradient-to-br from-[#ff4d96] to-[#f13c91]', desc: 'Feira gastronómica com os melhores produtores locais. Comida boa, música ao vivo e clima descontraído para o domingo.' },
  { id: 4, title: 'Cinema + Debate', type: 'Cinema', music: ['Outro'], city: 'Uberlândia, MG', date: '28 SET', dow: 'SEG', time: '19:30', price: 'R$ 20', priceNum: 20, place: 'Cine Cultura', match: 78, age: 'Livre', cover: 'bg-gradient-to-br from-[#4facfe] to-[#00f2fe]', desc: 'Sessão especial de cinema clássico seguida de um debate aberto com diretores convidados.' },
  { id: 5, title: 'Piquenique no Parque', type: 'Ao ar livre', music: ['Sertanejo', 'MPB'], city: 'Uberlândia, MG', date: '29 SET', dow: 'TER', time: '15:00', price: 'Grátis', priceNum: 0, place: 'Parque do Sabiá', match: 92, age: 'Livre', cover: 'bg-gradient-to-br from-[#0ba360] to-[#3cba92]', desc: 'Traga a sua toalha e o seu lanche. Tarde agradável com música acústica ao vivo e entrada gratuita.' },
]

export default function HomeScreen() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [perfil, setPerfil] = useState<any>(null)
  const [favoritos, setFavoritos] = useState<number[]>([])
  const [abaAtiva, setAbaAtiva] = useState('descobrir')
  
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [eventoSelecionado, setEventoSelecionado] = useState<any>(null)

  const [filtroTipos, setFiltroTipos] = useState<string[]>([])
  const [filtroMusicas, setFiltroMusicas] = useState<string[]>([])
  const [filtroPrecoMax, setFiltroPrecoMax] = useState(1000)

  const estilosMusica = ['Pop', 'Rock', 'Eletrónica', 'Hip Hop', 'Sertanejo', 'MPB', 'Indie', 'Funk', 'Outro']
  const tiposRole = ['Festa / Balada', 'Cinema', 'Show / Música', 'Evento', 'Exposição', 'Teatro', 'Gastronomia', 'Ao ar livre', 'Outro']

  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      const { data } = await supabase.from('perfis').select('*').eq('id', session.user.id).single()
      if (data) {
        setPerfil(data)
        setFavoritos(data.favoritos || [])
      }
      setLoading(false)
    }
    loadData()
  }, [router])

  const toggleFavorito = async (eventoId: number) => {
    if (!perfil) return
    const isFavorito = favoritos.includes(eventoId)
    const novosFavoritos = isFavorito ? favoritos.filter(id => id !== eventoId) : [...favoritos, eventoId]
    setFavoritos(novosFavoritos)
    await supabase.from('perfis').update({ favoritos: novosFavoritos }).eq('id', perfil.id)
  }

  const toggleArraySelection = (item: string, list: string[], setList: (val: string[]) => void) => {
    list.includes(item) ? setList(list.filter(i => i !== item)) : setList([...list, item])
  }

  const eventosFiltrados = eventosMock.filter(evento => {
    const matchPreco = evento.priceNum <= filtroPrecoMax
    const matchTipo = filtroTipos.length === 0 || filtroTipos.includes(evento.type)
    const matchMusica = filtroMusicas.length === 0 || evento.music.some(m => filtroMusicas.includes(m))
    return matchPreco && matchTipo && matchMusica
  })

  const eventosFavoritos = eventosMock.filter(evento => favoritos.includes(evento.id))

  if (loading) return <main className="min-h-screen bg-[#07070d]"></main>

  return (
    <main className="min-h-screen bg-[#07070d] text-[#f7f5ff] pb-24">
      {/* CABEÇALHO */}
      <header className="px-6 py-4 border-b border-[#1d1d28] flex justify-between items-center sticky top-0 bg-[#07070d]/90 backdrop-blur-md z-10">
        <div className="flex items-center gap-2 font-extrabold text-xl">
          <img src="/icon.png" alt="Ícone RolêMatch" className="w-7 h-7 rounded-md object-cover" />
          Rolê<span className="text-[#7b35ff]">Match</span>
        </div>
        <div className="flex gap-3 items-center">
          <span className="flex items-center gap-1 text-xs bg-[#11111a] border border-[#292936] px-3 py-1.5 rounded-full text-[#c7c3d0]">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            {perfil?.cidade || 'Brasil'}
          </span>
          <div className="w-8 h-8 rounded-lg bg-[#7b35ff] flex items-center justify-center font-bold">
            {perfil?.nome ? perfil.nome.charAt(0).toUpperCase() : 'R'}
          </div>
        </div>
      </header>

      <div className="p-6 max-w-4xl mx-auto">
        
        {/* ABA: DESCOBRIR */}
        {abaAtiva === 'descobrir' && (
          <div className="animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-1">Olá, {perfil?.nome}!</h1>
            <p className="text-[#9c99aa] text-sm mb-6">Confira os rolês baseados nos seus filtros.</p>

            <button 
              onClick={() => setIsFilterModalOpen(true)}
              className="w-full mb-6 flex items-center justify-between p-4 rounded-xl bg-[#11111a] border border-[#292936] hover:border-[#7b35ff] transition-colors"
            >
              <div className="text-left">
                <h2 className="font-bold text-[#f7f5ff]">Filtros de Rolê</h2>
                <span className="text-sm text-[#9c99aa]">
                  {filtroTipos.length || filtroMusicas.length || filtroPrecoMax !== 1000 ? 'Filtros ativos' : 'Toque para personalizar a sua busca'}
                </span>
              </div>
              <span className="text-[#9c99aa]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
              </span>
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {eventosFiltrados.length > 0 ? (
                eventosFiltrados.map((evento) => (
                  <article 
                    key={evento.id} 
                    onClick={() => setEventoSelecionado(evento)}
                    className="cursor-pointer bg-[#0f0f18] border border-[#292936] rounded-2xl overflow-hidden hover:border-[#4a4059] transition-colors shadow-lg"
                  >
                    <div className={`h-40 relative opacity-90 hover:opacity-100 transition-opacity ${evento.cover}`}>
                      <div className="absolute left-3 top-3 bg-[#08080d]/80 rounded-xl px-2 py-1 text-center backdrop-blur-md border border-white/20">
                        <b className="block text-lg leading-tight">{evento.date.split(' ')[0]}</b>
                        <span className="text-[10px] leading-tight">{evento.date.split(' ')[1]}</span>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorito(evento.id); }}
                        className={`absolute right-3 top-3 w-9 h-9 rounded-full border border-white/20 flex items-center justify-center backdrop-blur-md transition-colors ${favoritos.includes(evento.id) ? 'bg-[#f7f5ff] text-[#f13c91]' : 'bg-[#08080d]/80 text-white hover:bg-white/20'}`}
                      >
                        {favoritos.includes(evento.id) ? '♥' : '♡'}
                      </button>
                    </div>
                    <div className="p-4">
                      <div className="text-[11px] text-[#b878ff] font-bold mb-1">{evento.type}</div>
                      <h3 className="text-lg font-bold mb-2">{evento.title}</h3>
                      <div className="text-[11px] text-[#9c99aa] flex flex-col gap-1.5">
                        <span className="flex items-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                          {evento.place}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                          {evento.time} • {evento.price}
                        </span>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="col-span-full p-8 text-center text-[#9c99aa] bg-[#11111a] border border-[#292936] rounded-2xl">
                  Nenhum rolê atende aos filtros selecionados.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA: FAVORITOS */}
        {abaAtiva === 'favoritos' && (
          <div className="animate-in fade-in duration-300">
            <h1 className="text-3xl font-extrabold mb-1">Seus Favoritos ♥</h1>
            <p className="text-[#9c99aa] text-sm mb-6">Rolês que você guardou para não esquecer.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {eventosFavoritos.length > 0 ? (
                eventosFavoritos.map((evento) => (
                  <article 
                    key={evento.id} 
                    onClick={() => setEventoSelecionado(evento)}
                    className="cursor-pointer bg-[#0f0f18] border border-[#292936] rounded-2xl overflow-hidden hover:border-[#4a4059] flex items-center p-3 gap-4"
                  >
                     <div className={`w-20 h-24 rounded-xl ${evento.cover} opacity-90 flex-shrink-0`}></div>
                     <div className="flex-1">
                        <div className="text-[11px] text-[#b878ff] font-bold mb-1">{evento.type}</div>
                        <h3 className="text-lg font-bold mb-2">{evento.title}</h3>
                        <p className="flex items-center gap-1.5 text-[11px] text-[#9c99aa] mb-2">
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                          {evento.date} • {evento.time}
                        </p>
                        <button 
                          onClick={(e) => { e.stopPropagation(); toggleFavorito(evento.id); }} 
                          className="text-xs text-[#f13c91] border border-[#f13c91]/30 px-3 py-1.5 rounded-lg hover:bg-[#f13c91]/10 transition-colors"
                        >
                          Remover
                        </button>
                      </div>
                  </article>
                ))
              ) : (
                <div className="col-span-full p-8 text-center text-[#9c99aa] bg-[#11111a] border border-[#292936] rounded-2xl">
                  Ainda não guardou nenhum rolê. Volte para Descobrir!
                </div>
              )}
            </div>
          </div>
        )}

        {/* ABA: CALENDÁRIO */}
        {abaAtiva === 'calendario' && (
          <div className="animate-in fade-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-extrabold">Calendário</h1>
              <span className="text-[#9c99aa]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
              </span>
            </div>

            <div className="flex justify-between items-center mb-6 px-2">
              <button className="text-[#9c99aa] hover:text-white text-xl px-2">{'<'}</button>
              <span className="font-bold text-[15px]">Setembro 2026</span>
              <button className="text-[#9c99aa] hover:text-white text-xl px-2">{'>'}</button>
            </div>

            <div className="grid grid-cols-7 text-center text-[#9c99aa] text-[10px] font-bold mb-4">
              <span>D</span><span>S</span><span>T</span><span>Q</span><span>Q</span><span>S</span><span>S</span>
            </div>

            <div className="grid grid-cols-7 text-center gap-y-4 text-xs font-bold mb-10">
              <span className="text-[#9c99aa]/30 pt-2">30</span>
              <span className="text-[#9c99aa]/30 pt-2">31</span>
              {Array.from({length: 30}, (_, i) => {
                 const day = i + 1;
                 const isEvento = eventosFavoritos.some(e => e.date.startsWith(day.toString()));
                 return (
                   <div key={day} className="flex justify-center items-center h-8">
                     <span className={`w-8 h-8 flex items-center justify-center rounded-full ${isEvento ? 'bg-gradient-to-br from-[#7b35ff] to-[#f13c91] text-white shadow-[0_0_15px_rgba(124,60,255,0.4)]' : 'text-[#f7f5ff]'}`}>
                       {day}
                     </span>
                   </div>
                 )
              })}
            </div>

            <h2 className="text-lg font-bold mb-4">Próximos rolês</h2>
            <div className="flex flex-col gap-4">
              {eventosFavoritos.length > 0 ? (
                eventosFavoritos.map(evento => {
                  const [day, month] = evento.date.split(' ');
                  return (
                    <div 
                      key={evento.id} 
                      className="flex gap-3 cursor-pointer group"
                      onClick={() => setEventoSelecionado(evento)}
                    >
                      <div className="flex flex-col items-center justify-center w-14 bg-[#11111a] border border-[#292936] rounded-2xl p-2 h-[96px] group-hover:border-[#4a4059] transition-colors">
                        <span className="text-[9px] text-[#9c99aa] font-bold tracking-wider">{evento.dow}</span>
                        <span className="text-xl text-white font-extrabold leading-tight my-0.5">{day}</span>
                        <span className="text-[9px] text-[#9c99aa] font-bold tracking-wider">{month}</span>
                      </div>
                      
                      <div className="flex-1 bg-[#11111a] border border-[#292936] rounded-2xl p-3 flex gap-4 items-center group-hover:border-[#4a4059] transition-colors">
                        <div className={`w-16 h-16 rounded-xl ${evento.cover} opacity-90 flex-shrink-0`}></div>
                        <div className="flex flex-col">
                          <h3 className="font-bold text-white text-sm mb-1">{evento.title}</h3>
                          <p className="text-[10px] text-[#9c99aa] mb-1">{evento.time} • {evento.place}</p>
                          <p className="text-[10px] text-[#9c99aa]">{evento.price}</p>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-6 text-center text-[#9c99aa] bg-[#11111a] border border-[#292936] rounded-2xl text-sm">
                  O seu calendário está livre. Guarde os eventos que desejar na aba Descobrir para organizá-los aqui!
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* MODAL: DETALHES DO EVENTO */}
      {eventoSelecionado && (
        <div className="fixed inset-0 bg-[#07070d]/90 backdrop-blur-md z-[60] flex items-end sm:items-center justify-center p-4">
          <div className="bg-[#0c0c14] border border-[#282834] w-full max-w-md p-6 rounded-3xl max-h-[90vh] overflow-y-auto relative animate-in slide-in-from-bottom-8 duration-300">
            <button 
              onClick={() => setEventoSelecionado(null)}
              className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center rounded-full bg-[#11111a] border border-[#292936] text-white hover:bg-[#292936] z-10"
            >
              {'<'}
            </button>
            
            <div className={`-mx-6 -mt-6 h-48 ${eventoSelecionado.cover} opacity-80 rounded-t-3xl mb-6 relative`}>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c14] to-transparent"></div>
            </div>

            <div className="-mt-16 relative z-10">
              <div className="text-xs text-[#b878ff] font-bold mb-2">{eventoSelecionado.type}</div>
              <h2 className="text-3xl font-extrabold mb-6">{eventoSelecionado.title}</h2>

              <div className="space-y-4 text-sm text-[#9c99aa] mb-8 bg-[#11111a] border border-[#292936] p-4 rounded-xl">
                <p className="flex items-start gap-3">
                  <span className="mt-0.5">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </span> 
                  <span><strong className="text-white">Local:</strong> {eventoSelecionado.place} <br/> {eventoSelecionado.city}</span>
                </p>
                <p className="flex items-center gap-3">
                  <span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                  </span> 
                  <span><strong className="text-white">Horário:</strong> {eventoSelecionado.time} • {eventoSelecionado.date}</span>
                </p>
                <p className="flex items-center gap-3">
                  <span>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                  </span> 
                  <span><strong className="text-white">Entrada:</strong> {eventoSelecionado.price}</span>
                </p>
              </div>

              <div className="mb-8">
                <h3 className="font-bold text-white mb-2">Sobre o rolê</h3>
                <p className="text-sm text-[#9c99aa] leading-relaxed">
                  {eventoSelecionado.desc}
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => { alert('Ingresso garantido! Nos vemos no rolê.'); setEventoSelecionado(null); }}
                  className="w-full bg-[#7b35ff] hover:bg-[#6223d6] text-white font-bold py-4 rounded-xl transition-colors shadow-[0_12px_35px_rgba(124,60,255,0.25)]"
                >
                  Quero ir!
                </button>
                <button 
                  onClick={() => toggleFavorito(eventoSelecionado.id)}
                  className="w-full bg-transparent border border-[#7b35ff] hover:bg-[#7b35ff]/10 text-[#b878ff] font-bold py-4 rounded-xl transition-colors"
                >
                  {favoritos.includes(eventoSelecionado.id) ? '♥ Remover dos favoritos' : '♡ Salvar nos favoritos'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE FILTROS */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-[#07070d]/90 backdrop-blur-md z-50 flex items-end sm:items-center justify-center">
          <div className="bg-[#0c0c14] border border-[#282834] w-full max-w-md p-6 rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-extrabold">Filtros de Rolê</h2>
              <button onClick={() => setIsFilterModalOpen(false)} className="text-[#9c99aa] text-lg font-bold">✕</button>
            </div>

            <div className="flex flex-col gap-6">
              <div>
                <label className="block text-sm font-bold mb-3">Que tipo de rolê procura?</label>
                <div className="grid grid-cols-3 gap-2">
                  {tiposRole.map(role => (
                    <button 
                      key={role} onClick={() => toggleArraySelection(role, filtroTipos, setFiltroTipos)}
                      className={`p-2 rounded-lg text-xs font-bold border transition-colors ${filtroTipos.includes(role) ? 'bg-[#7b35ff] border-[#9d61ff] text-white' : 'bg-[#11111a] border-[#292936] text-[#9c99aa]'}`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-3">Estilo de música</label>
                <div className="grid grid-cols-3 gap-2">
                  {estilosMusica.map(estilo => (
                    <button 
                      key={estilo} onClick={() => toggleArraySelection(estilo, filtroMusicas, setFiltroMusicas)}
                      className={`p-2 rounded-lg text-xs font-bold border transition-colors ${filtroMusicas.includes(estilo) ? 'bg-[#7b35ff] border-[#9d61ff] text-white' : 'bg-[#11111a] border-[#292936] text-[#9c99aa]'}`}
                    >
                      {estilo}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold mb-3">Orçamento Máximo</label>
                <div className="flex flex-wrap gap-2">
                  {[0, 30, 80, 1000].map(val => (
                    <button 
                      key={val} onClick={() => setFiltroPrecoMax(val)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold border ${filtroPrecoMax === val ? 'bg-[#7b35ff] border-[#9d61ff] text-white' : 'bg-[#11111a] border-[#292936] text-[#9c99aa]'}`}
                    >
                      {val === 0 ? 'Grátis' : val === 1000 ? 'Qualquer valor' : `Até R$ ${val}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button onClick={() => setIsFilterModalOpen(false)} className="w-full mt-8 bg-[#7b35ff] text-white font-bold py-4 rounded-xl hover:bg-[#6223d6]">
              Ver Resultados
            </button>
          </div>
        </div>
      )}

      {/* MENU INFERIOR FIXO */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-md bg-[#0c0c14] border border-[#302d39] rounded-2xl h-16 flex justify-around items-center z-40">
        <button onClick={() => setAbaAtiva('descobrir')} className={`text-sm flex flex-col items-center gap-1 ${abaAtiva === 'descobrir' ? 'text-[#c06cff]' : 'text-[#777482]'}`}>
          <span className="text-xl leading-none">⌂</span><span className="text-[10px]">Descobrir</span>
        </button>
        <button onClick={() => setAbaAtiva('calendario')} className={`text-sm flex flex-col items-center gap-1 ${abaAtiva === 'calendario' ? 'text-[#c06cff]' : 'text-[#777482]'}`}>
          <span className="text-xl leading-none">□</span><span className="text-[10px]">Calendário</span>
        </button>
        <button onClick={() => setAbaAtiva('favoritos')} className={`text-sm flex flex-col items-center gap-1 ${abaAtiva === 'favoritos' ? 'text-[#c06cff]' : 'text-[#777482]'}`}>
          <span className="text-xl leading-none">♡</span><span className="text-[10px]">Favoritos</span>
        </button>
        <button onClick={() => supabase.auth.signOut().then(() => router.push('/login'))} className="text-sm flex flex-col items-center gap-1 text-[#777482]">
          <span className="text-xl leading-none">♙</span><span className="text-[10px]">Sair</span>
        </button>
      </nav>
    </main>
  )
}