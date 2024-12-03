import JobScheduling from "@/components/algorithm/SingleJobScheduler";
import { TopBar } from "@/components/TopBar";
export default function JobScheduler() {
  return (
    <div>
      <TopBar />
      <JobScheduling />
    </div>
  );
}
