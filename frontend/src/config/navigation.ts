import {
  LayoutDashboard,
  Recycle,
  Users,
  Trophy,
  FileText,
  History,
  UsersRound
} from "lucide-react";

export const NAVIGATION = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['ADMIN', 'OPERADOR', 'ALUMNO', 'TUTOR'] },
  { name: 'Depósitos', path: '/dashboard/depositos', icon: Recycle, roles: ['ADMIN'] },
  { name: 'Mi Grupo', path: '/dashboard/mi-grupo', icon: UsersRound, roles: ['TUTOR'] },
  { name: 'Usuarios', path: '/dashboard/usuarios', icon: Users, roles: ['ADMIN'] },
  { name: 'Rankings', path: '/dashboard/rankings', icon: Trophy, roles: ['ADMIN', 'ALUMNO', 'TUTOR', 'OPERADOR'] },
  { name: 'Reportes', path: '/dashboard/estadisticas', icon: FileText, roles: ['ADMIN', 'TUTOR'] },
  { name: 'Mis Depósitos', path: '/dashboard/historial', icon: History, roles: ['ALUMNO'] },
];