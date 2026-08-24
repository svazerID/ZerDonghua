import { NextRequest, NextResponse } from 'next/server';
import { getDonghua } from '@/lib/donghuaServer';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const action = searchParams.get('action') || 'home';

  const params: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    if (key !== 'action') params[key] = value;
  });

  try {
    const data = await getDonghua(action, params);
    return NextResponse.json({ status: true, data });
  } catch (err: any) {
    console.error('API /api/donghua error:', err);
    return NextResponse.json(
      { status: false, message: err?.message || 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}
