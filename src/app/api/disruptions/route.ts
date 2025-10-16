// app/api/disruptions/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://list-api-service.hellocabradar.workers.dev';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || '51.5074';
    const lon = searchParams.get('lon') || '-0.1276';
    const width = searchParams.get('width') || '1000';
    const height = searchParams.get('height') || '1000';

    console.log(`Fetching disruptions from: ${API_BASE_URL}/list/disruptions?lat=${lat}&lon=${lon}&width=${width}&height=${height}`);

    const response = await fetch(`${API_BASE_URL}/list/disruptions?lat=${lat}&lon=${lon}&width=${width}&height=${height}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CabRadar/1.0',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    console.log(`Disruptions API response status: ${response.status}`);

    if (!response.ok) {
      console.error(`Disruptions API error: ${response.status} ${response.statusText}`);
      return NextResponse.json({
        type: 'FeatureCollection',
        features: [],
        error: `API returned ${response.status}: ${response.statusText}`
      });
    }

    const data = await response.json();
    console.log(`Disruptions API data received: ${data.features?.length || 0} disruptions`);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching disruptions:', error);
    return NextResponse.json({
      type: 'FeatureCollection',
      features: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
