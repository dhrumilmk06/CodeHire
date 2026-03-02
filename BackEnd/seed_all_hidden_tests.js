import mongoose from 'mongoose';
import dotenv from 'dotenv';
import CustomProblem from './src/models/CustomProblem.js';

dotenv.config();

const CLERK_ID = "user_3941rvrVxAajsRtU3iKBpHQK0gB"; // Default owner

const problemsData = [
    {
        title: "Two Sum",
        id: "two-sum",
        difficulty: "Easy",
        category: "Array • Hash Table",
        description: { text: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target." },
        hiddenTestCases: [
            { id: 1, description: "Basic case", inputCode: { javascript: "console.log(JSON.stringify(twoSum([2,7,11,15], 9)))", python: "import json; print(json.dumps(twoSum([2,7,11,15], 9), separators=(',', ':')))", java: "class Main { public static void main(String[] x) { System.out.println(java.util.Arrays.toString(Solution.twoSum(new int[]{2,7,11,15}, 9))); } }" }, expectedOutput: "[0,1]" },
            { id: 2, description: "Duplicate numbers", inputCode: { javascript: "console.log(JSON.stringify(twoSum([3,3], 6)))", python: "import json; print(json.dumps(twoSum([3,3], 6), separators=(',', ':')))", java: "class Main { public static void main(String[] x) { System.out.println(java.util.Arrays.toString(Solution.twoSum(new int[]{3,3}, 6))); } }" }, expectedOutput: "[0,1]" },
            { id: 3, description: "Target at indices 2 and 3", inputCode: { javascript: "console.log(JSON.stringify(twoSum([1, 5, 10, 20], 30)))", python: "import json; print(json.dumps(twoSum([1, 5, 10, 20], 30), separators=(',', ':')))", java: "class Main { public static void main(String[] x) { System.out.println(java.util.Arrays.toString(Solution.twoSum(new int[]{1, 5, 10, 20}, 30))); } }" }, expectedOutput: "[2,3]" },
            { id: 4, description: "Large array", inputCode: { javascript: "console.log(JSON.stringify(twoSum([1,2,3,4,5,6,7,8,9,10], 19)))", python: "import json; print(json.dumps(twoSum([1,2,3,4,5,6,7,8,9,10], 19), separators=(',', ':')))", java: "class Main { public static void main(String[] x) { System.out.println(java.util.Arrays.toString(Solution.twoSum(new int[]{1,2,3,4,5,6,7,8,9,10}, 19))); } }" }, expectedOutput: "[8,9]" },
            { id: 5, description: "Only two elements", inputCode: { javascript: "console.log(JSON.stringify(twoSum([1,2], 3)))", python: "import json; print(json.dumps(twoSum([1,2], 3), separators=(',', ':')))", java: "class Main { public static void main(String[] x) { System.out.println(java.util.Arrays.toString(Solution.twoSum(new int[]{1,2}, 3))); } }" }, expectedOutput: "[0,1]" }
        ],
        starterCode: {
            javascript: "function twoSum(nums, target) {\n    // Implementation here\n}",
            python: "def twoSum(nums, target):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static int[] twoSum(int[] nums, int target) {\n        return new int[0];\n    }\n}"
        }
    },
    {
        title: "Reverse String",
        id: "reverse-string",
        difficulty: "Easy",
        category: "String • Two Pointers",
        description: { text: "Write a function that reverses a string. The input string is given as an array of characters s." },
        hiddenTestCases: [
            { id: 1, description: "Hello", inputCode: { javascript: "let s=['h','e','l','l','o']; reverseString(s); console.log(JSON.stringify(s))", python: "import json; s=['h','e','l','l','o']; reverseString(s); print(json.dumps(s, separators=(',', ':')))", java: "class Main { public static void main(String[] x) { char[] s={'h','e','l','l','o'}; Solution.reverseString(s); StringBuilder sb = new StringBuilder(\"[\"); for(int i=0; i<s.length; i++){ sb.append(\"\\\"\").append(s[i]).append(\"\\\"\").append(i==s.length-1?\"\":\",\"); } sb.append(\"]\"); System.out.println(sb.toString()); } }" }, expectedOutput: '["o","l","l","e","h"]' },
            { id: 2, description: "Hannah", inputCode: { javascript: "let s=['H','a','n','n','a','h']; reverseString(s); console.log(JSON.stringify(s))", python: "import json; s=['H','a','n','n','a','h']; reverseString(s); print(json.dumps(s, separators=(',', ':')))", java: "class Main { public static void main(String[] x) { char[] s={'H','a','n','n','a','h'}; Solution.reverseString(s); StringBuilder sb = new StringBuilder(\"[\"); for(int i=0; i<s.length; i++){ sb.append(\"\\\"\").append(s[i]).append(\"\\\"\").append(i==s.length-1?\"\":\",\"); } sb.append(\"]\"); System.out.println(sb.toString()); } }" }, expectedOutput: '["h","a","n","n","a","H"]' },
            { id: 3, description: "Single char", inputCode: { javascript: "let s=['a']; reverseString(s); console.log(JSON.stringify(s))", python: "import json; s=['a']; reverseString(s); print(json.dumps(s, separators=(',', ':')))", java: "class Main { public static void main(String[] x) { char[] s={'a'}; Solution.reverseString(s); StringBuilder sb = new StringBuilder(\"[\"); for(int i=0; i<s.length; i++){ sb.append(\"\\\"\").append(s[i]).append(\"\\\"\").append(i==s.length-1?\"\":\",\"); } sb.append(\"]\"); System.out.println(sb.toString()); } }" }, expectedOutput: '["a"]' },
            { id: 4, description: "Empty array", inputCode: { javascript: "let s=[]; reverseString(s); console.log(JSON.stringify(s))", python: "import json; s=[]; reverseString(s); print(json.dumps(s, separators=(',', ':')))", java: "class Main { public static void main(String[] x) { char[] s={}; Solution.reverseString(s); System.out.println(\"[]\"); } }" }, expectedOutput: '[]' }
        ],
        starterCode: {
            javascript: "function reverseString(s) {\n    // Implementation here\n}",
            python: "def reverseString(s):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static void reverseString(char[] s) {\n    }\n}"
        }
    },
    {
        title: "Valid Palindrome",
        id: "valid-palindrome",
        difficulty: "Easy",
        category: "String • Two Pointers",
        description: { text: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward." },
        hiddenTestCases: [
            { id: 1, description: "Basic Palindrome", inputCode: { javascript: 'console.log(isPalindrome("A man, a plan, a canal: Panama"))', python: 'print(str(isPalindrome("A man, a plan, a canal: Panama")).lower())', java: 'class Hidden { public static void main(String[] x) { System.out.println(Solution.isPalindrome("A man, a plan, a canal: Panama")); } }' }, expectedOutput: "true" },
            { id: 2, description: "Not a Palindrome", inputCode: { javascript: 'console.log(isPalindrome("race a car"))', python: 'print(str(isPalindrome("race a car")).lower())', java: 'class Hidden { public static void main(String[] x) { System.out.println(Solution.isPalindrome("race a car")); } }' }, expectedOutput: "false" },
            { id: 3, description: "Empty String", inputCode: { javascript: 'console.log(isPalindrome(" "))', python: 'print(str(isPalindrome(" ")).lower())', java: 'class Hidden { public static void main(String[] x) { System.out.println(Solution.isPalindrome(" ")); } }' }, expectedOutput: "true" },
            { id: 4, description: "Special Chars", inputCode: { javascript: 'console.log(isPalindrome("ab_a"))', python: 'print(str(isPalindrome("ab_a")).lower())', java: 'class Hidden { public static void main(String[] x) { System.out.println(Solution.isPalindrome("ab_a")); } }' }, expectedOutput: "true" }
        ],
        starterCode: {
            javascript: "function isPalindrome(s) {\n    // Implementation here\n}",
            python: "def isPalindrome(s):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static boolean isPalindrome(String s) {\n        return false;\n    }\n}"
        }
    },
    {
        title: "Binary Search",
        id: "binary-search",
        difficulty: "Easy",
        category: "Array • Binary Search",
        description: { text: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1." },
        hiddenTestCases: [
            { id: 1, description: "Target found", inputCode: { javascript: "console.log(search([-1,0,3,5,9,12], 9))", python: "print(search([-1,0,3,5,9,12], 9))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.search(new int[]{-1,0,3,5,9,12}, 9)); } }" }, expectedOutput: "4" },
            { id: 2, description: "Target not found", inputCode: { javascript: "console.log(search([-1,0,3,5,9,12], 2))", python: "print(search([-1,0,3,5,9,12], 2))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.search(new int[]{-1,0,3,5,9,12}, 2)); } }" }, expectedOutput: "-1" },
            { id: 3, description: "Single item found", inputCode: { javascript: "console.log(search([5], 5))", python: "print(search([5], 5))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.search(new int[]{5}, 5)); } }" }, expectedOutput: "0" },
            { id: 4, description: "Single item not found", inputCode: { javascript: "console.log(search([5], 2))", python: "print(search([5], 2))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.search(new int[]{5}, 2)); } }" }, expectedOutput: "-1" }
        ],
        starterCode: {
            javascript: "function search(nums, target) {\n    // Implementation here\n}",
            python: "def search(nums, target):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static int search(int[] nums, int target) {\n        return -1;\n    }\n}"
        }
    },
    {
        title: "Maximum Subarray",
        id: "maximum-subarray",
        difficulty: "Medium",
        category: "Array • Dynamic Programming",
        description: { text: "Given an integer array nums, find the subarray with the largest sum, and return its sum." },
        hiddenTestCases: [
            { id: 1, description: "Basic case", inputCode: { javascript: "console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))", python: "print(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})); } }" }, expectedOutput: "6" },
            { id: 2, description: "Single element", inputCode: { javascript: "console.log(maxSubArray([1]))", python: "print(maxSubArray([1]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.maxSubArray(new int[]{1})); } }" }, expectedOutput: "1" },
            { id: 3, description: "All positive", inputCode: { javascript: "console.log(maxSubArray([5,4,-1,7,8]))", python: "print(maxSubArray([5,4,-1,7,8]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.maxSubArray(new int[]{5,4,-1,7,8})); } }" }, expectedOutput: "23" },
            { id: 4, description: "All negative", inputCode: { javascript: "console.log(maxSubArray([-1, -2, -3]))", python: "print(maxSubArray([-1, -2, -3]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.maxSubArray(new int[]{-1,-2,-3})); } }" }, expectedOutput: "-1" }
        ],
        starterCode: {
            javascript: "function maxSubArray(nums) {\n    // Implementation here\n}",
            python: "def maxSubArray(nums):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static int maxSubArray(int[] nums) {\n        return 0;\n    }\n}"
        }
    },
    {
        title: "Container With Most Water",
        id: "container-with-most-water",
        difficulty: "Medium",
        category: "Array • Two Pointers",
        description: { text: "Find two lines that together with the x-axis form a container, such that the container contains the most water." },
        hiddenTestCases: [
            { id: 1, description: "Standard case", inputCode: { javascript: "console.log(maxArea([1,8,6,2,5,4,8,3,7]))", python: "print(maxArea([1,8,6,2,5,4,8,3,7]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.maxArea(new int[]{1,8,6,2,5,4,8,3,7})); } }" }, expectedOutput: "49" },
            { id: 2, description: "Minimum size", inputCode: { javascript: "console.log(maxArea([1,1]))", python: "print(maxArea([1,1]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.maxArea(new int[]{1,1})); } }" }, expectedOutput: "1" },
            { id: 3, description: "Symmetric", inputCode: { javascript: "console.log(maxArea([4,3,2,1,4]))", python: "print(maxArea([4,3,2,1,4]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.maxArea(new int[]{4,3,2,1,4})); } }" }, expectedOutput: "16" }
        ],
        starterCode: {
            javascript: "function maxArea(height) {\n    // Implementation here\n}",
            python: "def maxArea(height):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static int maxArea(int[] height) {\n        return 0;\n    }\n}"
        }
    },
    {
        title: "3Sum",
        id: "3sum",
        difficulty: "Medium",
        category: "Array • Two Pointers",
        description: { text: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that they sum to zero." },
        hiddenTestCases: [
            { id: 1, description: "Standard case", inputCode: { javascript: "const res = threeSum([-1,0,1,2,-1,-4]).map(a => a.sort((x,y)=>x-y)).sort(); console.log(JSON.stringify(res))", python: "import json; res = [sorted(x) for x in threeSum([-1,0,1,2,-1,-4])]; res.sort(); print(json.dumps(res, separators=(',', ':')))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.threeSum(new int[]{-1,0,1,2,-1,-4})); } }" }, expectedOutput: "[[-1,-1,2],[-1,0,1]]" },
            { id: 2, description: "No solution", inputCode: { javascript: "console.log(JSON.stringify(threeSum([0,1,1])))", python: "import json; print(json.dumps(threeSum([0,1,1]), separators=(',', ':')))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.threeSum(new int[]{0,1,1})); } }" }, expectedOutput: "[]" },
            { id: 3, description: "Zeroes", inputCode: { javascript: "console.log(JSON.stringify(threeSum([0,0,0])))", python: "import json; print(json.dumps(threeSum([0,0,0]), separators=(',', ':')))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.threeSum(new int[]{0,0,0})); } }" }, expectedOutput: "[[0,0,0]]" }
        ],
        starterCode: {
            javascript: "function threeSum(nums) {\n    // Implementation here\n}",
            python: "def threeSum(nums):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static List<List<Integer>> threeSum(int[] nums) {\n        return new ArrayList<>();\n    }\n}"
        }
    },
    {
        title: "Trapping Rain Water",
        id: "trapping-rain-water",
        difficulty: "Hard",
        category: "Array • Two Pointers • Dynamic Programming",
        description: { text: "Compute how much water it can trap after raining." },
        hiddenTestCases: [
            { id: 1, description: "Example 1", inputCode: { javascript: "console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1]))", python: "print(trap([0,1,0,2,1,0,1,3,2,1,2,1]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.trap(new int[]{0,1,0,2,1,0,1,3,2,1,2,1})); } }" }, expectedOutput: "6" },
            { id: 2, description: "Example 2", inputCode: { javascript: "console.log(trap([4,2,0,3,2,5]))", python: "print(trap([4,2,0,3,2,5]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.trap(new int[]{4,2,0,3,2,5})); } }" }, expectedOutput: "9" },
            { id: 3, description: "Mountain", inputCode: { javascript: "console.log(trap([3,0,2,0,4]))", python: "print(trap([3,0,2,0,4]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.trap(new int[]{3,0,2,0,4})); } }" }, expectedOutput: "7" }
        ],
        starterCode: {
            javascript: "function trap(height) {\n    // Implementation here\n}",
            python: "def trap(height):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static int trap(int[] height) {\n        return 0;\n    }\n}"
        }
    },
    {
        title: "Merge Intervals",
        id: "merge-intervals",
        difficulty: "Medium",
        category: "Array • Sorting",
        description: { text: "Merge all overlapping intervals." },
        hiddenTestCases: [
            { id: 1, description: "Normal merge", inputCode: { javascript: "const res = merge([[1,3],[2,6],[8,10],[15,18]]).sort((a,b)=>a[0]-b[0]); console.log(JSON.stringify(res))", python: "import json; res = merge([[1,3],[2,6],[8,10],[15,18]]); res.sort(); print(json.dumps(res, separators=(',', ':')))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.merge(new int[][]{{1,3},{2,6},{8,10},{15,18}})); } }" }, expectedOutput: "[[1,6],[8,10],[15,18]]" },
            { id: 2, description: "Continuous", inputCode: { javascript: "const res = merge([[1,4],[4,5]]).sort((a,b)=>a[0]-b[0]); console.log(JSON.stringify(res))", python: "import json; res = merge([[1,4],[4,5]]); res.sort(); print(json.dumps(res, separators=(',', ':')))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.merge(new int[][]{{1,4},{4,5}})); } }" }, expectedOutput: "[[1,5]]" },
            { id: 3, description: "Contained", inputCode: { javascript: "const res = merge([[1,4],[2,3]]).sort((a,b)=>a[0]-b[0]); console.log(JSON.stringify(res))", python: "import json; res = merge([[1,4],[2,3]]); res.sort(); print(json.dumps(res, separators=(',', ':')))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.merge(new int[][]{{1,4},{2,3}})); } }" }, expectedOutput: "[[1,4]]" }
        ],
        starterCode: {
            javascript: "function merge(intervals) {\n    // Implementation here\n}",
            python: "def merge(intervals):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static int[][] merge(int[][] intervals) {\n        return new int[0][0];\n    }\n}"
        }
    },
    {
        title: "Median of Two Sorted Arrays",
        id: "median-of-two-sorted-arrays",
        difficulty: "Hard",
        category: "Array • Binary Search",
        description: { text: "Return the median of the two sorted arrays." },
        hiddenTestCases: [
            { id: 1, description: "Odd total count", inputCode: { javascript: "console.log(findMedianSortedArrays([1,3], [2]))", python: "print(findMedianSortedArrays([1,3], [2]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.findMedianSortedArrays(new int[]{1,3}, new int[]{2})); } }" }, expectedOutput: "2" },
            { id: 2, description: "Even total count", inputCode: { javascript: "console.log(findMedianSortedArrays([1,2], [3,4]))", python: "print(findMedianSortedArrays([1,2], [3,4]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.findMedianSortedArrays(new int[]{1,2}, new int[]{3,4})); } }" }, expectedOutput: "2.5" },
            { id: 3, description: "Empty array", inputCode: { javascript: "console.log(findMedianSortedArrays([0,0], [0,0]))", python: "print(findMedianSortedArrays([0,0], [0,0]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.findMedianSortedArrays(new int[]{0,0}, new int[]{0,0})); } }" }, expectedOutput: "0" }
        ],
        starterCode: {
            javascript: "function findMedianSortedArrays(nums1, nums2) {\n    // Implementation here\n}",
            python: "def findMedianSortedArrays(nums1, nums2):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        return 0.0;\n    }\n}"
        }
    },
    {
        title: "Longest Substring Without Repeating Characters",
        id: "longest-substring-without-repeating-characters",
        difficulty: "Medium",
        category: "String • Sliding Window",
        description: { text: "Find the length of the longest substring without repeating characters." },
        hiddenTestCases: [
            { id: 1, description: "Normal case", inputCode: { javascript: 'console.log(lengthOfLongestSubstring("abcabcbb"))', python: 'print(lengthOfLongestSubstring("abcabcbb"))', java: 'class Hidden { public static void main(String[] x) { System.out.println(Solution.lengthOfLongestSubstring("abcabcbb")); } }' }, expectedOutput: "3" },
            { id: 2, description: "Same char", inputCode: { javascript: 'console.log(lengthOfLongestSubstring("bbbbb"))', python: 'print(lengthOfLongestSubstring("bbbbb"))', java: 'class Hidden { public static void main(String[] x) { System.out.println(Solution.lengthOfLongestSubstring("bbbbb")); } }' }, expectedOutput: "1" },
            { id: 3, description: "Longest in middle", inputCode: { javascript: 'console.log(lengthOfLongestSubstring("pwwkew"))', python: 'print(lengthOfLongestSubstring("pwwkew"))', java: 'class Hidden { public static void main(String[] x) { System.out.println(Solution.lengthOfLongestSubstring("pwwkew")); } }' }, expectedOutput: "3" },
            { id: 4, description: "Empty string", inputCode: { javascript: 'console.log(lengthOfLongestSubstring(""))', python: 'print(lengthOfLongestSubstring(""))', java: 'class Hidden { public static void main(String[] x) { System.out.println(Solution.lengthOfLongestSubstring("")); } }' }, expectedOutput: "0" }
        ],
        starterCode: {
            javascript: "function lengthOfLongestSubstring(s) {\n    // Implementation here\n}",
            python: "def lengthOfLongestSubstring(s):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static int lengthOfLongestSubstring(String s) {\n        return 0;\n    }\n}"
        }
    },
    {
        title: "First Missing Positive",
        id: "first-missing-positive",
        difficulty: "Hard",
        category: "Array • Hash Table",
        description: { text: "Return the smallest missing positive integer." },
        hiddenTestCases: [
            { id: 1, description: "Missing 3", inputCode: { javascript: "console.log(firstMissingPositive([1,2,0]))", python: "print(firstMissingPositive([1,2,0]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.firstMissingPositive(new int[]{1,2,0})); } }" }, expectedOutput: "3" },
            { id: 2, description: "Missing 2", inputCode: { javascript: "console.log(firstMissingPositive([3,4,-1,1]))", python: "print(firstMissingPositive([3,4,-1,1]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.firstMissingPositive(new int[]{3,4,-1,1})); } }" }, expectedOutput: "2" },
            { id: 3, description: "Missing 1", inputCode: { javascript: "console.log(firstMissingPositive([7,8,9,11,12]))", python: "print(firstMissingPositive([7,8,9,11,12]))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.firstMissingPositive(new int[]{7,8,9,11,12})); } }" }, expectedOutput: "1" }
        ],
        starterCode: {
            javascript: "function firstMissingPositive(nums) {\n    // Implementation here\n}",
            python: "def firstMissingPositive(nums):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static int firstMissingPositive(int[] nums) {\n        return 0;\n    }\n}"
        }
    },
    {
        title: "Search in Rotated Sorted Array",
        id: "search-in-rotated-sorted-array",
        difficulty: "Medium",
        category: "Array • Binary Search",
        description: { text: "Return the index of target in a rotated sorted array." },
        hiddenTestCases: [
            { id: 1, description: "Target at index 4", inputCode: { javascript: "console.log(search([4,5,6,7,0,1,2], 0))", python: "print(search([4,5,6,7,0,1,2], 0))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.search(new int[]{4,5,6,7,0,1,2}, 0)); } }" }, expectedOutput: "4" },
            { id: 2, description: "Target not present", inputCode: { javascript: "console.log(search([4,5,6,7,0,1,2], 3))", python: "print(search([4,5,6,7,0,1,2], 3))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.search(new int[]{4,5,6,7,0,1,2}, 3)); } }" }, expectedOutput: "-1" },
            { id: 3, description: "Single item fail", inputCode: { javascript: "console.log(search([1], 0))", python: "print(search([1], 0))", java: "class Hidden { public static void main(String[] x) { System.out.println(Solution.search(new int[]{1}, 0)); } }" }, expectedOutput: "-1" }
        ],
        starterCode: {
            javascript: "function search(nums, target) {\n    // Implementation here\n}",
            python: "def search(nums, target):\n    # Implementation here\n    pass",
            java: "class Solution {\n    public static int search(int[] nums, int target) {\n        return -1;\n    }\n}"
        }
    }
];

const seedAllHiddenTests = async () => {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Connected to DB");

        for (const problemData of problemsData) {
            const problem = await CustomProblem.findOneAndUpdate(
                { title: problemData.title },
                {
                    $set: {
                        hiddenTestCases: problemData.hiddenTestCases,
                        id: problemData.id,
                        difficulty: problemData.difficulty,
                        category: problemData.category,
                        description: problemData.description,
                        starterCode: problemData.starterCode,
                        ownerClerkId: CLERK_ID
                    }
                },
                { upsert: true, new: true }
            );
            console.log("Synced problem:", problem.title);
        }

        console.log("All hidden tests seeded successfully!");
        await mongoose.connection.close();
    } catch (err) {
        console.error("Error seeding:", err);
    }
};

seedAllHiddenTests();
