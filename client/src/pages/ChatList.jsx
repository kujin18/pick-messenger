import { useState, useEffect } from 'react'

import api from '../api'

import ChatItem from '../components/ChatItem'

export default function ChatList() {

  const [search, setSearch] =
    useState('')

  const [rooms, setRooms] =
    useState([])

  const fetchRooms = async () => {

    try {

      const me = JSON.parse(
        localStorage.getItem('user')
      )

      // 로그인 정보 없으면 종료
      if (!me) return

      const res = await api.get(
        `/chat/room/${me.id}`
      )

      setRooms(res.data)

    } catch (err) {

      console.log(
        '채팅방 불러오기 실패:',
        err
      )

    }

  }

  const filteredRooms =
    rooms.filter((room) =>
      room.name
        ?.toLowerCase()
        .includes(
          search.toLowerCase()
        )
    )

   useEffect(() => {

    fetchRooms()

  }, [])
  return (

    <div className="h-full bg-white">

      <div className="px-4 pt-5 pb-3">

        <h1 className="text-3xl font-bold">
          채팅
        </h1>

        <input
          type="text"
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          placeholder="채팅 검색"
          className="w-full mt-4 bg-gray-100 rounded-2xl px-4 py-3 outline-none"
        />

      </div>

      <div>

        {filteredRooms.length > 0 ? (

          filteredRooms.map(
            (room) => (

              <ChatItem
                key={room.id}
                chat={room}
              />

            )
          )

        ) : (

          <p className="text-center text-gray-400 mt-10">
            채팅방이 없습니다
          </p>

        )}

      </div>

    </div>

  )

}