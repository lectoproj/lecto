import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { BookOpen, Brain, Gem, BarChart } from 'lucide-react';
import Link from 'next/link';

// export const metadata = {
//   title: 'Inicio | Lecto'
// };

export default async function DefaultPage() {
  return (
    // <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
    //   <div className="flex items-center">
    //     <h1 className="font-semibold text-lg md:text-2xl">Inicio</h1>
    //   </div>
    // </main>
    <main className="flex-grow container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Bienvenido a Lecto!</h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Incrementa tus habilidades de comprensión lectora mediante diversas
          lecturas y evaluaciones automáticas. Lee y aprende en cualquier
          momento y lugar. Comienza por explorar las opciones a continuación.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <BookOpen className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>Lecturas</CardTitle>
            <CardDescription>
              Accede a cualquier tipo de lectura en diversas categorías .
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Explora lecturas basadas en categorías de tu preferencia e ingresa
              a un mundo de basto conocimiento.
            </p>
          </CardContent>
          <CardFooter>
            {/* <Link href="/lecturas" passHref className="w-full">
              <Button className="w-full">Comenzar a leer</Button>
            </Link> */}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <Brain className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>Evaluaciones</CardTitle>
            <CardDescription>
              Prueba tus habilidades de comprensión con evaluaciones dinámicas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Retate mediante diversas preguntas de lecturas para mejorar tus
              habilidades.
            </p>
          </CardContent>
          <CardFooter>
            {/* <Link href="/lecturas" passHref className="w-full">
              <Button className="w-full">Explorar</Button>
            </Link> */}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <BarChart className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>Historial de evaluaciones</CardTitle>
            <CardDescription>
              Monitorea tu aprendizaje y progreso.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Revisa todas las respuestas correctas e incorrectas de las
              lecturas que realizaste en el pasado.
            </p>
          </CardContent>
          <CardFooter>
            {/* <Link href="/evaluaciones-guardadas" passHref className="w-full">
              <Button className="w-full">Ver historial</Button>
            </Link> */}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <Gem className="w-8 h-8 mb-2 text-primary" />
            <CardTitle>Logros y rachas</CardTitle>
            <CardDescription>
              Adquiere premios mientras avanzas.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Lee mucho para ganar premios y mejorar tu racha dentro de la
              aplicación. A medida que más leas, más podrás recibir.
            </p>
          </CardContent>
          <CardFooter>
            {/* <Link href="/salon-de-logros" passHref className="w-full">
              <Button className="w-full">Ver salón de logros</Button>
            </Link> */}
          </CardFooter>
        </Card>
      </div>
    </main>
  );
}
