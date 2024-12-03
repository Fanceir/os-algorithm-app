import React, { useState, useCallback, useMemo } from "react";
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

interface MemoryBlock {
  name: string;
  size: number;
  address: number;
  state: "已分配" | "空闲";
}

const RequestPagingSystem: React.FC = () => {
  const [maxMemory, setMaxMemory] = useState<number>(0);
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>([]);
  const [processName, setProcessName] = useState<string>("");
  const [requestSize, setRequestSize] = useState<number>(0);
  const [error, setError] = useState<string>("");

  const initializeMemory = useCallback(() => {
    if (maxMemory <= 0) {
      setError("请输入有效的最大内存大小");
      return;
    }
    setMemoryBlocks([
      {
        name: "未占用",
        size: maxMemory,
        address: 0,
        state: "空闲",
      },
    ]);
    setError("");
  }, [maxMemory]);

  const allocateMemory = useCallback(() => {
    if (requestSize <= 0) {
      setError("请输入有效的内存请求大小");
      return;
    }
    if (processName.trim() === "") {
      setError("请输入进程名称");
      return;
    }

    setMemoryBlocks((prevBlocks) => {
      const newBlocks: MemoryBlock[] = [];
      let allocated = false;

      for (const block of prevBlocks) {
        if (!allocated && block.state === "空闲" && block.size >= requestSize) {
          newBlocks.push({
            name: processName,
            size: requestSize,
            address: block.address,
            state: "已分配",
          });

          if (block.size > requestSize) {
            newBlocks.push({
              name: "未占用",
              size: block.size - requestSize,
              address: block.address + requestSize,
              state: "空闲",
            });
          }
          allocated = true;
        } else {
          newBlocks.push(block);
        }
      }

      if (allocated) {
        setProcessName("");
        setRequestSize(0);
        setError("");
        return newBlocks;
      } else {
        setError("没有足够的连续空闲内存来分配");
        return prevBlocks;
      }
    });
  }, [processName, requestSize]);

  const freeMemory = useCallback((name: string) => {
    setMemoryBlocks((prevBlocks) => {
      const newBlocks = prevBlocks.map((block) =>
        block.name === name
          ? { ...block, name: "未占用", state: "free" }
          : block
      );

      return newBlocks.reduce((acc, curr) => {
        if (
          acc.length === 0 ||
          curr.state === "已分配" ||
          acc[acc.length - 1].state === "已分配"
        ) {
          acc.push(curr as MemoryBlock);
        } else {
          const last = acc[acc.length - 1];
          last.size += curr.size;
        }
        return acc;
      }, [] as MemoryBlock[]);
    });
    setError("");
  }, []);

  const renderMemoryBlocks = useMemo(() => {
    return memoryBlocks.map((block, index) => (
      <TableRow key={index}>
        <TableCell>{index + 1}</TableCell>
        <TableCell>{block.name}</TableCell>
        <TableCell>{block.address}</TableCell>
        <TableCell>{block.size}</TableCell>
        <TableCell>{block.state}</TableCell>
        <TableCell>
          {block.state === "已分配" && (
            <Button
              onClick={() => freeMemory(block.name)}
              variant="destructive"
              size="sm"
            >
              释放
            </Button>
          )}
        </TableCell>
      </TableRow>
    ));
  }, [memoryBlocks, freeMemory]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-3xl font-bold text-center mb-6">内存分配模拟</h1>

      <Card>
        <CardHeader>
          <CardTitle>设置最大可分配内存</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Input
              type="number"
              value={maxMemory || ""}
              onChange={(e) => setMaxMemory(Number(e.target.value))}
              placeholder="输入最大内存大小"
              className="w-64"
            />
            <Button onClick={initializeMemory}>初始化内存</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>内存分配请求</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4 mb-4">
            <Input
              value={processName}
              onChange={(e) => setProcessName(e.target.value)}
              placeholder="进程名称"
              className="w-64"
            />
            <Input
              type="number"
              value={requestSize || ""}
              onChange={(e) => setRequestSize(Number(e.target.value))}
              placeholder="请求内存大小"
              className="w-64"
            />
            <Button onClick={allocateMemory}>分配内存</Button>
          </div>
          {error && <p className="text-red-500">{error}</p>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>内存分配状态</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>区号</TableHead>
                <TableHead>名称</TableHead>
                <TableHead>起始地址</TableHead>
                <TableHead>大小</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderMemoryBlocks}</TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestPagingSystem;
