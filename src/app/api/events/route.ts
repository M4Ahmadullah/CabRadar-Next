// app/api/events/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://list-api-service.hellocabradar.workers.dev';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || '51.5074';
    const lon = searchParams.get('lon') || '-0.1276';
    const width = searchParams.get('width') || '1000';
    const height = searchParams.get('height') || '1000';

    const response = await fetch(`${API_BASE_URL}/list/events?lat=${lat}&lon=${lon}&width=${width}&height=${height}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CabRadar/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Events API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events data' },
      { status: 500 }
    );
  }
}
