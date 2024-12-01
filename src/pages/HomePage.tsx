import { TopBar } from "@/components/TopBar";

export default function Home() {
  return (
    <>
      <div>
        <TopBar />

        <div className="container mx-auto p-4">
          <h1 className="text-4xl font-bold text-center mb-4">
            欢迎来到操作系统算法可视化平台
          </h1>
          <p className="text-lg text-center text-muted-foreground mb-8">
            本网站提供了多种经典的操作系统算法可视化实验，旨在帮助学生和开发者更好地理解和掌握操作系统中的关键算法。
          </p>
          <p className="text-base text-muted-foreground mb-4">
            在这里，你可以：
          </p>
          <ul className="list-disc pl-6 text-base text-muted-foreground">
            <li>深入了解常见的操作系统调度算法，如进程调度和作业调度。</li>
            <li>了解内存管理策略、死锁避免算法等操作系统核心机制。</li>
            <li>通过交互式可视化，增强对操作系统算法的理解与实践。</li>
          </ul>
          <p className="text-base text-muted-foreground mt-4">
            快速选择你感兴趣的实验，开始你的学习之旅！
          </p>
        </div>
      </div>
    </>
  );
}
