import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'

export default function Privacy() {
  const [checked, setChecked] = useState(false)
  const navigate = useNavigate()
  const setPrivacyAccepted = useAppStore((s) => s.setPrivacyAccepted)

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow p-6 space-y-4">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">隐私授权</h1>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          同意本地数据存储、隐私保护等条款后开始使用应用。您可在“设置”中随时撤回。
        </p>
        <label className="flex items-start gap-3 text-sm text-gray-700 dark:text-gray-200">
          <input type="checkbox" className="mt-1" checked={checked} onChange={(e) => setChecked(e.target.checked)} />
          我已阅读并同意《隐私政策》和《用户条款》
        </label>
        <button
          disabled={!checked}
          onClick={() => {
            setPrivacyAccepted(true)
            navigate('/')
          }}
          className="w-full py-2.5 rounded-lg font-medium text-white disabled:opacity-50 bg-brand-red hover:opacity-90"
        >
          开始使用
        </button>
      </div>
    </div>
  )
}