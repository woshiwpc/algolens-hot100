# AlgoLens · LeetCode Hot 100 可视化

首个打通案例：**3. 无重复字符的最长子串**。

## 目录结构

```text
src/
├─ components/
│  ├─ Visualizer.tsx          # 通用播放器外壳
│  ├─ PlaybackControls.tsx    # 播放/暂停/单步/调速/进度
│  ├─ CodePanel.tsx           # CodeMirror 6 + C++ 逐行高亮
│  └─ VariablePanel.tsx       # 通用变量状态面板
├─ problems/
│  └─ longest-substring/
│     ├─ solution.cpp         # 只展示，不参与运算
│     ├─ steps.ts             # TS 算法 + Step[] 生成
│     ├─ types.ts             # 本题 snapshot 类型
│     └─ SlidingWindowView.tsx# 本题专属数据结构视图
├─ types/
│  └─ step.ts                 # 全题型共享 Step<TSnapshot>
└─ App.tsx                    # 题目页面与自定义输入
```

## 通用 Step 协议

```ts
interface Step<TSnapshot = unknown> {
  id: string
  codeLine: number
  snapshot: TSnapshot
  description: string
  variables: Record<string, unknown>
}
```

`Visualizer` 只消费 `Step[]`、C++ 源码和一个 `renderSnapshot` 函数。扩展新题时，播放器、代码面板和变量面板无需复制。

## 本地运行

```bash
npm install
npm run dev
```

验证：

```bash
npm test
npm run build
```
