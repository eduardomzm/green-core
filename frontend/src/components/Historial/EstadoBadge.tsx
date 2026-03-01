export const EstadoBadge = ({ estado }: { estado: string }) => {
  const styles: Record<string, string> = {
    Validado: "bg-green-100 text-green-800 border-green-200",
    Pendiente: "bg-yellow-100 text-yellow-800 border-yellow-200",
    Rechazado: "bg-red-100 text-red-800 border-red-200",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${styles[estado] || styles.Pendiente}`}>
      {estado}
    </span>
  );
};