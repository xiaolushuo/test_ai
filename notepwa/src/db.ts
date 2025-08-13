import Dexie from 'dexie'
import type { Table } from 'dexie'
import type { RecordItem, Attachment } from './types'

export class NotesDatabase extends Dexie {
  records!: Table<RecordItem, string>
  attachments!: Table<Attachment, string>

  constructor() {
    super('notepwa')
    this.version(1).stores({
      records: 'id, createdAt, updatedAt, pinned, *tags, deletedAt',
      attachments: 'id, recordId, type',
    })
  }
}

export const db = new NotesDatabase()