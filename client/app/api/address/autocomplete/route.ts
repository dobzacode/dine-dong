import { getGeolocation } from '@/lib/server-only-utils';
import { NextResponse, type NextRequest } from 'next/server';

interface Place {
  placePrediction: {
    place: string;
    placeId: string;
    text: {
      text: string;
      matches: unknown[];
    };
    structuredFormat: {
      mainText: {
        text: string;
        matches: unknown[];
      };
      secondaryText: {
        text: string;
      };
    };
    types: string[];
  };
}

interface Response {
  suggestions: Place[];
}

export async function GET(req: NextRequest) {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY!;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing API Key', data: null });
  }

  const { searchParams } = new URL(req.url, `http://${req.headers?.get('host')}`);
  // Check if your hosting provider gives you the country code
  const country = await getGeolocation();
  const input = searchParams.get('input');
  const url = 'https://places.googleapis.com/v1/places:autocomplete';

  const primaryTypes = ['street_address', 'subpremise', 'route', 'street_number', 'landmark'];

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey
      },
      body: JSON.stringify({
        input: input,
        includedPrimaryTypes: primaryTypes,
        languageCode: 'fr',
        includedRegionCodes: [country ?? 'FR']
      })
    });

    const data = (await response.json()) as Response;

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return NextResponse.json({ data: data.suggestions, error: null });
  } catch (error) {
    console.error('Error fetching autocomplete suggestions:', error);
    return NextResponse.json({ error: error, data: null });
  }
}
