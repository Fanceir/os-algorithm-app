import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom"; // 引入 useNavigate

import { Label } from "@/components/ui/label";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
} from "@/components/ui/sidebar";

const searchData = [
  {
    id: 1,
    title: "进程调度实验",
    href: "/process-scheduling",
    description: "探索进程调度算法及其实现。",
  },
  {
    id: 2,
    title: "作业调度实验",
    href: "/job-scheduling",
    description: "了解操作系统中的作业调度技术。",
  },
  {
    id: 3,
    title: "存储管理实验",
    href: "/memory-management",
    description: "理解内存管理策略及其应用。",
  },
  {
    id: 4,
    title: "文件管理实验",
    href: "/file-management",
    description: "深入研究文件系统管理和组织技术。",
  },
  {
    id: 5,
    title: "死锁避免银行家算法实验",
    href: "/bankers-algorithm",
    description: "学习资源分配中用于避免死锁的银行家算法。",
  },
];
type SearchDataType = (typeof searchData)[number];
export function SearchForm({ ...props }: React.ComponentProps<"form">) {
  const [query, setQuery] = useState<string>("");
  const [results, setResults] = useState<SearchDataType[]>([]);
  const navigate = useNavigate(); // 使用 useNavigate 来处理跳转

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    // 动态搜索，更新结果
    if (e.target.value.trim()) {
      setResults(
        searchData.filter((item) =>
          item.title.toLowerCase().includes(e.target.value.toLowerCase())
        )
      );
    } else {
      setResults([]); // 如果没有输入内容，清空结果
    }
  };

  // 提交表单时的逻辑
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      console.log("Searching for:", query);
      // 实际搜索逻辑（如通过API获取结果）在这里处理
    }
  };

  // 清空输入框内容
  const handleClear = () => {
    setQuery("");
    setResults([]); // 清空结果
  };

  // 处理点击搜索结果的逻辑
  const handleResultClick = (href: string) => {
    navigate(href); // 跳转到对应的页面
  };

  return (
    <form {...props} onSubmit={handleSubmit}>
      <SidebarGroup className="py-0">
        <SidebarGroupContent className="relative">
          <Label htmlFor="search" className="sr-only">
            Search
          </Label>
          <SidebarInput
            id="search"
            placeholder="Search the docs..."
            value={query}
            onChange={handleInputChange}
            className="pl-8"
          />
          <Search className="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50" />

          {/* 清空按钮 */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800 focus:outline-none"
            >
              ✖
            </button>
          )}
        </SidebarGroupContent>
      </SidebarGroup>

      {results.length > 0 && (
        <div className="mt-4 bg-white border rounded-md shadow-md max-h-60 overflow-y-auto">
          <ul>
            {results.map((result) => (
              <li
                key={result.id}
                className="p-2 border-b last:border-none cursor-pointer"
                onClick={() => handleResultClick(result.href)} // 点击时跳转
              >
                <strong>{result.title}</strong>
                <p className="text-sm text-gray-600">{result.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
