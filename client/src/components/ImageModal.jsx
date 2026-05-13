export default function ImageModal({
  image,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">

      {/* 배경 */}
      <div
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* 이미지 */}
      <img
        src={image}
        alt=""
        className="relative max-w-full max-h-full object-contain"
      />

      {/* 닫기 */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white text-3xl"
      >
        ✕
      </button>

    </div>
  )
}