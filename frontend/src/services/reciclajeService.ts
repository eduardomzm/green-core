import api from './api'; // Asegúrate de que esta ruta apunte a tu instancia de Axios

// Interfaces para TypeScript
export interface Material {
  id: number;
  nombre: string;
  unidad: string;
  activo: boolean;
}

// 1. Obtener y Crear Materiales
export const getMateriales = async (): Promise<Material[]> => {
  const response = await api.get('/materiales/');
  return response.data;
};

export const createMaterial = async (data: { nombre: string; unidad: string }) => {
  const response = await api.post('/materiales/', data);
  return response.data;
};

// 2. Registrar Depósito
export const createDeposito = async (data: { alumno: number; material: number; cantidad: number }) => {
  const response = await api.post('/depositos/', data);
  return response.data;
};

// 3. Configurar Meta
export const createMeta = async (data: { nombre: string; cantidad_meta: number; activa: boolean }) => {
  const response = await api.post('/metas/', data);
  return response.data;
};