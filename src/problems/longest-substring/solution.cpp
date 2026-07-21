class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        unordered_map<char, int> lastSeen;
        int left = 0;
        int best = 0;

        for (int right = 0; right < s.size(); ++right) {
            char current = s[right];

            if (lastSeen.count(current) && lastSeen[current] >= left) {
                left = lastSeen[current] + 1;
            }

            lastSeen[current] = right;
            int windowLength = right - left + 1;
            best = max(best, windowLength);
        }

        return best;
    }
};
