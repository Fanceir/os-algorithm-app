import React from "react";
import ProcessAnimation from "../components/algorithm/ProcessAnimation";
import TimeSlice from "../components/algorithm/TimeSlice";
import { TopBar } from "@/components/TopBar";
const SchedulerPage: React.FC = () => {
  return (
    <div>
      <TopBar />
      <ProcessAnimation />
      <TimeSlice />
    </div>
  );
};

export default SchedulerPage;
