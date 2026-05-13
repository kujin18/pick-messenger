export default function SettingItem({
  icon,
  title,
  subtitle,
}) {
  return (
    <div className="flex items-center px-4 py-4 hover:bg-gray-50 transition cursor-pointer">

      {/* 아이콘 */}
      <div className="w-11 h-11 rounded-2xl bg-gray-100 flex items-center justify-center text-xl">
        {icon}
      </div>

      {/* 텍스트 */}
      <div className="ml-4 flex-1">

        <div className="font-medium">
          {title}
        </div>

        {subtitle && (
          <div className="text-sm text-gray-500 mt-1">
            {subtitle}
          </div>
        )}

      </div>

      {/* 화살표 */}
      <div className="text-gray-300 text-lg">
        ›
      </div>

    </div>
  )
}