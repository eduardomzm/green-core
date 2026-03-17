import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-white font-sans text-gray-900 overflow-hidden">
      
      {/* 1. OVERLAY MÓVIL (Fondo oscuro transparente) */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. SIDEBAR MÓVIL (Sale de la izquierda al presionar hamburguesa) */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform transition-transform duration-300 ease-in-out lg:hidden ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* 3. SIDEBAR ESCRITORIO (Fijo y siempre visible en pantallas grandes) */}
      <div className="hidden lg:flex lg:flex-shrink-0 lg:w-64 border-r border-gray-100 bg-white shadow-sm z-10">
        <Sidebar />
      </div>

      {/* 4. CONTENIDO PRINCIPAL */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-gray-50/30">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto pb-20 md:pb-0">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}