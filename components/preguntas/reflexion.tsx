import React from 'react'
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from '@/components/ui/card'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Input } from '../ui/input'

type Props = {}

const Reflexion = (props: Props) => {
  return (
    <div>
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">Lecturas</h1>
          </div>
          <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm" x-chunk="dashboard-02-chunk-1"
          >
            
            <div className="flex flex-col items-center gap-1 text-center">
            
              <h3 className="text-2xl font-bold tracking-tight">
                Acá ira la presentación de la lectura
              </h3>
              <p className="text-sm text-muted-foreground">
                Esta será el área de muestra
              </p>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Un bloque de respuesta</CardTitle>
                <CardDescription>
                Posiblemente para preguntas y respuestas. Pregunta 1: ¿Qué es un sistema de información?
                </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="respuestaCorta">Respuesta escrita corta</Label>
                  <Input
                    id="respuestaCorta"
                    type="text"
                    className="w-full"
                    defaultValue="Ejemplo de respuesta escrita corta (esto ya es un form)"
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="respuestaLarga">Respuesta escrita larga</Label>
                  <Textarea
                    id="respuestaLarga"
                    defaultValue="(Esto es otro tipo de form) Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl nec ultricies ultricies, nunc nisl ultricies nunc, nec ultricies nunc nisl nec nunc."
                    className="min-h-32"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
      </main>
    </div>
  )
}

export default Reflexion