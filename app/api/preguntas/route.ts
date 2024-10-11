import { NextResponse } from "next/server";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

const model = openai('gpt-4-turbo');

export const GET = async (req: Request, res: Response) => {

    const { text } = await generateText({
        model: model,
        prompt: 'Escribe 1 titulo para una historia de terror',
      });


    return NextResponse.json({ 
        message: "GET preguntas",
        text: text
    });
};

export const POST = async (req: Request, res: Response) => {
    return NextResponse.json({ 
        message: "POST preguntas" 
    });
};



