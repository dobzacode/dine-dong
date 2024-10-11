import { type AddressType } from '@/components/ui/address-autocomplete';
import { AxiomRequest, withAxiom } from 'next-axiom';
import { NextResponse } from 'next/server';

interface PlusCode {
  compound_code: string;
  global_code: string;
}

interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
  languageCode: string;
}

interface Result {
  address_components: AddressComponent[];
  formatted_address: string;
  place_id: string;
  plus_code?: PlusCode;
  // Optional, as not all results have plus_code
  types: string[];
}

interface GooglePlacesApiResponse {
  plus_code: PlusCode;
  results: Result[];
  status: string;
}

interface AddressComponent {
  longText: string;
  shortText: string;
  types: string[];
  languageCode: string;
  long_name: string;
}

interface Location {
  latitude: number;
  longitude: number;
}

interface AddressData {
  formattedAddress: string;
  addressComponents: AddressComponent[];
  location: Location;
  adrFormatAddress: string;
  shortFormattedAddress: string;
}

function getDepartment(data: GooglePlacesApiResponse) {
  const results = data.results;
  if (results && results.length > 0) {
    const addressComponents = results[0]?.address_components;
    if (!addressComponents) {
      return null;
    }
    for (const component of addressComponents) {
      if (component.types.includes('administrative_area_level_2')) {
        return component.long_name;
      }
    }
  }
  return null;
}

const placeDetails = withAxiom(async (req: AxiomRequest) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY!;

  if (!apiKey) {
    req.log.error('Missing API Key');
    return NextResponse.json({ error: 'Missing API Key', data: null });
  }

  const { searchParams } = new URL(req.url, `http://${req.headers?.get('host')}`);
  const placeId = searchParams.get('placeId');
  const url = `https://places.googleapis.com/v1/${placeId}`;

  try {
    const response = await fetch(url, {
      headers: {
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'adrFormatAddress,shortFormattedAddress,formattedAddress,location',
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      req.log.error(`HTTP error! status: ${response.status}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = (await response.json()) as AddressData;

    const dataFinderRegx = (c: string) => {
      const regx = new RegExp(`<span class="${c}">([^<]+)<\/span>`);
      const match = data.adrFormatAddress.match(regx);
      return match ? match[1] : '';
    };

    const address1 = dataFinderRegx('street-address')?.replace('&#39;', "'");
    const address2 = '';
    const city = dataFinderRegx('locality')?.replace('&#39;', "'");
    const postalCode = dataFinderRegx('postal-code')?.replace('&#39;', "'");
    const country = dataFinderRegx('country-name')?.replace('&#39;', "'");
    const lat = data.location.latitude;
    const lng = data.location.longitude;

    const geocoding = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );

    const geocodingData = (await geocoding.json()) as GooglePlacesApiResponse;

    const department = getDepartment(geocodingData);

    const formattedAddress = data.formattedAddress;

    const formattedData: AddressType = {
      address1: address1 ?? '',
      address2: address2 ?? '',
      formattedAddress,
      city: city ?? '',
      department: department ?? '',
      postalCode: postalCode ?? '',
      country: country ?? '',
      lat,
      lng
    };
    return NextResponse.json({
      data: {
        address: formattedData,
        adrAddress: data.adrFormatAddress
      },
      error: null
    });
  } catch (err) {
    err instanceof Error && req.log.error(`Error fetching place details`, { error: err });
    console.error('Error fetching place details:', err);
    return NextResponse.json({ error: err, data: null });
  }
});

export const GET = placeDetails;

export const dynamic = 'force-dynamic';
