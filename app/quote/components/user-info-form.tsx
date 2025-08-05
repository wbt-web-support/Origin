'use client'

import { useState, useEffect, useRef } from 'react'
import { Mail, Phone, Check, ChevronDown } from 'lucide-react'

interface UserInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  countryCode: string
  fullPhoneNumber: string // This will be the complete international format
}

// Popular country codes
const COUNTRY_CODES = [
  { code: '+44', country: 'UK' },
  { code: '+91', country: 'IN' },
  { code: '+1', country: 'US' },
  { code: '+33', country: 'FR' },
  { code: '+49', country: 'DE' },
  { code: '+39', country: 'IT' },
  { code: '+34', country: 'ES' },
  { code: '+31', country: 'NL' },
  { code: '+32', country: 'BE' },
  { code: '+41', country: 'CH' },
  { code: '+43', country: 'AT' },
]

// Detect country code from phone number
const detectCountryCode = (phone: string): string => {
  const cleaned = phone.replace(/\s/g, '')
  if (cleaned.startsWith('+44') || cleaned.startsWith('0')) return '+44'
  if (cleaned.startsWith('+91')) return '+91'
  if (cleaned.startsWith('+1')) return '+1'
  if (cleaned.startsWith('+33')) return '+33'
  if (cleaned.startsWith('+49')) return '+49'
  if (cleaned.startsWith('+39')) return '+39'
  if (cleaned.startsWith('+34')) return '+34'
  if (cleaned.startsWith('+31')) return '+31'
  if (cleaned.startsWith('+32')) return '+32'
  if (cleaned.startsWith('+41')) return '+41'
  if (cleaned.startsWith('+43')) return '+43'
  return '+44' // Default to UK
}

interface UserInfoFormProps {
  onUserInfoChange: (userInfo: UserInfo) => void
  onContinue?: () => void
  className?: string
  initialUserInfo?: UserInfo | null
}

export default function UserInfoForm({ 
  onUserInfoChange, 
  onContinue,
  className = '', 
  initialUserInfo = null 
}: UserInfoFormProps) {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: initialUserInfo?.firstName || '',
    lastName: initialUserInfo?.lastName || '',
    email: initialUserInfo?.email || '',
    phone: initialUserInfo?.phone || '',
    countryCode: initialUserInfo?.countryCode || detectCountryCode(initialUserInfo?.phone || ''),
    fullPhoneNumber: initialUserInfo?.fullPhoneNumber || ''
  })

  const [errors, setErrors] = useState<Partial<UserInfo>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof UserInfo, boolean>>>({})
  const [showCountryDropdown, setShowCountryDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Update state when initial values change
  useEffect(() => {
    if (initialUserInfo) {
      const detectedCountryCode = detectCountryCode(initialUserInfo.phone || '')
      setUserInfo({
        firstName: initialUserInfo.firstName || '',
        lastName: initialUserInfo.lastName || '',
        email: initialUserInfo.email || '',
        phone: initialUserInfo.phone || '',
        countryCode: initialUserInfo.countryCode || detectedCountryCode,
        fullPhoneNumber: initialUserInfo.fullPhoneNumber || ''
      })
    }
  }, [initialUserInfo])

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCountryDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string, countryCode: string) => {
    // Remove spaces and special characters
    const cleaned = phone.replace(/\s/g, '')
    
    // Validate based on country code
    switch (countryCode) {
      case '+44': // UK
        return /^[1-9]\d{8,10}$/.test(cleaned) || /^0[1-9]\d{8,9}$/.test(cleaned)
      case '+91': // India
        return /^[6-9]\d{9}$/.test(cleaned)
      case '+1': // US/Canada
        return /^[2-9]\d{9}$/.test(cleaned)
      case '+33': // France
        return /^[1-9]\d{8}$/.test(cleaned)
      case '+49': // Germany
        return /^[1-9]\d{6,11}$/.test(cleaned)
      default:
        return /^[1-9]\d{6,14}$/.test(cleaned) // Generic international
    }
  }

  const createFullPhoneNumber = (phone: string, countryCode: string): string => {
    const cleaned = phone.replace(/\s/g, '')
    
    // If phone already has country code, return as is
    if (cleaned.startsWith('+')) {
      return cleaned
    }
    
    // Remove leading zero for UK numbers
    if (countryCode === '+44' && cleaned.startsWith('0')) {
      return countryCode + cleaned.slice(1)
    }
    
    return countryCode + cleaned
  }

  const validateField = (field: keyof UserInfo, value: string) => {
    switch (field) {
      case 'firstName':
        return value.trim().length >= 2 ? '' : 'First name must be at least 2 characters'
      case 'lastName':
        return value.trim().length >= 2 ? '' : 'Last name must be at least 2 characters'
      case 'email':
        return validateEmail(value) ? '' : 'Please enter a valid email address'
      case 'phone':
        return validatePhone(value, userInfo.countryCode) ? '' : 'Please enter a valid phone number'
      default:
        return ''
    }
  }

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    let newUserInfo = { ...userInfo, [field]: value }
    
    // If phone number changed, update full phone number
    if (field === 'phone') {
      newUserInfo.fullPhoneNumber = createFullPhoneNumber(value, userInfo.countryCode)
    }
    
    setUserInfo(newUserInfo)

    // Validate the field if it's been touched
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }

    // Call parent callback
    onUserInfoChange(newUserInfo)
  }

  const handleCountryCodeChange = (newCountryCode: string) => {
    const newUserInfo = { 
      ...userInfo, 
      countryCode: newCountryCode,
      fullPhoneNumber: createFullPhoneNumber(userInfo.phone, newCountryCode)
    }
    setUserInfo(newUserInfo)
    setShowCountryDropdown(false)
    
    // Revalidate phone if it's been touched
    if (touched.phone) {
      const error = validateField('phone', userInfo.phone)
      setErrors(prev => ({ ...prev, phone: error }))
    }
    
    onUserInfoChange(newUserInfo)
  }

  const handleBlur = (field: keyof UserInfo) => {
    setTouched(prev => ({ ...prev, [field]: true }))
    const error = validateField(field, userInfo[field])
    setErrors(prev => ({ ...prev, [field]: error }))
  }

  const formatPhoneNumber = (value: string) => {
    // Remove all non-digits
    const cleaned = value.replace(/\D/g, '')
    
    // Format based on detected or selected country code
    if (userInfo.countryCode === '+44') {
      // UK format
      if (cleaned.length <= 11) {
        if (cleaned.startsWith('44')) {
          // +44 format
          return cleaned.replace(/(\d{2})(\d{4})(\d{3})(\d{3})/, '+$1 $2 $3 $4')
        } else if (cleaned.startsWith('0')) {
          // 0xxxx format
          return cleaned.replace(/(\d{1})(\d{4})(\d{3})(\d{3})/, '$1$2 $3 $4')
        } else {
          // Regular format
          return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
        }
      }
    } else if (userInfo.countryCode === '+91') {
      // Indian format
      if (cleaned.length <= 10) {
        return cleaned.replace(/(\d{5})(\d{5})/, '$1 $2')
      }
    } else {
      // Generic international format
      if (cleaned.length <= 12) {
        return cleaned.replace(/(\d{4})(\d{3})(\d{3})/, '$1 $2 $3')
      }
    }
    return value
  }

  const isFormValid = () => {
    const fields: (keyof UserInfo)[] = ['firstName', 'lastName', 'email', 'phone']
    return fields.every(field => {
      const value = userInfo[field]
      return value.trim() !== '' && validateField(field, value) === ''
    })
  }

  const handleContinue = () => {
    // Validate all fields
    const fields: (keyof UserInfo)[] = ['firstName', 'lastName', 'email', 'phone']
    const newErrors: Partial<UserInfo> = {}
    const newTouched: Partial<Record<keyof UserInfo, boolean>> = {}
    
    fields.forEach(field => {
      newTouched[field] = true
      const error = validateField(field, userInfo[field])
      if (error) newErrors[field] = error
    })
    
    setTouched(newTouched)
    setErrors(newErrors)
    
    // Only continue if no errors
    if (Object.keys(newErrors).length === 0 && onContinue) {
      onContinue()
    }
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* First Name */}
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <div className="relative">
            <input
              id="firstName"
              type="text"
              value={userInfo.firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              onBlur={() => handleBlur('firstName')}
              placeholder="Enter your first name"
              className={`w-full p-3 px-5 pr-10 text-base text-gray-900 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.firstName ? 'border-red-500 bg-red-50 text-gray-900' : 'border-gray-300 bg-white text-gray-900'
              }`}
              autoComplete="given-name"
            />
            {userInfo.firstName && !errors.firstName && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Check size={16} className="text-green-500" />
              </div>
            )}
          </div>
          {errors.firstName && (
            <p className="text-red-600 text-sm">{errors.firstName}</p>
          )}
        </div>

        {/* Last Name */}
        <div className="space-y-2">
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <div className="relative">
            <input
              id="lastName"
              type="text"
              value={userInfo.lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              onBlur={() => handleBlur('lastName')}
              placeholder="Enter your last name"
              className={`w-full p-3 pr-10 text-base text-gray-900 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.lastName ? 'border-red-500 bg-red-50 text-gray-900' : 'border-gray-300 bg-white text-gray-900'
              }`}
              autoComplete="family-name"
            />
            {userInfo.lastName && !errors.lastName && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Check size={16} className="text-green-500" />
              </div>
            )}
          </div>
          {errors.lastName && (
            <p className="text-red-600 text-sm">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address *
        </label>
        <div className="relative">
          <input
            id="email"
            type="email"
            value={userInfo.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            onBlur={() => handleBlur('email')}
            placeholder="Enter your email address"
            className={`w-full p-3 pl-10 pr-10 text-base text-gray-900 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.email ? 'border-red-500 bg-red-50 text-gray-900' : 'border-gray-300 bg-white text-gray-900'
            }`}
            autoComplete="email"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Mail size={16} className="text-gray-400" />
          </div>
          {userInfo.email && !errors.email && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Check size={16} className="text-green-500" />
            </div>
          )}
        </div>
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          Phone Number *
        </label>
        <div className="relative flex">
          {/* Country Code Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setShowCountryDropdown(!showCountryDropdown)}
              className="h-full px-4 py-3 bg-gray-50 border border-r-0 border-gray-300 rounded-l-full flex items-center space-x-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors min-w-20"
            >
              <span className="text-sm font-medium text-gray-700">
                {userInfo.countryCode}
              </span>
              <ChevronDown size={14} className={`text-gray-400 transition-transform ${showCountryDropdown ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Dropdown */}
            {showCountryDropdown && (
              <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-20 max-h-72 overflow-y-auto w-40">
                <div className="py-2">
                  {COUNTRY_CODES.map((country) => (
                    <button
                      key={country.code}
                      type="button"
                      onClick={() => handleCountryCodeChange(country.code)}
                      className={`w-full px-3 py-2.5 text-left hover:bg-blue-50 flex items-center justify-between text-sm transition-colors ${
                        userInfo.countryCode === country.code ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900">{country.code}</span>
                        <span className="text-gray-600 text-xs">{country.country}</span>
                      </div>
                      {userInfo.countryCode === country.code && (
                        <Check size={14} className="text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Phone Input */}
          <div className="flex-1 relative">
            <input
              id="phone"
              type="tel"
              value={userInfo.phone}
              onChange={(e) => handleInputChange('phone', formatPhoneNumber(e.target.value))}
              onBlur={() => handleBlur('phone')}
              placeholder="Enter your phone number"
              className={`w-full p-3 pl-4 pr-10 text-base text-gray-900 border border-l-0 rounded-r-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                errors.phone ? 'border-red-500 bg-red-50 text-gray-900' : 'border-gray-300 bg-white text-gray-900'
              }`}
              autoComplete="tel"
            />
            {userInfo.phone && !errors.phone && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Check size={16} className="text-green-500" />
              </div>
            )}
          </div>
        </div>
        {errors.phone && (
          <p className="text-red-600 text-sm">{errors.phone}</p>
        )}
        <div className="flex justify-between items-center">
          <p className="text-xs text-gray-500">
            We'll use this to contact you about your quote
          </p>
          {userInfo.fullPhoneNumber && (
            <p className="text-xs text-gray-600 font-medium">
              Full: {userInfo.fullPhoneNumber}
            </p>
          )}
        </div>
      </div>

      {/* Continue Button */}
      {onContinue && (
        <div className="pt-4">
          <button
            onClick={handleContinue}
            disabled={!isFormValid()}
            className={`w-full py-3 px-6 rounded-full text-base font-medium transition-colors ${
              isFormValid()
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}
