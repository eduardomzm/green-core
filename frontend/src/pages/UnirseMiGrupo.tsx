import { useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle, Key } from "lucide-react";
import { unirseGrupo } from "../services/reciclajeService";

export default function UnirseMiGrupo() {
  const [codigo, setCodigo] = useState("");
  const [joinMsg, setJoinMsg] = useState<{ text: string; type: string }>({
    text: "",
    type: "",
  });
  const [loadingJoin, setLoadingJoin] = useState(false);
  const [codigoIngresado, setCodigoIngresado] = useState<string | null>(null);

  const handleUnirseGrupo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!codigo.trim()) return;
    if (codigoIngresado) return;

    setLoadingJoin(true);
    setJoinMsg({ text: "Verificando...", type: "loading" });

    try {
      const code = codigo.trim().toUpperCase();
      const res = await unirseGrupo(code);
      setJoinMsg({
        text: res.mensaje || "¡Solicitud enviada!",
        type: "success",
      });
      setCodigoIngresado(code);
      setCodigo("");

      setTimeout(() => setJoinMsg({ text: "", type: "" }), 4000);
    } catch (error: any) {
      const errorText =
        error.response?.data?.error ||
        "Código inválido o grupo no encontrado.";
      setJoinMsg({ text: errorText, type: "error" });
    } finally {
      setLoadingJoin(false);
    }
  };

  const handleIngresarOtroCodigo = () => {
    setCodigoIngresado(null);
    setCodigo("");
    setJoinMsg({ text: "", type: "" });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {codigoIngresado ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6 md:items-center md:justify-between">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-green-50 border border-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-primary" strokeWidth={2} />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-textMain">Código ingresado</h2>
                <p className="text-gray-500 mt-1">
                  Ya registraste el código{" "}
                  <span className="font-bold">{codigoIngresado}</span>. Espera a que
                  tu tutor lo revise y te confirme.
                </p>
              </div>
            </div>

            <button
              onClick={handleIngresarOtroCodigo}
              className="bg-accent hover:bg-orange-500 text-white font-bold py-3 px-5 rounded-xl transition-colors shadow-md"
            >
              Ingresar otro código
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-primary to-green-600 p-6 md:p-8 rounded-3xl shadow-lg text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="absolute -right-10 -top-10 text-white opacity-10">
            <Key className="w-48 h-48 transform rotate-45" />
          </div>

          <div className="relative z-10 w-full md:w-1/2">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-2 tracking-tight">
              ¿Tienes un código de invitación?
            </h2>
            <p className="text-green-100 text-sm md:text-base opacity-90">
              Ingresa el código que te dio tu tutor para unirte a tu grupo y
              comenzar a sumar juntos.
            </p>
          </div>

          <div className="relative z-10 w-full md:w-auto flex-1 max-w-md bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 shadow-inner">
            <form onSubmit={handleUnirseGrupo} className="flex flex-col gap-3">
              <div className="relative">
                <input
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  maxLength={6}
                  className="w-full pl-4 pr-4 py-3 bg-white text-gray-900 rounded-xl outline-none font-bold tracking-widest uppercase placeholder:text-gray-400 focus:ring-4 focus:ring-green-400/50 transition-all text-center text-lg"
                />
              </div>

              <button
                type="submit"
                disabled={loadingJoin || codigo.length < 4}
                className="w-full bg-accent hover:bg-orange-500 text-white font-bold py-3 px-4 rounded-xl transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loadingJoin ? "Conectando..." : "Vincular a mi Grupo"}
                {!loadingJoin && <ArrowRight className="w-4 h-4" />}
              </button>

              {joinMsg.text && joinMsg.type !== "loading" && (
                <div
                  className={`mt-2 p-3 rounded-xl text-sm font-bold flex items-center gap-2 animate-in slide-in-from-top-2 ${
                    joinMsg.type === "success"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {joinMsg.type === "success" ? (
                    <CheckCircle className="w-5 h-5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 shrink-0" />
                  )}
                  {joinMsg.text}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

