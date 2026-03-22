import api from "./api";

export interface Notificacion {
    id: number;
    titulo: string;
    mensaje: string;
    tipo: 'INFO' | 'WARNING' | 'SUCCESS' | 'SYSTEM' | 'ACHIEVEMENT';
    leida: boolean;
    enlace?: string | null;
    fecha_creacion: string;
}

export const getNotificaciones = async (): Promise<Notificacion[]> => {
    const response = await api.get('notificaciones/');
    return response.data;
};

export const marcarComoLeida = async (id: number): Promise<void> => {
    await api.patch(`notificaciones/${id}/marcar_leida/`);
};

export const marcarTodasComoLeidas = async (): Promise<void> => {
    await api.post('notificaciones/marcar_todas_leidas/');
};
