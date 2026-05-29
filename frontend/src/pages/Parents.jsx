import { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { fetchAllPaginated } from '../api/pagination'
import { IconParent, IconSearch, IconUsers } from '../components/Icons'

export default function Parents() {
  const [parents, setParents] = useState([])
  const [eleves, setEleves] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  
  // State pour l'association
  const [selectedParentId, setSelectedParentId] = useState(null)
  const [selectedEleveId, setSelectedEleveId] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  const fetchAll = async () => {
    try {
      setLoading(true)
      const [resParents, resEleves] = await Promise.all([
        fetchAllPaginated(api, 'utilisateurs/?role=parent'),
        fetchAllPaginated(api, 'utilisateurs/?role=eleve'),
      ])
      setParents(resParents.results)
      setEleves(resEleves.results)
    } catch (err) {
      console.error("Erreur de chargement:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const handleLinkEnfant = async (parentId) => {
    if (!selectedEleveId) return
    setActionLoading(true)
    setErrorMsg('')
    setSuccessMsg('')
    try {
      await api.patch(`utilisateurs/${selectedEleveId}/`, { parent: parentId })
      setSuccessMsg("Liaison parent-élève effectuée avec succès.")
      setSelectedEleveId('')
      setSelectedParentId(null)
      fetchAll() // Recharger la liste
    } catch (err) {
      console.error(err)
      setErrorMsg("Une erreur est survenue lors de la liaison.")
    } finally {
      setActionLoading(false)
    }
  }

  const handleUnlinkEnfant = async (eleveId) => {
    if (!window.confirm("Voulez-vous vraiment détacher cet élève de ce parent ?")) return
    setActionLoading(true)
    setErrorMsg('')
    setSuccessMsg('')
    try {
      await api.patch(`utilisateurs/${eleveId}/`, { parent: null })
      setSuccessMsg("L'élève a été détaché avec succès.")
      fetchAll()
    } catch (err) {
      console.error(err)
      setErrorMsg("Une erreur est survenue lors de la dissociation.")
    } finally {
      setActionLoading(false)
    }
  }

  const filteredParents = parents.filter(p => 
    p.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.last_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.telephone?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Liste des élèves qui ne sont pas déjà associés au parent sélectionné
  const getAvailableEleves = (parentObj) => {
    const parentChildrenIds = parentObj?.enfants?.map(c => c.id) || []
    return eleves.filter(e => !parentChildrenIds.includes(e.id))
  }

  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />

      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 shrink-0 z-10">
          <div className="flex items-center gap-4 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100 w-96 group focus-within:border-blue-400 focus-within:bg-white transition-all">
            <span className="text-slate-400 group-focus-within:text-blue-500"><IconSearch /></span>
            <input 
              type="text" 
              placeholder="Chercher un parent par nom, email ou tél..." 
              className="bg-transparent border-none outline-none text-sm w-full font-medium"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-black text-slate-800 tracking-tight">Espace Parents</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{filteredParents.length} Comptes</p>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-10 space-y-6">
          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-6 py-4 rounded-2xl text-sm font-semibold flex justify-between items-center animate-fade-in">
              <span>{successMsg}</span>
              <button onClick={() => setSuccessMsg('')} className="font-bold">×</button>
            </div>
          )}
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-6 py-4 rounded-2xl text-sm font-semibold flex justify-between items-center animate-fade-in">
              <span>{errorMsg}</span>
              <button onClick={() => setErrorMsg('')} className="font-bold">×</button>
            </div>
          )}

          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Parent</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Élèves associés (enfants)</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                {filteredParents.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center border-2 border-white shadow-sm font-black text-xs">
                          {p.first_name?.[0] || ''}{p.last_name?.[0] || ''}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm">{p.first_name} {p.last_name}</p>
                          <p className="text-[10px] text-slate-400 font-medium">@{p.username}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <p className="text-sm font-bold text-slate-700">{p.telephone || 'Non renseigné'}</p>
                      <p className="text-[10px] text-slate-400 font-medium">{p.email}</p>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex flex-wrap gap-2 items-center">
                        {p.enfants && p.enfants.map((c) => (
                          <div key={c.id} className="bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-2 group/btn">
                            <span>{c.first_name} {c.last_name}</span>
                            <button 
                              type="button" 
                              onClick={() => handleUnlinkEnfant(c.id)}
                              disabled={actionLoading}
                              className="text-slate-400 group-hover/btn:text-rose-600 font-black cursor-pointer"
                              title="Retirer l'élève"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                        {(!p.enfants || p.enfants.length === 0) && (
                          <span className="text-slate-400 italic text-xs">Aucun élève rattaché</span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      {selectedParentId === p.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <select 
                            value={selectedEleveId} 
                            onChange={(e) => setSelectedEleveId(e.target.value)}
                            className="text-xs bg-white border border-slate-200 rounded-xl px-3 py-1.5 focus:ring-2 focus:ring-blue-500 outline-none"
                            required
                          >
                            <option value="">Sélectionner un élève</option>
                            {getAvailableEleves(p).map((e) => (
                              <option key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.classe_nom})</option>
                            ))}
                          </select>
                          <button
                            type="button"
                            onClick={() => handleLinkEnfant(p.id)}
                            disabled={actionLoading || !selectedEleveId}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                          >
                            Lier
                          </button>
                          <button
                            type="button"
                            onClick={() => { setSelectedParentId(null); setSelectedEleveId(''); }}
                            className="bg-slate-100 hover:bg-slate-200 text-slate-500 px-3 py-1.5 rounded-xl text-xs font-bold transition-all"
                          >
                            Annuler
                          </button>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => setSelectedParentId(p.id)}
                          className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-xl text-xs font-black transition-all"
                        >
                          + Associer un élève
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredParents.length === 0 && !loading && (
              <div className="p-20 text-center">
                <p className="text-slate-400 font-bold italic">Aucun parent trouvé.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
