import { useRef, useState } from 'react'

interface TagEditorProps {
  value: string[]
  onChange: (tags: string[]) => void
  suggestions?: string[]
  maxTags?: number
}

export default function TagEditor({ value, onChange, suggestions = [], maxTags = 5 }: TagEditorProps) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement | null>(null)

  function addTag(raw: string) {
    const t = raw.trim()
    if (!t) return
    if (value.includes(t)) {
      setInput('')
      return
    }
    if (value.length >= maxTags) return
    onChange([...value, t])
    setInput('')
  }

  function removeTag(tag: string) {
    onChange(value.filter((t) => t !== tag))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === ',' ) {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && input === '' && value.length > 0) {
      removeTag(value[value.length - 1])
    }
  }

  const canAddMore = value.length < maxTags

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((t) => (
          <span key={t} className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
            #{t}
            <button onClick={() => removeTag(t)} className="ml-1 text-gray-600 dark:text-gray-300">×</button>
          </span>
        ))}
        {canAddMore && (
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => addTag(input)}
            placeholder={value.length ? '' : '添加标签，按 Enter 确认'}
            className="min-w-[120px] flex-1 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2 py-1 text-xs"
          />
        )}
      </div>
      {suggestions.length > 0 && canAddMore && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              type="button"
              key={s}
              onClick={() => addTag(s)}
              disabled={value.includes(s)}
              className={`px-2 py-1 rounded-full text-[11px] border ${value.includes(s) ? 'opacity-50 cursor-not-allowed border-gray-300' : 'border-gray-300 dark:border-gray-700'}`}
            >
              + #{s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}