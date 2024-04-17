import { GlobalStyle } from "@/styles/global"
import { AuthProvider } from "@/context/authContext"
import { ToastProvider } from "@/context/toastContext"
import StyledComponentsRegistry from "@/lib/registry"
import { K2D } from "next/font/google"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Navalis",
  description: "Navalis is a platform for managing your events",
  creator: "Frank Borisjuk",
  keywords: ["events", "management", "platform"],
  authors: [
    {
      name: "HangerThem",
      url: "https://github.com/HangerThem",
    },
  ],
  classification: "Events",
  category: "Events",
  publisher: "Navalis",
  referrer: "origin",
  generator: "Next.js",
  robots: "index, follow",
  manifest: "/manifest.json",
}

const k2d = K2D({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  preload: true,
  subsets: ["latin-ext"],
  adjustFontFallback: true,
  fallback: ["sans-serif"],
  display: "swap",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <StyledComponentsRegistry>
        <GlobalStyle />
        <body className={k2d.className}>
          <ToastProvider>
            <AuthProvider>{children}</AuthProvider>
          </ToastProvider>
        </body>
      </StyledComponentsRegistry>
    </html>
  )
}
