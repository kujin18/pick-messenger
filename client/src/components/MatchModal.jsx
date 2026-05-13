export default function MatchModal({
  user,
  onClose,
  onStartChat,
}) {
  if (!user) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center text-white px-6">

      {/* 타이틀 */}
      <div className="text-5xl font-black text-yellow-300">
        IT'S A MATCH 💛
      </div>

      <div className="mt-4 text-gray-300 text-center">
        서로 Pick 했어요!
      </div>

      {/* 프로필 */}
      <div className="flex items-center gap-6 mt-10">

        {/* 나 */}
        <div className="flex flex-col items-center">

          <div className="w-28 h-28 rounded-full bg-pink-300 flex items-center justify-center text-5xl">
            😀
          </div>

          <div className="mt-3 font-semibold">
            나
          </div>

        </div>

        {/* 상대 */}
        <div className="flex flex-col items-center">

          <div className="w-28 h-28 rounded-full bg-pink-300 flex items-center justify-center text-5xl">
            {user?.profile || '😀'}
          </div>

          <div className="mt-3 font-semibold">
            {user?.name || '알 수 없음'}
          </div>

        </div>

      </div>

      {/* 버튼 */}
      <div className="w-full max-w-75 mt-12 space-y-3">

        <button
          onClick={onStartChat}
          className="w-full bg-yellow-300 text-black font-bold py-4 rounded-2xl"
        >
          채팅 시작하기
        </button>

        <button
          onClick={onClose}
          className="w-full bg-white/10 py-4 rounded-2xl"
        >
          계속 탐색하기
        </button>

      </div>

    </div>
  )
}