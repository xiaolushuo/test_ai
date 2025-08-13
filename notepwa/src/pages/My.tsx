import { db } from '../db'
import Papa from 'papaparse'

export default function My() {
  async function exportCSV() {
    const records = await db.records.toArray()
    const csv = Papa.unparse(records)
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'notes.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="mx-auto max-w-2xl px-4 py-3 flex items-center">
          <div className="font-medium text-gray-800 dark:text-gray-100">我的</div>
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-4 space-y-4">
        <button onClick={exportCSV} className="px-4 py-2 rounded-lg bg-gray-900 text-white dark:bg-gray-100 dark:text-gray-900">
          导出 CSV
        </button>
      </main>
    </div>
  )
}