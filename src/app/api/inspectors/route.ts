// app/api/inspectors/route.ts
import { NextRequest, NextResponse } from 'next/server';

const EXTERNAL_API_BASE_URL = 'https://list-api-service.hellocabradar.workers.dev';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      );
    }

    // Fetch from external API
    const response = await fetch(
      `${EXTERNAL_API_BASE_URL}/list/inspectors?lat=${lat}&lon=${lon}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }, // Cache for 1 minute
      }
    );

    if (!response.ok) {
      throw new Error(`External API error: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching inspectors:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inspectors data' },
      { status: 500 }
    );
  }
}