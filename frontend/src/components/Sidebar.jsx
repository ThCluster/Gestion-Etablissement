import { Link, useNavigate } from 'react-router-dom'
import { 
  IconDashboard, IconUsers, IconSchool, 
  IconBook, IconNotes, IconCalendar, 
  IconWallet, IconLogout, IconParent, 
  IconTeacher, IconSchedule, IconReport, 
  IconSettings 
} from './Icons'

export default function Sidebar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  const getDashboardPath = () => {
    if (user.role === 'admin') return '/dashboard'
    if (user.role === 'enseignant') return '/enseignant'
    if (user.role === 'parent') return '/parent'
    return '/mon-espace'
  }

  const isAdmin = user.role === 'admin'
  const isTeacher = user.role === 'enseignant'

  return (
    <div className="w-64 min-h-screen bg-[#0F172A] text-slate-300 flex flex-col border-r border-slate-800 sticky top-0 h-screen overflow-y-auto scrollbar-hide">
      <div className="p-8 border-b border-slate-800/50">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg">
             <IconSchool />
          </div>
          <h2 className="text-lg font-black text-white tracking-tighter uppercase">EduConnect</h2>
        </div>
        <div className="bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
          <p className="text-white text-xs font-bold truncate">{user.first_name} {user.last_name}</p>
          <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mt-0.5">{user.role}</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 mt-4">
        <Link to={getDashboardPath()} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
          <span className="text-slate-500 group-hover:text-blue-400"><IconDashboard /></span>
          <span className="text-sm font-bold">Dashboard</span>
        </Link>
        
        {isAdmin && (
          <>
            <Link to="/eleves" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
              <span className="text-slate-500 group-hover:text-indigo-400"><IconUsers /></span>
              <span className="text-sm font-bold">Élèves</span>
            </Link>
            <Link to="/parents" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
              <span className="text-slate-500 group-hover:text-orange-400"><IconParent /></span>
              <span className="text-sm font-bold">Parents</span>
            </Link>
            <Link to="/professeurs" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
              <span className="text-slate-500 group-hover:text-emerald-400"><IconTeacher /></span>
              <span className="text-sm font-bold">Professeurs</span>
            </Link>
            <Link to="/classes" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
              <span className="text-slate-500 group-hover:text-sky-400"><IconBook /></span>
              <span className="text-sm font-bold">Classes</span>
            </Link>
            <Link to="/filieres" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
              <span className="text-slate-500 group-hover:text-amber-400"><IconSchool /></span>
              <span className="text-sm font-bold">Filières</span>
            </Link>
          </>
        )}

        {isTeacher && (
          <>
            <Link to="/eleves" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
              <span className="text-slate-500 group-hover:text-indigo-400"><IconUsers /></span>
              <span className="text-sm font-bold">Mes Élèves</span>
            </Link>
            <Link to="/classes" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
              <span className="text-slate-500 group-hover:text-sky-400"><IconBook /></span>
              <span className="text-sm font-bold">Mes Classes</span>
            </Link>
          </>
        )}

        <div className="pt-4 pb-2 px-4">
           <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Pédagogie</p>
        </div>

        <Link to="/notes" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
          <span className="text-slate-500 group-hover:text-rose-400"><IconNotes /></span>
          <span className="text-sm font-bold">Notes</span>
        </Link>
        <Link to="/absences" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
          <span className="text-slate-500 group-hover:text-orange-400"><IconCalendar /></span>
          <span className="text-sm font-bold">Absences</span>
        </Link>
        <Link to="/emplois-du-temps" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
          <span className="text-slate-500 group-hover:text-blue-400"><IconSchedule /></span>
          <span className="text-sm font-bold">Emplois du temps</span>
        </Link>

        {isAdmin && (
          <>
            <div className="pt-4 pb-2 px-4">
               <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Gestion</p>
            </div>
            <Link to="/paiements" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
              <span className="text-slate-500 group-hover:text-emerald-400"><IconWallet /></span>
              <span className="text-sm font-bold">Paiements</span>
            </Link>
            <Link to="/rapports" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
              <span className="text-slate-500 group-hover:text-indigo-400"><IconReport /></span>
              <span className="text-sm font-bold">Rapports</span>
            </Link>
            <Link to="/parametres" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 hover:text-white transition-all group">
              <span className="text-slate-500 group-hover:text-slate-400"><IconSettings /></span>
              <span className="text-sm font-bold">Paramètres</span>
            </Link>
          </>
        )}
      </nav>

      <div className="p-4 border-t border-slate-800/50 mt-auto">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white py-3 rounded-xl transition-all font-bold text-sm"
        >
          <IconLogout />
          Déconnexion
        </button>
      </div>
    </div>
  )
}