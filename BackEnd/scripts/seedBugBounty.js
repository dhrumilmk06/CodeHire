import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { createRequire } from 'module';

const prisma = new PrismaClient();

// ─────────────────────────────────────────────
// 10 Bug Bounty Problems
// ─────────────────────────────────────────────
const problems = [
  // ──────────────────────────────────────────
  // Problem 1 — JavaScript | Easy | 100 pts
  // ──────────────────────────────────────────
  {
    title: 'Off-By-One in Array Sum',
    language: 'javascript',
    difficultyLevel: 'easy',
    bountyPoints: 100,
    estimatedTimeMinutes: 5,
    bugDescription: `**Problem Statement:**
You are given a function that calculates the sum of all numbers in a given array. However, the current implementation contains a subtle logic error. 

While it might run without crashing on some specific inputs, it frequently returns \`NaN\` (Not-a-Number) for most valid arrays provided to it. 

**Your Task:**
Identify the root cause of why \`NaN\` is being returned and fix the bug so that the function accurately computes the sum for all valid arrays of numbers. Pay close attention to how array boundaries are handled.`,
    bugHints: "Look at the loop's termination condition (`i <= arr.length`) — is it iterating past the last valid index of the array? What happens when you try to access an index that is out of bounds in JavaScript?",
    buggyCode: `function sumArray(arr) {
  let total = 0;
  for (let i = 0; i <= arr.length; i++) {
    total += arr[i];
  }
  return total;
}

// --- Piston test harness (do not edit below this line) ---
const input = require('fs').readFileSync(0, 'utf8').trim();
const arr = input.split(' ').map(Number);
console.log(sumArray(arr));`,
    initialTestCases: [
      { input: '1 2 3', expectedOutput: '6' },
      { input: '10 20 30', expectedOutput: '60' },
    ],
    hiddenTestCases: [
      { input: '1 2 3', expectedOutput: '6' },
      { input: '10 20 30', expectedOutput: '60' },
      { input: '0', expectedOutput: '0' },
      { input: '-1 -2 -3', expectedOutput: '-6' },
      { input: '5', expectedOutput: '5' },
    ],
    correctSolution: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
  const arr = line.trim().split(' ').map(Number);
  function sumArray(arr) {
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
      total += arr[i];
    }
    return total;
  }
  console.log(sumArray(arr));
  rl.close();
});`,
    createdBy: 'seed',
  },

  // ──────────────────────────────────────────
  // Problem 2 — JavaScript | Easy | 100 pts
  // ──────────────────────────────────────────
  {
    title: 'Palindrome Check Returns Wrong Answer',
    language: 'javascript',
    difficultyLevel: 'easy',
    bountyPoints: 100,
    estimatedTimeMinutes: 5,
    bugDescription: `**Problem Statement:**
A palindrome is a word or phrase that reads the exact same backwards as forwards (e.g., "racecar", "madam").
You are provided with a function intended to verify whether a given string is a valid palindrome. 
However, the function currently contains a bug: it consistently returns \`false\` for all inputs, even for valid palindromes.

**Your Task:**
Diagnose why the function fails to correctly identify palindromes. Find and fix the bug. Ensure that your fix allows the function to accurately return \`true\` for palindromes and \`false\` for non-palindromic strings.`,
    bugHints: 'Carefully examine the comparison logic in the `if` statement. Are you using an assignment operator (`=`) instead of an equality comparison operator (`==` or `===`)?',
    buggyCode: `function isPalindrome(str) {
  const reversed = str.split('').reverse().join('');
  if (reversed = str) {
    return true;
  }
  return false;
}

// --- Piston test harness (do not edit below this line) ---
const input = require('fs').readFileSync(0, 'utf8').trim();
console.log(String(isPalindrome(input)));`,
    initialTestCases: [
      { input: 'racecar', expectedOutput: 'true' },
      { input: 'hello', expectedOutput: 'false' },
    ],
    hiddenTestCases: [
      { input: 'racecar', expectedOutput: 'true' },
      { input: 'hello', expectedOutput: 'false' },
      { input: 'madam', expectedOutput: 'true' },
      { input: 'abcba', expectedOutput: 'true' },
      { input: 'world', expectedOutput: 'false' },
    ],
    correctSolution: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
  const str = line.trim();
  function isPalindrome(str) {
    const reversed = str.split('').reverse().join('');
    if (reversed === str) {
      return true;
    }
    return false;
  }
  console.log(isPalindrome(str));
  rl.close();
});`,
    createdBy: 'seed',
  },

  // ──────────────────────────────────────────
  // Problem 3 — JavaScript | Medium | 200 pts
  // ──────────────────────────────────────────
  {
    title: 'FizzBuzz Skips Multiples of 15',
    language: 'javascript',
    difficultyLevel: 'medium',
    bountyPoints: 200,
    estimatedTimeMinutes: 10,
    bugDescription: `**Problem Statement:**
You are tasked with fixing a classic "FizzBuzz" function. The function is supposed to behave according to the following rules:
- Return \`"FizzBuzz"\` for numbers divisible by both 3 and 5.
- Return \`"Fizz"\` for numbers divisible only by 3.
- Return \`"Buzz"\` for numbers divisible only by 5.
- Return the number itself as a string if none of the above conditions apply.

**The Bug:**
Currently, the \`"FizzBuzz"\` case is never successfully reached. Due to a logical error in the ordering of the conditional statements, calling the function with a number like \`n = 15\` returns \`"Fizz"\` instead of the expected \`"FizzBuzz"\`.

**Input Format:**
- A single positive integer \`n\`.

**Output Format:**
- A string matching one of the FizzBuzz conditions.

**Constraints:**
- \`1 <= n <= 1000\`

**Your Task:**
Identify the flaw in the logic and reorder or rewrite the conditions so that all test cases pass perfectly.`,
    bugHints: 'The order in which `if` statements are evaluated is crucial. If a number is divisible by both 3 and 5, which condition should you check first to ensure it doesn\'t get intercepted by the other checks?',
    buggyCode: `function fizzBuzz(n) {
  if (n % 3 === 0) return "Fizz";
  if (n % 5 === 0) return "Buzz";
  if (n % 3 === 0 && n % 5 === 0) return "FizzBuzz";
  return String(n);
}

// --- Piston test harness (do not edit below this line) ---
const input = require('fs').readFileSync(0, 'utf8').trim();
console.log(fizzBuzz(Number(input)));`,
    initialTestCases: [
      { input: '15', expectedOutput: 'FizzBuzz' },
      { input: '3', expectedOutput: 'Fizz' },
      { input: '5', expectedOutput: 'Buzz' },
      { input: '7', expectedOutput: '7' },
    ],
    hiddenTestCases: [
      { input: '15', expectedOutput: 'FizzBuzz' },
      { input: '30', expectedOutput: 'FizzBuzz' },
      { input: '3', expectedOutput: 'Fizz' },
      { input: '9', expectedOutput: 'Fizz' },
      { input: '5', expectedOutput: 'Buzz' },
      { input: '25', expectedOutput: 'Buzz' },
      { input: '7', expectedOutput: '7' },
      { input: '1', expectedOutput: '1' },
    ],
    correctSolution: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
rl.on('line', (line) => {
  const n = parseInt(line.trim());
  function fizzBuzz(n) {
    if (n % 3 === 0 && n % 5 === 0) return "FizzBuzz";
    if (n % 3 === 0) return "Fizz";
    if (n % 5 === 0) return "Buzz";
    return String(n);
  }
  console.log(fizzBuzz(n));
  rl.close();
});`,
    createdBy: 'seed',
  },

  // ──────────────────────────────────────────
  // Problem 4 — JavaScript | Medium | 200 pts
  // ──────────────────────────────────────────
  {
    title: 'Binary Search Never Finds Target',
    language: 'javascript',
    difficultyLevel: 'medium',
    bountyPoints: 200,
    estimatedTimeMinutes: 15,
    bugDescription: `**Problem Statement:**
Binary Search is a highly efficient algorithm for finding an item from a sorted list of items. It works by repeatedly dividing in half the portion of the list that could contain the item.

The provided binary search function is designed to return the index of a specified \`target\` within a sorted array, or \`-1\` if the target cannot be found. 

**The Bug:**
The current implementation contains a fatal flaw causing it to enter an infinite loop or incorrectly fail. Specifically, it always returns \`-1\` or gets stuck, even when the target actually exists in the array.

**Your Task:**
Analyze the iterative logic of the binary search. Locate the error preventing the search boundaries from updating correctly, and implement the necessary fix.`,
    bugHints: 'Pay close attention to how `left` and `right` boundaries are updated when the target is not found at the `mid` index. Are they being adjusted enough to prevent an infinite loop or incorrect search space?',
    buggyCode: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) right = mid - 1;
    else left = mid + 1;
  }
  return -1;
}

// --- Piston test harness (do not edit below this line) ---
const lines = require('fs').readFileSync(0, 'utf8').trim().split('\\n');
const arr = lines[0].split(' ').map(Number);
const target = Number(lines[1]);
console.log(binarySearch(arr, target));`,
    initialTestCases: [
      { input: '1 3 5 7 9\n7', expectedOutput: '3' },
      { input: '1 2 3 4 5\n6', expectedOutput: '-1' },
    ],
    hiddenTestCases: [
      { input: '1 3 5 7 9\n7', expectedOutput: '3' },
      { input: '1 2 3 4 5\n6', expectedOutput: '-1' },
      { input: '2 4 6 8 10\n2', expectedOutput: '0' },
      { input: '2 4 6 8 10\n10', expectedOutput: '4' },
      { input: '5\n5', expectedOutput: '0' },
    ],
    correctSolution: `const readline = require('readline');
const rl = readline.createInterface({ input: process.stdin });
const lines = [];
rl.on('line', (line) => lines.push(line.trim()));
rl.on('close', () => {
  const arr = lines[0].split(' ').map(Number);
  const target = parseInt(lines[1]);
  function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] === target) return mid;
      if (arr[mid] < target) left = mid + 1;
      else right = mid - 1;
    }
    return -1;
  }
  console.log(binarySearch(arr, target));
});`,
    createdBy: 'seed',
  },

  // ──────────────────────────────────────────
  // Problem 5 — Python | Easy | 100 pts
  // ──────────────────────────────────────────
  {
    title: 'Factorial Returns 0 for All Inputs',
    language: 'python',
    difficultyLevel: 'easy',
    bountyPoints: 100,
    estimatedTimeMinutes: 5,
    bugDescription: `**Problem Statement:**
The factorial of a non-negative integer \`n\`, denoted by \`n!\`, is the product of all positive integers less than or equal to \`n\`. For example, \`5! = 5 * 4 * 3 * 2 * 1 = 120\`. Also, the factorial of \`0\` is universally defined as \`1\`.

The provided Python function aims to calculate the factorial using recursion. 

**The Bug:**
Due to an incorrect base case, the function incorrectly returns \`0\` for every possible input. For instance, calling \`factorial(5)\` returns \`0\` instead of \`120\`.

**Your Task:**
Identify why the recursive chain always evaluates to zero and correct the base case so the mathematical property of factorials is preserved.`,
    bugHints: 'In recursion, the base case determines when to stop. If your base case returns `0`, and you multiply it with the rest of your results, what will the final answer always be? What should `0!` evaluate to?',
    buggyCode: `def factorial(n):
    if n == 0:
        return 0
    return n * factorial(n - 1)

# --- Piston test harness (do not edit below this line) ---
n = int(input())
print(factorial(n))`,
    initialTestCases: [
      { input: '5', expectedOutput: '120' },
      { input: '0', expectedOutput: '1' },
    ],
    hiddenTestCases: [
      { input: '5', expectedOutput: '120' },
      { input: '0', expectedOutput: '1' },
      { input: '1', expectedOutput: '1' },
      { input: '6', expectedOutput: '720' },
      { input: '10', expectedOutput: '3628800' },
    ],
    correctSolution: `def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)

n = int(input())
print(factorial(n))`,
    createdBy: 'seed',
  },

  // ──────────────────────────────────────────
  // Problem 6 — Python | Medium | 200 pts
  // ──────────────────────────────────────────
  {
    title: 'Count Vowels Misses Uppercase',
    language: 'python',
    difficultyLevel: 'medium',
    bountyPoints: 200,
    estimatedTimeMinutes: 10,
    bugDescription: `**Problem Statement:**
You are given a function that calculates the total number of vowels (\`a, e, i, o, u\`) present in a given string. The function needs to account for both uppercase and lowercase letters.

**The Bug:**
The current logic only successfully counts lowercase vowels and completely ignores any uppercase vowels. For example, given the input \`"Hello World"\`, it correctly identifies \`'e'\` and \`'o'\` (2 vowels), but for an input like \`"AEIOU"\`, it returns \`0\`.

**Your Task:**
Modify the function so that it correctly identifies and counts vowels regardless of their case formatting.`,
    bugHints: 'You can fix this by either expanding your set of vowels to include uppercase letters, or by normalizing the input string to lowercase before performing your checks using `.lower()`.',
    buggyCode: `def count_vowels(s):
    vowels = "aeiou"
    count = 0
    for char in s:
        if char in vowels:
            count += 1
    return count

# --- Piston test harness (do not edit below this line) ---
s = input()
print(count_vowels(s))`,
    initialTestCases: [
      { input: 'Hello World', expectedOutput: '3' },
      { input: 'AEIOU', expectedOutput: '5' },
    ],
    hiddenTestCases: [
      { input: 'Hello World', expectedOutput: '3' },
      { input: 'AEIOU', expectedOutput: '5' },
      { input: 'aeiou', expectedOutput: '5' },
      { input: 'rhythm', expectedOutput: '0' },
      { input: 'Python Programming', expectedOutput: '4' },
    ],
    correctSolution: `def count_vowels(s):
    vowels = "aeiou"
    count = 0
    for char in s.lower():
        if char in vowels:
            count += 1
    return count

s = input()
print(count_vowels(s))`,
    createdBy: 'seed',
  },

  // ──────────────────────────────────────────
  // Problem 7 — Python | Hard | 300 pts
  // ──────────────────────────────────────────
  {
    title: 'Merge Sort Returns Unsorted Output',
    language: 'python',
    difficultyLevel: 'hard',
    bountyPoints: 300,
    estimatedTimeMinutes: 20,
    bugDescription: `**Problem Statement:**
Merge Sort is a classic divide-and-conquer algorithm that recursively splits an array into halves and then merges the sorted halves back together.

**The Bug:**
The provided Python implementation of Merge Sort contains a subtle but critical bug within its \`merge\` helper function. Because of this flaw, the algorithm fails to merge the sorted sub-arrays properly, producing an output that remains incorrectly ordered.
For example, supplying \`[5, 3, 8, 1, 9, 2]\` fails to yield the correctly sorted output \`[1, 2, 3, 5, 8, 9]\`.

**Your Task:**
Examine the \`merge\` function's loop where elements from the \`left\` and \`right\` sub-arrays are compared. Identify the logical error and fix it so the array sorts perfectly in ascending order.`,
    bugHints: 'In the `merge` function, when combining the `left` and `right` arrays, you want to pick the smaller element to build an ascending list. Is your comparison operator (`>`) picking the smaller or larger element?',
    buggyCode: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr

    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])

    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] > right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

# --- Piston test harness (do not edit below this line) ---
arr = list(map(int, input().split()))
print(*merge_sort(arr))`,
    initialTestCases: [
      { input: '5 3 8 1 9 2', expectedOutput: '1 2 3 5 8 9' },
      { input: '4 2 7 1', expectedOutput: '1 2 4 7' },
    ],
    hiddenTestCases: [
      { input: '5 3 8 1 9 2', expectedOutput: '1 2 3 5 8 9' },
      { input: '4 2 7 1', expectedOutput: '1 2 4 7' },
      { input: '1', expectedOutput: '1' },
      { input: '3 3 3', expectedOutput: '3 3 3' },
      { input: '10 9 8 7 6 5', expectedOutput: '5 6 7 8 9 10' },
    ],
    correctSolution: `def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result

arr = list(map(int, input().split()))
print(*merge_sort(arr))`,
    createdBy: 'seed',
  },

  // ──────────────────────────────────────────
  // Problem 8 — JavaScript | Hard | 300 pts
  // ──────────────────────────────────────────
  {
    title: 'Debounce Fires Immediately Instead of Waiting',
    language: 'javascript',
    difficultyLevel: 'hard',
    bountyPoints: 300,
    estimatedTimeMinutes: 20,
    bugDescription: `**Problem Statement:**
A \`debounce\` function is heavily used in frontend development to limit the rate at which a function fires (e.g., search bar inputs, window resizing). It ensures that a given callback is only executed after a specified \`wait\` time (in milliseconds) has elapsed since the last time it was invoked.

**The Bug:**
The current implementation of the \`debounce\` function is broken. Instead of delaying the callback execution and resetting the timer on consecutive calls, it triggers the callback function immediately upon every single invocation, completely bypassing the intended delay.

**Your Task:**
Identify the flaw in how the JavaScript \`setTimeout\` and \`clearTimeout\` functions are being utilized. Correct the logic so the callback is properly delayed and debounced.`,
    bugHints: 'Look at the order of operations. You are currently invoking the function (`fn.apply(this, args);`) *before* setting the timeout. Where should the actual function invocation occur?',
    buggyCode: `// Fix the debounce function below — do NOT edit the test harness.
function debounce(fn, wait) {
  let timer;
  return function(...args) {
    fn.apply(this, args);
    clearTimeout(timer);
    timer = setTimeout(() => {}, wait);
  };
}

// --- Piston test harness (do not edit below this line) ---
// Uses fake timers to verify debounce behaviour.
const wait = Number(require('fs').readFileSync(0, 'utf8').trim());

let callCount = 0;
const fn = () => { callCount++; };
const debounced = debounce(fn, wait);

let pendingCb = null;
const origSetTimeout = global.setTimeout;
const origClearTimeout = global.clearTimeout;
global.setTimeout = (cb, delay) => { pendingCb = cb; };
global.clearTimeout = () => { pendingCb = null; };

debounced();
debounced();
debounced();

// Advance fake clock past the wait threshold
if (pendingCb) pendingCb();

global.setTimeout = origSetTimeout;
global.clearTimeout = origClearTimeout;

if (callCount === 1) {
  console.log('debounced correctly');
} else {
  console.log('debounce broken: called ' + callCount + ' times');
}`,
    initialTestCases: [
      { input: '300', expectedOutput: 'called once after delay' },
    ],
    hiddenTestCases: [
      { input: '100', expectedOutput: 'debounced correctly' },
      { input: '300', expectedOutput: 'debounced correctly' },
    ],
    correctSolution: `function debounce(fn, wait) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
}

// Test harness (for Piston execution)
const wait = parseInt(require('fs').readFileSync('/dev/stdin', 'utf8').trim());
let callCount = 0;
const fn = () => { callCount++; };
const debounced = debounce(fn, wait);

// Simulate rapid calls
debounced(); debounced(); debounced();

setTimeout(() => {
  if (callCount === 1) {
    console.log('debounced correctly');
  } else {
    console.log('debounce failed: called ' + callCount + ' times');
  }
}, wait + 50);`,
    createdBy: 'seed',
  },

  // ──────────────────────────────────────────
  // Problem 9 — Python | Medium | 200 pts
  // ──────────────────────────────────────────
  {
    title: 'Two Sum Returns Wrong Pair',
    language: 'python',
    difficultyLevel: 'medium',
    bountyPoints: 200,
    estimatedTimeMinutes: 15,
    bugDescription: `**Problem Statement:**
This is the classic "Two Sum" problem. You are provided with a list of integers (\`nums\`) and an integer \`target\`. The function must find and return the indices of the two distinct numbers in the list that add up to the \`target\`. You can assume there is exactly one valid solution.

**The Bug:**
The implementation attempts to use a hash map (\`seen\`) for an efficient O(N) solution. However, due to a logical error in the sequence of operations, the function fails to find the correct pairs and often returns \`[0, 1]\` incorrectly. 

**Your Task:**
Analyze the loop logic. Locate the error in how the current element is added to the hash map relative to when its "complement" is searched for, and apply the fix.`,
    bugHints: 'If you add the current number to the `seen` hash map *before* checking for its complement, what happens if the target is exactly double the current number (e.g., target 6, current number 3)? You might incorrectly match the number with itself.',
    buggyCode: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        seen[num] = i
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
    return []

# --- Piston test harness (do not edit below this line) ---
nums = list(map(int, input().split()))
target = int(input())
result = two_sum(nums, target)
print(*result)`,
    initialTestCases: [
      { input: '2 7 11 15\n9', expectedOutput: '0 1' },
      { input: '3 2 4\n6', expectedOutput: '1 2' },
    ],
    hiddenTestCases: [
      { input: '2 7 11 15\n9', expectedOutput: '0 1' },
      { input: '3 2 4\n6', expectedOutput: '1 2' },
      { input: '1 5 3 7\n8', expectedOutput: '1 2' },
      { input: '0 4 3 0\n0', expectedOutput: '0 3' },
      { input: '1 2 3 4 5\n9', expectedOutput: '3 4' },
    ],
    correctSolution: `def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

line1 = list(map(int, input().split()))
target = int(input())
result = two_sum(line1, target)
print(result[0], result[1])`,
    createdBy: 'seed',
  },

  // ──────────────────────────────────────────
  // Problem 10 — JavaScript | Hard | 300 pts
  // ──────────────────────────────────────────
  {
    title: 'Promise Chain Loses Error',
    language: 'javascript',
    difficultyLevel: 'hard',
    bountyPoints: 300,
    estimatedTimeMinutes: 25,
    bugDescription: `**Problem Statement:**
The provided JavaScript code simulates fetching user data from an API and then running it through a processing pipeline using Promise chaining. 

**The Bug:**
The pipeline has a critical error-handling bug. If the \`processUser()\` function encounters invalid data and throws an error, that error is silently "swallowed". The final \`.catch()\` block at the end of the Promise chain, which is designed to handle pipeline failures, never gets triggered.

**Your Task:**
Investigate how errors are being caught within the \`.then()\` chain. Refactor the code so that any error thrown during processing appropriately bubbles up and is caught by the final \`.catch()\` block.`,
    bugHints: 'Inside the `.then()` handler, there is a `try...catch` block. Because the local `catch` block successfully handles the error (by just logging it) and does not re-throw it, the Promise chain considers the step successful. How can you ensure the Promise chain knows an error occurred?',
    buggyCode: `// Fix fetchAndProcess below — do NOT edit the test harness.
function fetchAndProcess(userId) {
  return fetch(\`/api/users/\${userId}\`)
    .then(response => response.json())
    .then(user => {
      try {
        return processUser(user);
      } catch (err) {
        console.log('Error caught locally:', err.message);
      }
    })
    .catch(err => {
      console.error('Pipeline failed:', err.message);
      throw err;
    });
}

function processUser(user) {
  if (!user.name) throw new Error('User has no name');
  return { ...user, processed: true };
}

// --- Piston test harness (do not edit below this line) ---
// Stubs out fetch() with a mock that returns a user missing the 'name' field.
const input = require('fs').readFileSync(0, 'utf8').trim();

global.fetch = (_url) =>
  Promise.resolve({
    json: () => Promise.resolve(input === 'valid_user' ? { name: '' } : {}),
  });

fetchAndProcess('test-user')
  .then(() => {
    console.log('pipeline_no_error');
  })
  .catch(() => {
    console.log('pipeline_error_caught');
  });`,
    initialTestCases: [
      { input: 'valid_user', expectedOutput: 'pipeline_error_caught' },
    ],
    hiddenTestCases: [
      { input: 'valid_user', expectedOutput: 'pipeline_error_caught' },
      { input: 'missing_name', expectedOutput: 'pipeline_error_caught' },
    ],
    correctSolution: `// Mock fetch and processUser for Piston execution
const input = require('fs').readFileSync('/dev/stdin', 'utf8').trim();

function mockFetch(userId) {
  const user = userId === 'missing_name' ? {} : { name: 'Test User' };
  return Promise.resolve({ json: () => Promise.resolve(user) });
}

function processUser(user) {
  if (!user.name) throw new Error('User has no name');
  return { ...user, processed: true };
}

function fetchAndProcess(userId) {
  return mockFetch(userId)
    .then(response => response.json())
    .then(user => {
      return processUser(user);
    })
    .catch(err => {
      console.log('pipeline_error_caught');
    });
}

fetchAndProcess(input);`,
    createdBy: 'seed',
  },
];

// ─────────────────────────────────────────────
// Main seeding function
// ─────────────────────────────────────────────
async function main() {
  try {
    // Delete existing seed data to avoid duplicates on re-runs
    const deleted = await prisma.bugBountyProblem.deleteMany({
      where: { createdBy: 'seed' },
    });
    console.log(`🗑  Cleared ${deleted.count} existing seed record(s).`);

    // Insert all problems and log each one
    for (const problem of problems) {
      const created = await prisma.bugBountyProblem.create({ data: problem });
      console.log(`  ✔  [${created.id}] ${created.title}`);
    }

    console.log('\n✅ Seeded 10 bug bounty problems');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    throw err;
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
