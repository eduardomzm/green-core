import { Link } from 'react-router-dom';

export const Landing = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <header>
        <h1>Bienvenido a Green Core </h1>
        <p>Sistema Inteligente de Reciclaje Universitario</p>
      </header>

      <main style={{ marginTop: '2rem' }}>
        <section>
          <h2>¿Qué es este proyecto?</h2>
          <p>
            Green Core es una plataforma diseñada para incentivar y gestionar
            el reciclaje dentro de nuestra institución.
          </p>
          <ul>
            <li>Acumula puntos por reciclar.</li>
            <li>Alcanza metas grupales e individuales.</li>
            <li>Ayuda al medio ambiente.</li>
          </ul>
        </section>

        {/* Sección de acciones (Botones) */}
        <section style={{ marginTop: '2rem' }}>
          <Link to="/login">
            <button style={{ padding: '10px 20px', marginRight: '10px', cursor: 'pointer' }}>
              Iniciar Sesión
            </button>
          </Link>
          
          <Link to="/registro">
            <button style={{ padding: '10px 20px', cursor: 'pointer' }}>
              Registrarse
            </button>
          </Link>
        </section>
      </main>

      <footer style={{ marginTop: '3rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
        <p><small>© 2026 Proyecto Universitario - Green Core</small></p>
      </footer>
    </div>
  );
};