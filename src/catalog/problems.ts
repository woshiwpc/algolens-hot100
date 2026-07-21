import { solutions } from './solutions'
import { extraExamples } from './examples'
import { carlReferences } from './carlReferences'
import type { Difficulty, ProblemDefinition, VisualKind } from './types'

type RawProblem = readonly [
  id: number,
  title: string,
  slug: string,
  category: string,
  difficulty: Difficulty,
  pattern: string,
  summary: string,
  sample: string,
  visualKind: VisualKind,
]

const rawProblems: RawProblem[] = [
  [1, '两数之和', 'two-sum', '哈希', '简单', '一次遍历哈希表', '扫描当前数时，只需查询 target - nums[i] 是否已经出现。', 'nums = [2,7,11,15], target = 9', 'array'],
  [49, '字母异位词分组', 'group-anagrams', '哈希', '中等', '排序键分组', '把每个字符串排序后的结果作为哈希键，相同键自然落进同一组。', 'strs = ["eat","tea","tan","ate","nat","bat"]', 'array'],
  [128, '最长连续序列', 'longest-consecutive-sequence', '哈希', '中等', '集合枚举起点', '只从没有前驱 x-1 的数开始向后扩展，保证每个数最多访问两次。', 'nums = [100,4,200,1,3,2]', 'array'],
  [283, '移动零', 'move-zeroes', '双指针', '简单', '快慢指针', '快指针寻找非零元素，慢指针标记下一个应填入的位置。', 'nums = [0,1,0,3,12]', 'array'],
  [11, '盛最多水的容器', 'container-with-most-water', '双指针', '中等', '向内收缩双指针', '面积受短板限制，因此每次移动较短的一侧才可能得到更优解。', 'height = [1,8,6,2,5,4,8,3,7]', 'array'],
  [15, '三数之和', '3sum', '双指针', '中等', '排序 + 双指针', '固定第一个数后，在有序区间用左右指针寻找和为其相反数的数对。', 'nums = [-1,0,1,2,-1,-4]', 'array'],
  [42, '接雨水', 'trapping-rain-water', '双指针', '困难', '双指针维护边界', '较低一侧的水量已由该侧最大高度确定，可以立即结算。', 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', 'array'],
  [3, '无重复字符的最长子串', 'longest-substring-without-repeating-characters', '滑动窗口', '中等', '滑动窗口 + 最近位置', '右边界扩张；字符重复时，左边界跳到旧位置之后。', 's = "abcabcbb"', 'window'],
  [438, '找到字符串中所有字母异位词', 'find-all-anagrams-in-a-string', '滑动窗口', '中等', '定长窗口计数', '窗口长度固定为 p 的长度，用欠缺字符数判断窗口是否满足频次要求。', 's = "cbaebabacd", p = "abc"', 'window'],
  [560, '和为 K 的子数组', 'subarray-sum-equals-k', '子串', '中等', '前缀和 + 哈希', '若当前前缀和为 sum，之前出现过 sum-k，就得到对应数量的目标子数组。', 'nums = [1,1,1], k = 2', 'window'],
  [239, '滑动窗口最大值', 'sliding-window-maximum', '子串', '困难', '单调队列', '队列只保留仍在窗口内、且可能成为最大值的下标。', 'nums = [1,3,-1,-3,5,3,6,7], k = 3', 'window'],
  [76, '最小覆盖子串', 'minimum-window-substring', '子串', '困难', '可变窗口 + 计数', '右侧满足需求后持续收缩左侧，记录每次仍合法的最短窗口。', 's = "ADOBECODEBANC", t = "ABC"', 'window'],
  [53, '最大子数组和', 'maximum-subarray', '普通数组', '中等', 'Kadane 动态规划', '当前位置的最优连续和，要么从当前数重新开始，要么接在前一段之后。', 'nums = [-2,1,-3,4,-1,2,1,-5,4]', 'array'],
  [56, '合并区间', 'merge-intervals', '普通数组', '中等', '排序后扫描', '按左端点排序后，只需比较当前区间与结果末尾区间是否重叠。', 'intervals = [[1,3],[2,6],[8,10],[15,18]]', 'array'],
  [189, '轮转数组', 'rotate-array', '普通数组', '中等', '三次翻转', '先整体翻转，再分别翻转前 k 段和剩余段，把尾部搬到开头。', 'nums = [1,2,3,4,5,6,7], k = 3', 'array'],
  [238, '除了自身以外数组的乘积', 'product-of-array-except-self', '普通数组', '中等', '前缀积 × 后缀积', '先写入每个位置左侧乘积，再用一个变量从右向左乘入后缀积。', 'nums = [1,2,3,4]', 'array'],
  [41, '缺失的第一个正数', 'first-missing-positive', '普通数组', '困难', '原地哈希', '把值 x 放到下标 x-1；整理后首个位置不匹配的下标就是答案。', 'nums = [3,4,-1,1]', 'array'],
  [73, '矩阵置零', 'set-matrix-zeroes', '矩阵', '中等', '首行首列作标记', '复用矩阵首行和首列记录哪些行列需要清零，只额外保存首列状态。', 'matrix = [[1,1,1],[1,0,1],[1,1,1]]', 'matrix'],
  [54, '螺旋矩阵', 'spiral-matrix', '矩阵', '中等', '四边界收缩', '按上、右、下、左的顺序遍历一圈，然后同步收缩四条边界。', 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', 'matrix'],
  [48, '旋转图像', 'rotate-image', '矩阵', '中等', '转置 + 行翻转', '沿主对角线转置，再水平翻转每一行即可得到顺时针旋转。', 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', 'matrix'],
  [240, '搜索二维矩阵 II', 'search-a-2d-matrix-ii', '矩阵', '中等', '右上角阶梯搜索', '从右上角出发，大于目标就左移，小于目标就下移，每次排除一行或一列。', 'matrix = [[1,4,7],[2,5,8],[3,6,9]], target = 5', 'matrix'],
  [160, '相交链表', 'intersection-of-two-linked-lists', '链表', '简单', '双指针换路', '两个指针分别走完 A+B 与 B+A，路程相同后会在交点或 null 相遇。', 'A = [4,1,8,4,5], B = [5,6,1,8,4,5]', 'linked-list'],
  [206, '反转链表', 'reverse-linked-list', '链表', '简单', '迭代改指针', '保存 next 后把 curr->next 指向 prev，再整体向前移动。', 'head = [1,2,3,4,5]', 'linked-list'],
  [234, '回文链表', 'palindrome-linked-list', '链表', '简单', '中点 + 反转后半段', '快慢指针找中点，反转后半段后与前半段逐节点比较。', 'head = [1,2,2,1]', 'linked-list'],
  [141, '环形链表', 'linked-list-cycle', '链表', '简单', '快慢指针', '慢指针一步、快指针两步；存在环时二者一定会在环内相遇。', 'head = [3,2,0,-4], pos = 1', 'linked-list'],
  [142, '环形链表 II', 'linked-list-cycle-ii', '链表', '中等', 'Floyd 判圈', '相遇后让一个指针回到头结点，两者同步走，相遇点即环入口。', 'head = [3,2,0,-4], pos = 1', 'linked-list'],
  [21, '合并两个有序链表', 'merge-two-sorted-lists', '链表', '简单', '哑结点归并', '比较两个头结点，把较小节点接到结果尾部并推进对应链表。', 'list1 = [1,2,4], list2 = [1,3,4]', 'linked-list'],
  [2, '两数相加', 'add-two-numbers', '链表', '中等', '逐位相加 + 进位', '同步读取两个链表的当前位，把和的个位写入新节点并保存进位。', 'l1 = [2,4,3], l2 = [5,6,4]', 'linked-list'],
  [19, '删除链表的倒数第 N 个结点', 'remove-nth-node-from-end-of-list', '链表', '中等', '间隔双指针', '快指针先走 n 步，之后快慢同步；快指针到尾时慢指针位于待删节点之前。', 'head = [1,2,3,4,5], n = 2', 'linked-list'],
  [24, '两两交换链表中的节点', 'swap-nodes-in-pairs', '链表', '中等', '局部指针重连', '用哑结点统一处理每一对节点，按第二、第一、下一段的顺序重新连接。', 'head = [1,2,3,4]', 'linked-list'],
  [25, 'K 个一组翻转链表', 'reverse-nodes-in-k-group', '链表', '困难', '分组原地翻转', '先确认剩余节点不少于 k，再翻转半开区间 [head, tail->next)。', 'head = [1,2,3,4,5], k = 2', 'linked-list'],
  [138, '随机链表的复制', 'copy-list-with-random-pointer', '链表', '中等', '哈希映射复制', '先为每个原节点创建副本，再通过映射连接 next 和 random。', 'head = [[7,null],[13,0],[11,4],[10,2],[1,0]]', 'linked-list'],
  [148, '排序链表', 'sort-list', '链表', '中等', '归并排序', '快慢指针切成两半，递归排序后再线性归并。', 'head = [4,2,1,3]', 'linked-list'],
  [23, '合并 K 个升序链表', 'merge-k-sorted-lists', '链表', '困难', '小根堆多路归并', '堆中只放每条链表当前最小节点；取出后把它的 next 加入堆。', 'lists = [[1,4,5],[1,3,4],[2,6]]', 'linked-list'],
  [146, 'LRU 缓存', 'lru-cache', '链表', '中等', '哈希表 + 双向链表', '哈希表负责 O(1) 定位，双向链表按最近使用顺序维护淘汰位置。', 'capacity = 2, ops = [put1,put2,get1,put3]', 'linked-list'],
  [94, '二叉树的中序遍历', 'binary-tree-inorder-traversal', '二叉树', '简单', '栈模拟递归', '不断把左链压栈；弹出节点访问后转向其右子树。', 'root = [1,null,2,3]', 'tree'],
  [104, '二叉树的最大深度', 'maximum-depth-of-binary-tree', '二叉树', '简单', '递归后序', '空树深度为 0，非空节点深度是左右子树最大深度加一。', 'root = [3,9,20,null,null,15,7]', 'tree'],
  [226, '翻转二叉树', 'invert-binary-tree', '二叉树', '简单', '递归交换子树', '先递归翻转左右子树，再交换当前节点的两个孩子。', 'root = [4,2,7,1,3,6,9]', 'tree'],
  [101, '对称二叉树', 'symmetric-tree', '二叉树', '简单', '镜像递归', '同时比较两棵子树：值相同，且外侧对应、内侧对应。', 'root = [1,2,2,3,4,4,3]', 'tree'],
  [543, '二叉树的直径', 'diameter-of-binary-tree', '二叉树', '简单', '后序深度 + 全局答案', '每个节点处的最长路径是左深度加右深度，同时向父节点返回单侧最大深度。', 'root = [1,2,3,4,5]', 'tree'],
  [102, '二叉树的层序遍历', 'binary-tree-level-order-traversal', '二叉树', '中等', '队列 BFS', '每轮先记录队列长度，只弹出这一层的节点并把孩子加入下一层。', 'root = [3,9,20,null,null,15,7]', 'tree'],
  [108, '将有序数组转换为二叉搜索树', 'convert-sorted-array-to-binary-search-tree', '二叉树', '简单', '分治取中点', '选择中点作为根，左右两段递归构造，天然保持平衡与 BST 性质。', 'nums = [-10,-3,0,5,9]', 'tree'],
  [98, '验证二叉搜索树', 'validate-binary-search-tree', '二叉树', '中等', '递归上下界', '每个节点必须严格位于祖先传下来的开区间 (low, high) 中。', 'root = [5,1,4,null,null,3,6]', 'tree'],
  [230, '二叉搜索树中第 K 小的元素', 'kth-smallest-element-in-a-bst', '二叉树', '中等', '中序遍历计数', 'BST 的中序序列递增，第 k 个访问的节点就是答案。', 'root = [3,1,4,null,2], k = 1', 'tree'],
  [199, '二叉树的右视图', 'binary-tree-right-side-view', '二叉树', '中等', '层序遍历', '逐层 BFS，每层最后弹出的节点就是从右侧能看到的节点。', 'root = [1,2,3,null,5,null,4]', 'tree'],
  [114, '二叉树展开为链表', 'flatten-binary-tree-to-linked-list', '二叉树', '中等', '寻找前驱原地改链', '把左子树搬到右边，并把原右子树接到左子树最右节点之后。', 'root = [1,2,5,3,4,null,6]', 'tree'],
  [105, '从前序与中序遍历序列构造二叉树', 'construct-binary-tree-from-preorder-and-inorder-traversal', '二叉树', '中等', '前序定位根 + 中序分割', '前序首元素是根；用哈希表在中序中定位它，递归构造左右区间。', 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]', 'tree'],
  [437, '路径总和 III', 'path-sum-iii', '二叉树', '中等', '前缀和回溯', '根到当前节点的前缀和为 sum，路径数由之前出现的 sum-target 决定。', 'root = [10,5,-3,3,2,null,11,3,-2,null,1], target = 8', 'tree'],
  [236, '二叉树的最近公共祖先', 'lowest-common-ancestor-of-a-binary-tree', '二叉树', '中等', '后序递归', '若 p、q 分别出现在左右子树，当前节点就是最近公共祖先。', 'root = [3,5,1,6,2,0,8,null,null,7,4], p=5, q=1', 'tree'],
  [124, '二叉树中的最大路径和', 'binary-tree-maximum-path-sum', '二叉树', '困难', '后序贡献值', '向上只能贡献一条分支；当前节点可用左右正贡献同时更新全局最大路径。', 'root = [-10,9,20,null,null,15,7]', 'tree'],
  [200, '岛屿数量', 'number-of-islands', '图论', '中等', '网格 DFS', '遇到陆地就计数并把同一连通块的所有陆地标记为已访问。', 'grid = [[1,1,1,1,0],[1,1,0,1,0],[1,1,0,0,0],[0,0,0,0,0]]', 'graph'],
  [994, '腐烂的橘子', 'rotting-oranges', '图论', '中等', '多源 BFS', '把所有腐烂橘子同时入队，每轮扩散一层对应一分钟。', 'grid = [[2,1,1],[1,1,0],[0,1,1]]', 'graph'],
  [207, '课程表', 'course-schedule', '图论', '中等', '拓扑排序', '从入度为 0 的课程开始删除边；最终处理数等于课程数说明无环。', 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', 'graph'],
  [208, '实现 Trie (前缀树)', 'implement-trie-prefix-tree', '图论', '中等', '字符树', '每条边代表一个字符，沿字符逐层创建或查询节点，并在词尾打标记。', 'ops = [insert apple, search apple, startsWith app]', 'graph'],
  [46, '全排列', 'permutations', '回溯', '中等', '选择列表回溯', '路径长度等于 n 时收集答案；回退时恢复 used 状态。', 'nums = [1,2,3]', 'backtracking'],
  [78, '子集', 'subsets', '回溯', '中等', '枚举选择起点', '每个递归节点都是一个合法子集，再从 start 后继续选择避免重复。', 'nums = [1,2,3]', 'backtracking'],
  [17, '电话号码的字母组合', 'letter-combinations-of-a-phone-number', '回溯', '中等', '按位枚举字符', '第 i 位从对应数字的字母表中选择一个字符，直到路径长度等于数字串长度。', 'digits = "23"', 'backtracking'],
  [39, '组合总和', 'combination-sum', '回溯', '中等', '可重复选择回溯', '从当前下标继续选择允许重复；剩余目标小于 0 时剪枝。', 'candidates = [2,3,6,7], target = 7', 'backtracking'],
  [22, '括号生成', 'generate-parentheses', '回溯', '中等', '合法计数剪枝', '左括号未用完可添加；只有右括号已用数量少于左括号时才能添加右括号。', 'n = 3', 'backtracking'],
  [79, '单词搜索', 'word-search', '回溯', '中等', '网格 DFS + 恢复现场', '匹配一个字符后临时标记格子，向四邻搜索，返回前恢复原字符。', 'board = [[A,B,C,E],[S,F,C,S],[A,D,E,E]], word = ABCCED', 'backtracking'],
  [131, '分割回文串', 'palindrome-partitioning', '回溯', '中等', '枚举切点', '从 start 枚举结束位置，只有当前片段为回文时才进入下一层。', 's = "aab"', 'backtracking'],
  [51, 'N 皇后', 'n-queens', '回溯', '困难', '逐行放置 + 冲突剪枝', '每行放一个皇后，用列和两条对角线集合快速判断冲突。', 'n = 4', 'backtracking'],
  [35, '搜索插入位置', 'search-insert-position', '二分查找', '简单', '左边界二分', '寻找第一个大于等于 target 的位置，区间采用左闭右开。', 'nums = [1,3,5,6], target = 5', 'binary-search'],
  [74, '搜索二维矩阵', 'search-a-2d-matrix', '二分查找', '中等', '矩阵展平二分', '把 m×n 矩阵视为长度 m*n 的有序数组，用除法和取模映射坐标。', 'matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3', 'binary-search'],
  [34, '在排序数组中查找元素的第一个和最后一个位置', 'find-first-and-last-position-of-element-in-sorted-array', '二分查找', '中等', '两次左边界二分', '分别寻找第一个 ≥ target 和第一个 ≥ target+1 的位置。', 'nums = [5,7,7,8,8,10], target = 8', 'binary-search'],
  [33, '搜索旋转排序数组', 'search-in-rotated-sorted-array', '二分查找', '中等', '判断有序半区', '每轮至少有一半有序，判断 target 是否落在该半区来舍弃另一半。', 'nums = [4,5,6,7,0,1,2], target = 0', 'binary-search'],
  [153, '寻找旋转排序数组中的最小值', 'find-minimum-in-rotated-sorted-array', '二分查找', '中等', '与右端点比较', '若 nums[mid] 大于右端点，最小值在右侧；否则 mid 仍可能是答案。', 'nums = [3,4,5,1,2]', 'binary-search'],
  [4, '寻找两个正序数组的中位数', 'median-of-two-sorted-arrays', '二分查找', '困难', '二分分割线', '在较短数组上寻找分割点，使左半最大值不大于右半最小值。', 'nums1 = [1,3], nums2 = [2]', 'binary-search'],
  [20, '有效的括号', 'valid-parentheses', '栈', '简单', '栈匹配', '左括号入栈；右括号必须与栈顶匹配，否则立即失败。', 's = "()[]{}"', 'stack'],
  [155, '最小栈', 'min-stack', '栈', '中等', '同步最小值栈', '每次压入当前值与历史最小值的较小者，栈顶即可 O(1) 返回最小值。', 'ops = [push -2, push 0, push -3, getMin, pop, top]', 'stack'],
  [394, '字符串解码', 'decode-string', '栈', '中等', '栈保存外层状态', '遇到 [ 时保存当前重复次数和外层字符串，遇到 ] 时展开并拼回。', 's = "3[a2[c]]"', 'stack'],
  [739, '每日温度', 'daily-temperatures', '栈', '中等', '单调递减栈', '当前温度更高时，持续弹出较冷日期并结算等待天数。', 'temperatures = [73,74,75,71,69,72,76,73]', 'stack'],
  [84, '柱状图中最大的矩形', 'largest-rectangle-in-histogram', '栈', '困难', '单调递增栈', '遇到更矮柱时，弹出的高度以当前下标为右边界、弹栈后栈顶为左边界。', 'heights = [2,1,5,6,2,3]', 'stack'],
  [215, '数组中的第K个最大元素', 'kth-largest-element-in-an-array', '堆', '中等', '大小为 k 的小根堆', '堆只保留最大的 k 个数，堆顶就是其中最小的，也就是第 k 大。', 'nums = [3,2,1,5,6,4], k = 2', 'heap'],
  [347, '前 K 个高频元素', 'top-k-frequent-elements', '堆', '中等', '频次哈希 + 小根堆', '统计频次后维护大小为 k 的小根堆，淘汰频次较低的元素。', 'nums = [1,1,1,2,2,3], k = 2', 'heap'],
  [295, '数据流的中位数', 'find-median-from-data-stream', '堆', '困难', '大根堆 + 小根堆', '较小一半放大根堆，较大一半放小根堆，并保持两堆大小差不超过 1。', 'stream = [1,2,3,4,5]', 'heap'],
  [121, '买卖股票的最佳时机', 'best-time-to-buy-and-sell-stock', '贪心算法', '简单', '维护历史最低价', '扫描当天价格，用此前最低买入价计算卖出利润，并更新最大利润。', 'prices = [7,1,5,3,6,4]', 'array'],
  [55, '跳跃游戏', 'jump-game', '贪心算法', '中等', '维护最远可达位置', '只要当前位置不超过 farthest，就能继续用 nums[i] 扩展最远边界。', 'nums = [2,3,1,1,4]', 'array'],
  [45, '跳跃游戏 II', 'jump-game-ii', '贪心算法', '中等', '分层贪心', '在当前跳跃范围内收集下一层最远边界，到达边界时增加一次跳跃。', 'nums = [2,3,1,1,4]', 'array'],
  [763, '划分字母区间', 'partition-labels', '贪心算法', '中等', '维护片段最远终点', '预先记录每个字符最后位置，扫描时当前片段终点取这些位置的最大值。', 's = "ababcbacadefegdehijhklij"', 'array'],
  [70, '爬楼梯', 'climbing-stairs', '动态规划', '简单', '滚动 Fibonacci', '到第 i 阶只能来自 i-1 或 i-2，因此 dp[i] 是前两项之和。', 'n = 5', 'dp'],
  [118, '杨辉三角', 'pascals-triangle', '动态规划', '简单', '逐行递推', '每行两端为 1，中间元素等于上一行左上与右上的和。', 'numRows = 5', 'dp'],
  [198, '打家劫舍', 'house-robber', '动态规划', '中等', '选或不选', '当前最优值是“不偷当前”和“偷当前 + 前两间最优”的较大者。', 'nums = [2,7,9,3,1]', 'dp'],
  [279, '完全平方数', 'perfect-squares', '动态规划', '中等', '完全背包', '枚举平方数 j*j，用 dp[i-j*j]+1 更新组成 i 的最少数量。', 'n = 12', 'dp'],
  [322, '零钱兑换', 'coin-change', '动态规划', '中等', '完全背包最小值', '对每个金额枚举硬币，从可达的前置金额转移并加一。', 'coins = [1,2,5], amount = 11', 'dp'],
  [139, '单词拆分', 'word-break', '动态规划', '中等', '前缀可达性', '若前缀 [0,j) 可拆分且 s[j,i) 在字典中，则前缀 [0,i) 可拆分。', 's = "leetcode", wordDict = ["leet","code"]', 'dp'],
  [300, '最长递增子序列', 'longest-increasing-subsequence', '动态规划', '中等', '贪心 tails + 二分', 'tails[len] 保存长度 len+1 的递增子序列最小结尾，用二分替换。', 'nums = [10,9,2,5,3,7,101,18]', 'dp'],
  [152, '乘积最大子数组', 'maximum-product-subarray', '动态规划', '中等', '同时维护最大最小积', '负数会让最大和最小互换，因此当前位置同时从前一最大积、最小积转移。', 'nums = [2,3,-2,4]', 'dp'],
  [416, '分割等和子集', 'partition-equal-subset-sum', '动态规划', '中等', '0/1 背包', '目标是选出和为总和一半的子集，容量必须从大到小更新避免重复选取。', 'nums = [1,5,11,5]', 'dp'],
  [32, '最长有效括号', 'longest-valid-parentheses', '动态规划', '困难', '以右括号结尾的状态', '遇到右括号时，根据前一个字符或前一段有效串之前的字符完成转移。', 's = ")()())"', 'dp'],
  [62, '不同路径', 'unique-paths', '多维动态规划', '中等', '二维路径计数', '每个格子的路径数来自上方和左方路径数之和。', 'm = 3, n = 7', 'dp'],
  [64, '最小路径和', 'minimum-path-sum', '多维动态规划', '中等', '网格最短路径 DP', '到当前格子的最小代价等于自身权值加上上方、左方较小值。', 'grid = [[1,3,1],[1,5,1],[4,2,1]]', 'dp'],
  [5, '最长回文子串', 'longest-palindromic-substring', '多维动态规划', '中等', '中心扩展', '以每个字符和每个字符间隙为中心向两侧扩展，记录最长回文。', 's = "babad"', 'dp'],
  [1143, '最长公共子序列', 'longest-common-subsequence', '多维动态规划', '中等', '二维序列 DP', '字符相等时接在左上答案后；否则取上方与左方的较大值。', 'text1 = "abcde", text2 = "ace"', 'dp'],
  [72, '编辑距离', 'edit-distance', '多维动态规划', '中等', '二维编辑 DP', '字符不同则从插入、删除、替换三个前置状态取最小值再加一。', 'word1 = "horse", word2 = "ros"', 'dp'],
  [136, '只出现一次的数字', 'single-number', '技巧', '简单', '异或抵消', '相同数字异或为 0，0 与任意数异或仍为该数，最终只留下单独元素。', 'nums = [4,1,2,1,2]', 'array'],
  [169, '多数元素', 'majority-element', '技巧', '简单', 'Boyer-Moore 投票', '相同元素增加票数，不同元素抵消；多数元素最终一定成为候选。', 'nums = [2,2,1,1,1,2,2]', 'array'],
  [75, '颜色分类', 'sort-colors', '技巧', '中等', '荷兰国旗三指针', '0 交换到左侧，2 交换到右侧，1 留在中间；处理区间持续缩小。', 'nums = [2,0,2,1,1,0]', 'array'],
  [31, '下一个排列', 'next-permutation', '技巧', '中等', '寻找下降点', '从右找首个可提升位置，与右侧最小较大值交换，再反转后缀为最小排列。', 'nums = [1,2,3]', 'array'],
  [287, '寻找重复数', 'find-the-duplicate-number', '技巧', '中等', '下标映射成环', '把 nums[i] 看作下一节点，重复值对应环入口，用 Floyd 算法定位。', 'nums = [1,3,4,2,2]', 'array'],
]

export const problems: ProblemDefinition[] = rawProblems.map((problem) => {
  const [id, title, slug, category, difficulty, pattern, summary, sample, visualKind] = problem
  const sourceCode = solutions[id]
  if (!sourceCode) throw new Error(`Missing C++ solution for LeetCode ${id}`)
  const extras = extraExamples[id]
  if (!extras) throw new Error(`Missing examples for LeetCode ${id}`)
  const reference = carlReferences[id]
  const codeReference = reference
    ? { label: '代码随想录参考' as const, ...reference }
    : undefined
  return { id, title, slug, category, difficulty, pattern, summary, sample, examples: [sample, ...extras], visualKind, sourceCode, codeReference }
})

export const categories = Array.from(new Set(problems.map((problem) => problem.category)))

export const problemsById = new Map(problems.map((problem) => [problem.id, problem]))
