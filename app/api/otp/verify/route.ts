import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber, code, verificationSid } = await request.json()

    if (!phoneNumber || !code) {
      return NextResponse.json(
        { error: 'Phone number and verification code are required' },
        { status: 400 }
      )
    }

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const verifySid = process.env.TWILIO_VERIFY_SID

    if (!accountSid || !authToken || !verifySid) {
      console.error('Missing Twilio credentials')
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Format phone number for Twilio (ensure it starts with +)
    let formattedPhone = phoneNumber.replace(/\s/g, '')
    if (!formattedPhone.startsWith('+')) {
      // If it starts with 0, assume UK number
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+44' + formattedPhone.slice(1)
      } 
      // If it starts with 91, assume Indian number
      else if (formattedPhone.startsWith('91')) {
        formattedPhone = '+' + formattedPhone
      }
      // If it's 10 digits starting with 6-9, assume Indian number
      else if (/^[6-9]\d{9}$/.test(formattedPhone)) {
        formattedPhone = '+91' + formattedPhone
      }
      else {
        formattedPhone = '+' + formattedPhone
      }
    }

    // Initialize Twilio client
    const twilioClient = twilio(accountSid, authToken)

    // Verify the code
    const verificationCheck = await twilioClient.verify.v2
      .services(verifySid)
      .verificationChecks.create({
        to: formattedPhone,
        code: code
      })

    return NextResponse.json({
      success: true,
      status: verificationCheck.status,
      valid: verificationCheck.status === 'approved'
    })

  } catch (error: any) {
    console.error('Twilio verify OTP error:', error)
    
    // Handle specific Twilio errors
    if (error.code === 20404) {
      return NextResponse.json(
        { error: 'Verification code has expired or is invalid' },
        { status: 400 }
      )
    } else if (error.code === 60202) {
      return NextResponse.json(
        { error: 'Maximum number of verification attempts reached' },
        { status: 429 }
      )
    } else if (error.code === 60203) {
      return NextResponse.json(
        { error: 'Invalid verification code' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to verify code' },
      { status: 500 }
    )
  }
}
