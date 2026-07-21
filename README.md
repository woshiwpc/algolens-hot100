# AlgoLens · LeetCode Hot 100 可视化

首个打通案例：**3. 无重复字符的最长子串**。

## 目录结构

```text
src/
├─ components/
│  ├─ Visualizer.tsx          # 通用播放器外壳
│  ├─ PlaybackControls.tsx    # 播放/暂停/单步/调速/进度
│  ├─ CodePanel.tsx           # 可编辑 CodeMirror 6 + C++ 逐行高亮
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

代码面板允许直接修改展示用 C++，并可一键恢复标准实现。修改不会参与算法计算；动画仍由 `steps.ts` 生成，并按原始代码行号高亮。步骤切换只滚动代码面板内部，不改变浏览器页面位置。

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
