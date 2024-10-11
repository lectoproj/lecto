import {z} from "zod"
export const creacionLecturaSchema = z.object({
    categoria: z.string().nonempty(),
    cantidad: z.number().int().positive()
});