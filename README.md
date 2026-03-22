# ♻️ GreenCore

**Plataforma Integral de Gestión y Gamificación de Reciclaje Escolar**

GreenCore es un sistema SaaS (Software as a Service) diseñado para conectar alumnos, tutores y administradores en un ecosistema competitivo y ecológico. A través de la gamificación, reportes automatizados y perfiles públicos, GreenCore incentiva el reciclaje en instituciones educativas.

🌍 **En vivo:** [www.greencore.com.mx](https://www.greencore.com.mx)

---

## ✨ Características Principales

### 👨‍🎓 Para el Alumno (Gamificación y Registro)
* **Dashboard Personal:** Registro de depósitos de reciclaje y monitoreo de metas asignadas.
* **Perfiles Públicos Interactivos:** Vistas 3D personalizables con enlaces a redes sociales y biografía.
* **Vitrina de Trofeos:** Sistema de medallas temáticas otorgadas mensualmente al Top 3 de recicladores.
* **Rankings en Tiempo Real:** Tabla de posiciones mensual para fomentar la competencia sana.

### 👨‍🏫 Para el Tutor (Gestión de Grupos)
* **Gestión de Solicitudes:** Sistema de aprobación y rechazo para ingresos y abandonos de alumnos en sus grupos.
* **Asignación de Metas:** Capacidad de establecer objetivos de reciclaje específicos para alumnos individuales.
* **Monitoreo:** Seguimiento del rendimiento y depósitos de su grupo a cargo.

### 👑 Para el Administrador (Control Total)
* **Panel Analítico (Dashboard):** Métricas en tiempo real de últimos depósitos y usuarios registrados.
* **Motor de Cortes Mensuales:** Botón de acción para cerrar el mes, calcular el Top 3 y repartir medallas automáticamente.
* **Reportes Exportables:** Generación y descarga de reportes detallados en PDF por mes específico.
* **Gestión de Usuarios (CRUD):** Control total sobre la información de alumnos, tutores y configuraciones del sistema.

---

## 💻 Stack Tecnológico

El proyecto está construido con una arquitectura separada (Decoupled Architecture) para máxima escalabilidad:

**Frontend (Client)**
* [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
* [Vite](https://vitejs.dev/) (Bundler)
* [Tailwind CSS](https://tailwindcss.com/) (Estilos)
* [Lucide React](https://lucide.dev/) (Iconografía optimizada)
* Desplegado en **Vercel**

**Backend (API Rest)**
* [Python 3](https://www.python.org/) + [Django](https://www.djangoproject.com/)
* [Django REST Framework (DRF)](https://www.django-rest-framework.org/)
* [Anymail / Brevo](https://www.brevo.com/) (Infraestructura transaccional de correos)
* Desplegado en **Render**

**Base de Datos**
* [PostgreSQL](https://www.postgresql.org/) (Alojada en Render)

---

