import { NextRequest, NextResponse } from 'next/server';
import { db } from 'db/db';
import { lectura } from 'db/migrations/schema';
import { eq } from 'drizzle-orm';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) {
    console.error('Missing id parameter');
    return NextResponse.json({ error: 'Missing id parameter' }, { status: 400 });
  }

  try {

    const lecturaActu = await db.select().from(lectura).where(eq( lectura.id_lectura, parseInt(id,10)));
    
    if (lecturaActu.length === 0) {
      console.error('Lectura not found');
      return NextResponse.json({ error: 'Lectura not found' }, { status: 404 });
    }

    const { nombre_lectura, lecturas3 } = lecturaActu[0];
    const response = await fetch(lecturas3);

    if (!response.ok) {
      console.error(`Error fetching text from S3: ${response.statusText}`);
      throw new Error(`Error fetching text from S3: ${response.statusText}`);

    }

    const texto = await response.text();

    return NextResponse.json({ titulo: nombre_lectura, texto });
  } catch (error) {

    console.error('Error fetching lectura:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
