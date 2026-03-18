import { Link } from "react-router-dom";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function Terminos() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
          <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6 text-gray-500" />
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-50 text-red-500 rounded-xl"><ShieldAlert className="w-6 h-6" /></div>
            <h1 className="text-2xl font-black text-gray-800">Términos y Condiciones de Uso</h1>
          </div>
        </div>
        
        <div className="prose prose-green max-w-none text-gray-600 space-y-6">
          <p className="text-sm text-gray-400">Última actualización: 17/03/2026</p>
          
          <h3 className="text-lg font-bold text-gray-800">1. Aceptación de los Términos</h3>
          <p>Al acceder, registrarse o utilizar la plataforma Green Core, el usuario acepta expresamente los presentes Términos y Condiciones. En caso de no estar de acuerdo, deberá abstenerse de utilizar el sistema.</p>
          
          <h3 className="text-lg font-bold text-gray-800">2. Matrícula como Dato Confidencial</h3>
          <p>La matrícula escolar del usuario es considerada un dato confidencial de identificación académica. El usuario reconoce y acepta que será utilizada únicamente para fines internos del sistema y no debe ser compartida con terceros. Cualquier uso indebido será responsabilidad exclusiva del usuario.</p>
          
          <h3 className="text-lg font-bold text-gray-800">3. Limitación de Responsabilidad</h3>
          <p>El desarrollador no será responsable por daños directos o indirectos derivados del uso del sistema, pérdida de información, accesos no autorizados por negligencia del usuario o fallos técnicos. El usuario acepta utilizar el sistema bajo su propio riesgo.</p>
          
          <h3 className="text-lg font-bold text-gray-800">4. Deslinde de Responsabilidad</h3>
          <p>El usuario reconoce que el sistema es una herramienta de apoyo y que el desarrollador no garantiza resultados específicos, deslindándose de toda responsabilidad derivada de decisiones tomadas con base en la información del sistema o conflictos entre usuarios.</p>
        </div>
      </div>
    </div>
  );
}