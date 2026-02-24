import type { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Header />
        <main className="p-6 bg-gray-100 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;