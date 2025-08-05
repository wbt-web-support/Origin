'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, MapPin, User, Phone, Mail, ChevronRight, Home } from 'lucide-react'

interface Address {
  address_line_1: string
  address_line_2?: string
  street_name?: string
  street_number?: string
  building_name?: string
  sub_building?: string
  town_or_city: string
  county?: string
  postcode: string
  formatted_address: string
  country?: string
}

interface UserInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  countryCode: string
  fullPhoneNumber: string
}

interface QuoteData {
  answers: Record<string, string>
  address: Address
  userInfo: UserInfo
}

export default function ProductPage() {
  const router = useRouter()
  const [quoteData, setQuoteData] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // In a real app, this would come from URL params, session storage, or API
    // For now, we'll simulate getting the data from localStorage
    const storedData = localStorage.getItem('quoteData')
    if (storedData) {
      try {
        setQuoteData(JSON.parse(storedData))
      } catch (error) {
        console.error('Failed to parse quote data:', error)
        router.push('/quote')
        return
      }
    } else {
      // No quote data found, redirect to quote form
      router.push('/quote')
      return
    }
    setLoading(false)
  }, [router])

  const handleNewQuote = () => {
    localStorage.removeItem('quoteData')
    router.push('/quote')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!quoteData) {
    return null
  }

  const { answers, address, userInfo } = quoteData

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-xl font-semibold text-black">Origin</span>
              <ChevronRight size={16} className="text-gray-400" />
              <span className="text-gray-600">Your Quote</span>
            </div>
            <button
              onClick={handleNewQuote}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
            >
              Start New Quote
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Success Header */}
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Check size={32} className="text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Quote Complete!</h1>
            <p className="text-lg text-gray-600">
              Thank you for providing your information. Here's a summary of your quote request.
            </p>
          </div>

          {/* Quote Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Personal Information */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <User size={20} className="text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Personal Information</h2>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600 text-sm w-16">Name:</span>
                  <span className="text-gray-900 font-medium">
                    {userInfo.firstName} {userInfo.lastName}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail size={14} className="text-gray-400" />
                  <span className="text-gray-900">{userInfo.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone size={14} className="text-gray-400" />
                  <span className="text-gray-900">{userInfo.fullPhoneNumber || userInfo.phone}</span>
                </div>
              </div>
            </motion.div>

            {/* Address Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Home size={20} className="text-green-600" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">Property Address</h2>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin size={14} className="text-gray-400 mt-1 flex-shrink-0" />
                  <div className="text-gray-900">
                    <div>{address.address_line_1}</div>
                    {address.address_line_2 && <div>{address.address_line_2}</div>}
                    <div>{address.town_or_city}</div>
                    {address.county && <div>{address.county}</div>}
                    <div className="font-medium">{address.postcode}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quiz Answers */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Answers</h2>
            
            <div className="grid gap-4 sm:grid-cols-2">
              {Object.entries(answers).map(([questionId, answer], index) => (
                <motion.div
                  key={questionId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                  className="p-4 bg-gray-50 rounded-lg"
                >
                  <div className="text-sm text-gray-600 capitalize mb-1">
                    {questionId.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div className="text-gray-900 font-medium">{answer}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="bg-blue-50 rounded-lg border border-blue-200 p-6 text-center"
          >
            <h2 className="text-lg font-semibold text-blue-900 mb-2">What's Next?</h2>
            <p className="text-blue-800 mb-4">
              Our team will review your information and contact you within 24 hours with a personalized quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Download Summary
              </button>
              <button
                onClick={handleNewQuote}
                className="bg-white text-blue-600 border border-blue-300 px-6 py-2 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Get Another Quote
              </button>
            </div>
          </motion.div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Origin. All rights reserved.</p>
            <p className="mt-2">Need help? Call <a href="tel:0330 113 1333" className="text-blue-600 hover:underline">0330 113 1333</a></p>
          </div>
        </div>
      </footer>
    </div>
  )
}
