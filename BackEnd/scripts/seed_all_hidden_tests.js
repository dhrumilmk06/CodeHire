import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const CLERK_ID = "user_3941rvrVxAajsRtU3iKBpHQK0gB"; // Default owner

const problemsData = [
    {
        title: "Two Sum",
        id: "two-sum",
        difficulty: "Easy",
        category: "Array • Hash Table",
        description: { text: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target." },
        hiddenTestCases: [
            { id: 1, description: "Basic case", inputCode: { javascript: "console.log(JSON.stringify(twoSum([2,7,11,15], 9)))", python: "import json; print(json.dumps(twoSum([2,7,11,15], 9), separators=(',', ':')))", java: "class Main { public static void main(String[] x) { System.out.println(java.util.Arrays.toString(Solution.twoSum(new int[]{2,7,11,15}, 9))); } }", cpp: "int main() { Solution sol; vector<int> v={2,7,11,15}; vector<int> res=sol.twoSum(v, 9); cout << '['; for(int i=0; i<res.size(); i++) cout << res[i] << (i==res.size()-1 ? \"\" : \",\"); cout << ']' << endl; return 0; }" }, expectedOutput: "[0,1]" },
            { id: 2, description: "Duplicate numbers", inputCode: { javascript: "console.log(JSON.stringify(twoSum([3,3], 6)))", python: "import json; print(json.dumps(twoSum([3,3], 6), separators=(',', ':')))", java: "class Main { public static void main(String[] x) { System.out.println(java.util.Arrays.toString(Solution.twoSum(new int[]{3,3}, 6))); } }", cpp: "int main() { Solution sol; vector<int> v={3,3}; vector<int> res=sol.twoSum(v, 6); cout << '['; for(int i=0; i<res.size(); i++) cout << res[i] << (i==res.size()-1 ? \"\" : \",\"); cout << ']' << endl; return 0; }" }, expectedOutput: "[0,1]" }
        ],
        starterCode: {
            javascript: "function twoSum(nums, target) {\n    // Implementation here\n}",
            python: "def twoSum(nums, target):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        return new int[0];\n    }\n}",
            cpp: "#include <iostream>\n#include <vector>\n#include <unordered_map>\n#include <string>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        return {};\n    }\n};"
        }
    },
    {
        title: "Reverse String",
        id: "reverse-string",
        difficulty: "Easy",
        category: "String • Two Pointers",
        description: { text: "Write a function that reverses a string." },
        hiddenTestCases: [
            { id: 1, description: "Hello", inputCode: { javascript: "let s=['h','e','l','l','o']; reverseString(s); console.log(JSON.stringify(s))", python: "import json; s=['h','e','l','l','o']; reverseString(s); print(json.dumps(s, separators=(',', ':')))", java: "class Main { public static void main(String[] x) { char[] s={'h','e','l','l','o'}; Solution.reverseString(s); StringBuilder sb = new StringBuilder(\"[\"); for(int i=0; i<s.length; i++){ sb.append(\"\\\"\").append(s[i]).append(\"\\\"\").append(i==s.length-1?\"\":\",\"); } sb.append(\"]\"); System.out.println(sb.toString()); } }", cpp: "int main() { Solution sol; vector<char> s={'h','e','l','l','o'}; sol.reverseString(s); cout << '['; for(int i=0; i<s.size(); i++) { cout << '\"' << s[i] << '\"' << (i==s.size()-1 ? \"\" : \",\"); } cout << ']' << endl; return 0; }" }, expectedOutput: '["o","l","l","e","h"]' }
        ],
        starterCode: {
            javascript: "function reverseString(s) {\n    // Implementation here\n}",
            python: "def reverseString(s):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static void reverseString(char[] s) {\n    }\n}",
            cpp: "#include <iostream>\n#include <vector>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    void reverseString(vector<char>& s) {\n    }\n};"
        }
    },
    {
        title: "Valid Palindrome",
        id: "valid-palindrome",
        difficulty: "Easy",
        category: "String • Two Pointers",
        description: { text: "Return true if it is a palindrome, or false otherwise." },
        hiddenTestCases: [
            { id: 1, description: "Palindrome", inputCode: { javascript: 'console.log(isPalindrome("A man, a plan, a canal: Panama"))', python: 'print(str(isPalindrome("A man, a plan, a canal: Panama")).lower())', java: 'class Hidden { public static void main(String[] x) { System.out.println(Solution.isPalindrome("A man, a plan, a canal: Panama")); } }', cpp: "int main() { Solution sol; cout << (sol.isPalindrome(\"A man, a plan, a canal: Panama\") ? \"true\" : \"false\") << endl; return 0; }" }, expectedOutput: "true" }
        ],
        starterCode: {
            javascript: "function isPalindrome(s) {\n    // Implementation here\n}",
            python: "def isPalindrome(s):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static boolean isPalindrome(String s) {\n        return false;\n    }\n}",
            cpp: "#include <iostream>\n#include <string>\n#include <cctype>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isPalindrome(string s) {\n        return false;\n    }\n};"
        }
    },
    {
        title: "Maximum Subarray",
        id: "maximum-subarray",
        difficulty: "Medium",
        category: "Array • Dynamic Programming",
        description: { text: "Find the subarray with the largest sum." },
        hiddenTestCases: [
            { id: 1, description: "Standard", inputCode: { javascript: "console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))", python: "print(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})); } }", cpp: "int main() { Solution sol; vector<int> n = {-2,1,-3,4,-1,2,1,-5,4}; cout << sol.maxSubArray(n) << endl; return 0; }" }, expectedOutput: "6" }
        ],
        starterCode: {
            javascript: "function maxSubArray(nums) {\n    // Implementation here\n}",
            python: "def maxSubArray(nums):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static int maxSubArray(int[] nums) {\n        return 0;\n    }\n}",
            cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        return 0;\n    }\n};"
        }
    },
    {
        title: "Container With Most Water",
        id: "container-with-most-water",
        difficulty: "Medium",
        category: "Array • Two Pointers",
        description: { text: "Return the maximum amount of water a container can store." },
        hiddenTestCases: [
            { id: 1, description: "Standard", inputCode: { javascript: "console.log(maxArea([1,8,6,2,5,4,8,3,7]))", python: "print(maxArea([1,8,6,2,5,4,8,3,7]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.maxArea(new int[]{1,8,6,2,5,4,8,3,7})); } }", cpp: "int main() { Solution sol; vector<int> h = {1,8,6,2,5,4,8,3,7}; cout << sol.maxArea(h) << endl; return 0; }" }, expectedOutput: "49" }
        ],
        starterCode: {
            javascript: "function maxArea(height) {\n    // Implementation here\n}",
            python: "def maxArea(height):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static int maxArea(int[] height) {\n        return 0;\n    }\n}",
            cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        return 0;\n    }\n};"
        }
    },
    {
        title: "3Sum",
        id: "3sum",
        difficulty: "Medium",
        category: "Array • Two Pointers",
        description: { text: "Return all the triplets that sum to zero." },
        hiddenTestCases: [
            { id: 1, description: "Standard", inputCode: { javascript: "console.log(JSON.stringify(threeSum([-1,0,1,2,-1,-4])))", python: "print(threeSum([-1,0,1,2,-1,-4]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.threeSum(new int[]{-1,0,1,2,-1,-4})); } }", cpp: "int main() { Solution sol; vector<int> n = {-1,0,1,2,-1,-4}; vector<vector<int>> res = sol.threeSum(n); cout << '['; for(int i=0; i<res.size(); i++) { cout << '['; for(int j=0; j<res[i].size(); j++) cout << res[i][j] << (j==res[i].size()-1 ? \"\" : \",\"); cout << ']' << (i==res.size()-1 ? \"\" : \",\"); } cout << ']' << endl; return 0; }" }, expectedOutput: "[[-1,-1,2],[-1,0,1]]" }
        ],
        starterCode: {
            javascript: "function threeSum(nums) {\n    // Implementation here\n}",
            python: "def threeSum(nums):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static List<List<Integer>> threeSum(int[] nums) {\n        return new ArrayList<>();\n    }\n}",
            cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        return {};\n    }\n};"
        }
    },
    {
        title: "Trapping Rain Water",
        id: "trapping-rain-water",
        difficulty: "Hard",
        category: "Array • Two Pointers • Dynamic Programming",
        description: { text: "Compute how much water it can trap after raining." },
        hiddenTestCases: [
            { id: 1, description: "Standard", inputCode: { javascript: "console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1]))", python: "print(trap([0,1,0,2,1,0,1,3,2,1,2,1]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.trap(new int[]{0,1,0,2,1,0,1,3,2,1,2,1})); } }", cpp: "int main() { Solution sol; vector<int> h = {0,1,0,2,1,0,1,3,2,1,2,1}; cout << sol.trap(h) << endl; return 0; }" }, expectedOutput: "6" }
        ],
        starterCode: {
            javascript: "function trap(height) {\n    // Implementation here\n}",
            python: "def trap(height):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static int trap(int[] height) {\n        return 0;\n    }\n}",
            cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    int trap(vector<int>& height) {\n        return 0;\n    }\n};"
        }
    },
    {
        title: "Merge Intervals",
        id: "merge-intervals",
        difficulty: "Medium",
        category: "Array • Sorting",
        description: { text: "Merge all overlapping intervals." },
        hiddenTestCases: [
            { id: 1, description: "Standard", inputCode: { javascript: "console.log(JSON.stringify(merge([[1,3],[2,6],[8,10],[15,18]])))", python: "print(merge([[1,3],[2,6],[8,10],[15,18]]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Arrays.deepToString(Solution.merge(new int[][]{{1,3},{2,6},{8,10},{15,18}}))); } }", cpp: "int main() { Solution sol; vector<vector<int>> i = {{1,3},{2,6},{8,10},{15,18}}; vector<vector<int>> res = sol.merge(i); cout << '['; for(int i=0; i<res.size(); i++) { cout << '['; for(int j=0; j<res[i].size(); j++) cout << res[i][j] << (j==res[i].size()-1 ? \"\" : \",\"); cout << ']' << (i==res.size()-1 ? \"\" : \",\"); } cout << ']' << endl; return 0; }" }, expectedOutput: "[[1,6],[8,10],[15,18]]" }
        ],
        starterCode: {
            javascript: "function merge(intervals) {\n    // Implementation here\n}",
            python: "def merge(intervals):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static int[][] merge(int[][] intervals) {\n        return new int[0][0];\n    }\n}",
            cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        return {};\n    }\n};"
        }
    },
    {
        title: "Median of Two Sorted Arrays",
        id: "median-of-two-sorted-arrays",
        difficulty: "Hard",
        category: "Array • Binary Search",
        description: { text: "Return the median of the two sorted arrays." },
        hiddenTestCases: [
            { id: 1, description: "Standard", inputCode: { javascript: "console.log(findMedianSortedArrays([1,3], [2]))", python: "print(findMedianSortedArrays([1,3], [2]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.findMedianSortedArrays(new int[]{1,3}, new int[]{2})); } }", cpp: "int main() { Solution sol; vector<int> n1={1,3}, n2={2}; cout << sol.findMedianSortedArrays(n1, n2) << endl; return 0; }" }, expectedOutput: "2" }
        ],
        starterCode: {
            javascript: "function findMedianSortedArrays(nums1, nums2) {\n    // Implementation here\n}",
            python: "def findMedianSortedArrays(nums1, nums2):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        return 0.0;\n    }\n}",
            cpp: "#include <iostream>\n#include <vector>\n#include <iomanip>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        return 0.0;\n    }\n};"
        }
    },
    {
        title: "Longest Substring Without Repeating Characters",
        id: "longest-substring-without-repeating-characters",
        difficulty: "Medium",
        category: "String • Sliding Window",
        description: { text: "Find the length of the longest substring without repeating characters." },
        hiddenTestCases: [
            { id: 1, description: "Standard", inputCode: { javascript: 'console.log(lengthOfLongestSubstring("abcabcbb"))', python: 'print(lengthOfLongestSubstring("abcabcbb"))', java: 'class Hidden { public static void main(String[] x) { System.out.println(Solution.lengthOfLongestSubstring("abcabcbb")); } }', cpp: "int main() { Solution sol; cout << sol.lengthOfLongestSubstring(\"abcabcbb\") << endl; return 0; }" }, expectedOutput: "3" }
        ],
        starterCode: {
            javascript: "function lengthOfLongestSubstring(s) {\n    // Implementation here\n}",
            python: "def lengthOfLongestSubstring(s):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}",
            cpp: "#include <iostream>\n#include <string>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        return 0;\n    }\n};"
        }
    },
    {
        title: "First Missing Positive",
        id: "first-missing-positive",
        difficulty: "Hard",
        category: "Array • Hash Table",
        description: { text: "Return the smallest missing positive integer." },
        hiddenTestCases: [
            { id: 1, description: "Standard", inputCode: { javascript: "console.log(firstMissingPositive([1,2,0]))", python: "print(firstMissingPositive([1,2,0]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.firstMissingPositive(new int[]{1,2,0})); } }", cpp: "int main() { Solution sol; vector<int> n={1,2,0}; cout << sol.firstMissingPositive(n) << endl; return 0; }" }, expectedOutput: "3" }
        ],
        starterCode: {
            javascript: "function firstMissingPositive(nums) {\n    // Implementation here\n}",
            python: "def firstMissingPositive(nums):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static int firstMissingPositive(int[] nums) {\n        return 0;\n    }\n}",
            cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    int firstMissingPositive(vector<int>& nums) {\n        return 0;\n    }\n};"
        }
    },
    {
        title: "Search in Rotated Sorted Array",
        id: "search-in-rotated-sorted-array",
        difficulty: "Medium",
        category: "Array • Binary Search",
        description: { text: "Return the index of target in a rotated sorted array." },
        hiddenTestCases: [
            { id: 1, description: "Standard", inputCode: { javascript: "console.log(search([4,5,6,7,0,1,2], 0))", python: "print(search([4,5,6,7,0,1,2], 0))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.search(new int[]{4,5,6,7,0,1,2}, 0)); } }", cpp: "int main() { Solution sol; vector<int> n={4,5,6,7,0,1,2}; cout << sol.search(n, 0) << endl; return 0; }" }, expectedOutput: "4" }
        ],
        starterCode: {
            javascript: "function search(nums, target) {\n    // Implementation here\n}",
            python: "def search(nums, target):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static int search(int[] nums, int target) {\n        return -1;\n    }\n}",
            cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        return -1;\n    }\n};"
        }
    },
    {
        title: "Word Search",
        id: "word-search",
        difficulty: "Medium",
        category: "Array • Backtracking • Matrix",
        description: { text: "Given an m x n grid of characters board and a string word, return true if word exists in the grid." },
        hiddenTestCases: [
            { id: 1, description: "Standard", inputCode: { javascript: 'console.log(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"))', python: 'print(str(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED")).lower())', java: 'class Hidden { public static void main(String[] x) { System.out.println(Solution.exist(new char[][]{{\'A\',\'B\',\'C\',\'E\'},{\'S\',\'F\',\'C\',\'S\'},{\'A\',\'D\',\'E\',\'E\'}}, "ABCCED")); } }', cpp: "int main() { Solution sol; vector<vector<char>> b = {{'A','B','C','E'},{'S','F','C','S'},{'A','D','E','E'}}; cout << (sol.exist(b, \"ABCCED\") ? \"true\" : \"false\") << endl; return 0; }" }, expectedOutput: "true" }
        ],
        starterCode: {
            javascript: "function exist(board, word) {\n    // Implementation here\n}",
            python: "def exist(board, word):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static boolean exist(char[][] board, String word) {\n        return false;\n    }\n}",
            cpp: "#include <iostream>\n#include <vector>\n#include <string>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    bool exist(vector<vector<char>>& board, string word) {\n        return false;\n    }\n};"
        }
    },
    {
        title: "Valid Anagram",
        id: "valid-anagram",
        difficulty: "Easy",
        category: "String • Hash Table",
        description: { text: "Given two strings s and t, return true if t is an anagram of s, and false otherwise." },
        hiddenTestCases: [
            { id: 1, description: "Standard", inputCode: { javascript: 'console.log(isAnagram("anagram", "nagaram"))', python: 'print(str(isAnagram("anagram", "nagaram")).lower())', java: 'class Hidden { public static void main(String[] x) { System.out.println(Solution.isAnagram("anagram", "nagaram")); } }', cpp: "int main() { Solution sol; cout << (sol.isAnagram(\"anagram\", \"nagaram\") ? \"true\" : \"false\") << endl; return 0; }" }, expectedOutput: "true" }
        ],
        starterCode: {
            javascript: "function isAnagram(s, t) {\n    // Implementation here\n}",
            python: "def isAnagram(s, t):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static boolean isAnagram(String s, String t) {\n        return false;\n    }\n}",
            cpp: "#include <iostream>\n#include <string>\n#include <algorithm>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        return false;\n    }\n};"
        }
    },
    {
        title: "Best Time to Buy and Sell Stock",
        id: "best-time-to-buy-and-sell-stock",
        difficulty: "Easy",
        category: "Array • Dynamic Programming",
        description: { text: "Maximize your profit from a single buy and sell." },
        hiddenTestCases: [
            { id: 1, description: "Standard", inputCode: { javascript: "console.log(maxProfit([7,1,5,3,6,4]))", python: "print(maxProfit([7,1,5,3,6,4]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.maxProfit(new int[]{7,1,5,3,6,4})); } }", cpp: "int main() { Solution sol; vector<int> p={7,1,5,3,6,4}; cout << sol.maxProfit(p) << endl; return 0; }" }, expectedOutput: "5" }
        ],
        starterCode: {
            javascript: "function maxProfit(prices) {\n    // Implementation here\n}",
            python: "def maxProfit(prices):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static int maxProfit(int[] prices) {\n        return 0;\n    }\n}",
            cpp: "#include <iostream>\n#include <vector>\n#include <algorithm>\n\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        return 0;\n    }\n};"
        }
    }
];

const seedAllHiddenTests = async () => {
    try {
        console.log("Connecting to Database...");
        for (const problemData of problemsData) {
            await prisma.customProblem.upsert({
                where: { id: problemData.id },
                update: {
                    title: problemData.title,
                    hiddenTestCases: problemData.hiddenTestCases,
                    id: problemData.id,
                    difficulty: problemData.difficulty,
                    category: problemData.category,
                    description: problemData.description,
                    starterCode: problemData.starterCode,
                    ownerClerkId: CLERK_ID,
                    examples: [],
                    constraints: []
                },
                create: {
                    title: problemData.title,
                    id: problemData.id,
                    difficulty: problemData.difficulty,
                    category: problemData.category,
                    description: problemData.description,
                    starterCode: problemData.starterCode,
                    hiddenTestCases: problemData.hiddenTestCases,
                    ownerClerkId: CLERK_ID,
                    examples: [],
                    constraints: []
                }
            });
            console.log("Synced problem:", problemData.title);
        }
        console.log("Seeding complete.");
        await prisma.$disconnect();
    } catch (err) {
        console.error("Error seeding:", err);
        await prisma.$disconnect();
    }
};

seedAllHiddenTests();
