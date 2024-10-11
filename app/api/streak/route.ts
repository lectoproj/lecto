import { auth } from "@/lib/auth";
import { db } from "db/db";
import { NextResponse } from "next/server";
import { evaluacion, user } from "db/migrations/schema";
import { eq } from 'drizzle-orm';

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

        // Fetch only the dates of the user's evaluations
        const evaluaciones = await db
            .select({
                fecha_evaluacion: evaluacion.fecha_evaluacion
            })
            .from(evaluacion)
            .where(eq(evaluacion.id_usuario, foundUser.id));

        // If no evaluations found
        if (evaluaciones.length === 0) {
            return NextResponse.json({ message: 'No streak found for the user' }, { status: 401 });
        }

        // Remove duplicate dates
        const uniqueFechas = Array.from(new Set(evaluaciones.map(e => e.fecha_evaluacion)));

        // Return the streak data (unique dates only)
        const data = uniqueFechas.map(fecha => ({ fecha }));

        return NextResponse.json({ message: 'Streak retrieved successfully', data });

    } catch (error) {
        console.error('Error in getting data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
