import { db } from "db/db";
import { NextResponse } from "next/server";
import { user } from "db/migrations/schema";
import { eq } from 'drizzle-orm';

export const PATCH = async (req: Request, { params }: { params: { id: string } }) => {
    try {
        const userId = params.id;

        if (!userId) {
            return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
        }

        const data = await req.json();
        
        const { name_tutor, email_tutor, fecha_nacimiento } = data.data;

        const updateFields: Partial<typeof user> = {};
        if (name_tutor !== undefined) updateFields.name_tutor = name_tutor;
        if (email_tutor !== undefined) updateFields.email_tutor = email_tutor;
        if (fecha_nacimiento !== undefined) updateFields.fecha_nacimiento = fecha_nacimiento;
        // if (email_tutor !== undefined) updateFields.email_tutor = email_tutor;
        // if (nombre_tutor !== undefined) updateFields.nombre_tutor = nombre_tutor;

        if (Object.keys(updateFields).length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
        }

        const updatedUser = await db.update(user)
            .set(updateFields)
            .where(eq(user.id, userId))
            .returning();

        if (updatedUser.length === 0) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'User updated successfully', data: updatedUser[0] });
    } catch (error) {
        console.error('Error in updating user:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
};
