'use client';
// pages/texto.tsx
import React, { useEffect, useState, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/icons';

const TextoPage = () => {
  const router = useRouter();
  const [categoriaId, setCategoriaId] = useState<string | null>(null);
  const [categoriaNombre, setCategoriaNombre] = useState<string | null>(null);
  const [lectura, setLectura] = useState<{
    titulo: string;
    texto: string;
    newLecturaId: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingQuiz, setLoadingQuiz] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    const storedCategoriaId = sessionStorage.getItem('selectedCategoriaId');
    const storedCategoriaNombre = sessionStorage.getItem(
      'selectedCategoriaNombre'
    );
    if (!storedCategoriaId || !storedCategoriaNombre) {
      router.push('/');
      return;
    }

    setCategoriaId(storedCategoriaId);
    setCategoriaNombre(storedCategoriaNombre);

    const fetchLectura = async () => {
      if (hasFetched.current) return;
      hasFetched.current = true;

      setLoading(true);
      const timestamp = new Date().getTime();
      const response = await fetch(
        `/api/lecturas?categoria=${storedCategoriaNombre}&timestamp=${timestamp}&categoriaId=${storedCategoriaId}`
      );
      const data = await response.json();
      setLectura({
        titulo: data.titulo,
        texto: data.texto,
        newLecturaId: data.newLecturaId
      });
      setLoading(false);
    };

    fetchLectura();
  }, [router]);

  const handleIniciarEvaluacion = async () => {
    setLoadingQuiz(true);
    try {
      const response = await fetch(`/api/lecturas/generate_questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          titulo: lectura?.titulo,
          texto: lectura?.texto,
          newLecturaId: lectura?.newLecturaId
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      sessionStorage.setItem('currentLecturaTitulo', lectura?.titulo || '');
      sessionStorage.setItem('currentLecturaTexto', lectura?.texto || '');
      sessionStorage.setItem('currentLecturaId', lectura?.newLecturaId || '');
      sessionStorage.setItem(
        'currentLecturaQuestions',
        JSON.stringify(data.quiz)
      );

      router.push('/evaluacion');
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoadingQuiz(false);
    }
  };

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">
          Lectura y evaluación!
        </h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-justify p-4">
          {loading ? (
            // <div className="flex flex-col space-y-3 py-2">
            //   <Skeleton className="h-4 w-1/2 rounded-xl" />
            //   <div className="space-y-2">
            //     <Skeleton className="h-4 w-full" />
            //     <Skeleton className="h-4 w-full" />
            //     <Skeleton className="h-4 w-full" />
            //     <Skeleton className="h-4 w-1/2" />
            //   </div>
            // </div>
            <div>Cargando...
            </div>
            
          ) : lectura ? (
            <>
              <h2>{lectura.titulo}</h2>
              <p>{lectura.texto}</p>
              <Button type="button" onClick={handleIniciarEvaluacion}>
                Iniciar Evaluación {loadingQuiz ? <LoadingSpinner /> : null}
              </Button>
            </>
          ) : (
            <p>No se pudo cargar el texto.</p>
          )}
        </div>
      </div>
    </main>
  );
};

export default TextoPage;
