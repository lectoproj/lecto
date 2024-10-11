import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { generateObject } from 'ai';
import { uploadToS3 } from '../../s3/uploadToS3';
import { lectura, user } from 'db/migrations/schema';
import { db } from 'db/db';
import { auth } from '@/lib/auth';
import { eq } from 'drizzle-orm';

const model = openai('gpt-4-turbo');

export const POST = async (req: Request) => {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: 'You must be logged in to get data' },
      { status: 401 }
    );
  }

  const { texto, questionAnswers } = await req.json();

  if (
    !texto ||
    !Array.isArray(questionAnswers) ||
    questionAnswers.length === 0
  ) {
    return NextResponse.json(
      { error: 'Sin texto o questionAnswers' },
      { status: 400 }
    );
  }

  const evaluations = await Promise.all(
    questionAnswers.map(async ({ tipo, pregunta, answer, correcta }) => {
      if (!pregunta || !answer) {
        return {
          tipo,
          pregunta,
          correcta,
          razon: 'Incomplete data provided',
          answer,
          isvalid: false
        };
      }

      // Generate the evaluation from the model based on the provided question, answer, and texto
      const { object } = await generateObject({
        model: model,
        system:
          'Eres una IA especializada en evaluar respuestas basadas en un texto proporcionado para niños de 10 años en primaria.',
        prompt: `El texto de lectura es: "${texto}". La pregunta es: "${pregunta}". La respuesta del usuario es: "${answer}". Evalúa si la respuesta es correcta o incorrecta. Proporciona la razón para ambas situaciones.`,
        schema: z.object({
          correcta: z.boolean(),
          razon: z.string()
        })
      });

      return {
        tipo,
        pregunta,
        correcta,
        razon: object.razon,
        answer,
        isvalid: object.correcta
      };
    })
  );

  const s3Url = await uploadToS3(texto);

  const allLecturas = await db.query.lectura.findMany();
  const newLecturaId = allLecturas.length + 1;

  // Fetch the user from the database
  const dbUser = await db
    .select()
    .from(user)
    .where(eq(user.email, session?.user?.email))
    .limit(1);
  if (dbUser.length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const foundUser = dbUser[0];

  await db.insert(lectura).values({
    id_lectura: newLecturaId,
    nombre_lectura: 'La Aventura de Sofía en la Isla Misteriosa',
    lecturas3: s3Url,
    id_usuario: foundUser.id, // ID de usuario estático
    id_categoria: 0 // Usa el ID de la categoría seleccionada
  });

  return NextResponse.json({
    message: 'Evaluation completed successfully',
    evaluations,
    lectureId: newLecturaId
  });
};
