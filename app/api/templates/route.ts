import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { TEMPLATES_REGISTRY } from '@/lib/templates';

export async function GET() {
  try {
    const templatesDir = path.join(process.cwd(), 'templates');
    const templates: Record<string, { name: string; description: string; value: string }> = {};

    // Process all templates registered in our TEMPLATES_REGISTRY
    for (const [key, entry] of Object.entries(TEMPLATES_REGISTRY)) {
      const filePath = path.join(templatesDir, entry.file);
      
      if (fs.existsSync(filePath)) {
        // Read raw tree syntax text directly (no JSON encoding or backslash escaping required!)
        const value = fs.readFileSync(filePath, 'utf-8');
        
        templates[key] = {
          name: entry.name,
          description: entry.description,
          value: value,
        };
      } else {
        console.warn(`Template file specified in registry not found: ${filePath}`);
      }
    }

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error loading templates:', error);
    return NextResponse.json({ error: 'Failed to load templates' }, { status: 500 });
  }
}
