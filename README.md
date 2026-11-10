# Tarea: TypeScript + Vite (introducción a React)

Tecnologías Emergentes - FIUNI
Alumna: Verónica Prieto

## 1. Plantillas de Vite

Vite trae plantillas listas para arrancar un proyecto con el comando:

```bash
npm create vite@latest nombre-proyecto -- --template <plantilla>
```

Hay plantillas para varios frameworks (vanilla, react, vue, svelte, preact, lit, solid, qwik) y casi todas tienen su versión con TypeScript agregando `-ts` al final. Para esta tarea revisé las dos que pedía el profe creando un proyecto con cada una.

**vanilla-ts**

Es la más simple: TypeScript puro sin ningún framework. Trae un `index.html` en la raíz que carga `src/main.ts` con `<script type="module">`, un `counter.ts` de ejemplo, un `style.css` y un solo `tsconfig.json`. En el `package.json` las únicas dependencias de desarrollo son `vite` y `typescript`, y los scripts son `dev`, `build` (`tsc && vite build`) y `preview`. La manipulación del DOM se hace a mano con `document.querySelector`, `createElement`, etc. Es básicamente lo mismo que armamos en clase pero ya configurado.

**react-ts**

Es la plantilla para React con TypeScript. La estructura cambia bastante:

- El punto de entrada es `src/main.tsx` en vez de `main.ts`.
- El `index.html` tiene solo un `<div id="root"></div>` y React se encarga de dibujar todo adentro.
- Agrega como dependencias `react` y `react-dom`, y como dependencias de desarrollo `@types/react`, `@types/react-dom` y el plugin `@vitejs/plugin-react`.
- La configuración de TypeScript se divide en tres archivos: `tsconfig.json` (que solo referencia a los otros dos), `tsconfig.app.json` para el código de la app en `src` y `tsconfig.node.json` para el `vite.config.ts`, que corre en Node.
- En `tsconfig.app.json` aparece la opción `"jsx": "react-jsx"`, que es la que le dice a TypeScript cómo tratar el JSX.
- También trae un linter configurado (oxlint en la versión actual).

El `main.tsx` que genera es así:

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

Comparándolo con el ejemplo de las diapositivas, ahora ya no se usa `render` de `react-dom` sino `createRoot` de `react-dom/client` (es la forma desde React 18), y tampoco hace falta `import * as React from "react"` porque con `react-jsx` el compilador importa solo lo necesario.

## 2. ¿Qué es React y cómo se integra con Vite, TypeScript y TSX?

**React** es una librería de JavaScript creada por Meta para construir interfaces de usuario. La idea principal es dividir la interfaz en **componentes**: funciones que reciben datos (props) y devuelven lo que se tiene que mostrar. Cada componente puede tener su propio estado, y cuando el estado cambia React vuelve a renderizar solo lo que hace falta usando un DOM virtual, en lugar de que uno tenga que modificar el DOM a mano como hacíamos con jQuery o con `createElement`. Es declarativo: uno describe cómo tiene que verse la pantalla según los datos y React se encarga de actualizarla.

**TSX** es la extensión de JSX para TypeScript. JSX permite escribir algo parecido a HTML dentro del código (`<h1>{nombre}</h1>`), y TSX es lo mismo pero en archivos `.tsx` con tipado. Esto permite, por ejemplo, definir las props de un componente con una interfaz o un `type`, y si al usar el componente falta una prop obligatoria o se pasa un tipo incorrecto, el editor marca el error antes de ejecutar:

```tsx
type Props = { name: string; scores: number[] }

function StudentCard({ name, scores }: Props) {
  return <h1>{name}</h1>
}

<StudentCard name="Hermione" />        // error: falta scores
```

**Cómo encaja todo con Vite:**

- El navegador no entiende ni TypeScript ni JSX, así que alguien tiene que transformar los `.ts`/`.tsx` a JavaScript normal. Eso lo hace Vite automáticamente: en desarrollo transforma cada archivo cuando el navegador lo pide (sin empaquetar, usando módulos ES nativos), y por eso el servidor arranca casi al instante.
- Vite solo **quita los tipos**, no los verifica. La verificación la hace `tsc`, por eso el script de build es `tsc -b && vite build`: primero se chequean los tipos y si hay errores el build se corta.
- El plugin `@vitejs/plugin-react` agrega lo específico de React: la transformación de JSX y el Fast Refresh, que es el HMR para componentes (al guardar un cambio se actualiza el componente en el navegador sin perder el estado).
- Para producción `vite build` genera la carpeta `dist` optimizada y minificada. En las diapositivas se menciona Rollup y esbuild; en la versión 8 de Vite (la que se instala hoy) esos dos se reemplazaron por Rolldown y Oxc, que cumplen la misma función pero más rápido. La configuración que usamos en clase sigue funcionando igual.

Entonces: React arma la interfaz con componentes, TypeScript aporta los tipos, TSX permite escribir el marcado con tipos dentro de los componentes, y Vite es la herramienta que junta todo, lo transforma y lo sirve.

## 3. Mini validador de API

### Cómo ejecutarlo

```bash
npm install
npm run dev
```

Se abre en `http://localhost:5173`. Para generar la versión de producción: `npm run build` y después `npm run preview`.

### Estructura

```
ts-vite-app/
├── src/
│   ├── index.html
│   ├── index.ts      → renderiza los resultados en el DOM
│   ├── student.ts    → type Student, safeParse, isStudent y average
│   └── styles.css
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Usé la misma estructura que en clase, con `root: 'src'` en `vite.config.ts` y la salida en `dist`.

### Funcionamiento

- `safeParse(json: string): unknown` envuelve `JSON.parse` en un `try/catch`. Si el texto no es un JSON válido devuelve `undefined` en vez de romper la página. Devuelve `unknown` y no `any` para obligar a validar antes de usar el dato.
- `isStudent(x: unknown): x is Student` es el type guard. Revisa que `x` sea un objeto no nulo, que `id` sea un número, que `name` sea un string no vacío y que `scores` sea un arreglo con al menos un elemento donde todos sean números. Si devuelve `true`, TypeScript hace narrowing y dentro del `if` ya trata al dato como `Student`, con autocompletado de sus propiedades.
- `average(nums: number[]): number` suma con `reduce` y divide por la cantidad. Si el arreglo está vacío devuelve 0 para no dividir por cero.
- Si el dato es válido se muestra un `h1` con el nombre y un `p` con el promedio (con dos decimales). Si no, se muestra un mensaje de error en rojo, distinguiendo si el problema fue que el JSON estaba mal formado o que no tenía la forma de `Student`.

Con el JSON de la consigna el resultado es:

> **Hermione**
> Promedio: 97.67

Además del caso pedido agregué abajo algunos casos de prueba (JSON cortado, `id` como string, un score como string, sin nombre y otro válido) para mostrar que el validador rechaza los datos que no cumplen el tipo.
