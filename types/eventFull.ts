type EventFull = {
  id: string
  name: string
  date: string
  location: string
  description?: string
  createdAt: string
  updatedAt: string
  adminId?: string
  guests: Guest[]
}
