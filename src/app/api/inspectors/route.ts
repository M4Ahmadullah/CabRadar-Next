// app/api/inspectors/route.ts
import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_BASE_URL = 'https://list-api-service.hellocabradar.workers.dev';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || '51.5074';
    const lon = searchParams.get('lon') || '-0.1276';

    console.log(`Fetching inspectors from: ${EXTERNAL_API_BASE_URL}/list/inspectors?lat=${lat}&lon=${lon}`);

    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/list/inspectors?lat=${lat}&lon=${lon}`,
      {
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CabRadar/1.0',
        },
        signal: AbortSignal.timeout(10000), // 10 second timeout
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    console.log(`Inspectors API response status: ${response.status}`);

    if (!response.ok) {
      console.error(`Inspectors API error: ${response.status} ${response.statusText}`);
      return NextResponse.json({
        type: 'FeatureCollection',
        features: [],
        error: `API returned ${response.status}: ${response.statusText}`
      });
    }

    const data = await response.json();
    console.log(`Inspectors API data received: ${data.features?.length || 0} inspectors`);

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching inspectors:', error);
    return NextResponse.json({
      type: 'FeatureCollection',
      features: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}