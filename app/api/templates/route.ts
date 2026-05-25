import { NextResponse } from 'next/server';
import { TEMPLATES_REGISTRY } from '@/lib/templates';

export async function GET() {
  try {
    return NextResponse.json(TEMPLATES_REGISTRY);
  } catch (error) {
    console.error('Error loading templates:', error);
    return NextResponse.json({ error: 'Failed to load templates' }, { status: 500 });
  }
}
