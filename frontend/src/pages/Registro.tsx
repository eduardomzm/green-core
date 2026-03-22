import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registerAlumno } from '../services/authService';
import { Button } from "../components/common/Button";
import Background from "../components/common/Background";
import { Modal } from '../components/common/Modal';
import { TERMINOS_CONTENT, PRIVACIDAD_CONTENT } from '../constants/legalContent';
import { parseBackendErrors } from '../utils/errorUtils';
import type { FieldErrors } from '../utils/errorUtils';
import { CheckCircle, AlertCircle } from 'lucide-react';




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
  const [errors, setErrors] = useState<FieldErrors>({});



  const [showTerminos, setShowTerminos] = useState(false);
  const [showPrivacidad, setShowPrivacidad] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [legalError, setLegalError] = useState(false);

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
    setErrors({});

    if (pwd !== confirmPassword) {
      setErrors({ confirmPassword: ["Las contraseñas no coinciden. Por favor, verifícalas."] });
      return;
    }

    if (!aceptaTerminos || !aceptaPrivacidad) {
      setLegalError(true);
      return;
    }
    setLegalError(false);



    if (!reqLength || !reqNotNumeric || !reqNotSimilar || !reqNotCommon) {
      setErrors({ password: ["Por favor, asegúrate de que tu contraseña cumpla con todos los requisitos de seguridad."] });
      return;
    }

    // Validación de Matricula (solo letras y números, max 12)
    const matriculaRegex = /^[a-zA-Z0-9]+$/;
    if (formData.matricula.length > 12) {
      setErrors({ matricula: ["La matrícula no puede tener más de 12 caracteres."] });
      return;
    }
    if (!matriculaRegex.test(formData.matricula)) {
      setErrors({ matricula: ["La matrícula no puede contener caracteres especiales."] });
      return;
    }




    try {
      const response = await registerAlumno(formData);
      setSuccessMessage(response.mensaje || '¡Tu cuenta ha sido creada exitosamente! Ahora puedes iniciar sesión y comenzar a reciclar.');
      setShowSuccessModal(true);
    } catch (error: any) {
      const errorData = error.response?.data;
      const parsedErrors = parseBackendErrors(errorData);

      setErrors(parsedErrors);
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

        {errors.non_field_errors && (
          <div className="bg-red-50/90 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-6 text-xs font-bold shadow-sm break-words">
            <ul className="list-disc list-inside">
              {errors.non_field_errors.map((err, index) => (
                <li key={index}>{err}</li>
              ))}
            </ul>
          </div>
        )}



        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="block text-xs font-bold text-textMain mb-1.5 ml-1 uppercase tracking-wide opacity-80">
              Nombre de Usuario
            </label>
            <input type="text" name="username" placeholder=""
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all bg-background/50 focus:bg-white shadow-inner text-sm ${errors.username ? 'border-red-500 ring-red-500' : 'border-gray-200 focus:ring-secondary focus:border-transparent'}`}
              value={formData.username} onChange={handleChange} required />
            {errors.username && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.username[0]}</p>}
          </div>


          <div>
            <label className="block text-xs font-bold text-textMain mb-1.5 ml-1 uppercase tracking-wide opacity-80">
              Nombre(s)
            </label>
            <input type="text" name="first_name" placeholder=""
              className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all bg-background/50 focus:bg-white shadow-inner text-sm ${errors.first_name ? 'border-red-500 ring-red-500' : 'border-gray-200 focus:ring-secondary focus:border-transparent'}`}
              value={formData.first_name} onChange={handleChange} required />
            {errors.first_name && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.first_name[0]}</p>}
          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-textMain mb-1.5 ml-1 uppercase tracking-wide opacity-80">
                Primer Apellido
              </label>
              <input type="text" name="primer_apellido" placeholder=""
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all bg-background/50 focus:bg-white shadow-inner text-sm ${errors.primer_apellido ? 'border-red-500 ring-red-500' : 'border-gray-200 focus:ring-secondary focus:border-transparent'}`}
                value={formData.primer_apellido} onChange={handleChange} required />
              {errors.primer_apellido && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.primer_apellido[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-textMain mb-1.5 ml-1 uppercase tracking-wide opacity-80">
                Segundo Apellido
              </label>
              <input type="text" name="segundo_apellido" placeholder=""
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all bg-background/50 focus:bg-white shadow-inner text-sm ${errors.segundo_apellido ? 'border-red-500 ring-red-500' : 'border-gray-200 focus:ring-secondary focus:border-transparent'}`}
                value={formData.segundo_apellido} onChange={handleChange} required />
              {errors.segundo_apellido && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.segundo_apellido[0]}</p>}
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-textMain mb-1.5 ml-1 uppercase tracking-wide opacity-80">
                Matrícula
              </label>
              <input type="text" name="matricula" placeholder="" maxLength={12}
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all bg-background/50 focus:bg-white shadow-inner text-sm ${errors.matricula ? 'border-red-500 ring-red-500' : 'border-gray-200 focus:ring-secondary focus:border-transparent'}`}

                value={formData.matricula} onChange={handleChange} required />
              {errors.matricula && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.matricula[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-textMain mb-1.5 ml-1 uppercase tracking-wide opacity-80">
                Correo electrónico
              </label>
              <input type="email" name="email" placeholder=""
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all bg-background/50 focus:bg-white shadow-inner text-sm ${errors.email ? 'border-red-500 ring-red-500' : 'border-gray-200 focus:ring-secondary focus:border-transparent'}`}
                value={formData.email} onChange={handleChange} required />
              {errors.email && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.email[0]}</p>}
            </div>

          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-textMain mb-1.5 ml-1 uppercase tracking-wide opacity-80">
                Contraseña
              </label>
              <input type="password" name="password" placeholder=""
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all bg-background/50 focus:bg-white shadow-inner text-sm ${errors.password ? 'border-red-500 ring-red-500' : 'border-gray-200 focus:ring-secondary focus:border-transparent'}`}
                value={formData.password} onChange={handleChange} required />
              {errors.password && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.password[0]}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-textMain mb-1.5 ml-1 uppercase tracking-wide opacity-80">
                Repetir Contraseña
              </label>
              <input type="password" placeholder=""
                className={`w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition-all shadow-inner text-sm bg-background/50 focus:bg-white 
                ${(confirmPassword.length > 0 && pwd !== confirmPassword) || errors.confirmPassword ? 'border-red-400 focus:ring-red-500' : 'border-gray-200 focus:ring-secondary focus:border-transparent'}`}
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
              {errors.confirmPassword && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold">{errors.confirmPassword[0]}</p>}
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
          <div className={`space-y-3 mt-6 mb-8 p-4 rounded-xl border transition-colors ${legalError ? 'bg-red-50/50 border-red-300' : 'bg-gray-50 border-gray-100'}`}>
            
            {legalError && (
              <p className="text-red-500 text-xs font-bold mb-3 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-4 h-4" /> Es indispensable aceptar los acuerdos legales antes de continuar.
              </p>
            )}

            <label className="flex items-start gap-3 cursor-pointer group">
              <div className="flex items-center h-5 mt-0.5">
                <input
                  type="checkbox"
                  checked={aceptaTerminos}
                  onChange={(e) => {
                    setAceptaTerminos(e.target.checked);
                    if (e.target.checked && aceptaPrivacidad) setLegalError(false);
                  }}
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
                  checked={aceptaPrivacidad}
                  onChange={(e) => {
                    setAceptaPrivacidad(e.target.checked);
                    if (aceptaTerminos && e.target.checked) setLegalError(false);
                  }}
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

      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/login');
        }}
        title="¡Bienvenido a Green Core!"
      >
        <div className="flex flex-col items-center justify-center py-6 text-center space-y-4">
          <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center text-primary mb-2 shadow-inner">
            <CheckCircle className="w-12 h-12" />
          </div>
          <p className="text-gray-600 text-lg font-medium px-4">{successMessage}</p>
          <button
            onClick={() => {
              setShowSuccessModal(false);
              navigate('/login');
            }}
            className="w-full mt-6 bg-primary hover:bg-secondary text-white font-bold py-4 rounded-xl transition-colors shadow-md"
          >
            Iniciar Sesión
          </button>
        </div>
      </Modal>

    </div>
  );
};