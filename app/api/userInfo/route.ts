import { auth } from "@/lib/auth";
import { db } from "db/db";
import { NextResponse } from "next/server";
import { user, preposttest, lectura, evaluacion } from "db/migrations/schema"; // Ensure evaluacion is imported
import { eq } from 'drizzle-orm';

export const GET = async (req: Request) => {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'You must be logged in to get data' }, { status: 401 });
        }

        // Fetch the user from the database
        const dbUser = await db.select().from(user).where(eq(user.email, session?.user?.email)).limit(1);
        if (dbUser.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const foundUser = dbUser[0];

        // Fetch the preposttest records for the user
        const prePostRecords = await db.select().from(preposttest).where(eq(preposttest.id_usuario, foundUser.id));

        // Fetch the lectura records for the user
        const normal = await db.select().from(lectura).where(eq(lectura.id_usuario, foundUser.id));

        // Fetch the evaluacion records with puntaje == 10 for the user
        const perfectoRecords = await db.select().from(evaluacion)
            .where(eq(evaluacion.id_usuario, foundUser.id))
            .where(eq(evaluacion.puntaje, 10));

        // Count the records with puntaje == 10        
        const perfectoCount = perfectoRecords.length;

        // Initialize counters
        let preCount = 0;
        let postCount = 0;
        let normalCount = 0;

        // Count how many `pre` and `post`
        prePostRecords.forEach(record => {
            if (record.pre_post === 'pre') {
                preCount++;
            } else if (record.pre_post === 'post') {
                postCount++;
            }
        });

        // Count how many non-zero id_categoria
        normal.forEach(item => {
            if (item.id_categoria != 0 || item.id_categoria != '0') {
                normalCount++;
            }
        });

        // Add the counts to the response object
        const response = {
            ...foundUser,
            preCount,
            postCount,
            normalCount,
            perfectoCount // Add the count of perfect evaluations
        };

        return NextResponse.json({ message: 'User info retrieved successfully', data: response });

    } catch (error) {
        console.error('Error in getting data:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};