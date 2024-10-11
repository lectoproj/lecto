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
    system: 'Eres una IA especializada en crear texto de lectura corto en relevancia pedagógica para niños de 10 años, en primaria',
    prompt: `El texto de lectura es: "${texto}". Además, genera 10 preguntas relacionadas con el texto generado: 4 de llenar los espacios en blanco (Fill-in-the-blank), 4 de opción múltiple (MCQs) con sus opciones, y 2 preguntas tipo texto. Proporciona las opciones correctas y las razones para cada respuesta para todas las preguntas.`,
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