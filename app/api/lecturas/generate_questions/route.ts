import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { generateObject } from 'ai';

const model = openai('gpt-4-turbo');

export const POST = async (req: Request) => {
  const { titulo, texto, newLecturaId } = await req.json();

  if (!titulo || !texto) {
    return NextResponse.json(
      { error: 'Missing title or text' },
      { status: 400 }
    );
  }

  const { object } = await generateObject({
    model: model,
    system:
      'Eres un especialista en redactar preguntas de comprensión lectora para niños de 10 años. Todo debe estar en español de Perú. Todas son claras, sencillas y directas. Todas la preguntas se centran en las ideas principales un texto proporcionado. Las preguntas tipo "fill in the blank" son para completar espacios en blanco, estas siempre deben tener como respuesta una sola palabra y no múltiples. Las preguntas de tipo "opción múltiple" deben tener 4 respuestas, una correcta y las otras incorrectas. Las preguntas de tipo "texto" son de reflexión, invitan a reflexionar sobre el contenido o relacionarlo con experiencias personales, para mantener el interés y la motivación.',
    prompt: `El texto de lectura es: "${texto}". Genera 10 preguntas relacionadas con el texto generado: 4 de llenar los espacios en blanco (Fill-in-the-blank), 4 de opción múltiple (MCQs) con sus opciones, y 2 preguntas tipo texto. Proporciona las opciones correctas y las razones para cada respuesta para todas las preguntas.`,
    schema: z.object({
      preguntas: z.array(
        z.object({
          tipo: z.enum(['fill-in-the-blank', 'mcq', 'text']),
          pregunta: z.string(),
          opciones: z.optional(z.array(z.string())), // Only for 'mcq' type
          correcta: z.string(), // For 'mcq', 'fill-in-the-blank', and 'text' types
          razon: z.string() // Needed for all types
        })
      )
    })
  });

  return NextResponse.json({
    message: 'Quiz generated successfully',
    quiz: object.preguntas
  });
};
