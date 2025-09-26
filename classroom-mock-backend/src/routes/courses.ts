import { Router, Request, Response } from 'express';
import { getSeed, generateData, getCourseMetrics } from '../services/generator';

const router = Router();

function envelope(data: any, seed: number) {
  return {
    data,
    meta: {
      seed,
      generated_at: new Date().toISOString(),
    },
  };
}

router.get('/', (req: Request, res: Response) => {
  const seed = getSeed();
  const data = generateData(seed);
  const courses = data.courses;
  res.json(envelope(courses, seed));
});

router.get('/:id/assignments', (req: Request, res: Response) => {
  const seed = getSeed();
  const data = generateData(seed);
  const courseId = req.params.id;
  const assignments = data.assignmentsPorCurso[courseId]?.map(a => ({ ...a }));
  // Estado global: mayoría de estados de esa tarea entre todos los alumnos
  if (assignments) {
    for (const a of assignments) {
      const estados: Record<string, number> = {};
      for (const alumno of data.alumnosPorCurso[courseId]) {
        const estado = data.tareasPorAlumno[alumno.id][a.id];
        estados[estado] = (estados[estado] || 0) + 1;
      }
      // Asignar el estado global como string
      (a as any).estado = Object.entries(estados).sort((a, b) => b[1] - a[1])[0][0];
    }
  }
  res.json(envelope(assignments, seed));
});

router.get('/:id/students', (req: Request, res: Response) => {
  const seed = getSeed();
  const data = generateData(seed);
  const courseId = req.params.id;
  const students = data.alumnosPorCurso[courseId];
  res.json(envelope(students, seed));
});

router.get('/:id/metrics', (req: Request, res: Response) => {
  const seed = getSeed();
  const data = generateData(seed);
  const courseId = req.params.id;
  const metrics = getCourseMetrics(courseId, data);
  res.json(envelope(metrics, seed));
});

export default router;
