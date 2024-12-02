import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TopBar } from "../TopBar";

interface Process {
  id: number;
  arrivalTime: number;
  burstTime: number;
  priority: number;
  endTime?: number;
  remainingTime?: number;
}

const PriorityScheduling: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 1, arrivalTime: 0, burstTime: 4, priority: 3 },
    { id: 2, arrivalTime: 1, burstTime: 3, priority: 2 },
    { id: 3, arrivalTime: 2, burstTime: 2, priority: 4 },
    { id: 4, arrivalTime: 3, burstTime: 1, priority: 1 },
    { id: 5, arrivalTime: 4, burstTime: 5, priority: 5 },
  ]);

  const [schedule, setSchedule] = useState<Process[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [processQueue, setProcessQueue] = useState<Process[]>([]);
  const [remainingProcesses, setRemainingProcesses] = useState<Process[]>([
    ...processes,
  ]);
  const [completedProcesses, setCompletedProcesses] = useState<Process[]>([]);
  const [isReady, setIsReady] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleProcessChange = (
    id: number,
    field: keyof Process,
    value: number
  ) => {
    const updatedProcesses = processes.map((process) =>
      process.id === id ? { ...process, [field]: value } : process
    );
    setProcesses(updatedProcesses);
  };

  const handleConfirmChanges = () => {
    setRemainingProcesses([...processes]);
    setCompletedProcesses([]);
    setSchedule([]);
    setCurrentTime(0);
    setIsReady(true);
    setIsCompleted(false);
  };

  const handleNextStep = () => {
    const nextSchedule = [...completedProcesses];
    let nextRemainingProcesses = [...remainingProcesses];
    const nextProcessQueue = [...processQueue];
    let nextCurrentTime = currentTime;

    nextRemainingProcesses.forEach((process) => {
      if (
        process.arrivalTime <= nextCurrentTime &&
        !nextProcessQueue.includes(process)
      ) {
        nextProcessQueue.push(process);
      }
    });

    if (nextProcessQueue.length > 0) {
      nextProcessQueue.sort((a, b) => b.priority - a.priority);
      const currentProcess = nextProcessQueue.shift();

      if (currentProcess) {
        const endTime = nextCurrentTime + currentProcess.burstTime;
        nextSchedule.push({ ...currentProcess, endTime, remainingTime: 0 });
        nextCurrentTime = endTime;

        nextRemainingProcesses = nextRemainingProcesses.filter(
          (process) => process.id !== currentProcess.id
        );
      }
    } else {
      nextCurrentTime++;
    }

    setCompletedProcesses(nextSchedule);
    setRemainingProcesses(nextRemainingProcesses);
    setProcessQueue(nextProcessQueue);
    setCurrentTime(nextCurrentTime);
    setSchedule(nextSchedule);

    const allCompleted = nextSchedule.length === processes.length;
    setIsCompleted(allCompleted);
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <TopBar />
      <h1 className="text-3xl font-bold text-center mb-6">
        进程调度（静态最高优先数优先）
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>输入进程信息</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>进程ID</TableHead>
                <TableHead>到达时间</TableHead>
                <TableHead>执行时间</TableHead>
                <TableHead>优先数</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {processes.map((process) => (
                <TableRow key={process.id}>
                  <TableCell>{process.id}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={process.arrivalTime}
                      onChange={(e) =>
                        handleProcessChange(
                          process.id,
                          "arrivalTime",
                          Number(e.target.value)
                        )
                      }
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={process.burstTime}
                      onChange={(e) =>
                        handleProcessChange(
                          process.id,
                          "burstTime",
                          Number(e.target.value)
                        )
                      }
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={process.priority}
                      onChange={(e) =>
                        handleProcessChange(
                          process.id,
                          "priority",
                          Number(e.target.value)
                        )
                      }
                      className="w-20"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleConfirmChanges} className="mt-4">
            确定
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>调度顺序</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>进程ID</TableHead>
                <TableHead>到达时间</TableHead>
                <TableHead>执行时间</TableHead>
                <TableHead>优先数</TableHead>
                <TableHead>完成时间</TableHead>
                <TableHead>剩余时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((process) => (
                <TableRow key={process.id}>
                  <TableCell>{process.id}</TableCell>
                  <TableCell>{process.arrivalTime}</TableCell>
                  <TableCell>{process.burstTime}</TableCell>
                  <TableCell>{process.priority}</TableCell>
                  <TableCell>{process.endTime ?? "进行中"}</TableCell>
                  <TableCell>
                    {process.remainingTime ?? process.burstTime}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={handleNextStep} disabled={!isReady} className="mt-4">
            {isCompleted ? "完成" : "下一步"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default PriorityScheduling;
