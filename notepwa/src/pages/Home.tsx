import { Link, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'

export default function Home() {
  const navigate = useNavigate()
  const records = useLiveQuery(() => db.records.orderBy('pinned').reverse().toArray(), [])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center gap-2">
          <input
            placeholder="搜索文字/标签"
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
          />
          <Link to="/my" className="text-sm text-gray-600 dark:text-gray-300">我的</Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-24">
        <div className="py-4 space-y-3">
          {records?.length ? (
            records.map((r) => (
              <Link key={r.id} to={`/detail/${r.id}`} className="block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                <div className="flex items-start justify-between">
                  <p className="text-sm text-gray-800 dark:text-gray-100 line-clamp-3 whitespace-pre-wrap">{r.text || '（无文本）'}</p>
                  {r.pinned && <span className="text-xs text-brand-red">置顶</span>}
                </div>
                <div className="mt-2 text-xs text-gray-500">{new Date(r.updatedAt).toLocaleString()}</div>
              </Link>
            ))
          ) : (
            <p className="text-center text-sm text-gray-500 py-10">暂无记录，点击右下角按钮开始记录</p>
          )}
        </div>
      </main>

      <button
        onClick={() => navigate('/editor')}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-brand-red text-white shadow-xl flex items-center justify-center text-2xl"
        aria-label="添加记录"
      >
        +
      </button>
    </div>
  )
}