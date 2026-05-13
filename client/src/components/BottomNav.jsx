import { Link, useLocation } from 'react-router-dom'

export default function BottomNav({ currentmode }) 
 {
  const location = useLocation()

  const menus = [
    { name: '친구', path: '/friends' },
    { name: '채팅', path: '/' },
    { name: '탐색', path: '/explore' },
    { name: 'MY', path: '/my' },
  ]

  return (
    <div
  className={`h-20 border-t flex justify-around items-center ${
    currentmode === 'dark'
      ? 'bg-gray-800 border-gray-700'
      : 'bg-white'
  }`}
>
      {menus.map((menu) => (
        <Link
          key={menu.path}
          to={menu.path}
          className={`text-sm ${
            location.pathname === menu.path
              ? 'font-bold text-black'
              : 'text-gray-400'
          }`}
        >
          {menu.name}
        </Link>
      ))}
    </div>
  )
}