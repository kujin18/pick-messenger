export default function Header({
  currentmode,
  setCurrentmode,
  profileData,
}) {

  const currentPersona =
  profileData?.personas?.[
    currentmode?.name
  ]
  
  return (
    <div className="h-16 border-b px-4 flex items-center justify-between bg-white">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-yellow-300 flex items-center justify-center text-2xl">
          {
             currentPersona?.profile || '😀'
          }
        </div>

        <div>
          <div className="font-bold text-lg">
            {currentPersona?.name || '사용자'}
          </div>

          <div className="text-xs text-gray-400">
            {currentPersona?.bio || '소개가 없습니다'}
          </div>
        </div>
      </div>

      <select
        value={currentmode?.name || ''}
        onChange={(e) => {
          const selected = e.target.value
          setCurrentmode({ name: selected })
        }}
        className="bg-gray-100 px-3 py-2 rounded-xl outline-none"
      >
        <option>지인모드</option>
        <option>친구모드</option>
        <option>취미모드</option>
        <option>직장모드</option>
        <option>익명모드</option>
        <option>이성모드</option>
      </select>
    </div>
  )
}