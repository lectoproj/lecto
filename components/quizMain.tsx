import CreacionLectura from '@/components/ui/CreacionLectura';
import { auth } from '@/lib/auth'; // Ensure correct import
import { redirect } from 'next/navigation';
import { db } from 'db/db';
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

// interface Props {
//   selectedCategorias: string[];
//   categoria: string;
// }

export const metadata = {
  title: 'Lecturas | Lecto'
};

const QuizMain = async () => {
  const session = await auth(); // Call auth function
  if (!session?.user) {
    return redirect('/'); // Redirect if user is not logged in
  }

  const allCategorias = await db.query.categoria_lectura.findMany();

  const selectedCategorias = [];
  while (selectedCategorias.length < 4 && allCategorias.length > 0) {
    const randomIndex = Math.floor(Math.random() * allCategorias.length);
    selectedCategorias.push(allCategorias.splice(randomIndex, 1)[0]);
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Lecturas</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Elige una categoría de lectura</CardTitle>
                <CardDescription>
                  Para comenzar primero elige una de las siguientes categorías
                </CardDescription>
              </CardHeader>
              <CardContent>
                {selectedCategorias.map((categoria, index) => (
                  <CreacionLectura key={index} categoria={categoria} />
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
};

export default QuizMain;
