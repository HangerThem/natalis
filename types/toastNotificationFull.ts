type ToastNotificationFull = {
  id: string
  type: "warning" | "info" | "success" | "error"
  title: string
  description?: string
  ttl: number
}
