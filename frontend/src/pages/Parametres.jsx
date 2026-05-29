import Sidebar from '../components/Sidebar'
import { IconSettings } from '../components/Icons'

export default function Parametres() {
  return (
    <div className="flex bg-[#F8FAFC] min-h-screen">
      <Sidebar />
      <main className="flex-1 p-10 flex flex-col h-screen overflow-hidden">
        <header className="mb-8">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-slate-700 rounded-xl flex items-center justify-center text-white shadow-lg">
                <IconSettings />
             </div>
             <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight font-outfit">Paramètres</h1>
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-0.5">Configuration du système EduConnect</p>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-auto bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm relative">
          <div className="absolute inset-0 bg-slate-50/50 backdrop-blur-[2px] rounded-[2.5rem] flex flex-col items-center justify-center z-10 p-10 text-center">
             <div className="w-16 h-16 bg-slate-100 text-slate-600 rounded-2xl flex items-center justify-center mb-6 shadow-md shadow-slate-200">
                <IconSettings />
             </div>
             <h2 className="text-2xl font-black text-slate-800 mb-2">Options système en cours d'intégration</h2>
             <p className="text-slate-500 text-sm max-w-md mb-6 leading-relaxed">
                Le panneau d'administration pour la personnalisation de l'établissement, les e-mails automatisés, les sauvegardes et la sécurité sera bientôt opérationnel.
             </p>
             <div className="bg-slate-700 text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-lg shadow-slate-300">
                Bientôt disponible
             </div>
          </div>

          {/* Options de config factices en arrière-plan */}
          <div className="space-y-6 opacity-10 select-none">
             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                   <p className="font-bold text-slate-700 text-sm">Notifications SMS automatiques</p>
                   <p className="text-[10px] text-slate-400">Avertir les parents immédiatement lors d'une absence</p>
                </div>
                <div className="w-11 h-6 bg-slate-200 rounded-full"></div>
             </div>
             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                   <p className="font-bold text-slate-700 text-sm">Sauvegardes de la base de données</p>
                   <p className="text-[10px] text-slate-400">Sauvegarde automatique hebdomadaire vers le cloud</p>
                </div>
                <div className="w-11 h-6 bg-indigo-600 rounded-full"></div>
             </div>
             <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                <div>
                   <p className="font-bold text-slate-700 text-sm">Thème sombre de l'application</p>
                   <p className="text-[10px] text-slate-400">Activer le mode sombre pour toutes les interfaces</p>
                </div>
                <div className="w-11 h-6 bg-slate-200 rounded-full"></div>
             </div>
          </div>
        </div>
      </main>
    </div>
  )
}
