import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'

export default function Friends({
  personas,
}) {

  const navigate = useNavigate()

  const [friends, setFriends] =
    useState([])

  const [friendMode, setFriendMode] =
    useState('친구모드')

  const [openGroups, setOpenGroups] =
    useState({

      지인모드: true,
      친구모드: true,
      취미모드: true,
      직장모드: true,
      익명모드: true,
      이성모드: true,

    })

  const groupedFriends = {

    지인모드: [],
    친구모드: [],
    취미모드: [],
    직장모드: [],
    익명모드: [],
    이성모드: [],

  }

  const currentPersona =
    personas?.[friendMode]

  if (!currentPersona) {
    return(

    <div className="h-full bg-white flex items-center justify-center">

      <div className="text-gray-400">
        프로필 없음
      </div>

    </div>

  )
  }

  const me = JSON.parse(
    localStorage.getItem('user')
  )

  useEffect(() => {

    const fetchUsers = async () => {

      try {

        const res = await api.get(
          '/user'
        )

        setFriends(res.data)

      } catch (err) {

        console.log(
          '유저 불러오기 실패:',
          err
        )

      }

    }

    fetchUsers()

  }, [])

  friends
    .filter(
      (friend) =>
        friend?.id !== me?.id
    )
    .forEach((friend) => {

      groupedFriends[
        friend?.displayMode
      ]?.push(friend)

    })

  const createRoom = async (
    targetUser
  ) => {

    try {

      const res = await api.post(
        '/chat/room',
        {

          user1Id: me?.id,
          user2Id: targetUser?.id,

        }
      )

      navigate(
        `/room/${res.data.id}`
      )

    } catch (err) {

      console.log(
        '채팅방 생성 실패:',
        err
      )

    }

  }

  return (

    <div className="bg-white h-full overflow-y-auto">

      {/* 내 프로필 */}
      <div className="px-5 pt-5 border-b pb-5">

        <h1 className="text-3xl font-bold mb-5">
          친구
        </h1>

        <div className="flex items-start justify-between">

          <div className="flex items-center gap-4">

            <div className="relative">

              <div className="w-18 h-18 rounded-full bg-yellow-300 flex items-center justify-center text-4xl">
                {currentPersona?.profile || '😀'}
              </div>

              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 border-2 border-white rounded-full" />

            </div>

            <div>

              <div className="font-bold text-2xl">
                {currentPersona?.name || '사용자'}
              </div>

              <div className="text-gray-500 text-sm">
                {currentPersona?.bio || '소개 없음'}
              </div>

              <div className="text-xs text-gray-400 mt-2">

                현재 표시중:

                <span className="font-bold text-black ml-1">
                  {friendMode}
                </span>

              </div>

            </div>

          </div>

          <select
            value={friendMode}
            onChange={(e) =>
              setFriendMode(
                e.target.value
              )
            }
            className="bg-gray-100 px-3 py-2 rounded-xl text-sm outline-none"
          >

            <option>지인모드</option>
            <option>친구모드</option>
            <option>취미모드</option>
            <option>직장모드</option>
            <option>익명모드</option>
            <option>이성모드</option>

          </select>

        </div>

      </div>

      {/* 친구 리스트 */}
      <div className="pb-20">

        {Object.entries(
          groupedFriends
        ).map(
          ([groupName, items]) => {

            if (items.length === 0)
              return null

            return (

              <div
                key={groupName}
                className="mt-5"
              >

                {/* 그룹 헤더 */}
                <button
                  onClick={() =>
                    setOpenGroups({

                      ...openGroups,

                      [groupName]:
                        !openGroups[
                          groupName
                        ],

                    })
                  }
                  className="w-full px-4 mb-3 flex items-center justify-between"
                >

                  <div className="text-sm text-gray-400">
                    {groupName}{' '}
                    {items.length}
                  </div>

                  <div className="text-gray-400">

                    {openGroups[
                      groupName
                    ]
                      ? '▲'
                      : '▼'}

                  </div>

                </button>

                {/* 친구들 */}
                {openGroups[
                  groupName
                ] &&

                  items.map((friend) => (

                    <button
                      key={friend?.id}
                      onClick={() => {

                        createRoom(friend)

                      }}
                      className="w-full flex items-center px-5 py-4 hover:bg-gray-50"
                    >

                      <div className="relative">

                        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-3xl">
                          {friend?.profile || '😀'}
                        </div>

                        {friend?.online && (

                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-white rounded-full" />

                        )}

                      </div>

                      <div className="ml-4 text-left">

                        <div className="font-bold">
                          {friend?.name || '알 수 없음'}
                        </div>

                        <div className="text-sm text-gray-400">
                          {friend?.bio || '소개 없음'}
                        </div>

                      </div>

                    </button>

                  ))}

              </div>

            )

          }
        )}

      </div>

    </div>

  )

}