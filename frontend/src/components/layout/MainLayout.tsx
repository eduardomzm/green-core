import type { ReactNode } from "react";
import Header from "./Header";

interface Props {
  children: ReactNode;
}

const MainLayout = ({ children }: Props) => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="p-6">{children}</main>
    </div>
  );
};

export default MainLayout;