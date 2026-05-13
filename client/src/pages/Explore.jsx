// Explore.jsx
import { useState, useEffect } from 'react'
import MatchModal from '../components/MatchModal'
import { useNavigate } from 'react-router-dom'
import interestsByMode from '../data/interestsByMode'
import api from '../api'

export default function Explore({ profileData, setProfileData, currentmode }) {
  const navigate = useNavigate()
  const currentPersona = profileData?.personas?.[currentmode?.name]
  const userInterests = currentPersona?.interests || []

  const [users, setUsers] = useState([])
  const [selectedInterest, setSelectedInterest] = useState('전체')
  const [showFilters, setShowFilters] = useState(false)
  const [showInterestModal, setShowInterestModal] = useState(false)
  const [customInterest, setCustomInterest] = useState('')
  const [showMatchModal, setShowMatchModal] = useState(false)
  const [matchedUser, setMatchedUser] = useState(null)

  const exploreTitle = {
    지인모드: '아는 사람 찾기',
    친구모드: '새 친구 찾기',
    취미모드: '같은 취미 찾기',
    직장모드: '커리어 네트워킹',
    익명모드: '익명 대화',
    이성모드: '새로운 인연 찾기',
  }

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get('/user')
        setUsers(res.data || [])
      } catch (err) {
        console.log('유저 불러오기 실패:', err)
      }
    }
    fetchUsers()
  }, [])

  if (!currentPersona) {

  return (

    <div className="h-full bg-white flex items-center justify-center">

      <div className="text-gray-400">
        프로필 불러오는 중...
      </div>

    </div>

  )

}

  // 관심사 필터
  const filterList =
    userInterests.filter((interest) =>
      interestsByMode[currentmode?.name]?.includes(interest)
    ).length > 0
      ? ['전체', ...new Set(userInterests.filter((i) =>
          interestsByMode[currentmode?.name]?.includes(i)
        ))]
      : []

  // 모드별 유저 필터
  const modeUsers = users.filter((u) =>
    u?.modes?.includes(currentmode?.name) &&
    u?.name !== currentPersona?.name
  )

  const filteredUsers =
    selectedInterest === '전체'
      ? modeUsers
      : modeUsers.filter((u) => u?.interests?.includes(selectedInterest))

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const aMatched = a?.interests?.filter(i => userInterests.includes(i)).length || 0
    const bMatched = b?.interests?.filter(i => userInterests.includes(i)).length || 0
    return bMatched - aMatched
  })

  const startChat = async (targetUser) => {
    try {
      const me = JSON.parse(localStorage.getItem('user') || '{}')
      if (!me?.id || !targetUser?.id) return
      const res = await api.post('/chat/room', {
        user1Id: me.id,
        user2Id: targetUser.id,
      })
      navigate(`/room/${res.data?.id}`)
    } catch (err) {
      console.log('채팅방 생성 실패:', err)
    }
  }

  return (
    <div className="h-full bg-[#f5f5f5] flex flex-col overflow-y-hidden">
      {/* 상단 */}
      <div className="relative z-20">
        <div className="bg-white px-5 pt-8 pb-5 rounded-b-4xl shadow-sm flex justify-between items-center">
          <div className="text-2xl font-bold">{exploreTitle[currentmode?.name]}</div>
          <button
            onClick={() => setShowInterestModal(true)}
            className="bg-black text-white px-4 py-2 rounded-2xl text-sm font-semibold"
          >
            설정
          </button>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 text-gray-500 mt-2"
        >
          <span>관심사가 맞는 사람들을 만나보세요</span>
          <span className="text-sm">{showFilters ? '▲' : '▼'}</span>
        </button>

        {/* 필터 */}
        {showFilters && filterList.length > 0 && (
          <div className="absolute left-0 right-0 top-22.5 px-5 mt-7 z-30">
            <div className="bg-white rounded-3xl shadow-lg p-2 flex gap-3 overflow-x-auto pb-2">
              {filterList.map((interest) => (
                <button
                  key={interest}
                  onClick={() => setSelectedInterest(interest)}
                  className={`px-5 py-3 rounded-full whitespace-nowrap shrink-0 transition-all ${
                    selectedInterest === interest ? 'bg-black text-white' : 'bg-gray-100'
                  }`}
                >
                  {interest === '전체' ? '전체' : `#${interest}`}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* 관심사 모달 */}
      {showInterestModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-[90%] max-w-95 bg-white rounded-4xl p-6">
            <div className="text-2xl font-bold">관심사 선택</div>
            <div className="text-gray-500 mt-2">원하는 관심사를 선택하세요</div>

            <div className="flex flex-wrap gap-2 mt-6">
              {interestsByMode[currentmode?.name]?.map((interest) => {
                const currentInterests = currentPersona?.interests || []
                const isSelected = currentInterests.includes(interest)

                return (
                  <button
                    key={interest}
                    onClick={() => {
                      const updatedInterests = isSelected
                        ? currentInterests.filter((i) => i !== interest)
                        : [...currentInterests, interest]
                      setProfileData(prev => ({
                        ...prev,
                        personas: {
                          ...prev.personas,
                          [currentmode.name]: {
                            ...prev.personas[currentmode.name],
                            interests: updatedInterests,
                          },
                        },
                      }))
                    }}
                    className={`px-4 py-2 rounded-full transition-all ${
                      isSelected ? 'bg-black text-white' : 'bg-gray-100'
                    }`}
                  >
                    {interest}
                  </button>
                )
              })}
            </div>

            <div className="mt-6 flex gap-2">
              <input
                type="text"
                value={customInterest}
                onChange={(e) => setCustomInterest(e.target.value)}
                placeholder="관심사 입력"
                className="flex-1 bg-gray-100 rounded-2xl px-4 py-3 outline-none"
              />
              <button
                onClick={() => {
                  if (!customInterest.trim()) return
                  const currentInterests = currentPersona?.interests || []
                  if (currentInterests.includes(customInterest)) return
                  setProfileData(prev => ({
                    ...prev,
                    personas: {
                      ...prev.personas,
                      [currentmode.name]: {
                        ...prev.personas[currentmode.name],
                        interests: [...currentInterests, customInterest],
                      },
                    },
                  }))
                  setCustomInterest('')
                }}
                className="bg-black text-white px-5 rounded-2xl"
              >
                추가
              </button>
            </div>

            <button
              onClick={() => setShowInterestModal(false)}
              className="w-full bg-yellow-300 py-4 rounded-2xl font-bold mt-8"
            >
              완료
            </button>
          </div>
        </div>
      )}

      {/* 유저 카드 */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden px-5 py-6 touch-pan-x">
        <div className="flex gap-5 h-full items-start w-max">
          {sortedUsers.map((targetUser) => {
            const matchedInterests = targetUser?.interests?.filter(i => userInterests.includes(i)) || []
            return (
              <div key={targetUser?.id} className="w-[320px] min-h-162.5 bg-white rounded-[36px] p-6 shadow-sm shrink-0">
                <div className="flex flex-col items-center text-center">
                  <div className="w-28 h-28 rounded-full bg-yellow-300 flex items-center justify-center text-6xl">
                    {targetUser?.profile || '😀'}
                  </div>
                  <div className="text-3xl font-bold mt-5">{targetUser?.name}</div>
                  <div className="text-gray-500 mt-2">{targetUser?.bio}</div>
                </div>

                {matchedInterests.length > 0 && (
                  <div className="mt-6 text-center h-10">
                    <span className="bg-black text-white px-4 py-2 rounded-full text-sm">
                      공통 관심사 {matchedInterests.length}개
                    </span>
                  </div>
                )}

                <div className="flex gap-2 overflow-x-auto mt-6 pb-1">
                  {targetUser?.interests?.map((interest) => {
                    const matched = userInterests.includes(interest)
                    return (
                      <div
                        key={interest}
                        className={`px-4 py-2 rounded-full text-sm whitespace-nowrap shrink-0 ${
                          matched ? 'bg-black text-white' : 'bg-gray-100'
                        }`}
                      >
                        #{interest}
                      </div>
                    )
                  })}
                </div>

                <button
                  onClick={() => {
                    if (currentmode?.name === '이성모드') {
                      setMatchedUser(targetUser)
                      setShowMatchModal(true)
                      return
                    }
                    startChat(targetUser)
                  }}
                  className="w-full py-4 rounded-2xl font-bold mt-8 text-lg bg-yellow-300 text-black"
                >
                  채팅 시작하기
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {showMatchModal && matchedUser && (
        <MatchModal
          user={matchedUser}
          onClose={() => setShowMatchModal(false)}
          onStartChat={() => {
            startChat(matchedUser)
            setShowMatchModal(false)
          }}
        />
      )}
    </div>
  )
}