import React, { useState } from "react";

interface Process {
  id: number; //进程的id
  arrivalTime: number; //进程的到达时间
  burstTime: number; //进程执行完成所需要的时间
  priority: number; // 优先数
  endTime?: number; // 完成时间
  remainingTime?: number; // 线程执行完成还需要多少时间
}
import { Button } from "@/components/ui/button";
import { TopBar } from "../TopBar";
const PriorityScheduling: React.FC = () => {
  // 初始进程数组
  const [processes, setProcesses] = useState<Process[]>([
    { id: 1, arrivalTime: 0, burstTime: 4, priority: 3 },
    { id: 2, arrivalTime: 1, burstTime: 3, priority: 2 },
    { id: 3, arrivalTime: 2, burstTime: 2, priority: 4 },
    { id: 4, arrivalTime: 3, burstTime: 1, priority: 1 },
    { id: 5, arrivalTime: 4, burstTime: 5, priority: 5 },
  ]);

  const [schedule, setSchedule] = useState<Process[]>([]); // 存储调度顺序
  const [currentTime, setCurrentTime] = useState(0); // 当前时间
  const [processQueue, setProcessQueue] = useState<Process[]>([]); // 就绪队列
  const [remainingProcesses, setRemainingProcesses] = useState<Process[]>([
    ...processes,
  ]); // 剩余进程
  const [completedProcesses, setCompletedProcesses] = useState<Process[]>([]); // 已完成进程
  const [isReady, setIsReady] = useState(false); // 标记是否已更新进程信息

  // 更新进程参数的函数
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
  //这是一开始需要完成进程的确认，因为要有一个进程的修改确认，只有这样才能进行后续的操作

  // 确认修改并初始化调度
  //这其实就是初始化的一个操作
  const handleConfirmChanges = () => {
    setRemainingProcesses([...processes]);
    setCompletedProcesses([]);
    setSchedule([]);
    setCurrentTime(0);
    setIsReady(true);
  };

  const handleNextStep = () => {
    const nextSchedule = [...completedProcesses]; //已经完成的进程
    let nextRemainingProcesses = [...remainingProcesses]; //剩下的进程
    const nextProcessQueue = [...processQueue]; //就绪队列
    let nextCurrentTime = currentTime; //当前时间

    // 将到达的进程加入到就绪队列
    nextRemainingProcesses.forEach((process) => {
      if (
        process.arrivalTime <= nextCurrentTime &&
        !nextProcessQueue.includes(process)
      ) {
        nextProcessQueue.push(process);
      } //首先是到达时间晚于当前的时间，其次是就绪队列中没有这个进程
    });

    if (nextProcessQueue.length > 0) {
      // 按优先数排序，选择优先数最高的进程
      nextProcessQueue.sort((a, b) => b.priority - a.priority);
      const currentProcess = nextProcessQueue.shift(); // 取出优先数最高的进程

      if (currentProcess) {
        // 更新进程的完成时间
        const endTime = nextCurrentTime + currentProcess.burstTime;
        nextSchedule.push({ ...currentProcess, endTime, remainingTime: 0 });
        nextCurrentTime = endTime;

        // 该进程已经完成，移除它
        nextRemainingProcesses = nextRemainingProcesses.filter(
          (process) => process.id !== currentProcess.id
        );
      } //存在当前的进程
    } else {
      // 如果没有进程可以执行，增加当前时间
      nextCurrentTime++;
    }

    setCompletedProcesses(nextSchedule);
    setRemainingProcesses(nextRemainingProcesses);
    setProcessQueue(nextProcessQueue);
    setCurrentTime(nextCurrentTime);
    setSchedule(nextSchedule);
  };

  return (
    <div>
      <TopBar />
      <h1>进程调度（静态最高优先数优先）</h1>
      <h2>输入进程信息:</h2>
      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>进程ID</th>
            <th>到达时间</th>
            <th>执行时间</th>
            <th>优先数</th>
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
              <td>
                <input
                  type="number"
                  value={process.priority}
                  onChange={(e) =>
                    handleProcessChange(
                      process.id,
                      "priority",
                      Number(e.target.value)
                    )
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
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
            <th>优先数</th>
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
              <td>{process.priority}</td>
              <td>{process.endTime ?? "进行中"}</td>
              <td>{process.remainingTime ?? process.burstTime}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <br />
      <Button onClick={handleNextStep} disabled={!isReady}>
        下一步
      </Button>
    </div>
  );
};

export default PriorityScheduling;
