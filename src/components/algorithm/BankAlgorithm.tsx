"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BankAlgorithm() {
  const [processes, setProcesses] = useState(4);
  const [resources, setResources] = useState(3);
  const [available, setAvailable] = useState<number[]>([]);
  const [max, setMax] = useState<number[][]>([]);
  const [allocation, setAllocation] = useState<number[][]>([]);
  const [need, setNeed] = useState<number[][]>([]);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    setAvailable((prev) => {
      const newAvailable = [...prev];
      while (newAvailable.length < resources) {
        newAvailable.push(0);
      }
      return newAvailable.slice(0, resources);
    });

    const initMatrix = (prev: number[][]) => {
      const newMatrix = [...prev];
      while (newMatrix.length < processes) {
        newMatrix.push(new Array(resources).fill(0));
      }
      return newMatrix.slice(0, processes).map((row) => {
        const newRow = [...row];
        while (newRow.length < resources) {
          newRow.push(0);
        }
        return newRow.slice(0, resources);
      });
    };

    setMax((prev) => initMatrix(prev));
    setAllocation((prev) => initMatrix(prev));
    setNeed((prev) => initMatrix(prev));
  }, [processes, resources]);

  const handleAvailableChange = (index: number, value: number) => {
    const newAvailable = [...available];
    newAvailable[index] = value;
    setAvailable(newAvailable);
  };

  const handleMaxChange = (i: number, j: number, value: number) => {
    const newMax = max.map((row) => [...row]);
    newMax[i][j] = value;
    setMax(newMax);
    updateNeed(newMax, allocation);
  };

  const handleAllocationChange = (i: number, j: number, value: number) => {
    const newAllocation = allocation.map((row) => [...row]);
    newAllocation[i][j] = value;
    setAllocation(newAllocation);
    updateNeed(max, newAllocation);
  };

  const updateNeed = (newMax: number[][], newAllocation: number[][]) => {
    const newNeed = newMax.map((row, i) =>
      row.map((val, j) => val - newAllocation[i][j])
    );
    setNeed(newNeed);
  };

  const runBankersAlgorithm = () => {
    const work = [...available];
    const finish = new Array(processes).fill(false);
    const safeSequence: number[] = [];

    let count = 0;
    while (count < processes) {
      let found = false;
      for (let i = 0; i < processes; i++) {
        if (!finish[i] && need[i].every((val, j) => val <= work[j])) {
          for (let j = 0; j < resources; j++) {
            work[j] += allocation[i][j];
          }
          safeSequence.push(i);
          finish[i] = true;
          found = true;
          count++;
          break;
        }
      }
      if (!found) break;
    }

    if (count === processes) {
      setResult(
        `安全，安全顺序为${safeSequence.map((i) => `P${i}`).join(" -> ")}`
      );
    } else {
      setResult("不安全，死锁会出现");
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6 bg-gray-50 min-h-screen">
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">
            银行家算法
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="processes"
                className="text-sm font-medium text-gray-700"
              >
                进程数
              </Label>
              <Input
                id="processes"
                type="number"
                value={processes}
                onChange={(e) =>
                  setProcesses(
                    Math.max(1, Math.min(10, Number(e.target.value)))
                  )
                }
                min={1}
                max={10}
                className="mt-1"
              />
            </div>
            <div>
              <Label
                htmlFor="resources"
                className="text-sm font-medium text-gray-700"
              >
                资源总数
              </Label>
              <Input
                id="resources"
                type="number"
                value={resources}
                onChange={(e) =>
                  setResources(
                    Math.max(1, Math.min(10, Number(e.target.value)))
                  )
                }
                min={1}
                max={10}
                className="mt-1"
              />
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary">
                可分配的资源数
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: resources }, (_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <Label
                      htmlFor={`available-${i}`}
                      className="text-sm font-medium text-gray-700"
                    >
                      R{i}
                    </Label>
                    <Input
                      id={`available-${i}`}
                      type="number"
                      value={available[i] || 0}
                      onChange={(e) =>
                        handleAvailableChange(i, Number(e.target.value))
                      }
                      min={0}
                      className="w-20 mt-1"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary">
                最大需求量
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-gray-100">进程</TableHead>
                    {Array.from({ length: resources }, (_, i) => (
                      <TableHead key={i} className="bg-gray-100">
                        R{i}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: processes }, (_, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">P{i}</TableCell>
                      {Array.from({ length: resources }, (_, j) => (
                        <TableCell key={j}>
                          <Input
                            type="number"
                            value={max[i]?.[j] || 0}
                            onChange={(e) =>
                              handleMaxChange(i, j, Number(e.target.value))
                            }
                            min={0}
                            className="w-20"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary">
                分配资源
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-gray-100">进程</TableHead>
                    {Array.from({ length: resources }, (_, i) => (
                      <TableHead key={i} className="bg-gray-100">
                        R{i}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: processes }, (_, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">P{i}</TableCell>
                      {Array.from({ length: resources }, (_, j) => (
                        <TableCell key={j}>
                          <Input
                            type="number"
                            value={allocation[i]?.[j] || 0}
                            onChange={(e) =>
                              handleAllocationChange(
                                i,
                                j,
                                Number(e.target.value)
                              )
                            }
                            min={0}
                            className="w-20"
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-primary">
                需求量 (最大需求 - 分配资源)
              </CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-gray-100">进程</TableHead>
                    {Array.from({ length: resources }, (_, i) => (
                      <TableHead key={i} className="bg-gray-100">
                        R{i}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Array.from({ length: processes }, (_, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">P{i}</TableCell>
                      {Array.from({ length: resources }, (_, j) => (
                        <TableCell key={j}>{need[i]?.[j] || 0}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button
              onClick={runBankersAlgorithm}
              className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded"
            >
              运行银行家算法
            </Button>
          </div>

          {result && (
            <Card className="mt-4 bg-gray-100">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-primary">
                  结果
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-lg ${
                    result.includes("安全") ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {result}
                </p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
