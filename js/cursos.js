/* ==========================================================
   cursos.js - el CONTENIDO de la app: cursos, módulos y lecciones.

   Para agregar o cambiar contenido solo se edita este archivo;
   las pantallas se arman solas con lo que haya aquí.
   ========================================================== */

/* ---------- Lecciones ----------
   Cada lección es una lista de "pasos". Hay dos tipos de paso:
   - "explicacion": texto (y código de ejemplo) para leer.
   - "pregunta": pregunta con opciones; "correcta" es el número de
     la opción buena, empezando a contar desde 0.               */
const GRUPOS_DE_LECCIONES = {
  condicionales: [
    {
      id: "cond-1",
      titulo: "Tu primer if",
      minutos: 3,
      xp: 30,
      pasos: [
        {
          tipo: "explicacion",
          titulo: "Decisiones con if",
          parrafos: [
            "Un «if» le dice a Python: haz esto solo si se cumple una condición.",
            "Fíjate en dos cosas: los dos puntos (:) al final de la línea del if, y los espacios antes de print. Esos espacios se llaman sangría y le dicen a Python qué líneas pertenecen al if."
          ],
          codigo: 'edad = 18\nif edad >= 18:\n    print("Puedes entrar")'
        },
        {
          tipo: "pregunta",
          pregunta: "¿Qué imprime este programa?",
          codigo: 'temperatura = 30\nif temperatura > 25:\n    print("Hace calor")',
          opciones: ["Nada", "Hace calor", "Un error"],
          correcta: 1,
          explicacion: "30 es mayor que 25, así que la condición se cumple y se ejecuta el print."
        },
        {
          tipo: "pregunta",
          pregunta: "¿Qué le falta a esta línea?",
          codigo: "if puntos > 10",
          opciones: ["Los dos puntos (:) al final", "Un punto y coma (;) al final", "Paréntesis obligatorios"],
          correcta: 0,
          explicacion: "En Python la línea del if siempre termina con dos puntos."
        }
      ]
    },
    {
      id: "cond-2",
      titulo: "Comparaciones",
      minutos: 3,
      xp: 30,
      pasos: [
        {
          tipo: "explicacion",
          titulo: "Preguntas de sí o no",
          parrafos: [
            "Una condición es una pregunta que Python responde con True (verdadero) o False (falso).",
            "Para preguntar se usan los operadores de comparación. Ojo: un solo = guarda un valor; dos == comparan."
          ],
          codigo: "==   igual a\n!=   distinto de\n>    mayor que\n<    menor que\n>=   mayor o igual que\n<=   menor o igual que"
        },
        {
          tipo: "pregunta",
          pregunta: "¿Cuál de estas líneas pregunta si x es igual a 5?",
          opciones: ["x = 5", "x != 5", "x == 5"],
          correcta: 2,
          explicacion: "x == 5 compara. En cambio x = 5 guarda el 5 dentro de x."
        },
        {
          tipo: "pregunta",
          pregunta: "¿Qué imprime este programa?",
          codigo: 'puntos = 7\nif puntos >= 10:\n    print("Ganaste")',
          opciones: ["Nada", "Ganaste", "7"],
          correcta: 0,
          explicacion: "7 no es mayor o igual que 10, así que la condición es falsa y el print no se ejecuta."
        }
      ]
    },
    {
      id: "cond-3",
      titulo: "Si no: else",
      minutos: 3,
      xp: 30,
      pasos: [
        {
          tipo: "explicacion",
          titulo: "El plan B",
          parrafos: [
            "Con «else» le dices a Python qué hacer cuando la condición del if NO se cumple.",
            "Siempre se ejecuta uno de los dos bloques: el del if o el del else, nunca los dos."
          ],
          codigo: 'edad = 15\nif edad >= 18:\n    print("Puedes entrar")\nelse:\n    print("Aún no puedes entrar")'
        },
        {
          tipo: "pregunta",
          pregunta: "¿Qué imprime este programa?",
          codigo: 'numero = 3\nif numero > 5:\n    print("Grande")\nelse:\n    print("Pequeño")',
          opciones: ["Grande", "Pequeño", "Grande y Pequeño"],
          correcta: 1,
          explicacion: "3 no es mayor que 5, entonces se ejecuta el bloque del else."
        },
        {
          tipo: "pregunta",
          pregunta: "¿Cuándo se ejecuta el bloque del else?",
          opciones: ["Siempre", "Cuando la condición del if es verdadera", "Cuando la condición del if es falsa"],
          correcta: 2,
          explicacion: "El else es el camino que se toma cuando el if no se cumple."
        }
      ]
    },
    {
      id: "cond-4",
      titulo: "Varias opciones: elif",
      minutos: 4,
      xp: 30,
      pasos: [
        {
          tipo: "explicacion",
          titulo: "Más de dos caminos",
          parrafos: [
            "Cuando hay más de dos opciones se usa «elif», que significa «si no, entonces si...».",
            "Python revisa las condiciones de arriba hacia abajo y ejecuta solo el primer bloque que se cumpla."
          ],
          codigo: 'nota = 8\nif nota >= 9:\n    print("Excelente")\nelif nota >= 7:\n    print("Bien")\nelse:\n    print("A repasar")'
        },
        {
          tipo: "pregunta",
          pregunta: "Con nota = 8, ¿qué imprime este programa?",
          codigo: 'nota = 8\nif nota >= 9:\n    print("Excelente")\nelif nota >= 7:\n    print("Bien")\nelse:\n    print("A repasar")',
          opciones: ["Excelente", "Bien", "A repasar"],
          correcta: 1,
          explicacion: "8 no llega a 9, pero sí es mayor o igual que 7, así que entra al elif."
        },
        {
          tipo: "pregunta",
          pregunta: "Y si nota = 10, ¿qué imprime?",
          codigo: 'nota = 10\nif nota >= 9:\n    print("Excelente")\nelif nota >= 7:\n    print("Bien")\nelse:\n    print("A repasar")',
          opciones: ["Excelente y Bien", "Bien", "Excelente"],
          correcta: 2,
          explicacion: "Aunque 10 también es mayor que 7, Python se queda con el primer bloque que se cumple y se salta los demás."
        }
      ]
    },
    {
      id: "cond-5",
      titulo: "Reto: detector de números pares",
      minutos: 5,
      xp: 30,
      pasos: [
        {
          tipo: "explicacion",
          titulo: "El operador %",
          parrafos: [
            "El operador % da el residuo de una división. Por ejemplo, 7 % 2 da 1 y 8 % 2 da 0.",
            "Un número es par cuando al dividirlo entre 2 el residuo es 0. Con eso ya puedes armar un detector de pares."
          ],
          codigo: "print(7 % 2)   # 1\nprint(8 % 2)   # 0"
        },
        {
          tipo: "pregunta",
          pregunta: "¿Cuánto vale 10 % 2?",
          opciones: ["5", "2", "0"],
          correcta: 2,
          explicacion: "10 entre 2 da 5 exacto, así que el residuo es 0."
        },
        {
          tipo: "pregunta",
          pregunta: "¿Qué condición detecta un número par?",
          opciones: ["numero % 2 == 0", "numero / 2 == 0", "numero % 2 == 1"],
          correcta: 0,
          explicacion: "Si el residuo de dividir entre 2 es 0, el número es par."
        },
        {
          tipo: "pregunta",
          pregunta: "¿Qué imprime tu detector con el número 7?",
          codigo: 'numero = 7\nif numero % 2 == 0:\n    print("Par")\nelse:\n    print("Impar")',
          opciones: ["Par", "Impar", "Nada"],
          correcta: 1,
          explicacion: "7 % 2 da 1, que no es 0, así que se ejecuta el else."
        }
      ]
    }
  ]
};

/* ---------- Cursos ----------
   "diseno" dice cómo se dibuja la pantalla del curso:
   "mapa" (camino en zigzag) o "lista" (plan de experimentos).
   Un módulo con "lecciones" usa uno de los grupos de arriba;
   si no tiene, aparece como "Próximamente".                    */
const CURSOS = [
  {
    id: "python",
    diseno: "mapa",
    tema: "tema-azul",
    ruta: "RUTA 01 / LÓGICA CREATIVA",
    titulo: "Python",
    tituloEnInicio: "Python desde cero",
    siglas: "Py",
    icono: "codigo",
    lema: "Desde cero a tus propias ideas.",
    tituloMapa: "Tu próxima gran idea",
    etiquetaMapa: "mapa.py",
    insignia: "Insignia Python Básico",
    modulos: [
      { id: "python-1", titulo: "Hola, Python", temas: "print() · Tu primer programa" },
      { id: "python-2", titulo: "Variables y tipos de datos", temas: "int · str · float · bool" },
      { id: "python-3", titulo: "Decide con condicionales", temas: "if · elif · else", lecciones: "condicionales", reto: "Reto: crea un detector de números pares" },
      { id: "python-4", titulo: "Bucles y listas", temas: "for · while · listas" }
    ]
  },
  {
    id: "control",
    diseno: "mapa",
    tema: "tema-azul",
    ruta: "RUTA / LÓGICA EN ACCIÓN",
    titulo: "Estructuras de control",
    tituloEnInicio: "Estructuras de control",
    siglas: "",
    icono: "capas",
    lema: "Decide, repite y dale rumbo a tu código.",
    tituloMapa: "Cada decisión abre un camino",
    etiquetaMapa: "mapa de lógica",
    modulos: [
      { id: "control-1", titulo: "Condicionales y bucles", temas: "if · elif · else · for · while", lecciones: "condicionales", reto: "Reto: crea un detector de números pares" },
      { id: "control-2", titulo: "Combina decisiones", temas: "and · or · not · condiciones anidadas" },
      { id: "control-3", titulo: "Controla las repeticiones", temas: "range() · break · continue" },
      { id: "control-4", titulo: "Un menú interactivo", temas: "Reto final · Pon tu lógica a prueba" }
    ]
  },
  {
    id: "cpp",
    diseno: "lista",
    tema: "tema-ciruela",
    ruta: "RUTA 02 / SISTEMAS",
    titulo: "C++ desde cero",
    tituloEnInicio: "C++ desde cero",
    siglas: "C++",
    letra: "C",
    chip: "LAB C",
    nombreCorto: "C",
    lema: "Entiende lo que pasa bajo el código.",
    tituloMapa: "Plan de experimentos",
    terminal: ["$ gcc hola.c -o hola", "> Hola, mundo!_"],
    requiere: "python",                 // se desbloquea al terminar Python
    textoBloqueo: "Consigue Python Básico para abrir este laboratorio.",
    retoFinal: { titulo: "Reto final: una mini calculadora", detalle: "+100 XP · Insignia Mente de sistemas" },
    modulos: [
      { id: "cpp-1", titulo: "Hola, terminal", temas: "main() · printf() · compilación" },
      { id: "cpp-2", titulo: "Datos bajo control", temas: "int · char · float · scanf()" },
      { id: "cpp-3", titulo: "El flujo del programa", temas: "if · switch · for · while" },
      { id: "cpp-4", titulo: "Dentro de la memoria", temas: "arrays · punteros · malloc()" }
    ]
  }
];

/* ---------- Funciones para consultar el contenido ---------- */
const Cursos = (function () {

  function buscarCurso(idCurso) {
    return CURSOS.find(function (c) { return c.id === idCurso; }) || null;
  }

  function leccionesDeModulo(modulo) {
    return (modulo.lecciones && GRUPOS_DE_LECCIONES[modulo.lecciones]) || [];
  }

  // Busca una lección por su id. Regresa también su grupo y su posición.
  function buscarLeccion(idLeccion) {
    for (const nombre in GRUPOS_DE_LECCIONES) {
      const grupo = GRUPOS_DE_LECCIONES[nombre];
      const posicion = grupo.findIndex(function (l) { return l.id === idLeccion; });
      if (posicion !== -1) {
        return { leccion: grupo[posicion], grupo: grupo, posicion: posicion };
      }
    }
    return null;
  }

  // Calcula cómo va un usuario en un curso: qué módulos lleva,
  // cuál es el actual y si el curso está bloqueado.
  function resumen(curso, progreso) {
    // ¿Depende de terminar otro curso antes?
    let faltanDelRequisito = 0;
    if (curso.requiere) {
      faltanDelRequisito = resumen(buscarCurso(curso.requiere), progreso).faltantes;
    }
    const bloqueado = faltanDelRequisito > 0;

    let yaHayActual = false;
    const modulos = curso.modulos.map(function (modulo, i) {
      const lecciones = leccionesDeModulo(modulo);
      const hechas = lecciones.filter(function (l) {
        return progreso.leccionesCompletadas.includes(l.id);
      }).length;

      const completo = progreso.modulosCompletados.includes(modulo.id) ||
        (lecciones.length > 0 && hechas === lecciones.length);

      let estado = "bloqueado";
      if (completo) {
        estado = "completado";
      } else if (!bloqueado && !yaHayActual) {
        estado = "actual";             // el primero sin terminar: "estás aquí"
        yaHayActual = true;
      }

      return {
        modulo: modulo,
        numero: i + 1,
        estado: estado,
        lecciones: lecciones,
        hechas: hechas,
        siguiente: lecciones[hechas] || null   // la lección que sigue
      };
    });

    const completados = modulos.filter(function (m) { return m.estado === "completado"; }).length;
    const faltantes = modulos.length - completados;

    let estado = "en-curso";
    if (bloqueado) estado = "bloqueado";
    else if (faltantes === 0) estado = "completado";

    return {
      estado: estado,
      bloqueado: bloqueado,
      faltanDelRequisito: faltanDelRequisito,
      modulos: modulos,
      completados: completados,
      faltantes: faltantes,
      actual: modulos.find(function (m) { return m.estado === "actual"; }) || null
    };
  }

  // "1 módulo" o "2 módulos"
  function contarModulos(cantidad) {
    return cantidad + (cantidad === 1 ? " módulo" : " módulos");
  }

  return {
    buscarCurso: buscarCurso,
    buscarLeccion: buscarLeccion,
    resumen: resumen,
    contarModulos: contarModulos
  };
})();
