export default function ChatActionSheet({
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40">

      {/* 배경 */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* 시트 */}
      <div className="relative w-full max-w-97.5 bg-white rounded-t-3xl overflow-hidden animate-[slideUp_0.25s_ease]">

        {/* 핸들 */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>

        {/* 메뉴 */}
        <div className="pb-4">

          <button className="w-full px-5 py-4 text-left hover:bg-gray-50 transition">
            🔕 알림 끄기
          </button>

          <button className="w-full px-5 py-4 text-left hover:bg-gray-50 transition">
            🎨 배경화면 변경
          </button>

          <button className="w-full px-5 py-4 text-left hover:bg-gray-50 transition">
            📁 채팅 보관
          </button>

          <button className="w-full px-5 py-4 text-left text-red-500 hover:bg-red-50 transition">
            🚪 채팅방 나가기
          </button>

        </div>

      </div>

    </div>
  )
}