

import { brandConfig } from '../config/brandConfig'

export const metadata = {
  title: brandConfig.fullName,
  description: brandConfig.app.description,
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
} 