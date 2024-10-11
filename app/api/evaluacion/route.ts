import { auth } from "@/lib/auth";
import { db } from "db/db";
import { NextResponse } from "next/server";
import { z } from 'zod';
import { testinferencia, evaluacion, testreflexion, testobtencioninfo, user } from "db/migrations/schema";
import { eq } from 'drizzle-orm';
import { CourierClient } from "@trycourier/courier";

const courier = new CourierClient({ authorizationToken: "pk_prod_11K9H986GM4DEHHEHKPFG6H6FH9H" });

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
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'You must be logged in to generate' }, { status: 401 });
        }

        const body = await req.json();
        const parsedData = creacionLecturaSchema.parse(body.data);
        const dbUser = await db.select().from(user).where(eq(user.email, session?.user?.email)).limit(1);

        if (!dbUser || !dbUser[0]) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const emailTutor = dbUser[0]?.email_tutor;

        let fillTrue = 0;
        let opnionTrue = 0;
        let multiTrue = 0;

        await db.transaction(async (trx) => {
            const allEvaluacion = await trx.query.evaluacion.findMany();
            const newEvaluacion = allEvaluacion.length + 1;

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

                if (question.isvalid != false) {
                    fillTrue = fillTrue + 1;
                }
            }

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

                if (question.isvalid != false) {
                    opnionTrue = opnionTrue + 1;
                }
            }

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

                if (question.isvalid != false) {
                    multiTrue = multiTrue + 1;
                }
            }
        });

        if (emailTutor) {
            try {
                const { requestId } = await courier.send({
                    message: {
                        to: {
                            email: emailTutor, // Send to the tutor's email
                        },
                        template: "XYPRJQGEEMM49DKVC6G1K2GSH78N", // Your Courier template ID
                        data: {
                            userName: dbUser[0]?.name,
                            total: parsedData.score?.gained ?? 0,
                            multi: multiTrue,
                            fill: fillTrue,
                            opnion: opnionTrue,
                        },
                    },
                });
                console.log(`Courier request ID: ${requestId}`);
            } catch (emailError) {
                console.error('Error sending email via Courier:', emailError);
            }
        }

        return NextResponse.json({ message: 'Evaluation created successfully', data: parsedData });

    } catch (error) {
        console.error('Error creating evaluation:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: 'Invalid data format', details: error.errors }, { status: 400 });
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};