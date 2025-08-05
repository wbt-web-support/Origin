# Configuration Usage Guide

This document explains how to use the centralized configuration system in `lib/config.ts`.

## Feature Flags

### OTP Verification Control
```typescript
import { isOtpEnabled } from '@/lib/config'

// Check if OTP verification is enabled
if (isOtpEnabled()) {
  // Show OTP verification step
} else {
  // Skip OTP verification
}
```

### Other Feature Flags
```typescript
import { getFeatureFlag } from '@/lib/config'

// Check individual features
const isAddressSearchEnabled = getFeatureFlag('addressSearchEnabled')
const isPhoneValidationEnabled = getFeatureFlag('phoneValidationEnabled')
```

## Company Information

### Basic Company Details
```typescript
import { getCompanyInfo } from '@/lib/config'

const company = getCompanyInfo()
console.log(company.name)    // "Origin"
console.log(company.email)   // "hello@origin.com"
console.log(company.phone)   // "0330 113 1333"
console.log(company.website) // "https://origin.com"
```

### Company Address
```typescript
import { getCompanyInfo } from '@/lib/config'

const { address } = getCompanyInfo()
console.log(address.line1)     // "123 Business Street"
console.log(address.city)      // "London"
console.log(address.postcode)  // "SW1A 1AA"
console.log(address.country)   // "United Kingdom"
```

## Support Methods

```typescript
import { getSupportMethods } from '@/lib/config'

const supportMethods = getSupportMethods()
// Returns array of: phone, email, chat options with descriptions
supportMethods.forEach(method => {
  console.log(method.type)        // 'phone', 'email', 'chat'
  console.log(method.label)       // 'Call us', 'Email us', 'Live chat'
  console.log(method.value)       // The actual contact info
  console.log(method.description) // Additional info
})
```

## OTP Configuration

```typescript
import { getOtpConfig } from '@/lib/config'

const otpConfig = getOtpConfig()
console.log(otpConfig.codeLength)        // 6
console.log(otpConfig.resendCooldown)    // 60 seconds
console.log(otpConfig.autoSubmit)        // true
console.log(otpConfig.verificationTimeout) // 300 seconds (5 minutes)
```

## Phone & Country Configuration

```typescript
import { getCountryCodes, getDefaultCountryCode } from '@/lib/config'

// Get all supported country codes
const countries = getCountryCodes()
// Returns: [{ code: '+44', country: 'UK' }, { code: '+91', country: 'IN' }, ...]

// Get default country code
const defaultCode = getDefaultCountryCode() // '+44'
```

## Progress Steps

```typescript
import { getProgressStep } from '@/lib/config'

const questionProgress = getProgressStep('questions')      // 70%
const addressProgress = getProgressStep('address')         // 85%
const userInfoProgress = getProgressStep('userInfo')       // 95%
const otpProgress = getProgressStep('otpVerification')     // 100%
```

## Environment Overrides

For development/testing, you can override settings in the config file:

```typescript
// In lib/config.ts, at the bottom:
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // Uncomment to disable OTP in development
  // config.features.otpVerificationEnabled = false
  
  // Override company info for testing
  // config.company.phone = '+44 7000 000000'
}
```

## Examples in Components

### Contact Footer Component
```typescript
import { getCompanyInfo, getSupportMethods } from '@/lib/config'

export default function ContactFooter() {
  const company = getCompanyInfo()
  const support = getSupportMethods()
  
  return (
    <footer>
      <p>Contact {company.name} at {company.phone}</p>
      <p>Email: {company.email}</p>
      {support.map(method => (
        <div key={method.type}>
          {method.label}: {method.value}
        </div>
      ))}
    </footer>
  )
}
```

### Conditional OTP in Quote Form
```typescript
import { isOtpEnabled } from '@/lib/config'

export default function QuoteFlow() {
  const otpEnabled = isOtpEnabled()
  
  const steps = [
    'questions',
    'address', 
    'userInfo',
    ...(otpEnabled ? ['otp'] : []), // Only add OTP step if enabled
    'complete'
  ]
  
  // Rest of component logic...
}
```

## Updating Configuration

To modify settings, edit `lib/config.ts`:

```typescript
// To disable OTP verification globally
export const config = {
  features: {
    otpVerificationEnabled: false, // Set to false
    // ...
  },
  
  // To change company details
  company: {
    name: 'Your Company Name',
    email: 'contact@yourcompany.com',
    phone: '+44 20 1234 5678',
    // ...
  }
}
```

All components using the configuration will automatically pick up the changes.
