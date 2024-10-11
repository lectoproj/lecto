import { auth } from "@/lib/auth";
import { db } from "db/db";
import { NextResponse } from "next/server";
import { evaluacion, lectura, categoria_lectura, testinferencia, testreflexion, testobtencioninfo, user } from "db/migrations/schema";
import { eq, ne, and } from 'drizzle-orm';

export const GET = async (req: Request) => {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'You must be logged in to get data' }, { status: 401 });
        }

        // Fetch the logged-in user
        const dbUser = await db.select().from(user).where(eq(user.email, session?.user?.email)).limit(1);
        if (dbUser.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        const foundUser = dbUser[0];

        // Fetch evaluacion data for the user, excluding "pre" and "post" categories
        const evaluaciones = await db
            .select({
                fecha_evaluacion: evaluacion.fecha_evaluacion,
                puntaje: evaluacion.puntaje,
                nombre_lectura: lectura.nombre_lectura,
                nombre_categoria: categoria_lectura.nombre_categoria,
                id_evaluacion: evaluacion.id_evaluacion
            })
            .from(evaluacion)
            .innerJoin(lectura, eq(evaluacion.id_lectura, lectura.id_lectura))
            .innerJoin(categoria_lectura, eq(lectura.id_categoria, categoria_lectura.id_categoria))
            // .where(eq(evaluacion.id_usuario, foundUser.id));
            .where(and(
                eq(evaluacion.id_usuario, foundUser.id),
                ne(categoria_lectura.nombre_categoria, 'pre/post'),
            ));

        // If no evaluations found
        if (evaluaciones.length === 0) {
            return NextResponse.json({ message: 'No evaluations found for the user' }, { status: 401 });
        }

        // Iterate over each evaluacion to get test submissions
        const data = await Promise.all(evaluaciones.map(async (evaluacion) => {
            const submissions = [];

            // Fetch testinferencia submissions and only get specific fields
            const inferencias = await db
                .select({
                    pregunta: testinferencia.pregunta,
                    // feedback: testinferencia.feedback,  
                    respuesta: testinferencia.respuesta,
                    acierto: testinferencia.acierto,
                    res_correc: testinferencia.res_correc
                })
                .from(testinferencia)
                .where(eq(testinferencia.id_evaluacion, evaluacion.id_evaluacion));
            submissions.push(...inferencias);

            // Fetch testreflexion submissions and only get specific fields
            const reflexiones = await db
                .select({
                    pregunta: testreflexion.pregunta,
                    // feedback: testreflexion.feedback,  
                    respuesta: testreflexion.respuesta,
                    acierto: testreflexion.acierto,
                    res_correc: testreflexion.res_correc,
                })
                .from(testreflexion)
                .where(eq(testreflexion.id_evaluacion, evaluacion.id_evaluacion));
            submissions.push(...reflexiones);

            // Fetch testobtencioninfo submissions and only get specific fields
            const obtencionInfos = await db
                .select({
                    pregunta: testobtencioninfo.pregunta,
                    res_correc: testobtencioninfo.res_correc,
                    res_selec: testobtencioninfo.res_selec ,
                    acierto: testobtencioninfo.acierto
                })
                .from(testobtencioninfo)
                .where(eq(testobtencioninfo.id_evaluacion, evaluacion.id_evaluacion));
            submissions.push(...obtencionInfos);

            // Format the response for each evaluacion
            return {
                fecha: evaluacion.fecha_evaluacion,
                titulo_lectura: evaluacion.nombre_lectura,
                puntaje: `${evaluacion.puntaje}/10`,
                categoria: evaluacion.nombre_categoria,
                submissions: submissions
            };
        }));

        return NextResponse.json({ message: 'Data retrieved successfully', data });

    } catch (error) {
        console.error('Error in getting data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
