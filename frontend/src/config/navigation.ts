import {
  LayoutDashboard,
  Recycle,
  Users,
  Trophy,
  FileText,
  History,
  UsersRound,
  GraduationCap,
  Key,
  Settings,
  UserCircle,
  Target
} from "lucide-react";

export const NAVIGATION = [
  { name: 'Inicio', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'OPERADOR', 'ALUMNO', 'TUTOR'] },
  { name: 'Mi Perfil', path: '/dashboard/mi-perfil', icon: UserCircle, roles: ['ALUMNO'] },
  { name: 'Depósitos', path: '/dashboard/depositos', icon: Recycle, roles: ['ADMIN'] },
  { name: 'Administración', path: '/dashboard/administracion', icon: Settings, roles: ['ADMIN'] },
  { name: 'Mi Grupo', path: '/dashboard/mi-grupo', icon: UsersRound, roles: ['TUTOR'] },
  { name: 'Mi Grupo', path: '/dashboard/mi-grupo/unirse', icon: Key, roles: ['ALUMNO'] },
  { name: 'Usuarios', path: '/dashboard/usuarios', icon: Users, roles: ['ADMIN'] },
  { name: 'Grupos y Carreras', path: '/dashboard/grupos-carreras', icon: GraduationCap, roles: ['ADMIN'] },
  { name: 'Rankings', path: '/dashboard/rankings', icon: Trophy, roles: ['ADMIN', 'ALUMNO', 'TUTOR', 'OPERADOR'] },
  { name: 'Reportes', path: '/dashboard/estadisticas', icon: FileText, roles: ['ADMIN', 'TUTOR'] },
  { name: 'Mis Depósitos', path: '/dashboard/historial', icon: History, roles: ['ALUMNO'] },
  { name: 'Metas', path: '/dashboard/metas', icon: Target, roles: ['ADMIN'] },
];