import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom'

import {
  useState,
  useEffect,
} from 'react'

import { io } from 'socket.io-client'

import Header from './components/Header'
import BottomNav from './components/BottomNav'

import ChatList from './pages/ChatList'
import Friends from './pages/Friends'
import Explore from './pages/Explore'
import MyPage from './pages/MyPage'
import ChatRoom from './pages/ChatRoom'
import Login from './pages/Login'

const socket = io(
  import.meta.env.VITE_API_URL,
  {
    transports: ['websocket'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  }
)

function Layout() {

  const location =
    useLocation()

  const isChatRoom =
    location.pathname.includes(
      '/room/'
    )

  // 현재 모드
  const [
    currentmode,
    setCurrentmode,
  ] = useState(() => {

    const saved =
      localStorage.getItem(
        'currentmode'
      )

    return saved
      ? JSON.parse(saved)
      : { name: '친구모드' }

  })

  // 로그인 유저
  const [user, setUser] =
    useState(() => {

      const saved =
        localStorage.getItem(
          'user'
        )

      return saved
        ? JSON.parse(saved)
        : null

    })

  // 프로필 데이터
  const [
    profileData,
    setProfileData,
  ] = useState(() => {

    const saved =
      localStorage.getItem(
        'profileData'
      )

    if (saved) {
      return JSON.parse(saved)
    }

    // 기본 페르소나
    return {

      personas: {

        지인모드: {
          name: '유진',
          bio:
            '아는 사람들과 소통중 👋',
          profile: '😎',
          interests: [],
        },

        친구모드: {
          name: '친구',
          bio:
            '편하게 대화해요 👋',
          profile: '😄',
          interests: [],
        },

        취미모드: {
          name: '카페좋아함',
          bio:
            '카페 투어중 ☕',
          profile: '☕',
          interests: [],
        },

        직장모드: {
          name: 'DevOssal',
          bio:
            '프론트엔드 개발중 💻',
          profile: '💻',
          interests: [],
        },

        익명모드: {
          name: '익명',
          bio:
            '조용히 대화하고 싶어요',
          profile: '🎭',
          interests: [],
        },

        이성모드: {
          name: '소나',
          bio:
            '새로운 인연 찾는 중 💛',
          profile: '🌙',
          interests: [],
        },

      },

    }

  })

  // profileData 저장
  useEffect(() => {

    localStorage.setItem(
      'profileData',

      JSON.stringify(
        profileData
      )
    )

  }, [profileData])

  // currentmode 저장
  useEffect(() => {

    localStorage.setItem(
      'currentmode',

      JSON.stringify(
        currentmode
      )
    )

  }, [currentmode])

  // 로그아웃
  const handleLogout =
    () => {

      localStorage.removeItem(
        'token'
      )

      localStorage.removeItem(
        'user'
      )

      localStorage.removeItem(
        'profileData'
      )

      localStorage.removeItem(
        'currentmode'
      )

      setUser(null)

    }

  // 로그인 안됐으면 로그인 페이지
  if (!user) {

    return (
      <Login
        setUser={setUser}
      />
    )

  }

  return (

    <div className="w-full h-screen bg-gray-200 flex items-center justify-center">

      <div className="w-97.5 h-screen bg-white flex flex-col overflow-hidden">

        {/* 헤더 */}
        {!isChatRoom && (

          <Header
            currentmode={
              currentmode
            }
            setCurrentmode={
              setCurrentmode
            }
            profileData={
              profileData
            }
          />

        )}

        {/* 페이지 */}
        <div className="flex-1 overflow-y-auto">

          <Routes>

            <Route
              path="/"
              element={
                <ChatList />
              }
            />

            <Route
              path="/friends"
              element={
                <Friends
                  personas={
                    profileData?.personas
                  }
                />
              }
            />

            <Route
              path="/explore"
              element={
                <Explore
                  profileData={
                    profileData
                  }
                  setProfileData={
                    setProfileData
                  }
                  currentmode={
                    currentmode
                  }
                />
              }
            />

            <Route
              path="/my"
              element={
                <MyPage
                  profileData={
                    profileData
                  }
                  setProfileData={
                    setProfileData
                  }
                  currentmode={
                    currentmode
                  }
                  onLogout={
                    handleLogout
                  }
                />
              }
            />

            <Route
              path="/room/:id"
              element={
                <ChatRoom
                  socket={socket}
                  user={user}
                />
              }
            />

          </Routes>

        </div>

        {/* 하단탭 */}
        {!isChatRoom && (

          <BottomNav
            currentmode={
              currentmode
            }
          />

        )}

      </div>

    </div>

  )

}

export default function App() {

  return (

    <BrowserRouter>

      <Layout />

    </BrowserRouter>

  )

}