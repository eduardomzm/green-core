import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Registro = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '', 
    primer_apellido: '',
    segundo_apellido: '',
    matricula: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Datos listos para enviar al backend:', formData);
    alert('Función de registro en construcción. Revisa la consola para ver los datos separados.');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <header>
        <h1>Registro de Alumno </h1>
        <p>Únete a Green Core y empieza a reciclar</p>
      </header>

      <main style={{ marginTop: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '10px' }}>
          
          <label>Nombre(s):</label>
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />

          <label>Primer Apellido:</label>
          <input type="text" name="primer_apellido" value={formData.primer_apellido} onChange={handleChange} required />

          <label>Segundo Apellido:</label>
          <input type="text" name="segundo_apellido" value={formData.segundo_apellido} onChange={handleChange} />

          <label>Matrícula:</label>
          <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} required />

          <label>Correo electronico:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Contraseña:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />

          <button type="submit" style={{ marginTop: '1rem', padding: '10px', cursor: 'pointer' }}>
            Crear Cuenta
          </button>
        </form>

        <div style={{ marginTop: '1rem' }}>
          <p>¿Ya tienes cuenta? <Link to="/login">Inicia Sesión aquí</Link></p>
          <p><Link to="/">Volver al inicio</Link></p>
        </div>
      </main>
    </div>
  );
};