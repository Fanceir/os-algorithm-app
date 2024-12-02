import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Book, Code } from "lucide-react";
import { TopBar } from "@/components/TopBar";
export default function AboutPage() {
  return (
    <>
      <TopBar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">
          关于我们的操作系统进程调度实验
        </h1>

        <Tabs defaultValue="project" className="mb-8">
          <TabsList>
            <TabsTrigger value="project">项目介绍</TabsTrigger>
            <TabsTrigger value="team">作者介绍</TabsTrigger>
            <TabsTrigger value="features">核心功能</TabsTrigger>
          </TabsList>
          <TabsContent value="project">
            <Card>
              <CardHeader>
                <CardTitle>项目介绍</CardTitle>
                <CardDescription>了解我们的项目目标和背景</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-4">
                  本项目旨在通过交互式可视化方式，帮助学生和研究人员更好地理解操作系统中的进程调度算法。
                  我们的平台提供了多种调度算法的模拟环境，让用户能够直观地观察不同算法的运行过程和性能表现。
                </p>
                <p>
                  通过这个项目，使复杂的操作系统概念变得更加容易理解和掌握。
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="team">
            <Card>
              <CardHeader>
                <CardTitle>作者介绍</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Fanceir，关注Fanceir谢谢喵，如果有合适的前端实习可以找到我
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="features">
            <Card>
              <CardHeader>
                <CardTitle>核心功能</CardTitle>
                <CardDescription>探索我们的主要特性</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-4 sm:grid-cols-2">
                  <li>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">多种调度算法</CardTitle>
                      </CardHeader>
                      <CardContent>
                        支持先来先服务（FCFS）、短作业优先（SJF）、优先级调度等多种算法。
                      </CardContent>
                    </Card>
                  </li>

                  <li>
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">性能分析</CardTitle>
                      </CardHeader>
                      <CardContent>
                        提供平均周转时间、平均等待时间等，帮助理解评估算法效率。
                      </CardContent>
                    </Card>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex flex-wrap gap-4">
          <Button variant="outline" asChild>
            <Link to="https://www.fanxu.online">
              <Book className="mr-2 h-4 w-4" /> 查看作者博客
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link
              to="https://github.com/Fanceir/os-algorithm-app"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Code className="mr-2 h-4 w-4" /> 源代码
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
