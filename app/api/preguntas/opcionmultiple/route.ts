import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { openai } from "@ai-sdk/openai";
import {z} from 'zod';
import { auth } from "@/lib/auth";

const model = openai('gpt-4-turbo');

export const GET = async (req: Request, res: Response) => {

    //Descomentar esto para validar que solo se envie cuando la sesión esta iniciada:

    // const session = await auth();
    // if(!session?.user){
    //     return NextResponse.json({error: 'Debes estar logueado para generar'},{status: 401});
    // }


    // En este caso, la aplicación misma se encarga de enviar la lectura para realizar las preguntas:
    // Pero ya que no es una palabra como categoría, debemos encontrar la maenra de enviar toda la lectura

    // const { searchParams } = new URL(req.url)
    // const categoria = searchParams.get('lectura')
    // if (!lectura) {
    //     return NextResponse.json({ error: 'No hay lectura' }, { status: 400 })
    // }


    const { object } = await generateObject({
        model: model,
        system: 'Eres una IA especializada en generar preguntas de inferencia que tienen relevancia pedagógica para niños de primaria de 10 años',
        prompt: 'Escribe una pregunta de compresión lectora con 4 opciones de respuesta, 3 incorrectas y 1 correcta',
        schema: z.object({
            objetoOpcionMultiple: z.object({
              pregunta: z.string().describe("Pregunta de comprensión lectora"),
                opciones: z.object({
                    opcionCorrecta: z.string().describe("Opción correcta"),
                    opcionIncorrecta1: z.string().describe("Opción incorrecta 1"),
                    opcionIncorrecta2: z.string().describe("Opción incorrecta 2"),
                    opcionIncorrecta3: z.string().describe("Opción incorrecta 3"),
                }),
            }),
          }),
      });

    return NextResponse.json(object);
};
