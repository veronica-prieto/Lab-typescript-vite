import './styles.css'
import { safeParse, isStudent, average } from './student'

// respuesta simulada de la API
const json = '{"id":1,"name":"Hermione","scores":[95, 100, 98]}'

// casos extra para probar que el validador rechaza lo que no corresponde
const casosDePrueba: { titulo: string; json: string }[] = [
  { titulo: 'JSON mal formado', json: '{"id":2,"name":"Ron",' },
  { titulo: 'id como string', json: '{"id":"3","name":"Harry","scores":[80, 70]}' },
  { titulo: 'scores con un valor que no es número', json: '{"id":4,"name":"Neville","scores":[60, "90"]}' },
  { titulo: 'falta el nombre', json: '{"id":5,"scores":[100]}' },
  { titulo: 'válido', json: '{"id":6,"name":"Luna","scores":[88, 92, 79, 95]}' }
]

function render(contenedor: HTMLElement, input: string): void {
  contenedor.innerHTML = ''
  const data = safeParse(input)

  if (isStudent(data)) {
    // acá TypeScript ya sabe que data es Student
    const h1 = document.createElement('h1')
    h1.textContent = data.name

    const p = document.createElement('p')
    p.textContent = `Promedio: ${average(data.scores).toFixed(2)}`

    contenedor.classList.remove('error')
    contenedor.append(h1, p)
  } else {
    const msg = document.createElement('p')
    msg.textContent = data === undefined
      ? 'Error: la respuesta no es un JSON válido.'
      : 'Error: los datos recibidos no tienen el formato de Student.'

    contenedor.classList.add('error')
    contenedor.append(msg)
  }
}

const app = document.getElementById('app')
const pruebas = document.getElementById('pruebas')

if (app) render(app, json)

if (pruebas) {
  for (const caso of casosDePrueba) {
    const tarjeta = document.createElement('div')
    tarjeta.className = 'caso'

    const titulo = document.createElement('h3')
    titulo.textContent = caso.titulo

    const codigo = document.createElement('code')
    codigo.textContent = caso.json

    const resultado = document.createElement('div')
    resultado.className = 'resultado'
    render(resultado, caso.json)

    tarjeta.append(titulo, codigo, resultado)
    pruebas.append(tarjeta)
  }
}
