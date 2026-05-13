import { useNavigate } from 'react-router-dom'

export default function ChatItem({ chat }) {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate(`/room/${chat.id}`)}
      className="w-full px-5 py-4 flex items-center gap-4 border-b hover:bg-gray-50"
    >
      <div className="relative">
        <div className="w-15 h-15 rounded-full bg-yellow-300 flex items-center justify-center text-3xl">
          {chat?.profile || '😀'}
        </div>
        {chat?.online && (
          <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-green-400 border-2 border-white" />
        )}
      </div>

      <div className="flex-1 text-left">
        <div className="font-bold">{chat?.name || '알 수 없음'}</div>
        <div className="text-sm text-gray-400 truncate">
          {chat?.lastMessage || '대화를 시작해보세요'}
        </div>
      </div>
    </button>
  )
}