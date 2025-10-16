// app/api/roads/route.ts
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://list-api-service.hellocabradar.workers.dev';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat') || '51.5074';
    const lon = searchParams.get('lon') || '-0.1276';

    const response = await fetch(`${API_BASE_URL}/list/roads?lat=${lat}&lon=${lon}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'CabRadar/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Roads API error: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching roads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch roads data' },
      { status: 500 }
    );
  }
}
