import { Link } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";

export default function Privacidad() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-500" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl"><Lock className="w-6 h-6" /></div>
            <h1 className="text-2xl font-black text-gray-800">Política de Privacidad</h1>
          </div>
        </div>
        
        <div className="prose prose-green max-w-none text-gray-600 space-y-6">
          <p className="text-sm text-gray-400">Última actualización: 17/03/2026</p>
          
          <h3 className="text-lg font-bold text-gray-800">1. Marco Legal</h3>
          <p>La presente Política se fundamenta en la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de México.</p>
          
          <h3 className="text-lg font-bold text-gray-800">2. Datos Personales Recabados</h3>
          <p>Se recabarán los siguientes datos: Nombre completo, correo electrónico, matrícula escolar e información académica. La matrícula será tratada como dato personal confidencial y será utilizada únicamente para fines internos y de gestión.</p>
          
          <h3 className="text-lg font-bold text-gray-800">3. Transferencia de Datos</h3>
          <p>Los datos personales no serán transferidos a terceros, salvo en los casos previstos por la ley o por requerimiento de autoridad competente.</p>
          
          <h3 className="text-lg font-bold text-gray-800">4. Responsabilidad del Usuario</h3>
          <p>El usuario es responsable del resguardo de sus credenciales. El sistema no será responsable por accesos no autorizados derivados de negligencia. Al utilizar la plataforma, el usuario otorga su consentimiento expreso para el tratamiento de sus datos.</p>
        </div>
      </div>
    </div>
  );
}