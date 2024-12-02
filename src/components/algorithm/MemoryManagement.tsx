import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
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

// 页管理相关设置
const PAGE_SIZE = 1024; // 1 KB 页大小

// 生成地址流
const generateAddressStream = (numAddresses: number): number[] => {
  const stream: number[] = [];
  const half = Math.floor(numAddresses / 2);
  const quarter = Math.floor(numAddresses / 4);

  // 顺序访问部分
  for (let i = 0; i < half; i++) {
    stream.push(i * PAGE_SIZE);
  }

  // 前 25% 均匀散布在前地址部分
  for (let i = 0; i < quarter; i++) {
    stream.push(Math.floor(Math.random() * (half / 2)) * PAGE_SIZE);
  }

  // 后 25% 均匀散布在后地址部分
  for (let i = 0; i < quarter; i++) {
    stream.push(
      half * PAGE_SIZE + Math.floor(Math.random() * (half / 2)) * PAGE_SIZE
    );
  }

  return stream;
};

// 页表条目接口
interface PageTableEntry {
  pageNumber: number;
  lastAccessedTime: number;
}

const RequestPagingSystem: React.FC = () => {
  const [addressStream, setAddressStream] = useState<number[]>([]);
  const [pageTable, setPageTable] = useState<PageTableEntry[]>([]);
  const [currentAddressIndex, setCurrentAddressIndex] = useState(0);
  const [step, setStep] = useState(0);
  const [pageFaults, setPageFaults] = useState<number>(0); // 记录缺页次数
  const [memorySize, setMemorySize] = useState<number>(4); // 默认页表最大长度为 4

  const generatePageTable = () => {
    setPageTable([]); // 初始化页表为空
    setAddressStream(generateAddressStream(20)); // 生成20个地址
    setStep(0);
    setCurrentAddressIndex(0);
    setPageFaults(0); // 重置缺页次数
  };

  // 计算地址所在的页号
  const getPageNumber = (address: number) => {
    return Math.floor(address / PAGE_SIZE);
  };

  // 页面替换的FIFO算法
  const handlePageFault = (pageNumber: number) => {
    if (pageTable.length < memorySize) {
      // 如果页表未满，直接调入
      setPageTable((prev) => [...prev, { pageNumber, lastAccessedTime: step }]);
    } else {
      // 页表已满，按FIFO淘汰
      const oldestPage = pageTable.shift(); // 删除最早访问的页
      if (oldestPage) {
        console.log(`淘汰页号：${oldestPage.pageNumber}`);
      }

      // 加入新的页
      setPageTable((prev) => [...prev, { pageNumber, lastAccessedTime: step }]);
    }
    setPageFaults((prev) => prev + 1); // 增加缺页次数
  };

  // 访问下一个地址
  const handleNextStep = () => {
    if (currentAddressIndex >= addressStream.length) {
      return; // 防止越界
    }

    const currentAddress = addressStream[currentAddressIndex];
    const currentPageNumber = getPageNumber(currentAddress);

    // 检查页表中是否已有该页
    const pageExists = pageTable.some(
      (entry) => entry.pageNumber === currentPageNumber
    );

    if (!pageExists) {
      // 如果该页不在主存中，发生缺页
      console.log(`缺页，调入页号：${currentPageNumber}`);
      handlePageFault(currentPageNumber);
    } else {
      console.log(`页号 ${currentPageNumber} 已在主存`);
    }

    // 更新当前步数
    setStep((prev) => prev + 1);
    setCurrentAddressIndex((prev) => prev + 1);
  };

  // 渲染页表
  const renderPageTable = useMemo(() => {
    return pageTable.map((entry, index) => (
      <TableRow key={index}>
        <TableCell>{entry.pageNumber}</TableCell>
        <TableCell>{entry.lastAccessedTime}</TableCell>
      </TableRow>
    ));
  }, [pageTable]);

  return (
    <div className="container mx-auto p-4 space-y-8">
      <TopBar />
      <h1 className="text-3xl font-bold text-center mb-6">
        请求页式存储管理模拟
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>请求地址流生成</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={generatePageTable} className="mt-4">
            生成地址流
          </Button>
          <div className="mt-4">
            <strong>地址流：</strong>
            {addressStream.join(", ")}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>设置页表最大长度</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <label>最大页表长度: </label>
            <input
              type="number"
              value={memorySize}
              onChange={(e) => setMemorySize(Number(e.target.value))}
              min={1}
              className="border p-2"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>页表</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>页号</TableHead>
                <TableHead>最近访问时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderPageTable}</TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>模拟步骤</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            onClick={handleNextStep}
            disabled={currentAddressIndex >= addressStream.length}
            className="mt-4"
          >
            下一步
          </Button>
          <div className="mt-4">
            <strong>缺页次数：</strong>
            {pageFaults}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RequestPagingSystem;
