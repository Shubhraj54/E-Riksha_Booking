import './ride_globals.css'

export const metadata = {
  title: 'Rapido - India\'s #1 Bike Taxi Service',
  description: 'Book bike rides, auto rides, and delivery services at affordable prices. Fast, safe, and reliable transportation across India.',
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