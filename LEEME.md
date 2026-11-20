# Codeamigo

App web (adaptada a celular) para aprender programación. Etapas 1 a 4: Login, Datos (crear cuenta), Recuperar contraseña, Inicio, Notificaciones, Catálogo de cursos, Cursos, Lecciones, Perfil, Logros, Planes (Free vs Premium) y Pago de prueba con Mercado Pago.

## Cómo abrirla

Haz doble clic en `index.html`. Se abre en tu navegador y ya funciona; no hay que instalar nada.

Para verla como celular: en Chrome presiona `F12` y luego `Ctrl + Shift + M`.

## Qué hay en cada archivo

| Archivo | Para qué sirve |
| --- | --- |
| `index.html` | Pantalla de Iniciar sesión |
| `registro.html` | Pantalla Datos (crear cuenta) |
| `inicio.html` | Pantalla de Inicio (saludo, racha, nivel, ruta) |
| `curso.html` | Plantilla de curso (Python, Estructuras de Control, C++); se llena con `?id=` |
| `leccion.html` | Plantilla de lección paso a paso; se llena con `?id=...&curso=...` |
| `perfil.html` | Pantalla de Perfil (nombre, XP, racha, estrellas, módulos, cerrar sesión) |
| `logros.html` | Pantalla de Logros (insignias por curso completado) |
| `recuperar.html` | Recuperar contraseña (paso 1: correo, paso 2: contraseña nueva) |
| `cursos.html` | Catálogo con todos los cursos ("Ver todo" en Inicio); marca cuáles son Premium |
| `notificaciones.html` | Avisos (campanita de Inicio) armados con tu progreso real |
| `planes.html` | Comparación de planes Free vs Premium |
| `pago.html` | Pago de prueba de $5 con Mercado Pago (modo sandbox) |
| `respaldo/` | Plan B del pago: pantalla de pago simulada y confirmación (activa Premium) |
| `scripts/` | Scripts de terminal para crear el cobro, buscar pagos y hacer el reembolso |
| `css/estilos.css` | Colores y diseño de todas las pantallas. Los colores de la marca están hasta arriba |
| `js/datos.js` | Guarda y lee las cuentas. Es el único archivo que cambiará cuando haya servidor y pagos |
| `js/cursos.js` | Contenido de los cursos, módulos y lecciones |
| `js/comun.js` | Iconos y mensajitos que usan todas las pantallas |
| `js/login.js`, `js/registro.js`, `js/recuperar.js`, `js/inicio.js`, `js/notificaciones.js`, `js/catalogo.js`, `js/curso.js`, `js/leccion.js`, `js/pago.js` | Lo que hace cada pantalla |
| `img/` | Aquí van `logo.png` y `mascota.png` |

## Imágenes que faltan

Exporta desde Figma y guarda en la carpeta `img/`:

- `logo.png`: el logo de Codeamigo del encabezado
- `mascota.png`: la mascota azul con birrete

Mientras no estén, la app muestra un cuadrito azul en su lugar.

## Cosas que debes saber

- Las cuentas son de prueba: se guardan solo en el navegador donde las creaste.
- El progreso de una cuenta nueva (Nivel 3, 420 XP, racha de 3 días) son los datos de ejemplo del Figma. Se cambian en `progresoDeEjemplo()` dentro de `js/datos.js`.
- Recuperar contraseña no manda correo (no hay servidor todavía): revisa que la cuenta exista y deja poner una nueva.
- Premium se activa al terminar el pago de respaldo (`respaldo/confirmacion_demo.html`). En Planes hay un botón "Volver al plan Free" para repetir la demo.
- C++ es Premium: en el catálogo, si no tienes Premium, te manda a Planes.
- Vidas (Etapa 5): las cuentas Free tienen 5 vidas (❤️) que se ven arriba en cada lección. Cada respuesta incorrecta quita 1; con 0 no se puede hacer lecciones hasta el día siguiente. Se recargan una vez al día, en el primer login del día. Premium tiene vidas ilimitadas (∞). Se guardan en `codeamigo.vidas` y `codeamigo.ultimoRecargoVidas`, separadas por cuenta. Para la demo, `Datos.recargarVidas()` en la consola las vuelve a llenar.
- En la versión con servidor, quien decide si una cuenta es Premium es el servidor al confirmar el pago con Mercado Pago, nunca el navegador.
