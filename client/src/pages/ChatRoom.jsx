import {
  useParams,
  useNavigate,
} from 'react-router-dom'

import {
  useEffect,
  useRef,
  useState,
} from 'react'

import api from '../api'

import ProfileModal from '../components/ProfileModal'
import ChatActionSheet from '../components/ChatActionSheet'
import ImageModal from '../components/ImageModal'

export default function ChatRoom({
  socket,
  user,
}) {

  const { id } = useParams()

  const navigate = useNavigate()

  const [input, setInput] =
    useState('')

  const [messages, setMessages] =
    useState([])

  const [room, setRoom] =
    useState(null)

  const [showProfile, setShowProfile] =
    useState(false)

  const [showActions, setShowActions] =
    useState(false)

  const [selectedImage, setSelectedImage] =
    useState(null)

  const [otherTyping, setOtherTyping] =
    useState(false)

  const bottomRef = useRef(null)

  // 방 정보 불러오기
  useEffect(() => {

    const fetchRoom = async () => {

      try {

        const res = await api.get(
          `/chat/room/detail/${id}`
        )

        setRoom(res.data)

      } catch (err) {

        console.log(err)

      }

    }

    fetchRoom()

  }, [id])

  // 메시지 불러오기
  useEffect(() => {

    const loadMessages = async () => {

      try {

        const res = await api.get(
          `/chat/message/${id}`
        )

        setMessages(res.data)

      } catch (err) {

        console.log(err)

      }

    }

    loadMessages()

  }, [id])

  // 소켓 입장
  useEffect(() => {

    socket.emit(
      'join_room',
      String(id)
    )

  }, [id, socket])

  // 메시지 수신
  useEffect(() => {

    socket.on(
      'receive_message',
      (data) => {

        setMessages((prev) => [
          ...prev,
          data,
        ])

      }
    )

    socket.on(
      'typing',
      (data) => {

        if (
          data.chatRoomId === Number(id) &&
          data.senderId !== user.id
        ) {

          setOtherTyping(true)

          clearTimeout(
            window.typingTimeout
          )

          window.typingTimeout =
            setTimeout(() => {

              setOtherTyping(false)

            }, 1200)

        }

      }
    )

    return () => {

      socket.off(
        'receive_message'
      )

      socket.off(
        'typing'
      )

    }

  }, [id, socket, user.id])

  // 자동 스크롤
  useEffect(() => {

    bottomRef.current?.scrollIntoView({
      behavior: 'smooth',
    })

  }, [messages])

  // 메시지 전송
  const sendMessage = async () => {

    if (!input.trim()) return

    try {

      const res = await api.post(
        '/chat/message',
        {
          text: input,
          senderId: user.id,
          chatRoomId: Number(id),
        }
      )

      setMessages((prev) => [
        ...prev,
        res.data,
      ])

      socket.emit(
        'send_message',
        res.data
      )

      setInput('')

    } catch (err) {

      console.log(err)

    }

  }

  if (!room) {

    return (
      <div>
        로딩중...
      </div>
    )

  }

  return (
    <div className="h-full flex flex-col bg-[#b2c7da]">

      {/* 상단 */}
      <div className="h-16 border-b bg-white flex items-center px-4">

        <button
          onClick={() =>
            navigate(-1)
          }
          className="mr-3 text-lg"
        >
          ←
        </button>

        <button
          onClick={() =>
            setShowProfile(true)
          }
          className="flex items-center flex-1 text-left"
        >

          <div className="text-2xl mr-2">
            👤
          </div>

          <div>

            <div className="font-bold">
              채팅방
            </div>

          </div>

        </button>

        <button
          onClick={() =>
            setShowActions(true)
          }
          className="text-xl"
        >
          ☰
        </button>

      </div>

      {/* 메시지 */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">

        {messages.map(
          (msg, index) => {

            const isMine =
              msg.senderId === user.id

            return (

              <div
                key={index}
                className={`flex ${
                  isMine
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >

                <div
                  className={`max-w-[70%] px-4 py-2 rounded-2xl whitespace-pre-wrap ${
                    isMine
                      ? 'bg-yellow-300'
                      : 'bg-white'
                  }`}
                >

                  {msg.image ? (
                    <img
                      src={msg.image}
                      alt=""
                      onClick={() =>
                        setSelectedImage(
                          msg.image
                        )
                      }
                      className="rounded-2xl max-w-50 cursor-pointer"
                    />
                  ) : (
                    msg.text
                  )}

                </div>

              </div>

            )

          }
        )}

        {otherTyping && (

          <div className="text-sm text-gray-700">
            입력중...
          </div>

        )}

        <div ref={bottomRef} />

      </div>

      {/* 입력창 */}
      <div className="h-20 border-t bg-white flex items-center px-3 gap-2">

        <input
          type="text"
          value={input}
          onChange={(e) => {

            setInput(
              e.target.value
            )

            socket.emit(
              'typing',
              {
                chatRoomId: Number(id),
                senderId: user.id,
              }
            )

          }}
          onKeyDown={(e) => {

            if (
              e.key === 'Enter'
            ) {

              sendMessage()

            }

          }}
          placeholder="메시지 입력..."
          className="flex-1 bg-gray-100 rounded-full px-4 py-3 outline-none"
        />

        <button
          disabled={
            !input.trim()
          }
          onClick={sendMessage}
          className={`px-5 py-2 rounded-full font-semibold ${
            input.trim()
              ? 'bg-yellow-300'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          전송
        </button>

      </div>

      {showActions && (
        <ChatActionSheet
          onClose={() =>
            setShowActions(false)
          }
        />
      )}

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() =>
            setSelectedImage(null)
          }
        />
      )}

      {showProfile && (
        <ProfileModal
          chat={room}
          onClose={() =>
            setShowProfile(false)
          }
        />
      )}

    </div>
  )
}