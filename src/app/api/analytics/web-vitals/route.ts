import { NextRequest, NextResponse } from 'next/server';

interface WebVitalMetric {
  name: string;
  value: number;
  id: string;
  delta: number;
  rating: 'good' | 'needs-improvement' | 'poor' | 'info';
  timestamp: number;
  url: string;
  userAgent: string;
}

export async function POST(request: NextRequest) {
  try {
    const metric: WebVitalMetric = await request.json();

    // Validate metric data
    if (!metric.name || typeof metric.value !== 'number') {
      return NextResponse.json(
        { error: 'Invalid metric data' },
        { status: 400 }
      );
    }

    // Here you would typically store the metric in your analytics database
    // For now, we'll just acknowledge receipt
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Web vitals API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 