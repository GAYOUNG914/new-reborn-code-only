import { NextResponse, NextRequest } from 'next/server';
import { UAParser } from 'ua-parser-js';

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const ua = url.searchParams.get('ua') || request.headers.get('user-agent');
  if (!ua) {
    return NextResponse.json({ error: 'UA is required' }, { status: 400 });
  }
  const result = new UAParser(ua);
  return NextResponse.json(result.getResult());
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const ua = body.ua;
  if (!ua) {
    return NextResponse.json({ error: 'UA is required' }, { status: 400 });
  }
  try {
    const result = new UAParser(ua);
    return NextResponse.json(result.getResult());
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Invalid UA' }, { status: 400 });
  }
}