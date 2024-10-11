import { NextResponse } from 'next/server';

export async function GET() {
    const data = {
        texto: `Lucas era un niño de 10 años que siempre había soñado con tener un robot que pudiera ayudarlo en casa. Un día, su sueño se hizo realidad cuando sus padres le regalaron un kit de robótica para su cumpleaños. El kit venía con todas las piezas necesarias para construir un pequeño robot y, lo más emocionante, ¡podía programarlo para que hiciera lo que él quisiera!
        Lucas pasó varias tardes después de la escuela ensamblando su robot. Le puso ruedas, brazos que podían moverse, y una pequeña pantalla que mostraba expresiones faciales. Decidió llamarlo "Robo-Amigo". Pero lo más difícil estaba por venir: tenía que programarlo.
        Con un poco de ayuda de su padre, que era programador, Lucas aprendió a escribir el código que le daría vida a Robo-Amigo. Al principio, hizo que el robot hiciera tareas simples, como moverse de un lado a otro o encender una luz. Pero Lucas quería más. Así que trabajó duro para enseñarle a Robo-Amigo a recoger sus juguetes y llevarle su merienda cuando tenía hambre.
        Un día, mientras Lucas hacía su tarea de matemáticas, se dio cuenta de que no encontraba su lápiz. Sin pensarlo, llamó a Robo-Amigo y le dio la orden de buscarlo. El robot, usando sus sensores, localizó el lápiz debajo del sofá y se lo entregó a Lucas. ¡Era increíble!
        Lucas estaba muy orgulloso de su creación. Aprendió que la tecnología, con un poco de imaginación y esfuerzo, podía hacer su vida más fácil y divertida. Desde entonces, siguió mejorando a Robo-Amigo, pensando en nuevas funciones que lo ayudarían a ser un mejor compañero y asistente en casa. Y así, Lucas no solo tenía un robot, sino también un amigo hecho por él mismo.`,
        titulo: "El Robot Ayudante de Lucas",
        quiz: [
            {
                tipo: "fill-in-the-blank",
                pregunta: "Lucas siempre había soñado con tener un __________ que pudiera ayudarlo en casa.",
                correcta: "robot",
                razon: "El texto menciona que Lucas soñaba con tener un robot que lo ayudara en casa."
            },
            {
                tipo: "fill-in-the-blank",
                pregunta: "Lucas pasó varias __________ después de la escuela ensamblando su robot.",
                correcta: "tardes",
                razon: "El texto menciona que Lucas pasó varias tardes ensamblando su robot después de la escuela."
            },
            {
                tipo: "fill-in-the-blank",
                pregunta: "Con la ayuda de su padre, Lucas aprendió a escribir __________ para programar a Robo-Amigo.",
                correcta: "código",
                razon: "El texto describe que Lucas aprendió a escribir código para programar a su robot."
            },
            {
                tipo: "fill-in-the-blank",
                pregunta: "Robo-Amigo usó sus __________ para encontrar el lápiz debajo del sofá.",
                correcta: "sensores",
                razon: "El texto menciona que Robo-Amigo usó sus sensores para localizar el lápiz."
            },
            {
                tipo: "mcq",
                pregunta: "¿Qué fue lo más difícil para Lucas al crear a Robo-Amigo?",
                opciones: ["Montar las ruedas", "Programarlo", "Elegir el nombre", "Colocar la pantalla"],
                correcta: "Programarlo",
                razon: "El texto menciona que lo más difícil para Lucas fue programar a Robo-Amigo."
            },
            {
                tipo: "mcq",
                pregunta: "¿Qué hizo Robo-Amigo cuando Lucas perdió su lápiz?",
                opciones: ["Buscó el lápiz y se lo entregó a Lucas", "Encendió una luz para que Lucas lo buscara", "Movió el sofá para que Lucas lo encontrara", "No pudo encontrarlo"],
                correcta: "Buscó el lápiz y se lo entregó a Lucas",
                razon: "El texto describe cómo Robo-Amigo encontró el lápiz debajo del sofá y se lo entregó a Lucas."
            },
            {
                tipo: "mcq",
                pregunta: "¿Cómo se sentía Lucas después de crear a Robo-Amigo?",
                opciones: ["Decepcionado", "Orgulloso", "Frustrado", "Cansado"],
                correcta: "Orgulloso",
                razon: "El texto menciona que Lucas estaba muy orgulloso de su creación."
            },
            {
                tipo: "mcq",
                pregunta: "¿Qué función adicional le enseñó Lucas a Robo-Amigo después de programarlo para moverse?",
                opciones: ["Hacer su tarea", "Recoger sus juguetes", "Encender la televisión", "Apagar las luces"],
                correcta: "Recoger sus juguetes",
                razon: "El texto dice que Lucas enseñó a Robo-Amigo a recoger sus juguetes y llevarle su merienda."
            },
            {
                tipo: "text",
                pregunta: "¿Por qué crees que Lucas decidió mejorar continuamente a Robo-Amigo?"
            },
            {
                tipo: "text",
                pregunta: "¿Qué otras funciones crees que Lucas podría añadirle a Robo-Amigo en el futuro?"
            }
        ],
    };

    return NextResponse.json(data);
}