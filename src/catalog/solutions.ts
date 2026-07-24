export const solutions: Record<number, string> = {
  1: String.raw`class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        unordered_map<int, int> seen;
        for (int i = 0; i < nums.size(); ++i) {
            int need = target - nums[i];
            if (seen.count(need)) return {seen[need], i};
            seen[nums[i]] = i;
        }
        return {};
    }
};`,
  49: String.raw`class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        unordered_map<string, vector<string>> groups;
        for (const string& s : strs) {
            string key = s;
            sort(key.begin(), key.end());
            groups[key].push_back(s);
        }
        vector<vector<string>> ans;
        for (auto& [_, group] : groups) ans.push_back(move(group));
        return ans;
    }
};`,
  128: String.raw`class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        unordered_set<int> values(nums.begin(), nums.end());
        int ans = 0;
        for (int x : values) {
            if (values.count(x - 1)) continue;
            int y = x;
            while (values.count(y)) ++y;
            ans = max(ans, y - x);
        }
        return ans;
    }
};`,
  283: String.raw`class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        int slow = 0;
        for (int fast = 0; fast < nums.size(); ++fast) {
            if (nums[fast] != 0) swap(nums[slow++], nums[fast]);
        }
    }
};`,
  11: String.raw`class Solution {
public:
    int maxArea(vector<int>& height) {
        int left = 0, right = height.size() - 1, ans = 0;
        while (left < right) {
            ans = max(ans, min(height[left], height[right]) * (right - left));
            if (height[left] < height[right]) ++left;
            else --right;
        }
        return ans;
    }
};`,
  15: String.raw`class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        sort(nums.begin(), nums.end());
        vector<vector<int>> ans;
        for (int i = 0; i + 2 < nums.size(); ++i) {
            if (i && nums[i] == nums[i - 1]) continue;
            if (nums[i] > 0) break;
            int left = i + 1, right = nums.size() - 1;
            while (left < right) {
                long sum = (long)nums[i] + nums[left] + nums[right];
                if (sum < 0) ++left;
                else if (sum > 0) --right;
                else {
                    ans.push_back({nums[i], nums[left], nums[right]});
                    do { ++left; } while (left < right && nums[left] == nums[left - 1]);
                    do { --right; } while (left < right && nums[right] == nums[right + 1]);
                }
            }
        }
        return ans;
    }
};`,
  42: String.raw`class Solution {
public:
    int trap(vector<int>& height) {
        int left = 0, right = height.size() - 1;
        int leftMax = 0, rightMax = 0, ans = 0;
        while (left < right) {
            if (height[left] < height[right]) {
                leftMax = max(leftMax, height[left]);
                ans += leftMax - height[left++];
            } else {
                rightMax = max(rightMax, height[right]);
                ans += rightMax - height[right--];
            }
        }
        return ans;
    }
};`,
  3: String.raw`class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> lastSeen;
        int left = 0;
        int best = 0;

        for (int right = 0; right < s.size(); ++right) {
            char current = s[right];

            if (lastSeen.count(current) &&
                lastSeen[current] >= left) {
                left = lastSeen[current] + 1;
            }

            lastSeen[current] = right;
            int windowLength = right - left + 1;
            best = max(best, windowLength);
        }

        return best;
    }
};`,
  438: String.raw`class Solution {
public:
    vector<int> findAnagrams(string s, string p) {
        if (s.size() < p.size()) return {};
        array<int, 26> need{}, window{};
        for (char c : p) ++need[c - 'a'];
        vector<int> ans;
        for (int right = 0; right < s.size(); ++right) {
            ++window[s[right] - 'a'];
            if (right >= p.size()) --window[s[right - p.size()] - 'a'];
            if (right + 1 >= p.size() && window == need)
                ans.push_back(right - p.size() + 1);
        }
        return ans;
    }
};`,
  560: String.raw`class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        unordered_map<int, int> count{{0, 1}};
        int prefix = 0, ans = 0;
        for (int x : nums) {
            prefix += x;
            if (count.count(prefix - k)) ans += count[prefix - k];
            ++count[prefix];
        }
        return ans;
    }
};`,
  239: String.raw`class Solution {
public:
    vector<int> maxSlidingWindow(vector<int>& nums, int k) {
        deque<int> queue;
        vector<int> ans;
        for (int i = 0; i < nums.size(); ++i) {
            while (!queue.empty() && queue.front() <= i - k) queue.pop_front();
            while (!queue.empty() && nums[queue.back()] <= nums[i]) queue.pop_back();
            queue.push_back(i);
            if (i >= k - 1) ans.push_back(nums[queue.front()]);
        }
        return ans;
    }
};`,
  76: String.raw`class Solution {
public:
    string minWindow(string s, string t) {
        array<int, 128> need{};
        for (char c : t) ++need[c];
        int missing = t.size(), left = 0, bestLeft = 0, bestLen = INT_MAX;
        for (int right = 0; right < s.size(); ++right) {
            if (need[s[right]]-- > 0) --missing;
            while (missing == 0) {
                if (right - left + 1 < bestLen) {
                    bestLeft = left;
                    bestLen = right - left + 1;
                }
                if (++need[s[left++]] > 0) ++missing;
            }
        }
        return bestLen == INT_MAX ? "" : s.substr(bestLeft, bestLen);
    }
};`,
  53: String.raw`class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        int current = nums[0], ans = nums[0];
        for (int i = 1; i < nums.size(); ++i) {
            current = max(nums[i], current + nums[i]);
            ans = max(ans, current);
        }
        return ans;
    }
};`,
  56: String.raw`class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        sort(intervals.begin(), intervals.end());
        vector<vector<int>> ans;
        for (auto& interval : intervals) {
            if (ans.empty() || ans.back()[1] < interval[0]) ans.push_back(interval);
            else ans.back()[1] = max(ans.back()[1], interval[1]);
        }
        return ans;
    }
};`,
  189: String.raw`class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        k %= nums.size();
        reverse(nums.begin(), nums.end());
        reverse(nums.begin(), nums.begin() + k);
        reverse(nums.begin() + k, nums.end());
    }
};`,
  238: String.raw`class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        int n = nums.size();
        vector<int> ans(n, 1);
        for (int i = 1; i < n; ++i) ans[i] = ans[i - 1] * nums[i - 1];
        int suffix = 1;
        for (int i = n - 1; i >= 0; --i) {
            ans[i] *= suffix;
            suffix *= nums[i];
        }
        return ans;
    }
};`,
  41: String.raw`class Solution {
public:
    int firstMissingPositive(vector<int>& nums) {
        int n = nums.size();
        for (int i = 0; i < n; ++i) {
            while (nums[i] >= 1 && nums[i] <= n && nums[nums[i] - 1] != nums[i])
                swap(nums[i], nums[nums[i] - 1]);
        }
        for (int i = 0; i < n; ++i)
            if (nums[i] != i + 1) return i + 1;
        return n + 1;
    }
};`,
  73: String.raw`class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        int m = matrix.size(), n = matrix[0].size();
        bool firstColZero = false;
        for (int i = 0; i < m; ++i) {
            if (matrix[i][0] == 0) firstColZero = true;
            for (int j = 1; j < n; ++j)
                if (matrix[i][j] == 0) matrix[i][0] = matrix[0][j] = 0;
        }
        for (int i = m - 1; i >= 0; --i) {
            for (int j = 1; j < n; ++j)
                if (matrix[i][0] == 0 || matrix[0][j] == 0) matrix[i][j] = 0;
            if (firstColZero) matrix[i][0] = 0;
        }
    }
};`,
  54: String.raw`class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        int top = 0, bottom = matrix.size() - 1;
        int left = 0, right = matrix[0].size() - 1;
        vector<int> ans;
        while (top <= bottom && left <= right) {
            for (int j = left; j <= right; ++j) ans.push_back(matrix[top][j]);
            ++top;
            for (int i = top; i <= bottom; ++i) ans.push_back(matrix[i][right]);
            --right;
            if (top <= bottom)
                for (int j = right; j >= left; --j) ans.push_back(matrix[bottom][j]);
            --bottom;
            if (left <= right)
                for (int i = bottom; i >= top; --i) ans.push_back(matrix[i][left]);
            ++left;
        }
        return ans;
    }
};`,
  48: String.raw`class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        int n = matrix.size();
        for (int i = 0; i < n; ++i)
            for (int j = i + 1; j < n; ++j)
                swap(matrix[i][j], matrix[j][i]);
        for (auto& row : matrix) reverse(row.begin(), row.end());
    }
};`,
  240: String.raw`class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int row = 0, col = matrix[0].size() - 1;
        while (row < matrix.size() && col >= 0) {
            if (matrix[row][col] == target) return true;
            if (matrix[row][col] > target) --col;
            else ++row;
        }
        return false;
    }
};`,
  160: String.raw`class Solution {
public:
    ListNode* getIntersectionNode(ListNode* headA, ListNode* headB) {
        ListNode* a = headA;
        ListNode* b = headB;
        while (a != b) {
            a = a ? a->next : headB;
            b = b ? b->next : headA;
        }
        return a;
    }
};`,
  206: String.raw`class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        ListNode* prev = nullptr;
        while (head) {
            ListNode* next = head->next;
            head->next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }
};`,
  234: String.raw`class Solution {
    ListNode* reverse(ListNode* head) {
        ListNode* prev = nullptr;
        while (head) {
            ListNode* next = head->next;
            head->next = prev;
            prev = head;
            head = next;
        }
        return prev;
    }
public:
    bool isPalindrome(ListNode* head) {
        ListNode *slow = head, *fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
        }
        ListNode* right = reverse(slow);
        for (ListNode* left = head; right; left = left->next, right = right->next)
            if (left->val != right->val) return false;
        return true;
    }
};`,
  141: String.raw`class Solution {
public:
    bool hasCycle(ListNode* head) {
        ListNode *slow = head, *fast = head;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
            if (slow == fast) return true;
        }
        return false;
    }
};`,
  142: String.raw`class Solution {
public:
    ListNode* detectCycle(ListNode* head) {
        ListNode *slow = head, *fast = head;
        do {
            if (!fast || !fast->next) return nullptr;
            slow = slow->next;
            fast = fast->next->next;
        } while (slow != fast);
        slow = head;
        while (slow != fast) {
            slow = slow->next;
            fast = fast->next;
        }
        return slow;
    }
};`,
  21: String.raw`class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        ListNode dummy;
        ListNode* tail = &dummy;
        while (list1 && list2) {
            if (list1->val < list2->val) {
                tail->next = list1;
                list1 = list1->next;
            } else {
                tail->next = list2;
                list2 = list2->next;
            }
            tail = tail->next;
        }
        tail->next = list1 ? list1 : list2;
        return dummy.next;
    }
};`,
  2: String.raw`class Solution {
public:
    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
        ListNode dummy;
        ListNode* tail = &dummy;
        int carry = 0;
        while (l1 || l2 || carry) {
            int sum = carry;
            if (l1) { sum += l1->val; l1 = l1->next; }
            if (l2) { sum += l2->val; l2 = l2->next; }
            carry = sum / 10;
            tail->next = new ListNode(sum % 10);
            tail = tail->next;
        }
        return dummy.next;
    }
};`,
  19: String.raw`class Solution {
public:
    ListNode* removeNthFromEnd(ListNode* head, int n) {
        ListNode dummy(0, head);
        ListNode *slow = &dummy, *fast = &dummy;
        while (n--) fast = fast->next;
        while (fast->next) {
            slow = slow->next;
            fast = fast->next;
        }
        slow->next = slow->next->next;
        return dummy.next;
    }
};`,
  24: String.raw`class Solution {
public:
    ListNode* swapPairs(ListNode* head) {
        ListNode dummy(0, head);
        ListNode* prev = &dummy;
        while (prev->next && prev->next->next) {
            ListNode* first = prev->next;
            ListNode* second = first->next;
            first->next = second->next;
            second->next = first;
            prev->next = second;
            prev = first;
        }
        return dummy.next;
    }
};`,
  25: String.raw`class Solution {
public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        ListNode dummy(0, head);
        ListNode* groupPrev = &dummy;
        while (true) {
            ListNode* kth = groupPrev;
            for (int i = 0; i < k && kth; ++i) kth = kth->next;
            if (!kth) break;
            ListNode* groupNext = kth->next;
            ListNode *prev = groupNext, *curr = groupPrev->next;
            while (curr != groupNext) {
                ListNode* next = curr->next;
                curr->next = prev;
                prev = curr;
                curr = next;
            }
            ListNode* oldHead = groupPrev->next;
            groupPrev->next = kth;
            groupPrev = oldHead;
        }
        return dummy.next;
    }
};`,
  138: String.raw`class Solution {
public:
    Node* copyRandomList(Node* head) {
        if (!head) return nullptr;
        unordered_map<Node*, Node*> copy;
        for (Node* p = head; p; p = p->next) copy[p] = new Node(p->val);
        for (Node* p = head; p; p = p->next) {
            copy[p]->next = copy[p->next];
            copy[p]->random = copy[p->random];
        }
        return copy[head];
    }
};`,
  148: String.raw`class Solution {
    ListNode* merge(ListNode* a, ListNode* b) {
        ListNode dummy;
        ListNode* tail = &dummy;
        while (a && b) {
            if (a->val < b->val) { tail->next = a; a = a->next; }
            else { tail->next = b; b = b->next; }
            tail = tail->next;
        }
        tail->next = a ? a : b;
        return dummy.next;
    }
public:
    ListNode* sortList(ListNode* head) {
        if (!head || !head->next) return head;
        ListNode *slow = head, *fast = head->next;
        while (fast && fast->next) {
            slow = slow->next;
            fast = fast->next->next;
        }
        ListNode* right = slow->next;
        slow->next = nullptr;
        return merge(sortList(head), sortList(right));
    }
};`,
  23: String.raw`class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };
        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> heap(cmp);
        for (ListNode* node : lists) if (node) heap.push(node);
        ListNode dummy;
        ListNode* tail = &dummy;
        while (!heap.empty()) {
            ListNode* node = heap.top();
            heap.pop();
            tail->next = node;
            tail = node;
            if (node->next) heap.push(node->next);
        }
        return dummy.next;
    }
};`,
  146: String.raw`class LRUCache {
    int capacity;
    list<pair<int, int>> order;
    unordered_map<int, list<pair<int, int>>::iterator> position;

    void touch(int key) {
        order.splice(order.begin(), order, position[key]);
    }
public:
    LRUCache(int capacity) : capacity(capacity) {}

    int get(int key) {
        if (!position.count(key)) return -1;
        touch(key);
        return position[key]->second;
    }

    void put(int key, int value) {
        if (position.count(key)) {
            position[key]->second = value;
            touch(key);
            return;
        }
        order.push_front({key, value});
        position[key] = order.begin();
        if (order.size() > capacity) {
            position.erase(order.back().first);
            order.pop_back();
        }
    }
};`,
  94: String.raw`class Solution {
public:
    vector<int> inorderTraversal(TreeNode* root) {
        vector<int> ans;
        stack<TreeNode*> nodes;
        while (root || !nodes.empty()) {
            while (root) { nodes.push(root); root = root->left; }
            root = nodes.top(); nodes.pop();
            ans.push_back(root->val);
            root = root->right;
        }
        return ans;
    }
};`,
  104: String.raw`class Solution {
public:
    int maxDepth(TreeNode* root) {
        if (!root) return 0;
        return 1 + max(maxDepth(root->left), maxDepth(root->right));
    }
};`,
  226: String.raw`class Solution {
public:
    TreeNode* invertTree(TreeNode* root) {
        if (!root) return nullptr;
        TreeNode* left = invertTree(root->left);
        TreeNode* right = invertTree(root->right);
        root->left = right;
        root->right = left;
        return root;
    }
};`,
  101: String.raw`class Solution {
    bool mirror(TreeNode* a, TreeNode* b) {
        if (!a || !b) return a == b;
        return a->val == b->val &&
               mirror(a->left, b->right) &&
               mirror(a->right, b->left);
    }
public:
    bool isSymmetric(TreeNode* root) {
        return !root || mirror(root->left, root->right);
    }
};`,
  543: String.raw`class Solution {
    int ans = 0;
    int depth(TreeNode* root) {
        if (!root) return 0;
        int left = depth(root->left);
        int right = depth(root->right);
        ans = max(ans, left + right);
        return 1 + max(left, right);
    }
public:
    int diameterOfBinaryTree(TreeNode* root) {
        depth(root);
        return ans;
    }
};`,
  102: String.raw`class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        if (!root) return {};
        queue<TreeNode*> queue{{root}};
        vector<vector<int>> ans;
        while (!queue.empty()) {
            int size = queue.size();
            vector<int> level;
            while (size--) {
                TreeNode* node = queue.front(); queue.pop();
                level.push_back(node->val);
                if (node->left) queue.push(node->left);
                if (node->right) queue.push(node->right);
            }
            ans.push_back(move(level));
        }
        return ans;
    }
};`,
  108: String.raw`class Solution {
    TreeNode* build(vector<int>& nums, int left, int right) {
        if (left >= right) return nullptr;
        int mid = left + (right - left) / 2;
        TreeNode* root = new TreeNode(nums[mid]);
        root->left = build(nums, left, mid);
        root->right = build(nums, mid + 1, right);
        return root;
    }
public:
    TreeNode* sortedArrayToBST(vector<int>& nums) {
        return build(nums, 0, nums.size());
    }
};`,
  98: String.raw`class Solution {
    bool valid(TreeNode* root, long low, long high) {
        if (!root) return true;
        if (root->val <= low || root->val >= high) return false;
        return valid(root->left, low, root->val) &&
               valid(root->right, root->val, high);
    }
public:
    bool isValidBST(TreeNode* root) {
        return valid(root, LONG_MIN, LONG_MAX);
    }
};`,
  230: String.raw`class Solution {
public:
    int kthSmallest(TreeNode* root, int k) {
        stack<TreeNode*> nodes;
        while (true) {
            while (root) { nodes.push(root); root = root->left; }
            root = nodes.top(); nodes.pop();
            if (--k == 0) return root->val;
            root = root->right;
        }
    }
};`,
  199: String.raw`class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {
        if (!root) return {};
        queue<TreeNode*> queue{{root}};
        vector<int> ans;
        while (!queue.empty()) {
            int size = queue.size();
            while (size--) {
                TreeNode* node = queue.front(); queue.pop();
                if (size == 0) ans.push_back(node->val);
                if (node->left) queue.push(node->left);
                if (node->right) queue.push(node->right);
            }
        }
        return ans;
    }
};`,
  114: String.raw`class Solution {
public:
    void flatten(TreeNode* root) {
        while (root) {
            if (root->left) {
                TreeNode* predecessor = root->left;
                while (predecessor->right) predecessor = predecessor->right;
                predecessor->right = root->right;
                root->right = root->left;
                root->left = nullptr;
            }
            root = root->right;
        }
    }
};`,
  105: String.raw`class Solution {
    unordered_map<int, int> inorderIndex;
    TreeNode* build(vector<int>& preorder, int& pre, int left, int right) {
        if (left > right) return nullptr;
        int value = preorder[pre++];
        TreeNode* root = new TreeNode(value);
        int mid = inorderIndex[value];
        root->left = build(preorder, pre, left, mid - 1);
        root->right = build(preorder, pre, mid + 1, right);
        return root;
    }
public:
    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {
        for (int i = 0; i < inorder.size(); ++i) inorderIndex[inorder[i]] = i;
        int pre = 0;
        return build(preorder, pre, 0, inorder.size() - 1);
    }
};`,
  437: String.raw`class Solution {
    unordered_map<long, int> count{{0, 1}};
    int dfs(TreeNode* root, long prefix, int target) {
        if (!root) return 0;
        prefix += root->val;
        int ans = count[prefix - target];
        ++count[prefix];
        ans += dfs(root->left, prefix, target);
        ans += dfs(root->right, prefix, target);
        --count[prefix];
        return ans;
    }
public:
    int pathSum(TreeNode* root, int targetSum) {
        return dfs(root, 0, targetSum);
    }
};`,
  236: String.raw`class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        if (!root || root == p || root == q) return root;
        TreeNode* left = lowestCommonAncestor(root->left, p, q);
        TreeNode* right = lowestCommonAncestor(root->right, p, q);
        if (left && right) return root;
        return left ? left : right;
    }
};`,
  124: String.raw`class Solution {
    int ans = INT_MIN;
    int gain(TreeNode* root) {
        if (!root) return 0;
        int left = max(0, gain(root->left));
        int right = max(0, gain(root->right));
        ans = max(ans, root->val + left + right);
        return root->val + max(left, right);
    }
public:
    int maxPathSum(TreeNode* root) {
        gain(root);
        return ans;
    }
};`,
  200: String.raw`class Solution {
    void sink(vector<vector<char>>& grid, int row, int col) {
        if (row < 0 || row >= grid.size() || col < 0 ||
            col >= grid[0].size() || grid[row][col] != '1') return;
        grid[row][col] = '0';
        sink(grid, row + 1, col);
        sink(grid, row - 1, col);
        sink(grid, row, col + 1);
        sink(grid, row, col - 1);
    }
public:
    int numIslands(vector<vector<char>>& grid) {
        int ans = 0;
        for (int i = 0; i < grid.size(); ++i)
            for (int j = 0; j < grid[0].size(); ++j)
                if (grid[i][j] == '1') { ++ans; sink(grid, i, j); }
        return ans;
    }
};`,
  994: String.raw`class Solution {
public:
    int orangesRotting(vector<vector<int>>& grid) {
        queue<pair<int, int>> queue;
        int fresh = 0, minutes = 0;
        for (int i = 0; i < grid.size(); ++i)
            for (int j = 0; j < grid[0].size(); ++j)
                if (grid[i][j] == 2) queue.push({i, j});
                else if (grid[i][j] == 1) ++fresh;
        int directions[5] = {1, 0, -1, 0, 1};
        while (fresh && !queue.empty()) {
            int size = queue.size();
            ++minutes;
            while (size--) {
                auto [row, col] = queue.front(); queue.pop();
                for (int d = 0; d < 4; ++d) {
                    int r = row + directions[d], c = col + directions[d + 1];
                    if (r < 0 || r >= grid.size() || c < 0 || c >= grid[0].size() || grid[r][c] != 1) continue;
                    grid[r][c] = 2; --fresh; queue.push({r, c});
                }
            }
        }
        return fresh ? -1 : minutes;
    }
};`,
  207: String.raw`class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        vector<vector<int>> graph(numCourses);
        vector<int> indegree(numCourses);
        for (auto& edge : prerequisites) {
            graph[edge[1]].push_back(edge[0]);
            ++indegree[edge[0]];
        }
        queue<int> queue;
        for (int i = 0; i < numCourses; ++i) if (indegree[i] == 0) queue.push(i);
        int completed = 0;
        while (!queue.empty()) {
            int course = queue.front(); queue.pop();
            ++completed;
            for (int next : graph[course])
                if (--indegree[next] == 0) queue.push(next);
        }
        return completed == numCourses;
    }
};`,
  208: String.raw`class Trie {
    struct Node {
        array<Node*, 26> child{};
        bool isWord = false;
    };
    Node* root = new Node();

    Node* find(string word) {
        Node* node = root;
        for (char c : word) {
            if (!node->child[c - 'a']) return nullptr;
            node = node->child[c - 'a'];
        }
        return node;
    }
public:
    void insert(string word) {
        Node* node = root;
        for (char c : word) {
            if (!node->child[c - 'a']) node->child[c - 'a'] = new Node();
            node = node->child[c - 'a'];
        }
        node->isWord = true;
    }

    bool search(string word) {
        Node* node = find(word);
        return node && node->isWord;
    }

    bool startsWith(string prefix) {
        return find(prefix) != nullptr;
    }
};`,
  46: String.raw`class Solution {
    vector<vector<int>> ans;
    vector<int> path;
    vector<bool> used;
    void dfs(vector<int>& nums) {
        if (path.size() == nums.size()) { ans.push_back(path); return; }
        for (int i = 0; i < nums.size(); ++i) {
            if (used[i]) continue;
            used[i] = true; path.push_back(nums[i]);
            dfs(nums);
            path.pop_back(); used[i] = false;
        }
    }
public:
    vector<vector<int>> permute(vector<int>& nums) {
        used.assign(nums.size(), false);
        dfs(nums);
        return ans;
    }
};`,
  78: String.raw`class Solution {
    vector<vector<int>> ans;
    vector<int> path;
    void dfs(vector<int>& nums, int start) {
        ans.push_back(path);
        for (int i = start; i < nums.size(); ++i) {
            path.push_back(nums[i]);
            dfs(nums, i + 1);
            path.pop_back();
        }
    }
public:
    vector<vector<int>> subsets(vector<int>& nums) {
        dfs(nums, 0);
        return ans;
    }
};`,
  17: String.raw`class Solution {
    const vector<string> letters{"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};
    vector<string> ans;
    string path;
    void dfs(string& digits, int index) {
        if (index == digits.size()) { ans.push_back(path); return; }
        for (char c : letters[digits[index] - '0']) {
            path.push_back(c);
            dfs(digits, index + 1);
            path.pop_back();
        }
    }
public:
    vector<string> letterCombinations(string digits) {
        if (digits.empty()) return {};
        dfs(digits, 0);
        return ans;
    }
};`,
  39: String.raw`class Solution {
public:
    vector<int> oneResult;
    vector<vector<int>> result;
    int sum = 0;

    void backCall(vector<int>& candidates, int target, int index){
        sum = 0;
        for(int i : oneResult){
            sum += i;
        }
        if(sum > target){
            return;
        }
        if(sum == target){
            result.push_back(oneResult);
            return;
        }
        for(int i = index; i < candidates.size(); i++){
            oneResult.push_back(candidates[i]);
            backCall(candidates, target, i);
            oneResult.pop_back();
        }
    }

    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        backCall(candidates, target, 0);
        return result;
    }
};`,
  22: String.raw`class Solution {
    vector<string> ans;
    void dfs(string& path, int left, int right, int n) {
        if (path.size() == 2 * n) { ans.push_back(path); return; }
        if (left < n) {
            path.push_back('('); dfs(path, left + 1, right, n); path.pop_back();
        }
        if (right < left) {
            path.push_back(')'); dfs(path, left, right + 1, n); path.pop_back();
        }
    }
public:
    vector<string> generateParenthesis(int n) {
        string path;
        dfs(path, 0, 0, n);
        return ans;
    }
};`,
  79: String.raw`class Solution {
    bool dfs(vector<vector<char>>& board, string& word, int row, int col, int index) {
        if (index == word.size()) return true;
        if (row < 0 || row >= board.size() || col < 0 || col >= board[0].size() || board[row][col] != word[index]) return false;
        char saved = board[row][col];
        board[row][col] = '#';
        bool found = dfs(board, word, row + 1, col, index + 1) ||
                     dfs(board, word, row - 1, col, index + 1) ||
                     dfs(board, word, row, col + 1, index + 1) ||
                     dfs(board, word, row, col - 1, index + 1);
        board[row][col] = saved;
        return found;
    }
public:
    bool exist(vector<vector<char>>& board, string word) {
        for (int i = 0; i < board.size(); ++i)
            for (int j = 0; j < board[0].size(); ++j)
                if (dfs(board, word, i, j, 0)) return true;
        return false;
    }
};`,
  131: String.raw`class Solution {
    vector<vector<string>> ans;
    vector<string> path;
    bool palindrome(string& s, int left, int right) {
        while (left < right) if (s[left++] != s[right--]) return false;
        return true;
    }
    void dfs(string& s, int start) {
        if (start == s.size()) { ans.push_back(path); return; }
        for (int end = start; end < s.size(); ++end) {
            if (!palindrome(s, start, end)) continue;
            path.push_back(s.substr(start, end - start + 1));
            dfs(s, end + 1);
            path.pop_back();
        }
    }
public:
    vector<vector<string>> partition(string s) {
        dfs(s, 0);
        return ans;
    }
};`,
  51: String.raw`class Solution {
    vector<vector<string>> ans;
    void dfs(int row, vector<string>& board, vector<bool>& col, vector<bool>& diag1, vector<bool>& diag2) {
        int n = board.size();
        if (row == n) { ans.push_back(board); return; }
        for (int c = 0; c < n; ++c) {
            if (col[c] || diag1[row - c + n] || diag2[row + c]) continue;
            col[c] = diag1[row - c + n] = diag2[row + c] = true;
            board[row][c] = 'Q';
            dfs(row + 1, board, col, diag1, diag2);
            board[row][c] = '.';
            col[c] = diag1[row - c + n] = diag2[row + c] = false;
        }
    }
public:
    vector<vector<string>> solveNQueens(int n) {
        vector<string> board(n, string(n, '.'));
        vector<bool> col(n), diag1(2 * n), diag2(2 * n);
        dfs(0, board, col, diag1, diag2);
        return ans;
    }
};`,
  35: String.raw`class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        int left = 0, right = nums.size();
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] < target) left = mid + 1;
            else right = mid;
        }
        return left;
    }
};`,
  74: String.raw`class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        int m = matrix.size(), n = matrix[0].size();
        int left = 0, right = m * n;
        while (left < right) {
            int mid = left + (right - left) / 2;
            int value = matrix[mid / n][mid % n];
            if (value < target) left = mid + 1;
            else right = mid;
        }
        return left < m * n && matrix[left / n][left % n] == target;
    }
};`,
  34: String.raw`class Solution {
    int lowerBound(vector<int>& nums, long target) {
        int left = 0, right = nums.size();
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] < target) left = mid + 1;
            else right = mid;
        }
        return left;
    }
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        int left = lowerBound(nums, target);
        if (left == nums.size() || nums[left] != target) return {-1, -1};
        return {left, lowerBound(nums, (long)target + 1) - 1};
    }
};`,
  33: String.raw`class Solution {
public:
    int search(vector<int>& nums, int target) {
        int left = 0, right = nums.size() - 1;
        while (left <= right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] == target) return mid;
            if (nums[left] <= nums[mid]) {
                if (nums[left] <= target && target < nums[mid]) right = mid - 1;
                else left = mid + 1;
            } else {
                if (nums[mid] < target && target <= nums[right]) left = mid + 1;
                else right = mid - 1;
            }
        }
        return -1;
    }
};`,
  153: String.raw`class Solution {
public:
    int findMin(vector<int>& nums) {
        int left = 0, right = nums.size() - 1;
        while (left < right) {
            int mid = left + (right - left) / 2;
            if (nums[mid] > nums[right]) left = mid + 1;
            else right = mid;
        }
        return nums[left];
    }
};`,
  4: String.raw`class Solution {
public:
    double findMedianSortedArrays(vector<int>& a, vector<int>& b) {
        if (a.size() > b.size()) return findMedianSortedArrays(b, a);
        int m = a.size(), n = b.size();
        int left = 0, right = m;
        while (left <= right) {
            int i = left + (right - left) / 2;
            int j = (m + n + 1) / 2 - i;
            int aLeft = i ? a[i - 1] : INT_MIN;
            int aRight = i < m ? a[i] : INT_MAX;
            int bLeft = j ? b[j - 1] : INT_MIN;
            int bRight = j < n ? b[j] : INT_MAX;
            if (aLeft <= bRight && bLeft <= aRight) {
                if ((m + n) % 2) return max(aLeft, bLeft);
                return (max(aLeft, bLeft) + min(aRight, bRight)) / 2.0;
            }
            if (aLeft > bRight) right = i - 1;
            else left = i + 1;
        }
        return 0;
    }
};`,
  20: String.raw`class Solution {
public:
    bool isValid(string s) {
        unordered_map<char, char> match{{')', '('}, {']', '['}, {'}', '{'}};
        stack<char> opened;
        for (char c : s) {
            if (!match.count(c)) opened.push(c);
            else {
                if (opened.empty() || opened.top() != match[c]) return false;
                opened.pop();
            }
        }
        return opened.empty();
    }
};`,
  155: String.raw`class MinStack {
    stack<pair<int, int>> values;
public:
    void push(int val) {
        int minimum = values.empty() ? val : min(val, values.top().second);
        values.push({val, minimum});
    }
    void pop() { values.pop(); }
    int top() { return values.top().first; }
    int getMin() { return values.top().second; }
};`,
  394: String.raw`class Solution {
public:
    string decodeString(string s) {
        stack<int> counts;
        stack<string> prefixes;
        string current;
        int number = 0;
        for (char c : s) {
            if (isdigit(c)) number = number * 10 + c - '0';
            else if (c == '[') {
                counts.push(number); prefixes.push(current);
                number = 0; current.clear();
            } else if (c == ']') {
                string repeated;
                for (int k = counts.top(); k > 0; --k) repeated += current;
                counts.pop(); current = prefixes.top() + repeated; prefixes.pop();
            } else current += c;
        }
        return current;
    }
};`,
  739: String.raw`class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        vector<int> ans(temperatures.size());
        stack<int> decreasing;
        for (int i = 0; i < temperatures.size(); ++i) {
            while (!decreasing.empty() && temperatures[i] > temperatures[decreasing.top()]) {
                int day = decreasing.top(); decreasing.pop();
                ans[day] = i - day;
            }
            decreasing.push(i);
        }
        return ans;
    }
};`,
  84: String.raw`class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        heights.insert(heights.begin(), 0);
        heights.push_back(0);
        stack<int> increasing;
        int ans = 0;
        for (int i = 0; i < heights.size(); ++i) {
            while (!increasing.empty() && heights[increasing.top()] > heights[i]) {
                int height = heights[increasing.top()]; increasing.pop();
                int width = i - increasing.top() - 1;
                ans = max(ans, height * width);
            }
            increasing.push(i);
        }
        return ans;
    }
};`,
  215: String.raw`class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        priority_queue<int, vector<int>, greater<int>> heap;
        for (int x : nums) {
            heap.push(x);
            if (heap.size() > k) heap.pop();
        }
        return heap.top();
    }
};`,
  347: String.raw`class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        unordered_map<int, int> frequency;
        for (int x : nums) ++frequency[x];
        using Entry = pair<int, int>;
        priority_queue<Entry, vector<Entry>, greater<Entry>> heap;
        for (auto [value, count] : frequency) {
            heap.push({count, value});
            if (heap.size() > k) heap.pop();
        }
        vector<int> ans;
        while (!heap.empty()) { ans.push_back(heap.top().second); heap.pop(); }
        return ans;
    }
};`,
  295: String.raw`class MedianFinder {
    priority_queue<int> lower;
    priority_queue<int, vector<int>, greater<int>> upper;
public:
    void addNum(int num) {
        lower.push(num);
        upper.push(lower.top()); lower.pop();
        if (upper.size() > lower.size()) {
            lower.push(upper.top()); upper.pop();
        }
    }
    double findMedian() {
        if (lower.size() > upper.size()) return lower.top();
        return (lower.top() + upper.top()) / 2.0;
    }
};`,
  121: String.raw`class Solution {
public:
    int maxProfit(vector<int>& prices) {
        int minimum = prices[0], ans = 0;
        for (int price : prices) {
            ans = max(ans, price - minimum);
            minimum = min(minimum, price);
        }
        return ans;
    }
};`,
  55: String.raw`class Solution {
public:
    bool canJump(vector<int>& nums) {
        int farthest = 0;
        for (int i = 0; i < nums.size() && i <= farthest; ++i) {
            farthest = max(farthest, i + nums[i]);
            if (farthest >= nums.size() - 1) return true;
        }
        return nums.size() == 1;
    }
};`,
  45: String.raw`class Solution {
public:
    int jump(vector<int>& nums) {
        int jumps = 0, currentEnd = 0, farthest = 0;
        for (int i = 0; i + 1 < nums.size(); ++i) {
            farthest = max(farthest, i + nums[i]);
            if (i == currentEnd) {
                ++jumps;
                currentEnd = farthest;
            }
        }
        return jumps;
    }
};`,
  763: String.raw`class Solution {
public:
    vector<int> partitionLabels(string s) {
        array<int, 26> last{};
        for (int i = 0; i < s.size(); ++i) last[s[i] - 'a'] = i;
        vector<int> ans;
        int start = 0, end = 0;
        for (int i = 0; i < s.size(); ++i) {
            end = max(end, last[s[i] - 'a']);
            if (i == end) {
                ans.push_back(end - start + 1);
                start = i + 1;
            }
        }
        return ans;
    }
};`,
  70: String.raw`class Solution {
public:
    int climbStairs(int n) {
        int previous = 1, current = 1;
        for (int step = 2; step <= n; ++step) {
            int next = previous + current;
            previous = current;
            current = next;
        }
        return current;
    }
};`,
  118: String.raw`class Solution {
public:
    vector<vector<int>> generate(int numRows) {
        vector<vector<int>> triangle(numRows);
        for (int row = 0; row < numRows; ++row) {
            triangle[row].assign(row + 1, 1);
            for (int col = 1; col < row; ++col)
                triangle[row][col] = triangle[row - 1][col - 1] + triangle[row - 1][col];
        }
        return triangle;
    }
};`,
  198: String.raw`class Solution {
public:
    int rob(vector<int>& nums) {
        int twoBack = 0, oneBack = 0;
        for (int money : nums) {
            int current = max(oneBack, twoBack + money);
            twoBack = oneBack;
            oneBack = current;
        }
        return oneBack;
    }
};`,
  279: String.raw`class Solution {
public:
    int numSquares(int n) {
        vector<int> dp(n + 1, INT_MAX);
        dp[0] = 0;
        for (int value = 1; value <= n; ++value)
            for (int root = 1; root * root <= value; ++root)
                dp[value] = min(dp[value], dp[value - root * root] + 1);
        return dp[n];
    }
};`,
  322: String.raw`class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        vector<int> dp(amount + 1, amount + 1);
        dp[0] = 0;
        for (int value = 1; value <= amount; ++value)
            for (int coin : coins)
                if (coin <= value) dp[value] = min(dp[value], dp[value - coin] + 1);
        return dp[amount] > amount ? -1 : dp[amount];
    }
};`,
  139: String.raw`class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        unordered_set<string> dictionary(wordDict.begin(), wordDict.end());
        vector<bool> dp(s.size() + 1);
        dp[0] = true;
        for (int end = 1; end <= s.size(); ++end)
            for (int start = 0; start < end; ++start)
                if (dp[start] && dictionary.count(s.substr(start, end - start))) {
                    dp[end] = true;
                    break;
                }
        return dp[s.size()];
    }
};`,
  300: String.raw`class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        vector<int> tails;
        for (int x : nums) {
            auto position = lower_bound(tails.begin(), tails.end(), x);
            if (position == tails.end()) tails.push_back(x);
            else *position = x;
        }
        return tails.size();
    }
};`,
  152: String.raw`class Solution {
public:
    int maxProduct(vector<int>& nums) {
        int maximum = nums[0], minimum = nums[0], ans = nums[0];
        for (int i = 1; i < nums.size(); ++i) {
            if (nums[i] < 0) swap(maximum, minimum);
            maximum = max(nums[i], maximum * nums[i]);
            minimum = min(nums[i], minimum * nums[i]);
            ans = max(ans, maximum);
        }
        return ans;
    }
};`,
  416: String.raw`class Solution {
public:
    bool canPartition(vector<int>& nums) {
        int sum = accumulate(nums.begin(), nums.end(), 0);
        if (sum % 2) return false;
        int target = sum / 2;
        vector<bool> dp(target + 1);
        dp[0] = true;
        for (int x : nums)
            for (int value = target; value >= x; --value)
                dp[value] = dp[value] || dp[value - x];
        return dp[target];
    }
};`,
  32: String.raw`class Solution {
public:
    int longestValidParentheses(string s) {
        vector<int> dp(s.size());
        int ans = 0;
        for (int i = 1; i < s.size(); ++i) {
            if (s[i] != ')') continue;
            if (s[i - 1] == '(') dp[i] = 2 + (i >= 2 ? dp[i - 2] : 0);
            else {
                int left = i - dp[i - 1] - 1;
                if (left >= 0 && s[left] == '(')
                    dp[i] = dp[i - 1] + 2 + (left ? dp[left - 1] : 0);
            }
            ans = max(ans, dp[i]);
        }
        return ans;
    }
};`,
  62: String.raw`class Solution {
public:
    int uniquePaths(int m, int n) {
        vector<int> dp(n, 1);
        for (int row = 1; row < m; ++row)
            for (int col = 1; col < n; ++col)
                dp[col] += dp[col - 1];
        return dp[n - 1];
    }
};`,
  64: String.raw`class Solution {
public:
    int minPathSum(vector<vector<int>>& grid) {
        int m = grid.size(), n = grid[0].size();
        vector<int> dp(n, INT_MAX);
        dp[0] = 0;
        for (int row = 0; row < m; ++row)
            for (int col = 0; col < n; ++col) {
                int fromLeft = col ? dp[col - 1] : INT_MAX;
                dp[col] = grid[row][col] + min(dp[col], fromLeft);
            }
        return dp[n - 1];
    }
};`,
  5: String.raw`class Solution {
public:
    string longestPalindrome(string s) {
        int bestLeft = 0, bestLen = 1;
        auto expand = [&](int left, int right) {
            while (left >= 0 && right < s.size() && s[left] == s[right]) {
                if (right - left + 1 > bestLen) {
                    bestLeft = left;
                    bestLen = right - left + 1;
                }
                --left; ++right;
            }
        };
        for (int center = 0; center < s.size(); ++center) {
            expand(center, center);
            expand(center, center + 1);
        }
        return s.substr(bestLeft, bestLen);
    }
};`,
  1143: String.raw`class Solution {
public:
    int longestCommonSubsequence(string text1, string text2) {
        vector<vector<int>> dp(text1.size() + 1, vector<int>(text2.size() + 1));
        for (int i = 1; i <= text1.size(); ++i)
            for (int j = 1; j <= text2.size(); ++j)
                if (text1[i - 1] == text2[j - 1]) dp[i][j] = dp[i - 1][j - 1] + 1;
                else dp[i][j] = max(dp[i - 1][j], dp[i][j - 1]);
        return dp[text1.size()][text2.size()];
    }
};`,
  72: String.raw`class Solution {
public:
    int minDistance(string word1, string word2) {
        int m = word1.size(), n = word2.size();
        vector<vector<int>> dp(m + 1, vector<int>(n + 1));
        for (int i = 0; i <= m; ++i) dp[i][0] = i;
        for (int j = 0; j <= n; ++j) dp[0][j] = j;
        for (int i = 1; i <= m; ++i)
            for (int j = 1; j <= n; ++j)
                if (word1[i - 1] == word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];
                else dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});
        return dp[m][n];
    }
};`,
  136: String.raw`class Solution {
public:
    int singleNumber(vector<int>& nums) {
        int ans = 0;
        for (int x : nums) ans ^= x;
        return ans;
    }
};`,
  169: String.raw`class Solution {
public:
    int majorityElement(vector<int>& nums) {
        int candidate = 0, votes = 0;
        for (int x : nums) {
            if (votes == 0) candidate = x;
            votes += x == candidate ? 1 : -1;
        }
        return candidate;
    }
};`,
  75: String.raw`class Solution {
public:
    void sortColors(vector<int>& nums) {
        int zero = 0, current = 0, two = nums.size() - 1;
        while (current <= two) {
            if (nums[current] == 0) swap(nums[zero++], nums[current++]);
            else if (nums[current] == 2) swap(nums[current], nums[two--]);
            else ++current;
        }
    }
};`,
  31: String.raw`class Solution {
public:
    void nextPermutation(vector<int>& nums) {
        int pivot = nums.size() - 2;
        while (pivot >= 0 && nums[pivot] >= nums[pivot + 1]) --pivot;
        if (pivot >= 0) {
            int successor = nums.size() - 1;
            while (nums[successor] <= nums[pivot]) --successor;
            swap(nums[pivot], nums[successor]);
        }
        reverse(nums.begin() + pivot + 1, nums.end());
    }
};`,
  287: String.raw`class Solution {
public:
    int findDuplicate(vector<int>& nums) {
        int slow = nums[0], fast = nums[0];
        do {
            slow = nums[slow];
            fast = nums[nums[fast]];
        } while (slow != fast);
        slow = nums[0];
        while (slow != fast) {
            slow = nums[slow];
            fast = nums[fast];
        }
        return slow;
    }
};`,
}
