import { useState, useEffect } from 'react'

export default function MyPage({
  profileData,
  setProfileData,
  currentmode,
  onLogout,
}) {

  const currentPersona = profileData?.personas?.[currentmode?.name]

  // editPersona 초기화
  const [editPersona, setEditPersona] = useState({
    name: '',
    bio: '',
    profile: '',
    interests: [],
  })

  // currentPersona 변경 시 editPersona 동기화
  useEffect(() => {
    if (currentPersona) {
      setEditPersona({
        name: currentPersona.name || '',
        bio: currentPersona.bio || '',
        profile: currentPersona.profile || '',
        interests: currentPersona.interests || [],
      })
    }
  }, [currentPersona])

  const [editing, setEditing] = useState(false)

  if (!currentPersona) return null

  const savePersona = () => {
    setProfileData(prev => ({
      ...prev,
      personas: {
        ...prev.personas,
        [currentmode?.name]: {
          ...prev.personas[currentmode.name],
          name: editPersona.name,
          bio: editPersona.bio,
          profile: editPersona.profile,
          interests: editPersona.interests,
        },
      },
    }))
    setEditing(false)
  }

  return (
    <div className="h-full bg-white overflow-y-auto">

      {/* 상단 */}
      <div className="px-5 pt-8 pb-6">
        <div className="text-3xl font-bold">MY</div>
      </div>

      {/* 프로필 카드 */}
      <div className="px-5">
        <div className="bg-black text-white rounded-4xl p-6 flex flex-col gap-4">

          {/* 프로필 */}
          <div className="flex items-center gap-4">
            <div className="w-24 h-24 rounded-full bg-yellow-300 text-black flex items-center justify-center text-5xl">
              {editing
                ? <input
                    value={editPersona.profile}
                    onChange={e => setEditPersona(prev => ({ ...prev, profile: e.target.value }))}
                    className="w-16 bg-transparent text-center outline-none"
                  />
                : currentPersona.profile
              }
            </div>

            <div className="flex-1">
              {editing
                ? <input
                    value={editPersona.name}
                    onChange={e => setEditPersona(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full bg-white/10 rounded-xl px-3 py-2 outline-none text-3xl font-bold"
                  />
                : <div className="text-3xl font-bold">{currentPersona.name}</div>
              }

              {editing
                ? <textarea
                    value={editPersona.bio}
                    onChange={e => setEditPersona(prev => ({ ...prev, bio: e.target.value }))}
                    className="w-full bg-white/10 rounded-xl px-3 py-2 outline-none mt-2 resize-none"
                  />
                : <div className="text-gray-400 mt-2">{currentPersona.bio}</div>
              }
            </div>
          </div>

          {/* 관심사 */}
          <div className="flex flex-wrap gap-2 mt-2">
            {(editing ? editPersona.interests  || [] : currentPersona.interests || []).map(interest => (
              <div key={interest} className="bg-white/10 px-4 py-2 rounded-full text-sm">#{interest}</div>
            ))}
          </div>

          {/* 버튼 */}
          <button
            onClick={() => {
              if (editing) savePersona()
              else setEditing(true)
            }}
            className="w-full bg-yellow-300 text-black py-4 rounded-2xl font-bold mt-4"
          >
            {editing ? '저장하기' : '프로필 편집'}
          </button>
        </div>
      </div>

      {/* 로그아웃 버튼 */}
      <div className="px-5 mt-8">
        <button
          onClick={onLogout}
          className="w-full bg-red-50 rounded-2xl p-5 flex items-center justify-between"
        >
          <div className="font-semibold text-red-500">로그아웃</div>
          <div className="text-red-400">›</div>
        </button>
      </div>

    </div>
  )
}