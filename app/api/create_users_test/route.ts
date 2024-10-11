import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
 
export async function GET(request: Request) {
  try {
    const tableExists = await sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `;
    
    let result;
    if (!tableExists.rows[0].exists) {
      // Si la tabla no existe, crea la tabla
      result = await sql`
        CREATE TABLE IF NOT EXISTS users (
          id SERIAL PRIMARY KEY,
          email VARCHAR(255) NOT NULL,
          name VARCHAR(255),
          username VARCHAR(255)
        );
      `;
    } else {
      // Si la tabla ya existe, simplemente devuelve un mensaje indicando que la tabla ya está creada
      result = { message: "La tabla 'users' ya existe." };
    }
    return NextResponse.json({ result }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }
}