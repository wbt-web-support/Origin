# Twilio OTP Integration Setup

This project uses Twilio Verify API for phone number verification via SMS OTP codes.

## Setup Instructions

1. **Create a Twilio Account**
   - Sign up at [twilio.com](https://www.twilio.com)
   - Get your Account SID and Auth Token from the console

2. **Create a Verify Service**
   - In Twilio Console, go to Verify > Services
   - Create a new Verify Service
   - Copy the Verify Service SID

3. **Environment Variables**
   - Copy `.env.local.example` to `.env.local`
   - Fill in your Twilio credentials:
     ```
     TWILIO_ACCOUNT_SID=your_account_sid_here
     TWILIO_AUTH_TOKEN=your_auth_token_here
     TWILIO_VERIFY_SID=your_verify_service_sid_here
     ```

4. **Testing**
   - Use your real phone number for testing
   - In development, Twilio may have rate limits
   - Consider using test credentials for development

## Quote Flow

1. User answers quiz questions
2. User enters property address (via postcode search)
3. User enters personal information
4. **OTP Verification** - SMS code sent to phone number
5. After verification, user is redirected to `/product` page with summary

## Phone Number Format

The system accepts UK phone numbers in various formats:
- `07123 456 789`
- `+44 7123 456 789`
- `0712 345 6789`

All formats are normalized to E.164 format (+447123456789) for Twilio.

## Error Handling

The OTP system includes error handling for:
- Invalid phone numbers
- Expired verification codes
- Rate limiting
- Network errors
- Invalid verification codes

## Security Notes

- Never commit `.env.local` to version control
- Rotate your Twilio credentials regularly
- Monitor usage in Twilio Console
- Consider implementing rate limiting on your API endpoints
