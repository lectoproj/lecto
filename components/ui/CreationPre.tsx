"use client"

import React from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from './card'
import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { useForm } from 'react-hook-form'
import { creacionLecturaSchema } from 'schemas/evaluacion'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'

type Categoria = {
  id_categoria: number;
  nombre_categoria: string;
}

type Props = {
  categoria: Categoria;
}

type Input = z.infer<typeof creacionLecturaSchema>

const CreacionPre = ({ categoria }: Props) => {
  const router = useRouter()

  const form = useForm<Input>({
    resolver: zodResolver(creacionLecturaSchema),
    defaultValues: {
      categoria: '',
    },
  })

  const handleButtonClick = () => {
    sessionStorage.setItem('selectedCategoriaId', categoria.id_categoria.toString())
    sessionStorage.setItem('selectedCategoriaNombre', categoria.nombre_categoria)
    router.push('/pretest/texto')
  }

  return (
    <Card>
      <CardContent className='py-2'>
        <Form {...form}>
          <Button type="button" onClick={handleButtonClick}>{categoria.nombre_categoria}</Button>
        </Form>
      </CardContent>
    </Card>
  )
}

export default CreacionPre
