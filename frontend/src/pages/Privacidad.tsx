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
            <div className="p-3 bg-secondary/10 text-secondary rounded-xl">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-gray-800">
              Política de Privacidad
            </h1>
          </div>
        </div>

        <div className="prose prose-green max-w-none text-gray-600 space-y-6">
          <p className="text-sm text-gray-400">Última actualización: 17/03/2026</p>

          <p>
            En cumplimiento con lo dispuesto por la legislación mexicana en materia de
            protección de datos personales, se establece lo siguiente:
          </p>

          <h3 className="text-lg font-bold text-gray-800">1. Marco Legal</h3>
          <p>La presente Política de Privacidad se fundamenta en:</p>
          <ul>
            <li>Ley Federal de Protección de Datos Personales en Posesión de los Particulares</li>
            <li>Reglamento de la Ley Federal de Protección de Datos Personales en Posesión de los Particulares</li>
            <li>Lineamientos del Aviso de Privacidad emitidos por el INAI</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800">2. Responsable del Tratamiento</h3>
          <p>
            El responsable del tratamiento de los datos personales es el desarrollador del sistema.
          </p>

          <h3 className="text-lg font-bold text-gray-800">3. Datos Personales Recabados</h3>
          <p>Se podrán recabar los siguientes datos personales:</p>
          <ul>
            <li>Nombre completo</li>
            <li>Correo electrónico</li>
            <li>Matrícula escolar</li>
            <li>Información académica</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800">4. Finalidad del Tratamiento</h3>
          <p>
            Los datos serán utilizados conforme a los principios de licitud, consentimiento,
            información, calidad, finalidad, lealtad y responsabilidad establecidos en la ley
            aplicable, para:
          </p>
          <ul>
            <li>Identificación del usuario</li>
            <li>Gestión académica</li>
            <li>Administración del sistema</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800">5. Matrícula como Dato Confidencial</h3>
          <p>
            La matrícula será tratada como dato personal confidencial conforme a la legislación
            aplicable, y será utilizada únicamente para fines internos.
          </p>

          <h3 className="text-lg font-bold text-gray-800">6. Medidas de Seguridad</h3>
          <p>
            Se implementan medidas de seguridad administrativas, técnicas y físicas conforme a
            la normativa aplicable para proteger los datos personales.
          </p>

          <h3 className="text-lg font-bold text-gray-800">7. Transferencia de Datos</h3>
          <p>
            Los datos personales no serán transferidos a terceros, salvo en los casos previstos
            por la ley o por requerimiento de autoridad competente.
          </p>

          <h3 className="text-lg font-bold text-gray-800">8. Derechos ARCO</h3>
          <p>El usuario podrá ejercer sus derechos de:</p>
          <ul>
            <li>Acceso</li>
            <li>Rectificación</li>
            <li>Cancelación</li>
            <li>Oposición</li>
          </ul>
          <p>
            Conforme a lo establecido en la Ley Federal de Protección de Datos Personales en
            Posesión de los Particulares.
          </p>

          <h3 className="text-lg font-bold text-gray-800">9. Responsabilidad del Usuario</h3>
          <p>
            El usuario es responsable del resguardo de sus credenciales. El sistema no será
            responsable por accesos no autorizados derivados de negligencia.
          </p>

          <h3 className="text-lg font-bold text-gray-800">10. Cambios a la Política</h3>
          <p>
            La presente política podrá ser modificada en cualquier momento conforme a la
            legislación aplicable.
          </p>

          <h3 className="text-lg font-bold text-gray-800">11. Consentimiento</h3>
          <p>
            El usuario otorga su consentimiento expreso para el tratamiento de sus datos
            personales al utilizar la plataforma.
          </p>
        </div>
      </div>
    </div>
  );
}