type ToastNotificationSimple = {
  type: "warning" | "info" | "success" | "error"
  title: string
  description?: string
  ttl?: number
}
