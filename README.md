<div align="center"><strong>Manual de Lecto</strong></div>
<div align="center">Built with the Next.js App Router</div>
<br />
<!-- <div align="center">
<a href="https://next-admin-dash.vercel.app/">Demo</a>
<span> · </span>
<a href="https://vercel.com/templates/next.js/admin-dashboard-tailwind-postgres-react-nextjs">Clone & Deploy</a>
<span>
</div> -->

# Lecto: Aplicación Educativa con IA para Niños de Primaria

Esta aplicación web educativa utiliza IA para generar lecturas personalizadas y evaluaciones interactivas dirigidas a niños de 10 años. Desarrollada en **Next.js**, con integración de **GPT-4** mediante el **AI SDK** de Vercel, ofrece contenido pedagógico adaptado a las necesidades de los estudiantes.

## Características Principales

- **Generación de lecturas personalizadas**: Contenido adaptado a los intereses y nivel educativo de los estudiantes.
- **Evaluaciones automáticas**: Preguntas de opción múltiple, completar espacios en blanco y respuesta abierta, con calificación automatizada.
- **Retroalimentación personalizada**: Explicaciones detalladas sobre los errores de los estudiantes.
- **Autenticación segura**: Login mediante credenciales y Google con **auth.js**.
- **Base de datos**: Almacenamiento de evaluaciones y resultados para consultas futuras.

## Tecnologías Utilizadas

- **Next.js**: Framework de React para aplicaciones web.
- **GPT-4**: IA utilizada para la generación de contenido educativo y validación de respuestas.
- **Vercel AI SDK**: Conexión a la API de GPT-4 con respuestas en formato JSON estructurado.
- **Auth.js**: Manejo de autenticación.
- **Jira**: Gestión de incidencias y cambios en el proyecto.

## Instalación
1. Clona el repositorio:
```
git clone https://github.com
```
2. Instala las dependencias:
```
npm install
```
3. Crea un archivo .env con las variables necesarias para la conexión con la API de GPT-4 y los datos de autenticación
4. Ejecuta la aplicación en modo desarrollo:
```
npm run dev
```

Debería poder ingresar a la aplicación por http://localhost:3000.

## Uso
1. Selecciona una categoría de lectura.
2. Lee el contenido generado por la IA.
3. Responde las preguntas de la evaluación.
4. Revisa la retroalimentación personalizada y consulta tus evaluaciones pasadas.
