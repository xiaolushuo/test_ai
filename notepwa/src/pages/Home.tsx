import { Link, useNavigate } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../db'
import type { RecordItem } from '../types'

export default function Home() {
  const navigate = useNavigate()
  const allRecords = useLiveQuery(
    () => db.records.orderBy('updatedAt').reverse().filter((r) => r.deletedAt == null).toArray(),
    []
  )
  const [query, setQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const allTags = useMemo(() => {
    const set = new Set<string>()
    for (const r of allRecords || []) {
      for (const t of r.tags || []) set.add(t)
    }
    return Array.from(set).slice(0, 30)
  }, [allRecords])

  const filtered = useMemo(() => {
    let list: RecordItem[] = (allRecords || []).slice()

    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter((r) =>
        (r.text || '').toLowerCase().includes(q) || (r.tags || []).some((t) => t.toLowerCase().includes(q))
      )
    }

    if (selectedTags.length) {
      list = list.filter((r) => selectedTags.every((t) => r.tags?.includes(t)))
    }

    // pinned first then by updatedAt desc
    list.sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt - a.updatedAt)
    return list
  }, [allRecords, query, selectedTags])

  function toggleTag(tag: string) {
    setSelectedTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]))
  }

  async function deleteRecord(id: string) {
    await db.records.update(id, { deletedAt: Date.now() })
  }

  async function pinRecord(id: string, pinned: boolean) {
    await db.records.update(id, { pinned, updatedAt: Date.now() })
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-gray-800/80 backdrop-blur border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center gap-2">
          <input
            placeholder="搜索文字/标签"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
          />
          <Link to="/my" className="text-sm text-gray-600 dark:text-gray-300">我的</Link>
        </div>
        {allTags.length > 0 && (
          <div className="mx-auto max-w-2xl px-4 pb-2 flex flex-wrap gap-2">
            {allTags.map((t) => {
              const active = selectedTags.includes(t)
              return (
                <button
                  key={t}
                  onClick={() => toggleTag(t)}
                  className={`px-2 py-1 rounded-full text-xs border ${active ? 'bg-brand-red text-white border-brand-red' : 'border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200'}`}
                >
                  #{t}
                </button>
              )
            })}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-2xl px-4 pb-24">
        <div className="py-4 space-y-3">
          {filtered?.length ? (
            filtered.map((r) => (
              <div key={r.id} className="relative group">
                <div className="absolute inset-y-0 right-0 flex items-center gap-2 pr-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => pinRecord(r.id, !r.pinned)} className="px-2 py-1 text-xs rounded bg-yellow-100 text-yellow-800">
                    {r.pinned ? '取消置顶' : '置顶'}
                  </button>
                  <button onClick={() => deleteRecord(r.id)} className="px-2 py-1 text-xs rounded bg-red-100 text-red-700">
                    删除
                  </button>
                </div>
                <Link to={`/detail/${r.id}`} className="block rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
                  <div className="flex items-start justify-between">
                    <p className="text-sm text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{r.text || '（无文本）'}</p>
                    {r.pinned && <span className="text-xs text-brand-red">置顶</span>}
                  </div>
                  {r.tags?.length ? (
                    <div className="mt-2 flex flex-wrap gap-2 text-[11px] text-gray-500">
                      {r.tags.map((t) => <span key={t}>#{t}</span>)}
                    </div>
                  ) : null}
                  <div className="mt-2 text-xs text-gray-500">{new Date(r.updatedAt).toLocaleString()}</div>
                </Link>
              </div>
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