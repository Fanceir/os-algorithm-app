# 江南大学操作系统算法可视化平台

![江南大学 Logo](./public/jiangnan_university_logo.png)

## 项目概述

本项目是江南大学计算机科学与技术学院操作系统课程的大作业。该平台旨在通过交互式可视化方式，帮助学生深入理解操作系统中的核心算法和概念。通过实践和观察，学生可以更好地掌握操作系统的工作原理，为未来的学习和研究奠定基础。

### 教育目标

- 强化对操作系统核心概念的理解
- 培养算法分析和评估能力
- 提高编程和软件开发技能
- 锻炼项目管理和团队协作能力

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
- 后端：Node.js, Express（如果适用）
- 数据可视化：D3.js 或 Chart.js
- 版本控制：Git, GitHub

## 安装与运行

1. 克隆仓库：

   ```bash
   git clone https://github.com/your-username/jiangnan-os-visualization.git
   cd jiangnan-os-visualization
   ```

2. 安装依赖：

   ```bash
   npm install
   ```

3. 运行开发服务器：

   ```bash
   npm run dev
   ```

4. 在浏览器中访问 `http://localhost:3000` 查看应用。

## 使用指南

1. 在首页选择要探索的算法类别（如进程调度、内存管理等）。
2. 选择具体算法进行可视化。
3. 使用提供的控制面板设置参数或上传自定义数据。
4. 点击"开始模拟"按钮，观察算法的运行过程。
5. 使用播放控制来暂停、继续或重置模拟。
6. 查看性能指标和分析报告，深入理解算法的工作原理。
7. 完成实验报告，记录观察结果和心得体会。

## 项目结构

```
jiangnan-os-visualization/
│
├── src/
│   ├── components/    # React 组件
│   ├── algorithms/    # 算法实现
│   ├── hooks/         # 自定义 React Hooks
│   ├── pages/         # 页面组件
│   ├── styles/        # 样式文件
│   └── utils/         # 工具函数
│
├── public/            # 静态资源
│
├── tests/             # 测试文件
│
├── docs/              # 项目文档
│   └── report_template.md  # 实验报告模板
│
├── package.json
├── README.md
└── ...
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
