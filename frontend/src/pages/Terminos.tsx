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
            <div className="p-3 bg-red-50 text-red-500 rounded-xl">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black text-gray-800">
              Términos y Condiciones de Uso
            </h1>
          </div>
        </div>

        <div className="prose prose-green max-w-none text-gray-600 space-y-6">
          <p className="text-sm text-gray-400">Última actualización: 17/03/2026</p>

          <h3 className="text-lg font-bold text-gray-800">1. Aceptación de los Términos</h3>
          <p>
            Al acceder, registrarse o utilizar la plataforma, el usuario acepta expresamente los presentes
            Términos y Condiciones. En caso de no estar de acuerdo, deberá abstenerse de utilizar el sistema.
          </p>

          <h3 className="text-lg font-bold text-gray-800">2. Objeto</h3>
          <p>
            El presente documento regula el acceso y uso del sistema digital desarrollado con fines educativos
            para la gestión académica, organización de grupos y actividades escolares.
          </p>

          <h3 className="text-lg font-bold text-gray-800">3. Registro y Cuenta</h3>
          <p>
            El usuario se obliga a proporcionar información veraz, completa y actualizada. El acceso es
            personal e intransferible, siendo responsabilidad exclusiva del usuario el resguardo de sus
            credenciales.
          </p>

          <h3 className="text-lg font-bold text-gray-800">4. Matrícula como Dato Confidencial</h3>
          <p>
            La matrícula escolar del usuario es considerada un dato confidencial de identificación académica.
            El usuario reconoce y acepta que:
          </p>
          <ul>
            <li>La matrícula será utilizada únicamente para fines internos del sistema.</li>
            <li>No debe ser compartida con terceros.</li>
            <li>Cualquier uso indebido de la matrícula será responsabilidad exclusiva del usuario.</li>
          </ul>
          <p>
            El sistema implementa medidas razonables para su protección; sin embargo, el usuario comprende que
            ningún sistema es completamente invulnerable.
          </p>

          <h3 className="text-lg font-bold text-gray-800">5. Uso Adecuado</h3>
          <p>
            El usuario se compromete a utilizar la plataforma conforme a la ley, la moral y el orden público,
            absteniéndose de:
          </p>
          <ul>
            <li>Suplantar identidad</li>
            <li>Acceder sin autorización a cuentas o datos</li>
            <li>Alterar, dañar o interferir con el sistema</li>
            <li>Introducir código malicioso</li>
            <li>Usar la plataforma con fines ilícitos</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800">6. Disponibilidad del Servicio</h3>
          <p>
            El sistema se proporciona “tal cual” y “según disponibilidad”, sin garantías de funcionamiento
            ininterrumpido o libre de errores.
          </p>

          <h3 className="text-lg font-bold text-gray-800">7. Propiedad Intelectual</h3>
          <p>
            El sistema, su código, diseño y contenido son propiedad del desarrollador, quedando prohibida su
            reproducción o uso no autorizado.
          </p>

          <h3 className="text-lg font-bold text-gray-800">8. Limitación de Responsabilidad</h3>
          <p>
            En la máxima medida permitida por la legislación aplicable, el desarrollador no será responsable
            por:
          </p>
          <ul>
            <li>Daños directos o indirectos derivados del uso del sistema</li>
            <li>Pérdida de información</li>
            <li>Accesos no autorizados por negligencia del usuario</li>
            <li>Fallos técnicos, interrupciones o vulnerabilidades</li>
            <li>Uso indebido de la información por terceros</li>
          </ul>
          <p>El usuario acepta utilizar el sistema bajo su propio riesgo.</p>

          <h3 className="text-lg font-bold text-gray-800">9. Deslinde de Responsabilidad</h3>
          <p>
            El usuario reconoce que el sistema es una herramienta de apoyo académico y que el desarrollador no
            garantiza resultados específicos.
          </p>
          <p>El desarrollador se deslinda de toda responsabilidad derivada de:</p>
          <ul>
            <li>Decisiones tomadas con base en la información del sistema</li>
            <li>Uso incorrecto de la plataforma</li>
            <li>Conflictos entre usuarios</li>
          </ul>

          <h3 className="text-lg font-bold text-gray-800">10. Modificaciones</h3>
          <p>
            El desarrollador se reserva el derecho de modificar estos términos en cualquier momento. El uso
            continuo del sistema implica la aceptación de dichas modificaciones.
          </p>

          <h3 className="text-lg font-bold text-gray-800">11. Legislación Aplicable</h3>
          <p>
            El presente documento se rige por las leyes de los Estados Unidos Mexicanos.
          </p>
        </div>
      </div>
    </div>
  );
}