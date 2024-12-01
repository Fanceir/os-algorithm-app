import React from "react";
import ProcessAnimation from "../components/algorithm/ProcessAnimation";
import TimeSlice from "../components/algorithm/TimeSlice";
const SchedulerPage: React.FC = () => {
  return (
    <div>
      <ProcessAnimation />
      <TimeSlice />
    </div>
  );
};

export default SchedulerPage;
