import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { uploadToS3 } from '../s3/uploadToS3';
import { db } from "db/db";
import { lectura, user } from "db/migrations/schema";
import { generateObject } from "ai";
import { auth } from "@/lib/auth";
import { eq } from 'drizzle-orm';

const model = openai('gpt-4-turbo');

export const GET = async (req: Request) => {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'You must be logged in to get data' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const categoria = searchParams.get('categoria');
  const timestamp = searchParams.get('timestamp');
  const categoriaId = searchParams.get('categoriaId');

  if (!categoria || !categoriaId) {
    return NextResponse.json({ error: 'Missing category' }, { status: 400 });
  }

  if (!timestamp) {
    return NextResponse.json({ error: 'Missing timestamp' }, { status: 400 });
  }

  const { object } = await generateObject({
    model: model,
    system: 'Eres una IA especializada en crear texto de lectura corto en relevancia pedagógica para niños de 10 años, en primaria',
    prompt: `Escribe un texto de lectura corto. El tema principal del texto debe ser: ${categoria}. Variedad: ${timestamp}`,
    schema: z.object({
      objetoLectura: z.object({
        titulo: z.string().describe("titulo"),
        texto: z.string().describe("lectura"),
      }),
    }),
  });

  const texto = object.objetoLectura.texto;
  const s3Url = await uploadToS3(texto);

  const allLecturas = await db.query.lectura.findMany();
  const newLecturaId = allLecturas.length + 1;

  // Fetch the user from the database
  const dbUser = await db.select().from(user).where(eq(user.email, session?.user?.email)).limit(1);
  if (dbUser.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const foundUser = dbUser[0];

  await db.insert(lectura).values({
    id_lectura: newLecturaId,
    nombre_lectura: object.objetoLectura.titulo,
    lecturas3: s3Url,
    id_usuario: foundUser.id, // ID de usuario estático
    id_categoria: parseInt(categoriaId, 10), // Usa el ID de la categoría seleccionada
  });

  return NextResponse.json({
    titulo: object.objetoLectura.titulo,
    texto: object.objetoLectura.texto,
    newLecturaId: newLecturaId,
  });
};

