import Sidebar from "../common/Sidebar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="h-16 bg-[#00a859] flex items-center px-8 shadow-md z-20">
        <h1 className="text-white font-bold text-xl">Green Core</h1>
      </header>

      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;