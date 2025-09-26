# PROYECTO-CLASSROOM_VIBHACKH_APLICATIVO
Tu aplicación es una plataforma web construida con React (frontend) y Node.js + Express (backend) que busca mejorar la experiencia de Google Classroom.

🔹 Funcionalidades principales

Autenticación con Google (OAuth2)

Los usuarios (profesores o alumnos) inician sesión con su cuenta de Google.

La app obtiene un token de acceso para interactuar con la API de Google Classroom.

Integración con Google Classroom

Una vez logueado, el sistema puede listar los cursos del usuario desde Classroom.

Se obtiene información como nombre del curso, asignaturas, y actividades.

Visualización de Cursos

En el frontend, los cursos se muestran como tarjetas (Cards), similares a Google Classroom.

Cada tarjeta representa un curso al que el usuario pertenece.

Mejora de la experiencia

El objetivo no es reemplazar Classroom, sino ofrecer una versión mejorada, con nuevas vistas y funciones (ejemplo: gestión de roles de alumnos/profesores, dashboards, etc.).

🔹 Flujo de uso

Usuario accede a la app → “Iniciar sesión con Google”.

La app redirige a Google OAuth → Usuario ingresa credenciales.

Backend recibe el código, obtiene el token y guarda la sesión del usuario.

App consulta la API de Google Classroom y muestra los cursos del usuario.

El usuario puede navegar en los cursos (y en el futuro gestionar alumnos, profesores, tareas, etc.).
