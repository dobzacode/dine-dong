import { getGeolocation } from '@/lib/server-only-utils';
import { AxiomRequest, withAxiom } from 'next-axiom';

import { NextResponse } from 'next/server';

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

const autocomplete = withAxiom(async (req: AxiomRequest) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY!;
  if (!apiKey) {
    req.log.error('Missing API Key');
    return NextResponse.json({ error: 'Missing API Key', data: null });
  }

  const { searchParams } = new URL(req.url, `http://${req.headers?.get('host')}`);

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
      req.log.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return NextResponse.json({ data: data.suggestions, error: null });
  } catch (error) {
    error instanceof Error && req.log.error(`Error fetching autocomplete suggestions`, { error });
    console.error('Error fetching autocomplete suggestions:', error);
    return NextResponse.json({ error: error, data: null });
  }
});

export const GET = autocomplete;

export const dynamic = 'force-dynamic';
