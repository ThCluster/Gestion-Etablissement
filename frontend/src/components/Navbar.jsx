import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow px-8 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-blue-900">🎓 Gestion Scolaire</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="font-medium text-gray-800">{user.first_name} {user.last_name}</p>
          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">{user.role}</span>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition text-sm"
        >
          Déconnexion
        </button>
      </div>
    </nav>
  )
}