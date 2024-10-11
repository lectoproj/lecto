import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '0'); // Asegúrate de que el ID sea un número entero
  const email = searchParams.get('email');
  const name = searchParams.get('name');
  const username = searchParams.get('username');

  try {
    if (!id ||!email ||!name ||!username) throw new Error('ID, email, name, and username are required');
    await sql`INSERT INTO users (id, email, name, username) VALUES (${id}, ${email}, ${name}, ${username});`;
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  const users = await sql`SELECT * FROM users;`; // Ajusta esto según tus necesidades
  return NextResponse.json({ users }, { status: 200 });
}


// query: INSERT INTO users (id, email, name, username) VALUES (2, 'me2@site.com', 'Yo2', 'username2');