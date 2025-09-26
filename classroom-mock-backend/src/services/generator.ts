// Aquí irá la lógica para generar datos aleatorios reproducibles
// con una semilla (SEED)



import { Course, Assignment, Student, CourseMetrics, Overview } from '../models/types';
import { SeededRandom } from '../utils/metrics';

const COURSE_LIST = [
  { id: '1', nombre: 'Especialista en eCommerce', modulos: 3 },
  { id: '2', nombre: 'Semillero Digital: Especialista en Marketing Digital', modulos: 3 },
];
const ALUMNOS_TOTAL = 300;
const MODULOS = 3;
const TAREAS_POR_MODULO = 3;
const ESTADOS = [
  { estado: 'entregada', prob: 0.55 },
  { estado: 'pendiente', prob: 0.25 },
  { estado: 'atrasada', prob: 0.15 },
  { estado: 'no_entregada', prob: 0.05 },
];
const NOMBRES = [
  'Juan', 'Ana', 'Pedro', 'Lucía', 'Carlos', 'Sofía', 'Miguel', 'Valentina', 'Diego', 'Camila',
  'Mateo', 'Martina', 'David', 'Isabella', 'Daniel', 'Gabriela', 'Andrés', 'Paula', 'Javier', 'Mariana',
  'Sebastián', 'Nicole', 'Tomás', 'Victoria', 'Alejandro', 'Emilia', 'Samuel', 'Renata', 'Felipe', 'Antonia'
];

export function getSeed(): number {
  if (process.env.SEED) {
    return Number(process.env.SEED);
  }
  // Si no hay SEED, generar una aleatoria
  return Math.floor(Math.random() * 1e9);
}

function pickEstado(rand: SeededRandom): string {
  const r = rand.next();
  let acc = 0;
  for (const e of ESTADOS) {
    acc += e.prob;
    if (r < acc) return e.estado;
  }
  return ESTADOS[ESTADOS.length - 1].estado;
}

function randomDate(rand: SeededRandom, from: Date, to: Date): Date {
  const diff = to.getTime() - from.getTime();
  return new Date(from.getTime() + rand.next() * diff);
}

function genAlumnos(rand: SeededRandom, count: number): Student[] {
  const alumnos: Student[] = [];
  for (let i = 0; i < count; i++) {
    const nombre = `${rand.pick(NOMBRES)} ${rand.pick(NOMBRES)} ${rand.nextInt(1, 99)}`;
    alumnos.push({
      id: `A${i + 1}`,
      nombre,
      porcentaje_progreso: 0,
      tareas_entregadas: 0,
      tareas_atrasadas: 0,
      nivel_riesgo: 0,
      ultimo_acceso: new Date(Date.now() - rand.nextInt(0, 20) * 86400000).toISOString(),
    });
  }
  return alumnos;
}

function genAssignments(rand: SeededRandom, courseId: string): Assignment[] {
  const assignments: Assignment[] = [];
  const now = new Date();
  const from = new Date(now.getTime() - 60 * 86400000);
  const to = new Date(now.getTime() + 15 * 86400000);
  let idx = 1;
  for (let m = 1; m <= MODULOS; m++) {
    for (let t = 1; t <= TAREAS_POR_MODULO; t++) {
      assignments.push({
        id: `${courseId}-M${m}T${t}`,
        titulo: `Tarea ${t} - Módulo ${m}`,
        modulo: m,
        fecha_limite: randomDate(rand, from, to).toISOString(),
        estado: '', // se asigna después
      });
      idx++;
    }
  }
  return assignments;
}

export function generateData(seed: number) {
  const rand = new SeededRandom(seed);
  // Cursos
  const courses: Course[] = COURSE_LIST.map((c, i) => ({
    ...c,
    alumnos_count: ALUMNOS_TOTAL / 2,
  }));

  // Alumnos por curso
  const alumnosPorCurso: Record<string, Student[]> = {};
  for (const c of courses) {
    alumnosPorCurso[c.id] = genAlumnos(rand, c.alumnos_count);
  }

  // Tareas por curso
  const assignmentsPorCurso: Record<string, Assignment[]> = {};
  for (const c of courses) {
    assignmentsPorCurso[c.id] = genAssignments(rand, c.id);
  }

  // Estados de tareas por alumno
  const tareasPorAlumno: Record<string, Record<string, string>> = {};
  for (const c of courses) {
    for (const alumno of alumnosPorCurso[c.id]) {
      tareasPorAlumno[alumno.id] = {};
      for (const tarea of assignmentsPorCurso[c.id]) {
        const estado = pickEstado(rand);
        tareasPorAlumno[alumno.id][tarea.id] = estado;
      }
    }
  }

  // Calcular progreso, entregas, atrasos, riesgo, etc.
  for (const c of courses) {
    for (const alumno of alumnosPorCurso[c.id]) {
      let entregadas = 0, atrasadas = 0, no_entregadas = 0;
      for (const tarea of assignmentsPorCurso[c.id]) {
        const estado = tareasPorAlumno[alumno.id][tarea.id];
        if (estado === 'entregada') entregadas++;
        if (estado === 'atrasada') atrasadas++;
        if (estado === 'no_entregada') no_entregadas++;
      }
      alumno.tareas_entregadas = entregadas;
      alumno.tareas_atrasadas = atrasadas;
      alumno.porcentaje_progreso = entregadas / (MODULOS * TAREAS_POR_MODULO);
      alumno.nivel_riesgo = ((atrasadas * 0.3) + (no_entregadas * 0.7)) / (MODULOS * TAREAS_POR_MODULO);
    }
  }

  return {
    courses,
    alumnosPorCurso,
    assignmentsPorCurso,
    tareasPorAlumno,
  };
}

// Métricas agregadas
export function getCourseMetrics(courseId: string, data: ReturnType<typeof generateData>): CourseMetrics {
  const alumnos = data.alumnosPorCurso[courseId];
  const assignments = data.assignmentsPorCurso[courseId];
  const totalTareas = assignments.length;
  let totalAtrasadas = 0, totalNoEntregadas = 0, totalEntregadas = 0, totalDiasEntrega = 0, totalFinalizados = 0, alumnosEnRiesgo = 0, totalRetenidos = 0;
  for (const alumno of alumnos) {
    let entregadas = 0, atrasadas = 0, no_entregadas = 0, sumaDias = 0;
    for (const tarea of assignments) {
      const estado = data.tareasPorAlumno[alumno.id][tarea.id];
      if (estado === 'entregada') {
        entregadas++;
        // Simular días de entrega (antes/después de fecha límite)
        sumaDias += Math.abs(Math.floor(Math.random() * 7) - 2); // aleatorio entre -2 y +4 días
      }
      if (estado === 'atrasada') atrasadas++;
      if (estado === 'no_entregada') no_entregadas++;
    }
    totalEntregadas += entregadas;
    totalAtrasadas += atrasadas;
    totalNoEntregadas += no_entregadas;
    totalDiasEntrega += sumaDias;
    if (entregadas === totalTareas) totalFinalizados++;
    if (alumno.nivel_riesgo > 0.5) alumnosEnRiesgo++;
    if (alumno.porcentaje_progreso > 0.2) totalRetenidos++;
  }
  return {
    porcentaje_atraso: totalAtrasadas / (alumnos.length * totalTareas),
    porcentaje_no_entrega: totalNoEntregadas / (alumnos.length * totalTareas),
    tiempo_promedio_entrega_dias: totalEntregadas ? totalDiasEntrega / totalEntregadas : 0,
    porcentaje_finalizacion: totalFinalizados / alumnos.length,
    cantidad_alumnos_en_riesgo: alumnosEnRiesgo,
    tasa_retencion: totalRetenidos / alumnos.length,
  };
}

export function getOverview(data: ReturnType<typeof generateData>): Overview {
  let totalAlumnos = 0, totalTareas = 0, totalAtrasadas = 0, totalNoEntregadas = 0, totalEntregadas = 0, totalFinalizados = 0;
  for (const courseId in data.alumnosPorCurso) {
    const alumnos = data.alumnosPorCurso[courseId];
    const assignments = data.assignmentsPorCurso[courseId];
    totalAlumnos += alumnos.length;
    totalTareas += assignments.length * alumnos.length;
    for (const alumno of alumnos) {
      let entregadas = 0, atrasadas = 0, no_entregadas = 0;
      for (const tarea of assignments) {
        const estado = data.tareasPorAlumno[alumno.id][tarea.id];
        if (estado === 'entregada') entregadas++;
        if (estado === 'atrasada') atrasadas++;
        if (estado === 'no_entregada') no_entregadas++;
      }
      totalEntregadas += entregadas;
      totalAtrasadas += atrasadas;
      totalNoEntregadas += no_entregadas;
      if (entregadas === assignments.length) totalFinalizados++;
    }
  }
  return {
    total_alumnos: totalAlumnos,
    total_tareas: totalTareas,
    porcentaje_atraso: totalAtrasadas / totalTareas,
    porcentaje_no_entrega: totalNoEntregadas / totalTareas,
    porcentaje_finalizacion_global: totalFinalizados / totalAlumnos,
  };
}
