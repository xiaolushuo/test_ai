import { useParams, useNavigate } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { useState, useEffect } from 'react'
import { db } from '../db'
import TagEditor from '../components/TagEditor'
import { generateTags } from '../utils/tags'

export default function Detail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const record = useLiveQuery(() => (id ? db.records.get(id) : undefined), [id])
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    setTags(record?.tags || [])
  }, [record])

  async function saveTags() {
    if (!id) return
    await db.records.update(id, { tags, updatedAt: Date.now() })
  }

  const suggestions = generateTags(record?.text || '')

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-600">返回</button>
          <div className="font-medium text-gray-800 dark:text-gray-100">详情</div>
          <div className="flex-1" />
          <button onClick={saveTags} className="text-sm text-brand-red">保存标签</button>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-4 space-y-4">
        {record ? (
          <>
            <div className="whitespace-pre-wrap text-gray-900 dark:text-gray-100 text-sm">{record.text}</div>
            <div className="text-xs text-gray-500">{new Date(record.updatedAt).toLocaleString()}</div>
            <TagEditor value={tags} onChange={setTags} suggestions={suggestions} />
          </>
        ) : (
          <p className="text-sm text-gray-500">加载中...</p>
        )}
      </main>
    </div>
  )
}