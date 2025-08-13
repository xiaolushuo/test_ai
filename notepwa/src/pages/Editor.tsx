import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import imageCompression from 'browser-image-compression'
import { db } from '../db'
import type { RecordItem, Attachment } from '../types'
import { generateTags } from '../utils/tags'

export default function Editor() {
  const [text, setText] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const navigate = useNavigate()

  const remaining = 500 - text.length
  const previewTags = generateTags(text)

  async function handleSave() {
    const now = Date.now()
    const id = crypto.randomUUID()

    const record: RecordItem = {
      id,
      createdAt: now,
      updatedAt: now,
      pinned: false,
      text: text.slice(0, 500),
      tags: previewTags,
    }

    await db.transaction('rw', db.records, db.attachments, async () => {
      await db.records.add(record)
      if (file) {
        const compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 2000, useWebWorker: true })
        const blob = new Blob([await compressed.arrayBuffer()], { type: compressed.type })
        const attachment: Attachment = {
          id: crypto.randomUUID(),
          recordId: id,
          type: 'image',
          mime: compressed.type,
          blob,
          createdAt: now,
        }
        await db.attachments.add(attachment)
      }
    })

    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-600">取消</button>
          <div className="text-gray-800 dark:text-gray-100 font-medium">新建记录</div>
          <button
            onClick={handleSave}
            className="text-sm text-brand-red font-semibold"
            disabled={text.length === 0 && !file}
          >保存</button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-4 space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, 500))}
          placeholder="输入文字（最多500字）"
          className="w-full min-h-40 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 text-sm text-gray-900 dark:text-gray-100"
        />
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{Math.max(0, remaining)}/500</span>
          <label className="inline-flex items-center gap-2 cursor-pointer">
            <span className="px-3 py-1 rounded border border-gray-300 dark:border-gray-700">选择图片</span>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          </label>
        </div>
        {file && (
          <div className="text-xs text-gray-500">已选择：{file.name}</div>
        )}
        {previewTags.length > 0 && (
          <div className="flex flex-wrap gap-2 text-xs">
            {previewTags.map((t) => (
              <span key={t} className="px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-100">#{t}</span>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}