import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { 
  IconUsers, IconSchool, IconBook, IconNotes, 
  IconCalendar, IconParent, IconTeacher, IconWallet,
  IconSearch, IconBell
} from '../components/Icons'

export default function Dashboard() {
  const [stats, setStats] = useState({
    eleves: 0, filieres: 0, classes: 0, notes: 0, 
    parents: 0, professeurs: 0, absencesJour: 0,
    impayes: 0, moyenneEcole: 0
  })

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eleves, filieres, classes, notes, parents, profs, absences, paiements] = await Promise.all([
          api.get('utilisateurs/?role=eleve'),
          api.get('filieres/'),
          api.get('classes/'),
          api.get('notes/'),
          api.get('utilisateurs/?role=parent'),
          api.get('utilisateurs/?role=enseignant'),
          api.get('absences/'), // Filtrage par date aujourd'hui à faire
          api.get('paiements/?statut=en_attente'),
        ])
        
        // Calcul moyenne école (exemple)
        const notesData = notes.data.results || []
        const avg = notesData.length > 0 
          ? (notesData.reduce((acc, curr) => acc + Number(curr.note), 0) / notesData.length).toFixed(2)
          : 0

        setStats({
          eleves: eleves.data.count,
          filieres: filieres.data.count,
          classes: classes.data.count,
          notes: notes.data.count,
          parents: parents.data.count,
          professeurs: profs.data.count,
          absencesJour: absences.data.count, // Simplifié pour l'exemple
          impayes: paiements.data.count,
          moyenneEcole: avg
        })
      } catch (err) {
        console.error(err)
      }
    }
    fetchStats()
  }, [])

  const cards = [
    { label: 'Élèves', value: stats.eleves, icon: <IconUsers />, color: 'from-blue-600 to-blue-400', path: '/eleves' },
    { label: 'Parents', value: stats.parents, icon: <IconParent />, color: 'from-orange-600 to-orange-400', path: '/parents' },
    { label: 'Professeurs', value: stats.professeurs, icon: <IconTeacher />, color: 'from-emerald-600 to-emerald-400', path: '/professeurs' },
    { label: 'Classes', value: stats.classes, icon: <IconBook />, color: 'from-sky-600 to-sky-400', path: '/classes' },
    { label: 'Absences Jour', value: stats.absencesJour, icon: <IconCalendar />, color: 'from-rose-600 to-rose-400', path: '/absences' },
    { label: 'Impayés', value: stats.impayes, icon: <IconWallet />, color: 'from-amber-600 to-amber-400', path: '/paiements' },
    { label: 'Moyenne École', value: stats.moyenneEcole, icon: <IconNotes />, color: 'from-indigo-600 to-indigo-400', path: '/notes' },
    { label: 'Filières', value: stats.filieres, icon: <IconSchool />, color: 'from-violet-600 to-violet-400', path: '/filieres' },
  ]

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP BAR PREMIUM */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0 z-10 shadow-sm">
           <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 w-96 group focus-within:border-blue-400 focus-within:bg-white transition-all">
              <span className="text-slate-400 group-focus-within:text-blue-500"><IconSearch /></span>
              <input type="text" placeholder="Recherche globale (élève, prof, classe...)" className="bg-transparent border-none outline-none text-sm w-full font-medium" />
           </div>

           <div className="flex items-center gap-6">
              <button className="relative p-2.5 bg-slate-50 rounded-xl text-slate-500 hover:bg-blue-50 hover:text-blue-600 transition-all group">
                 <IconBell />
                 <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
              
              <div className="h-10 w-px bg-slate-100 mx-2"></div>
              
              <div className="flex items-center gap-3 pl-2">
                 <div className="text-right hidden sm:block">
                    <p className="text-xs font-black text-slate-800 leading-tight">Admin Principal</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Connecté</p>
                 </div>
                 <div className="w-11 h-11 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-blue-100 border-2 border-white cursor-pointer hover:scale-105 transition-transform">
                    AD
                 </div>
              </div>
           </div>
        </header>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-10 scrollbar-hide">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Vue d'ensemble</h1>
            <p className="text-slate-400 font-medium mt-1 text-sm">Contrôle centralisé de l'établissement</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cards.map((card) => (
              <Link 
                to={card.path} 
                key={card.label} 
                className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 hover:shadow-xl hover:border-blue-200 transition-all group overflow-hidden relative"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${card.color} opacity-5 rounded-bl-[4rem] group-hover:scale-110 transition-transform`}></div>
                <div className="flex justify-between items-start mb-6">
                  <div className={`bg-gradient-to-br ${card.color} text-white p-4 rounded-2xl shadow-lg transform group-hover:-translate-y-1 transition-transform`}>
                    {card.icon}
                  </div>
                  <span className="text-[10px] font-black text-slate-300 group-hover:text-blue-500 transition-colors">VOIR</span>
                </div>
                <div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{card.label}</p>
                  <p className="text-4xl font-black text-slate-800 tracking-tighter">{card.value}</p>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* NOTIFICATIONS INTELLIGENTES */}
             <div className="lg:col-span-1 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col">
                <h2 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                   🔔 Alertes Système
                </h2>
                <div className="space-y-4 overflow-y-auto max-h-[400px] pr-2">
                   <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
                      <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest">Finance</p>
                      <p className="text-sm font-bold text-slate-700 mt-1">12 paiements en retard détectés</p>
                   </div>
                   <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl">
                      <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest">Absences</p>
                      <p className="text-sm font-bold text-slate-700 mt-1">Pic d'absences en 3ème A (+15%)</p>
                   </div>
                   <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
                      <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">RH</p>
                      <p className="text-sm font-bold text-slate-700 mt-1">2 classes sans professeur principal</p>
                   </div>
                </div>
             </div>

             {/* GRAPHIQUES FAKE (EN ATTENDANT RECHARTS) */}
             <div className="lg:col-span-2 bg-[#0F172A] p-10 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden flex flex-col justify-center min-h-[400px]">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                <h2 className="text-2xl font-black mb-2 italic">Performances Académiques</h2>
                <p className="text-slate-400 text-sm mb-8 font-medium">Evolution globale des moyennes trimestrielles</p>
                
                {/* CSS CHART PLACEHOLDER */}
                <div className="flex items-end justify-between gap-4 h-48 px-4 border-b border-slate-800">
                   <div className="w-full bg-blue-500/40 rounded-t-xl hover:bg-blue-500 transition-all cursor-pointer" style={{height: '60%'}}></div>
                   <div className="w-full bg-indigo-500/40 rounded-t-xl hover:bg-indigo-500 transition-all cursor-pointer" style={{height: '75%'}}></div>
                   <div className="w-full bg-sky-500/40 rounded-t-xl hover:bg-sky-500 transition-all cursor-pointer" style={{height: '65%'}}></div>
                   <div className="w-full bg-violet-500/40 rounded-t-xl hover:bg-violet-500 transition-all cursor-pointer" style={{height: '85%'}}></div>
                   <div className="w-full bg-rose-500/40 rounded-t-xl hover:bg-rose-500 transition-all cursor-pointer" style={{height: '90%'}}></div>
                </div>
                <div className="flex justify-between mt-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                   <span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Fev</span>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}