import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { fetchAllPaginated } from '../api/pagination'
import { IconUsers, IconNotes, IconCalendar, IconWallet } from '../components/Icons'

export default function EspaceParent() {
  const [enfants, setEnfants] = useState([])
  const [selectedEnfantId, setSelectedEnfantId] = useState(null)
  const [data, setData] = useState({ notes: [], absences: [], paiements: [] })
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  // Filtres
  const [searchNote, setSearchNote] = useState('')
  const [searchAbsence, setSearchAbsence] = useState('')
  const [searchPaiement, setSearchPaiement] = useState('')

  useEffect(() => {
    const fetchEnfants = async () => {
      try {
        const res = await api.get('utilisateurs/?parent=me')
        setEnfants(res.data.results)
        if (res.data.results.length > 0) {
          setSelectedEnfantId(res.data.results[0].id)
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des enfants:", err)
      }
    }
    fetchEnfants()
  }, [])

  useEffect(() => {
    if (!selectedEnfantId) return
    const fetchData = async () => {
      setLoading(true)
      try {
        // Dans une version réelle, on pourrait filtrer par ?utilisateur=selectedEnfantId
        // Mais comme on a déjà filtré par parent dans le backend, on reçoit toutes les données
        // On va filtrer localement pour plus de réactivité ou ajuster l'API
        const [n, a, p] = await Promise.all([
          fetchAllPaginated(api, 'notes/'),
          fetchAllPaginated(api, 'absences/'),
          fetchAllPaginated(api, 'paiements/'),
        ])
        
        // On filtre pour ne garder que les données de l'enfant sélectionné
        setData({ 
          notes: n.results.filter(x => x.utilisateur === selectedEnfantId), 
          absences: a.results.filter(x => x.utilisateur === selectedEnfantId), 
          paiements: p.results.filter(x => x.utilisateur === selectedEnfantId) 
        })
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [selectedEnfantId])

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  // Logique de filtrage par recherche
  const filteredNotes = data.notes.filter(n => n.matiere_nom?.toLowerCase().includes(searchNote.toLowerCase()))
  const filteredAbsences = data.absences.filter(a => a.date?.includes(searchAbsence))
  const filteredPaiements = data.paiements.filter(p => p.type_display?.toLowerCase().includes(searchPaiement.toLowerCase()))

  const moyenneChild = filteredNotes.length > 0 
    ? (filteredNotes.reduce((acc, curr) => acc + Number(curr.note), 0) / filteredNotes.length).toFixed(2)
    : '—'

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <nav className="bg-[#0F172A] text-white px-8 py-6 flex justify-between items-center shadow-xl sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
             <IconUsers />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">Espace Famille</h1>
            <p className="text-slate-400 text-sm font-medium">Suivi de vos enfants</p>
          </div>
        </div>
        <button onClick={handleLogout} className="bg-rose-500/80 hover:bg-rose-500 px-6 py-2.5 rounded-xl text-sm font-bold transition-all">
          Déconnexion
        </button>
      </nav>

      <div className="p-8 max-w-7xl mx-auto space-y-8">
        
        {/* Sélecteur d'enfant */}
        <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
           <span className="text-slate-400 text-xs font-black uppercase tracking-widest">Enfant sélectionné :</span>
           <div className="flex gap-2">
              {enfants.map(e => (
                <button 
                  key={e.id}
                  onClick={() => setSelectedEnfantId(e.id)}
                  className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${selectedEnfantId === e.id ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
                >
                  {e.first_name} {e.last_name}
                </button>
              ))}
              {enfants.length === 0 && <p className="text-slate-400 italic text-sm">Aucun enfant lié à ce compte.</p>}
           </div>
        </div>

        {/* Résumé Statistique */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-indigo-200 transition-colors">
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Moyenne de l'enfant</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-indigo-600">{moyenneChild}</span>
                <span className="text-slate-300 font-bold">/ 20</span>
              </div>
           </div>
           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-orange-200 transition-colors">
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Absences</p>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-orange-500">{data.absences.length}</span>
                <span className="text-slate-300 font-bold text-sm ml-2">enregistrées</span>
              </div>
           </div>
           <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col justify-between group hover:border-emerald-200 transition-colors">
              <p className="text-slate-400 text-xs font-black uppercase tracking-widest mb-2">Solde Scolarité</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-800">
                   {data.paiements.reduce((acc, p) => acc + (p.statut === 'paye' ? p.montant : 0), 0).toLocaleString()}
                </span>
                <span className="text-slate-400 font-bold text-sm ml-1">FCFA payés</span>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Notes */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[500px]">
            <div className="p-6 border-b border-slate-50 bg-indigo-50/20">
              <h3 className="font-black text-slate-800 flex items-center gap-2 mb-4">
                 <IconNotes /> Notes
              </h3>
              <input 
                type="text" 
                placeholder="Chercher matière..." 
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 outline-none"
                value={searchNote}
                onChange={e => setSearchNote(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredNotes.map(n => (
                <div key={n.id} className="p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-indigo-100 transition-all group">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-slate-700 text-sm">{n.matiere_nom}</p>
                    <span className="text-lg font-black text-indigo-600">{n.note}<small className="text-[10px] opacity-40">/20</small></span>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1">{n.date_evaluation}</p>
                </div>
              ))}
              {filteredNotes.length === 0 && <p className="text-center text-slate-400 text-xs mt-10 italic">Aucune note trouvée</p>}
            </div>
          </div>

          {/* Absences */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[500px]">
            <div className="p-6 border-b border-slate-50 bg-orange-50/20">
              <h3 className="font-black text-slate-800 flex items-center gap-2 mb-4">
                 <IconCalendar /> Absences
              </h3>
              <input 
                type="text" 
                placeholder="Filtrer par date..." 
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-orange-500 outline-none"
                value={searchAbsence}
                onChange={e => setSearchAbsence(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredAbsences.map(a => (
                <div key={a.id} className="p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-orange-100 transition-all">
                  <div className="flex justify-between items-center">
                    <p className="font-bold text-slate-700 text-sm">{a.date}</p>
                    <span className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${a.statut === 'absent' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                      {a.statut}
                    </span>
                  </div>
                </div>
              ))}
              {filteredAbsences.length === 0 && <p className="text-center text-slate-400 text-xs mt-10 italic">Aucun résultat</p>}
            </div>
          </div>

          {/* Paiements */}
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden flex flex-col h-[500px]">
            <div className="p-6 border-b border-slate-50 bg-emerald-50/20">
              <h3 className="font-black text-slate-800 flex items-center gap-2 mb-4">
                 <IconWallet /> Finances
              </h3>
              <input 
                type="text" 
                placeholder="Chercher type..." 
                className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                value={searchPaiement}
                onChange={e => setSearchPaiement(e.target.value)}
              />
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredPaiements.map(p => (
                <div key={p.id} className="p-4 bg-slate-50/50 rounded-2xl border border-transparent hover:border-emerald-100 transition-all">
                  <div className="flex justify-between items-start">
                    <div>
                       <p className="font-bold text-slate-700 text-sm">{p.type_display}</p>
                       <p className="text-[10px] text-slate-400">{p.date_paiement}</p>
                    </div>
                    <div className="text-right">
                       <p className="font-black text-slate-800 text-sm">{p.montant.toLocaleString()} <small>FCFA</small></p>
                       <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${p.statut === 'paye' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                         {p.statut_display}
                       </span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredPaiements.length === 0 && <p className="text-center text-slate-400 text-xs mt-10 italic">Aucun résultat</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
