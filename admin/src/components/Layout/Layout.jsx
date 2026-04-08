import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useState } from "react";

const Layout = () => {
  const [sideBarCollapsed, setSideBarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState();
  return (
    <div className="flex min-h-screen bg-gray-200 min-w-screen transition-all duration-500">
      <div className="flex h-screen overflow-hidden w-full">
        <Sidebar
          collapsed={sideBarCollapsed}
          onToggle={() => setSideBarCollapsed(!sideBarCollapsed)}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
        <div className="flex-1 flex flex-col overflow-hidden w-full">
          <Header
            sideBarCollapsed={sideBarCollapsed}
            onToggleSidebar={() => setSideBarCollapsed(!sideBarCollapsed)}
          />
          <main className="flex-1">
            <div className="p-6 space-y-6 z-0">
               <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
