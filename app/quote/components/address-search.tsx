'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

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

interface AddressSearchProps {
  onAddressSelect: (address: Address | null) => void
  onContinue?: () => void
  className?: string
  initialAddress?: Address | null
  initialPostcode?: string
}

export default function AddressSearch({ 
  onAddressSelect, 
  onContinue,
  className = '', 
  initialAddress = null, 
  initialPostcode = '' 
}: AddressSearchProps) {
  const [postcode, setPostcode] = useState(initialPostcode)
  const [addresses, setAddresses] = useState<Address[]>([])
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(initialAddress)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState(-1)
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Search addresses using Google Places API
  const searchAddresses = async (postcode: string, isLiveSearch = false) => {
    if (!postcode.trim() || postcode.trim().length < 3) {
      setAddresses([])
      setShowDropdown(false)
      setHighlightedIndex(-1)
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const response = await fetch(`/api/places?postcode=${encodeURIComponent(postcode)}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }
      
      if (!data.addresses || data.addresses.length === 0) {
        if (!isLiveSearch) {
          setError('No addresses found for this postcode. Please check and try again.')
        }
        setAddresses([])
        setShowDropdown(false)
        setHighlightedIndex(-1)
        return
      }
      
      setAddresses(data.addresses)
      setShowDropdown(true)
      setHighlightedIndex(-1)
      // Reset refs array for new addresses
      itemRefs.current = new Array(data.addresses.length).fill(null)
    } catch (err) {
      console.error('Address search error:', err)
      if (!isLiveSearch) {
        setError('Failed to search addresses. Please try again.')
      }
      setAddresses([])
      setShowDropdown(false)
      setHighlightedIndex(-1)
    } finally {
      setLoading(false)
    }
  }

  const handleAddressSelect = (address: Address) => {
    setSelectedAddress(address)
    setShowDropdown(false)
    setHighlightedIndex(-1)
    setPostcode(address.postcode)
    onAddressSelect(address)
  }

  // Scroll highlighted item into view
  const scrollToHighlightedItem = (index: number) => {
    if (itemRefs.current[index]) {
      itemRefs.current[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      })
    }
  }

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || addresses.length === 0) {
      if (e.key === 'Enter') {
        e.preventDefault()
        if (postcode.trim().length >= 3) {
          searchAddresses(postcode.trim())
        }
      }
      return
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setHighlightedIndex(prev => {
          const newIndex = prev < addresses.length - 1 ? prev + 1 : 0
          setTimeout(() => scrollToHighlightedItem(newIndex), 0)
          return newIndex
        })
        break
      case 'ArrowUp':
        e.preventDefault()
        setHighlightedIndex(prev => {
          const newIndex = prev > 0 ? prev - 1 : addresses.length - 1
          setTimeout(() => scrollToHighlightedItem(newIndex), 0)
          return newIndex
        })
        break
      case 'Enter':
        e.preventDefault()
        if (highlightedIndex >= 0 && highlightedIndex < addresses.length) {
          handleAddressSelect(addresses[highlightedIndex])
        }
        break
      case 'Escape':
        setShowDropdown(false)
        setHighlightedIndex(-1)
        inputRef.current?.blur()
        break
    }
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
    setSelectedAddress(null)
    
    // Clear existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    
    // Set new timeout for live search
    const newTimeout = setTimeout(() => {
      if (formatted.trim().length >= 3) {
        searchAddresses(formatted.trim(), true)
      } else {
        setAddresses([])
        setShowDropdown(false)
        setHighlightedIndex(-1)
      }
    }, 300) // 300ms delay for live search
    
    setSearchTimeout(newTimeout)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
        setHighlightedIndex(-1)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      // Cleanup timeout on unmount
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }
    }
  }, [searchTimeout])

  // Update state when initial values change
  useEffect(() => {
    if (initialAddress !== selectedAddress) {
      setSelectedAddress(initialAddress)
    }
    if (initialPostcode !== postcode && initialPostcode !== undefined && initialPostcode !== '') {
      setPostcode(initialPostcode)
    }
  }, [initialAddress, initialPostcode, selectedAddress])

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Postcode Search */}
      <div className="space-y-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={postcode}
            onChange={handlePostcodeChange}
            onKeyDown={handleKeyDown}
            placeholder="Start typing your postcode (e.g. SW1A 1AA)"
            className="w-full p-4 px-6 pr-12 bg-white text-gray-900 text-lg border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={8}
            autoComplete="postal-code"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2">
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <Search size={20} className="text-gray-400" />
            )}
          </div>
        </div>
        
        {error && (
          <p className="text-red-600 text-sm">{error}</p>
        )}
      </div>

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
                  Select your address (use ↑↓ arrow keys and Enter):
                </p>
                <div>
                  {addresses.map((address, index) => (
                    <button
                      key={index}
                      ref={(el) => { itemRefs.current[index] = el }}
                      onClick={() => handleAddressSelect(address)}
                      className={`w-full text-left p-3 rounded-md flex items-start space-x-3 transition-colors ${
                        index === highlightedIndex 
                          ? 'bg-blue-50 border-l-4 border-blue-500' 
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <MapPin size={16} className={`mt-1 flex-shrink-0 ${
                        index === highlightedIndex ? 'text-blue-500' : 'text-gray-400'
                      }`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-medium text-gray-900 truncate">{address.address_line_1}</p>
                          {address.street_number && (
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              #{address.street_number}
                            </span>
                          )}
                        </div>
                        
                        {address.address_line_2 && (
                          <p className="text-sm text-gray-600 mb-1">{address.address_line_2}</p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                          <span>{address.town_or_city}</span>
                          {address.county && (
                            <>
                              <span>•</span>
                              <span>{address.county}</span>
                            </>
                          )}
                          <span>•</span>
                          <span className="font-medium">{address.postcode}</span>
                        </div>
                        
                        {(address.building_name || address.sub_building) && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {address.building_name && (
                              <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                                {address.building_name}
                              </span>
                            )}
                            {address.sub_building && (
                              <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
                                Unit {address.sub_building}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                {addresses.length > 5 && (
                  <p className="text-xs text-gray-500 px-3 py-2 border-t bg-gray-50">
                    Showing {addresses.length} addresses • Use arrow keys to navigate
                  </p>
                )}
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
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <MapPin size={16} className="text-green-600" />
              <span className="text-sm font-medium text-green-800">Selected Address:</span>
            </div>
            <button
              onClick={() => {
                setSelectedAddress(null)
                setPostcode('')
                setError('')
                setShowDropdown(false)
                setHighlightedIndex(-1)
                // Notify parent that address was cleared
                onAddressSelect(null)
                inputRef.current?.focus()
              }}
              className="text-sm text-green-700 hover:text-green-800 underline"
            >
              Change
            </button>
          </div>
          
          <div className="space-y-2">
            <div className="text-gray-900">
              <p className="font-semibold text-lg">{selectedAddress.address_line_1}</p>
              {selectedAddress.address_line_2 && (
                <p className="text-gray-700">{selectedAddress.address_line_2}</p>
              )}
            </div>
            
            <div className="text-gray-700">
              <p>{selectedAddress.town_or_city}</p>
              {selectedAddress.county && (
                <p className="text-sm">{selectedAddress.county}</p>
              )}
              <p className="font-medium">{selectedAddress.postcode}</p>
              {selectedAddress.country && (
                <p className="text-sm text-gray-500">{selectedAddress.country}</p>
              )}
            </div>
            
            {(selectedAddress.building_name || selectedAddress.sub_building || selectedAddress.street_name) && (
              <div className="pt-2 border-t border-green-200">
                <p className="text-xs font-medium text-green-800 mb-1">Additional Details:</p>
                <div className="flex flex-wrap gap-2">
                  {selectedAddress.street_name && (
                    <span className="text-xs bg-white text-gray-700 px-2 py-1 rounded border">
                      Street: {selectedAddress.street_name}
                    </span>
                  )}
                  {selectedAddress.building_name && (
                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
                      Building: {selectedAddress.building_name}
                    </span>
                  )}
                  {selectedAddress.sub_building && (
                    <span className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded border border-purple-200">
                      Unit: {selectedAddress.sub_building}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Continue Button */}
      {selectedAddress && onContinue && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex justify-center"
        >
          <button
            onClick={onContinue}
            className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full font-medium text-base transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
          >
            Continue
          </button>
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