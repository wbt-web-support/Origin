// Company and application configuration
export const config = {
  // Feature flags
  features: {
    // Set to false to skip OTP verification completely
    otpVerificationEnabled: false,
    // Set to false to skip address search (use manual entry only)
    addressSearchEnabled: true,
    // Set to false to disable phone number validation
    phoneValidationEnabled: true,
  },

  // Company information
  company: {
    name: 'Origin',
    email: 'hello@origin.com',
    phone: '0330 113 1333',
    supportEmail: 'support@origin.com',
    website: 'https://origin.com',
    address: {
      line1: '123 Business Street',
      line2: 'Suite 100',
      city: 'London',
      postcode: 'SW1A 1AA',
      country: 'United Kingdom'
    }
  },

  // OTP configuration
  otp: {
    // Cooldown period in seconds
    resendCooldown: 60,
    // OTP code length
    codeLength: 6,
    // Auto-submit when all digits are entered
    autoSubmit: true,
    // Verification timeout in seconds
    verificationTimeout: 300, // 5 minutes
  },

  // Phone number configuration
  phone: {
    // Default country code
    defaultCountryCode: '+44',
    // Supported country codes
    supportedCountries: [
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
  },

  // API endpoints
  api: {
    otpSend: '/api/otp/send',
    otpVerify: '/api/otp/verify',
    placesSearch: '/api/places',
  },

  // UI configuration
  ui: {
    // Maximum items to show in dropdowns
    maxDropdownItems: 10,
    // Animation duration in milliseconds
    animationDuration: 300,
    // Progress bar steps
    progressSteps: {
      questions: 70,
      address: 85,
      userInfo: 95,
      otpVerification: 100
    }
  },

  // Contact methods for help
  support: {
    methods: [
      {
        type: 'phone',
        label: 'Call us',
        value: '0330 113 1333',
        description: 'Lines are open',
        icon: 'phone'
      },
      {
        type: 'email',
        label: 'Email us',
        value: 'support@origin.com',
        description: 'We typically respond within 24 hours',
        icon: 'mail'
      },
      {
        type: 'chat',
        label: 'Live chat',
        value: 'Start chat',
        description: 'Available during business hours',
        icon: 'message-circle'
      }
    ]
  }
}

// Helper functions
export const getFeatureFlag = (feature: keyof typeof config.features): boolean => {
  return config.features[feature]
}

export const getCompanyInfo = () => {
  return config.company
}

export const getSupportMethods = () => {
  return config.support.methods
}

export const getCountryCodes = () => {
  return config.phone.supportedCountries
}

export const getDefaultCountryCode = () => {
  return config.phone.defaultCountryCode
}

export const isOtpEnabled = () => {
  return config.features.otpVerificationEnabled
}

export const getOtpConfig = () => {
  return config.otp
}

export const getProgressStep = (step: keyof typeof config.ui.progressSteps) => {
  return config.ui.progressSteps[step]
}

// Environment-based overrides (for development/testing)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  // You can override settings in development
  // config.features.otpVerificationEnabled = false // Uncomment to disable OTP in dev
}

export default config
