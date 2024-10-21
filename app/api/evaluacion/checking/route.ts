import { NextResponse } from 'next/server';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { generateObject } from 'ai';

const model = openai('gpt-4-turbo');

export const POST = async (req: Request) => {
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
          'Eres un especialista en evaluar respuestas de preguntas basadas en un texto proporcionado para niños de 10 años en primaria. Tu evaluación ser clara y concisa, y debe ser fácil de entender para los niños. Redacta hablando de manera singular, en segunda persona, y en tiempo presente.',
        prompt: `El texto de lectura es: "${texto}". La pregunta es: "${pregunta}". La respuesta del usuario es: "${answer}". Evalúa si la respuesta es correcta o incorrecta. Proporciona la razón para ambas situaciones.`,
        schema: z.object({
          correcta: z.boolean(),
          razon: z.string()
        }),
        maxTokens: 400
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

  return NextResponse.json({
    message: 'Evaluation completed successfully',
    evaluations
  });
};
