export interface Course {
  id: string;
  nombre: string;
  modulos: number;
  alumnos_count: number;
}

export interface Assignment {
  id: string;
  titulo: string;
  modulo: number;
  fecha_limite: string;
  estado: string;
}

export interface Student {
  id: string;
  nombre: string;
  porcentaje_progreso: number;
  tareas_entregadas: number;
  tareas_atrasadas: number;
  nivel_riesgo: number;
  ultimo_acceso: string;
}

export interface CourseMetrics {
  porcentaje_atraso: number;
  porcentaje_no_entrega: number;
  tiempo_promedio_entrega_dias: number;
  porcentaje_finalizacion: number;
  cantidad_alumnos_en_riesgo: number;
  tasa_retencion: number;
}

export interface Overview {
  total_alumnos: number;
  total_tareas: number;
  porcentaje_atraso: number;
  porcentaje_no_entrega: number;
  porcentaje_finalizacion_global: number;
}
