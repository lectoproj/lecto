import { auth } from "@/lib/auth";
import { db } from "db/db";
import { NextResponse } from "next/server";
import { z } from 'zod';
import { evaluacion, user, testobtencioninfo, testreflexion, testinferencia, preposttest } from "db/migrations/schema";
import { eq } from 'drizzle-orm';

const creacionLecturaSchema = z.object({
    Quiz: z.array(z.object({
        tipo: z.enum(['fill-in-the-blank', 'mcq', 'text']),
        pregunta: z.string(),
        opciones: z.array(z.string()).optional(),
        correcta: z.string(),
        razon: z.string(),
        isvalid: z.boolean().optional(),
        answer: z.any().optional(),
    })),
    title: z.string(),
    text: z.string(),
    categoryId: z.string().optional(),
    lecturaId: z.string().optional(),
    score: z.object({
        total: z.number(),
        gained: z.number(),
    }).optional()
});

export const POST = async (req: Request) => {
    try {
        // Uncomment the following lines for session verification
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'You must be logged in to generate' }, { status: 401 });
        }

        // Get the data from the request
        const body = await req.json();
        const parsedData = creacionLecturaSchema.parse(body.data);
        const dbUser = await db.select().from(user).where(eq(user.email, session?.user?.email)).limit(1);

        // Start a transaction to ensure atomicity
        await db.transaction(async (trx) => {
            // Get the current number of evaluations
            const allEvaluacion = await trx.query.evaluacion.findMany();
            const newEvaluacion = allEvaluacion.length + 1;

            // Create the evaluation record
            await trx.insert(evaluacion).values({
                id_evaluacion: newEvaluacion,
                fecha_evaluacion: new Date().toISOString(),
                puntaje: parsedData.score?.gained ?? 0,
                retroalimentacion: parsedData.score?.gained > 6
                    ? "Congratulations, you answered the entire assessment correctly. Good job, you can still improve"
                    : "Better luck next time",
                id_usuario: dbUser[0]?.id,
                id_lectura: parsedData.lecturaId
            });

            // Filter and insert records into testinferencia where tipo is 'fill-in-the-blank'
            const fillInTheBlankQuestions = parsedData.Quiz.filter(item => item.tipo === 'fill-in-the-blank');
            for (const question of fillInTheBlankQuestions) {
                const allTestInferencia = await trx.query.testinferencia.findMany();
                const newTestInferencia = allTestInferencia.length + 1;

                await trx.insert(testinferencia).values({
                    id_test_inter: newTestInferencia,
                    respuesta: question.answer,
                    res_correc: question.correcta,
                    acierto: question.isvalid ?? false,
                    pregunta: question.pregunta,
                    feedback: question.razon,
                    id_evaluacion: newEvaluacion,
                });
            }

            // Filter and insert records into testreflexion where tipo is 'text'
            const textQuestions = parsedData.Quiz.filter(item => item.tipo === 'text');
            for (const question of textQuestions) {
                const allTestReflexion = await trx.query.testreflexion.findMany();
                const newTestReflexion = allTestReflexion.length + 1;

                await trx.insert(testreflexion).values({
                    id_test_refle: newTestReflexion,
                    respuesta: question.answer,
                    res_correc: question.correcta,
                    acierto: question.isvalid ?? false,
                    pregunta: question.pregunta,
                    feedback: question.razon,
                    id_evaluacion: newEvaluacion
                });
            }

            // Filter and insert records into testobtencioninfo where tipo is 'mcq'
            const mcqQuestions = parsedData.Quiz.filter(item => item.tipo === 'mcq');
            for (const question of mcqQuestions) {
                const allTestObtencionInfo = await trx.query.testobtencioninfo.findMany();
                const newTestObtencionInfo = allTestObtencionInfo.length + 1;

                await trx.insert(testobtencioninfo).values({
                    id_test_oi: newTestObtencionInfo,
                    res_selec: question.answer,
                    res_correc: question.correcta,
                    acierto: question.isvalid ?? false,
                    op_1: question.opciones?.[0] ?? '',
                    op_2: question.opciones?.[1] ?? '',
                    op_3: question.opciones?.[2] ?? '',
                    op_4: question.opciones?.[3] ?? '',
                    pregunta: question.pregunta,
                    feedback: question.razon,
                    id_evaluacion: newEvaluacion
                });
            }

            const allPrePostTest = await trx.query.preposttest.findMany();
            const newPrePostTest = allPrePostTest.length + 1;

            await trx.insert(preposttest).values({
                id_test_p: newPrePostTest,
                pre_post: 'pre',
                id_usuario: dbUser[0]?.id,
                id_evaluacion: newEvaluacion
            });
        });

        return NextResponse.json({ message: 'Evaluation created successfully', data: parsedData });

    } catch (error) {
        console.error('Error creating evaluation:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid data format', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};