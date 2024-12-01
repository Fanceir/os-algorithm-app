import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import RoutesConfig from "./routes";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
const App: React.FC = () => {
  return (
    <Router>
      <SidebarProvider className="flex min-h-screen">
        <AppSidebar className="flex-shrink-0" /> {/* 固定宽度的侧边栏 */}
        <SidebarTrigger>Toggle Sidebar</SidebarTrigger>
        <div className="flex-1 flex flex-col">
          <RoutesConfig />
        </div>
      </SidebarProvider>
    </Router>
  );
};

export default App;
