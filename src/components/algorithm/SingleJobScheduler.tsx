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
import MinHeap from "heap-js"; // 或者你可以选择自定义一个堆

interface Job {
  id: number;
  arrivalTime: number;
  burstTime: number;
  waitingTime?: number;
  turnaroundTime?: number;
  weightedTurnaroundTime?: number;
  completionTime?: number;
}

const JobScheduling: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([
    { id: 1, arrivalTime: 0, burstTime: 3 },
    { id: 2, arrivalTime: 2, burstTime: 6 },
    { id: 3, arrivalTime: 4, burstTime: 4 },
    { id: 4, arrivalTime: 6, burstTime: 5 },
    { id: 5, arrivalTime: 8, burstTime: 2 },
  ]);

  const [schedule, setSchedule] = useState<Job[]>([]);
  const [algorithm, setAlgorithm] = useState<string>("FCFS");
  const [averageTurnaroundTime, setAverageTurnaroundTime] = useState(0);
  const [averageWeightedTurnaroundTime, setAverageWeightedTurnaroundTime] =
    useState(0);

  const handleJobChange = (id: number, field: keyof Job, value: number) => {
    const updatedJobs = jobs.map((job) =>
      job.id === id ? { ...job, [field]: value } : job
    );
    setJobs(updatedJobs);
  };

  const handleConfirmChanges = () => {
    setSchedule([]);
    setAverageTurnaroundTime(0);
    setAverageWeightedTurnaroundTime(0);
  };

  const calculateFCFS = () => {
    let currentTime = 0;
    let totalTurnaroundTime = 0;
    let totalWeightedTurnaroundTime = 0;
    const updatedJobs = [...jobs].sort((a, b) => a.arrivalTime - b.arrivalTime);
    updatedJobs.forEach((job) => {
      const startTime = Math.max(currentTime, job.arrivalTime);
      const completionTime = startTime + job.burstTime;
      const turnaroundTime = completionTime - job.arrivalTime;
      const weightedTurnaroundTime = turnaroundTime / job.burstTime;

      job.completionTime = completionTime;
      job.turnaroundTime = turnaroundTime;
      job.weightedTurnaroundTime = weightedTurnaroundTime;

      currentTime = completionTime;

      totalTurnaroundTime += turnaroundTime;
      totalWeightedTurnaroundTime += weightedTurnaroundTime;
    });

    setSchedule(updatedJobs);
    setAverageTurnaroundTime(totalTurnaroundTime / updatedJobs.length);
    setAverageWeightedTurnaroundTime(
      totalWeightedTurnaroundTime / updatedJobs.length
    );
  };

  const calculateSJF = () => {
    let currentTime = 0;
    let totalTurnaroundTime = 0;
    let totalWeightedTurnaroundTime = 0;
    const updatedJobs = [...jobs].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const completedJobs: Job[] = [];

    // 初始化小顶堆，用于管理已经到达的作业，堆内按 burstTime 排序
    const jobQueue = new MinHeap<Job>((a, b) => a.burstTime - b.burstTime);

    // 循环直到所有作业完成
    while (completedJobs.length < jobs.length) {
      // 将所有已到达的作业加入到小顶堆中
      while (
        updatedJobs.length > 0 &&
        updatedJobs[0].arrivalTime <= currentTime
      ) {
        const job = updatedJobs.shift(); // 获取并移除第一个作业
        if (job) {
          jobQueue.push(job); // 将作业插入堆中
        }
      }

      if (jobQueue.size() > 0) {
        // 选择最短的作业（即堆顶的作业）
        const job = jobQueue.pop(); // 获取并移除堆顶作业
        if (job) {
          const startTime = Math.max(currentTime, job.arrivalTime);
          const completionTime = startTime + job.burstTime;
          const turnaroundTime = completionTime - job.arrivalTime;
          const weightedTurnaroundTime = turnaroundTime / job.burstTime;

          // 更新作业信息
          job.completionTime = completionTime;
          job.turnaroundTime = turnaroundTime;
          job.weightedTurnaroundTime = weightedTurnaroundTime;

          // 更新总计
          totalTurnaroundTime += turnaroundTime;
          totalWeightedTurnaroundTime += weightedTurnaroundTime;
          currentTime = completionTime;

          // 标记作业为已完成
          completedJobs.push(job);
        }
      } else {
        // 如果没有作业可执行，推进时间
        // 确保时间推进时，不会进入死循环
        currentTime++;
      }
    }

    // 更新状态
    setSchedule(completedJobs);
    setAverageTurnaroundTime(totalTurnaroundTime / completedJobs.length);
    setAverageWeightedTurnaroundTime(
      totalWeightedTurnaroundTime / completedJobs.length
    );
  };

  const calculateHRN = () => {
    let currentTime = 0;
    let totalTurnaroundTime = 0;
    let totalWeightedTurnaroundTime = 0;
    const updatedJobs = [...jobs].sort((a, b) => a.arrivalTime - b.arrivalTime);
    const completedJobs: Job[] = [];

    // 循环直到所有作业完成
    while (completedJobs.length < jobs.length) {
      // 将所有已到达的作业加入到 readyJobs 中
      const readyJobs = updatedJobs.filter(
        (job) => job.arrivalTime <= currentTime && !completedJobs.includes(job)
      );

      if (readyJobs.length > 0) {
        // 按响应比降序排序，选择响应比高的作业
        readyJobs.sort((a, b) => {
          const responseRatioA =
            1 + (currentTime - a.arrivalTime) / a.burstTime;
          const responseRatioB =
            1 + (currentTime - b.arrivalTime) / b.burstTime;
          return responseRatioB - responseRatioA; // 降序排序
        });

        // 选择响应比最高的作业
        const job = readyJobs[0];
        const startTime = Math.max(currentTime, job.arrivalTime);
        const completionTime = startTime + job.burstTime;
        const turnaroundTime = completionTime - job.arrivalTime;
        const weightedTurnaroundTime = turnaroundTime / job.burstTime;

        // 更新作业信息
        job.completionTime = completionTime;
        job.turnaroundTime = turnaroundTime;
        job.weightedTurnaroundTime = weightedTurnaroundTime;

        // 更新总计
        totalTurnaroundTime += turnaroundTime;
        totalWeightedTurnaroundTime += weightedTurnaroundTime;
        currentTime = completionTime;

        // 标记作业为已完成
        completedJobs.push(job);
      } else {
        // 如果没有作业可执行，推进时间
        // 确保时间推进时，不会进入死循环
        currentTime++;
      }
    }

    // 更新状态
    setSchedule(completedJobs);
    setAverageTurnaroundTime(totalTurnaroundTime / completedJobs.length);
    setAverageWeightedTurnaroundTime(
      totalWeightedTurnaroundTime / completedJobs.length
    );
  };

  const handleAlgorithmChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setAlgorithm(event.target.value);
  };

  const handleStartSimulation = () => {
    switch (algorithm) {
      case "FCFS":
        calculateFCFS();
        break;
      case "SJF":
        calculateSJF();
        break;
      case "HRN":
        calculateHRN();
        break;
      default:
        break;
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <TopBar />
      <h1 className="text-3xl font-bold text-center mb-6">作业等待模拟</h1>

      <Card>
        <CardHeader>
          <CardTitle>输入作业信息</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>作业ID</TableHead>
                <TableHead>到达时间</TableHead>
                <TableHead>执行时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.id}</TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={job.arrivalTime}
                      onChange={(e) =>
                        handleJobChange(
                          job.id,
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
                      value={job.burstTime}
                      onChange={(e) =>
                        handleJobChange(
                          job.id,
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
          <Button onClick={handleConfirmChanges} className="mt-4">
            确定
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>选择调度算法</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={algorithm}
            onChange={handleAlgorithmChange}
            className="mt-4 border p-2 rounded"
          >
            <option value="FCFS">先来先服务（FCFS）</option>
            <option value="SJF">最短作业优先（SJF）</option>
            <option value="HRN">响应比高者优先（HRN）</option>
          </select>
          <Button onClick={handleStartSimulation} className="mt-4 ml-4">
            开始调度
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>调度结果</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>作业ID</TableHead>
                <TableHead>到达时间</TableHead>
                <TableHead>执行时间</TableHead>
                <TableHead>完成时间</TableHead>
                <TableHead>周转时间</TableHead>
                <TableHead>带权周转时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedule.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>{job.id}</TableCell>
                  <TableCell>{job.arrivalTime}</TableCell>
                  <TableCell>{job.burstTime}</TableCell>
                  <TableCell>{job.completionTime ?? "进行中"}</TableCell>
                  <TableCell>{job.turnaroundTime ?? "进行中"}</TableCell>
                  <TableCell>
                    {job.weightedTurnaroundTime ?? "进行中"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <p>平均周转时间: {averageTurnaroundTime}</p>
            <p>平均带权周转时间: {averageWeightedTurnaroundTime}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JobScheduling;
