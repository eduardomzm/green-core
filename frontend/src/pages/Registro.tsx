import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerAlumno } from '../services/authService';

export const Registro = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    
    username: '',
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
    try {
      const response = await registerAlumno(formData);
      
      alert(response.mensaje || '¡Registro exitoso!');
      navigate('/login');

    } catch (error: any) {
      const errorMsg = error.response?.data 
        ? JSON.stringify(error.response.data)
        : 'Error desconocido al registrar';
      alert('Error: ' + errorMsg);
      console.error("Error completo:", error);
    }
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <header>
        <h1>Registro de Alumno</h1>
        <p>Únete a Green Core y empieza a reciclar</p>
      </header>

      <main style={{ marginTop: '2rem' }}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', maxWidth: '300px', gap: '10px' }}>
          
          <label>Nombre de Usuario:</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />

          <label>Nombre(s):</label>
          <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />

          <label>Primer Apellido:</label>
          <input type="text" name="primer_apellido" value={formData.primer_apellido} onChange={handleChange} required />

          <label>Segundo Apellido:</label>
          <input type="text" name="segundo_apellido" value={formData.segundo_apellido} onChange={handleChange} required/>

          <label>Matrícula:</label>
          <input type="text" name="matricula" value={formData.matricula} onChange={handleChange} required />

          <label>Correo Institucional:</label>
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