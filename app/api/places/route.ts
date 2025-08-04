import { NextRequest, NextResponse } from 'next/server'

interface GooglePlacesResult {
  places: Array<{
    displayName: { text: string }
    formattedAddress: string
    addressComponents: Array<{
      longText: string
      shortText: string
      types: string[]
    }>
  }>
}

interface Address {
  address_line_1: string
  address_line_2?: string
  town_or_city: string
  county?: string
  postcode: string
  formatted_address: string
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const postcode = searchParams.get('postcode')

  if (!postcode) {
    return NextResponse.json({ error: 'Postcode is required' }, { status: 400 })
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY

  if (!apiKey) {
    return NextResponse.json({ error: 'Google Places API key not configured' }, { status: 500 })
  }

  try {
    // Use Google Places API (New) Text Search
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.addressComponents'
      },
      body: JSON.stringify({
        textQuery: postcode,
        locationBias: {
          rectangle: {
            low: { latitude: 49.5, longitude: -10.5 }, // SW UK
            high: { latitude: 60.9, longitude: 1.8 }   // NE UK
          }
        },
        maxResultCount: 20
      })
    })

    if (!response.ok) {
      throw new Error(`Google Places API error: ${response.status}`)
    }

    const data: GooglePlacesResult = await response.json()

    // Transform Google Places results to our Address format
    const addresses: Address[] = data.places?.map(place => {
      const components = place.addressComponents || []
      
      // Extract address components
      const streetNumber = components.find(c => c.types.includes('street_number'))?.longText || ''
      const route = components.find(c => c.types.includes('route'))?.longText || ''
      const subpremise = components.find(c => c.types.includes('subpremise'))?.longText || ''
      const premise = components.find(c => c.types.includes('premise'))?.longText || ''
      const locality = components.find(c => c.types.includes('locality'))?.longText || 
                       components.find(c => c.types.includes('postal_town'))?.longText || ''
      const adminArea2 = components.find(c => c.types.includes('administrative_area_level_2'))?.longText || ''
      const postalCode = components.find(c => c.types.includes('postal_code'))?.longText || ''

      // Build address line 1
      let addressLine1 = ''
      if (streetNumber && route) {
        addressLine1 = `${streetNumber} ${route}`
      } else if (premise) {
        addressLine1 = premise
      } else if (route) {
        addressLine1 = route
      } else {
        // Fallback to first part of formatted address
        const firstPart = place.formattedAddress.split(',')[0]
        addressLine1 = firstPart
      }

      // Address line 2 for flat/unit numbers
      let addressLine2 = ''
      if (subpremise) {
        addressLine2 = `Flat ${subpremise}`
      }

      return {
        address_line_1: addressLine1,
        address_line_2: addressLine2 || undefined,
        town_or_city: locality,
        county: adminArea2 || undefined,
        postcode: postalCode || postcode.toUpperCase(),
        formatted_address: place.formattedAddress
      }
    }).filter(addr => addr.address_line_1 && addr.town_or_city) || []

    return NextResponse.json({ addresses })

  } catch (error) {
    console.error('Google Places API error:', error)
    return NextResponse.json(
      { error: 'Failed to search addresses' },
      { status: 500 }
    )
  }
}