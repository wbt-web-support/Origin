import { NextRequest, NextResponse } from 'next/server'
import twilio from 'twilio'

export async function POST(request: NextRequest) {
  try {
    const { phoneNumber } = await request.json()

    if (!phoneNumber) {
      return NextResponse.json(
        { error: 'Phone number is required' },
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

    // Send verification code
    const verification = await twilioClient.verify.v2
      .services(verifySid)
      .verifications.create({
        to: formattedPhone,
        channel: 'sms'
      })

    return NextResponse.json({
      success: true,
      sid: verification.sid,
      status: verification.status
    })

  } catch (error: any) {
    console.error('Twilio send OTP error:', error)
    
    // Handle specific Twilio errors
    if (error.code === 20003) {
      return NextResponse.json(
        { error: 'Invalid phone number format' },
        { status: 400 }
      )
    } else if (error.code === 20404) {
      return NextResponse.json(
        { error: 'The phone number is not valid' },
        { status: 400 }
      )
    } else if (error.code === 60200) {
      return NextResponse.json(
        { error: 'Invalid phone number' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Failed to send verification code' },
      { status: 500 }
    )
  }
}
