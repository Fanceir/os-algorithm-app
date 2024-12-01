import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface Process {
  id: number; // 进程的ID
  arrivalTime: number; // 进程的到达时间
  burstTime: number; // 进程执行完成所需要的时间
  remainingTime: number; // 剩余执行时间
  endTime?: number; // 完成时间
}

const RoundRobinScheduler: React.FC = () => {
  // 初始进程数组
  const [processes, setProcesses] = useState<Process[]>([
    { id: 1, arrivalTime: 0, burstTime: 4, remainingTime: 4 },
    { id: 2, arrivalTime: 0, burstTime: 3, remainingTime: 3 },
    { id: 3, arrivalTime: 0, burstTime: 2, remainingTime: 2 },
    { id: 4, arrivalTime: 0, burstTime: 1, remainingTime: 1 },
    { id: 5, arrivalTime: 0, burstTime: 5, remainingTime: 5 },
  ]);

  const [schedule, setSchedule] = useState<Process[]>([]); // 存储调度顺序
  const [currentTime, setCurrentTime] = useState(0); // 当前时间
  const [processQueue, setProcessQueue] = useState<Process[]>([]); // 就绪队列
  const [remainingProcesses, setRemainingProcesses] = useState<Process[]>([
    ...processes,
  ]); // 剩余进程
  const [completedProcesses, setCompletedProcesses] = useState<Process[]>([]); // 已完成进程
  const [timeQuantum, setTimeQuantum] = useState(2); // 设置时间片（可调整）
  const [isReady, setIsReady] = useState(false); // 标记是否已更新进程信息
  const [isCompleted, setIsCompleted] = useState(false); // 标记是否所有进程已完成

  // 更新进程参数的函数
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

  // 确认修改并初始化调度
  const handleConfirmChanges = () => {
    setRemainingProcesses([...processes]);
    setCompletedProcesses([]);
    setSchedule([]);
    setCurrentTime(0);
    setIsReady(true);
    setIsCompleted(false); // 重置完成状态
    setProcessQueue([]); // 清空就绪队列
  };

  const handleNextStep = () => {
    const nextSchedule = [...completedProcesses]; // 已完成的进程
    let nextRemainingProcesses = [...remainingProcesses]; // 剩下的进程
    const nextProcessQueue = [...processQueue]; // 就绪队列
    let nextCurrentTime = currentTime; // 当前时间

    // 将到达的进程加入到就绪队列
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
      // 按顺序选择队列中的进程
      const currentProcess = nextProcessQueue.shift(); // 取出队首的进程

      if (currentProcess) {
        const timeSlice = Math.min(currentProcess.remainingTime, timeQuantum); // 该进程执行的时间片
        currentProcess.remainingTime -= timeSlice;
        nextCurrentTime += timeSlice;

        // 如果进程完成，更新其完成时间
        if (currentProcess.remainingTime === 0) {
          currentProcess.endTime = nextCurrentTime;
          nextSchedule.push(currentProcess);
          nextRemainingProcesses = nextRemainingProcesses.filter(
            (process) => process.id !== currentProcess.id
          );
        } else {
          nextProcessQueue.push(currentProcess); // 未完成的进程放回队列
        }
      }
    } else {
      // 如果没有进程可以执行，增加当前时间
      nextCurrentTime++;
    }

    // 更新状态
    setCompletedProcesses(nextSchedule);
    setRemainingProcesses(nextRemainingProcesses);
    setProcessQueue(nextProcessQueue);
    setCurrentTime(nextCurrentTime);
    setSchedule(nextSchedule);

    // 检查是否所有进程都已完成
    const allCompleted = nextSchedule.length === processes.length;
    setIsCompleted(allCompleted);
  };

  return (
    <div>
      <h1>进程调度（轮转法）</h1>
      <h2>输入进程信息:</h2>
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>进程ID</th>
            <th>到达时间</th>
            <th>执行时间</th>
          </tr>
        </thead>
        <tbody>
          {processes.map((process) => (
            <tr key={process.id}>
              <td>{process.id}</td>
              <td>
                <input
                  type="number"
                  value={process.arrivalTime}
                  onChange={(e) =>
                    handleProcessChange(
                      process.id,
                      "arrivalTime",
                      Number(e.target.value)
                    )
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={process.burstTime}
                  onChange={(e) =>
                    handleProcessChange(
                      process.id,
                      "burstTime",
                      Number(e.target.value)
                    )
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
        <div>输入时间片信息默认是2</div>
        <input
          type="number"
          value={timeQuantum}
          onChange={(e) => setTimeQuantum(Number(e.target.value))}
        />
      </table>

      <br />
      <Button onClick={handleConfirmChanges}>确定</Button>

      <h2>调度顺序:</h2>
      <table border={1} cellPadding="10">
        <thead>
          <tr>
            <th>进程ID</th>
            <th>到达时间</th>
            <th>执行时间</th>
            <th>完成时间</th>
            <th>剩余时间</th>
          </tr>
        </thead>
        <tbody>
          {schedule.map((process) => (
            <tr key={process.id}>
              <td>{process.id}</td>
              <td>{process.arrivalTime}</td>
              <td>{process.burstTime}</td>
              <td>{process.endTime ?? "进行中"}</td>
              <td>{process.remainingTime ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <Button onClick={handleNextStep} disabled={!isReady}>
        {isCompleted ? "完成" : "下一步"}
      </Button>
    </div>
  );
};

export default RoundRobinScheduler;
