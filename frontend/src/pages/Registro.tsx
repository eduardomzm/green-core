import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerAlumno } from '../services/authService';
import { Button } from "../components/common/Button";
import Background from "../components/common/Background";
import { Modal } from '../components/common/Modal';
import { TERMINOS_CONTENT, PRIVACIDAD_CONTENT } from '../constants/legalContent';

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

  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [aceptaPrivacidad, setAceptaPrivacidad] = useState(false);

  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorUI, setErrorUI] = useState("");

  const [showTerminos, setShowTerminos] = useState(false);
  const [showPrivacidad, setShowPrivacidad] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const pwd = formData.password;
  
  const reqLength = pwd.length >= 8;
  
  const reqNotNumeric = pwd.length > 0 && !/^\d+$/.test(pwd);
  
  const reqNotSimilar = pwd.length > 0 && 
    !(formData.username.length >= 3 && pwd.toLowerCase().includes(formData.username.toLowerCase())) &&
    !(formData.email.length >= 3 && pwd.toLowerCase().includes(formData.email.split('@')[0].toLowerCase()));
    
  const reqNotCommon = pwd.length > 0 && !['12345678', 'password', 'qwertyui', '123456789', 'admin123'].includes(pwd.toLowerCase());

  const getRuleColor = (isValid: boolean) => {
    if (pwd.length === 0) return "text-gray-400"; 
    return isValid ? "text-primary font-bold" : "text-red-500"; 
  };

  const getRuleIcon = (isValid: boolean) => {
    if (pwd.length === 0) return "○";
    return isValid ? "✓" : "✕";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorUI(""); 
    
    if (pwd !== confirmPassword) {
      setErrorUI("Las contraseñas no coinciden. Por favor, verifícalas.");
      return;
    }

    if (!reqLength || !reqNotNumeric || !reqNotSimilar || !reqNotCommon) {
      setErrorUI("Por favor, asegúrate de que tu contraseña cumpla con todos los requisitos de seguridad.");
      return;
    }
    
    try {
      const response = await registerAlumno(formData);
      alert(response.mensaje || '¡Registro exitoso!');
      navigate('/login');
    } catch (error: any) {
      const errorMsg = error.response?.data 
        ? JSON.stringify(error.response.data)
        : 'Error desconocido al registrar';
      
      setErrorUI('Error: ' + errorMsg);
      console.error("Error completo:", error);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center font-sans text-textMain px-4 py-10">
      <Background></Background>

      <div className="relative z-10 bg-white/90 backdrop-blur-md p-8 sm:p-10 rounded-[2rem] shadow-2xl w-full max-w-lg border border-white/40">
        
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-primary tracking-tight">Registro de Alumno</h1>
          <p className="text-gray-500 mt-2 text-sm font-medium">
            Únete a Green Core y empieza a reciclar
          </p>
        </div>

        {errorUI && (
          <div className="bg-red-50/90 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 text-xs font-bold shadow-sm break-words">
            {errorUI}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-xs font-bold text-textMain mb-1.5 ml-1 uppercase tracking-wide opacity-80">
              Nombre de Usuario
            </label>
            <input type="text" name="username" placeholder=""
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all bg-background/50 focus:bg-white shadow-inner text-sm"
              value={formData.username} onChange={handleChange} required />
          </div>

          <div>
            <label className="block text-xs font-bold text-textMain mb-1.5 ml-1 uppercase tracking-wide opacity-80">
              Nombre(s)
            </label>
            <input type="text" name="first_name" placeholder=""
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all bg-background/50 focus:bg-white shadow-inner text-sm"
              value={formData.first_name} onChange={handleChange} required />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-textMain mb-1.5 ml-1 uppercase tracking-wide opacity-80">
                Primer Apellido
              </label>
              <input type="text" name="primer_apellido" placeholder=""
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all bg-background/50 focus:bg-white shadow-inner text-sm"
                value={formData.primer_apellido} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-textMain mb-1.5 ml-1 uppercase tracking-wide opacity-80">
                Segundo Apellido
              </label>
              <input type="text" name="segundo_apellido" placeholder=""
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all bg-background/50 focus:bg-white shadow-inner text-sm"
                value={formData.segundo_apellido} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-textMain mb-1.5 ml-1 uppercase tracking-wide opacity-80">
                Matrícula
              </label>
              <input type="text" name="matricula" placeholder=""
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all bg-background/50 focus:bg-white shadow-inner text-sm"
                value={formData.matricula} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-textMain mb-1.5 ml-1 uppercase tracking-wide opacity-80">
                Correo electrónico
              </label>
              <input type="email" name="email" placeholder=""
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all bg-background/50 focus:bg-white shadow-inner text-sm"
                value={formData.email} onChange={handleChange} required />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-textMain mb-1.5 ml-1 uppercase tracking-wide opacity-80">
                Contraseña
              </label>
              <input type="password" name="password" placeholder=""
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all bg-background/50 focus:bg-white shadow-inner text-sm"
                value={formData.password} onChange={handleChange} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-textMain mb-1.5 ml-1 uppercase tracking-wide opacity-80">
                Repetir Contraseña
              </label>
              <input type="password" placeholder=""
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all shadow-inner text-sm bg-background/50 focus:bg-white 
                ${confirmPassword.length > 0 && pwd !== confirmPassword ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-secondary focus:border-transparent'}`}
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
            </div>
          </div>

          {/* Lista de Requisitos de Django (Feedback Visual) */}
          <div className="bg-gray-50/80 p-3 rounded-xl border border-gray-100 mt-2">
            <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Requisitos de seguridad:</p>
            <ul className="text-xs space-y-1.5">
              <li className={`transition-colors ${getRuleColor(reqLength)}`}>
                <span className="inline-block w-4">{getRuleIcon(reqLength)}</span> Debe contener al menos 8 caracteres.
              </li>
              <li className={`transition-colors ${getRuleColor(reqNotNumeric)}`}>
                <span className="inline-block w-4">{getRuleIcon(reqNotNumeric)}</span> No puede ser enteramente numérica.
              </li>
              <li className={`transition-colors ${getRuleColor(reqNotSimilar)}`}>
                <span className="inline-block w-4">{getRuleIcon(reqNotSimilar)}</span> No puede ser muy similar a tu usuario/correo.
              </li>
              <li className={`transition-colors ${getRuleColor(reqNotCommon)}`}>
                <span className="inline-block w-4">{getRuleIcon(reqNotCommon)}</span> No puede ser una contraseña de uso común.
              </li>
            </ul>
          </div>

          {/* CASILLAS LEGALES (OBLIGATORIAS) */}
          <div className="space-y-3 mt-6 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="flex items-center h-5 mt-0.5">
                <input 
                  type="checkbox" 
                  required
                  checked={aceptaTerminos}
                  onChange={(e) => setAceptaTerminos(e.target.checked)}
                  className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer" 
                />
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                He leído y acepto los <button type="button" onClick={() => setShowTerminos(true)} className="text-primary font-bold hover:underline">Términos y Condiciones de Uso</button>, deslindando al sistema de responsabilidad por mal uso.
              </span>
            </label>

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="flex items-center h-5 mt-0.5">
                <input 
                  type="checkbox" 
                  required
                  checked={aceptaPrivacidad}
                  onChange={(e) => setAceptaPrivacidad(e.target.checked)}
                  className="w-4 h-4 text-secondary bg-white border-gray-300 rounded focus:ring-secondary focus:ring-2 cursor-pointer" 
                />
              </div>
              <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                He leído y acepto la <button type="button" onClick={() => setShowPrivacidad(true)} className="text-secondary font-bold hover:underline">Política de Privacidad</button> respecto al tratamiento de mi matrícula y datos personales.
              </span>
            </label>
          </div>

          <Button 
            type="submit" variant="primary"
            className="w-full py-4 mt-6 rounded-xl font-bold bg-primary hover:bg-secondary text-white shadow-[0_8px_30px_rgb(45,106,79,0.3)] hover:shadow-[0_8px_30px_rgb(0,180,216,0.4)] transition-all duration-300 transform hover:-translate-y-1 border-none"
          >
            Crear Cuenta
          </Button>
        </form>

        <div className="flex flex-col items-center gap-4 mt-8 pt-6 border-t border-gray-200/60">
          <div className="text-sm text-gray-600 font-medium">
            ¿Ya tienes cuenta?{" "}
            <Link to="/login" className="text-accent font-bold hover:opacity-80 transition-opacity">
              Inicia Sesión aquí
            </Link>
          </div>
          <Link to="/home" className="text-xs text-gray-500 hover:text-primary transition-colors font-medium">
            ← Volver al inicio
          </Link>
        </div>

      </div>

      {/* MODALES LEGALES */}
      <Modal 
        isOpen={showTerminos} 
        onClose={() => setShowTerminos(false)} 
        title="Términos y Condiciones de Uso"
      >
        {TERMINOS_CONTENT}
      </Modal>

      <Modal 
        isOpen={showPrivacidad} 
        onClose={() => setShowPrivacidad(false)} 
        title="Política de Privacidad"
      >
        {PRIVACIDAD_CONTENT}
      </Modal>

    </div>
  );
};