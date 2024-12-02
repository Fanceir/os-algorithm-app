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

interface Process {
  id: number;
  arrivalTime: number;
  burstTime: number;
  remainingTime: number;
  endTime?: number;
}

const RoundRobinScheduler: React.FC = () => {
  const [processes, setProcesses] = useState<Process[]>([
    { id: 1, arrivalTime: 0, burstTime: 4, remainingTime: 4 },
    { id: 2, arrivalTime: 0, burstTime: 3, remainingTime: 3 },
    { id: 3, arrivalTime: 0, burstTime: 2, remainingTime: 2 },
    { id: 4, arrivalTime: 0, burstTime: 1, remainingTime: 1 },
    { id: 5, arrivalTime: 0, burstTime: 5, remainingTime: 5 },
  ]);

  const [schedule, setSchedule] = useState<Process[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [processQueue, setProcessQueue] = useState<Process[]>([]);
  const [remainingProcesses, setRemainingProcesses] = useState<Process[]>([
    ...processes,
  ]);
  const [completedProcesses, setCompletedProcesses] = useState<Process[]>([]);
  const [timeQuantum, setTimeQuantum] = useState(2);
  const [isReady, setIsReady] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleProcessChange = (
    id: number,
    field: keyof Process,
    value: number
  ) => {
    const updatedProcesses = processes.map((process) =>
      process.id === id
        ? {
            ...process,
            [field]: value,
            remainingTime:
              field === "burstTime" ? value : process.remainingTime,
          }
        : process
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
    setProcessQueue([]);
  };

  const handleNextStep = () => {
    const nextSchedule = [...completedProcesses];
    let nextRemainingProcesses = [...remainingProcesses];
    const nextProcessQueue = [...processQueue];
    let nextCurrentTime = currentTime;

    nextRemainingProcesses.forEach((process) => {
      if (
        process.arrivalTime <= nextCurrentTime &&
        !nextProcessQueue.includes(process) &&
        !completedProcesses.includes(process)
      ) {
        nextProcessQueue.push(process);
      }
    });

    if (nextProcessQueue.length > 0) {
      const currentProcess = nextProcessQueue.shift();

      if (currentProcess) {
        const timeSlice = Math.min(currentProcess.remainingTime, timeQuantum);
        currentProcess.remainingTime -= timeSlice;
        nextCurrentTime += timeSlice;

        if (currentProcess.remainingTime === 0) {
          currentProcess.endTime = nextCurrentTime;
          nextSchedule.push(currentProcess);
          nextRemainingProcesses = nextRemainingProcesses.filter(
            (process) => process.id !== currentProcess.id
          );
        } else {
          nextProcessQueue.push(currentProcess);
        }
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
      <h1 className="text-3xl font-bold text-center mb-6">
        进程调度（轮转法）
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex items-center gap-2">
            <span>时间片：</span>
            <Input
              type="number"
              value={timeQuantum}
              onChange={(e) => setTimeQuantum(Number(e.target.value))}
              className="w-20"
            />
          </div>
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
                  <TableCell>{process.endTime ?? "进行中"}</TableCell>
                  <TableCell>{process.remainingTime ?? 0}</TableCell>
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

export default RoundRobinScheduler;
