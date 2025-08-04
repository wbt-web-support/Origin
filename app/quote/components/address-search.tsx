'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Address {
  address_line_1: string
  address_line_2?: string
  town_or_city: string
  county?: string
  postcode: string
  formatted_address: string
}

interface AddressSearchProps {
  onAddressSelect: (address: Address) => void
  className?: string
}

export default function AddressSearch({ onAddressSelect, className = '' }: AddressSearchProps) {
  const [postcode, setPostcode] = useState('')
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Address search function - replace mock with actual Google Places API
  const searchAddresses = async (postcode: string) => {
    setLoading(true)
    setError('')
    
    try {
      // TODO: Replace with actual Google Places API call
      // 
      // For production implementation:
      // 1. Get Google Places API key from environment variables
      // 2. Use Google Places API (New) Text Search endpoint
      // 3. Search for addresses by postcode in UK
      // 
      // Example implementation:
      // const response = await fetch(`/api/places?postcode=${encodeURIComponent(postcode)}`)
      // const data = await response.json()
      // 
      // API endpoint should:
      // - Use Google Places API Text Search
      // - Filter results by country:GB and postal_code
      // - Return formatted addresses in the Address interface format
      
      // Simulate API delay for demo
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock data - replace with actual API response
      const mockAddresses: Address[] = [
        {
          address_line_1: '123 High Street',
          town_or_city: 'London',
          county: 'Greater London',
          postcode: postcode.toUpperCase(),
          formatted_address: `123 High Street, London, ${postcode.toUpperCase()}`
        },
        {
          address_line_1: '456 Church Lane',
          address_line_2: 'Flat 2',
          town_or_city: 'London',
          county: 'Greater London', 
          postcode: postcode.toUpperCase(),
          formatted_address: `456 Church Lane, Flat 2, London, ${postcode.toUpperCase()}`
        },
        {
          address_line_1: '789 Market Square',
          town_or_city: 'London',
          county: 'Greater London',
          postcode: postcode.toUpperCase(),
          formatted_address: `789 Market Square, London, ${postcode.toUpperCase()}`
        }
      ]
      
      setAddresses(mockAddresses)
      setShowDropdown(true)
    } catch (err) {
      setError('Failed to search addresses. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePostcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (postcode.trim().length >= 5) {
      searchAddresses(postcode.trim())
    }
  }

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address)
    setShowDropdown(false)
    onAddressSelect(address)
  }

  const formatPostcode = (value: string) => {
    // Basic UK postcode formatting
    const cleaned = value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()
    if (cleaned.length <= 4) return cleaned
    return `${cleaned.slice(0, -3)} ${cleaned.slice(-3)}`
  }

  const handlePostcodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPostcode(e.target.value)
    setPostcode(formatted)
    setError('')
    if (addresses.length > 0) {
      setAddresses([])
      setShowDropdown(false)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Postcode Search */}
      <form onSubmit={handlePostcodeSubmit} className="space-y-4">
        <div className="relative">
          <input
            type="text"
            value={postcode}
            onChange={handlePostcodeChange}
            placeholder="Enter your postcode (e.g. SW1A 1AA)"
            className="w-full p-4 pr-12 text-lg border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={8}
          />
          <button
            type="submit"
            disabled={loading || postcode.length < 5}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search size={20} />
            )}
          </button>
        </div>
        
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
      </form>

      {/* Address Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <AnimatePresence>
          {showDropdown && addresses.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="absolute top-0 left-0 right-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto"
            >
              <div className="p-2">
                <p className="text-sm text-gray-600 px-3 py-2 border-b">
                  Select your address:
                </p>
                {addresses.map((address, index) => (
                  <button
                    key={index}
                    onClick={() => handleAddressSelect(address)}
                    className="w-full text-left p-3 hover:bg-gray-50 rounded-md flex items-start space-x-2 transition-colors"
                  >
                    <MapPin size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-gray-900">{address.address_line_1}</p>
                      {address.address_line_2 && (
                        <p className="text-sm text-gray-600">{address.address_line_2}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {address.town_or_city}, {address.postcode}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Address Display */}
      {selectedAddress && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4"
        >
          <div className="flex items-center space-x-2 mb-2">
            <MapPin size={16} className="text-green-600" />
            <span className="text-sm font-medium text-green-800">Selected Address:</span>
          </div>
          <div className="text-gray-900">
            <p className="font-medium">{selectedAddress.address_line_1}</p>
            {selectedAddress.address_line_2 && (
              <p>{selectedAddress.address_line_2}</p>
            )}
            <p>{selectedAddress.town_or_city}, {selectedAddress.postcode}</p>
            {selectedAddress.county && (
              <p className="text-sm text-gray-600">{selectedAddress.county}</p>
            )}
          </div>
        </motion.div>
      )}

      {/* Manual Address Input Option */}
      {!selectedAddress && (
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Can't find your address?</p>
          <button
            type="button"
            onClick={() => {
              // You can implement manual address entry here
              console.log('Manual address entry clicked')
            }}
            className="text-blue-600 hover:underline text-sm font-medium"
          >
            Enter address manually
          </button>
        </div>
      )}
    </div>
  )
}