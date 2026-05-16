export const PROBLEMS = {
  "two-sum": {
    id: "two-sum",
    title: "Two Sum",
    difficulty: "Easy",
    category: "Array • Hash Table",
    description: {
      text: "Given an array of integers nums and an integer target, return indices of the two numbers in the array such that they add up to target.",
      notes: [
        "You may assume that each input would have exactly one solution, and you may not use the same element twice.",
        "You can return the answer in any order.",
      ],
    },
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]",
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
      "-10⁹ ≤ target ≤ 10⁹",
      "Only one valid answer exists",
    ],
    starterCode: {
      javascript: `function twoSum(nums, target) {
  // Write your solution here
  
}

// Test cases
console.log(JSON.stringify(twoSum([2, 7, 11, 15], 9))); // Expected: [0,1]
console.log(JSON.stringify(twoSum([3, 2, 4], 6))); // Expected: [1,2]
console.log(JSON.stringify(twoSum([3, 3], 6))); // Expected: [0,1]`,
      python: `import json
def twoSum(nums, target):
    # Write your solution here
    pass

# Test cases
print(json.dumps(twoSum([2, 7, 11, 15], 9), separators=(',', ':')))  # Expected: [0,1]
print(json.dumps(twoSum([3, 2, 4], 6), separators=(',', ':')))  # Expected: [1,2]
print(json.dumps(twoSum([3, 3], 6), separators=(',', ':')))  # Expected: [0,1]`,
      java: `import java.util.*;

class Solution {
    public static int[] twoSum(int[] nums, int target) {
        // Write your solution here
        
        return new int[0];
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSum(new int[]{2, 7, 11, 15}, 9))); // Expected: [0, 1]
        System.out.println(Arrays.toString(twoSum(new int[]{3, 2, 4}, 6))); // Expected: [1, 2]
        System.out.println(Arrays.toString(twoSum(new int[]{3, 3}, 6))); // Expected: [0, 1]
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <string>

using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your solution here
        
        return {};
    }
};

string vectorToString(vector<int> res) {
    string s = "[";
    for (int i = 0; i < res.size(); i++) {
        s += to_string(res[i]) + (i == res.size() - 1 ? "" : ",");
    }
    s += "]";
    return s;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> nums1 = {2, 7, 11, 15};
    cout << vectorToString(sol.twoSum(nums1, 9)) << endl;
    vector<int> nums2 = {3, 2, 4};
    cout << vectorToString(sol.twoSum(nums2, 6)) << endl;
    vector<int> nums3 = {3, 3};
    cout << vectorToString(sol.twoSum(nums3, 6)) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "[0,1]\n[1,2]\n[0,1]",
      python: "[0,1]\n[1,2]\n[0,1]",
      java: "[0, 1]\n[1, 2]\n[0, 1]",
      cpp: "[0,1]\n[1,2]\n[0,1]",
    },
  },

  "reverse-string": {
    id: "reverse-string",
    title: "Reverse String",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "Write a function that reverses a string. The input string is given as an array of characters s.",
      notes: ["You must do this by modifying the input array in-place with O(1) extra memory."],
    },
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]',
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]',
      },
    ],
    constraints: ["1 ≤ s.length ≤ 10⁵", "s[i] is a printable ascii character"],
    starterCode: {
      javascript: `function reverseString(s) {
  // Write your solution here
  
}

// Test cases
let test1 = ["h","e","l","l","o"];
reverseString(test1);
console.log(JSON.stringify(test1)); // Expected: ["o","l","l","e","h"]

let test2 = ["H","a","n","n","a","h"];
reverseString(test2);
console.log(JSON.stringify(test2)); // Expected: ["h","a","n","n","a","H"]`,
      python: `import json
def reverseString(s):
    # Write your solution here
    pass

# Test cases
test1 = ["h","e","l","l","o"]
reverseString(test1)
print(json.dumps(test1, separators=(',', ':')))  # Expected: ["o","l","l","e","h"]

test2 = ["H","a","n","n","a","h"]
reverseString(test2)
print(json.dumps(test2, separators=(',', ':')))  # Expected: ["h","a","n","n","a","H"]`,
      java: `import java.util.*;

class Solution {
    public static void reverseString(char[] s) {
        // Write your solution here
        
    }
    
    public static void main(String[] args) {
        char[] test1 = {'h','e','l','l','o'};
        reverseString(test1);
        System.out.println(Arrays.toString(test1)); // Expected: [o, l, l, e, h]
        
        char[] test2 = {'H','a','n','n','a','h'};
        reverseString(test2);
        System.out.println(Arrays.toString(test2)); // Expected: [h, a, n, n, a, H]
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

class Solution {
public:
    void reverseString(vector<char>& s) {
        // Write your solution here
        
    }
};

string vectorToString(const vector<char>& s) {
    string res = "[";
    for (int i = 0; i < s.size(); i++) {
        res += "\"";
        res += s[i];
        res += "\"";
        if (i < s.size() - 1) res += ",";
    }
    res += "]";
    return res;
}

int main() {
    Solution sol;
    vector<char> s1 = {'h', 'e', 'l', 'l', 'o'};
    sol.reverseString(s1);
    cout << vectorToString(s1) << endl;
    
    vector<char> s2 = {'H', 'a', 'n', 'n', 'a', 'h'};
    sol.reverseString(s2);
    cout << vectorToString(s2) << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: '["o","l","l","e","h"]\n["h","a","n","n","a","H"]',
      python: '["o","l","l","e","h"]\n["h","a","n","n","a","H"]',
      java: "[o, l, l, e, h]\n[h, a, n, n, a, H]",
      cpp: '["o","l","l","e","h"]\n["h","a","n","n","a","H"]',
    },
  },

  "valid-palindrome": {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers.",
      notes: ["Given a string s, return true if it is a palindrome, or false otherwise."],
    },
    examples: [
      {
        input: 's = "A man, a plan, a canal: Panama"',
        output: "true",
        explanation: '"amanaplanacanalpanama" is a palindrome.',
      },
      {
        input: 's = "race a car"',
        output: "false",
        explanation: '"raceacar" is not a palindrome.',
      },
      {
        input: 's = " "',
        output: "true",
        explanation:
          's is an empty string "" after removing non-alphanumeric characters. Since an empty string reads the same forward and backward, it is a palindrome.',
      },
    ],
    constraints: ["1 ≤ s.length ≤ 2 * 10⁵", "s consists only of printable ASCII characters"],
    starterCode: {
      javascript: `function isPalindrome(s) {
  // Write your solution here
  
}

// Test cases
console.log(isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
console.log(isPalindrome("race a car")); // Expected: false
console.log(isPalindrome(" ")); // Expected: true`,
      python: `def isPalindrome(s):
    # Write your solution here
    pass

# Test cases
print(isPalindrome("A man, a plan, a canal: Panama"))  # Expected: True
print(isPalindrome("race a car"))  # Expected: False
print(isPalindrome(" "))  # Expected: True`,
      java: `class Solution {
    public static boolean isPalindrome(String s) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isPalindrome("A man, a plan, a canal: Panama")); // Expected: true
        System.out.println(isPalindrome("race a car")); // Expected: false
        System.out.println(isPalindrome(" ")); // Expected: true
    }
}`,
      cpp: `#include <iostream>
#include <string>
#include <cctype>

using namespace std;

class Solution {
public:
    bool isPalindrome(string s) {
        // Write your solution here
        
        return false;
    }
};

int main() {
    Solution sol;
    cout << (sol.isPalindrome("A man, a plan, a canal: Panama") ? "true" : "false") << endl;
    cout << (sol.isPalindrome("race a car") ? "true" : "false") << endl;
    cout << (sol.isPalindrome(" ") ? "true" : "false") << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "true\nfalse\ntrue",
      python: "True\nFalse\nTrue",
      java: "true\nfalse\ntrue",
      cpp: "true\nfalse\ntrue",
    },
  },

  "maximum-subarray": {
    id: "maximum-subarray",
    title: "Maximum Subarray",
    difficulty: "Medium",
    category: "Array • Dynamic Programming",
    description: {
      text: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
      notes: [],
    },
    examples: [
      {
        input: "nums = [-2,1,-3,4,-1,2,1,-5,4]",
        output: "6",
        explanation: "The subarray [4,-1,2,1] has the largest sum 6.",
      },
      {
        input: "nums = [1]",
        output: "1",
        explanation: "The subarray [1] has the largest sum 1.",
      },
      {
        input: "nums = [5,4,-1,7,8]",
        output: "23",
        explanation: "The subarray [5,4,-1,7,8] has the largest sum 23.",
      },
    ],
    constraints: ["1 ≤ nums.length ≤ 10⁵", "-10⁴ ≤ nums[i] ≤ 10⁴"],
    starterCode: {
      javascript: `function maxSubArray(nums) {
  // Write your solution here
  
}

// Test cases
console.log(maxSubArray([-2,1,-3,4,-1,2,1,-5,4])); // Expected: 6
console.log(maxSubArray([1])); // Expected: 1
console.log(maxSubArray([5,4,-1,7,8])); // Expected: 23`,
      python: `def maxSubArray(nums):
    # Write your solution here
    pass

# Test cases
print(maxSubArray([-2,1,-3,4,-1,2,1,-5,4]))  # Expected: 6
print(maxSubArray([1]))  # Expected: 1
print(maxSubArray([5,4,-1,7,8]))  # Expected: 23`,
      java: `class Solution {
    public static int maxSubArray(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxSubArray(new int[]{-2,1,-3,4,-1,2,1,-5,4})); // Expected: 6
        System.out.println(maxSubArray(new int[]{1})); // Expected: 1
        System.out.println(maxSubArray(new int[]{5,4,-1,7,8})); // Expected: 23
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    int maxSubArray(vector<int>& nums) {
        // Write your solution here
        
        return 0;
    }
};

int main() {
    Solution sol;
    vector<int> n1 = {-2, 1, -3, 4, -1, 2, 1, -5, 4};
    cout << sol.maxSubArray(n1) << endl;
    vector<int> n2 = {1};
    cout << sol.maxSubArray(n2) << endl;
    vector<int> n3 = {5, 4, -1, 7, 8};
    cout << sol.maxSubArray(n3) << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "6\n1\n23",
      python: "6\n1\n23",
      java: "6\n1\n23",
      cpp: "6\n1\n23",
    },
  },

  "container-with-most-water": {
    id: "container-with-most-water",
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Array • Two Pointers",
    description: {
      text: "You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).",
      notes: [
        "Find two lines that together with the x-axis form a container, such that the container contains the most water.",
        "Return the maximum amount of water a container can store.",
        "Notice that you may not slant the container.",
      ],
    },
    examples: [
      {
        input: "height = [1,8,6,2,5,4,8,3,7]",
        output: "49",
        explanation:
          "The vertical lines are represented by array [1,8,6,2,5,4,8,3,7]. In this case, the max area of water the container can contain is 49.",
      },
      {
        input: "height = [1,1]",
        output: "1",
      },
    ],
    constraints: ["n == height.length", "2 ≤ n ≤ 10⁵", "0 ≤ height[i] ≤ 10⁴"],
    starterCode: {
      javascript: `function maxArea(height) {
  // Write your solution here
  
}

// Test cases
console.log(maxArea([1,8,6,2,5,4,8,3,7])); // Expected: 49
console.log(maxArea([1,1])); // Expected: 1`,
      python: `def maxArea(height):
    # Write your solution here
    pass

# Test cases
print(maxArea([1,8,6,2,5,4,8,3,7]))  # Expected: 49
print(maxArea([1,1]))  # Expected: 1`,
      java: `class Solution {
    public static int maxArea(int[] height) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxArea(new int[]{1,8,6,2,5,4,8,3,7})); // Expected: 49
        System.out.println(maxArea(new int[]{1,1})); // Expected: 1
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    int maxArea(vector<int>& height) {
        // Write your solution here
        
        return 0;
    }
};

int main() {
    Solution sol;
    vector<int> h1 = {1, 8, 6, 2, 5, 4, 8, 3, 7};
    cout << sol.maxArea(h1) << endl;
    vector<int> h2 = {1, 1};
    cout << sol.maxArea(h2) << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "49\n1",
      python: "49\n1",
      java: "49\n1",
      cpp: "49\n1",
    },
  },

  "3sum": {
    id: "3sum",
    title: "3Sum",
    difficulty: "Medium",
    category: "Array • Two Pointers",
    description: {
      text: "Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0.",
      notes: [
        "Notice that the solution set must not contain duplicate triplets.",
        "You can return the answer in any order.",
      ],
    },
    examples: [
      {
        input: "nums = [-1,0,1,2,-1,-4]",
        output: "[[-1,-1,2],[-1,0,1]]",
        explanation:
          "The distinct triplets are [-1,0,1] and [-1,-1,2]. Notice that the order of the output and the order of the triplets does not matter.",
      },
      {
        input: "nums = [0,1,1]",
        output: "[]",
        explanation: "The only possible triplet does not sum up to 0.",
      },
      {
        input: "nums = [0,0,0]",
        output: "[[0,0,0]]",
        explanation: "The only possible triplet sums up to 0.",
      },
    ],
    constraints: [
      "3 ≤ nums.length ≤ 3000",
      "-10⁵ ≤ nums[i] ≤ 10⁵",
    ],
    starterCode: {
      javascript: `function threeSum(nums) {
  // Write your solution here
  
}

// Test cases
console.log(JSON.stringify(threeSum([-1,0,1,2,-1,-4]))); // Expected: [[-1,-1,2],[-1,0,1]]
console.log(JSON.stringify(threeSum([0,1,1]))); // Expected: []
console.log(JSON.stringify(threeSum([0,0,0]))); // Expected: [[0,0,0]]`,
      python: `def threeSum(nums):
    # Write your solution here
    pass

# Test cases
print(threeSum([-1,0,1,2,-1,-4]))  # Expected: [[-1,-1,2],[-1,0,1]]
print(threeSum([0,1,1]))  # Expected: []
print(threeSum([0,0,0]))  # Expected: [[0,0,0]]`,
      java: `import java.util.*;

class Solution {
    public static List<List<Integer>> threeSum(int[] nums) {
        // Write your solution here
        
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        System.out.println(threeSum(new int[]{-1,0,1,2,-1,-4})); // Expected: [[-1,-1,2],[-1,0,1]]
        System.out.println(threeSum(new int[]{0,1,1})); // Expected: []
        System.out.println(threeSum(new int[]{0,0,0})); // Expected: [[0,0,0]]
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

using namespace std;

class Solution {
public:
    vector<vector<int>> threeSum(vector<int>& nums) {
        // Write your solution here
        
        return {};
    }
};

string vectorToString(const vector<vector<int>>& res) {
    string s = "[";
    for (int i = 0; i < res.size(); i++) {
        s += "[";
        for (int j = 0; j < res[i].size(); j++) {
            s += to_string(res[i][j]) + (j == res[i].size() - 1 ? "" : ",");
        }
        s += "]" + (i == res.size() - 1 ? "" : ",");
    }
    s += "]";
    return s;
}

int main() {
    Solution sol;
    vector<int> n1 = {-1, 0, 1, 2, -1, -4};
    cout << vectorToString(sol.threeSum(n1)) << endl;
    vector<int> n2 = {0, 1, 1};
    cout << vectorToString(sol.threeSum(n2)) << endl;
    vector<int> n3 = {0, 0, 0};
    cout << vectorToString(sol.threeSum(n3)) << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "[[-1,-1,2],[-1,0,1]]\n[]\n[[0,0,0]]",
      python: "[[-1, -1, 2], [-1, 0, 1]]\n[]\n[[0, 0, 0]]",
      java: "[[-1, -1, 2], [-1, 0, 1]]\n[]\n[[0, 0, 0]]",
      cpp: "[[-1,-1,2],[-1,0,1]]\n[]\n[[0,0,0]]",
    },
  },

  "trapping-rain-water": {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Array • Two Pointers • Dynamic Programming",
    description: {
      text: "Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.",
      notes: [],
    },
    examples: [
      {
        input: "height = [0,1,0,2,1,0,1,3,2,1,2,1]",
        output: "6",
        explanation: "The above elevation map (black section) is represented by array [0,1,0,2,1,0,1,3,2,1,2,1]. In this case, 6 units of rain water (blue section) are being trapped.",
      },
      {
        input: "height = [4,2,0,3,2,5]",
        output: "9",
      },
    ],
    constraints: [
      "n == height.length",
      "1 ≤ n ≤ 2 * 10⁴",
      "0 ≤ height[i] ≤ 10⁵",
    ],
    starterCode: {
      javascript: `function trap(height) {
  // Write your solution here
  
}

// Test cases
console.log(trap([0,1,0,2,1,0,1,3,2,1,2,1])); // Expected: 6
console.log(trap([4,2,0,3,2,5])); // Expected: 9`,
      python: `def trap(height):
    # Write your solution here
    pass

# Test cases
print(trap([0,1,0,2,1,0,1,3,2,1,2,1]))  # Expected: 6
print(trap([4,2,0,3,2,5]))  # Expected: 9`,
      java: `class Solution {
    public static int trap(int[] height) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(trap(new int[]{0,1,0,2,1,0,1,3,2,1,2,1})); // Expected: 6
        System.out.println(trap(new int[]{4,2,0,3,2,5})); // Expected: 9
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    int trap(vector<int>& height) {
        // Write your solution here
        
        return 0;
    }
};

int main() {
    Solution sol;
    vector<int> h1 = {0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1};
    cout << sol.trap(h1) << endl;
    vector<int> h2 = {4, 2, 0, 3, 2, 5};
    cout << sol.trap(h2) << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "6\n9",
      python: "6\n9",
      java: "6\n9",
      cpp: "6\n9",
    },
  },

  "merge-intervals": {
    id: "merge-intervals",
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Array • Sorting",
    description: {
      text: "Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.",
      notes: [],
    },
    examples: [
      {
        input: "intervals = [[1,3],[2,6],[8,10],[15,18]]",
        output: "[[1,6],[8,10],[15,18]]",
        explanation: "Since intervals [1,3] and [2,6] overlap, merge them into [1,6].",
      },
      {
        input: "intervals = [[1,4],[4,5]]",
        output: "[[1,5]]",
        explanation: "Intervals [1,4] and [4,5] are considered overlapping.",
      },
    ],
    constraints: [
      "1 ≤ intervals.length ≤ 10⁴",
      "intervals[i].length == 2",
      "0 ≤ starti ≤ endi ≤ 10⁴",
    ],
    starterCode: {
      javascript: `function merge(intervals) {
  // Write your solution here
  
}

// Test cases
console.log(JSON.stringify(merge([[1,3],[2,6],[8,10],[15,18]]))); // Expected: [[1,6],[8,10],[15,18]]
console.log(JSON.stringify(merge([[1,4],[4,5]]))); // Expected: [[1,5]]`,
      python: `def merge(intervals):
    # Write your solution here
    pass

# Test cases
print(merge([[1,3],[2,6],[8,10],[15,18]]))  # Expected: [[1, 6], [8, 10], [15, 18]]
print(merge([[1,4],[4,5]]))  # Expected: [[1, 5]]`,
      java: `import java.util.*;

class Solution {
    public static int[][] merge(int[][] intervals) {
        // Write your solution here
        
        return new int[0][0];
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.deepToString(merge(new int[][]{{1,3},{2,6},{8,10},{15,18}}))); // Expected: [[1, 6], [8, 10], [15, 18]]
        System.out.println(Arrays.deepToString(merge(new int[][]{{1,4},{4,5}}))); // Expected: [[1, 5]]
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>
#include <string>

using namespace std;

class Solution {
public:
    vector<vector<int>> merge(vector<vector<int>>& intervals) {
        // Write your solution here
        
        return {};
    }
};

string vectorToString(const vector<vector<int>>& res) {
    string s = "[";
    for (int i = 0; i < res.size(); i++) {
        s += "[";
        for (int j = 0; j < res[i].size(); j++) {
            s += to_string(res[i][j]) + (j == res[i].size() - 1 ? "" : ",");
        }
        s += "]" + (i == res.size() - 1 ? "" : ",");
    }
    s += "]";
    return s;
}

int main() {
    Solution sol;
    vector<vector<int>> i1 = {{1, 3}, {2, 6}, {8, 10}, {15, 18}};
    cout << vectorToString(sol.merge(i1)) << endl;
    vector<vector<int>> i2 = {{1, 4}, {4, 5}};
    cout << vectorToString(sol.merge(i2)) << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "[[1,6],[8,10],[15,18]]\n[[1,5]]",
      python: "[[1, 6], [8, 10], [15, 18]]\n[[1, 5]]",
      java: "[[1, 6], [8, 10], [15, 18]]\n[[1, 5]]",
      cpp: "[[1,6],[8,10],[15,18]]\n[[1,5]]",
    },
  },

  "median-of-two-sorted-arrays": {
    id: "median-of-two-sorted-arrays",
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Array • Binary Search",
    description: {
      text: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.",
      notes: ["The overall run time complexity should be O(log (m+n))."],
    },
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged array = [1,2,3] and median is 2.",
      },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.50000",
        explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.",
      },
    ],
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 ≤ m ≤ 1000",
      "0 ≤ n ≤ 1000",
      "1 ≤ m + n ≤ 2000",
      "-10⁶ ≤ nums1[i], nums2[i] ≤ 10⁶",
    ],
    starterCode: {
      javascript: `function findMedianSortedArrays(nums1, nums2) {
  // Write your solution here
  
}

// Test cases
console.log(findMedianSortedArrays([1,3], [2])); // Expected: 2
console.log(findMedianSortedArrays([1,2], [3,4])); // Expected: 2.5`,
      python: `def findMedianSortedArrays(nums1, nums2):
    # Write your solution here
    pass

# Test cases
print(findMedianSortedArrays([1,3], [2]))  # Expected: 2.0
print(findMedianSortedArrays([1,2], [3,4]))  # Expected: 2.5`,
      java: `class Solution {
    public static double findMedianSortedArrays(int[] nums1, int[] nums2) {
        // Write your solution here
        
        return 0.0;
    }
    
    public static void main(String[] args) {
        System.out.println(findMedianSortedArrays(new int[]{1,3}, new int[]{2})); // Expected: 2.0
        System.out.println(findMedianSortedArrays(new int[]{1,2}, new int[]{3,4})); // Expected: 2.5
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <iomanip>

using namespace std;

class Solution {
public:
    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
        // Write your solution here
        
        return 0.0;
    }
};

int main() {
    Solution sol;
    vector<int> n1 = {1, 3}, n2 = {2};
    cout << sol.findMedianSortedArrays(n1, n2) << endl;
    vector<int> n3 = {1, 2}, n4 = {3, 4};
    cout << sol.findMedianSortedArrays(n3, n4) << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "2\n2.5",
      python: "2\n2.5",
      java: "2.0\n2.5",
      cpp: "2\n2.5",
    },
  },

  "longest-substring-without-repeating-characters": {
    id: "longest-substring-without-repeating-characters",
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "String • Sliding Window",
    description: {
      text: "Given a string s, find the length of the longest substring without repeating characters.",
      notes: [],
    },
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: "The answer is \"abc\", with the length of 3.",
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: "The answer is \"b\", with the length of 1.",
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation: "The answer is \"wke\", with the length of 3. Notice that the answer must be a substring, \"pwke\" is a subsequence and not a substring.",
      },
    ],
    constraints: [
      "0 ≤ s.length ≤ 5 * 10⁴",
      "s consists of English letters, digits, symbols and spaces.",
    ],
    starterCode: {
      javascript: `function lengthOfLongestSubstring(s) {
  // Write your solution here
  
}

// Test cases
console.log(lengthOfLongestSubstring("abcabcbb")); // Expected: 3
console.log(lengthOfLongestSubstring("bbbbb")); // Expected: 1
console.log(lengthOfLongestSubstring("pwwkew")); // Expected: 3`,
      python: `def lengthOfLongestSubstring(s):
    # Write your solution here
    pass

# Test cases
print(lengthOfLongestSubstring("abcabcbb"))  # Expected: 3
print(lengthOfLongestSubstring("bbbbb"))  # Expected: 1
print(lengthOfLongestSubstring("pwwkew"))  # Expected: 3`,
      java: `class Solution {
    public static int lengthOfLongestSubstring(String s) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(lengthOfLongestSubstring("abcabcbb")); // Expected: 3
        System.out.println(lengthOfLongestSubstring("bbbbb")); // Expected: 1
        System.out.println(lengthOfLongestSubstring("pwwkew")); // Expected: 3
    }
}`,
      cpp: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    int lengthOfLongestSubstring(string s) {
        // Write your solution here
        
        return 0;
    }
};

int main() {
    Solution sol;
    cout << sol.lengthOfLongestSubstring("abcabcbb") << endl;
    cout << sol.lengthOfLongestSubstring("bbbbb") << endl;
    cout << sol.lengthOfLongestSubstring("pwwkew") << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "3\n1\n3",
      python: "3\n1\n3",
      java: "3\n1\n3",
      cpp: "3\n1\n3",
    },
  },

  "first-missing-positive": {
    id: "first-missing-positive",
    title: "First Missing Positive",
    difficulty: "Hard",
    category: "Array • Hash Table",
    description: {
      text: "Given an unsorted integer array nums, return the smallest missing positive integer. You must implement an algorithm that runs in O(n) time and uses constant extra space.",
      notes: [],
    },
    examples: [
      {
        input: "nums = [1,2,0]",
        output: "3",
        explanation: "The numbers generally range from 1 to 3, here 3 is missing.",
      },
      {
        input: "nums = [3,4,-1,1]",
        output: "2",
        explanation: "1 is in the array but 2 is missing.",
      },
      {
        input: "nums = [7,8,9,11,12]",
        output: "1",
        explanation: "The smallest positive integer 1 is missing.",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10⁵",
      "-2³¹ ≤ nums[i] ≤ 2³¹ - 1",
    ],
    starterCode: {
      javascript: `function firstMissingPositive(nums) {
  // Write your solution here
  
}

// Test cases
console.log(firstMissingPositive([1,2,0])); // Expected: 3
console.log(firstMissingPositive([3,4,-1,1])); // Expected: 2
console.log(firstMissingPositive([7,8,9,11,12])); // Expected: 1`,
      python: `def firstMissingPositive(nums):
    # Write your solution here
    pass

# Test cases
print(firstMissingPositive([1,2,0]))  # Expected: 3
print(firstMissingPositive([3,4,-1,1]))  # Expected: 2
print(firstMissingPositive([7,8,9,11,12]))  # Expected: 1`,
      java: `class Solution {
    public static int firstMissingPositive(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(firstMissingPositive(new int[]{1,2,0})); // Expected: 3
        System.out.println(firstMissingPositive(new int[]{3,4,-1,1})); // Expected: 2
        System.out.println(firstMissingPositive(new int[]{7,8,9,11,12})); // Expected: 1
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    int firstMissingPositive(vector<int>& nums) {
        // Write your solution here
        
        return 0;
    }
};

int main() {
    Solution sol;
    vector<int> n1 = {1, 2, 0};
    cout << sol.firstMissingPositive(n1) << endl;
    vector<int> n2 = {3, 4, -1, 1};
    cout << sol.firstMissingPositive(n2) << endl;
    vector<int> n3 = {7, 8, 9, 11, 12};
    cout << sol.firstMissingPositive(n3) << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "3\n2\n1",
      python: "3\n2\n1",
      java: "3\n2\n1",
      cpp: "3\n2\n1",
    },
  },

  "search-in-rotated-sorted-array": {
    id: "search-in-rotated-sorted-array",
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Array • Binary Search",
    description: {
      text: "There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k (1 <= k < nums.length). Given the array nums after the possible rotation and an integer target, return the index of target if it is in nums, or -1 if it is not in nums.",
      notes: [
        "You must write an algorithm with O(log n) runtime complexity.",
      ],
    },
    examples: [
      {
        input: "nums = [4,5,6,7,0,1,2], target = 0",
        output: "4",
      },
      {
        input: "nums = [4,5,6,7,0,1,2], target = 3",
        output: "-1",
      },
      {
        input: "nums = [1], target = 0",
        output: "-1",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 5000",
      "-10⁴ ≤ nums[i] ≤ 10⁴",
      "All values of nums are unique.",
      "nums is an ascending array that is possibly rotated.",
      "-10⁴ ≤ target ≤ 10⁴",
    ],
    starterCode: {
      javascript: `function search(nums, target) {
  // Write your solution here
  
}

// Test cases
console.log(search([4,5,6,7,0,1,2], 0)); // Expected: 4
console.log(search([4,5,6,7,0,1,2], 3)); // Expected: -1
console.log(search([1], 0)); // Expected: -1`,
      python: `def search(nums, target):
    # Write your solution here
    pass

# Test cases
print(search([4,5,6,7,0,1,2], 0))  # Expected: 4
print(search([4,5,6,7,0,1,2], 3))  # Expected: -1
print(search([1], 0))  # Expected: -1`,
      java: `class Solution {
    public static int search(int[] nums, int target) {
        // Write your solution here
        
        return -1;
    }
    
    public static void main(String[] args) {
        System.out.println(search(new int[]{4,5,6,7,0,1,2}, 0)); // Expected: 4
        System.out.println(search(new int[]{4,5,6,7,0,1,2}, 3)); // Expected: -1
        System.out.println(search(new int[]{1}, 0)); // Expected: -1
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Write your solution here
        
        return -1;
    }
};

int main() {
    Solution sol;
    vector<int> n1 = {4, 5, 6, 7, 0, 1, 2};
    cout << sol.search(n1, 0) << endl;
    cout << sol.search(n1, 3) << endl;
    vector<int> n2 = {1};
    cout << sol.search(n2, 0) << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "4\n-1\n-1",
      python: "4\n-1\n-1",
      java: "4\n-1\n-1",
      cpp: "4\n-1\n-1",
    },
  },

  "word-search": {
    id: "word-search",
    title: "Word Search",
    difficulty: "Medium",
    category: "Array • Backtracking • Matrix",
    description: {
      text: "Given an m x n grid of characters board and a string word, return true if word exists in the grid.",
      notes: [
        "The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring.",
        "The same letter cell may not be used more than once.",
      ],
    },
    examples: [
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"',
        output: "true",
      },
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"',
        output: "true",
      },
      {
        input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"',
        output: "false",
      },
    ],
    constraints: [
      "m == board.length",
      "n = board[i].length",
      "1 ≤ m, n ≤ 6",
      "1 ≤ word.length ≤ 15",
      "board and word consists of only lowercase and uppercase English letters.",
    ],
    starterCode: {
      javascript: `function exist(board, word) {
  // Write your solution here
  
}

// Test cases
console.log(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED")); // Expected: true
console.log(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE")); // Expected: true
console.log(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB")); // Expected: false`,
      python: `def exist(board, word):
    # Write your solution here
    pass

# Test cases
print(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"))  # Expected: True
print(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE"))  # Expected: True
print(exist([["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB"))  # Expected: False`,
      java: `class Solution {
    public static boolean exist(char[][] board, String word) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(exist(new char[][]{{'A','B','C','E'},{'S','F','C','S'},{'A','D','E','E'}}, "ABCCED")); // Expected: true
        System.out.println(exist(new char[][]{{'A','B','C','E'},{'S','F','C','S'},{'A','D','E','E'}}, "SEE")); // Expected: true
        System.out.println(exist(new char[][]{{'A','B','C','E'},{'S','F','C','S'},{'A','D','E','E'}}, "ABCB")); // Expected: false
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    bool exist(vector<vector<char>>& board, string word) {
        // Write your solution here
        
        return false;
    }
};

int main() {
    Solution sol;
    vector<vector<char>> b1 = {{'A','B','C','E'},{'S','F','C','S'},{'A','D','E','E'}};
    cout << (sol.exist(b1, "ABCCED") ? "true" : "false") << endl;
    cout << (sol.exist(b1, "SEE") ? "true" : "false") << endl;
    cout << (sol.exist(b1, "ABCB") ? "true" : "false") << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "true\ntrue\nfalse",
      python: "True\nTrue\nFalse",
      java: "true\ntrue\nfalse",
      cpp: "true\ntrue\nfalse",
    },
  },

  "valid-anagram": {
    id: "valid-anagram",
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "String • Hash Table",
    description: {
      text: "Given two strings s and t, return true if t is an anagram of s, and false otherwise.",
      notes: [
        "An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
      ],
    },
    examples: [
      {
        input: 's = "anagram", t = "nagaram"',
        output: "true",
      },
      {
        input: 's = "rat", t = "car"',
        output: "false",
      },
    ],
    constraints: [
      "1 ≤ s.length, t.length ≤ 5 * 10⁴",
      "s and t consist of lowercase English letters.",
    ],
    starterCode: {
      javascript: `function isAnagram(s, t) {
  // Write your solution here
  
}

// Test cases
console.log(isAnagram("anagram", "nagaram")); // Expected: true
console.log(isAnagram("rat", "car")); // Expected: false`,
      python: `def isAnagram(s, t):
    # Write your solution here
    pass

# Test cases
print(isAnagram("anagram", "nagaram"))  # Expected: True
print(isAnagram("rat", "car"))  # Expected: False`,
      java: `class Solution {
    public static boolean isAnagram(String s, String t) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isAnagram("anagram", "nagaram")); // Expected: true
        System.out.println(isAnagram("rat", "car")); // Expected: false
    }
}`,
      cpp: `#include <iostream>
#include <string>
#include <algorithm>

using namespace std;

class Solution {
public:
    bool isAnagram(string s, string t) {
        // Write your solution here
        
        return false;
    }
};

int main() {
    Solution sol;
    cout << (sol.isAnagram("anagram", "nagaram") ? "true" : "false") << endl;
    cout << (sol.isAnagram("rat", "car") ? "true" : "false") << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "true\nfalse",
      python: "True\nFalse",
      java: "true\nfalse",
      cpp: "true\nfalse",
    },
  },

  "best-time-to-buy-and-sell-stock": {
    id: "best-time-to-buy-and-sell-stock",
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Array • Dynamic Programming",
    description: {
      text: "You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve from this transaction. If you cannot achieve any profit, return 0.",
      notes: [],
    },
    examples: [
      {
        input: "prices = [7,1,5,3,6,4]",
        output: "5",
        explanation: "Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5. Note that buying on day 2 and selling on day 1 is not allowed because you must buy before you sell.",
      },
      {
        input: "prices = [7,6,4,3,1]",
        output: "0",
        explanation: "In this case, no transactions are done and the max profit = 0.",
      },
    ],
    constraints: [
      "1 ≤ prices.length ≤ 10⁵",
      "0 ≤ prices[i] ≤ 10⁴",
    ],
    starterCode: {
      javascript: `function maxProfit(prices) {
  // Write your solution here
  
}

// Test cases
console.log(maxProfit([7,1,5,3,6,4])); // Expected: 5
console.log(maxProfit([7,6,4,3,1])); // Expected: 0`,
      python: `def maxProfit(prices):
    # Write your solution here
    pass

# Test cases
print(maxProfit([7,1,5,3,6,4]))  # Expected: 5
print(maxProfit([7,6,4,3,1]))  # Expected: 0`,
      java: `class Solution {
    public static int maxProfit(int[] prices) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxProfit(new int[]{7,1,5,3,6,4})); // Expected: 5
        System.out.println(maxProfit(new int[]{7,6,4,3,1})); // Expected: 0
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    int maxProfit(vector<int>& prices) {
        // Write your solution here
        
        return 0;
    }
};

int main() {
    Solution sol;
    vector<int> p1 = {7, 1, 5, 3, 6, 4};
    cout << sol.maxProfit(p1) << endl;
    vector<int> p2 = {7, 6, 4, 3, 1};
    cout << sol.maxProfit(p2) << endl;
    return 0;
}`,
    },
    expectedOutput: {
      javascript: "5\n0",
      python: "5\n0",
      java: "5\n0",
      cpp: "5\n0",
    },
  },

  "product-of-array-except-self": {
    id: "product-of-array-except-self",
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Array • Prefix Sum",
    description: {
      text: "Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i].",
      notes: [
        "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.",
        "You must write an algorithm that runs in O(n) time and without using the division operation.",
      ],
    },
    examples: [
      {
        input: "nums = [1,2,3,4]",
        output: "[24,12,8,6]",
      },
      {
        input: "nums = [-1,1,0,-3,3]",
        output: "[0,0,9,0,0]",
      },
    ],
    constraints: [
      "2 ≤ nums.length ≤ 10⁵",
      "-30 ≤ nums[i] ≤ 30",
      "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.",
    ],
    starterCode: {
      javascript: `function productExceptSelf(nums) {
  // Write your solution here
  
}

// Test cases
console.log(JSON.stringify(productExceptSelf([1,2,3,4]))); // Expected: [24,12,8,6]
console.log(JSON.stringify(productExceptSelf([-1,1,0,-3,3]))); // Expected: [0,0,9,0,0]`,
      python: `import json
def productExceptSelf(nums):
    # Write your solution here
    pass

# Test cases
print(json.dumps(productExceptSelf([1,2,3,4]), separators=(',', ':')))  # Expected: [24,12,8,6]
print(json.dumps(productExceptSelf([-1,1,0,-3,3]), separators=(',', ':')))  # Expected: [0,0,9,0,0]`,
      java: `import java.util.*;

class Solution {
    public static int[] productExceptSelf(int[] nums) {
        // Write your solution here
        
        return new int[0];
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(productExceptSelf(new int[]{1,2,3,4}))); // Expected: [24, 12, 8, 6]
        System.out.println(Arrays.toString(productExceptSelf(new int[]{-1,1,0,-3,3}))); // Expected: [0, 0, 9, 0, 0]
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    vector<int> productExceptSelf(vector<int>& nums) {
        // Write your solution here
        
        return {};
    }
};

string vectorToString(vector<int> res) {
    string s = "[";
    for (int i = 0; i < res.size(); i++) {
        s += to_string(res[i]) + (i == res.size() - 1 ? "" : ",");
    }
    s += "]";
    return s;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> nums1 = {1, 2, 3, 4};
    cout << vectorToString(sol.productExceptSelf(nums1)) << endl;
    vector<int> nums2 = {-1, 1, 0, -3, 3};
    cout << vectorToString(sol.productExceptSelf(nums2)) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "[24,12,8,6]\n[0,0,9,0,0]",
      python: "[24,12,8,6]\n[0,0,9,0,0]",
      java: "[24, 12, 8, 6]\n[0, 0, 9, 0, 0]",
      cpp: "[24,12,8,6]\n[0,0,9,0,0]",
    },
  },

  "valid-parentheses": {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    difficulty: "Easy",
    category: "String • Stack",
    description: {
      text: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      notes: [
        "An input string is valid if:",
        "1. Open brackets must be closed by the same type of brackets.",
        "2. Open brackets must be closed in the correct order.",
        "3. Every close bracket has a corresponding open bracket of the same type.",
      ],
    },
    examples: [
      {
        input: 's = "()"',
        output: "true",
      },
      {
        input: 's = "()[]{}"',
        output: "true",
      },
      {
        input: 's = "(]"',
        output: "false",
      },
    ],
    constraints: [
      "1 ≤ s.length ≤ 10⁴",
      "s consists of parentheses only '()[]{}'.",
    ],
    starterCode: {
      javascript: `function isValid(s) {
  // Write your solution here
  
}

// Test cases
console.log(isValid("()")); // Expected: true
console.log(isValid("()[]{}")); // Expected: true
console.log(isValid("(]")); // Expected: false`,
      python: `def isValid(s):
    # Write your solution here
    pass

# Test cases
print(isValid("()"))  # Expected: True
print(isValid("()[]{}"))  # Expected: True
print(isValid("(]"))  # Expected: False`,
      java: `class Solution {
    public static boolean isValid(String s) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isValid("()")); // Expected: true
        System.out.println(isValid("()[]{}")); // Expected: true
        System.out.println(isValid("(]")); // Expected: false
    }
}`,
      cpp: `#include <iostream>
#include <string>
#include <stack>
#include <unordered_map>

using namespace std;

class Solution {
public:
    bool isValid(string s) {
        // Write your solution here
        
        return false;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << (sol.isValid("()") ? "true" : "false") << endl;
    cout << (sol.isValid("()[]{}") ? "true" : "false") << endl;
    cout << (sol.isValid("(]") ? "true" : "false") << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "true\ntrue\nfalse",
      python: "True\nTrue\nFalse",
      java: "true\ntrue\nfalse",
      cpp: "true\ntrue\nfalse",
    },
  },

  "number-of-islands": {
    id: "number-of-islands",
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Array • DFS • BFS",
    description: {
      text: "Given an m x n 2D binary grid grid which represents a map of '1's (land) and '0's (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically. You may assume all four edges of the grid are all surrounded by water.",
      notes: [],
    },
    examples: [
      {
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]',
        output: "1",
      },
      {
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]',
        output: "3",
      },
    ],
    constraints: [
      "m == grid.length",
      "n == grid[i].length",
      "1 ≤ m, n ≤ 300",
      "grid[i][j] is '0' or '1'.",
    ],
    starterCode: {
      javascript: `function numIslands(grid) {
  // Write your solution here
  
}

// Test cases
console.log(numIslands([["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]])); // Expected: 1
console.log(numIslands([["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]])); // Expected: 3`,
      python: `def numIslands(grid):
    # Write your solution here
    pass

# Test cases
print(numIslands([["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]))  # Expected: 1
print(numIslands([["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]))  # Expected: 3`,
      java: `class Solution {
    public static int numIslands(char[][] grid) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        char[][] g1 = {
            {'1','1','1','1','0'},
            {'1','1','0','1','0'},
            {'1','1','0','0','0'},
            {'0','0','0','0','0'}
        };
        System.out.println(numIslands(g1)); // Expected: 1
        
        char[][] g2 = {
            {'1','1','0','0','0'},
            {'1','1','0','0','0'},
            {'0','0','1','0','0'},
            {'0','0','0','1','1'}
        };
        System.out.println(numIslands(g2)); // Expected: 3
    }
}`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    int numIslands(vector<vector<char>>& grid) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<vector<char>> g1 = {
        {'1','1','1','1','0'},
        {'1','1','0','1','0'},
        {'1','1','0','0','0'},
        {'0','0','0','0','0'}
    };
    cout << sol.numIslands(g1) << endl;
    
    vector<vector<char>> g2 = {
        {'1','1','0','0','0'},
        {'1','1','0','0','0'},
        {'0','0','1','0','0'},
        {'0','0','0','1','1'}
    };
    cout << sol.numIslands(g2) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "1\n3",
      python: "1\n3",
      java: "1\n3",
      cpp: "1\n3",
    },
  },

  "rotate-image": {
    id: "rotate-image",
    title: "Rotate Image",
    difficulty: "Medium",
    category: "Array • Matrix",
    description: {
      text: "You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place, which means you have to modify the input 2D matrix directly. DO NOT allocate another 2D matrix and do the rotation.",
      notes: [],
    },
    examples: [
      {
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "[[7,4,1],[8,5,2],[9,6,3]]",
      },
      {
        input: "matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]",
        output: "[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]",
      },
    ],
    constraints: [
      "n == matrix.length == matrix[i].length",
      "1 ≤ n ≤ 20",
      "-1000 ≤ matrix[i][j] ≤ 1000",
    ],
    starterCode: {
      javascript: `function rotate(matrix) {
  // Write your solution here
  
}

// Test cases
let m1 = [[1,2,3],[4,5,6],[7,8,9]];
rotate(m1);
console.log(JSON.stringify(m1));
let m2 = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]];
rotate(m2);
console.log(JSON.stringify(m2));`,
      python: `import json
def rotate(matrix):
    # Write your solution here
    pass

# Test cases
m1 = [[1,2,3],[4,5,6],[7,8,9]]
rotate(m1)
print(json.dumps(m1, separators=(',', ':')))
m2 = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]
rotate(m2)
print(json.dumps(m2, separators=(',', ':')))`,
      java: `import java.util.*;

class Solution {
    public static void rotate(int[][] matrix) {
        // Write your solution here
        
    }
    
    public static void main(String[] args) {
        int[][] m1 = {{1,2,3},{4,5,6},{7,8,9}};
        rotate(m1);
        System.out.println(Arrays.deepToString(m1));
        
        int[][] m2 = {{5,1,9,11},{2,4,8,10},{13,3,6,7},{15,14,12,16}};
        rotate(m2);
        System.out.println(Arrays.deepToString(m2));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

class Solution {
public:
    void rotate(vector<vector<int>>& matrix) {
        // Write your solution here
        
    }
};

string matrixToString(vector<vector<int>>& m) {
    string s = "[";
    for(int i=0; i<m.size(); i++){
        s += "[";
        for(int j=0; j<m[i].size(); j++){
            s += to_string(m[i][j]) + (j==m[i].size()-1 ? "" : ",");
        }
        s += "]" + (i==m.size()-1 ? "" : ",");
    }
    s += "]";
    return s;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<vector<int>> m1 = {{1,2,3},{4,5,6},{7,8,9}};
    sol.rotate(m1);
    cout << matrixToString(m1) << endl;
    
    vector<vector<int>> m2 = {{5,1,9,11},{2,4,8,10},{13,3,6,7},{15,14,12,16}};
    sol.rotate(m2);
    cout << matrixToString(m2) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "[[7,4,1],[8,5,2],[9,6,3]]\n[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]",
      python: "[[7,4,1],[8,5,2],[9,6,3]]\n[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]",
      java: "[[7, 4, 1], [8, 5, 2], [9, 6, 3]]\n[[15, 13, 2, 5], [14, 3, 4, 1], [12, 6, 8, 9], [16, 7, 10, 11]]",
      cpp: "[[7,4,1],[8,5,2],[9,6,3]]\n[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]",
    },
  },

  "climbing-stairs": {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: {
      text: "You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?",
      notes: [],
    },
    examples: [
      {
        input: "n = 2",
        output: "2",
        explanation: "There are two ways to climb to the top: 1. 1 step + 1 step, 2. 2 steps",
      },
      {
        input: "n = 3",
        output: "3",
        explanation: "There are three ways to climb to the top: 1. 1 step + 1 step + 1 step, 2. 1 step + 2 steps, 3. 2 steps + 1 step",
      },
    ],
    constraints: [
      "1 ≤ n ≤ 45",
    ],
    starterCode: {
      javascript: `function climbStairs(n) {
  // Write your solution here
  
}

// Test cases
console.log(climbStairs(2)); // Expected: 2
console.log(climbStairs(3)); // Expected: 3
console.log(climbStairs(5)); // Expected: 8`,
      python: `def climbStairs(n):
    # Write your solution here
    pass

# Test cases
print(climbStairs(2))  # Expected: 2
print(climbStairs(3))  # Expected: 3
print(climbStairs(5))  # Expected: 8`,
      java: `class Solution {
    public static int climbStairs(int n) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(climbStairs(2)); // Expected: 2
        System.out.println(climbStairs(3)); // Expected: 3
        System.out.println(climbStairs(5)); // Expected: 8
    }
}`,
      cpp: `#include <iostream>

using namespace std;

class Solution {
public:
    int climbStairs(int n) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << sol.climbStairs(2) << endl;
    cout << sol.climbStairs(3) << endl;
    cout << sol.climbStairs(5) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "2\n3\n8",
      python: "2\n3\n8",
      java: "2\n3\n8",
      cpp: "2\n3\n8",
    },
  },

  "set-matrix-zeroes": {
    id: "set-matrix-zeroes",
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    category: "Array • Matrix",
    description: {
      text: "Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0's. You must do it in place.",
      notes: [],
    },
    examples: [
      {
        input: "matrix = [[1,1,1],[1,0,1],[1,1,1]]",
        output: "[[1,0,1],[0,0,0],[1,0,1]]",
      },
      {
        input: "matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]",
        output: "[[0,0,0,0],[0,4,5,0],[0,3,1,0]]",
      },
    ],
    constraints: [
      "m == matrix.length",
      "n == matrix[0].length",
      "1 ≤ m, n ≤ 200",
      "-2³¹ ≤ matrix[i][j] ≤ 2³¹ - 1",
    ],
    starterCode: {
      javascript: `function setZeroes(matrix) {
  // Write your solution here
  
}

// Test cases
let m1 = [[1,1,1],[1,0,1],[1,1,1]];
setZeroes(m1);
console.log(JSON.stringify(m1));
let m2 = [[0,1,2,0],[3,4,5,2],[1,3,1,5]];
setZeroes(m2);
console.log(JSON.stringify(m2));`,
      python: `import json
def setZeroes(matrix):
    # Write your solution here
    pass

# Test cases
m1 = [[1,1,1],[1,0,1],[1,1,1]]
setZeroes(m1)
print(json.dumps(m1, separators=(',', ':')))
m2 = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]
setZeroes(m2)
print(json.dumps(m2, separators=(',', ':')))`,
      java: `import java.util.*;

class Solution {
    public static void setZeroes(int[][] matrix) {
        // Write your solution here
        
    }
    
    public static void main(String[] args) {
        int[][] m1 = {{1,1,1},{1,0,1},{1,1,1}};
        setZeroes(m1);
        System.out.println(Arrays.deepToString(m1));
        
        int[][] m2 = {{0,1,2,0},{3,4,5,2},{1,3,1,5}};
        setZeroes(m2);
        System.out.println(Arrays.deepToString(m2));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    void setZeroes(vector<vector<int>>& matrix) {
        // Write your solution here
        
    }
};

string matrixToString(vector<vector<int>>& m) {
    string s = "[";
    for(int i=0; i<m.size(); i++){
        s += "[";
        for(int j=0; j<m[i].size(); j++){
            s += to_string(m[i][j]) + (j==m[i].size()-1 ? "" : ",");
        }
        s += "]" + (i==m.size()-1 ? "" : ",");
    }
    s += "]";
    return s;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<vector<int>> m1 = {{1,1,1},{1,0,1},{1,1,1}};
    sol.setZeroes(m1);
    cout << matrixToString(m1) << endl;
    
    vector<vector<int>> m2 = {{0,1,2,0},{3,4,5,2},{1,3,1,5}};
    sol.setZeroes(m2);
    cout << matrixToString(m2) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "[[1,0,1],[0,0,0],[1,0,1]]\n[[0,0,0,0],[0,4,5,0],[0,3,1,0]]",
      python: "[[1,0,1],[0,0,0],[1,0,1]]\n[[0,0,0,0],[0,4,5,0],[0,3,1,0]]",
      java: "[[1, 0, 1], [0, 0, 0], [1, 0, 1]]\n[[0, 0, 0, 0], [0, 4, 5, 0], [0, 3, 1, 0]]",
      cpp: "[[1,0,1],[0,0,0],[1,0,1]]\n[[0,0,0,0],[0,4,5,0],[0,3,1,0]]",
    },
  },

  "longest-common-prefix": {
    id: "longest-common-prefix",
    title: "Longest Common Prefix",
    difficulty: "Easy",
    category: "String",
    description: {
      text: "Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string \"\".",
      notes: [],
    },
    examples: [
      {
        input: "strs = [\"flower\",\"flow\",\"flight\"]",
        output: "\"fl\"",
      },
      {
        input: "strs = [\"dog\",\"racecar\",\"car\"]",
        output: "\"\"",
        explanation: "There is no common prefix among the input strings.",
      },
    ],
    constraints: [
      "1 ≤ strs.length ≤ 200",
      "0 ≤ strs[i].length ≤ 200",
      "strs[i] consists of only lowercase English letters.",
    ],
    starterCode: {
      javascript: `function longestCommonPrefix(strs) {
  // Write your solution here
  
}

// Test cases
console.log(longestCommonPrefix(["flower","flow","flight"])); // Expected: "fl"
console.log(longestCommonPrefix(["dog","racecar","car"])); // Expected: ""`,
      python: `def longestCommonPrefix(strs):
    # Write your solution here
    pass

# Test cases
print(longestCommonPrefix(["flower","flow","flight"]))  # Expected: "fl"
print(longestCommonPrefix(["dog","racecar","car"]))  # Expected: ""`,
      java: `class Solution {
    public static String longestCommonPrefix(String[] strs) {
        // Write your solution here
        
        return "";
    }
    
    public static void main(String[] args) {
        System.out.println(longestCommonPrefix(new String[]{"flower","flow","flight"})); // Expected: "fl"
        System.out.println(longestCommonPrefix(new String[]{"dog","racecar","car"})); // Expected: ""
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    string longestCommonPrefix(vector<string>& strs) {
        // Write your solution here
        
        return "";
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<string> s1 = {"flower","flow","flight"};
    cout << sol.longestCommonPrefix(s1) << endl;
    vector<string> s2 = {"dog","racecar","car"};
    cout << sol.longestCommonPrefix(s2) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "fl\n",
      python: "fl\n",
      java: "fl\n",
      cpp: "fl\n",
    },
  },

  "kth-largest-element-in-an-array": {
    id: "kth-largest-element-in-an-array",
    title: "Kth Largest Element in an Array",
    difficulty: "Medium",
    category: "Array • Heap • Sorting",
    description: {
      text: "Given an integer array nums and an integer k, return the kth largest element in the array. Note that it is the kth largest element in the sorted order, not the kth distinct element.",
      notes: [
        "Can you solve it without sorting in O(n) time complexity?",
      ],
    },
    examples: [
      {
        input: "nums = [3,2,1,5,6,4], k = 2",
        output: "5",
      },
      {
        input: "nums = [3,2,3,1,2,4,5,5,6], k = 4",
        output: "4",
      },
    ],
    constraints: [
      "1 ≤ k ≤ nums.length ≤ 10⁵",
      "-10⁴ ≤ nums[i] ≤ 10⁴",
    ],
    starterCode: {
      javascript: `function findKthLargest(nums, k) {
  // Write your solution here
  
}

// Test cases
console.log(findKthLargest([3,2,1,5,6,4], 2)); // Expected: 5
console.log(findKthLargest([3,2,3,1,2,4,5,5,6], 4)); // Expected: 4`,
      python: `def findKthLargest(nums, k):
    # Write your solution here
    pass

# Test cases
print(findKthLargest([3,2,1,5,6,4], 2))  # Expected: 5
print(findKthLargest([3,2,3,1,2,4,5,5,6], 4))  # Expected: 4`,
      java: `class Solution {
    public static int findKthLargest(int[] nums, int k) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(findKthLargest(new int[]{3,2,1,5,6,4}, 2)); // Expected: 5
        System.out.println(findKthLargest(new int[]{3,2,3,1,2,4,5,5,6}, 4)); // Expected: 4
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    int findKthLargest(vector<int>& nums, int k) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> n1 = {3, 2, 1, 5, 6, 4};
    cout << sol.findKthLargest(n1, 2) << endl;
    vector<int> n2 = {3, 2, 3, 1, 2, 4, 5, 5, 6};
    cout << sol.findKthLargest(n2, 4) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "5\n4",
      python: "5\n4",
      java: "5\n4",
      cpp: "5\n4",
    },
  },

  "search-a-2d-matrix": {
    id: "search-a-2d-matrix",
    title: "Search a 2D Matrix",
    difficulty: "Medium",
    category: "Array • Binary Search • Matrix",
    description: {
      text: "You are given an m x n integer matrix matrix with the following two properties: 1. Each row is sorted in non-decreasing order. 2. The first integer of each row is greater than the last integer of the previous row. Given an integer target, return true if target is in matrix or false otherwise. You must write a solution in O(log(m * n)) time complexity.",
      notes: [],
    },
    examples: [
      {
        input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 3",
        output: "true",
      },
      {
        input: "matrix = [[1,3,5,7],[10,11,16,20],[23,30,34,60]], target = 13",
        output: "false",
      },
    ],
    constraints: [
      "m == matrix.length",
      "n == matrix[i].length",
      "1 ≤ m, n ≤ 100",
      "-10⁴ ≤ matrix[i][j], target ≤ 10⁴",
    ],
    starterCode: {
      javascript: `function searchMatrix(matrix, target) {
  // Write your solution here
  
}

// Test cases
console.log(searchMatrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3)); // Expected: true
console.log(searchMatrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 13)); // Expected: false`,
      python: `def searchMatrix(matrix, target):
    # Write your solution here
    pass

# Test cases
print(searchMatrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 3))  # Expected: True
print(searchMatrix([[1,3,5,7],[10,11,16,20],[23,30,34,60]], 13))  # Expected: False`,
      java: `class Solution {
    public static boolean searchMatrix(int[][] matrix, int target) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        int[][] m1 = {{1,3,5,7},{10,11,16,20},{23,30,34,60}};
        System.out.println(searchMatrix(m1, 3)); // Expected: true
        System.out.println(searchMatrix(m1, 13)); // Expected: false
    }
}`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    bool searchMatrix(vector<vector<int>>& matrix, int target) {
        // Write your solution here
        
        return false;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<vector<int>> m1 = {{1,3,5,7},{10,11,16,20},{23,30,34,60}};
    cout << (sol.searchMatrix(m1, 3) ? "true" : "false") << endl;
    cout << (sol.searchMatrix(m1, 13) ? "true" : "false") << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "true\nfalse",
      python: "True\nFalse",
      java: "true\nfalse",
      cpp: "true\nfalse",
    },
  },

  "maximum-product-subarray": {
    id: "maximum-product-subarray",
    title: "Maximum Product Subarray",
    difficulty: "Medium",
    category: "Array • Dynamic Programming",
    description: {
      text: "Given an integer array nums, find a subarray that has the largest product, and return the product. The test cases are generated so that the answer will fit in a 32-bit integer.",
      notes: [],
    },
    examples: [
      {
        input: "nums = [2,3,-2,4]",
        output: "6",
        explanation: "[2,3] has the largest product 6.",
      },
      {
        input: "nums = [-2,0,-1]",
        output: "0",
        explanation: "The result cannot be 2, because [-2,-1] is not a subarray.",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 2 * 10⁴",
      "-10 ≤ nums[i] ≤ 10",
      "The product of any prefix or suffix of nums is guaranteed to fit in a 32-bit integer.",
    ],
    starterCode: {
      javascript: `function maxProduct(nums) {
  // Write your solution here
  
}

// Test cases
console.log(maxProduct([2,3,-2,4])); // Expected: 6
console.log(maxProduct([-2,0,-1])); // Expected: 0`,
      python: `def maxProduct(nums):
    # Write your solution here
    pass

# Test cases
print(maxProduct([2,3,-2,4]))  # Expected: 6
print(maxProduct([-2,0,-1]))  # Expected: 0`,
      java: `class Solution {
    public static int maxProduct(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(maxProduct(new int[]{2,3,-2,4})); // Expected: 6
        System.out.println(maxProduct(new int[]{-2,0,-1})); // Expected: 0
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    int maxProduct(vector<int>& nums) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> n1 = {2, 3, -2, 4};
    cout << sol.maxProduct(n1) << endl;
    vector<int> n2 = {-2, 0, -1};
    cout << sol.maxProduct(n2) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "6\n0",
      python: "6\n0",
      java: "6\n0",
      cpp: "6\n0",
    },
  },

  "jump-game": {
    id: "jump-game",
    title: "Jump Game",
    difficulty: "Medium",
    category: "Array • Dynamic Programming • Greedy",
    description: {
      text: "You are given an integer array nums. You are initially positioned at the array's first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.",
      notes: [],
    },
    examples: [
      {
        input: "nums = [2,3,1,1,4]",
        output: "true",
        explanation: "Jump 1 step from index 0 to 1, then 3 steps to the last index.",
      },
      {
        input: "nums = [3,2,1,0,4]",
        output: "false",
        explanation: "You will always arrive at index 3 no matter what. Its maximum jump length is 0, which makes it impossible to reach the last index.",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10⁴",
      "0 ≤ nums[i] ≤ 10⁵",
    ],
    starterCode: {
      javascript: `function canJump(nums) {
  // Write your solution here
  
}

// Test cases
console.log(canJump([2,3,1,1,4])); // Expected: true
console.log(canJump([3,2,1,0,4])); // Expected: false`,
      python: `def canJump(nums):
    # Write your solution here
    pass

# Test cases
print(canJump([2,3,1,1,4]))  # Expected: True
print(canJump([3,2,1,0,4]))  # Expected: False`,
      java: `class Solution {
    public static boolean canJump(int[] nums) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(canJump(new int[]{2,3,1,1,4})); // Expected: true
        System.out.println(canJump(new int[]{3,2,1,0,4})); // Expected: false
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    bool canJump(vector<int>& nums) {
        // Write your solution here
        
        return false;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> n1 = {2, 3, 1, 1, 4};
    cout << (sol.canJump(n1) ? "true" : "false") << endl;
    vector<int> n2 = {3, 2, 1, 0, 4};
    cout << (sol.canJump(n2) ? "true" : "false") << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "true\nfalse",
      python: "True\nFalse",
      java: "true\nfalse",
      cpp: "true\nfalse",
    },
  },

  "contains-duplicate": {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Array • Hash Table • Sorting",
    description: {
      text: "Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.",
      notes: [],
    },
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "true",
      },
      {
        input: "nums = [1,2,3,4]",
        output: "false",
      },
      {
        input: "nums = [1,1,1,3,3,4,3,2,4,2]",
        output: "true",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10⁵",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
    ],
    starterCode: {
      javascript: `function containsDuplicate(nums) {
  // Write your solution here
  
}

// Test cases
console.log(containsDuplicate([1,2,3,1])); // Expected: true
console.log(containsDuplicate([1,2,3,4])); // Expected: false
console.log(containsDuplicate([1,1,1,3,3,4,3,2,4,2])); // Expected: true`,
      python: `def containsDuplicate(nums):
    # Write your solution here
    pass

# Test cases
print(containsDuplicate([1,2,3,1]))  # Expected: True
print(containsDuplicate([1,2,3,4]))  # Expected: False
print(containsDuplicate([1,1,1,3,3,4,3,2,4,2]))  # Expected: True`,
      java: `import java.util.*;

class Solution {
    public static boolean containsDuplicate(int[] nums) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(containsDuplicate(new int[]{1,2,3,1})); // Expected: true
        System.out.println(containsDuplicate(new int[]{1,2,3,4})); // Expected: false
        System.out.println(containsDuplicate(new int[]{1,1,1,3,3,4,3,2,4,2})); // Expected: true
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_set>

using namespace std;

class Solution {
public:
    bool containsDuplicate(vector<int>& nums) {
        // Write your solution here
        
        return false;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> n1 = {1, 2, 3, 1};
    cout << (sol.containsDuplicate(n1) ? "true" : "false") << endl;
    vector<int> n2 = {1, 2, 3, 4};
    cout << (sol.containsDuplicate(n2) ? "true" : "false") << endl;
    vector<int> n3 = {1, 1, 1, 3, 3, 4, 3, 2, 4, 2};
    cout << (sol.containsDuplicate(n3) ? "true" : "false") << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "true\nfalse\ntrue",
      python: "True\nFalse\nTrue",
      java: "true\nfalse\ntrue",
      cpp: "true\nfalse\ntrue",
    },
  },

  "spiral-matrix": {
    id: "spiral-matrix",
    title: "Spiral Matrix",
    difficulty: "Medium",
    category: "Array • Matrix • Simulation",
    description: {
      text: "Given an m x n matrix, return all elements of the matrix in spiral order.",
      notes: [],
    },
    examples: [
      {
        input: "matrix = [[1,2,3],[4,5,6],[7,8,9]]",
        output: "[1,2,3,6,9,8,7,4,5]",
      },
      {
        input: "matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]",
        output: "[1,2,3,4,8,12,11,10,9,5,6,7]",
      },
    ],
    constraints: [
      "m == matrix.length",
      "n == matrix[i].length",
      "1 ≤ m, n ≤ 10",
      "-100 ≤ matrix[i][j] ≤ 100",
    ],
    starterCode: {
      javascript: `function spiralOrder(matrix) {
  // Write your solution here
  
}

// Test cases
console.log(JSON.stringify(spiralOrder([[1,2,3],[4,5,6],[7,8,9]]))); // Expected: [1,2,3,6,9,8,7,4,5]
console.log(JSON.stringify(spiralOrder([[1,2,3,4],[5,6,7,8],[9,10,11,12]]))); // Expected: [1,2,3,4,8,12,11,10,9,5,6,7]`,
      python: `import json
def spiralOrder(matrix):
    # Write your solution here
    pass

# Test cases
print(json.dumps(spiralOrder([[1,2,3],[4,5,6],[7,8,9]]), separators=(',', ':')))
print(json.dumps(spiralOrder([[1,2,3,4],[5,6,7,8],[9,10,11,12]]), separators=(',', ':')))`,
      java: `import java.util.*;

class Solution {
    public static List<Integer> spiralOrder(int[][] matrix) {
        // Write your solution here
        
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        int[][] m1 = {{1,2,3},{4,5,6},{7,8,9}};
        System.out.println(spiralOrder(m1));
        
        int[][] m2 = {{1,2,3,4},{5,6,7,8},{9,10,11,12}};
        System.out.println(spiralOrder(m2));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    vector<int> spiralOrder(vector<vector<int>>& matrix) {
        // Write your solution here
        
        return {};
    }
};

string vectorToString(vector<int> res) {
    string s = "[";
    for (int i = 0; i < res.size(); i++) {
        s += to_string(res[i]) + (i == res.size() - 1 ? "" : ",");
    }
    s += "]";
    return s;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<vector<int>> m1 = {{1,2,3},{4,5,6},{7,8,9}};
    cout << vectorToString(sol.spiralOrder(m1)) << endl;
    vector<vector<int>> m2 = {{1,2,3,4},{5,6,7,8},{9,10,11,12}};
    cout << vectorToString(sol.spiralOrder(m2)) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "[1,2,3,6,9,8,7,4,5]\n[1,2,3,4,8,12,11,10,9,5,6,7]",
      python: "[1,2,3,6,9,8,7,4,5]\n[1,2,3,4,8,12,11,10,9,5,6,7]",
      java: "[1, 2, 3, 6, 9, 8, 7, 4, 5]\n[1, 2, 3, 4, 8, 12, 11, 10, 9, 5, 6, 7]",
      cpp: "[1,2,3,6,9,8,7,4,5]\n[1,2,3,4,8,12,11,10,9,5,6,7]",
    },
  },

  "group-anagrams": {
    id: "group-anagrams",
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "Array • Hash Table • String",
    description: {
      text: "Given an array of strings strs, group the anagrams together. You can return the answer in any order.",
      notes: [
        "An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase, typically using all the original letters exactly once.",
      ],
    },
    examples: [
      {
        input: 'strs = ["eat","tea","tan","ate","nat","bat"]',
        output: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      },
    ],
    constraints: [
      "1 ≤ strs.length ≤ 10⁴",
      "0 ≤ strs[i].length ≤ 100",
      "strs[i] consists of lowercase English letters.",
    ],
    starterCode: {
      javascript: `function groupAnagrams(strs) {
  // Write your solution here
  
}

// Test cases (formatted for easy comparison)
const res = groupAnagrams(["eat","tea","tan","ate","nat","bat"]);
res.forEach(row => row.sort());
res.sort((a, b) => a.length - b.length || a[0].localeCompare(b[0]));
console.log(JSON.stringify(res));`,
      python: `import json
def groupAnagrams(strs):
    # Write your solution here
    pass

# Test cases
res = groupAnagrams(["eat","tea","tan","ate","nat","bat"])
for row in res: row.sort()
res.sort(key=lambda x: (len(x), x[0]))
print(json.dumps(res, separators=(',', ':')))`,
      java: `import java.util.*;

class Solution {
    public static List<List<String>> groupAnagrams(String[] strs) {
        // Write your solution here
        
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        List<List<String>> res = groupAnagrams(new String[]{"eat","tea","tan","ate","nat","bat"});
        for (List<String> row : res) Collections.sort(row);
        res.sort((a, b) -> a.size() != b.size() ? a.size() - b.size() : a.get(0).compareTo(b.get(0)));
        System.out.println(res);
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>
#include <map>

using namespace std;

class Solution {
public:
    vector<vector<string>> groupAnagrams(vector<string>& strs) {
        // Write your solution here
        
        return {};
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<string> s1 = {"eat","tea","tan","ate","nat","bat"};
    vector<vector<string>> res = sol.groupAnagrams(s1);
    for(auto& row : res) sort(row.begin(), row.end());
    sort(res.begin(), res.end(), [](const vector<string>& a, const vector<string>& b){
        return a.size() != b.size() ? a.size() < b.size() : a[0] < b[0];
    });
    
    cout << "[";
    for(int i=0; i<res.size(); i++){
        cout << "[";
        for(int j=0; j<res[i].size(); j++) cout << "\\"" << res[i][j] << "\\"" << (j==res[i].size()-1 ? "" : ",");
        cout << "]" << (i==res.size()-1 ? "" : ",");
    }
    cout << "]" << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      python: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
      java: "[[\"bat\"], [\"nat\", \"tan\"], [\"ate\", \"eat\", \"tea\"]]",
      cpp: '[["bat"],["nat","tan"],["ate","eat","tea"]]',
    },
  },

  "longest-palindromic-substring": {
    id: "longest-palindromic-substring",
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    category: "String • Dynamic Programming",
    description: {
      text: "Given a string s, return the longest palindromic substring in s.",
      notes: [],
    },
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"aba" is also a valid answer.',
      },
      {
        input: 's = "cbbd"',
        output: '"bb"',
      },
    ],
    constraints: [
      "1 ≤ s.length ≤ 1000",
      "s consists of only digits and English letters.",
    ],
    starterCode: {
      javascript: `function longestPalindrome(s) {
  // Write your solution here
  
}

// Test cases
console.log(longestPalindrome("babad"));
console.log(longestPalindrome("cbbd"));`,
      python: `def longestPalindrome(s):
    # Write your solution here
    pass

# Test cases
print(longestPalindrome("babad"))
print(longestPalindrome("cbbd"))`,
      java: `class Solution {
    public static String longestPalindrome(String s) {
        // Write your solution here
        
        return "";
    }
    
    public static void main(String[] args) {
        System.out.println(longestPalindrome("babad"));
        System.out.println(longestPalindrome("cbbd"));
    }
}`,
      cpp: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    string longestPalindrome(string s) {
        // Write your solution here
        
        return "";
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << sol.longestPalindrome("babad") << endl;
    cout << sol.longestPalindrome("cbbd") << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "bab\nbb",
      python: "bab\nbb",
      java: "bab\nbb",
      cpp: "bab\nbb",
    },
  },

  "merge-sorted-array": {
    id: "merge-sorted-array",
    title: "Merge Sorted Array",
    difficulty: "Easy",
    category: "Array • Two Pointers • Sorting",
    description: {
      text: "You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums1 and nums2 into a single array sorted in non-decreasing order. The final sorted array should not be returned by the function, but instead be stored inside the array nums1. To accommodate this, nums1 has a length of m + n, where the first m elements denote the elements that should be merged, and the last n elements are set to 0 and should be ignored. nums2 has a length of n.",
      notes: [],
    },
    examples: [
      {
        input: "nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3",
        output: "[1,2,2,3,5,6]",
      },
    ],
    starterCode: {
      javascript: `function merge(nums1, m, nums2, n) {
  // Write your solution here
  
}

// Test cases
let n1 = [1,2,3,0,0,0];
merge(n1, 3, [2,5,6], 3);
console.log(JSON.stringify(n1));`,
      python: `import json
def merge(nums1, m, nums2, n):
    # Write your solution here
    pass

# Test cases
n1 = [1,2,3,0,0,0]
merge(n1, 3, [2,5,6], 3)
print(json.dumps(n1, separators=(',', ':')))`,
      java: `import java.util.*;

class Solution {
    public static void merge(int[] nums1, int m, int[] nums2, int n) {
        // Write your solution here
        
    }
    
    public static void main(String[] args) {
        int[] n1 = {1,2,3,0,0,0};
        merge(n1, 3, new int[]{2,5,6}, 3);
        System.out.println(Arrays.toString(n1));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {
        // Write your solution here
        
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> n1 = {1, 2, 3, 0, 0, 0};
    vector<int> n2 = {2, 5, 6};
    sol.merge(n1, 3, n2, 3);
    cout << "[";
    for(int i=0; i<n1.size(); i++) cout << n1[i] << (i==n1.size()-1 ? "" : ",");
    cout << "]" << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "[1,2,2,3,5,6]",
      python: "[1,2,2,3,5,6]",
      java: "[1, 2, 2, 3, 5, 6]",
      cpp: "[1,2,2,3,5,6]",
    },
  },

  "valid-sudoku": {
    id: "valid-sudoku",
    title: "Valid Sudoku",
    difficulty: "Medium",
    category: "Array • Hash Table • Matrix",
    description: {
      text: "Determine if a 9 x 9 Sudoku board is valid. Only the filled cells need to be validated according to the following rules: 1. Each row must contain the digits 1-9 without repetition. 2. Each column must contain the digits 1-9 without repetition. 3. Each of the nine 3 x 3 sub-boxes of the grid must contain the digits 1-9 without repetition.",
      notes: [
        "A Sudoku board (partially filled) could be valid but is not necessarily solvable.",
        "Only the filled cells need to be validated according to the mentioned rules.",
      ],
    },
    examples: [
      {
        input: 'board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".",","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]',
        output: "true",
      },
    ],
    starterCode: {
      javascript: `function isValidSudoku(board) {
  // Write your solution here
  
}

// Test cases
const b1 = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]];
console.log(isValidSudoku(b1));`,
      python: `def isValidSudoku(board):
    # Write your solution here
    pass

# Test cases
b1 = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]
print(isValidSudoku(b1))`,
      java: `class Solution {
    public static boolean isValidSudoku(char[][] board) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        char[][] b1 = {{'5','3','.','.','7','.','.','.','.'},{'6','.','.','1','9','5','.','.','.'},{'.','9','8','.','.','.','.','6','.'},{'8','.','.','.','6','.','.','.','3'},{'4','.','.','8','.','3','.','.','1'},{'7','.','.','.','2','.','.','.','6'},{'.','6','.','.','.','.','2','8','.'},{'.','.','.','4','1','9','.','.','5'},{'.','.','.','.','8','.','.','7','9'}};
        System.out.println(isValidSudoku(b1));
    }
}`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    bool isValidSudoku(vector<vector<char>>& board) {
        // Write your solution here
        
        return false;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<vector<char>> b1 = {{'5','3','.','.','7','.','.','.','.'},{'6','.','.','1','9','5','.','.','.'},{'.','9','8','.','.','.','.','6','.'},{'8','.','.','.','6','.','.','.','3'},{'4','.','.','8','.','3','.','.','1'},{'7','.','.','.','2','.','.','.','6'},{'.','6','.','.','.','.','2','8','.'},{'.','.','.','4','1','9','.','.','5'},{'.','.','.','.','8','.','.','7','9'}};
    cout << (sol.isValidSudoku(b1) ? "true" : "false") << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "true",
      python: "True",
      java: "true",
      cpp: "true",
    },
  },

  "house-robber": {
    id: "house-robber",
    title: "House Robber",
    difficulty: "Medium",
    category: "Array • Dynamic Programming",
    description: {
      text: "You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed, the only constraint stopping you from robbing each of them is that adjacent houses have security systems connected and it will automatically contact the police if two adjacent houses were broken into on the same night. Given an integer array nums representing the amount of money of each house, return the maximum amount of money you can rob tonight without alerting the police.",
      notes: [],
    },
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "4",
        explanation: "Rob house 1 (money = 1) and then rob house 3 (money = 3). Total amount = 1 + 3 = 4.",
      },
      {
        input: "nums = [2,7,9,3,1]",
        output: "12",
        explanation: "Rob house 1 (money = 2), rob house 3 (money = 9) and rob house 5 (money = 1). Total amount = 2 + 9 + 1 = 12.",
      },
    ],
    starterCode: {
      javascript: `function rob(nums) {
  // Write your solution here
  
}

// Test cases
console.log(rob([1,2,3,1])); // Expected: 4
console.log(rob([2,7,9,3,1])); // Expected: 12`,
      python: `def rob(nums):
    # Write your solution here
    pass

# Test cases
print(rob([1,2,3,1]))  # Expected: 4
print(rob([2,7,9,3,1]))  # Expected: 12`,
      java: `class Solution {
    public static int rob(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(rob(new int[]{1,2,3,1})); // Expected: 4
        System.out.println(rob(new int[]{2,7,9,3,1})); // Expected: 12
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    int rob(vector<int>& nums) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> n1 = {1, 2, 3, 1};
    cout << sol.rob(n1) << endl;
    vector<int> n2 = {2, 7, 9, 3, 1};
    cout << sol.rob(n2) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "4\n12",
      python: "4\n12",
      java: "4\n12",
      cpp: "4\n12",
    },
  },

  "find-all-anagrams-in-a-string": {
    id: "find-all-anagrams-in-a-string",
    title: "Find All Anagrams in a String",
    difficulty: "Medium",
    category: "String • Sliding Window • Hash Table",
    description: {
      text: "Given two strings s and p, return an array of all the start indices of p's anagrams in s. You may return the answer in any order.",
      notes: [],
    },
    examples: [
      {
        input: 's = "cbaebabacd", p = "abc"',
        output: "[0,6]",
        explanation: "The substring with start index = 0 is \"cba\", which is an anagram of \"abc\". The substring with start index = 6 is \"bac\", which is an anagram of \"abc\".",
      },
      {
        input: 's = "abab", p = "ab"',
        output: "[0,1,2]",
        explanation: "The substring with start index = 0 is \"ab\", which is an anagram of \"ab\". The substring with start index = 1 is \"ba\", which is an anagram of \"ab\". The substring with start index = 2 is \"ab\", which is an anagram of \"ab\".",
      },
    ],
    constraints: [
      "1 ≤ s.length, p.length ≤ 3 * 10⁴",
      "s and p consist of lowercase English letters.",
    ],
    starterCode: {
      javascript: `function findAnagrams(s, p) {
  // Write your solution here
  
}

// Test cases
console.log(JSON.stringify(findAnagrams("cbaebabacd", "abc"))); // Expected: [0,6]
console.log(JSON.stringify(findAnagrams("abab", "ab"))); // Expected: [0,1,2]`,
      python: `import json
def findAnagrams(s, p):
    # Write your solution here
    pass

# Test cases
print(json.dumps(findAnagrams("cbaebabacd", "abc"), separators=(',', ':')))  # Expected: [0,6]
print(json.dumps(findAnagrams("abab", "ab"), separators=(',', ':')))  # Expected: [0,1,2]`,
      java: `import java.util.*;

class Solution {
    public static List<Integer> findAnagrams(String s, String p) {
        // Write your solution here
        
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        System.out.println(findAnagrams("cbaebabacd", "abc"));
        System.out.println(findAnagrams("abab", "ab"));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    vector<int> findAnagrams(string s, string p) {
        // Write your solution here
        
        return {};
    }
};

string vectorToString(vector<int> res) {
    string s = "[";
    for (int i = 0; i < res.size(); i++) {
        s += to_string(res[i]) + (i == res.size() - 1 ? "" : ",");
    }
    s += "]";
    return s;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << vectorToString(sol.findAnagrams("cbaebabacd", "abc")) << endl;
    cout << vectorToString(sol.findAnagrams("abab", "ab")) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "[0,6]\n[0,1,2]",
      python: "[0,6]\n[0,1,2]",
      java: "[0, 6]\n[0, 1, 2]",
      cpp: "[0,6]\n[0,1,2]",
    },
  },

  "non-overlapping-intervals": {
    id: "non-overlapping-intervals",
    title: "Non-overlapping Intervals",
    difficulty: "Medium",
    category: "Array • Greedy • Sorting",
    description: {
      text: "Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.",
      notes: [],
    },
    examples: [
      {
        input: "intervals = [[1,2],[2,3],[3,4],[1,3]]",
        output: "1",
        explanation: "[1,3] can be removed and the rest of the intervals are non-overlapping.",
      },
      {
        input: "intervals = [[1,2],[1,2],[1,2]]",
        output: "2",
      },
    ],
    constraints: [
      "1 ≤ intervals.length ≤ 10⁵",
      "intervals[i].length == 2",
      "-5 * 10⁴ ≤ starti < endi ≤ 5 * 10⁴",
    ],
    starterCode: {
      javascript: `function eraseOverlapIntervals(intervals) {
  // Write your solution here
  
}

// Test cases
console.log(eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]])); // Expected: 1
console.log(eraseOverlapIntervals([[1,2],[1,2],[1,2]])); // Expected: 2`,
      python: `def eraseOverlapIntervals(intervals):
    # Write your solution here
    pass

# Test cases
print(eraseOverlapIntervals([[1,2],[2,3],[3,4],[1,3]]))  # Expected: 1
print(eraseOverlapIntervals([[1,2],[1,2],[1,2]]))  # Expected: 2`,
      java: `import java.util.*;

class Solution {
    public static int eraseOverlapIntervals(int[][] intervals) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        int[][] i1 = {{1,2},{2,3},{3,4},{1,3}};
        System.out.println(eraseOverlapIntervals(i1));
        
        int[][] i2 = {{1,2},{1,2},{1,2}};
        System.out.println(eraseOverlapIntervals(i2));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    int eraseOverlapIntervals(vector<vector<int>>& intervals) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<vector<int>> i1 = {{1,2},{2,3},{3,4},{1,3}};
    cout << sol.eraseOverlapIntervals(i1) << endl;
    
    vector<vector<int>> i2 = {{1,2},{1,2},{1,2}};
    cout << sol.eraseOverlapIntervals(i2) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "1\n2",
      python: "1\n2",
      java: "1\n2",
      cpp: "1\n2",
    },
  },

  "valid-palindrome-ii": {
    id: "valid-palindrome-ii",
    title: "Valid Palindrome II",
    difficulty: "Easy",
    category: "String • Two Pointers",
    description: {
      text: "Given a string s, return true if the s can be palindrome after deleting at most one character from it.",
      notes: [],
    },
    examples: [
      {
        input: 's = "aba"',
        output: "true",
      },
      {
        input: 's = "abca"',
        output: "true",
        explanation: "You could delete the character 'c'.",
      },
      {
        input: 's = "abc"',
        output: "false",
      },
    ],
    constraints: [
      "1 ≤ s.length ≤ 10⁵",
      "s consists of lowercase English letters.",
    ],
    starterCode: {
      javascript: `function validPalindrome(s) {
  // Write your solution here
  
}

// Test cases
console.log(validPalindrome("aba")); // Expected: true
console.log(validPalindrome("abca")); // Expected: true
console.log(validPalindrome("abc")); // Expected: false`,
      python: `def validPalindrome(s):
    # Write your solution here
    pass

# Test cases
print(validPalindrome("aba"))  # Expected: True
print(validPalindrome("abca"))  # Expected: True
print(validPalindrome("abc"))  # Expected: False`,
      java: `class Solution {
    public static boolean validPalindrome(String s) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(validPalindrome("aba"));
        System.out.println(validPalindrome("abca"));
        System.out.println(validPalindrome("abc"));
    }
}`,
      cpp: `#include <iostream>
#include <string>

using namespace std;

class Solution {
public:
    bool validPalindrome(string s) {
        // Write your solution here
        
        return false;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << (sol.validPalindrome("aba") ? "true" : "false") << endl;
    cout << (sol.validPalindrome("abca") ? "true" : "false") << endl;
    cout << (sol.validPalindrome("abc") ? "true" : "false") << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "true\ntrue\nfalse",
      python: "True\nTrue\nFalse",
      java: "true\ntrue\nfalse",
      cpp: "true\ntrue\nfalse",
    },
  },

  "single-number": {
    id: "single-number",
    title: "Single Number",
    difficulty: "Easy",
    category: "Array • Bit Manipulation",
    description: {
      text: "Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.",
      notes: [],
    },
    examples: [
      {
        input: "nums = [2,2,1]",
        output: "1",
      },
      {
        input: "nums = [4,1,2,1,2]",
        output: "4",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 3 * 10⁴",
      "-3 * 10⁴ ≤ nums[i] ≤ 3 * 10⁴",
      "Each element in the array appears twice except for one element which appears only once.",
    ],
    starterCode: {
      javascript: `function singleNumber(nums) {
  // Write your solution here
  
}

// Test cases
console.log(singleNumber([2,2,1])); // Expected: 1
console.log(singleNumber([4,1,2,1,2])); // Expected: 4`,
      python: `def singleNumber(nums):
    # Write your solution here
    pass

# Test cases
print(singleNumber([2,2,1]))  # Expected: 1
print(singleNumber([4,1,2,1,2]))  # Expected: 4`,
      java: `class Solution {
    public static int singleNumber(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(singleNumber(new int[]{2,2,1}));
        System.out.println(singleNumber(new int[]{4,1,2,1,2}));
    }
}`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    int singleNumber(vector<int>& nums) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> n1 = {2, 2, 1};
    cout << sol.singleNumber(n1) << endl;
    vector<int> n2 = {4, 1, 2, 1, 2};
    cout << sol.singleNumber(n2) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "1\n4",
      python: "1\n4",
      java: "1\n4",
      cpp: "1\n4",
    },
  },

  "minimum-window-substring": {
    id: "minimum-window-substring",
    title: "Minimum Window Substring",
    difficulty: "Hard",
    category: "String • Sliding Window • Hash Table",
    description: {
      text: "Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string \"\". The testcases will be generated such that the answer is unique.",
      notes: [],
    },
    examples: [
      {
        input: 's = "ADOBECODEBANC", t = "ABC"',
        output: '"BANC"',
      },
      {
        input: 's = "a", t = "a"',
        output: '"a"',
      },
      {
        input: 's = "a", t = "aa"',
        output: '""',
      },
    ],
    starterCode: {
      javascript: `function minWindow(s, t) {
  // Write your solution here
  
}

// Test cases
console.log(minWindow("ADOBECODEBANC", "ABC")); // Expected: "BANC"
console.log(minWindow("a", "a")); // Expected: "a"
console.log(minWindow("a", "aa")); // Expected: ""`,
      python: `def minWindow(s, t):
    # Write your solution here
    pass

# Test cases
print(minWindow("ADOBECODEBANC", "ABC"))  # Expected: "BANC"
print(minWindow("a", "a"))  # Expected: "a"
print(minWindow("a", "aa"))  # Expected: ""`,
      java: `class Solution {
    public static String minWindow(String s, String t) {
        // Write your solution here
        
        return "";
    }
    
    public static void main(String[] args) {
        System.out.println(minWindow("ADOBECODEBANC", "ABC"));
        System.out.println(minWindow("a", "a"));
        System.out.println(minWindow("a", "aa"));
    }
}`,
      cpp: `#include <iostream>
#include <string>
#include <vector>
#include <unordered_map>

using namespace std;

class Solution {
public:
    string minWindow(string s, string t) {
        // Write your solution here
        
        return "";
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << sol.minWindow("ADOBECODEBANC", "ABC") << endl;
    cout << sol.minWindow("a", "a") << endl;
    cout << sol.minWindow("a", "aa") << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "BANC\na\n",
      python: "BANC\na\n",
      java: "BANC\na\n",
      cpp: "BANC\na\n",
    },
  },

  "subarray-sum-equals-k": {
    id: "subarray-sum-equals-k",
    title: "Subarray Sum Equals K",
    difficulty: "Medium",
    category: "Array • Hash Table",
    description: {
      text: "Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.",
      notes: [
        "A subarray is a contiguous non-empty sequence of elements within an array.",
      ],
    },
    examples: [
      {
        input: "nums = [1,1,1], k = 2",
        output: "2",
      },
      {
        input: "nums = [1,2,3], k = 3",
        output: "2",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 2 * 10⁴",
      "-1000 ≤ nums[i] ≤ 1000",
      "-10⁷ ≤ k ≤ 10⁷",
    ],
    starterCode: {
      javascript: `function subarraySum(nums, k) {
  // Write your solution here
  
}

// Test cases
console.log(subarraySum([1,1,1], 2)); // Expected: 2
console.log(subarraySum([1,2,3], 3)); // Expected: 2`,
      python: `def subarraySum(nums, k):
    # Write your solution here
    pass

# Test cases
print(subarraySum([1,1,1], 2))  # Expected: 2
print(subarraySum([1,2,3], 3))  # Expected: 2`,
      java: `import java.util.*;

class Solution {
    public static int subarraySum(int[] nums, int k) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(subarraySum(new int[]{1,1,1}, 2));
        System.out.println(subarraySum(new int[]{1,2,3}, 3));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

class Solution {
public:
    int subarraySum(vector<int>& nums, int k) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> n1 = {1, 1, 1};
    cout << sol.subarraySum(n1, 2) << endl;
    vector<int> n2 = {1, 2, 3};
    cout << sol.subarraySum(n2, 3) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "2\n2",
      python: "2\n2",
      java: "2\n2",
      cpp: "2\n2",
    },
  },

  "word-break": {
    id: "word-break",
    title: "Word Break",
    difficulty: "Medium",
    category: "Dynamic Programming • Hash Table",
    description: {
      text: "Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.",
      notes: [
        "Note that the same word in the dictionary may be reused multiple times in the segmentation.",
      ],
    },
    examples: [
      {
        input: 's = "leetcode", wordDict = ["leet","code"]',
        output: "true",
        explanation: "Return true because \"leetcode\" can be segmented as \"leet code\".",
      },
      {
        input: 's = "applepenapple", wordDict = ["apple","pen"]',
        output: "true",
        explanation: "Return true because \"applepenapple\" can be segmented as \"apple pen apple\".",
      },
    ],
    constraints: [
      "1 ≤ s.length ≤ 300",
      "1 ≤ wordDict.length ≤ 1000",
      "1 ≤ wordDict[i].length ≤ 20",
    ],
    starterCode: {
      javascript: `function wordBreak(s, wordDict) {
  // Write your solution here
  
}

// Test cases
console.log(wordBreak("leetcode", ["leet","code"])); // Expected: true
console.log(wordBreak("applepenapple", ["apple","pen"])); // Expected: true`,
      python: `def wordBreak(s, wordDict):
    # Write your solution here
    pass

# Test cases
print(wordBreak("leetcode", ["leet","code"]))  # Expected: True
print(wordBreak("applepenapple", ["apple","pen"]))  # Expected: True`,
      java: `import java.util.*;

class Solution {
    public static boolean wordBreak(String s, List<String> wordDict) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(wordBreak("leetcode", Arrays.asList("leet","code")));
        System.out.println(wordBreak("applepenapple", Arrays.asList("apple","pen")));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <unordered_set>

using namespace std;

class Solution {
public:
    bool wordBreak(string s, vector<string>& wordDict) {
        // Write your solution here
        
        return false;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<string> d1 = {"leet","code"};
    cout << (sol.wordBreak("leetcode", d1) ? "true" : "false") << endl;
    vector<string> d2 = {"apple","pen"};
    cout << (sol.wordBreak("applepenapple", d2) ? "true" : "false") << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "true\ntrue",
      python: "True\nTrue",
      java: "true\ntrue",
      cpp: "true\ntrue",
    },
  },

  "daily-temperatures": {
    id: "daily-temperatures",
    title: "Daily Temperatures",
    difficulty: "Medium",
    category: "Array • Stack • Monotonic Stack",
    description: {
      text: "Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0 instead.",
      notes: [],
    },
    examples: [
      {
        input: "temperatures = [73,74,75,71,69,72,76,73]",
        output: "[1,1,4,2,1,1,0,0]",
      },
      {
        input: "temperatures = [30,40,50,60]",
        output: "[1,1,1,0]",
      },
    ],
    starterCode: {
      javascript: `function dailyTemperatures(temperatures) {
  // Write your solution here
  
}

// Test cases
console.log(JSON.stringify(dailyTemperatures([73,74,75,71,69,72,76,73]))); // Expected: [1,1,4,2,1,1,0,0]
console.log(JSON.stringify(dailyTemperatures([30,40,50,60]))); // Expected: [1,1,1,0]`,
      python: `import json
def dailyTemperatures(temperatures):
    # Write your solution here
    pass

# Test cases
print(json.dumps(dailyTemperatures([73,74,75,71,69,72,76,73]), separators=(',', ':')))
print(json.dumps(dailyTemperatures([30,40,50,60]), separators=(',', ':')))`,
      java: `import java.util.*;

class Solution {
    public static int[] dailyTemperatures(int[] temperatures) {
        // Write your solution here
        
        return new int[0];
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(dailyTemperatures(new int[]{73,74,75,71,69,72,76,73})));
        System.out.println(Arrays.toString(dailyTemperatures(new int[]{30,40,50,60})));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <stack>
#include <string>

using namespace std;

class Solution {
public:
    vector<int> dailyTemperatures(vector<int>& temperatures) {
        // Write your solution here
        
        return {};
    }
};

string vectorToString(vector<int> res) {
    string s = "[";
    for (int i = 0; i < res.size(); i++) {
        s += to_string(res[i]) + (i == res.size() - 1 ? "" : ",");
    }
    s += "]";
    return s;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> t1 = {73,74,75,71,69,72,76,73};
    cout << vectorToString(sol.dailyTemperatures(t1)) << endl;
    vector<int> t2 = {30,40,50,60};
    cout << vectorToString(sol.dailyTemperatures(t2)) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "[1,1,4,2,1,1,0,0]\n[1,1,1,0]",
      python: "[1,1,4,2,1,1,0,0]\n[1,1,1,0]",
      java: "[1, 1, 4, 2, 1, 1, 0, 0]\n[1, 1, 1, 0]",
      cpp: "[1,1,4,2,1,1,0,0]\n[1,1,1,0]",
    },
  },

  "sort-colors": {
    id: "sort-colors",
    title: "Sort Colors",
    difficulty: "Medium",
    category: "Array • Two Pointers • Sorting",
    description: {
      text: "Given an array nums with n objects colored red, white, or blue, sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue. We will use the integers 0, 1, and 2 to represent the color red, white, and blue, respectively. You must solve this problem without using the library's sort function.",
      notes: [],
    },
    examples: [
      {
        input: "nums = [2,0,2,1,1,0]",
        output: "[0,0,1,1,2,2]",
      },
      {
        input: "nums = [2,0,1]",
        output: "[0,1,2]",
      },
    ],
    starterCode: {
      javascript: `function sortColors(nums) {
  // Write your solution here
  
}

// Test cases
let n1 = [2,0,2,1,1,0];
sortColors(n1);
console.log(JSON.stringify(n1));
let n2 = [2,0,1];
sortColors(n2);
console.log(JSON.stringify(n2));`,
      python: `import json
def sortColors(nums):
    # Write your solution here
    pass

# Test cases
n1 = [2,0,2,1,1,0]
sortColors(n1)
print(json.dumps(n1, separators=(',', ':')))
n2 = [2,0,1]
sortColors(n2)
print(json.dumps(n2, separators=(',', ':')))`,
      java: `import java.util.*;

class Solution {
    public static void sortColors(int[] nums) {
        // Write your solution here
        
    }
    
    public static void main(String[] args) {
        int[] n1 = {2,0,2,1,1,0};
        sortColors(n1);
        System.out.println(Arrays.toString(n1));
        
        int[] n2 = {2,0,1};
        sortColors(n2);
        System.out.println(Arrays.toString(n2));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    void sortColors(vector<int>& nums) {
        // Write your solution here
        
    }
};

string vectorToString(vector<int> res) {
    string s = "[";
    for (int i = 0; i < res.size(); i++) {
        s += to_string(res[i]) + (i == res.size() - 1 ? "" : ",");
    }
    s += "]";
    return s;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> n1 = {2,0,2,1,1,0};
    sol.sortColors(n1);
    cout << vectorToString(n1) << endl;
    vector<int> n2 = {2,0,1};
    sol.sortColors(n2);
    cout << vectorToString(n2) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "[0,0,1,1,2,2]\n[0,1,2]",
      python: "[0,0,1,1,2,2]\n[0,1,2]",
      java: "[0, 0, 1, 1, 2, 2]\n[0, 1, 2]",
      cpp: "[0,0,1,1,2,2]\n[0,1,2]",
    },
  },

  "unique-paths": {
    id: "unique-paths",
    title: "Unique Paths",
    difficulty: "Medium",
    category: "Dynamic Programming • Combinatorics",
    description: {
      text: "There is a robot on an m x n grid. The robot is initially located at the top-left corner. The robot tries to move to the bottom-right corner. The robot can only move either down or right at any point in time. Given the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.",
      notes: [],
    },
    examples: [
      {
        input: "m = 3, n = 7",
        output: "28",
      },
      {
        input: "m = 3, n = 2",
        output: "3",
        explanation: "From the top-left corner, there are a total of 3 ways to reach the bottom-right corner: 1. Right -> Down -> Down, 2. Down -> Down -> Right, 3. Down -> Right -> Down",
      },
    ],
    starterCode: {
      javascript: `function uniquePaths(m, n) {
  // Write your solution here
  
}

// Test cases
console.log(uniquePaths(3, 7)); // Expected: 28
console.log(uniquePaths(3, 2)); // Expected: 3`,
      python: `def uniquePaths(m, n):
    # Write your solution here
    pass

# Test cases
print(uniquePaths(3, 7))  # Expected: 28
print(uniquePaths(3, 2))  # Expected: 3`,
      java: `class Solution {
    public static int uniquePaths(int m, int n) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(uniquePaths(3, 7));
        System.out.println(uniquePaths(3, 2));
    }
}`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    int uniquePaths(int m, int n) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << sol.uniquePaths(3, 7) << endl;
    cout << sol.uniquePaths(3, 2) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "28\n3",
      python: "28\n3",
      java: "28\n3",
      cpp: "28\n3",
    },
  },

  "binary-search": {
    id: "binary-search",
    title: "Binary Search",
    difficulty: "Easy",
    category: "Array • Binary Search",
    description: {
      text: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1. You must write an algorithm with O(log n) runtime complexity.",
      notes: [],
    },
    examples: [
      {
        input: "nums = [-1,0,3,5,9,12], target = 9",
        output: "4",
        explanation: "9 exists in nums and its index is 4",
      },
      {
        input: "nums = [-1,0,3,5,9,12], target = 2",
        output: "-1",
        explanation: "2 does not exist in nums so return -1",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10⁴",
      "-10⁴ < nums[i], target < 10⁴",
      "All the integers in nums are unique.",
      "nums is sorted in ascending order.",
    ],
    starterCode: {
      javascript: `function search(nums, target) {
  // Write your solution here
  
}

// Test cases
console.log(search([-1,0,3,5,9,12], 9)); // Expected: 4
console.log(search([-1,0,3,5,9,12], 2)); // Expected: -1`,
      python: `def search(nums, target):
    # Write your solution here
    pass

# Test cases
print(search([-1,0,3,5,9,12], 9))  # Expected: 4
print(search([-1,0,3,5,9,12], 2))  # Expected: -1`,
      java: `class Solution {
    public static int search(int[] nums, int target) {
        // Write your solution here
        
        return -1;
    }
    
    public static void main(String[] args) {
        System.out.println(search(new int[]{-1,0,3,5,9,12}, 9));
        System.out.println(search(new int[]{-1,0,3,5,9,12}, 2));
    }
}`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    int search(vector<int>& nums, int target) {
        // Write your solution here
        
        return -1;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> n1 = {-1,0,3,5,9,12};
    cout << sol.search(n1, 9) << endl;
    vector<int> n2 = {-1,0,3,5,9,12};
    cout << sol.search(n2, 2) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "4\n-1",
      python: "4\n-1",
      java: "4\n-1",
      cpp: "4\n-1",
    },
  },

  "search-insert-position": {
    id: "search-insert-position",
    title: "Search Insert Position",
    difficulty: "Easy",
    category: "Array • Binary Search",
    description: {
      text: "Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order. You must write an algorithm with O(log n) runtime complexity.",
      notes: [],
    },
    examples: [
      {
        input: "nums = [1,3,5,6], target = 5",
        output: "2",
      },
      {
        input: "nums = [1,3,5,6], target = 2",
        output: "1",
      },
      {
        input: "nums = [1,3,5,6], target = 7",
        output: "4",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10⁴",
      "-10⁴ ≤ nums[i], target ≤ 10⁴",
      "nums contains distinct values sorted in ascending order.",
    ],
    starterCode: {
      javascript: `function searchInsert(nums, target) {
  // Write your solution here
  
}

// Test cases
console.log(searchInsert([1,3,5,6], 5)); // Expected: 2
console.log(searchInsert([1,3,5,6], 2)); // Expected: 1
console.log(searchInsert([1,3,5,6], 7)); // Expected: 4`,
      python: `def searchInsert(nums, target):
    # Write your solution here
    pass

# Test cases
print(searchInsert([1,3,5,6], 5))  # Expected: 2
print(searchInsert([1,3,5,6], 2))  # Expected: 1
print(searchInsert([1,3,5,6], 7))  # Expected: 4`,
      java: `class Solution {
    public static int searchInsert(int[] nums, int target) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(searchInsert(new int[]{1,3,5,6}, 5));
        System.out.println(searchInsert(new int[]{1,3,5,6}, 2));
        System.out.println(searchInsert(new int[]{1,3,5,6}, 7));
    }
}`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    int searchInsert(vector<int>& nums, int target) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> n1 = {1,3,5,6};
    cout << sol.searchInsert(n1, 5) << endl;
    cout << sol.searchInsert(n1, 2) << endl;
    cout << sol.searchInsert(n1, 7) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "2\n1\n4",
      python: "2\n1\n4",
      java: "2\n1\n4",
      cpp: "2\n1\n4",
    },
  },

  "find-first-and-last-position-of-element-in-sorted-array": {
    id: "find-first-and-last-position-of-element-in-sorted-array",
    title: "Find First and Last Position of Element in Sorted Array",
    difficulty: "Medium",
    category: "Array • Binary Search",
    description: {
      text: "Given an array of integers nums sorted in non-decreasing order, find the starting and ending position of a given target value. If target is not found in the array, return [-1, -1]. You must write an algorithm with O(log n) runtime complexity.",
      notes: [],
    },
    examples: [
      {
        input: "nums = [5,7,7,8,8,10], target = 8",
        output: "[3,4]",
      },
      {
        input: "nums = [5,7,7,8,8,10], target = 6",
        output: "[-1,-1]",
      },
      {
        input: "nums = [], target = 0",
        output: "[-1,-1]",
      },
    ],
    constraints: [
      "0 ≤ nums.length ≤ 10⁵",
      "-10⁹ ≤ nums[i], target ≤ 10⁹",
      "nums is a non-decreasing array.",
    ],
    starterCode: {
      javascript: `function searchRange(nums, target) {
  // Write your solution here
  
}

// Test cases
console.log(JSON.stringify(searchRange([5,7,7,8,8,10], 8))); // Expected: [3,4]
console.log(JSON.stringify(searchRange([5,7,7,8,8,10], 6))); // Expected: [-1,-1]
console.log(JSON.stringify(searchRange([], 0))); // Expected: [-1,-1]`,
      python: `import json
def searchRange(nums, target):
    # Write your solution here
    pass

# Test cases
print(json.dumps(searchRange([5,7,7,8,8,10], 8), separators=(',', ':')))
print(json.dumps(searchRange([5,7,7,8,8,10], 6), separators=(',', ':')))
print(json.dumps(searchRange([], 0), separators=(',', ':')))`,
      java: `import java.util.*;

class Solution {
    public static int[] searchRange(int[] nums, int target) {
        // Write your solution here
        
        return new int[]{-1, -1};
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.toString(searchRange(new int[]{5,7,7,8,8,10}, 8)));
        System.out.println(Arrays.toString(searchRange(new int[]{5,7,7,8,8,10}, 6)));
        System.out.println(Arrays.toString(searchRange(new int[]{}, 0)));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    vector<int> searchRange(vector<int>& nums, int target) {
        // Write your solution here
        
        return {-1, -1};
    }
};

string vectorToString(const vector<int>& res) {
    string s = "[";
    for (int i = 0; i < res.size(); i++) {
        s += to_string(res[i]) + (i == res.size() - 1 ? "" : ",");
    }
    s += "]";
    return s;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> n1 = {5,7,7,8,8,10};
    cout << vectorToString(sol.searchRange(n1, 8)) << endl;
    cout << vectorToString(sol.searchRange(n1, 6)) << endl;
    vector<int> n2 = {};
    cout << vectorToString(sol.searchRange(n2, 0)) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "[3,4]\n[-1,-1]\n[-1,-1]",
      python: "[3,4]\n[-1,-1]\n[-1,-1]",
      java: "[3, 4]\n[-1, -1]\n[-1, -1]",
      cpp: "[3,4]\n[-1,-1]\n[-1,-1]",
    },
  },

  "find-minimum-in-rotated-sorted-array": {
    id: "find-minimum-in-rotated-sorted-array",
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Array • Binary Search",
    description: {
      text: "Suppose an array of length n sorted in ascending order is rotated between 1 and n times. For example, the array nums = [0,1,2,4,5,6,7] might become [4,5,6,7,0,1,2] if it was rotated 4 times. Given the sorted rotated array nums of unique elements, return the minimum element of this array. You must write an algorithm with O(log n) runtime complexity.",
      notes: [],
    },
    examples: [
      {
        input: "nums = [3,4,5,1,2]",
        output: "1",
      },
      {
        input: "nums = [4,5,6,7,0,1,2]",
        output: "0",
      },
      {
        input: "nums = [11,13,15,17]",
        output: "11",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 5000",
      "-5000 ≤ nums[i] ≤ 5000",
      "All the integers of nums are unique.",
      "nums is sorted and rotated between 1 and n times.",
    ],
    starterCode: {
      javascript: `function findMin(nums) {
  // Write your solution here
  
}

// Test cases
console.log(findMin([3,4,5,1,2])); // Expected: 1
console.log(findMin([4,5,6,7,0,1,2])); // Expected: 0
console.log(findMin([11,13,15,17])); // Expected: 11`,
      python: `def findMin(nums):
    # Write your solution here
    pass

# Test cases
print(findMin([3,4,5,1,2]))  # Expected: 1
print(findMin([4,5,6,7,0,1,2]))  # Expected: 0
print(findMin([11,13,15,17]))  # Expected: 11`,
      java: `class Solution {
    public static int findMin(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(findMin(new int[]{3,4,5,1,2}));
        System.out.println(findMin(new int[]{4,5,6,7,0,1,2}));
        System.out.println(findMin(new int[]{11,13,15,17}));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    int findMin(vector<int>& nums) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> n1 = {3,4,5,1,2};
    cout << sol.findMin(n1) << endl;
    vector<int> n2 = {4,5,6,7,0,1,2};
    cout << sol.findMin(n2) << endl;
    vector<int> n3 = {11,13,15,17};
    cout << sol.findMin(n3) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "1\n0\n11",
      python: "1\n0\n11",
      java: "1\n0\n11",
      cpp: "1\n0\n11",
    },
  },

  "find-peak-element": {
    id: "find-peak-element",
    title: "Find Peak Element",
    difficulty: "Medium",
    category: "Array • Binary Search",
    description: {
      text: "A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array nums, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks. You may imagine that nums[-1] = nums[n] = -∞. In other words, an element is always considered to be strictly greater than a neighbor that is outside the array.",
      notes: [
        "You must write an algorithm that runs in O(log n) time.",
      ],
    },
    examples: [
      {
        input: "nums = [1,2,3,1]",
        output: "2",
        explanation: "3 is a peak element and your function should return the index number 2.",
      },
      {
        input: "nums = [1,2,1,3,5,6,4]",
        output: "5",
        explanation: "Your function can return either index number 1 where the peak element is 2, or index number 5 where the peak element is 6.",
      },
    ],
    starterCode: {
      javascript: `function findPeakElement(nums) {
  // Write your solution here
  
}

// Test cases
console.log(findPeakElement([1,2,3,1])); // Expected: 2
// Multiple valid answers possible for the second case (1 or 5), but we'll check it manually in production.
// To keep it deterministic for this example, we expect one of the valid indices.
let res = findPeakElement([1,2,1,3,5,6,4]);
console.log(res === 1 || res === 5 ? "true" : "false");`,
      python: `def findPeakElement(nums):
    # Write your solution here
    pass

# Test cases
print(findPeakElement([1,2,3,1]))  # Expected: 2
res = findPeakElement([1,2,1,3,5,6,4])
print("true" if res == 1 or res == 5 else "false")`,
      java: `class Solution {
    public static int findPeakElement(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(findPeakElement(new int[]{1,2,3,1}));
        int res = findPeakElement(new int[]{1,2,1,3,5,6,4});
        System.out.println((res == 1 || res == 5) ? "true" : "false");
    }
}`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    int findPeakElement(vector<int>& nums) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> n1 = {1,2,3,1};
    cout << sol.findPeakElement(n1) << endl;
    vector<int> n2 = {1,2,1,3,5,6,4};
    int res = sol.findPeakElement(n2);
    cout << (res == 1 || res == 5 ? "true" : "false") << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "2\ntrue",
      python: "2\ntrue",
      java: "2\ntrue",
      cpp: "2\ntrue",
    },
  },

  "merge-k-sorted-lists": {
    id: "merge-k-sorted-lists",
    title: "Merge k Sorted Lists",
    difficulty: "Hard",
    category: "Linked List • Heap • Divide and Conquer",
    description: {
      text: "You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.",
      notes: [],
    },
    examples: [
      {
        input: "lists = [[1,4,5],[1,3,4],[2,6]]",
        output: "[1,1,2,3,4,4,5,6]",
      },
      {
        input: "lists = []",
        output: "[]",
      },
      {
        input: "lists = [[]]",
        output: "[]",
      },
    ],
    constraints: [
      "k == lists.length",
      "0 ≤ k ≤ 10⁴",
      "0 ≤ lists[i].length ≤ 500",
      "-10⁴ ≤ lists[i][j] ≤ 10⁴",
      "lists[i] is sorted in ascending order.",
      "The sum of lists[i].length will not exceed 10⁴.",
    ],
    starterCode: {
      javascript: `// Definition for singly-linked list.
function ListNode(val, next) {
  this.val = (val===undefined ? 0 : val)
  this.next = (next===undefined ? null : next)
}

function mergeKLists(lists) {
  // Write your solution here
  
}

// Helper to create list
function createList(arr) {
  if (!arr.length) return null;
  let head = new ListNode(arr[0]);
  let curr = head;
  for (let i = 1; i < arr.length; i++) {
    curr.next = new ListNode(arr[i]);
    curr = curr.next;
  }
  return head;
}

// Helper to stringify list
function listToString(head) {
  let res = [];
  while (head) {
    res.push(head.val);
    head = head.next;
  }
  return JSON.stringify(res);
}

// Test cases
let l1 = createList([1,4,5]);
let l2 = createList([1,3,4]);
let l3 = createList([2,6]);
console.log(listToString(mergeKLists([l1, l2, l3]))); // Expected: [1,1,2,3,4,4,5,6]`,
      python: `import json

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def mergeKLists(lists):
    # Write your solution here
    pass

def createList(arr):
    if not arr: return None
    dummy = ListNode(0)
    curr = dummy
    for x in arr:
        curr.next = ListNode(x)
        curr = curr.next
    return dummy.next

def listToString(head):
    res = []
    while head:
        res.append(head.val)
        head = head.next
    return json.dumps(res, separators=(',', ':'))

# Test cases
l1 = createList([1,4,5])
l2 = createList([1,3,4])
l3 = createList([2,6])
print(listToString(mergeKLists([l1, l2, l3])))  # Expected: [1,1,2,3,4,4,5,6]`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public static ListNode mergeKLists(ListNode[] lists) {
        // Write your solution here
        
        return null;
    }
    
    public static ListNode createList(int[] arr) {
        if (arr.length == 0) return null;
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        for (int x : arr) {
            curr.next = new ListNode(x);
            curr = curr.next;
        }
        return dummy.next;
    }
    
    public static String listToString(ListNode head) {
        List<Integer> res = new ArrayList<>();
        while (head != null) {
            res.add(head.val);
            head = head.next;
        }
        return res.toString();
    }
    
    public static void main(String[] args) {
        ListNode l1 = createList(new int[]{1,4,5});
        ListNode l2 = createList(new int[]{1,3,4});
        ListNode l3 = createList(new int[]{2,6});
        System.out.println(listToString(mergeKLists(new ListNode[]{l1, l2, l3})));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <string>

using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* mergeKLists(vector<ListNode*>& lists) {
        // Write your solution here
        
        return nullptr;
    }
};

ListNode* createList(vector<int> arr) {
    if (arr.empty()) return nullptr;
    ListNode* dummy = new ListNode(0);
    ListNode* curr = dummy;
    for (int x : arr) {
        curr->next = new ListNode(x);
        curr = curr->next;
    }
    return dummy->next;
}

string listToString(ListNode* head) {
    string res = "[";
    while (head) {
        res += to_string(head->val);
        if (head->next) res += ",";
        head = head->next;
    }
    res += "]";
    return res;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    ListNode* l1 = createList({1,4,5});
    ListNode* l2 = createList({1,3,4});
    ListNode* l3 = createList({2,6});
    vector<ListNode*> lists = {l1, l2, l3};
    cout << listToString(sol.mergeKLists(lists)) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "[1,1,2,3,4,4,5,6]",
      python: "[1,1,2,3,4,4,5,6]",
      java: "[1, 1, 2, 3, 4, 4, 5, 6]",
      cpp: "[1,1,2,3,4,4,5,6]",
    },
  },

  "reverse-nodes-in-k-group": {
    id: "reverse-nodes-in-k-group",
    title: "Reverse Nodes in k-Group",
    difficulty: "Hard",
    category: "Linked List • Two Pointers",
    description: {
      text: "Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list. k is a positive integer and is less than or equal to the length of the linked list. If the number of nodes is not a multiple of k then left-out nodes, in the end, should remain as it is.",
      notes: [
        "You may not alter the values in the list's nodes, only nodes themselves may be changed.",
      ],
    },
    examples: [
      {
        input: "head = [1,2,3,4,5], k = 2",
        output: "[2,1,4,3,5]",
      },
      {
        input: "head = [1,2,3,4,5], k = 3",
        output: "[3,2,1,4,5]",
      },
    ],
    starterCode: {
      javascript: `// Definition for singly-linked list.
function ListNode(val, next) {
  this.val = (val===undefined ? 0 : val)
  this.next = (next===undefined ? null : next)
}

function reverseKGroup(head, k) {
  // Write your solution here
  
}

// Helper to create list
function createList(arr) {
  if (!arr.length) return null;
  let head = new ListNode(arr[0]);
  let curr = head;
  for (let i = 1; i < arr.length; i++) {
    curr.next = new ListNode(arr[i]);
    curr = curr.next;
  }
  return head;
}

// Helper to stringify list
function listToString(head) {
  let res = [];
  while (head) {
    res.push(head.val);
    head = head.next;
  }
  return JSON.stringify(res);
}

// Test cases
console.log(listToString(reverseKGroup(createList([1,2,3,4,5]), 2))); // Expected: [2,1,4,3,5]
console.log(listToString(reverseKGroup(createList([1,2,3,4,5]), 3))); // Expected: [3,2,1,4,5]`,
      python: `import json

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseKGroup(head, k):
    # Write your solution here
    pass

def createList(arr):
    if not arr: return None
    dummy = ListNode(0)
    curr = dummy
    for x in arr:
        curr.next = ListNode(x)
        curr = curr.next
    return dummy.next

def listToString(head):
    res = []
    while head:
        res.append(head.val)
        head = head.next
    return json.dumps(res, separators=(',', ':'))

# Test cases
print(listToString(reverseKGroup(createList([1,2,3,4,5]), 2)))  # Expected: [2,1,4,3,5]
print(listToString(reverseKGroup(createList([1,2,3,4,5]), 3)))  # Expected: [3,2,1,4,5]`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class Solution {
    public static ListNode reverseKGroup(ListNode head, int k) {
        // Write your solution here
        
        return null;
    }
    
    public static ListNode createList(int[] arr) {
        if (arr.length == 0) return null;
        ListNode dummy = new ListNode(0);
        ListNode curr = dummy;
        for (int x : arr) {
            curr.next = new ListNode(x);
            curr = curr.next;
        }
        return dummy.next;
    }
    
    public static String listToString(ListNode head) {
        List<Integer> res = new ArrayList<>();
        while (head != null) {
            res.add(head.val);
            head = head.next;
        }
        return res.toString();
    }
    
    public static void main(String[] args) {
        System.out.println(listToString(reverseKGroup(createList(new int[]{1,2,3,4,5}), 2)));
        System.out.println(listToString(reverseKGroup(createList(new int[]{1,2,3,4,5}), 3)));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

class Solution {
public:
    ListNode* reverseKGroup(ListNode* head, int k) {
        // Write your solution here
        
        return nullptr;
    }
};

ListNode* createList(vector<int> arr) {
    if (arr.empty()) return nullptr;
    ListNode* dummy = new ListNode(0);
    ListNode* curr = dummy;
    for (int x : arr) {
        curr->next = new ListNode(x);
        curr = curr->next;
    }
    return dummy->next;
}

string listToString(ListNode* head) {
    string res = "[";
    while (head) {
        res += to_string(head->val);
        if (head->next) res += ",";
        head = head->next;
    }
    res += "]";
    return res;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << listToString(sol.reverseKGroup(createList({1,2,3,4,5}), 2)) << endl;
    cout << listToString(sol.reverseKGroup(createList({1,2,3,4,5}), 3)) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "[2,1,4,3,5]\n[3,2,1,4,5]",
      python: "[2,1,4,3,5]\n[3,2,1,4,5]",
      java: "[2, 1, 4, 3, 5]\n[3, 2, 1, 4, 5]",
      cpp: "[2,1,4,3,5]\n[3,2,1,4,5]",
    },
  },

  "edit-distance": {
    id: "edit-distance",
    title: "Edit Distance",
    difficulty: "Hard",
    category: "String • Dynamic Programming",
    description: {
      text: "Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2.",
      notes: [
        "You have the following three operations permitted on a word:",
        "Insert a character",
        "Delete a character",
        "Replace a character",
      ],
    },
    examples: [
      {
        input: 'word1 = "horse", word2 = "ros"',
        output: "3",
        explanation: "horse -> rorse (replace 'h' with 'r'), rorse -> rose (remove 'r'), rose -> ros (remove 'e')",
      },
      {
        input: 'word1 = "intention", word2 = "execution"',
        output: "5",
      },
    ],
    starterCode: {
      javascript: `function minDistance(word1, word2) {
  // Write your solution here
  
}

// Test cases
console.log(minDistance("horse", "ros")); // Expected: 3
console.log(minDistance("intention", "execution")); // Expected: 5`,
      python: `def minDistance(word1, word2):
    # Write your solution here
    pass

# Test cases
print(minDistance("horse", "ros"))  # Expected: 3
print(minDistance("intention", "execution"))  # Expected: 5`,
      java: `class Solution {
    public static int minDistance(String word1, String word2) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(minDistance("horse", "ros"));
        System.out.println(minDistance("intention", "execution"));
    }
}`,
      cpp: `#include <iostream>
#include <string>
#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    int minDistance(string word1, string word2) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << sol.minDistance("horse", "ros") << endl;
    cout << sol.minDistance("intention", "execution") << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "3\n5",
      python: "3\n5",
      java: "3\n5",
      cpp: "3\n5",
    },
  },

  "largest-rectangle-in-histogram": {
    id: "largest-rectangle-in-histogram",
    title: "Largest Rectangle in Histogram",
    difficulty: "Hard",
    category: "Array • Stack • Monotonic Stack",
    description: {
      text: "Given an array of integers heights representing the histogram's bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram.",
      notes: [],
    },
    examples: [
      {
        input: "heights = [2,1,5,6,2,3]",
        output: "10",
        explanation: "The maximum area is 10 (bar 5 and 6 with height 5).",
      },
      {
        input: "heights = [2,4]",
        output: "4",
      },
    ],
    starterCode: {
      javascript: `function largestRectangleArea(heights) {
  // Write your solution here
  
}

// Test cases
console.log(largestRectangleArea([2,1,5,6,2,3])); // Expected: 10
console.log(largestRectangleArea([2,4])); // Expected: 4`,
      python: `def largestRectangleArea(heights):
    # Write your solution here
    pass

# Test cases
print(largestRectangleArea([2,1,5,6,2,3]))  # Expected: 10
print(largestRectangleArea([2,4]))  # Expected: 4`,
      java: `import java.util.*;

class Solution {
    public static int largestRectangleArea(int[] heights) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(largestRectangleArea(new int[]{2,1,5,6,2,3}));
        System.out.println(largestRectangleArea(new int[]{2,4}));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <stack>
#include <algorithm>

using namespace std;

class Solution {
public:
    int largestRectangleArea(vector<int>& heights) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> h1 = {2,1,5,6,2,3};
    cout << sol.largestRectangleArea(h1) << endl;
    vector<int> h2 = {2,4};
    cout << sol.largestRectangleArea(h2) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "10\n4",
      python: "10\n4",
      java: "10\n4",
      cpp: "10\n4",
    },
  },

  "sudoku-solver": {
    id: "sudoku-solver",
    title: "Sudoku Solver",
    difficulty: "Hard",
    category: "Array • Hash Table • Backtracking • Matrix",
    description: {
      text: "Write a program to solve a Sudoku puzzle by filling the empty cells. A sudoku solution must satisfy all of the following rules:",
      notes: [
        "Each of the digits 1-9 must occur exactly once in each row.",
        "Each of the digits 1-9 must occur exactly once in each column.",
        "Each of the digits 1-9 must occur exactly once in each of the 9 3x3 sub-boxes of the grid.",
        "The '.' character indicates empty cells.",
      ],
    },
    examples: [
      {
        input: 'board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],["3",".",".",".","8",".",".","7","9"]]',
        output: "Solved Board",
      },
    ],
    starterCode: {
      javascript: `function solveSudoku(board) {
  // Write your solution here
  
}

// Helper to print board
function printBoard(board) {
  for (let row of board) {
    console.log(row.join(' '));
  }
}

// Test case
let board = [
  ["5","3",".",".","7",".",".",".","."],
  ["6",".",".","1","9","5",".",".","."],
  [".","9","8",".",".",".",".","6","."],
  ["8",".",".",".","6",".",".",".","3"],
  ["4",".",".","8",".","3",".",".","1"],
  ["7",".",".",".","2",".",".",".","6"],
  [".","6",".",".",".",".","2","8","."],
  [".",".",".","4","1","9",".",".","5"],
  ["3",".",".",".","8",".",".","7","9"]
];
solveSudoku(board);
printBoard(board);`,
      python: `def solveSudoku(board):
    # Write your solution here
    pass

def printBoard(board):
    for row in board:
        print(" ".join(row))

# Test case
board = [
  ["5","3",".",".","7",".",".",".","."],
  ["6",".",".","1","9","5",".",".","."],
  [".","9","8",".",".",".",".","6","."],
  ["8",".",".",".","6",".",".",".","3"],
  ["4",".",".","8",".","3",".",".","1"],
  ["7",".",".",".","2",".",".",".","6"],
  [".","6",".",".",".",".","2","8","."],
  [".",".",".","4","1","9",".",".","5"],
  ["3",".",".",".","8",".",".","7","9"]
]
solveSudoku(board)
printBoard(board)`,
      java: `class Solution {
    public static void solveSudoku(char[][] board) {
        // Write your solution here
        
    }
    
    public static void printBoard(char[][] board) {
        for (char[] row : board) {
            for (char c : row) {
                System.out.print(c + " ");
            }
            System.out.println();
        }
    }
    
    public static void main(String[] args) {
        char[][] board = {
            {'5','3','.','.','7','.','.','.','.'},
            {'6','.','.','1','9','5','.','.','.'},
            {'.','9','8','.','.','.','.','6','.'},
            {'8','.','.','.','6','.','.','.','3'},
            {'4','.','.','8','.','3','.','.','1'},
            {'7','.','.','.','2','.','.','.','6'},
            {'.','6','.','.','.','.','2','8','.'},
            {'.','.','.','4','1','9','.','.','5'},
            {'3','.','.','.','8','.','.','7','9'}
        };
        solveSudoku(board);
        printBoard(board);
    }
}`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    void solveSudoku(vector<vector<char>>& board) {
        // Write your solution here
        
    }
};

void printBoard(const vector<vector<char>>& board) {
    for (const auto& row : board) {
        for (char c : row) cout << c << " ";
        cout << endl;
    }
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<vector<char>> board = {
        {'5','3','.','.','7','.','.','.','.'},
        {'6','.','.','1','9','5','.','.','.'},
        {'.','9','8','.','.','.','.','6','.'},
        {'8','.','.','.','6','.','.','.','3'},
        {'4','.','.','8','.','3','.','.','1'},
        {'7','.','.','.','2','.','.','.','6'},
        {'.','6','.','.','.','.','2','8','.'},
        {'.','.','.','4','1','9','.','.','5'},
        {'3','.','.','.','8','.','.','7','9'}
    };
    sol.solveSudoku(board);
    printBoard(board);
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "5 3 4 6 7 8 9 1 2\n6 7 2 1 9 5 3 4 8\n1 9 8 3 4 2 5 6 7\n8 5 9 7 6 1 4 2 3\n4 2 6 8 5 3 7 9 1\n7 1 3 9 2 4 8 5 6\n9 6 1 5 3 7 2 8 4\n2 8 7 4 1 9 6 3 5\n3 4 5 2 8 6 1 7 9",
      python: "5 3 4 6 7 8 9 1 2\n6 7 2 1 9 5 3 4 8\n1 9 8 3 4 2 5 6 7\n8 5 9 7 6 1 4 2 3\n4 2 6 8 5 3 7 9 1\n7 1 3 9 2 4 8 5 6\n9 6 1 5 3 7 2 8 4\n2 8 7 4 1 9 6 3 5\n3 4 5 2 8 6 1 7 9",
      java: "5 3 4 6 7 8 9 1 2 \n6 7 2 1 9 5 3 4 8 \n1 9 8 3 4 2 5 6 7 \n8 5 9 7 6 1 4 2 3 \n4 2 6 8 5 3 7 9 1 \n7 1 3 9 2 4 8 5 6 \n9 6 1 5 3 7 2 8 4 \n2 8 7 4 1 9 6 3 5 \n3 4 5 2 8 6 1 7 9 ",
      cpp: "5 3 4 6 7 8 9 1 2 \n6 7 2 1 9 5 3 4 8 \n1 9 8 3 4 2 5 6 7 \n8 5 9 7 6 1 4 2 3 \n4 2 6 8 5 3 7 9 1 \n7 1 3 9 2 4 8 5 6 \n9 6 1 5 3 7 2 8 4 \n2 8 7 4 1 9 6 3 5 \n3 4 5 2 8 6 1 7 9 ",
    },
  },

  "generate-parentheses": {
    id: "generate-parentheses",
    title: "Generate Parentheses",
    difficulty: "Medium",
    category: "String • Dynamic Programming • Backtracking",
    description: {
      text: "Given n pairs of parentheses, write a function to generate all combinations of well-formed parentheses.",
      notes: [],
    },
    examples: [
      {
        input: "n = 3",
        output: '["((()))","(()())","(())()","()(())","()()()"]',
      },
      {
        input: "n = 1",
        output: '["()"]',
      },
    ],
    constraints: [
      "1 ≤ n ≤ 8",
    ],
    starterCode: {
      javascript: `function generateParenthesis(n) {
  // Write your solution here
  
}

// Test cases
console.log(JSON.stringify(generateParenthesis(3).sort()));
console.log(JSON.stringify(generateParenthesis(1).sort()));`,
      python: `import json
def generateParenthesis(n):
    # Write your solution here
    pass

# Test cases
print(json.dumps(sorted(generateParenthesis(3)), separators=(',', ':')))
print(json.dumps(sorted(generateParenthesis(1)), separators=(',', ':')))`,
      java: `import java.util.*;

class Solution {
    public static List<String> generateParenthesis(int n) {
        // Write your solution here
        
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        List<String> res1 = generateParenthesis(3);
        Collections.sort(res1);
        System.out.println(res1);
        List<String> res2 = generateParenthesis(1);
        Collections.sort(res2);
        System.out.println(res2);
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

class Solution {
public:
    vector<string> generateParenthesis(int n) {
        // Write your solution here
        
        return {};
    }
};

string vectorToString(const vector<string>& res) {
    string s = "[";
    for (int i = 0; i < res.size(); i++) {
        s += "\\"" + res[i] + "\\"" + (i == res.size() - 1 ? "" : ",");
    }
    s += "]";
    return s;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<string> res1 = sol.generateParenthesis(3);
    sort(res1.begin(), res1.end());
    cout << vectorToString(res1) << endl;
    vector<string> res2 = sol.generateParenthesis(1);
    sort(res2.begin(), res2.end());
    cout << vectorToString(res2) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: '["((()))","(()())","(())()","()(())","()()()"]\n["()"]',
      python: '["((()))","(()())","(())()","()(())","()()()"]\n["()"]',
      java: "[((())), (()()), (())(), ()(()), ()()()]\n[()]",
      cpp: '["((()))","(()())","(())()","()(())","()()()"]\n["()"]',
    },
  },

  "course-schedule": {
    id: "course-schedule",
    title: "Course Schedule",
    difficulty: "Medium",
    category: "Depth-First Search • Breadth-First Search • Graph • Topological Sort",
    description: {
      text: "There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.",
      notes: [],
    },
    examples: [
      {
        input: "numCourses = 2, prerequisites = [[1,0]]",
        output: "true",
        explanation: "There are a total of 2 courses to take. To take course 1 you should have finished course 0. So it is possible.",
      },
      {
        input: "numCourses = 2, prerequisites = [[1,0],[0,1]]",
        output: "false",
        explanation: "To take course 1 you should have finished course 0, and to take course 0 you should also have finished course 1. So it is impossible.",
      },
    ],
    constraints: [
      "1 ≤ numCourses ≤ 2000",
      "0 ≤ prerequisites.length ≤ 5000",
      "prerequisites[i].length == 2",
      "0 ≤ ai, bi < numCourses",
      "All the pairs prerequisites[i] are unique.",
    ],
    starterCode: {
      javascript: `function canFinish(numCourses, prerequisites) {
  // Write your solution here
  
}

// Test cases
console.log(canFinish(2, [[1,0]])); // Expected: true
console.log(canFinish(2, [[1,0],[0,1]])); // Expected: false`,
      python: `def canFinish(numCourses, prerequisites):
    # Write your solution here
    pass

# Test cases
print("true" if canFinish(2, [[1,0]]) else "false")
print("true" if canFinish(2, [[1,0],[0,1]]) else "false")`,
      java: `class Solution {
    public static boolean canFinish(int numCourses, int[][] prerequisites) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(canFinish(2, new int[][]{{1,0}}));
        System.out.println(canFinish(2, new int[][]{{1,0},{0,1}}));
    }
}`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {
        // Write your solution here
        
        return false;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<vector<int>> p1 = {{1,0}};
    cout << (sol.canFinish(2, p1) ? "true" : "false") << endl;
    vector<vector<int>> p2 = {{1,0},{0,1}};
    cout << (sol.canFinish(2, p2) ? "true" : "false") << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "true\nfalse",
      python: "true\nfalse",
      java: "true\nfalse",
      cpp: "true\nfalse",
    },
  },

  "insert-interval": {
    id: "insert-interval",
    title: "Insert Interval",
    difficulty: "Medium",
    category: "Array",
    description: {
      text: "You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] represent the start and the end of the ith interval and intervals is sorted in ascending order by starti. You are also given an interval newInterval = [start, end] that represents the start and end of another interval. Insert newInterval into intervals such that intervals is still sorted in ascending order by starti and intervals still does not have any overlapping intervals (merge overlapping intervals if necessary).",
      notes: [
        "Return intervals after the insertion.",
        "You don't need to modify intervals in-place. You can make a new array and return it."
      ],
    },
    examples: [
      {
        input: "intervals = [[1,3],[6,9]], newInterval = [2,5]",
        output: "[[1,5],[6,9]]",
      },
      {
        input: "intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]",
        output: "[[1,2],[3,10],[12,16]]",
        explanation: "Because the new interval [4,8] overlaps with [3,5],[6,7],[8,10].",
      },
    ],
    constraints: [
      "0 ≤ intervals.length ≤ 10⁴",
      "intervals[i].length == 2",
      "0 ≤ starti ≤ endi ≤ 10⁵",
      "intervals is sorted by starti in ascending order.",
      "newInterval.length == 2",
      "0 ≤ start ≤ end ≤ 10⁵",
    ],
    starterCode: {
      javascript: `function insert(intervals, newInterval) {
  // Write your solution here
  
}

// Test cases
console.log(JSON.stringify(insert([[1,3],[6,9]], [2,5])));
console.log(JSON.stringify(insert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8])));`,
      python: `import json
def insert(intervals, newInterval):
    # Write your solution here
    pass

# Test cases
print(json.dumps(insert([[1,3],[6,9]], [2,5]), separators=(',', ':')))
print(json.dumps(insert([[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]), separators=(',', ':')))`,
      java: `import java.util.*;

class Solution {
    public static int[][] insert(int[][] intervals, int[] newInterval) {
        // Write your solution here
        
        return new int[0][0];
    }
    
    public static void main(String[] args) {
        System.out.println(Arrays.deepToString(insert(new int[][]{{1,3},{6,9}}, new int[]{2,5})));
        System.out.println(Arrays.deepToString(insert(new int[][]{{1,2},{3,5},{6,7},{8,10},{12,16}}, new int[]{4,8})));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {
        // Write your solution here
        
        return {};
    }
};

string vectorToString(const vector<vector<int>>& res) {
    string s = "[";
    for (int i = 0; i < res.size(); i++) {
        s += "[" + to_string(res[i][0]) + "," + to_string(res[i][1]) + "]";
        if (i < res.size() - 1) s += ",";
    }
    s += "]";
    return s;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<vector<int>> i1 = {{1,3},{6,9}};
    vector<int> n1 = {2,5};
    cout << vectorToString(sol.insert(i1, n1)) << endl;
    vector<vector<int>> i2 = {{1,2},{3,5},{6,7},{8,10},{12,16}};
    vector<int> n2 = {4,8};
    cout << vectorToString(sol.insert(i2, n2)) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "[[1,5],[6,9]]\n[[1,2],[3,10],[12,16]]",
      python: "[[1,5],[6,9]]\n[[1,2],[3,10],[12,16]]",
      java: "[[1, 5], [6, 9]]\n[[1, 2], [3, 10], [12, 16]]",
      cpp: "[[1,5],[6,9]]\n[[1,2],[3,10],[12,16]]",
    },
  },

  "longest-consecutive-sequence": {
    id: "longest-consecutive-sequence",
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    category: "Array • Hash Table • Union Find",
    description: {
      text: "Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence.",
      notes: [
        "You must write an algorithm that runs in O(n) time.",
      ],
    },
    examples: [
      {
        input: "nums = [100,4,200,1,3,2]",
        output: "4",
        explanation: "The longest consecutive elements sequence is [1, 2, 3, 4]. Therefore its length is 4.",
      },
      {
        input: "nums = [0,3,7,2,5,8,4,6,0,1]",
        output: "9",
      },
    ],
    constraints: [
      "0 ≤ nums.length ≤ 10⁵",
      "-10⁹ ≤ nums[i] ≤ 10⁹",
    ],
    starterCode: {
      javascript: `function longestConsecutive(nums) {
  // Write your solution here
  
}

// Test cases
console.log(longestConsecutive([100,4,200,1,3,2])); // Expected: 4
console.log(longestConsecutive([0,3,7,2,5,8,4,6,0,1])); // Expected: 9`,
      python: `def longestConsecutive(nums):
    # Write your solution here
    pass

# Test cases
print(longestConsecutive([100,4,200,1,3,2]))  # Expected: 4
print(longestConsecutive([0,3,7,2,5,8,4,6,0,1]))  # Expected: 9`,
      java: `class Solution {
    public static int longestConsecutive(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(longestConsecutive(new int[]{100,4,200,1,3,2}));
        System.out.println(longestConsecutive(new int[]{0,3,7,2,5,8,4,6,0,1}));
    }
}`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    int longestConsecutive(vector<int>& nums) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> n1 = {100,4,200,1,3,2};
    cout << sol.longestConsecutive(n1) << endl;
    vector<int> n2 = {0,3,7,2,5,8,4,6,0,1};
    cout << sol.longestConsecutive(n2) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "4\n9",
      python: "4\n9",
      java: "4\n9",
      cpp: "4\n9",
    },
  },

  "decode-ways": {
    id: "decode-ways",
    title: "Decode Ways",
    difficulty: "Medium",
    category: "String • Dynamic Programming",
    description: {
      text: "A message containing letters from A-Z can be encoded into numbers using the following mapping: 'A' -> \"1\", 'B' -> \"2\", ... 'Z' -> \"26\". To decode an encoded message, all the digits must be grouped then mapped back into letters using the reverse of the mapping above (there may be multiple ways).",
      notes: [
        "For example, \"11106\" can be mapped into:",
        "\"AAJF\" with the grouping (1 1 10 6)",
        "\"KJF\" with the grouping (11 10 6)",
        "Given a string s containing only digits, return the number of ways to decode it."
      ],
    },
    examples: [
      {
        input: 's = "12"',
        output: "2",
        explanation: 'It could be decoded as "AB" (1 2) or "L" (12).',
      },
      {
        input: 's = "226"',
        output: "3",
        explanation: 'It could be decoded as "BZ" (2 26), "VF" (22 6), or "BBF" (2 2 6).',
      },
      {
        input: 's = "06"',
        output: "0",
        explanation: '"06" cannot be mapped to "F" because of the leading zero ("6" is different from "06").',
      },
    ],
    constraints: [
      "1 ≤ s.length ≤ 100",
      "s contains only digits and may contain leading zero(s).",
    ],
    starterCode: {
      javascript: `function numDecodings(s) {
  // Write your solution here
  
}

// Test cases
console.log(numDecodings("12")); // Expected: 2
console.log(numDecodings("226")); // Expected: 3
console.log(numDecodings("06")); // Expected: 0`,
      python: `def numDecodings(s):
    # Write your solution here
    pass

# Test cases
print(numDecodings("12"))  # Expected: 2
print(numDecodings("226"))  # Expected: 3
print(numDecodings("06"))  # Expected: 0`,
      java: `class Solution {
    public static int numDecodings(String s) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(numDecodings("12"));
        System.out.println(numDecodings("226"));
        System.out.println(numDecodings("06"));
    }
}`,
      cpp: `#include <iostream>
#include <string>

using namespace std;

class Solution {
public:
    int numDecodings(string s) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << sol.numDecodings("12") << endl;
    cout << sol.numDecodings("226") << endl;
    cout << sol.numDecodings("06") << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "2\n3\n0",
      python: "2\n3\n0",
      java: "2\n3\n0",
      cpp: "2\n3\n0",
    },
  },

  "palindrome-number": {
    id: "palindrome-number",
    title: "Palindrome Number",
    difficulty: "Easy",
    category: "Math",
    description: {
      text: "Given an integer x, return true if x is a palindrome, and false otherwise.",
      notes: [
        "An integer is a palindrome when it reads the same forward and backward.",
      ],
    },
    examples: [
      {
        input: "x = 121",
        output: "true",
        explanation: "121 reads as 121 from left to right and from right to left.",
      },
      {
        input: "x = -121",
        output: "false",
        explanation: "From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.",
      },
      {
        input: "x = 10",
        output: "false",
        explanation: "Reads 01 from right to left. Therefore it is not a palindrome.",
      },
    ],
    constraints: [
      "-2³¹ ≤ x ≤ 2³¹ - 1",
    ],
    starterCode: {
      javascript: `function isPalindrome(x) {
  // Write your solution here
  
}

// Test cases
console.log(isPalindrome(121)); // Expected: true
console.log(isPalindrome(-121)); // Expected: false
console.log(isPalindrome(10)); // Expected: false`,
      python: `import json
def isPalindrome(x):
    # Write your solution here
    pass

# Test cases
print("true" if isPalindrome(121) else "false")
print("true" if isPalindrome(-121) else "false")
print("true" if isPalindrome(10) else "false")`,
      java: `class Solution {
    public static boolean isPalindrome(int x) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        System.out.println(isPalindrome(121));
        System.out.println(isPalindrome(-121));
        System.out.println(isPalindrome(10));
    }
}`,
      cpp: `#include <iostream>

using namespace std;

class Solution {
public:
    bool isPalindrome(int x) {
        // Write your solution here
        
        return false;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << (sol.isPalindrome(121) ? "true" : "false") << endl;
    cout << (sol.isPalindrome(-121) ? "true" : "false") << endl;
    cout << (sol.isPalindrome(10) ? "true" : "false") << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "true\nfalse\nfalse",
      python: "true\nfalse\nfalse",
      java: "true\nfalse\nfalse",
      cpp: "true\nfalse\nfalse",
    },
  },

  "roman-to-integer": {
    id: "roman-to-integer",
    title: "Roman to Integer",
    difficulty: "Easy",
    category: "Hash Table • Math • String",
    description: {
      text: "Roman numerals are represented by seven different symbols: I, V, X, L, C, D and M. Given a roman numeral, convert it to an integer.",
      notes: [
        "Symbol       Value",
        "I             1",
        "V             5",
        "X             10",
        "L             50",
        "C             100",
        "D             500",
        "M             1000",
        "Roman numerals are usually written largest to smallest from left to right. However, the numeral for four is not IIII. Instead, the number four is written as IV."
      ],
    },
    examples: [
      {
        input: 's = "III"',
        output: "3",
        explanation: 'III = 3.',
      },
      {
        input: 's = "LVIII"',
        output: "58",
        explanation: 'L = 50, V= 5, III = 3.',
      },
      {
        input: 's = "MCMXCIV"',
        output: "1994",
        explanation: 'M = 1000, CM = 900, XC = 90 and IV = 4.',
      },
    ],
    constraints: [
      "1 ≤ s.length ≤ 15",
      "s contains only the characters ('I', 'V', 'X', 'L', 'C', 'D', 'M').",
      "It is guaranteed that s is a valid roman numeral in the range [1, 3999]."
    ],
    starterCode: {
      javascript: `function romanToInt(s) {
  // Write your solution here
  
}

// Test cases
console.log(romanToInt("III")); // Expected: 3
console.log(romanToInt("LVIII")); // Expected: 58
console.log(romanToInt("MCMXCIV")); // Expected: 1994`,
      python: `def romanToInt(s):
    # Write your solution here
    pass

# Test cases
print(romanToInt("III"))
print(romanToInt("LVIII"))
print(romanToInt("MCMXCIV"))`,
      java: `class Solution {
    public static int romanToInt(String s) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(romanToInt("III"));
        System.out.println(romanToInt("LVIII"));
        System.out.println(romanToInt("MCMXCIV"));
    }
}`,
      cpp: `#include <iostream>
#include <string>

using namespace std;

class Solution {
public:
    int romanToInt(string s) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << sol.romanToInt("III") << endl;
    cout << sol.romanToInt("LVIII") << endl;
    cout << sol.romanToInt("MCMXCIV") << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "3\n58\n1994",
      python: "3\n58\n1994",
      java: "3\n58\n1994",
      cpp: "3\n58\n1994",
    },
  },

  "majority-element": {
    id: "majority-element",
    title: "Majority Element",
    difficulty: "Easy",
    category: "Array • Hash Table • Divide and Conquer • Sorting • Counting",
    description: {
      text: "Given an array nums of size n, return the majority element.",
      notes: [
        "The majority element is the element that appears more than ⌊n / 2⌋ times. You may assume that the majority element always exists in the array."
      ],
    },
    examples: [
      {
        input: "nums = [3,2,3]",
        output: "3",
      },
      {
        input: "nums = [2,2,1,1,1,2,2]",
        output: "2",
      },
    ],
    constraints: [
      "n == nums.length",
      "1 ≤ n ≤ 5 * 10⁴",
      "-10⁹ ≤ nums[i] ≤ 10⁹"
    ],
    starterCode: {
      javascript: `function majorityElement(nums) {
  // Write your solution here
  
}

// Test cases
console.log(majorityElement([3,2,3])); // Expected: 3
console.log(majorityElement([2,2,1,1,1,2,2])); // Expected: 2`,
      python: `def majorityElement(nums):
    # Write your solution here
    pass

# Test cases
print(majorityElement([3,2,3]))
print(majorityElement([2,2,1,1,1,2,2]))`,
      java: `class Solution {
    public static int majorityElement(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(majorityElement(new int[]{3,2,3}));
        System.out.println(majorityElement(new int[]{2,2,1,1,1,2,2}));
    }
}`,
      cpp: `#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    int majorityElement(vector<int>& nums) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> nums1 = {3,2,3};
    cout << sol.majorityElement(nums1) << endl;
    vector<int> nums2 = {2,2,1,1,1,2,2};
    cout << sol.majorityElement(nums2) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "3\n2",
      python: "3\n2",
      java: "3\n2",
      cpp: "3\n2",
    },
  },

  "move-zeroes": {
    id: "move-zeroes",
    title: "Move Zeroes",
    difficulty: "Easy",
    category: "Array • Two Pointers",
    description: {
      text: "Given an integer array nums, move all 0's to the end of it while maintaining the relative order of the non-zero elements.",
      notes: [
        "Note that you must do this in-place without making a copy of the array."
      ],
    },
    examples: [
      {
        input: "nums = [0,1,0,3,12]",
        output: "[1,3,12,0,0]",
      },
      {
        input: "nums = [0]",
        output: "[0]",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 10⁴",
      "-2³¹ ≤ nums[i] ≤ 2³¹ - 1"
    ],
    starterCode: {
      javascript: `function moveZeroes(nums) {
  // Write your solution here
  
}

// Test cases
let nums1 = [0,1,0,3,12];
moveZeroes(nums1);
console.log(JSON.stringify(nums1)); // Expected: [1,3,12,0,0]

let nums2 = [0];
moveZeroes(nums2);
console.log(JSON.stringify(nums2)); // Expected: [0]`,
      python: `import json
def moveZeroes(nums):
    # Write your solution here
    pass

# Test cases
nums1 = [0,1,0,3,12]
moveZeroes(nums1)
print(json.dumps(nums1, separators=(',', ':')))

nums2 = [0]
moveZeroes(nums2)
print(json.dumps(nums2, separators=(',', ':')))`,
      java: `import java.util.*;

class Solution {
    public static void moveZeroes(int[] nums) {
        // Write your solution here
        
    }
    
    public static void main(String[] args) {
        int[] nums1 = {0,1,0,3,12};
        moveZeroes(nums1);
        System.out.println(Arrays.toString(nums1));
        
        int[] nums2 = {0};
        moveZeroes(nums2);
        System.out.println(Arrays.toString(nums2));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    void moveZeroes(vector<int>& nums) {
        // Write your solution here
        
    }
};

string vectorToString(const vector<int>& res) {
    string s = "[";
    for (int i = 0; i < res.size(); i++) {
        s += to_string(res[i]) + (i == res.size() - 1 ? "" : ",");
    }
    s += "]";
    return s;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> nums1 = {0,1,0,3,12};
    sol.moveZeroes(nums1);
    cout << vectorToString(nums1) << endl;
    
    vector<int> nums2 = {0};
    sol.moveZeroes(nums2);
    cout << vectorToString(nums2) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "[1,3,12,0,0]\n[0]",
      python: "[1,3,12,0,0]\n[0]",
      java: "[1, 3, 12, 0, 0]\n[0]",
      cpp: "[1,3,12,0,0]\n[0]",
    },
  },

  "permutations": {
    id: "permutations",
    title: "Permutations",
    difficulty: "Medium",
    category: "Array • Backtracking",
    description: {
      text: "Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.",
      notes: [],
    },
    examples: [
      {
        input: "nums = [1,2,3]",
        output: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]",
      },
      {
        input: "nums = [0,1]",
        output: "[[0,1],[1,0]]",
      },
      {
        input: "nums = [1]",
        output: "[[1]]",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 6",
      "-10 ≤ nums[i] ≤ 10",
      "All the integers of nums are unique."
    ],
    starterCode: {
      javascript: `function permute(nums) {
  // Write your solution here
  
}

// Test cases
console.log(JSON.stringify(permute([1,2,3]).sort())); 
console.log(JSON.stringify(permute([0,1]).sort()));
console.log(JSON.stringify(permute([1]).sort()));`,
      python: `import json
def permute(nums):
    # Write your solution here
    pass

# Test cases
print(json.dumps(sorted(permute([1,2,3])), separators=(',', ':')))
print(json.dumps(sorted(permute([0,1])), separators=(',', ':')))
print(json.dumps(sorted(permute([1])), separators=(',', ':')))`,
      java: `import java.util.*;

class Solution {
    public static List<List<Integer>> permute(int[] nums) {
        // Write your solution here
        
        return new ArrayList<>();
    }
    
    // Helper used for deterministic tests
    public static void main(String[] args) {
        List<List<Integer>> res1 = permute(new int[]{1,2,3});
        res1.sort((a,b) -> {
            for(int i=0; i<a.size(); i++) {
                if(!a.get(i).equals(b.get(i))) return a.get(i) - b.get(i);
            }
            return 0;
        });
        System.out.println(res1);
        
        List<List<Integer>> res2 = permute(new int[]{0,1});
        res2.sort((a,b) -> {
            for(int i=0; i<a.size(); i++) {
                if(!a.get(i).equals(b.get(i))) return a.get(i) - b.get(i);
            }
            return 0;
        });
        System.out.println(res2);
        
        List<List<Integer>> res3 = permute(new int[]{1});
        System.out.println(res3);
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <algorithm>

using namespace std;

class Solution {
public:
    vector<vector<int>> permute(vector<int>& nums) {
        // Write your solution here
        
        return {};
    }
};

string vectorToString(const vector<vector<int>>& res) {
    if (res.empty()) return "[]";
    string s = "[";
    for (int i = 0; i < res.size(); i++) {
        s += "[";
        for (int j = 0; j < res[i].size(); j++) {
            s += to_string(res[i][j]) + (j == res[i].size() - 1 ? "" : ",");
        }
        s += (i == res.size() - 1 ? "]" : "],");
    }
    s += "]";
    return s;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> nums1 = {1,2,3};
    vector<vector<int>> res1 = sol.permute(nums1);
    sort(res1.begin(), res1.end());
    cout << vectorToString(res1) << endl;
    
    vector<int> nums2 = {0,1};
    vector<vector<int>> res2 = sol.permute(nums2);
    sort(res2.begin(), res2.end());
    cout << vectorToString(res2) << endl;
    
    vector<int> nums3 = {1};
    vector<vector<int>> res3 = sol.permute(nums3);
    sort(res3.begin(), res3.end());
    cout << vectorToString(res3) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\n[[0,1],[1,0]]\n[[1]]",
      python: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\n[[0,1],[1,0]]\n[[1]]",
      java: "[[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]\n[[0, 1], [1, 0]]\n[[1]]",
      cpp: "[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]\n[[0,1],[1,0]]\n[[1]]",
    },
    },

     "reverse-linked-list": {
    id: "reverse-linked-list",
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked List • Recursion",
    description: {
      text: "Given the head of a singly linked list, reverse the list, and return the reversed list.",
      notes: [],
    },
    examples: [
      {
        input: "head = [1,2,3,4,5]",
        output: "[5,4,3,2,1]",
      },
      {
        input: "head = [1,2]",
        output: "[2,1]",
      },
      {
        input: "head = []",
        output: "[]",
      },
    ],
    constraints: [
      "The number of nodes in the list is the range [0, 5000].",
      "-5000 ≤ Node.val ≤ 5000",
    ],
    starterCode: {
      javascript: `/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
function reverseList(head) {
  // Write your solution here
  
}

// Test helper
function createList(arr) {
  if (!arr.length) return null;
  let head = {val: arr[0], next: null};
  let curr = head;
  for (let i = 1; i < arr.length; i++) {
    curr.next = {val: arr[i], next: null};
    curr = curr.next;
  }
  return head;
}

function listToArray(head) {
  let res = [];
  while (head) {
    res.push(head.val);
    head = head.next;
  }
  return res;
}

// Test cases
console.log(JSON.stringify(listToArray(reverseList(createList([1,2,3,4,5])))));
console.log(JSON.stringify(listToArray(reverseList(createList([1,2])))));
console.log(JSON.stringify(listToArray(reverseList(createList([])))));`,
      python: `import json
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverseList(head):
    # Write your solution here
    pass

def createList(arr):
    if not arr: return None
    head = ListNode(arr[0])
    curr = head
    for i in range(1, len(arr)):
        curr.next = ListNode(arr[i])
        curr = curr.next
    return head

def listToArray(head):
    res = []
    while head:
        res.append(head.val)
        head = head.next
    return res

# Test cases
print(json.dumps(listToArray(reverseList(createList([1,2,3,4,5]))), separators=(',', ':')))
print(json.dumps(listToArray(reverseList(createList([1,2]))), separators=(',', ':')))
print(json.dumps(listToArray(reverseList(createList([]))), separators=(',', ':')))`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

class Solution {
    public static ListNode reverseList(ListNode head) {
        // Write your solution here
        
        return head;
    }
    
    public static ListNode createList(int[] arr) {
        if (arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode curr = head;
        for (int i = 1; i < arr.length; i++) {
            curr.next = new ListNode(arr[i]);
            curr = curr.next;
        }
        return head;
    }
    
    public static void printList(ListNode head) {
        List<Integer> res = new ArrayList<>();
        while (head != null) {
            res.add(head.val);
            head = head.next;
        }
        System.out.println(res);
    }
    
    public static void main(String[] args) {
        printList(reverseList(createList(new int[]{1,2,3,4,5})));
        printList(reverseList(createList(new int[]{1,2})));
        printList(reverseList(createList(new int[]{})));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

class Solution {
public:
    ListNode* reverseList(ListNode* head) {
        // Write your solution here
        
        return head;
    }
};

ListNode* createList(vector<int> arr) {
    if (arr.empty()) return NULL;
    ListNode* head = new ListNode(arr[0]);
    ListNode* curr = head;
    for (int i = 1; i < arr.size(); i++) {
        curr->next = new ListNode(arr[i]);
        curr = curr->next;
    }
    return head;
}

void printList(ListNode* head) {
    cout << "[";
    while (head) {
        cout << head->val << (head->next ? "," : "");
        head = head->next;
    }
    cout << "]" << endl;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    printList(sol.reverseList(createList({1,2,3,4,5})));
    printList(sol.reverseList(createList({1,2})));
    printList(sol.reverseList(createList({})));
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "[5,4,3,2,1]\n[2,1]\n[]",
      python: "[5,4,3,2,1]\n[2,1]\n[]",
      java: "[5, 4, 3, 2, 1]\n[2, 1]\n[]",
      cpp: "[5,4,3,2,1]\n[2,1]\n[]",
    },
  },

  "merge-two-sorted-lists": {
    id: "merge-two-sorted-lists",
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List • Recursion",
    description: {
      text: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
      notes: [],
    },
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]",
      },
      {
        input: "list1 = [], list2 = []",
        output: "[]",
      },
      {
        input: "list1 = [], list2 = [0]",
        output: "[0]",
      },
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 ≤ Node.val ≤ 100",
      "Both list1 and list2 are sorted in non-decreasing order.",
    ],
    starterCode: {
      javascript: `function mergeTwoLists(list1, list2) {
  // Write your solution here
  
}

// Test helper
function createList(arr) {
  if (!arr.length) return null;
  let head = {val: arr[0], next: null};
  let curr = head;
  for (let i = 1; i < arr.length; i++) {
    curr.next = {val: arr[i], next: null};
    curr = curr.next;
  }
  return head;
}

function listToArray(head) {
  let res = [];
  while (head) {
    res.push(head.val);
    head = head.next;
  }
  return res;
}

// Test cases
console.log(JSON.stringify(listToArray(mergeTwoLists(createList([1,2,4]), createList([1,3,4])))));
console.log(JSON.stringify(listToArray(mergeTwoLists(createList([]), createList([])))));
console.log(JSON.stringify(listToArray(mergeTwoLists(createList([]), createList([0])))));`,
      python: `import json
class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def mergeTwoLists(list1, list2):
    # Write your solution here
    pass

def createList(arr):
    if not arr: return None
    head = ListNode(arr[0])
    curr = head
    for i in range(1, len(arr)):
        curr.next = ListNode(arr[i])
        curr = curr.next
    return head

def listToArray(head):
    res = []
    while head:
        res.append(head.val)
        head = head.next
    return res

# Test cases
print(json.dumps(listToArray(mergeTwoLists(createList([1,2,4]), createList([1,3,4]))), separators=(',', ':')))
print(json.dumps(listToArray(mergeTwoLists(createList([]), createList([]))), separators=(',', ':')))
print(json.dumps(listToArray(mergeTwoLists(createList([]), createList([0]))), separators=(',', ':')))`,
      java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

class Solution {
    public static ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        // Write your solution here
        
        return null;
    }
    
    public static ListNode createList(int[] arr) {
        if (arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode curr = head;
        for (int i = 1; i < arr.length; i++) {
            curr.next = new ListNode(arr[i]);
            curr = curr.next;
        }
        return head;
    }
    
    public static void printList(ListNode head) {
        List<Integer> res = new ArrayList<>();
        while (head != null) {
            res.add(head.val);
            head = head.next;
        }
        System.out.println(res);
    }
    
    public static void main(String[] args) {
        printList(mergeTwoLists(createList(new int[]{1,2,4}), createList(new int[]{1,3,4})));
        printList(mergeTwoLists(createList(new int[]{}), createList(new int[]{})));
        printList(mergeTwoLists(createList(new int[]{}), createList(new int[]{0})));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

class Solution {
public:
    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
        // Write your solution here
        
        return NULL;
    }
};

ListNode* createList(vector<int> arr) {
    if (arr.empty()) return NULL;
    ListNode* head = new ListNode(arr[0]);
    ListNode* curr = head;
    for (int i = 1; i < arr.size(); i++) {
        curr->next = new ListNode(arr[i]);
        curr = curr->next;
    }
    return head;
}

void printList(ListNode* head) {
    cout << "[";
    while (head) {
        cout << head->val << (head->next ? "," : "");
        head = head->next;
    }
    cout << "]" << endl;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    printList(sol.mergeTwoLists(createList({1,2,4}), createList({1,3,4})));
    printList(sol.mergeTwoLists(createList({}), createList({})));
    printList(sol.mergeTwoLists(createList({}), createList({0})));
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "[1,1,2,3,4,4]\n[]\n[0]",
      python: "[1,1,2,3,4,4]\n[]\n[0]",
      java: "[1, 1, 2, 3, 4, 4]\n[]\n[0]",
      cpp: "[1,1,2,3,4,4]\n[]\n[0]",
    },
  },

  "validate-binary-search-tree": {
    id: "validate-binary-search-tree",
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    category: "Tree • Depth-First Search • Binary Search Tree • Binary Tree",
    description: {
      text: "Given the root of a binary tree, determine if it is a valid binary search tree (BST).",
      notes: [
        "A valid BST is defined as follows:",
        "The left subtree of a node contains only nodes with keys less than the node's key.",
        "The right subtree of a node contains only nodes with keys greater than the node's key.",
        "Both the left and right subtrees must also be binary search trees."
      ],
    },
    examples: [
      {
        input: "root = [2,1,3]",
        output: "true",
      },
      {
        input: "root = [5,1,4,null,null,3,6]",
        output: "false",
        explanation: "The root node's value is 5 but its right child's value is 4.",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [1, 10⁴].",
      "-2³¹ ≤ Node.val ≤ 2³¹ - 1",
    ],
    starterCode: {
      javascript: `/**
 * Definition for a binary tree node.
 * function TreeNode(val, left, right) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.left = (left===undefined ? null : left)
 *     this.right = (right===undefined ? null : right)
 * }
 */
function isValidBST(root) {
  // Write your solution here
  
}

// Test cases
// Tree [2,1,3]
let t1 = {val: 2, left: {val: 1}, right: {val: 3}};
console.log(isValidBST(t1)); // Expected: true

// Tree [5,1,4,null,null,3,6]
let t2 = {val: 5, left: {val: 1}, right: {val: 4, left: {val: 3}, right: {val: 6}}};
console.log(isValidBST(t2)); // Expected: false`,
      python: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def isValidBST(root):
    # Write your solution here
    pass

# Test cases
t1 = TreeNode(2, TreeNode(1), TreeNode(3))
print("true" if isValidBST(t1) else "false")

t2 = TreeNode(5, TreeNode(1), TreeNode(4, TreeNode(3), TreeNode(6)))
print("true" if isValidBST(t2) else "false")`,
      java: `class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val;
        this.left = left;
        this.right = right;
    }
}

class Solution {
    public static boolean isValidBST(TreeNode root) {
        // Write your solution here
        
        return false;
    }
    
    public static void main(String[] args) {
        TreeNode t1 = new TreeNode(2, new TreeNode(1), new TreeNode(3));
        System.out.println(isValidBST(t1));
        
        TreeNode t2 = new TreeNode(5, new TreeNode(1), new TreeNode(4, new TreeNode(3), new TreeNode(6)));
        System.out.println(isValidBST(t2));
    }
}`,
      cpp: `#include <iostream>
#include <climits>

using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
public:
    bool isValidBST(TreeNode* root) {
        // Write your solution here
        
        return false;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    TreeNode* t1 = new TreeNode(2, new TreeNode(1), new TreeNode(3));
    cout << (sol.isValidBST(t1) ? "true" : "false") << endl;
    
    TreeNode* t2 = new TreeNode(5, new TreeNode(1), new TreeNode(4, new TreeNode(3), new TreeNode(6)));
    cout << (sol.isValidBST(t2) ? "true" : "false") << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "true\nfalse",
      python: "true\nfalse",
      java: "true\nfalse",
      cpp: "true\nfalse",
    },
  },

  "binary-tree-level-order-traversal": {
    id: "binary-tree-level-order-traversal",
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    category: "Tree • Breadth-First Search • Binary Tree",
    description: {
      text: "Given the root of a binary tree, return the level order traversal of its nodes' values. (i.e., from left to right, level by level).",
      notes: [],
    },
    examples: [
      {
        input: "root = [3,9,20,null,null,15,7]",
        output: "[[3],[9,20],[15,7]]",
      },
      {
        input: "root = [1]",
        output: "[[1]]",
      },
      {
        input: "root = []",
        output: "[]",
      },
    ],
    constraints: [
      "The number of nodes in the tree is in the range [0, 2000].",
      "-1000 ≤ Node.val ≤ 1000",
    ],
    starterCode: {
      javascript: `function levelOrder(root) {
  // Write your solution here
  
}

// Test cases
let t1 = {val: 3, left: {val: 9}, right: {val: 20, left: {val: 15}, right: {val: 7}}};
console.log(JSON.stringify(levelOrder(t1)));

let t2 = {val: 1};
console.log(JSON.stringify(levelOrder(t2)));

console.log(JSON.stringify(levelOrder(null)));`,
      python: `import json
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def levelOrder(root):
    # Write your solution here
    pass

# Test cases
t1 = TreeNode(3, TreeNode(9), TreeNode(20, TreeNode(15), TreeNode(7)))
print(json.dumps(levelOrder(t1), separators=(',', ':')))

t2 = TreeNode(1)
print(json.dumps(levelOrder(t2), separators=(',', ':')))

print(json.dumps(levelOrder(None), separators=(',', ':')))`,
      java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) {
        this.val = val; this.left = left; this.right = right;
    }
}

class Solution {
    public static List<List<Integer>> levelOrder(TreeNode root) {
        // Write your solution here
        
        return new ArrayList<>();
    }
    
    public static void main(String[] args) {
        TreeNode t1 = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
        System.out.println(levelOrder(t1));
        
        TreeNode t2 = new TreeNode(1);
        System.out.println(levelOrder(t2));
        
        System.out.println(levelOrder(null));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <string>
#include <queue>

using namespace std;

struct TreeNode {
    int val;
    TreeNode *left;
    TreeNode *right;
    TreeNode(int x) : val(x), left(NULL), right(NULL) {}
    TreeNode(int x, TreeNode *left, TreeNode *right) : val(x), left(left), right(right) {}
};

class Solution {
public:
    vector<vector<int>> levelOrder(TreeNode* root) {
        // Write your solution here
        
        return {};
    }
};

string resToString(const vector<vector<int>>& res) {
    string s = "[";
    for(int i=0; i<res.size(); i++) {
        s += "[";
        for(int j=0; j<res[i].size(); j++) {
            s += to_string(res[i][j]) + (j == res[i].size()-1 ? "" : ",");
        }
        s += "]" + string(i == res.size()-1 ? "" : ",");
    }
    s += "]";
    return s;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    TreeNode* t1 = new TreeNode(3, new TreeNode(9), new TreeNode(20, new TreeNode(15), new TreeNode(7)));
    cout << resToString(sol.levelOrder(t1)) << endl;
    
    TreeNode* t2 = new TreeNode(1);
    cout << resToString(sol.levelOrder(t2)) << endl;
    
    cout << resToString(sol.levelOrder(NULL)) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "[[3],[9,20],[15,7]]\n[[1]]\n[]",
      python: "[[3],[9,20],[15,7]]\n[[1]]\n[]",
      java: "[[3], [9, 20], [15, 7]]\n[[1]]\n[]",
      cpp: "[[3],[9,20],[15,7]]\n[[1]]\n[]",
    },
  },

  "longest-increasing-subsequence": {
    id: "longest-increasing-subsequence",
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    category: "Array • Binary Search • Dynamic Programming",
    description: {
      text: "Given an integer array nums, return the length of the longest strictly increasing subsequence.",
      notes: [
        "A subsequence is an array that can be derived from another array by deleting some or no elements without changing the order of the remaining elements."
      ],
    },
    examples: [
      {
        input: "nums = [10,9,2,5,3,7,101,18]",
        output: "4",
        explanation: "The longest increasing subsequence is [2,3,7,101], therefore the length is 4.",
      },
      {
        input: "nums = [0,1,0,3,2,3]",
        output: "4",
      },
      {
        input: "nums = [7,7,7,7,7,7,7]",
        output: "1",
      },
    ],
    constraints: [
      "1 ≤ nums.length ≤ 2500",
      "-10⁴ ≤ nums[i] ≤ 10⁴",
    ],
    starterCode: {
      javascript: `function lengthOfLIS(nums) {
  // Write your solution here
  
}

// Test cases
console.log(lengthOfLIS([10,9,2,5,3,7,101,18])); // Expected: 4
console.log(lengthOfLIS([0,1,0,3,2,3])); // Expected: 4
console.log(lengthOfLIS([7,7,7,7,7,7,7])); // Expected: 1`,
      python: `def lengthOfLIS(nums):
    # Write your solution here
    pass

# Test cases
print(lengthOfLIS([10,9,2,5,3,7,101,18]))
print(lengthOfLIS([0,1,0,3,2,3]))
print(lengthOfLIS([7,7,7,7,7,7,7]))`,
      java: `class Solution {
    public static int lengthOfLIS(int[] nums) {
        // Write your solution here
        
        return 0;
    }
    
    public static void main(String[] args) {
        System.out.println(lengthOfLIS(new int[]{10,9,2,5,3,7,101,18}));
        System.out.println(lengthOfLIS(new int[]{0,1,0,3,2,3}));
        System.out.println(lengthOfLIS(new int[]{7,7,7,7,7,7,7}));
    }
}`,
      cpp: `#include <iostream>
#include <vector>
#include <algorithm>

using namespace std;

class Solution {
public:
    int lengthOfLIS(vector<int>& nums) {
        // Write your solution here
        
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> n1 = {10,9,2,5,3,7,101,18};
    cout << sol.lengthOfLIS(n1) << endl;
    vector<int> n2 = {0,1,0,3,2,3};
    cout << sol.lengthOfLIS(n2) << endl;
    vector<int> n3 = {7,7,7,7,7,7,7};
    cout << sol.lengthOfLIS(n3) << endl;
    return 0;
}
#endif`,
    },
    expectedOutput: {
      javascript: "4\n4\n1",
      python: "4\n4\n1",
      java: "4\n4\n1",
      cpp: "4\n4\n1",
    },
  },
  "pascals-triangle": {
  id: "pascals-triangle",
  title: "Pascal's Triangle",
  difficulty: "Easy",
  category: "Array • Dynamic Programming",
  description: {
    text: "Given an integer numRows, return the first numRows of Pascal's triangle. In Pascal's triangle, each number is the sum of the two numbers directly above it.",
    notes: [
      "The first and last element of each row is always 1.",
      "Each interior element is the sum of the two elements above it.",
    ],
  },
  examples: [
    {
      input: "numRows = 5",
      output: "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]",
      explanation: "Each row is built by summing adjacent elements from the previous row.",
    },
    {
      input: "numRows = 1",
      output: "[[1]]",
    },
  ],
  constraints: [
    "1 ≤ numRows ≤ 30",
  ],
  starterCode: {
    javascript: `function generate(numRows) {
  // Write your solution here
  
}

// Test cases
console.log(JSON.stringify(generate(5))); // Expected: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
console.log(JSON.stringify(generate(1))); // Expected: [[1]]`,

    python: `import json

def generate(numRows):
    # Write your solution here
    pass

# Test cases
print(json.dumps(generate(5), separators=(',', ':')))  # Expected: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
print(json.dumps(generate(1), separators=(',', ':')))  # Expected: [[1]]`,

    java: `import java.util.*;

class Solution {
    public static List<List<Integer>> generate(int numRows) {
        // Write your solution here
        
        return new ArrayList<>();
    }

    public static void main(String[] args) {
        System.out.println(generate(5)); // Expected: [[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]
        System.out.println(generate(1)); // Expected: [[1]]
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    vector<vector<int>> generate(int numRows) {
        // Write your solution here
        
        return {};
    }
};

string triangleToString(vector<vector<int>> res) {
    string s = "[";
    for (int i = 0; i < res.size(); i++) {
        s += "[";
        for (int j = 0; j < res[i].size(); j++) {
            s += to_string(res[i][j]) + (j == (int)res[i].size() - 1 ? "" : ",");
        }
        s += "]" + (i == (int)res.size() - 1 ? "" : ",");
    }
    s += "]";
    return s;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << triangleToString(sol.generate(5)) << endl;
    cout << triangleToString(sol.generate(1)) << endl;
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]\n[[1]]",
    python: "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]\n[[1]]",
    java: "[[1], [1, 1], [1, 2, 1], [1, 3, 3, 1], [1, 4, 6, 4, 1]]\n[[1]]",
    cpp: "[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]]\n[[1]]",
  },
},

"letter-combinations-phone-number": {
  id: "letter-combinations-phone-number",
  title: "Letter Combinations of a Phone Number",
  difficulty: "Medium",
  category: "String • Backtracking • Hash Table",
  description: {
    text: "Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order.",
    notes: [
      "A mapping of digits to letters (just like on a phone keypad) is given: 2→abc, 3→def, 4→ghi, 5→jkl, 6→mno, 7→pqrs, 8→tuv, 9→wxyz.",
      "If the input is an empty string, return an empty list.",
    ],
  },
  examples: [
    {
      input: `digits = "23"`,
      output: `["ad","ae","af","bd","be","bf","cd","ce","cf"]`,
      explanation: "2 maps to abc and 3 maps to def. All combinations of one letter from each.",
    },
    {
      input: `digits = ""`,
      output: `[]`,
    },
    {
      input: `digits = "2"`,
      output: `["a","b","c"]`,
    },
  ],
  constraints: [
    "0 ≤ digits.length ≤ 4",
    "digits[i] is a digit in the range ['2', '9']",
  ],
  starterCode: {
    javascript: `function letterCombinations(digits) {
  // Write your solution here
  
}

// Test cases
console.log(JSON.stringify(letterCombinations("23")));  // Expected: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
console.log(JSON.stringify(letterCombinations("")));    // Expected: []
console.log(JSON.stringify(letterCombinations("2")));   // Expected: ["a","b","c"]`,

    python: `import json

def letterCombinations(digits):
    # Write your solution here
    pass

# Test cases
print(json.dumps(letterCombinations("23"), separators=(',', ':')))  # Expected: ["ad","ae","af","bd","be","bf","cd","ce","cf"]
print(json.dumps(letterCombinations(""), separators=(',', ':')))    # Expected: []
print(json.dumps(letterCombinations("2"), separators=(',', ':')))   # Expected: ["a","b","c"]`,

    java: `import java.util.*;

class Solution {
    public static List<String> letterCombinations(String digits) {
        // Write your solution here
        
        return new ArrayList<>();
    }

    public static void main(String[] args) {
        System.out.println(letterCombinations("23")); // Expected: [ad, ae, af, bd, be, bf, cd, ce, cf]
        System.out.println(letterCombinations(""));   // Expected: []
        System.out.println(letterCombinations("2"));  // Expected: [a, b, c]
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    vector<string> letterCombinations(string digits) {
        // Write your solution here
        
        return {};
    }
};

string vecToString(vector<string> res) {
    string s = "[";
    for (int i = 0; i < res.size(); i++) {
        s += "\"" + res[i] + "\"" + (i == (int)res.size() - 1 ? "" : ",");
    }
    s += "]";
    return s;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << vecToString(sol.letterCombinations("23")) << endl;
    cout << vecToString(sol.letterCombinations("")) << endl;
    cout << vecToString(sol.letterCombinations("2")) << endl;
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: `["ad","ae","af","bd","be","bf","cd","ce","cf"]\n[]\n["a","b","c"]`,
    python: `["ad","ae","af","bd","be","bf","cd","ce","cf"]\n[]\n["a","b","c"]`,
    java: "[ad, ae, af, bd, be, bf, cd, ce, cf]\n[]\n[a, b, c]",
    cpp: `["ad","ae","af","bd","be","bf","cd","ce","cf"]\n[]\n["a","b","c"]`,
  },
},
"maximum-depth-of-binary-tree": {
  id: "maximum-depth-of-binary-tree",
  title: "Maximum Depth of Binary Tree",
  difficulty: "Easy",
  category: "Tree • Depth-First Search • Breadth-First Search • Binary Tree",
  description: {
    text: "Given the root of a binary tree, return its maximum depth. A binary tree's maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.",
    notes: [
      "A leaf is a node with no children.",
      "The depth of an empty tree is 0.",
    ],
  },
  examples: [
    {
      input: "root = [3,9,20,null,null,15,7]",
      output: "3",
      explanation: "The longest path is 3 → 20 → 15 (or 3 → 20 → 7), which has 3 nodes.",
    },
    {
      input: "root = [1,null,2]",
      output: "2",
    },
  ],
  constraints: [
    "The number of nodes in the tree is in the range [0, 10⁴]",
    "-100 ≤ Node.val ≤ 100",
  ],
  starterCode: {
    javascript: `class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function buildTree(arr) {
  if (!arr || arr.length === 0) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (i < arr.length) {
    const node = queue.shift();
    if (arr[i] !== null) { node.left = new TreeNode(arr[i]); queue.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]); queue.push(node.right); }
    i++;
  }
  return root;
}

function maxDepth(root) {
  // Write your solution here

}

// Test cases
console.log(maxDepth(buildTree([3,9,20,null,null,15,7]))); // Expected: 3
console.log(maxDepth(buildTree([1,null,2])));               // Expected: 2
console.log(maxDepth(buildTree([])));                       // Expected: 0`,

    python: `from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def buildTree(arr):
    if not arr:
        return None
    root = TreeNode(arr[0])
    queue = deque([root])
    i = 1
    while i < len(arr):
        node = queue.popleft()
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

def maxDepth(root):
    # Write your solution here
    pass

# Test cases
print(maxDepth(buildTree([3,9,20,None,None,15,7])))  # Expected: 3
print(maxDepth(buildTree([1,None,2])))               # Expected: 2
print(maxDepth(buildTree([])))                       # Expected: 0`,

    java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public static TreeNode buildTree(Integer[] arr) {
        if (arr == null || arr.length == 0) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int i = 1;
        while (i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) { node.left = new TreeNode(arr[i]); queue.add(node.left); }
            i++;
            if (i < arr.length && arr[i] != null) { node.right = new TreeNode(arr[i]); queue.add(node.right); }
            i++;
        }
        return root;
    }

    public static int maxDepth(TreeNode root) {
        // Write your solution here

        return 0;
    }

    public static void main(String[] args) {
        System.out.println(maxDepth(buildTree(new Integer[]{3,9,20,null,null,15,7}))); // Expected: 3
        System.out.println(maxDepth(buildTree(new Integer[]{1,null,2})));               // Expected: 2
        System.out.println(maxDepth(buildTree(new Integer[]{})));                       // Expected: 0
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

TreeNode* buildTree(vector<int> arr) {
    if (arr.empty()) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (i < (int)arr.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < (int)arr.size() && arr[i] != -1) { node->left = new TreeNode(arr[i]); q.push(node->left); }
        i++;
        if (i < (int)arr.size() && arr[i] != -1) { node->right = new TreeNode(arr[i]); q.push(node->right); }
        i++;
    }
    return root;
}

class Solution {
public:
    int maxDepth(TreeNode* root) {
        // Write your solution here

        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << sol.maxDepth(buildTree({3,9,20,-1,-1,15,7})) << endl; // Expected: 3
    cout << sol.maxDepth(buildTree({1,-1,2})) << endl;             // Expected: 2
    cout << sol.maxDepth(nullptr) << endl;                         // Expected: 0
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "3\n2\n0",
    python: "3\n2\n0",
    java: "3\n2\n0",
    cpp: "3\n2\n0",
  },
},

"coin-change": {
  id: "coin-change",
  title: "Coin Change",
  difficulty: "Medium",
  category: "Array • Dynamic Programming • Breadth-First Search",
  description: {
    text: "You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.",
    notes: [
      "You may assume that you have an infinite number of each kind of coin.",
      "The answer is guaranteed to fit in a signed 32-bit integer.",
    ],
  },
  examples: [
    {
      input: "coins = [1,5,11], amount = 15",
      output: "3",
      explanation: "15 = 11 + 3×1 is not optimal. 15 = 5 + 5 + 5 uses 3 coins.",
    },
    {
      input: "coins = [2], amount = 3",
      output: "-1",
      explanation: "Amount 3 cannot be made with only coin denomination 2.",
    },
    {
      input: "coins = [1], amount = 0",
      output: "0",
    },
  ],
  constraints: [
    "1 ≤ coins.length ≤ 12",
    "1 ≤ coins[i] ≤ 2³¹ - 1",
    "0 ≤ amount ≤ 10⁴",
  ],
  starterCode: {
    javascript: `function coinChange(coins, amount) {
  // Write your solution here

}

// Test cases
console.log(coinChange([1,5,11], 15)); // Expected: 3
console.log(coinChange([2], 3));       // Expected: -1
console.log(coinChange([1], 0));       // Expected: 0`,

    python: `def coinChange(coins, amount):
    # Write your solution here
    pass

# Test cases
print(coinChange([1,5,11], 15))  # Expected: 3
print(coinChange([2], 3))        # Expected: -1
print(coinChange([1], 0))        # Expected: 0`,

    java: `import java.util.*;

class Solution {
    public static int coinChange(int[] coins, int amount) {
        // Write your solution here

        return -1;
    }

    public static void main(String[] args) {
        System.out.println(coinChange(new int[]{1,5,11}, 15)); // Expected: 3
        System.out.println(coinChange(new int[]{2}, 3));       // Expected: -1
        System.out.println(coinChange(new int[]{1}, 0));       // Expected: 0
    }
}`,

    cpp: `#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    int coinChange(vector<int>& coins, int amount) {
        // Write your solution here

        return -1;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> c1 = {1,5,11};
    cout << sol.coinChange(c1, 15) << endl; // Expected: 3
    vector<int> c2 = {2};
    cout << sol.coinChange(c2, 3) << endl;  // Expected: -1
    vector<int> c3 = {1};
    cout << sol.coinChange(c3, 0) << endl;  // Expected: 0
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "3\n-1\n0",
    python: "3\n-1\n0",
    java: "3\n-1\n0",
    cpp: "3\n-1\n0",
  },
},
"flood-fill": {
  id: "flood-fill",
  title: "Flood Fill",
  difficulty: "Easy",
  category: "Array • Depth-First Search • Breadth-First Search • Matrix",
  description: {
    text: "An image is represented by an m x n integer grid image where image[i][j] represents the pixel value of the image. You are given three integers sr, sc, and color. Perform a flood fill starting from the pixel image[sr][sc]. To perform a flood fill, consider the starting pixel, plus any pixels connected 4-directionally to the starting pixel of the same color as the starting pixel, and any pixels connected 4-directionally to those pixels (also with the same color), and so on. Replace the color of all of the aforementioned pixels with color. Return the modified image after performing the flood fill.",
    notes: [
      "Only 4-directional neighbors (up, down, left, right) are considered connected.",
      "If the starting pixel already has the target color, no changes are needed.",
    ],
  },
  examples: [
    {
      input: "image = [[1,1,1],[1,1,0],[1,0,1]], sr = 1, sc = 1, color = 2",
      output: "[[2,2,2],[2,2,0],[2,0,1]]",
      explanation: "Starting from center pixel (1,1) with value 1, all connected 1s are replaced with 2. The bottom-right 1 is not connected.",
    },
    {
      input: "image = [[0,0,0],[0,0,0]], sr = 0, sc = 0, color = 0",
      output: "[[0,0,0],[0,0,0]]",
      explanation: "The starting pixel already has color 0, so no changes are made.",
    },
  ],
  constraints: [
    "m == image.length",
    "n == image[i].length",
    "1 ≤ m, n ≤ 50",
    "0 ≤ image[i][j], color < 2¹⁶",
    "0 ≤ sr < m",
    "0 ≤ sc < n",
  ],
  starterCode: {
    javascript: `function floodFill(image, sr, sc, color) {
  // Write your solution here

}

// Test cases
console.log(JSON.stringify(floodFill([[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2))); // Expected: [[2,2,2],[2,2,0],[2,0,1]]
console.log(JSON.stringify(floodFill([[0,0,0],[0,0,0]], 0, 0, 0)));          // Expected: [[0,0,0],[0,0,0]]`,

    python: `import json

def floodFill(image, sr, sc, color):
    # Write your solution here
    pass

# Test cases
print(json.dumps(floodFill([[1,1,1],[1,1,0],[1,0,1]], 1, 1, 2), separators=(',', ':')))  # Expected: [[2,2,2],[2,2,0],[2,0,1]]
print(json.dumps(floodFill([[0,0,0],[0,0,0]], 0, 0, 0), separators=(',', ':')))           # Expected: [[0,0,0],[0,0,0]]`,

    java: `import java.util.*;

class Solution {
    public static int[][] floodFill(int[][] image, int sr, int sc, int color) {
        // Write your solution here

        return image;
    }

    public static void main(String[] args) {
        System.out.println(Arrays.deepToString(floodFill(new int[][]{{1,1,1},{1,1,0},{1,0,1}}, 1, 1, 2))); // Expected: [[2, 2, 2], [2, 2, 0], [2, 0, 1]]
        System.out.println(Arrays.deepToString(floodFill(new int[][]{{0,0,0},{0,0,0}}, 0, 0, 0)));          // Expected: [[0, 0, 0], [0, 0, 0]]
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    vector<vector<int>> floodFill(vector<vector<int>>& image, int sr, int sc, int color) {
        // Write your solution here

        return image;
    }
};

string matrixToString(vector<vector<int>> mat) {
    string s = "[";
    for (int i = 0; i < (int)mat.size(); i++) {
        s += "[";
        for (int j = 0; j < (int)mat[i].size(); j++) {
            s += to_string(mat[i][j]) + (j == (int)mat[i].size() - 1 ? "" : ",");
        }
        s += "]" + (i == (int)mat.size() - 1 ? "" : ",");
    }
    s += "]";
    return s;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<vector<int>> img1 = {{1,1,1},{1,1,0},{1,0,1}};
    cout << matrixToString(sol.floodFill(img1, 1, 1, 2)) << endl; // Expected: [[2,2,2],[2,2,0],[2,0,1]]
    vector<vector<int>> img2 = {{0,0,0},{0,0,0}};
    cout << matrixToString(sol.floodFill(img2, 0, 0, 0)) << endl;  // Expected: [[0,0,0],[0,0,0]]
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "[[2,2,2],[2,2,0],[2,0,1]]\n[[0,0,0],[0,0,0]]",
    python: "[[2,2,2],[2,2,0],[2,0,1]]\n[[0,0,0],[0,0,0]]",
    java: "[[2, 2, 2], [2, 2, 0], [2, 0, 1]]\n[[0, 0, 0], [0, 0, 0]]",
    cpp: "[[2,2,2],[2,2,0],[2,0,1]]\n[[0,0,0],[0,0,0]]",
  },
},
"rotate-array": {
  id: "rotate-array",
  title: "Rotate Array",
  difficulty: "Medium",
  category: "Array • Two Pointers • Math",
  description: {
    text: "Given an integer array nums, rotate the array to the right by k steps, where k is non-negative.",
    notes: [
      "There are at least three different ways to solve this problem.",
      "Could you do it in-place with O(1) extra space?",
      "k is taken modulo nums.length, so rotating by k = nums.length results in the original array.",
    ],
  },
  examples: [
    {
      input: "nums = [1,2,3,4,5,6,7], k = 3",
      output: "[5,6,7,1,2,3,4]",
      explanation: "Rotate right by 1: [7,1,2,3,4,5,6]. By 2: [6,7,1,2,3,4,5]. By 3: [5,6,7,1,2,3,4].",
    },
    {
      input: "nums = [-1,-100,3,99], k = 2",
      output: "[3,99,-1,-100]",
      explanation: "Rotate right by 1: [99,-1,-100,3]. By 2: [3,99,-1,-100].",
    },
  ],
  constraints: [
    "1 ≤ nums.length ≤ 10⁵",
    "-2³¹ ≤ nums[i] ≤ 2³¹ - 1",
    "0 ≤ k ≤ 10⁵",
  ],
  starterCode: {
    javascript: `function rotate(nums, k) {
  // Write your solution here (modify nums in-place)

}

// Test cases
const a = [1,2,3,4,5,6,7];
rotate(a, 3);
console.log(JSON.stringify(a)); // Expected: [5,6,7,1,2,3,4]

const b = [-1,-100,3,99];
rotate(b, 2);
console.log(JSON.stringify(b)); // Expected: [3,99,-1,-100]`,

    python: `import json

def rotate(nums, k):
    # Write your solution here (modify nums in-place)
    pass

# Test cases
a = [1,2,3,4,5,6,7]
rotate(a, 3)
print(json.dumps(a, separators=(',', ':')))  # Expected: [5,6,7,1,2,3,4]

b = [-1,-100,3,99]
rotate(b, 2)
print(json.dumps(b, separators=(',', ':')))  # Expected: [3,99,-1,-100]`,

    java: `import java.util.*;

class Solution {
    public static void rotate(int[] nums, int k) {
        // Write your solution here (modify nums in-place)

    }

    public static void main(String[] args) {
        int[] a = {1,2,3,4,5,6,7};
        rotate(a, 3);
        System.out.println(Arrays.toString(a)); // Expected: [5, 6, 7, 1, 2, 3, 4]

        int[] b = {-1,-100,3,99};
        rotate(b, 2);
        System.out.println(Arrays.toString(b)); // Expected: [3, 99, -1, -100]
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    void rotate(vector<int>& nums, int k) {
        // Write your solution here (modify nums in-place)

    }
};

string vecToString(vector<int>& v) {
    string s = "[";
    for (int i = 0; i < (int)v.size(); i++) {
        s += to_string(v[i]) + (i == (int)v.size() - 1 ? "" : ",");
    }
    s += "]";
    return s;
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> a = {1,2,3,4,5,6,7};
    sol.rotate(a, 3);
    cout << vecToString(a) << endl; // Expected: [5,6,7,1,2,3,4]

    vector<int> b = {-1,-100,3,99};
    sol.rotate(b, 2);
    cout << vecToString(b) << endl; // Expected: [3,99,-1,-100]
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "[5,6,7,1,2,3,4]\n[3,99,-1,-100]",
    python: "[5,6,7,1,2,3,4]\n[3,99,-1,-100]",
    java: "[5, 6, 7, 1, 2, 3, 4]\n[3, 99, -1, -100]",
    cpp: "[5,6,7,1,2,3,4]\n[3,99,-1,-100]",
  },
},

"symmetric-tree": {
  id: "symmetric-tree",
  title: "Symmetric Tree",
  difficulty: "Easy",
  category: "Tree • Depth-First Search • Breadth-First Search • Binary Tree",
  description: {
    text: "Given the root of a binary tree, check whether it is a mirror of itself (i.e., symmetric around its center).",
    notes: [
      "A tree is symmetric if the left subtree is a mirror reflection of the right subtree.",
      "Can you solve it both recursively and iteratively?",
    ],
  },
  examples: [
    {
      input: "root = [1,2,2,3,4,4,3]",
      output: "true",
      explanation: "The tree is symmetric — left and right subtrees are mirror images of each other.",
    },
    {
      input: "root = [1,2,2,null,3,null,3]",
      output: "false",
      explanation: "The tree is not symmetric — the right children differ between the two sides.",
    },
  ],
  constraints: [
    "The number of nodes in the tree is in the range [1, 1000]",
    "-100 ≤ Node.val ≤ 100",
  ],
  starterCode: {
    javascript: `class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function buildTree(arr) {
  if (!arr || arr.length === 0) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (i < arr.length) {
    const node = queue.shift();
    if (arr[i] !== null) { node.left = new TreeNode(arr[i]); queue.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]); queue.push(node.right); }
    i++;
  }
  return root;
}

function isSymmetric(root) {
  // Write your solution here

}

// Test cases
console.log(isSymmetric(buildTree([1,2,2,3,4,4,3])));         // Expected: true
console.log(isSymmetric(buildTree([1,2,2,null,3,null,3])));   // Expected: false`,

    python: `from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def buildTree(arr):
    if not arr:
        return None
    root = TreeNode(arr[0])
    queue = deque([root])
    i = 1
    while i < len(arr):
        node = queue.popleft()
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

def isSymmetric(root):
    # Write your solution here
    pass

# Test cases
print(isSymmetric(buildTree([1,2,2,3,4,4,3])))        # Expected: True
print(isSymmetric(buildTree([1,2,2,None,3,None,3])))  # Expected: False`,

    java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public static TreeNode buildTree(Integer[] arr) {
        if (arr == null || arr.length == 0) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int i = 1;
        while (i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) { node.left = new TreeNode(arr[i]); queue.add(node.left); }
            i++;
            if (i < arr.length && arr[i] != null) { node.right = new TreeNode(arr[i]); queue.add(node.right); }
            i++;
        }
        return root;
    }

    public static boolean isSymmetric(TreeNode root) {
        // Write your solution here

        return false;
    }

    public static void main(String[] args) {
        System.out.println(isSymmetric(buildTree(new Integer[]{1,2,2,3,4,4,3})));        // Expected: true
        System.out.println(isSymmetric(buildTree(new Integer[]{1,2,2,null,3,null,3})));  // Expected: false
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

TreeNode* buildTree(vector<int> arr) {
    if (arr.empty()) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (i < (int)arr.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < (int)arr.size() && arr[i] != -1) { node->left = new TreeNode(arr[i]); q.push(node->left); }
        i++;
        if (i < (int)arr.size() && arr[i] != -1) { node->right = new TreeNode(arr[i]); q.push(node->right); }
        i++;
    }
    return root;
}

class Solution {
public:
    bool isSymmetric(TreeNode* root) {
        // Write your solution here

        return false;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << boolalpha << sol.isSymmetric(buildTree({1,2,2,3,4,4,3})) << endl;        // Expected: true
    cout << boolalpha << sol.isSymmetric(buildTree({1,2,2,-1,3,-1,3})) << endl;      // Expected: false
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "true\nfalse",
    python: "True\nFalse",
    java: "true\nfalse",
    cpp: "true\nfalse",
  },
},

"top-k-frequent-elements": {
  id: "top-k-frequent-elements",
  title: "Top K Frequent Elements",
  difficulty: "Medium",
  category: "Array • Hash Table • Sorting • Heap",
  description: {
    text: "Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order.",
    notes: [
      "It is guaranteed that the answer is unique.",
      "Your algorithm's time complexity must be better than O(n log n), where n is the array's size.",
    ],
  },
  examples: [
    {
      input: "nums = [1,1,1,2,2,3], k = 2",
      output: "[1,2]",
      explanation: "1 appears 3 times, 2 appears 2 times. The top 2 frequent elements are [1,2].",
    },
    {
      input: "nums = [1], k = 1",
      output: "[1]",
    },
  ],
  constraints: [
    "1 ≤ nums.length ≤ 10⁵",
    "-10⁴ ≤ nums[i] ≤ 10⁴",
    "k is in the range [1, the number of unique elements in the array]",
    "It is guaranteed that the answer is unique",
  ],
  starterCode: {
    javascript: `function topKFrequent(nums, k) {
  // Write your solution here

}

// Test cases
console.log(JSON.stringify(topKFrequent([1,1,1,2,2,3], 2))); // Expected: [1,2]
console.log(JSON.stringify(topKFrequent([1], 1)));            // Expected: [1]`,

    python: `import json

def topKFrequent(nums, k):
    # Write your solution here
    pass

# Test cases
print(json.dumps(topKFrequent([1,1,1,2,2,3], 2), separators=(',', ':')))  # Expected: [1,2]
print(json.dumps(topKFrequent([1], 1), separators=(',', ':')))            # Expected: [1]`,

    java: `import java.util.*;

class Solution {
    public static int[] topKFrequent(int[] nums, int k) {
        // Write your solution here

        return new int[0];
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(topKFrequent(new int[]{1,1,1,2,2,3}, 2))); // Expected: [1, 2]
        System.out.println(Arrays.toString(topKFrequent(new int[]{1}, 1)));            // Expected: [1]
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    vector<int> topKFrequent(vector<int>& nums, int k) {
        // Write your solution here

        return {};
    }
};

string vecToString(vector<int> v) {
    string s = "[";
    for (int i = 0; i < (int)v.size(); i++)
        s += to_string(v[i]) + (i == (int)v.size()-1 ? "" : ",");
    return s + "]";
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> a = {1,1,1,2,2,3};
    cout << vecToString(sol.topKFrequent(a, 2)) << endl; // Expected: [1,2]
    vector<int> b = {1};
    cout << vecToString(sol.topKFrequent(b, 1)) << endl; // Expected: [1]
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "[1,2]\n[1]",
    python: "[1,2]\n[1]",
    java: "[1, 2]\n[1]",
    cpp: "[1,2]\n[1]",
  },
},

"linked-list-cycle": {
  id: "linked-list-cycle",
  title: "Linked List Cycle",
  difficulty: "Easy",
  category: "Linked List • Hash Table • Two Pointers",
  description: {
    text: "Given head, the head of a linked list, determine if the linked list has a cycle in it. There is a cycle if there is some node in the list that can be reached again by continuously following the next pointer. Return true if there is a cycle, otherwise return false.",
    notes: [
      "Use Floyd's Cycle Detection Algorithm (fast and slow pointers) for O(1) space.",
      "pos is used internally to denote the index where the tail connects back — it is not passed as a parameter.",
    ],
  },
  examples: [
    {
      input: "head = [3,2,0,-4], pos = 1",
      output: "true",
      explanation: "The tail connects back to node at index 1, forming a cycle.",
    },
    {
      input: "head = [1,2], pos = 0",
      output: "true",
      explanation: "The tail connects back to node at index 0, forming a cycle.",
    },
    {
      input: "head = [1], pos = -1",
      output: "false",
      explanation: "There is no cycle in this linked list.",
    },
  ],
  constraints: [
    "The number of nodes in the list is in the range [0, 10⁴]",
    "-10⁵ ≤ Node.val ≤ 10⁵",
    "pos is -1 or a valid index in the linked list",
  ],
  starterCode: {
    javascript: `class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function buildList(arr, pos) {
  if (!arr.length) return null;
  const nodes = arr.map(v => new ListNode(v));
  for (let i = 0; i < nodes.length - 1; i++) nodes[i].next = nodes[i+1];
  if (pos !== -1) nodes[nodes.length - 1].next = nodes[pos];
  return nodes[0];
}

function hasCycle(head) {
  // Write your solution here

}

// Test cases
console.log(hasCycle(buildList([3,2,0,-4], 1))); // Expected: true
console.log(hasCycle(buildList([1,2], 0)));       // Expected: true
console.log(hasCycle(buildList([1], -1)));        // Expected: false`,

    python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def buildList(arr, pos):
    if not arr:
        return None
    nodes = [ListNode(v) for v in arr]
    for i in range(len(nodes) - 1):
        nodes[i].next = nodes[i+1]
    if pos != -1:
        nodes[-1].next = nodes[pos]
    return nodes[0]

def hasCycle(head):
    # Write your solution here
    pass

# Test cases
print(hasCycle(buildList([3,2,0,-4], 1)))  # Expected: True
print(hasCycle(buildList([1,2], 0)))       # Expected: True
print(hasCycle(buildList([1], -1)))        # Expected: False`,

    java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

class Solution {
    public static ListNode buildList(int[] arr, int pos) {
        if (arr.length == 0) return null;
        ListNode[] nodes = new ListNode[arr.length];
        for (int i = 0; i < arr.length; i++) nodes[i] = new ListNode(arr[i]);
        for (int i = 0; i < arr.length - 1; i++) nodes[i].next = nodes[i+1];
        if (pos != -1) nodes[arr.length - 1].next = nodes[pos];
        return nodes[0];
    }

    public static boolean hasCycle(ListNode head) {
        // Write your solution here

        return false;
    }

    public static void main(String[] args) {
        System.out.println(hasCycle(buildList(new int[]{3,2,0,-4}, 1))); // Expected: true
        System.out.println(hasCycle(buildList(new int[]{1,2}, 0)));      // Expected: true
        System.out.println(hasCycle(buildList(new int[]{1}, -1)));       // Expected: false
    }
}`,

    cpp: `#include <iostream>
#include <vector>

using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v) : val(v), next(nullptr) {}
};

ListNode* buildList(vector<int> arr, int pos) {
    if (arr.empty()) return nullptr;
    vector<ListNode*> nodes;
    for (int v : arr) nodes.push_back(new ListNode(v));
    for (int i = 0; i < (int)nodes.size()-1; i++) nodes[i]->next = nodes[i+1];
    if (pos != -1) nodes.back()->next = nodes[pos];
    return nodes[0];
}

class Solution {
public:
    bool hasCycle(ListNode* head) {
        // Write your solution here

        return false;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << boolalpha << sol.hasCycle(buildList({3,2,0,-4}, 1)) << endl; // Expected: true
    cout << boolalpha << sol.hasCycle(buildList({1,2}, 0)) << endl;      // Expected: true
    cout << boolalpha << sol.hasCycle(buildList({1}, -1)) << endl;       // Expected: false
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "true\ntrue\nfalse",
    python: "True\nTrue\nFalse",
    java: "true\ntrue\nfalse",
    cpp: "true\ntrue\nfalse",
  },
},

"min-stack": {
  id: "min-stack",
  title: "Min Stack",
  difficulty: "Medium",
  category: "Stack • Design",
  description: {
    text: "Design a stack that supports push, pop, top, and retrieving the minimum element in constant time. Implement the MinStack class with the following methods: push(val), pop(), top(), and getMin().",
    notes: [
      "push(val) pushes the element val onto the stack.",
      "pop() removes the element on the top of the stack.",
      "top() gets the top element of the stack.",
      "getMin() retrieves the minimum element in the stack.",
      "All operations must run in O(1) time.",
    ],
  },
  examples: [
    {
      input: `["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]`,
      output: `[null,null,null,null,-3,null,0,-2]`,
      explanation: "After pushing -2, 0, -3: getMin=-3. After pop: top=0, getMin=-2.",
    },
  ],
  constraints: [
    "-2³¹ ≤ val ≤ 2³¹ - 1",
    "pop, top and getMin operations will always be called on non-empty stacks",
    "At most 3 × 10⁴ calls will be made to push, pop, top, and getMin",
  ],
  starterCode: {
    javascript: `class MinStack {
  constructor() {
    // Write your solution here
  }

  push(val) {
    // Write your solution here
  }

  pop() {
    // Write your solution here
  }

  top() {
    // Write your solution here
  }

  getMin() {
    // Write your solution here
  }
}

// Test cases
const stack = new MinStack();
stack.push(-2);
stack.push(0);
stack.push(-3);
console.log(stack.getMin()); // Expected: -3
stack.pop();
console.log(stack.top());    // Expected: 0
console.log(stack.getMin()); // Expected: -2`,

    python: `class MinStack:
    def __init__(self):
        # Write your solution here
        pass

    def push(self, val: int) -> None:
        # Write your solution here
        pass

    def pop(self) -> None:
        # Write your solution here
        pass

    def top(self) -> int:
        # Write your solution here
        pass

    def getMin(self) -> int:
        # Write your solution here
        pass

# Test cases
stack = MinStack()
stack.push(-2)
stack.push(0)
stack.push(-3)
print(stack.getMin())  # Expected: -3
stack.pop()
print(stack.top())     # Expected: 0
print(stack.getMin())  # Expected: -2`,

    java: `class MinStack {
    // Write your solution here

    public MinStack() {

    }

    public void push(int val) {

    }

    public void pop() {

    }

    public int top() {
        return 0;
    }

    public int getMin() {
        return 0;
    }

    public static void main(String[] args) {
        MinStack stack = new MinStack();
        stack.push(-2);
        stack.push(0);
        stack.push(-3);
        System.out.println(stack.getMin()); // Expected: -3
        stack.pop();
        System.out.println(stack.top());    // Expected: 0
        System.out.println(stack.getMin()); // Expected: -2
    }
}`,

    cpp: `#include <iostream>
#include <stack>
#include <climits>

using namespace std;

class MinStack {
public:
    // Write your solution here

    MinStack() {

    }

    void push(int val) {

    }

    void pop() {

    }

    int top() {
        return 0;
    }

    int getMin() {
        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    MinStack stack;
    stack.push(-2);
    stack.push(0);
    stack.push(-3);
    cout << stack.getMin() << endl; // Expected: -3
    stack.pop();
    cout << stack.top() << endl;    // Expected: 0
    cout << stack.getMin() << endl; // Expected: -2
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "-3\n0\n-2",
    python: "-3\n0\n-2",
    java: "-3\n0\n-2",
    cpp: "-3\n0\n-2",
  },
},

"binary-tree-right-side-view": {
  id: "binary-tree-right-side-view",
  title: "Binary Tree Right Side View",
  difficulty: "Medium",
  category: "Tree • Breadth-First Search • Depth-First Search • Binary Tree",
  description: {
    text: "Given the root of a binary tree, imagine yourself standing on the right side of it. Return the values of the nodes you can see ordered from top to bottom.",
    notes: [
      "You can only see the rightmost node at each level.",
      "BFS level-order traversal is a natural fit for this problem.",
    ],
  },
  examples: [
    {
      input: "root = [1,2,3,null,5,null,4]",
      output: "[1,3,4]",
      explanation: "From the right side: level 0 → 1, level 1 → 3, level 2 → 4.",
    },
    {
      input: "root = [1,null,3]",
      output: "[1,3]",
    },
    {
      input: "root = []",
      output: "[]",
    },
  ],
  constraints: [
    "The number of nodes in the tree is in the range [0, 100]",
    "-100 ≤ Node.val ≤ 100",
  ],
  starterCode: {
    javascript: `class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function buildTree(arr) {
  if (!arr || arr.length === 0) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (i < arr.length) {
    const node = queue.shift();
    if (arr[i] !== null) { node.left = new TreeNode(arr[i]); queue.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]); queue.push(node.right); }
    i++;
  }
  return root;
}

function rightSideView(root) {
  // Write your solution here

}

// Test cases
console.log(JSON.stringify(rightSideView(buildTree([1,2,3,null,5,null,4])))); // Expected: [1,3,4]
console.log(JSON.stringify(rightSideView(buildTree([1,null,3]))));            // Expected: [1,3]
console.log(JSON.stringify(rightSideView(buildTree([]))));                    // Expected: []`,

    python: `import json
from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def buildTree(arr):
    if not arr:
        return None
    root = TreeNode(arr[0])
    queue = deque([root])
    i = 1
    while i < len(arr):
        node = queue.popleft()
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

def rightSideView(root):
    # Write your solution here
    pass

# Test cases
print(json.dumps(rightSideView(buildTree([1,2,3,None,5,None,4])), separators=(',', ':')))  # Expected: [1,3,4]
print(json.dumps(rightSideView(buildTree([1,None,3])), separators=(',', ':')))             # Expected: [1,3]
print(json.dumps(rightSideView(buildTree([])), separators=(',', ':')))                     # Expected: []`,

    java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public static TreeNode buildTree(Integer[] arr) {
        if (arr == null || arr.length == 0) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int i = 1;
        while (i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) { node.left = new TreeNode(arr[i]); queue.add(node.left); }
            i++;
            if (i < arr.length && arr[i] != null) { node.right = new TreeNode(arr[i]); queue.add(node.right); }
            i++;
        }
        return root;
    }

    public static List<Integer> rightSideView(TreeNode root) {
        // Write your solution here

        return new ArrayList<>();
    }

    public static void main(String[] args) {
        System.out.println(rightSideView(buildTree(new Integer[]{1,2,3,null,5,null,4}))); // Expected: [1, 3, 4]
        System.out.println(rightSideView(buildTree(new Integer[]{1,null,3})));            // Expected: [1, 3]
        System.out.println(rightSideView(buildTree(new Integer[]{})));                    // Expected: []
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <queue>
#include <string>

using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

TreeNode* buildTree(vector<int> arr) {
    if (arr.empty()) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (i < (int)arr.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < (int)arr.size() && arr[i] != -1) { node->left = new TreeNode(arr[i]); q.push(node->left); }
        i++;
        if (i < (int)arr.size() && arr[i] != -1) { node->right = new TreeNode(arr[i]); q.push(node->right); }
        i++;
    }
    return root;
}

class Solution {
public:
    vector<int> rightSideView(TreeNode* root) {
        // Write your solution here

        return {};
    }
};

string vecToString(vector<int> v) {
    string s = "[";
    for (int i = 0; i < (int)v.size(); i++)
        s += to_string(v[i]) + (i == (int)v.size()-1 ? "" : ",");
    return s + "]";
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << vecToString(sol.rightSideView(buildTree({1,2,3,-1,5,-1,4}))) << endl; // Expected: [1,3,4]
    cout << vecToString(sol.rightSideView(buildTree({1,-1,3}))) << endl;          // Expected: [1,3]
    cout << vecToString(sol.rightSideView(nullptr)) << endl;                      // Expected: []
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "[1,3,4]\n[1,3]\n[]",
    python: "[1,3,4]\n[1,3]\n[]",
    java: "[1, 3, 4]\n[1, 3]\n[]",
    cpp: "[1,3,4]\n[1,3]\n[]",
  },
},

"two-sum-ii": {
  id: "two-sum-ii",
  title: "Two Sum II - Input Array Is Sorted",
  difficulty: "Medium",
  category: "Array • Two Pointers • Binary Search",
  description: {
    text: "Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number. Return the indices of the two numbers as an integer array [index1, index2] where 1 ≤ index1 < index2 ≤ numbers.length.",
    notes: [
      "The array is 1-indexed, so return indices starting from 1.",
      "There is exactly one solution, and you may not use the same element twice.",
      "Your solution must use only constant extra space.",
    ],
  },
  examples: [
    {
      input: "numbers = [2,7,11,15], target = 9",
      output: "[1,2]",
      explanation: "numbers[1] + numbers[2] = 2 + 7 = 9. So index1 = 1, index2 = 2.",
    },
    {
      input: "numbers = [2,3,4], target = 6",
      output: "[1,3]",
      explanation: "numbers[1] + numbers[3] = 2 + 4 = 6.",
    },
    {
      input: "numbers = [-1,0], target = -1",
      output: "[1,2]",
    },
  ],
  constraints: [
    "2 ≤ numbers.length ≤ 3 × 10⁴",
    "-1000 ≤ numbers[i] ≤ 1000",
    "numbers is sorted in non-decreasing order",
    "-1000 ≤ target ≤ 1000",
    "The tests are generated such that there is exactly one solution",
  ],
  starterCode: {
    javascript: `function twoSumII(numbers, target) {
  // Write your solution here

}

// Test cases
console.log(JSON.stringify(twoSumII([2,7,11,15], 9)));  // Expected: [1,2]
console.log(JSON.stringify(twoSumII([2,3,4], 6)));       // Expected: [1,3]
console.log(JSON.stringify(twoSumII([-1,0], -1)));       // Expected: [1,2]`,

    python: `import json

def twoSumII(numbers, target):
    # Write your solution here
    pass

# Test cases
print(json.dumps(twoSumII([2,7,11,15], 9), separators=(',', ':')))  # Expected: [1,2]
print(json.dumps(twoSumII([2,3,4], 6), separators=(',', ':')))       # Expected: [1,3]
print(json.dumps(twoSumII([-1,0], -1), separators=(',', ':')))       # Expected: [1,2]`,

    java: `import java.util.*;

class Solution {
    public static int[] twoSumII(int[] numbers, int target) {
        // Write your solution here

        return new int[0];
    }

    public static void main(String[] args) {
        System.out.println(Arrays.toString(twoSumII(new int[]{2,7,11,15}, 9)));  // Expected: [1, 2]
        System.out.println(Arrays.toString(twoSumII(new int[]{2,3,4}, 6)));       // Expected: [1, 3]
        System.out.println(Arrays.toString(twoSumII(new int[]{-1,0}, -1)));       // Expected: [1, 2]
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    vector<int> twoSumII(vector<int>& numbers, int target) {
        // Write your solution here

        return {};
    }
};

string vecToString(vector<int> v) {
    string s = "[";
    for (int i = 0; i < (int)v.size(); i++)
        s += to_string(v[i]) + (i == (int)v.size()-1 ? "" : ",");
    return s + "]";
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> a = {2,7,11,15};
    cout << vecToString(sol.twoSumII(a, 9)) << endl;   // Expected: [1,2]
    vector<int> b = {2,3,4};
    cout << vecToString(sol.twoSumII(b, 6)) << endl;   // Expected: [1,3]
    vector<int> c = {-1,0};
    cout << vecToString(sol.twoSumII(c, -1)) << endl;  // Expected: [1,2]
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "[1,2]\n[1,3]\n[1,2]",
    python: "[1,2]\n[1,3]\n[1,2]",
    java: "[1, 2]\n[1, 3]\n[1, 2]",
    cpp: "[1,2]\n[1,3]\n[1,2]",
  },
},

"palindrome-linked-list": {
  id: "palindrome-linked-list",
  title: "Palindrome Linked List",
  difficulty: "Easy",
  category: "Linked List • Two Pointers • Stack • Recursion",
  description: {
    text: "Given the head of a singly linked list, return true if it is a palindrome or false otherwise.",
    notes: [
      "Could you do it in O(n) time and O(1) space?",
      "A palindrome reads the same forwards and backwards.",
    ],
  },
  examples: [
    {
      input: "head = [1,2,2,1]",
      output: "true",
      explanation: "The list reads the same forwards and backwards.",
    },
    {
      input: "head = [1,2]",
      output: "false",
      explanation: "1 → 2 is not the same as 2 → 1.",
    },
    {
      input: "head = [1,2,3,2,1]",
      output: "true",
    },
  ],
  constraints: [
    "The number of nodes in the list is in the range [1, 10⁵]",
    "0 ≤ Node.val ≤ 9",
  ],
  starterCode: {
    javascript: `class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function buildList(arr) {
  if (!arr.length) return null;
  const head = new ListNode(arr[0]);
  let cur = head;
  for (let i = 1; i < arr.length; i++) { cur.next = new ListNode(arr[i]); cur = cur.next; }
  return head;
}

function isPalindrome(head) {
  // Write your solution here

}

// Test cases
console.log(isPalindrome(buildList([1,2,2,1])));   // Expected: true
console.log(isPalindrome(buildList([1,2])));        // Expected: false
console.log(isPalindrome(buildList([1,2,3,2,1]))); // Expected: true`,

    python: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def buildList(arr):
    if not arr:
        return None
    head = ListNode(arr[0])
    cur = head
    for v in arr[1:]:
        cur.next = ListNode(v)
        cur = cur.next
    return head

def isPalindrome(head):
    # Write your solution here
    pass

# Test cases
print(isPalindrome(buildList([1,2,2,1])))    # Expected: True
print(isPalindrome(buildList([1,2])))         # Expected: False
print(isPalindrome(buildList([1,2,3,2,1])))  # Expected: True`,

    java: `class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

class Solution {
    public static ListNode buildList(int[] arr) {
        if (arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode cur = head;
        for (int i = 1; i < arr.length; i++) { cur.next = new ListNode(arr[i]); cur = cur.next; }
        return head;
    }

    public static boolean isPalindrome(ListNode head) {
        // Write your solution here

        return false;
    }

    public static void main(String[] args) {
        System.out.println(isPalindrome(buildList(new int[]{1,2,2,1})));   // Expected: true
        System.out.println(isPalindrome(buildList(new int[]{1,2})));        // Expected: false
        System.out.println(isPalindrome(buildList(new int[]{1,2,3,2,1}))); // Expected: true
    }
}`,

    cpp: `#include <iostream>
#include <vector>

using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v) : val(v), next(nullptr) {}
};

ListNode* buildList(vector<int> arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* cur = head;
    for (int i = 1; i < (int)arr.size(); i++) { cur->next = new ListNode(arr[i]); cur = cur->next; }
    return head;
}

class Solution {
public:
    bool isPalindrome(ListNode* head) {
        // Write your solution here

        return false;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << boolalpha << sol.isPalindrome(buildList({1,2,2,1})) << endl;   // Expected: true
    cout << boolalpha << sol.isPalindrome(buildList({1,2})) << endl;        // Expected: false
    cout << boolalpha << sol.isPalindrome(buildList({1,2,3,2,1})) << endl; // Expected: true
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "true\nfalse\ntrue",
    python: "True\nFalse\nTrue",
    java: "true\nfalse\ntrue",
    cpp: "true\nfalse\ntrue",
  },
},

"lowest-common-ancestor-bst": {
  id: "lowest-common-ancestor-bst",
  title: "Lowest Common Ancestor of a Binary Search Tree",
  difficulty: "Medium",
  category: "Tree • Depth-First Search • Binary Search Tree • Binary Tree",
  description: {
    text: "Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes p and q. The LCA is defined as the lowest node in the tree that has both p and q as descendants (a node can be a descendant of itself).",
    notes: [
      "In a BST, if both p and q are less than root, LCA is in the left subtree.",
      "If both are greater than root, LCA is in the right subtree.",
      "Otherwise, root is the LCA.",
    ],
  },
  examples: [
    {
      input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 8",
      output: "6",
      explanation: "The LCA of nodes 2 and 8 is 6 since 6 is the lowest node that has both as descendants.",
    },
    {
      input: "root = [6,2,8,0,4,7,9,null,null,3,5], p = 2, q = 4",
      output: "2",
      explanation: "The LCA of nodes 2 and 4 is 2, since a node can be a descendant of itself.",
    },
    {
      input: "root = [2,1], p = 2, q = 1",
      output: "2",
    },
  ],
  constraints: [
    "The number of nodes in the tree is in the range [2, 10⁵]",
    "-10⁹ ≤ Node.val ≤ 10⁹",
    "All Node.val are unique",
    "p != q",
    "p and q will exist in the BST",
  ],
  starterCode: {
    javascript: `class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function buildTree(arr) {
  if (!arr || arr.length === 0) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (i < arr.length) {
    const node = queue.shift();
    if (arr[i] !== null) { node.left = new TreeNode(arr[i]); queue.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]); queue.push(node.right); }
    i++;
  }
  return root;
}

function findNode(root, val) {
  if (!root) return null;
  if (root.val === val) return root;
  return findNode(root.left, val) || findNode(root.right, val);
}

function lowestCommonAncestor(root, p, q) {
  // Write your solution here

}

// Test cases
const t1 = buildTree([6,2,8,0,4,7,9,null,null,3,5]);
console.log(lowestCommonAncestor(t1, findNode(t1,2), findNode(t1,8)).val); // Expected: 6
console.log(lowestCommonAncestor(t1, findNode(t1,2), findNode(t1,4)).val); // Expected: 2
const t2 = buildTree([2,1]);
console.log(lowestCommonAncestor(t2, findNode(t2,2), findNode(t2,1)).val); // Expected: 2`,

    python: `from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def buildTree(arr):
    if not arr:
        return None
    root = TreeNode(arr[0])
    queue = deque([root])
    i = 1
    while i < len(arr):
        node = queue.popleft()
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

def findNode(root, val):
    if not root:
        return None
    if root.val == val:
        return root
    return findNode(root.left, val) or findNode(root.right, val)

def lowestCommonAncestor(root, p, q):
    # Write your solution here
    pass

# Test cases
t1 = buildTree([6,2,8,0,4,7,9,None,None,3,5])
print(lowestCommonAncestor(t1, findNode(t1,2), findNode(t1,8)).val)  # Expected: 6
print(lowestCommonAncestor(t1, findNode(t1,2), findNode(t1,4)).val)  # Expected: 2
t2 = buildTree([2,1])
print(lowestCommonAncestor(t2, findNode(t2,2), findNode(t2,1)).val)  # Expected: 2`,

    java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public static TreeNode buildTree(Integer[] arr) {
        if (arr == null || arr.length == 0) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int i = 1;
        while (i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) { node.left = new TreeNode(arr[i]); queue.add(node.left); }
            i++;
            if (i < arr.length && arr[i] != null) { node.right = new TreeNode(arr[i]); queue.add(node.right); }
            i++;
        }
        return root;
    }

    public static TreeNode findNode(TreeNode root, int val) {
        if (root == null) return null;
        if (root.val == val) return root;
        TreeNode left = findNode(root.left, val);
        return left != null ? left : findNode(root.right, val);
    }

    public static TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {
        // Write your solution here

        return null;
    }

    public static void main(String[] args) {
        TreeNode t1 = buildTree(new Integer[]{6,2,8,0,4,7,9,null,null,3,5});
        System.out.println(lowestCommonAncestor(t1, findNode(t1,2), findNode(t1,8)).val); // Expected: 6
        System.out.println(lowestCommonAncestor(t1, findNode(t1,2), findNode(t1,4)).val); // Expected: 2
        TreeNode t2 = buildTree(new Integer[]{2,1});
        System.out.println(lowestCommonAncestor(t2, findNode(t2,2), findNode(t2,1)).val); // Expected: 2
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

TreeNode* buildTree(vector<int> arr) {
    if (arr.empty()) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (i < (int)arr.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < (int)arr.size() && arr[i] != -1) { node->left = new TreeNode(arr[i]); q.push(node->left); }
        i++;
        if (i < (int)arr.size() && arr[i] != -1) { node->right = new TreeNode(arr[i]); q.push(node->right); }
        i++;
    }
    return root;
}

TreeNode* findNode(TreeNode* root, int val) {
    if (!root) return nullptr;
    if (root->val == val) return root;
    TreeNode* left = findNode(root->left, val);
    return left ? left : findNode(root->right, val);
}

class Solution {
public:
    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {
        // Write your solution here

        return nullptr;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    TreeNode* t1 = buildTree({6,2,8,0,4,7,9,-1,-1,3,5});
    cout << sol.lowestCommonAncestor(t1, findNode(t1,2), findNode(t1,8))->val << endl; // Expected: 6
    cout << sol.lowestCommonAncestor(t1, findNode(t1,2), findNode(t1,4))->val << endl; // Expected: 2
    TreeNode* t2 = buildTree({2,1});
    cout << sol.lowestCommonAncestor(t2, findNode(t2,2), findNode(t2,1))->val << endl; // Expected: 2
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "6\n2\n2",
    python: "6\n2\n2",
    java: "6\n2\n2",
    cpp: "6\n2\n2",
  },
},

"clone-graph": {
  id: "clone-graph",
  title: "Clone Graph",
  difficulty: "Medium",
  category: "Graph • Depth-First Search • Breadth-First Search • Hash Table",
  description: {
    text: "Given a reference of a node in a connected undirected graph, return a deep copy (clone) of the graph. Each node in the graph contains a value (int) and a list of its neighbors.",
    notes: [
      "The graph is represented as an adjacency list.",
      "Use a hash map to track already-cloned nodes and avoid infinite loops.",
      "The graph may contain cycles.",
    ],
  },
  examples: [
    {
      input: "adjList = [[2,4],[1,3],[2,4],[1,3]]",
      output: "[[2,4],[1,3],[2,4],[1,3]]",
      explanation: "Node 1 connects to 2 and 4. Node 2 connects to 1 and 3. The deep copy has the same structure.",
    },
    {
      input: "adjList = [[]]",
      output: "[[]]",
      explanation: "Single node with no neighbors.",
    },
    {
      input: "adjList = []",
      output: "[]",
      explanation: "Empty graph.",
    },
  ],
  constraints: [
    "The number of nodes in the graph is in the range [0, 100]",
    "1 ≤ Node.val ≤ 100",
    "Node.val is unique for each node",
    "There are no repeated edges and no self-loops",
    "The graph is connected and all nodes can be visited starting from the given node",
  ],
  starterCode: {
    javascript: `class Node {
  constructor(val, neighbors = []) {
    this.val = val;
    this.neighbors = neighbors;
  }
}

function buildGraph(adjList) {
  if (!adjList || adjList.length === 0) return null;
  const nodes = adjList.map((_, i) => new Node(i + 1));
  adjList.forEach((neighbors, i) => {
    nodes[i].neighbors = neighbors.map(n => nodes[n - 1]);
  });
  return nodes[0];
}

function graphToAdjList(node) {
  if (!node) return [];
  const visited = new Map();
  const result = [];
  const dfs = (n) => {
    if (visited.has(n.val)) return;
    visited.set(n.val, true);
    result[n.val - 1] = n.neighbors.map(nb => nb.val);
    n.neighbors.forEach(dfs);
  };
  dfs(node);
  return result;
}

function cloneGraph(node) {
  // Write your solution here

}

// Test cases
console.log(JSON.stringify(graphToAdjList(cloneGraph(buildGraph([[2,4],[1,3],[2,4],[1,3]])))));  // Expected: [[2,4],[1,3],[2,4],[1,3]]
console.log(JSON.stringify(graphToAdjList(cloneGraph(buildGraph([[]]))));                        // Expected: [[]]
console.log(JSON.stringify(graphToAdjList(cloneGraph(null))));                                   // Expected: []`,

    python: `import json
from collections import deque

class Node:
    def __init__(self, val=0, neighbors=None):
        self.val = val
        self.neighbors = neighbors if neighbors is not None else []

def buildGraph(adjList):
    if not adjList:
        return None
    nodes = [Node(i+1) for i in range(len(adjList))]
    for i, neighbors in enumerate(adjList):
        nodes[i].neighbors = [nodes[n-1] for n in neighbors]
    return nodes[0]

def graphToAdjList(node):
    if not node:
        return []
    visited = {}
    result = []
    def dfs(n):
        if n.val in visited:
            return
        visited[n.val] = True
        while len(result) < n.val:
            result.append([])
        result[n.val-1] = [nb.val for nb in n.neighbors]
        for nb in n.neighbors:
            dfs(nb)
    dfs(node)
    return result

def cloneGraph(node):
    # Write your solution here
    pass

# Test cases
print(json.dumps(graphToAdjList(cloneGraph(buildGraph([[2,4],[1,3],[2,4],[1,3]]))), separators=(',', ':')))  # Expected: [[2,4],[1,3],[2,4],[1,3]]
print(json.dumps(graphToAdjList(cloneGraph(buildGraph([[]]))), separators=(',', ':')))                       # Expected: [[]]
print(json.dumps(graphToAdjList(cloneGraph(None)), separators=(',', ':')))                                   # Expected: []`,

    java: `import java.util.*;

class Node {
    public int val;
    public List<Node> neighbors;
    public Node(int val) { this.val = val; this.neighbors = new ArrayList<>(); }
}

class Solution {
    public static Node buildGraph(int[][] adjList) {
        if (adjList == null || adjList.length == 0) return null;
        Node[] nodes = new Node[adjList.length];
        for (int i = 0; i < adjList.length; i++) nodes[i] = new Node(i+1);
        for (int i = 0; i < adjList.length; i++)
            for (int n : adjList[i]) nodes[i].neighbors.add(nodes[n-1]);
        return nodes[0];
    }

    public static List<List<Integer>> graphToAdjList(Node node) {
        List<List<Integer>> result = new ArrayList<>();
        if (node == null) return result;
        Map<Integer, Boolean> visited = new HashMap<>();
        Queue<Node> queue = new LinkedList<>();
        queue.add(node);
        visited.put(node.val, true);
        while (!queue.isEmpty()) {
            Node cur = queue.poll();
            while (result.size() < cur.val) result.add(new ArrayList<>());
            List<Integer> nbVals = new ArrayList<>();
            for (Node nb : cur.neighbors) {
                nbVals.add(nb.val);
                if (!visited.containsKey(nb.val)) { visited.put(nb.val, true); queue.add(nb); }
            }
            result.set(cur.val-1, nbVals);
        }
        return result;
    }

    public static Node cloneGraph(Node node) {
        // Write your solution here

        return null;
    }

    public static void main(String[] args) {
        System.out.println(graphToAdjList(cloneGraph(buildGraph(new int[][]{{2,4},{1,3},{2,4},{1,3}}))));  // Expected: [[2, 4], [1, 3], [2, 4], [1, 3]]
        System.out.println(graphToAdjList(cloneGraph(buildGraph(new int[][]{{}}))));                        // Expected: [[]]
        System.out.println(graphToAdjList(cloneGraph(null)));                                               // Expected: []
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <unordered_map>
#include <queue>
#include <string>

using namespace std;

class Node {
public:
    int val;
    vector<Node*> neighbors;
    Node(int v) : val(v) {}
};

Node* buildGraph(vector<vector<int>> adjList) {
    if (adjList.empty()) return nullptr;
    vector<Node*> nodes;
    for (int i = 0; i < (int)adjList.size(); i++) nodes.push_back(new Node(i+1));
    for (int i = 0; i < (int)adjList.size(); i++)
        for (int n : adjList[i]) nodes[i]->neighbors.push_back(nodes[n-1]);
    return nodes[0];
}

string graphToString(Node* node) {
    if (!node) return "[]";
    unordered_map<int,vector<int>> adj;
    queue<Node*> q;
    unordered_map<int,bool> visited;
    q.push(node); visited[node->val] = true;
    while (!q.empty()) {
        Node* cur = q.front(); q.pop();
        for (Node* nb : cur->neighbors) {
            adj[cur->val].push_back(nb->val);
            if (!visited[nb->val]) { visited[nb->val] = true; q.push(nb); }
        }
    }
    string s = "[";
    for (int i = 1; i <= (int)adj.size() || i <= (int)visited.size(); i++) {
        s += "[";
        auto& v = adj[i];
        for (int j = 0; j < (int)v.size(); j++) s += to_string(v[j]) + (j==(int)v.size()-1?"":",");
        s += "]" + (i == (int)visited.size() ? "" : ",");
    }
    return s + "]";
}

class Solution {
public:
    Node* cloneGraph(Node* node) {
        // Write your solution here

        return nullptr;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << graphToString(sol.cloneGraph(buildGraph({{2,4},{1,3},{2,4},{1,3}}))) << endl; // Expected: [[2,4],[1,3],[2,4],[1,3]]
    cout << graphToString(sol.cloneGraph(buildGraph({{}}))) << endl;                       // Expected: [[]]
    cout << graphToString(sol.cloneGraph(nullptr)) << endl;                                // Expected: []
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "[[2,4],[1,3],[2,4],[1,3]]\n[[]]\n[]",
    python: "[[2,4],[1,3],[2,4],[1,3]]\n[[]]\n[]",
    java: "[[2, 4], [1, 3], [2, 4], [1, 3]]\n[[]]\n[]",
    cpp: "[[2,4],[1,3],[2,4],[1,3]]\n[[]]\n[]",
  },
},

"path-sum": {
  id: "path-sum",
  title: "Path Sum",
  difficulty: "Easy",
  category: "Tree • Depth-First Search • Breadth-First Search • Binary Tree",
  description: {
    text: "Given the root of a binary tree and an integer targetSum, return true if the tree has a root-to-leaf path such that adding up all the values along the path equals targetSum. A leaf is a node with no children.",
    notes: [
      "The path must go from root to a leaf node.",
      "A leaf is a node with no left or right child.",
    ],
  },
  examples: [
    {
      input: "root = [5,4,8,11,null,13,4,7,2,null,null,null,1], targetSum = 22",
      output: "true",
      explanation: "The path 5 → 4 → 11 → 2 sums to 22.",
    },
    {
      input: "root = [1,2,3], targetSum = 5",
      output: "false",
      explanation: "Paths are 1→2=3 and 1→3=4, neither equals 5.",
    },
    {
      input: "root = [], targetSum = 0",
      output: "false",
    },
  ],
  constraints: [
    "The number of nodes in the tree is in the range [0, 5000]",
    "-1000 ≤ Node.val ≤ 1000",
    "-1000 ≤ targetSum ≤ 1000",
  ],
  starterCode: {
    javascript: `class TreeNode {
  constructor(val, left = null, right = null) {
    this.val = val;
    this.left = left;
    this.right = right;
  }
}

function buildTree(arr) {
  if (!arr || arr.length === 0) return null;
  const root = new TreeNode(arr[0]);
  const queue = [root];
  let i = 1;
  while (i < arr.length) {
    const node = queue.shift();
    if (arr[i] !== null) { node.left = new TreeNode(arr[i]); queue.push(node.left); }
    i++;
    if (i < arr.length && arr[i] !== null) { node.right = new TreeNode(arr[i]); queue.push(node.right); }
    i++;
  }
  return root;
}

function hasPathSum(root, targetSum) {
  // Write your solution here

}

// Test cases
console.log(hasPathSum(buildTree([5,4,8,11,null,13,4,7,2,null,null,null,1]), 22)); // Expected: true
console.log(hasPathSum(buildTree([1,2,3]), 5));                                     // Expected: false
console.log(hasPathSum(buildTree([]), 0));                                          // Expected: false`,

    python: `from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def buildTree(arr):
    if not arr:
        return None
    root = TreeNode(arr[0])
    queue = deque([root])
    i = 1
    while i < len(arr):
        node = queue.popleft()
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root

def hasPathSum(root, targetSum):
    # Write your solution here
    pass

# Test cases
print(hasPathSum(buildTree([5,4,8,11,None,13,4,7,2,None,None,None,1]), 22))  # Expected: True
print(hasPathSum(buildTree([1,2,3]), 5))                                       # Expected: False
print(hasPathSum(buildTree([]), 0))                                            # Expected: False`,

    java: `import java.util.*;

class TreeNode {
    int val;
    TreeNode left, right;
    TreeNode(int val) { this.val = val; }
}

class Solution {
    public static TreeNode buildTree(Integer[] arr) {
        if (arr == null || arr.length == 0) return null;
        TreeNode root = new TreeNode(arr[0]);
        Queue<TreeNode> queue = new LinkedList<>();
        queue.add(root);
        int i = 1;
        while (i < arr.length) {
            TreeNode node = queue.poll();
            if (i < arr.length && arr[i] != null) { node.left = new TreeNode(arr[i]); queue.add(node.left); }
            i++;
            if (i < arr.length && arr[i] != null) { node.right = new TreeNode(arr[i]); queue.add(node.right); }
            i++;
        }
        return root;
    }

    public static boolean hasPathSum(TreeNode root, int targetSum) {
        // Write your solution here

        return false;
    }

    public static void main(String[] args) {
        System.out.println(hasPathSum(buildTree(new Integer[]{5,4,8,11,null,13,4,7,2,null,null,null,1}), 22)); // Expected: true
        System.out.println(hasPathSum(buildTree(new Integer[]{1,2,3}), 5));                                     // Expected: false
        System.out.println(hasPathSum(buildTree(new Integer[]{}), 0));                                          // Expected: false
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <queue>

using namespace std;

struct TreeNode {
    int val;
    TreeNode* left;
    TreeNode* right;
    TreeNode(int v) : val(v), left(nullptr), right(nullptr) {}
};

TreeNode* buildTree(vector<int> arr) {
    if (arr.empty()) return nullptr;
    TreeNode* root = new TreeNode(arr[0]);
    queue<TreeNode*> q;
    q.push(root);
    int i = 1;
    while (i < (int)arr.size()) {
        TreeNode* node = q.front(); q.pop();
        if (i < (int)arr.size() && arr[i] != -1) { node->left = new TreeNode(arr[i]); q.push(node->left); }
        i++;
        if (i < (int)arr.size() && arr[i] != -1) { node->right = new TreeNode(arr[i]); q.push(node->right); }
        i++;
    }
    return root;
}

class Solution {
public:
    bool hasPathSum(TreeNode* root, int targetSum) {
        // Write your solution here

        return false;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    cout << boolalpha << sol.hasPathSum(buildTree({5,4,8,11,-1,13,4,7,2,-1,-1,-1,1}), 22) << endl; // Expected: true
    cout << boolalpha << sol.hasPathSum(buildTree({1,2,3}), 5) << endl;                             // Expected: false
    cout << boolalpha << sol.hasPathSum(nullptr, 0) << endl;                                        // Expected: false
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "true\nfalse\nfalse",
    python: "True\nFalse\nFalse",
    java: "true\nfalse\nfalse",
    cpp: "true\nfalse\nfalse",
  },
},
"encode-and-decode-strings": {
  id: "encode-and-decode-strings",
  title: "Encode and Decode Strings",
  difficulty: "Medium",
  category: "String • Design",
  description: {
    text: "Design an algorithm to encode a list of strings to a single string. The encoded string is then sent over the network and is decoded back to the original list of strings. Implement encode and decode functions.",
    notes: [
      "The encoded string should be decodable back to the exact original list.",
      "Strings may contain any possible characters including special characters.",
      "Use a length-prefix encoding scheme: '<length>#<string>' for each word.",
    ],
  },
  examples: [
    {
      input: `["hello","world"]`,
      output: `["hello","world"]`,
      explanation: "Encode to a single string, then decode back to the original list.",
    },
    {
      input: `["we","say",":","yes"]`,
      output: `["we","say",":","yes"]`,
      explanation: "Special characters like ':' must be handled correctly.",
    },
  ],
  constraints: [
    "0 ≤ strs.length ≤ 200",
    "0 ≤ strs[i].length ≤ 200",
    "strs[i] contains any possible characters out of 256 valid ASCII characters",
  ],
  starterCode: {
    javascript: `function encode(strs) {
  // Write your solution here

}

function decode(s) {
  // Write your solution here

}

// Test cases
const a = ["hello","world"];
console.log(JSON.stringify(decode(encode(a))));              // Expected: ["hello","world"]
const b = ["we","say",":","yes"];
console.log(JSON.stringify(decode(encode(b))));              // Expected: ["we","say",":","yes"]
const c = [""];
console.log(JSON.stringify(decode(encode(c))));              // Expected: [""]`,

    python: `import json

def encode(strs):
    # Write your solution here
    pass

def decode(s):
    # Write your solution here
    pass

# Test cases
a = ["hello","world"]
print(json.dumps(decode(encode(a)), separators=(',', ':')))              # Expected: ["hello","world"]
b = ["we","say",":","yes"]
print(json.dumps(decode(encode(b)), separators=(',', ':')))              # Expected: ["we","say",":","yes"]
c = [""]
print(json.dumps(decode(encode(c)), separators=(',', ':')))              # Expected: [""]`,

    java: `import java.util.*;

class Solution {
    public static String encode(List<String> strs) {
        // Write your solution here

        return "";
    }

    public static List<String> decode(String s) {
        // Write your solution here

        return new ArrayList<>();
    }

    public static void main(String[] args) {
        System.out.println(decode(encode(Arrays.asList("hello","world"))));    // Expected: [hello, world]
        System.out.println(decode(encode(Arrays.asList("we","say",":","yes")))); // Expected: [we, say, :, yes]
        System.out.println(decode(encode(Arrays.asList(""))));                  // Expected: []
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    string encode(vector<string>& strs) {
        // Write your solution here

        return "";
    }

    vector<string> decode(string s) {
        // Write your solution here

        return {};
    }
};

string vecToString(vector<string> v) {
    string s = "[";
    for (int i = 0; i < (int)v.size(); i++)
        s += "\"" + v[i] + "\"" + (i == (int)v.size()-1 ? "" : ",");
    return s + "]";
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<string> a = {"hello","world"};
    cout << vecToString(sol.decode(sol.encode(a))) << endl;              // Expected: ["hello","world"]
    vector<string> b = {"we","say",":","yes"};
    cout << vecToString(sol.decode(sol.encode(b))) << endl;              // Expected: ["we","say",":","yes"]
    vector<string> c = {""};
    cout << vecToString(sol.decode(sol.encode(c))) << endl;              // Expected: [""]
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: `["hello","world"]\n["we","say",":","yes"]\n[""]`,
    python: `["hello","world"]\n["we","say",":","yes"]\n[""]`,
    java: "[hello, world]\n[we, say, :, yes]\n[]",
    cpp: `["hello","world"]\n["we","say",":","yes"]\n[""]`,
  },
},

"car-fleet": {
  id: "car-fleet",
  title: "Car Fleet",
  difficulty: "Medium",
  category: "Array • Stack • Sorting • Monotonic Stack",
  description: {
    text: "There are n cars at given miles away from the starting mile 0, traveling to their destination at target miles. Each car has a position and speed given in two integer arrays position and speed, where position[i] is the position of the ith car and speed[i] is the speed of the ith car (in miles per hour). A car can never pass another car ahead of it, but it can catch up and travel at the same speed as the car in front of it (forming a fleet). Return the number of car fleets that will arrive at the destination.",
    notes: [
      "A fleet is a group of cars that reach the destination at the same time.",
      "If a car catches up to a fleet before reaching the destination, it becomes part of that fleet.",
      "Sort cars by position from closest to destination to farthest.",
    ],
  },
  examples: [
    {
      input: "target = 12, position = [10,8,0,5,3], speed = [2,4,1,1,3]",
      output: "3",
      explanation: "Cars at 10 and 8 form one fleet. Car at 0 is alone. Cars at 5 and 3 form another fleet. Total: 3 fleets.",
    },
    {
      input: "target = 10, position = [3], speed = [3]",
      output: "1",
      explanation: "Only one car, so one fleet.",
    },
    {
      input: "target = 100, position = [0,2,4], speed = [4,2,1]",
      output: "1",
      explanation: "All cars form a single fleet.",
    },
  ],
  constraints: [
    "n == position.length == speed.length",
    "1 ≤ n ≤ 10⁵",
    "0 < target ≤ 10⁶",
    "0 ≤ position[i] < target",
    "0 < speed[i] ≤ 10⁶",
    "All values of position are unique",
  ],
  starterCode: {
    javascript: `function carFleet(target, position, speed) {
  // Write your solution here

}

// Test cases
console.log(carFleet(12, [10,8,0,5,3], [2,4,1,1,3])); // Expected: 3
console.log(carFleet(10, [3], [3]));                    // Expected: 1
console.log(carFleet(100, [0,2,4], [4,2,1]));           // Expected: 1`,

    python: `def carFleet(target, position, speed):
    # Write your solution here
    pass

# Test cases
print(carFleet(12, [10,8,0,5,3], [2,4,1,1,3]))  # Expected: 3
print(carFleet(10, [3], [3]))                     # Expected: 1
print(carFleet(100, [0,2,4], [4,2,1]))            # Expected: 1`,

    java: `import java.util.*;

class Solution {
    public static int carFleet(int target, int[] position, int[] speed) {
        // Write your solution here

        return 0;
    }

    public static void main(String[] args) {
        System.out.println(carFleet(12, new int[]{10,8,0,5,3}, new int[]{2,4,1,1,3})); // Expected: 3
        System.out.println(carFleet(10, new int[]{3}, new int[]{3}));                   // Expected: 1
        System.out.println(carFleet(100, new int[]{0,2,4}, new int[]{4,2,1}));          // Expected: 1
    }
}`,

    cpp: `#include <iostream>
#include <vector>

using namespace std;

class Solution {
public:
    int carFleet(int target, vector<int>& position, vector<int>& speed) {
        // Write your solution here

        return 0;
    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> p1 = {10,8,0,5,3}, s1 = {2,4,1,1,3};
    cout << sol.carFleet(12, p1, s1) << endl; // Expected: 3
    vector<int> p2 = {3}, s2 = {3};
    cout << sol.carFleet(10, p2, s2) << endl; // Expected: 1
    vector<int> p3 = {0,2,4}, s3 = {4,2,1};
    cout << sol.carFleet(100, p3, s3) << endl; // Expected: 1
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "3\n1\n1",
    python: "3\n1\n1",
    java: "3\n1\n1",
    cpp: "3\n1\n1",
  },
},

"combination-sum": {
  id: "combination-sum",
  title: "Combination Sum",
  difficulty: "Medium",
  category: "Array • Backtracking",
  description: {
    text: "Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order. The same number may be chosen from candidates an unlimited number of times.",
    notes: [
      "The same candidate number can be used multiple times.",
      "All elements of candidates are distinct.",
      "The solution set must not contain duplicate combinations.",
    ],
  },
  examples: [
    {
      input: "candidates = [2,3,6,7], target = 7",
      output: "[[2,2,3],[7]]",
      explanation: "2+2+3=7 and 7=7. These are the only two combinations.",
    },
    {
      input: "candidates = [2,3,5], target = 8",
      output: "[[2,2,2,2],[2,3,3],[3,5]]",
    },
    {
      input: "candidates = [2], target = 1",
      output: "[]",
      explanation: "No combination sums to 1.",
    },
  ],
  constraints: [
    "1 ≤ candidates.length ≤ 30",
    "2 ≤ candidates[i] ≤ 40",
    "All elements of candidates are distinct",
    "1 ≤ target ≤ 40",
  ],
  starterCode: {
    javascript: `function combinationSum(candidates, target) {
  // Write your solution here

}

// Test cases
console.log(JSON.stringify(combinationSum([2,3,6,7], 7)));  // Expected: [[2,2,3],[7]]
console.log(JSON.stringify(combinationSum([2,3,5], 8)));     // Expected: [[2,2,2,2],[2,3,3],[3,5]]
console.log(JSON.stringify(combinationSum([2], 1)));         // Expected: []`,

    python: `import json

def combinationSum(candidates, target):
    # Write your solution here
    pass

# Test cases
print(json.dumps(combinationSum([2,3,6,7], 7), separators=(',', ':')))  # Expected: [[2,2,3],[7]]
print(json.dumps(combinationSum([2,3,5], 8), separators=(',', ':')))     # Expected: [[2,2,2,2],[2,3,3],[3,5]]
print(json.dumps(combinationSum([2], 1), separators=(',', ':')))         # Expected: []`,

    java: `import java.util.*;

class Solution {
    public static List<List<Integer>> combinationSum(int[] candidates, int target) {
        // Write your solution here

        return new ArrayList<>();
    }

    public static void main(String[] args) {
        System.out.println(combinationSum(new int[]{2,3,6,7}, 7));  // Expected: [[2, 2, 3], [7]]
        System.out.println(combinationSum(new int[]{2,3,5}, 8));     // Expected: [[2, 2, 2, 2], [2, 3, 3], [3, 5]]
        System.out.println(combinationSum(new int[]{2}, 1));         // Expected: []
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {
        // Write your solution here

        return {};
    }
};

string matrixToString(vector<vector<int>> res) {
    string s = "[";
    for (int i = 0; i < (int)res.size(); i++) {
        s += "[";
        for (int j = 0; j < (int)res[i].size(); j++)
            s += to_string(res[i][j]) + (j==(int)res[i].size()-1?"":",");
        s += "]" + (i==(int)res.size()-1?"":",");
    }
    return s + "]";
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<int> a = {2,3,6,7};
    cout << matrixToString(sol.combinationSum(a, 7)) << endl;  // Expected: [[2,2,3],[7]]
    vector<int> b = {2,3,5};
    cout << matrixToString(sol.combinationSum(b, 8)) << endl;  // Expected: [[2,2,2,2],[2,3,3],[3,5]]
    vector<int> c = {2};
    cout << matrixToString(sol.combinationSum(c, 1)) << endl;  // Expected: []
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "[[2,2,3],[7]]\n[[2,2,2,2],[2,3,3],[3,5]]\n[]",
    python: "[[2,2,3],[7]]\n[[2,2,2,2],[2,3,3],[3,5]]\n[]",
    java: "[[2, 2, 3], [7]]\n[[2, 2, 2, 2], [2, 3, 3], [3, 5]]\n[]",
    cpp: "[[2,2,3],[7]]\n[[2,2,2,2],[2,3,3],[3,5]]\n[]",
  },
},

"reorder-list": {
  id: "reorder-list",
  title: "Reorder List",
  difficulty: "Medium",
  category: "Linked List • Two Pointers • Stack • Recursion",
  description: {
    text: "You are given the head of a singly linked list. The list can be represented as L0 → L1 → … → Ln-1 → Ln. Reorder it to: L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → … You may not modify the values in the list's nodes. Only nodes themselves may be changed.",
    notes: [
      "Find the middle using slow/fast pointers, reverse the second half, then merge.",
      "Do not return a new list — modify the original list in-place.",
    ],
  },
  examples: [
    {
      input: "head = [1,2,3,4]",
      output: "[1,4,2,3]",
      explanation: "Reordered as L0→L3→L1→L2: 1→4→2→3.",
    },
    {
      input: "head = [1,2,3,4,5]",
      output: "[1,5,2,4,3]",
      explanation: "Reordered as L0→L4→L1→L3→L2: 1→5→2→4→3.",
    },
  ],
  constraints: [
    "The number of nodes in the list is in the range [1, 5 × 10⁴]",
    "1 ≤ Node.val ≤ 1000",
  ],
  starterCode: {
    javascript: `class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

function buildList(arr) {
  if (!arr.length) return null;
  const head = new ListNode(arr[0]);
  let cur = head;
  for (let i = 1; i < arr.length; i++) { cur.next = new ListNode(arr[i]); cur = cur.next; }
  return head;
}

function listToArray(head) {
  const res = [];
  while (head) { res.push(head.val); head = head.next; }
  return res;
}

function reorderList(head) {
  // Write your solution here (modify in-place)

}

// Test cases
const a = buildList([1,2,3,4]);
reorderList(a);
console.log(JSON.stringify(listToArray(a))); // Expected: [1,4,2,3]

const b = buildList([1,2,3,4,5]);
reorderList(b);
console.log(JSON.stringify(listToArray(b))); // Expected: [1,5,2,4,3]`,

    python: `import json

class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def buildList(arr):
    if not arr:
        return None
    head = ListNode(arr[0])
    cur = head
    for v in arr[1:]:
        cur.next = ListNode(v)
        cur = cur.next
    return head

def listToArray(head):
    res = []
    while head:
        res.append(head.val)
        head = head.next
    return res

def reorderList(head):
    # Write your solution here (modify in-place)
    pass

# Test cases
a = buildList([1,2,3,4])
reorderList(a)
print(json.dumps(listToArray(a), separators=(',', ':')))  # Expected: [1,4,2,3]

b = buildList([1,2,3,4,5])
reorderList(b)
print(json.dumps(listToArray(b), separators=(',', ':')))  # Expected: [1,5,2,4,3]`,

    java: `import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode(int val) { this.val = val; }
}

class Solution {
    public static ListNode buildList(int[] arr) {
        if (arr.length == 0) return null;
        ListNode head = new ListNode(arr[0]);
        ListNode cur = head;
        for (int i = 1; i < arr.length; i++) { cur.next = new ListNode(arr[i]); cur = cur.next; }
        return head;
    }

    public static List<Integer> listToArray(ListNode head) {
        List<Integer> res = new ArrayList<>();
        while (head != null) { res.add(head.val); head = head.next; }
        return res;
    }

    public static void reorderList(ListNode head) {
        // Write your solution here (modify in-place)

    }

    public static void main(String[] args) {
        ListNode a = buildList(new int[]{1,2,3,4});
        reorderList(a);
        System.out.println(listToArray(a)); // Expected: [1, 4, 2, 3]

        ListNode b = buildList(new int[]{1,2,3,4,5});
        reorderList(b);
        System.out.println(listToArray(b)); // Expected: [1, 5, 2, 4, 3]
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

struct ListNode {
    int val;
    ListNode* next;
    ListNode(int v) : val(v), next(nullptr) {}
};

ListNode* buildList(vector<int> arr) {
    if (arr.empty()) return nullptr;
    ListNode* head = new ListNode(arr[0]);
    ListNode* cur = head;
    for (int i = 1; i < (int)arr.size(); i++) { cur->next = new ListNode(arr[i]); cur = cur->next; }
    return head;
}

string listToString(ListNode* head) {
    string s = "[";
    while (head) { s += to_string(head->val) + (head->next ? "," : ""); head = head->next; }
    return s + "]";
}

class Solution {
public:
    void reorderList(ListNode* head) {
        // Write your solution here (modify in-place)

    }
};

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    ListNode* a = buildList({1,2,3,4});
    sol.reorderList(a);
    cout << listToString(a) << endl; // Expected: [1,4,2,3]

    ListNode* b = buildList({1,2,3,4,5});
    sol.reorderList(b);
    cout << listToString(b) << endl; // Expected: [1,5,2,4,3]
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "[1,4,2,3]\n[1,5,2,4,3]",
    python: "[1,4,2,3]\n[1,5,2,4,3]",
    java: "[1, 4, 2, 3]\n[1, 5, 2, 4, 3]",
    cpp: "[1,4,2,3]\n[1,5,2,4,3]",
  },
},

"pacific-atlantic-water-flow": {
  id: "pacific-atlantic-water-flow",
  title: "Pacific Atlantic Water Flow",
  difficulty: "Medium",
  category: "Array • DFS • BFS • Matrix",
  description: {
    text: "There is an m x n rectangular island that borders both the Pacific Ocean and Atlantic Ocean. The Pacific Ocean touches the island's left and top edges, and the Atlantic Ocean touches the island's right and bottom edges. Water can only flow in four directions (up, down, left, right) to an adjacent cell with a height less than or equal to the current cell's height. Given an m x n integer matrix heights where heights[r][c] represents the height above sea level of the cell at coordinate (r, c), return a list of grid coordinates where water can flow to both the Pacific and Atlantic oceans.",
    notes: [
      "Run BFS/DFS from ocean borders inward — cells reachable from Pacific border and Atlantic border separately.",
      "A cell qualifies if it appears in both reachable sets.",
    ],
  },
  examples: [
    {
      input: "heights = [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]",
      output: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]",
      explanation: "These cells can flow to both the Pacific and Atlantic oceans.",
    },
    {
      input: "heights = [[1]]",
      output: "[[0,0]]",
      explanation: "Single cell borders both oceans.",
    },
  ],
  constraints: [
    "m == heights.length",
    "n == heights[r].length",
    "1 ≤ m, n ≤ 200",
    "0 ≤ heights[r][c] ≤ 10⁵",
  ],
  starterCode: {
    javascript: `function pacificAtlantic(heights) {
  // Write your solution here

}

// Test cases
console.log(JSON.stringify(pacificAtlantic([[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]])));
// Expected: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
console.log(JSON.stringify(pacificAtlantic([[1]])));
// Expected: [[0,0]]`,

    python: `import json

def pacificAtlantic(heights):
    # Write your solution here
    pass

# Test cases
print(json.dumps(pacificAtlantic([[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]]), separators=(',', ':')))
# Expected: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
print(json.dumps(pacificAtlantic([[1]]), separators=(',', ':')))
# Expected: [[0,0]]`,

    java: `import java.util.*;

class Solution {
    public static List<List<Integer>> pacificAtlantic(int[][] heights) {
        // Write your solution here

        return new ArrayList<>();
    }

    public static void main(String[] args) {
        System.out.println(pacificAtlantic(new int[][]{
            {1,2,2,3,5},{3,2,3,4,4},{2,4,5,3,1},{6,7,1,4,5},{5,1,1,2,4}
        }));
        // Expected: [[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]
        System.out.println(pacificAtlantic(new int[][]{{1}}));
        // Expected: [[0, 0]]
    }
}`,

    cpp: `#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Solution {
public:
    vector<vector<int>> pacificAtlantic(vector<vector<int>>& heights) {
        // Write your solution here

        return {};
    }
};

string matrixToString(vector<vector<int>> res) {
    string s = "[";
    for (int i = 0; i < (int)res.size(); i++) {
        s += "[";
        for (int j = 0; j < (int)res[i].size(); j++)
            s += to_string(res[i][j]) + (j==(int)res[i].size()-1?"":",");
        s += "]" + (i==(int)res.size()-1?"":",");
    }
    return s + "]";
}

#ifndef HIDDEN_TEST
int main() {
    Solution sol;
    vector<vector<int>> h1 = {{1,2,2,3,5},{3,2,3,4,4},{2,4,5,3,1},{6,7,1,4,5},{5,1,1,2,4}};
    cout << matrixToString(sol.pacificAtlantic(h1)) << endl;
    // Expected: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]
    vector<vector<int>> h2 = {{1}};
    cout << matrixToString(sol.pacificAtlantic(h2)) << endl;
    // Expected: [[0,0]]
    return 0;
}
#endif`,
  },
  expectedOutput: {
    javascript: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]\n[[0,0]]",
    python: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]\n[[0,0]]",
    java: "[[0, 4], [1, 3], [1, 4], [2, 2], [3, 0], [3, 1], [4, 0]]\n[[0, 0]]",
    cpp: "[[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]]\n[[0,0]]",
  },
},
};

 

export const LANGUAGE_CONFIG = {
  javascript: {
    name: "JavaScript",
    icon: "/javascript.png",
    monacoLang: "javascript",
  },
  python: {
    name: "Python",
    icon: "/python.png",
    monacoLang: "python",
  },
  java: {
    name: "Java",
    icon: "/java.png",
    monacoLang: "java",
  },
  cpp: {
    name: "C++",
    icon: "/cpp.png",
    monacoLang: "cpp",
  },
};



