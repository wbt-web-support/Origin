'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, Check } from 'lucide-react'

interface UserInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
}

interface UserInfoFormProps {
  onUserInfoChange: (userInfo: UserInfo) => void
  className?: string
  initialUserInfo?: UserInfo | null
}

export default function UserInfoForm({ 
  onUserInfoChange, 
  className = '', 
  initialUserInfo = null 
}: UserInfoFormProps) {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    firstName: initialUserInfo?.firstName || '',
    lastName: initialUserInfo?.lastName || '',
    email: initialUserInfo?.email || '',
    phone: initialUserInfo?.phone || ''
  })

  const [errors, setErrors] = useState<Partial<UserInfo>>({})
  const [touched, setTouched] = useState<Partial<Record<keyof UserInfo, boolean>>>({})

  // Update state when initial values change
  useEffect(() => {
    if (initialUserInfo) {
      setUserInfo({
        firstName: initialUserInfo.firstName || '',
        lastName: initialUserInfo.lastName || '',
        email: initialUserInfo.email || '',
        phone: initialUserInfo.phone || ''
      })
    }
  }, [initialUserInfo])

  // Validation functions
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePhone = (phone: string) => {
    // UK phone number validation (basic)
    const phoneRegex = /^(\+44|0)?[1-9]\d{8,10}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
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
        return validatePhone(value) ? '' : 'Please enter a valid UK phone number'
      default:
        return ''
    }
  }

  const handleInputChange = (field: keyof UserInfo, value: string) => {
    const newUserInfo = { ...userInfo, [field]: value }
    setUserInfo(newUserInfo)

    // Validate the field if it's been touched
    if (touched[field]) {
      const error = validateField(field, value)
      setErrors(prev => ({ ...prev, [field]: error }))
    }

    // Call parent callback
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
    
    // Format as UK phone number
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
    return value
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
        <div className="relative">
          <input
            id="phone"
            type="tel"
            value={userInfo.phone}
            onChange={(e) => handleInputChange('phone', formatPhoneNumber(e.target.value))}
            onBlur={() => handleBlur('phone')}
            placeholder="Enter your phone number"
            className={`w-full p-3 pl-10 pr-10 text-base text-gray-900 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              errors.phone ? 'border-red-500 bg-red-50 text-gray-900' : 'border-gray-300 bg-white text-gray-900'
            }`}
            autoComplete="tel"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
            <Phone size={16} className="text-gray-400" />
          </div>
          {userInfo.phone && !errors.phone && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Check size={16} className="text-green-500" />
            </div>
          )}
        </div>
        {errors.phone && (
          <p className="text-red-600 text-sm">{errors.phone}</p>
        )}
        <p className="text-xs text-gray-500">
          We'll use this to contact you about your quote
        </p>
      </div>
    </div>
  )
}
