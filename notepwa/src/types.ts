export type AttachmentType = 'image' | 'video' | 'audio' | 'drawing'

export interface Attachment {
  id: string
  recordId: string
  type: AttachmentType
  mime: string
  width?: number
  height?: number
  durationSec?: number
  blob: Blob
  createdAt: number
}

export interface RecordItem {
  id: string
  createdAt: number
  updatedAt: number
  pinned: boolean
  text: string
  ocrText?: string
  asrText?: string
  tags: string[]
  aiLabels?: string[]
  emotion?: string
  deletedAt?: number | null
}