import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import React from 'react';

export const metadata = {
  title: 'Q&A | Lecto'
};

const QAPage = async () => {
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex items-center">
        <h1 className="font-semibold text-lg md:text-2xl">
          Preguntas y Respuestas
        </h1>
      </div>
      <div x-chunk="dashboard-02-chunk-1">
        <div>
          <div>
            <Accordion type="single" collapsible className="w-full">
              {/* Pregunta 1 */}
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  ¿Cómo empiezo a usar la aplicación?
                </AccordionTrigger>
                <AccordionContent>
                  Primero, debes elegir una categoría que te guste, para luego
                  leer el texto que te damos en la aplicación. Al terminar de
                  leer, te aparecerán algunas preguntas para que respondas. ¡No
                  te preocupes si no sabes todas las respuestas, aquí estamos
                  para aprender juntos!
                </AccordionContent>
              </AccordionItem>

              {/* Pregunta 2 */}
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  ¿Qué hago si no entiendo una pregunta?
                </AccordionTrigger>
                <AccordionContent>
                  Si no entiendes una pregunta, intenta responder de la mejor
                  manera que pueda. Ten en cuenta que no se puede retroceder a
                  la anterior pregunta o al texto, o no se guardará tu progreso.
                  Si aún tienes dudas, puedes pedirle ayuda a tu profesor o un
                  adulto.
                </AccordionContent>
              </AccordionItem>

              {/* Pregunta 3 */}
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  ¿Qué pasa si me equivoco en una respuesta?
                </AccordionTrigger>
                <AccordionContent>
                  ¡No pasa nada! Todos cometemos errores y es parte de aprender.
                  Después de responder, te daremos una retroalimentación para
                  que puedas saber en qué te equivocaste y mejorar la próxima
                  vez.
                </AccordionContent>
              </AccordionItem>

              {/* Pregunta 4 */}
              <AccordionItem value="item-4">
                <AccordionTrigger>¿Cómo veo mis resultados?</AccordionTrigger>
                <AccordionContent>
                  Para ver cómo te fue en una evaluación, puedes ir al
                  "Historial de evaluaciones" en el menú lateral. Allí podrás
                  ver las evaluaciones que ya hiciste, tus respuestas y tus
                  puntajes.
                </AccordionContent>
              </AccordionItem>

              {/* Pregunta 5 */}
              <AccordionItem value="item-5">
                <AccordionTrigger>
                  ¿Qué significa la retroalimentación que me da la aplicación?
                </AccordionTrigger>
                <AccordionContent>
                  La retroalimentación es un pequeño comentario que te damos
                  para que puedas mejorar. Te diremos si tu respuesta es
                  correcta o incorrecta, y te daremos consejos sobre cómo
                  hacerlo mejor la próxima vez.
                </AccordionContent>
              </AccordionItem>

              {/* Pregunta 6 */}
              <AccordionItem value="item-6">
                <AccordionTrigger>
                  ¿Qué debo hacer cuando termine una evaluación?
                </AccordionTrigger>
                <AccordionContent>
                  Cuando termines una evaluación, asegúrate de hacer clic en el
                  botón "Terminar". De esta forma, guardaremos tus respuestas y
                  podrás ver tus resultados más tarde. Después de eso puedes
                  intentar con otra categoría de lectura!
                </AccordionContent>
              </AccordionItem>

              {/* Pregunta 7 */}
              <AccordionItem value="item-7">
                <AccordionTrigger>
                  ¿Puedo hacer las evaluaciones más de una vez?
                </AccordionTrigger>
                <AccordionContent>
                  Cada lectura y evaluación es diferente, por lo que es
                  importante leer bien el texto y tratar de hacerlo lo mejor
                  posible la primera vez.
                </AccordionContent>
              </AccordionItem>

              {/* Pregunta 8 */}
              <AccordionItem value="item-8">
                <AccordionTrigger>
                  ¿Cómo sabré si estoy mejorando?
                </AccordionTrigger>
                <AccordionContent>
                  ¡Es fácil! Puedes revisar el "Historial de evaluaciones" para
                  ver cómo ha cambiado tu puntaje con el tiempo. Si ves que tus
                  puntajes suben, ¡significa que estás mejorando!
                </AccordionContent>
              </AccordionItem>

              {/* Pregunta 9 */}
              <AccordionItem value="item-9">
                <AccordionTrigger>
                  ¿Qué significa el puntaje que obtengo?
                </AccordionTrigger>
                <AccordionContent>
                  El puntaje te dice qué tan bien lo hiciste en la evaluación.
                  Un número alto significa que contestaste bien muchas
                  preguntas. Si obtienes un puntaje más bajo, no te preocupes,
                  ¡puedes intentarlo de nuevo y mejorar!
                </AccordionContent>
              </AccordionItem>

              {/* Pregunta 10 */}
              <AccordionItem value="item-10">
                <AccordionTrigger>
                  ¿Para qué sirven las categorías de lectura?
                </AccordionTrigger>
                <AccordionContent>
                  Las categorías de lectura te ayudan a saber qué tipo de textos
                  estás leyendo (por ejemplo, historias, ciencia, o historia).
                  Es una manera de elegir las lecturas que más te interesan, y
                  así disfrutar más de la lectura.
                </AccordionContent>
              </AccordionItem>

              {/* Pregunta 11 */}
              <AccordionItem value="item-11">
                <AccordionTrigger>
                  ¿Cómo puedo saber cuáles preguntas contesté bien?
                </AccordionTrigger>
                <AccordionContent>
                  Después de terminar la evaluación, puedes ver una tabla con
                  todas tus respuestas en la sección "Historial de evaluación".
                  Las respuestas correctas estarán en verde y las incorrectas en
                  rojo, ¡así sabrás exactamente cuáles te salieron bien!
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </div>
    </main>
  );
};

export default QAPage;