import { NextResponse } from 'next/server';

export async function GET() {
    const data = {
        texto: `Sofía era una niña de 10 años que siempre soñaba con viajar a lugares desconocidos. Un día, durante las vacaciones de verano, sus padres la sorprendieron con una noticia emocionante: iban a hacer un viaje en barco a una isla que pocos habían explorado. La llamaban la Isla Misteriosa porque estaba llena de secretos por descubrir.
        El día del viaje, Sofía se subió al barco con su mochila llena de provisiones y su cuaderno de aventuras. Navegaron durante horas, y Sofía no podía dejar de mirar el horizonte, esperando ver la isla aparecer. Finalmente, después de mucho tiempo, divisaron una pequeña mancha verde en la distancia. ¡Era la Isla Misteriosa!
        Al llegar, Sofía saltó del barco, emocionada por explorar. La isla estaba llena de árboles altos y sonidos extraños que venían de la selva. Sofía decidió aventurarse por un sendero que parecía poco transitado. A medida que avanzaba, encontró un pequeño arroyo cristalino y siguió su curso.
        De repente, Sofía vio algo brillante entre las rocas. Al acercarse, descubrió un cofre antiguo, cubierto de musgo. Con mucho cuidado, lo abrió y encontró dentro un mapa muy viejo que mostraba la ubicación de un tesoro escondido en la isla.
        Sofía siguió el mapa, que la llevó a una cueva oculta detrás de una cascada. Dentro de la cueva, encontró un cofre más grande lleno de monedas antiguas y joyas brillantes. Pero lo que más la emocionó fue una nota que decía: "Para el valiente explorador que encontró este tesoro: nunca dejes de soñar y explorar el mundo".
        De regreso en el barco, Sofía se sintió como una verdadera exploradora. Sabía que ese viaje a la Isla Misteriosa era solo el comienzo de muchas más aventuras que tendría en su vida. Con el mapa en su cuaderno de aventuras, prometió que seguiría viajando y descubriendo nuevos lugares, porque el mundo estaba lleno de misterios esperando a ser revelados.`,
        titulo: "La Aventura de Sofía en la Isla Misteriosa",
        quiz: [
            {
                tipo: "fill-in-the-blank",
                pregunta: "Sofía llevaba en su mochila provisiones y su cuaderno de __________.",
                correcta: "aventuras",
                razon: "El texto menciona que Sofía llevaba su cuaderno de aventuras en la mochila."
            },
            {
                tipo: "fill-in-the-blank",
                pregunta: "La isla a la que viajaron Sofía y sus padres se llamaba la Isla __________.",
                correcta: "Misteriosa",
                razon: "El texto describe la isla como la Isla Misteriosa."
            },
            {
                tipo: "fill-in-the-blank",
                pregunta: "Dentro del cofre que encontró Sofía había un __________ muy viejo que mostraba la ubicación de un tesoro.",
                correcta: "mapa",
                razon: "Sofía encontró un mapa muy viejo dentro del cofre que mostraba la ubicación de un tesoro."
            },
            {
                tipo: "fill-in-the-blank",
                pregunta: "Sofía encontró el cofre del tesoro dentro de una cueva oculta detrás de una __________.",
                correcta: "cascada",
                razon: "El texto menciona que el cofre del tesoro estaba dentro de una cueva oculta detrás de una cascada."
            },
            {
                tipo: "mcq",
                pregunta: "¿Qué hizo Sofía cuando vio algo brillante entre las rocas?",
                opciones: ["Lo ignoró", "Lo recogió y se lo llevó al barco", "Se acercó y encontró un cofre antiguo", "Llamó a sus padres"],
                correcta: "Se acercó y encontró un cofre antiguo",
                razon: "El texto describe cómo Sofía se acercó y descubrió un cofre antiguo entre las rocas."
            },
            {
                tipo: "mcq",
                pregunta: "¿Qué contenía el cofre más grande que Sofía encontró en la cueva?",
                opciones: ["Ropa", "Libros viejos", "Monedas antiguas y joyas brillantes", "Comida"],
                correcta: "Monedas antiguas y joyas brillantes",
                razon: "El texto menciona que el cofre más grande contenía monedas antiguas y joyas brillantes."
            },
            {
                tipo: "mcq",
                pregunta: "¿Cómo se sintió Sofía al regresar al barco?",
                opciones: ["Decepcionada", "Como una verdadera exploradora", "Triste porque la aventura había terminado", "Cansada y sin ganas de volver a la isla"],
                correcta: "Como una verdadera exploradora",
                razon: "El texto dice que Sofía se sintió como una verdadera exploradora al regresar al barco."
            },
            {
                tipo: "mcq",
                pregunta: "¿Qué decidió hacer Sofía después de su aventura en la Isla Misteriosa?",
                opciones: ["Guardar el mapa en un cajón y olvidarse de él", "No volver a explorar nunca más", "Seguir viajando y descubriendo nuevos lugares", "Escribir un libro sobre su aventura"],
                correcta: "Seguir viajando y descubriendo nuevos lugares",
                razon: "El texto menciona que Sofía prometió seguir viajando y descubriendo nuevos lugares en el futuro."
            },
            {
                tipo: "text",
                pregunta: "¿Por qué crees que la isla se llamaba la Isla Misteriosa?"
            },
            {
                tipo: "text",
                pregunta: "¿Qué crees que Sofía aprendió de su aventura en la Isla Misteriosa?"
            }
        ],
    };

    return NextResponse.json(data);
}