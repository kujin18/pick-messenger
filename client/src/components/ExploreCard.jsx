export default function ExploreCard({
  profile,
  onPick,
}) {
  return (
    <div className="bg-white rounded-3xl p-5 shadow-sm">

      <div className="text-5xl mb-4">
        {profile.emoji}
      </div>

      <div className="font-bold text-lg">
        {profile.name}
      </div>

      <div className="text-sm text-pink-500 mt-1">
        {profile.interest}
      </div>

      <div className="text-gray-500 text-sm mt-3">
        {profile.bio}
      </div>

      <button
        onClick={() => onPick(profile)}
        className="w-full mt-5 bg-black text-white py-3 rounded-2xl"
      >
        Pick 보내기
      </button>

    </div>
  )
}