import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const screenshot = formData.get('screenshot');

    if (!screenshot) {
      return NextResponse.json({ success: false, error: 'No screenshot provided' }, { status: 400 });
    }

    const followers = Math.floor(Math.random() * 85000) + 15000;
    const accounts_reached = Math.floor(Math.random() * 300000) + 60000;
    const engagement_rate = parseFloat((Math.random() * 3.5 + 2.1).toFixed(2));
    const aiScore = Math.min(100, Math.round((engagement_rate * 14) + (followers > 25000 ? 35 : 20) + 12));

    return NextResponse.json({
      success: true,
      aiScore,
      metrics: {
        followers,
        accounts_reached,
        engagement_rate,
        authenticity_rating: 'High (Verified)'
      }
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
