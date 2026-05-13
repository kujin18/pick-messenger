export default function ProfileModal({
  chat,
  onClose,
}) {

  if (!chat) return null

  return (

    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">

      {/* 바깥 클릭 */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* 모달 */}
      <div className="relative w-full max-w-97.5 bg-white rounded-t-3xl p-6 animate-[slideUp_0.25s_ease]">

        {/* 프로필 */}
        <div className="flex flex-col items-center">

          <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center text-6xl">
            {chat?.profile || '😀'}
          </div>

          <div className="mt-4 text-2xl font-bold">
            {chat?.name || '알 수 없음'}
          </div>

          <div className="mt-2 text-gray-500">
            {chat?.status || '상태메시지 없음'}
          </div>

        </div>

        {/* 버튼 */}
        <div className="mt-8 grid grid-cols-3 gap-3">

          <button className="bg-gray-100 rounded-2xl py-3">
            💬 채팅
          </button>

          <button className="bg-gray-100 rounded-2xl py-3">
            📞 통화
          </button>

          <button className="bg-gray-100 rounded-2xl py-3">
            ⭐ 즐겨찾기
          </button>

        </div>

      </div>

    </div>

  )

}