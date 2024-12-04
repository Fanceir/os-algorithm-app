"use client";

import React, { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";

const FIXED_PARTITION_SIZE = 16 * 1024; // 16GB in MB

interface MemoryBlock {
  id: number;
  size: number;
}

export default function MemoryManagementSystem() {
  const [memoryBlocks, setMemoryBlocks] = useState<MemoryBlock[]>([]);
  const [inputSize, setInputSize] = useState<string>("");
  const [nextId, setNextId] = useState(1);

  const addMemoryBlock = useCallback(() => {
    const size = parseInt(inputSize);
    if (isNaN(size) || size <= 0) {
      toast({
        title: "Invalid input",
        description: "Please enter a positive number.",
        variant: "destructive",
      });
      return;
    }

    const totalUsed = memoryBlocks.reduce((sum, block) => sum + block.size, 0);
    if (totalUsed + size > FIXED_PARTITION_SIZE) {
      toast({
        title: "Not enough memory",
        description: "The requested size exceeds available memory.",
        variant: "destructive",
      });
      return;
    }

    setMemoryBlocks((prev) => [...prev, { id: nextId, size }]);
    setNextId((prev) => prev + 1);
    setInputSize("");
  }, [inputSize, memoryBlocks, nextId]);

  const removeMemoryBlock = useCallback((id: number) => {
    setMemoryBlocks((prev) => prev.filter((block) => block.id !== id));
  }, []);

  const totalUsedMemory = memoryBlocks.reduce(
    (sum, block) => sum + block.size,
    0
  );
  const usedPercentage = (totalUsedMemory / FIXED_PARTITION_SIZE) * 100;

  return (
    <div className="container p-4 mx-auto space-y-8">
      <h1 className="mb-6 text-3xl font-bold text-center">内存管理系统</h1>

      <Card>
        <CardHeader>
          <CardTitle>内存使用情况</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={usedPercentage} className="w-full" />
          <div className="mt-2">
            <strong>已使用内存：</strong> {totalUsedMemory} MB /{" "}
            {FIXED_PARTITION_SIZE} MB
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>添加内存占用</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <Label htmlFor="memorySize">内存大小 (MB)：</Label>
            <Input
              id="memorySize"
              type="number"
              value={inputSize}
              onChange={(e) => setInputSize(e.target.value)}
              className="w-24"
            />
          </div>
          <Button onClick={addMemoryBlock}>添加内存块</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>内存块列表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>大小 (MB)</TableHead>
                <TableHead>操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {memoryBlocks.map((block) => (
                <TableRow key={block.id}>
                  <TableCell>{block.id}</TableCell>
                  <TableCell>{block.size}</TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      onClick={() => removeMemoryBlock(block.id)}
                    >
                      删除
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
