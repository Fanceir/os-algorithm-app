import React from "react";
import { Route, Routes } from "react-router-dom";
import SchedulerPage from "../pages/ProcessScheduler";
import AboutPage from "../pages/AboutPage";
import Home from "../pages/HomePage";
import ErrorPage from "../pages/404Page";
import JobScheduler from "@/pages/JobScheduler";
import MemoryManagement from "@/pages/MemoryManagement";
import FileManagement from "@/pages/FileManagement";
import BankersAlgorithm from "@/pages/BankersAlgorithm";
const RoutesConfig: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/process-scheduling" element={<SchedulerPage />} />
      <Route path="/job-scheduling" element={<JobScheduler />} />
      <Route path="/memory-management" element={<MemoryManagement />} />
      <Route path="/file-management" element={<FileManagement />} />
      <Route path="/bankers-algorithm" element={<BankersAlgorithm />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};

export default RoutesConfig;
