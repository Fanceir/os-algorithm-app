import * as React from "react";
import { useNavigate } from "react-router-dom";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Book } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const experiments = [
  {
    title: "进程调度实验",
    href: "/process-scheduling",
    description: "探索进程调度算法及其实现。",
  },
  {
    title: "作业调度实验",
    href: "/job-scheduling",
    description: "了解操作系统中的作业调度技术。",
  },
  {
    title: "存储管理实验",
    href: "/memory-management",
    description: "理解内存管理策略及其应用。",
  },
  {
    title: "文件管理实验",
    href: "/file-management",
    description: "深入研究文件系统管理和组织技术。",
  },
  {
    title: "死锁避免银行家算法实验",
    href: "/bankers-algorithm",
    description: "学习资源分配中用于避免死锁的银行家算法。",
  },
];

export function CommandMenu({ ...props }: DialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (
          (e.target instanceof HTMLElement && e.target.isContentEditable) ||
          e.target instanceof HTMLInputElement ||
          e.target instanceof HTMLTextAreaElement ||
          e.target instanceof HTMLSelectElement
        ) {
          return;
        }

        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "relative h-8 w-full justify-start rounded-[0.5rem] bg-muted/50 text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-56 xl:w-64"
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">搜索实验...</span>
        <span className="inline-flex lg:hidden">搜索...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="输入命令或搜索..." />
        <CommandList>
          <CommandEmpty>没有找到相关结果。</CommandEmpty>
          <CommandGroup heading="实验">
            {experiments.map((experiment) => (
              <CommandItem
                key={experiment.href}
                value={experiment.title}
                onSelect={() => {
                  runCommand(() => navigate(experiment.href));
                }}
              >
                <Book className="mr-2 h-4 w-4" />
                {experiment.title}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandSeparator />
        </CommandList>
      </CommandDialog>
    </>
  );
}
