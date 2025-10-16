// app/api/roads/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://list-api-service.hellocabradar.workers.dev';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || '51.5074';
    const lon = searchParams.get('lon') || '-0.1276';

    console.log(`Fetching roads from: ${API_BASE_URL}/list/roads?lat=${lat}&lon=${lon}`);

    const response = await fetch(`${API_BASE_URL}/list/roads?lat=${lat}&lon=${lon}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CabRadar/1.0',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    console.log(`Roads API response status: ${response.status}`);

    if (!response.ok) {
      console.error(`Roads API error: ${response.status} ${response.statusText}`);
      return NextResponse.json({
        type: 'FeatureCollection',
        features: [],
        error: `API returned ${response.status}: ${response.statusText}`
      });
    }

    const data = await response.json();
    console.log(`Roads API data received: ${data.features?.length || 0} roads`);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching roads:', error);
    return NextResponse.json({
      type: 'FeatureCollection',
      features: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
