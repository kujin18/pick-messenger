import { useState } from 'react'
import api from '../api'

export default function Login({
  setUser,
}) {

  const [phone, setPhone] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  const handleStart = async () => {

    if (!phone.trim()) return

    try {

      setLoading(true)

      const res = await api.post("/auth/login", {
          phone,
        }

      )
      console.log(res.data)

      // 토큰 저장
      localStorage.setItem(

        'token',

        res.data.token

      )

      // 유저 저장
      localStorage.setItem(

        'user',

        JSON.stringify(
          res.data.user
        )

      )

      // 앱 상태 저장
      setUser(res.data.user)

    } catch (err) {

      console.log(err.response?.data)

      console.log(
    err.response?.data
      )
      alert('로그인 실패')

    } finally {

      setLoading(false)

    }

  }

  return (

    <div className="h-screen bg-black text-white flex flex-col">

      {/* 중앙 */}
      <div className="flex-1 flex flex-col justify-center px-8">

        {/* 로고 */}
        <div className="text-7xl font-black text-yellow-300 text-center">
          Pick
        </div>

        <div className="mt-5 text-center text-gray-400 leading-relaxed">
          새로운 사람과
          <br />
          자연스럽게 연결되는 메신저
        </div>

        <div className="mt-14">

          <div className="text-sm text-gray-400 mb-3">
            전화번호
          </div>

          <input
            type="text"
            value={phone}
            onChange={(e) =>
              setPhone(e.target.value)
            }
            placeholder="01012345678"
            className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 outline-none"
          />

          <button
            onClick={handleStart}
            disabled={loading}
            className="w-full bg-yellow-300 text-black py-4 rounded-2xl font-bold text-lg mt-5"
          >

            {loading
              ? '로그인 중...'
              : '시작하기'}

          </button>

        </div>

      </div>

    </div>

  )
}