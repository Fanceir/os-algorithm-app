# 操作系统算法可视化

## 项目概述

本项目是江南大学计算机科学与技术学院操作系统课程的大作业。该平台旨在通过交互式可视化方式，帮助学生深入理解操作系统中的核心算法和概念。通过实践和观察，学生可以更好地掌握操作系统的工作原理，为未来的学习和研究奠定基础。

### 功能特性

1. **进程调度算法可视化**

   - 先来先服务（FCFS）
   - 短作业优先（SJF）
   - 优先级调度
   - 时间片轮转（RR）

2. **内存管理可视化**

   - 页面置换算法（如 LRU, FIFO）
   - 分区分配算法

3. **文件系统操作模拟**

   - 文件的创建、读写和删除
   - 目录结构的管理

4. **死锁检测与避免**

   - 银行家算法实现与可视化

5. **性能分析与对比**
   - 各算法的效率对比
   - 关键性能指标的实时计算与展示

## 技术栈

- 前端：React, TypeScript, Tailwind CSS
- 版本控制：Git, GitHub
- 部署：Vercel

## 安装与运行

1. 克隆仓库：

   ```bash
   git clone https://github.com/Fanceir/os-algorithm-app.git
   ```

2. 安装依赖：

   ```bash
   pnpm install
   ```

3. 运行开发服务器：

   ```bash
   pnpm run dev
   ```

## 项目结构

```
.
├── README.md
├── commitlint.config.cjs
├── components.json
├── dist
│   ├── assets
│   ├── index.html
│   └── vite.svg
├── eslint.config.js
├── index.html
├── logo.png
├── node_modules/
├── package-lock.json
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── public
│   └── vite.svg
├── src
│   ├── App.css
│   ├── App.tsx
│   ├── assets
│   ├── components
│   ├── hooks
│   ├── index.css
│   ├── lib
│   ├── main.tsx
│   ├── pages
│   ├── public
│   ├── routes
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```

## 贡献指南

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

请确保您的代码符合项目的编码规范，并附带适当的注释和测试。

## 致谢

- 特别感谢桑庆兵老师的悉心指导

## 许可证

本项目采用 MIT 许可证。详情请见 [LICENSE](LICENSE) 文件。
