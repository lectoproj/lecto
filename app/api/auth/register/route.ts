import { NextResponse } from 'next/server';
import { db } from 'db/db'; // Update this if necessary
import { user } from 'db/migrations/schema';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { eq } from 'drizzle-orm';

const SALT_ROUNDS = 10;

export async function POST(req: Request) {
  try {
    const { email, password, name, fecha_nacimiento } = await req.json();

    if (!email || !password || !name || !fecha_nacimiento) {
      return NextResponse.json(
        { error: 'Se requieren todos los campos' },
        { status: 400 }
      );
    }

    // Check if the email already exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    if (existingUser.length > 0) {
      const foundUser = existingUser[0];
      // If the user already exists and their password is null, it means they registered via Google/GitHub
      if (!foundUser.password) {
        return NextResponse.json(
          { error: 'Ya te registraste mediante Google. Por favor, usa esos.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Este usuario ya existe' },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create the new user
    await db.insert(user).values({
      id: nanoid(),
      email,
      password: hashedPassword,
      name,
      fecha_nacimiento
    });

    return NextResponse.json(
      { message: 'Usuario registrado exitosamente' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error registrando usuario:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
