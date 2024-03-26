import React from 'react'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '/src//components/Navbar/Navbar'
import Footer from '/src//components/Footer/Footer'
import { ThemeProvider } from '/src//context/ThemeContext'
import AuthProvider from '/src//components/AuthProvider/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Next Bridge School',
  description: 'Next Bridge School',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <div className='container'>
              <Navbar />
              {children}
              <Footer />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
