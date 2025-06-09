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
    const body: WebVitalMetric = await request.json();
    
    // Validate the incoming data
    if (!body.name || typeof body.value !== 'number' || !body.id) {
      return NextResponse.json(
        { error: 'Invalid web vital metric data' },
        { status: 400 }
      );
    }

    // In a production environment, you would typically:
    // 1. Store this data in your database
    // 2. Send to analytics services (Google Analytics, etc.)
    // 3. Aggregate metrics for dashboard visualization
    
    // For now, we'll just log the metrics
    console.log('Web Vital Metric Received:', {
      name: body.name,
      value: body.value,
      rating: body.rating,
      url: body.url,
      timestamp: new Date(body.timestamp).toISOString(),
    });

    // You could extend this to store in Supabase:
    /*
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    const { error } = await supabase
      .from('web_vitals')
      .insert({
        metric_name: body.name,
        value: body.value,
        rating: body.rating,
        url: body.url,
        user_agent: body.userAgent,
        timestamp: new Date(body.timestamp).toISOString(),
      });
    
    if (error) {
      console.error('Failed to store web vital:', error);
    }
    */

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Web vitals API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 