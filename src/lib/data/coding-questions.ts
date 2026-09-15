export interface CodingQuestion {
  id: number;
  title: string;
  difficulty: "Easy" | "Medium" | "Hard";
  category: "Array/String" | "Two Pointers" | "Matrix" | "Binary Search" | "Linked List" | "Trees" | "Graphs" | "Dynamic Programming" | "Misc";
  description: string;
  examples: string[];
  hints: string[];
}

export const CODING_QUESTIONS: CodingQuestion[] = [
  // 1-25: Array / String
  {
    id: 1,
    title: "Merge Sorted Array",
    difficulty: "Easy",
    category: "Array/String",
    description: "Merge two sorted integer arrays into one sorted array.",
    examples: ["Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3. Output: [1,2,2,3,5,6]"],
    hints: ["Work backwards from the end", "Use three pointers"]
  },
  {
    id: 2,
    title: "Remove Element",
    difficulty: "Easy",
    category: "Array/String",
    description: "Remove all instances of a value in-place and return the new length.",
    examples: ["Input: nums = [3,2,2,3], val = 3. Output: 2, nums = [2,2]"],
    hints: ["Two pointers", "Check if element equals target", "Modify in-place"]
  },
  {
    id: 3,
    title: "Remove Duplicates from Sorted Array",
    difficulty: "Easy",
    category: "Array/String",
    description: "Remove duplicates from sorted array in-place, return new length.",
    examples: ["Input: nums = [1,1,2]. Output: 2, nums = [1,2]"],
    hints: ["Two pointers", "Compare with previous element"]
  },
  {
    id: 4,
    title: "Remove Duplicates from Sorted Array II",
    difficulty: "Medium",
    category: "Array/String",
    description: "Remove duplicates allowing each element to appear at most twice.",
    examples: ["Input: nums = [1,1,1,2,2,3]. Output: 5, nums = [1,1,2,2,3]"],
    hints: ["Count occurrences", "Keep track of count"]
  },
  {
    id: 5,
    title: "Majority Element",
    difficulty: "Easy",
    category: "Array/String",
    description: "Find element appearing more than n/2 times.",
    examples: ["Input: nums = [3,2,3]. Output: 3"],
    hints: ["Boyer-Moore Voting Algorithm", "Time: O(n), Space: O(1)"]
  },
  {
    id: 6,
    title: "Rotate Array",
    difficulty: "Medium",
    category: "Array/String",
    description: "Rotate array to the right by k steps.",
    examples: ["Input: nums = [1,2,3,4,5], k = 2. Output: [4,5,1,2,3]"],
    hints: ["Reverse technique", "Reverse entire array, then parts"]
  },
  {
    id: 7,
    title: "Best Time to Buy and Sell Stock",
    difficulty: "Easy",
    category: "Array/String",
    description: "Find maximum profit from buying and selling stock once.",
    examples: ["Input: prices = [7,1,5,3,6,4]. Output: 5"],
    hints: ["Track minimum price seen", "Calculate profit at each step"]
  },
  {
    id: 8,
    title: "Best Time to Buy and Sell Stock II",
    difficulty: "Medium",
    category: "Array/String",
    description: "Maximize profit with unlimited transactions.",
    examples: ["Input: prices = [7,1,5,3,6,4]. Output: 7"],
    hints: ["Sum all positive differences", "Greedy approach"]
  },
  {
    id: 9,
    title: "Jump Game",
    difficulty: "Medium",
    category: "Array/String",
    description: "Determine if you can reach the last index.",
    examples: ["Input: nums = [2,3,1,1,4]. Output: true"],
    hints: ["Greedy approach", "Track maximum reachable index"]
  },
  {
    id: 10,
    title: "Jump Game II",
    difficulty: "Medium",
    category: "Array/String",
    description: "Return minimum number of jumps to reach last index.",
    examples: ["Input: nums = [2,3,1,1,4]. Output: 2"],
    hints: ["Greedy technique", "Track jump range"]
  },
  {
    id: 11,
    title: "H-Index",
    difficulty: "Medium",
    category: "Array/String",
    description: "Compute the H-Index of a researcher.",
    examples: ["Input: citations = [3,0,6,1,5]. Output: 3"],
    hints: ["Sort citations", "Check h-index condition"]
  },
  {
    id: 12,
    title: "Insert Delete GetRandom O(1)",
    difficulty: "Medium",
    category: "Array/String",
    description: "Design data structure with random, insert, delete in O(1).",
    examples: ["Operations: insert(1), insert(2), getRandom(), remove(1), getRandom()"],
    hints: ["Use HashMap and Array", "Swap with last element on remove"]
  },
  {
    id: 13,
    title: "Product of Array Except Self",
    difficulty: "Medium",
    category: "Array/String",
    description: "Return array where each element is product of all others.",
    examples: ["Input: nums = [1,2,3,4]. Output: [24,12,8,6]"],
    hints: ["Prefix and suffix products", "O(n) time, O(1) space (excluding output)"]
  },
  {
    id: 14,
    title: "Gas Station",
    difficulty: "Medium",
    category: "Array/String",
    description: "Find starting gas station to complete circuit.",
    examples: ["Input: gas = [1,2,3,4,5], cost = [3,4,5,1,2]. Output: 3"],
    hints: ["Track total gas and current gas", "One-pass solution"]
  },
  {
    id: 15,
    title: "Candy",
    difficulty: "Hard",
    category: "Array/String",
    description: "Distribute minimum candies with constraints.",
    examples: ["Input: ratings = [1,0,2]. Output: 5"],
    hints: ["Two-pass approach", "Forward and backward passes"]
  },
  {
    id: 16,
    title: "Trapping Rain Water",
    difficulty: "Hard",
    category: "Array/String",
    description: "Calculate trapped rainwater between elevations.",
    examples: ["Input: height = [0,1,0,2,1,0,1,3,2,1,2,1]. Output: 6"],
    hints: ["Two pointers or stack", "Track left/right maximum heights"]
  },
  {
    id: 17,
    title: "Roman to Integer",
    difficulty: "Easy",
    category: "Array/String",
    description: "Convert Roman numeral to integer.",
    examples: ["Input: s = 'III'. Output: 3", "Input: s = 'LVIII'. Output: 58"],
    hints: ["Handle subtraction cases", "Right to left traversal"]
  },
  {
    id: 18,
    title: "Integer to Roman",
    difficulty: "Medium",
    category: "Array/String",
    description: "Convert integer to Roman numeral.",
    examples: ["Input: num = 3. Output: 'III'", "Input: num = 58. Output: 'LVIII'"],
    hints: ["Use value-symbol pairs in descending order", "Greedy approach"]
  },
  {
    id: 19,
    title: "Length of Last Word",
    difficulty: "Easy",
    category: "Array/String",
    description: "Find length of last word in string.",
    examples: ["Input: s = 'Hello World'. Output: 5"],
    hints: ["Trim from end", "Count characters backwards"]
  },
  {
    id: 20,
    title: "Longest Common Prefix",
    difficulty: "Easy",
    category: "Array/String",
    description: "Find longest common prefix in array of strings.",
    examples: ["Input: strs = ['flower','flow','flight']. Output: 'fl'"],
    hints: ["Compare character by character", "Horizontal/vertical scanning"]
  },
  {
    id: 21,
    title: "Reverse Words in a String",
    difficulty: "Medium",
    category: "Array/String",
    description: "Reverse order of words in string.",
    examples: ["Input: s = 'the sky is blue'. Output: 'blue is sky the'"],
    hints: ["Split and reverse", "Handle extra spaces"]
  },
  {
    id: 22,
    title: "Zigzag Conversion",
    difficulty: "Medium",
    category: "Array/String",
    description: "Write string in zigzag pattern and read line by line.",
    examples: ["Input: s = 'PAYPALISHIRING', numRows = 3. Output: 'PAHNAPLSIIGYIR'"],
    hints: ["Track row and direction", "Append to appropriate row"]
  },
  {
    id: 23,
    title: "Find Index of First Occurrence in String",
    difficulty: "Easy",
    category: "Array/String",
    description: "Find first occurrence of pattern in string.",
    examples: ["Input: haystack = 'sadbutsad', needle = 'sad'. Output: 0"],
    hints: ["KMP algorithm", "Built-in string methods"]
  },
  {
    id: 24,
    title: "Text Justification",
    difficulty: "Hard",
    category: "Array/String",
    description: "Format text with full justification.",
    examples: ["Input: words = ['Science','is','what','we','understand'], maxWidth = 7. Output: ['Science','is   what','we     understand']"],
    hints: ["Distribute spaces evenly", "Handle last line separately"]
  },
  {
    id: 25,
    title: "Valid Palindrome",
    difficulty: "Easy",
    category: "Array/String",
    description: "Check if string is palindrome (alphanumeric only).",
    examples: ["Input: s = 'A man, a plan, a canal: Panama'. Output: true"],
    hints: ["Two pointers", "Skip non-alphanumeric"]
  },

  // 26-40: Two Pointers
  {
    id: 26,
    title: "Is Subsequence",
    difficulty: "Easy",
    category: "Two Pointers",
    description: "Check if one string is subsequence of another.",
    examples: ["Input: s = 'ace', t = 'abcde'. Output: true"],
    hints: ["Two pointers", "Greedy matching"]
  },
  {
    id: 27,
    title: "Two Sum II - Input Array is Sorted",
    difficulty: "Medium",
    category: "Two Pointers",
    description: "Find two numbers that add up to target (1-indexed).",
    examples: ["Input: numbers = [2,7,11,15], target = 9. Output: [1,2]"],
    hints: ["Two pointers from ends", "Move based on sum"]
  },
  {
    id: 28,
    title: "Container With Most Water",
    difficulty: "Medium",
    category: "Two Pointers",
    description: "Find two lines that form maximum area.",
    examples: ["Input: height = [1,8,6,2,5,4,8,3,7]. Output: 49"],
    hints: ["Two pointers from ends", "Move inward based on height"]
  },
  {
    id: 29,
    title: "3Sum",
    difficulty: "Medium",
    category: "Two Pointers",
    description: "Find all unique triplets that sum to zero.",
    examples: ["Input: nums = [-1,0,1,2,-1,-4]. Output: [[-1,-1,2],[-1,0,1]]"],
    hints: ["Sort first", "Use two pointers for pairs", "Handle duplicates"]
  },
  {
    id: 30,
    title: "Minimum Size Subarray Sum",
    difficulty: "Medium",
    category: "Two Pointers",
    description: "Find minimum length subarray with sum >= target.",
    examples: ["Input: target = 7, nums = [2,3,1,2,4,3]. Output: 2"],
    hints: ["Sliding window", "Two pointers"]
  },
  {
    id: 31,
    title: "Longest Substring Without Repeating Characters",
    difficulty: "Medium",
    category: "Two Pointers",
    description: "Find longest substring without duplicate characters.",
    examples: ["Input: s = 'abcabcbb'. Output: 3"],
    hints: ["Sliding window", "HashMap for character positions"]
  },
  {
    id: 32,
    title: "Minimum Window Substring",
    difficulty: "Hard",
    category: "Two Pointers",
    description: "Find minimum window substring containing all characters.",
    examples: ["Input: s = 'ADOBECODEBANC', t = 'ABC'. Output: 'BANC'"],
    hints: ["Sliding window", "Two pointers", "Character frequency map"]
  },
  {
    id: 33,
    title: "Substring with Concatenation of All Words",
    difficulty: "Hard",
    category: "Two Pointers",
    description: "Find substring indexes containing concatenation of all words.",
    examples: ["Input: s = 'barfoothefoobarman', words = ['foo','bar']"],
    hints: ["Sliding window of fixed size", "Word frequency map"]
  },
  {
    id: 34,
    title: "Palindromic Substrings",
    difficulty: "Medium",
    category: "Two Pointers",
    description: "Count number of palindromic substrings.",
    examples: ["Input: s = 'abc'. Output: 3 (a, b, c)"],
    hints: ["Expand around center", "Dynamic Programming"]
  },
  {
    id: 35,
    title: "Longest Palindromic Substring",
    difficulty: "Medium",
    category: "Two Pointers",
    description: "Find longest palindromic substring.",
    examples: ["Input: s = 'babad'. Output: 'bab' or 'aba'"],
    hints: ["Expand around center", "Dynamic Programming"]
  },
  {
    id: 36,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Two Pointers",
    description: "Find median of two sorted arrays.",
    examples: ["Input: nums1 = [1,3], nums2 = [2]. Output: 2.0"],
    hints: ["Binary search", "Two pointers"]
  },
  {
    id: 37,
    title: "Valid Anagram",
    difficulty: "Easy",
    category: "Two Pointers",
    description: "Check if two strings are anagrams.",
    examples: ["Input: s = 'anagram', t = 'nagaram'. Output: true"],
    hints: ["Sort both strings", "Character frequency map"]
  },
  {
    id: 38,
    title: "Contains Duplicate",
    difficulty: "Easy",
    category: "Two Pointers",
    description: "Check if array contains duplicates.",
    examples: ["Input: nums = [1,2,3,1]. Output: true"],
    hints: ["HashSet", "Sorting"]
  },
  {
    id: 39,
    title: "Group Anagrams",
    difficulty: "Medium",
    category: "Two Pointers",
    description: "Group anagrams together.",
    examples: ["Input: strs = ['eat','tea','ate','eat','eta','ate']. Output: [['bat'],['nat','tan'],['ate','eat','tea']]"],
    hints: ["Sort characters in each word", "HashMap grouping"]
  },
  {
    id: 40,
    title: "Longest Consecutive Sequence",
    difficulty: "Medium",
    category: "Two Pointers",
    description: "Find length of longest consecutive sequence.",
    examples: ["Input: nums = [100,4,200,1,3,2]. Output: 4 (sequence: [1,2,3,4])"],
    hints: ["HashSet", "One-pass iteration"]
  },

  // 41-55: Matrix
  {
    id: 41,
    title: "Valid Sudoku",
    difficulty: "Easy",
    category: "Matrix",
    description: "Validate incomplete sudoku board.",
    examples: ["Check if a 9x9 board has valid sudoku constraints"],
    hints: ["Check rows, columns, and 3x3 boxes", "HashSet for each constraint"]
  },
  {
    id: 42,
    title: "Spiral Matrix",
    difficulty: "Medium",
    category: "Matrix",
    description: "Traverse matrix in spiral order.",
    examples: ["Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]. Output: [1,2,3,6,9,8,7,4,5]"],
    hints: ["Track boundaries", "Change direction when hitting boundary"]
  },
  {
    id: 43,
    title: "Rotate Image",
    difficulty: "Medium",
    category: "Matrix",
    description: "Rotate matrix 90 degrees clockwise in-place.",
    examples: ["Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]. Rotate in-place"],
    hints: ["Transpose then reverse", "In-place rotation"]
  },
  {
    id: 44,
    title: "Set Matrix Zeroes",
    difficulty: "Medium",
    category: "Matrix",
    description: "Set entire row and column to zero if element is zero.",
    examples: ["Input: matrix = [[1,1,1],[1,0,1],[1,1,1]]. Set row 1 and col 1 to 0"],
    hints: ["Use first row/col as markers", "O(1) space solution"]
  },
  {
    id: 45,
    title: "Game of Life",
    difficulty: "Medium",
    category: "Matrix",
    description: "Simulate Conway's Game of Life.",
    examples: ["Update board based on neighbor rules"],
    hints: ["Use encoding for new state", "Check 8 neighbors"]
  },
  {
    id: 46,
    title: "Word Search",
    difficulty: "Medium",
    category: "Matrix",
    description: "Search for word in 2D board using DFS.",
    examples: ["Input: board = [['A','B','C','E'],['S','F','C','S'],['A','D','E','E']], word = 'ABCCED'. Output: true"],
    hints: ["DFS backtracking", "Mark visited cells"]
  },
  {
    id: 47,
    title: "Number of Islands",
    difficulty: "Medium",
    category: "Matrix",
    description: "Count number of islands in grid.",
    examples: ["Input: grid = [['1','1','0'],['1','0','0'],['0','0','1']]. Output: 3"],
    hints: ["DFS or BFS", "Mark visited land"]
  },
  {
    id: 48,
    title: "Surrounded Regions",
    difficulty: "Medium",
    category: "Matrix",
    description: "Capture regions surrounded by X.",
    examples: ["Input: board with 'X' and 'O'. Output: captured Os become X"],
    hints: ["DFS/BFS from borders", "Protect border-connected Os"]
  },
  {
    id: 49,
    title: "Pacific Atlantic Water Flow",
    difficulty: "Medium",
    category: "Matrix",
    description: "Find cells where water flows to both oceans.",
    examples: ["Input: heights matrix. Output: coordinates of cells"],
    hints: ["DFS from both oceans", "Meet in middle approach"]
  },
  {
    id: 50,
    title: "Rotting Oranges",
    difficulty: "Medium",
    category: "Matrix",
    description: "Calculate time for all oranges to rot via BFS.",
    examples: ["Input: grid with fresh/rotten oranges. Output: minutes to rot all"],
    hints: ["BFS multi-source", "Queue initialization with rotten oranges"]
  },
  {
    id: 51,
    title: "Search a 2D Matrix",
    difficulty: "Medium",
    category: "Matrix",
    description: "Search target in sorted 2D matrix.",
    examples: ["Input: matrix sorted row-wise and col-wise. Output: target found"],
    hints: ["Binary search", "Treat matrix as 1D sorted array"]
  },
  {
    id: 52,
    title: "Search a 2D Matrix II",
    difficulty: "Medium",
    category: "Matrix",
    description: "Search in matrix with sorted rows and columns.",
    examples: ["Input: matrix with sorted rows/cols. Output: target location"],
    hints: ["Start from corner", "Move up/left or down/right"]
  },
  {
    id: 53,
    title: "Diagonal Traverse",
    difficulty: "Medium",
    category: "Matrix",
    description: "Traverse matrix diagonally.",
    examples: ["Input: matrix = [[1,2,3],[4,5,6],[7,8,9]]. Output: [1,2,4,7,5,3,6,8,9]"],
    hints: ["Track direction", "Handle boundaries"]
  },
  {
    id: 54,
    title: "Matrix Block Sum",
    difficulty: "Easy",
    category: "Matrix",
    description: "Calculate sum of square blocks.",
    examples: ["Input: matrix, blockSize. Output: sum of block"],
    hints: ["2D prefix sum", "Dynamic programming"]
  },
  {
    id: 55,
    title: "Maximum Area of Island",
    difficulty: "Medium",
    category: "Matrix",
    description: "Find maximum area of island in grid.",
    examples: ["Input: grid with land/water. Output: max island area"],
    hints: ["DFS traversal", "Count connected land cells"]
  },

  // 56-70: Binary Search
  {
    id: 56,
    title: "Binary Search",
    difficulty: "Easy",
    category: "Binary Search",
    description: "Find target in sorted array.",
    examples: ["Input: nums = [-1,0,3,5,9,12], target = 9. Output: 4"],
    hints: ["Standard binary search", "Log(n) time"]
  },
  {
    id: 57,
    title: "Search in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Search in rotated sorted array.",
    examples: ["Input: nums = [4,5,6,7,0,1,2], target = 0. Output: 4"],
    hints: ["Find pivot", "Apply binary search on correct half"]
  },
  {
    id: 58,
    title: "Find Minimum in Rotated Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Find minimum element in rotated array.",
    examples: ["Input: nums = [3,4,5,1,2]. Output: 1"],
    hints: ["Binary search variant", "Check which side is sorted"]
  },
  {
    id: 59,
    title: "Find Peak Element",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Find peak element (greater than neighbors).",
    examples: ["Input: nums = [1,2,1,3,5,6,4]. Output: 5"],
    hints: ["Binary search", "Compare with neighbors"]
  },
  {
    id: 60,
    title: "Koko Eating Bananas",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Find minimum eating speed to finish within hours.",
    examples: ["Input: piles = [1,1,1,1], h = 4. Output: 1"],
    hints: ["Binary search on answer", "Simulate eating process"]
  },
  {
    id: 61,
    title: "Capacity To Ship Packages Within D Days",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Find minimum ship capacity.",
    examples: ["Input: weights = [1,2,3,4,5,6,7,8,9,10], days = 5. Output: 15"],
    hints: ["Binary search on capacity", "Greedy shipping simulation"]
  },
  {
    id: 62,
    title: "Median of Two Sorted Arrays",
    difficulty: "Hard",
    category: "Binary Search",
    description: "Find median of two sorted arrays.",
    examples: ["Input: nums1 = [1,3], nums2 = [2]. Output: 2.0"],
    hints: ["Binary search on one array", "Partition technique"]
  },
  {
    id: 63,
    title: "Split Array Largest Sum",
    difficulty: "Hard",
    category: "Binary Search",
    description: "Minimize largest sum after splitting array.",
    examples: ["Input: nums = [1,2,3,4,5], k = 2. Output: 9"],
    hints: ["Binary search on answer", "Check if feasible"]
  },
  {
    id: 64,
    title: "Time Based Key-Value Store",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Design store with timestamp-based retrieval.",
    examples: ["set('foo', 'bar', 1), get('foo', 1). Output: 'bar'"],
    hints: ["HashMap of lists", "Binary search for timestamp"]
  },
  {
    id: 65,
    title: "Find First and Last Position of Element in Sorted Array",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Find start and end position of target.",
    examples: ["Input: nums = [5,7,7,8,8,10], target = 8. Output: [3,4]"],
    hints: ["Two binary searches"]
  },
  {
    id: 66,
    title: "Search Insert Position",
    difficulty: "Easy",
    category: "Binary Search",
    description: "Find position to insert target in sorted array.",
    examples: ["Input: nums = [1,3,5,6], target = 5. Output: 2"],
    hints: ["Standard binary search", "Handle insertion position"]
  },
  {
    id: 67,
    title: "Sqrt(x)",
    difficulty: "Easy",
    category: "Binary Search",
    description: "Compute integer square root.",
    examples: ["Input: x = 8. Output: 2"],
    hints: ["Binary search", "Check mid*mid"]
  },
  {
    id: 68,
    title: "Pow(x, n)",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Calculate x raised to power n.",
    examples: ["Input: x = 2.0, n = 10. Output: 1024.0"],
    hints: ["Fast exponentiation", "Handle negative n"]
  },
  {
    id: 69,
    title: "Kth Smallest Element in a Sorted Matrix",
    difficulty: "Hard",
    category: "Binary Search",
    description: "Find kth smallest element in sorted matrix.",
    examples: ["Input: matrix = [[1,2],[1,1]], k = 1. Output: 1"],
    hints: ["Binary search on value", "Count elements <= mid"]
  },
  {
    id: 70,
    title: "Find K Closest Elements",
    difficulty: "Medium",
    category: "Binary Search",
    description: "Find k closest elements to x.",
    examples: ["Input: arr = [1,2,3,4,5], k = 4, x = 3. Output: [1,2,3,4]"],
    hints: ["Binary search for position", "Sliding window"]
  },

  // 71-85: Linked List
  {
    id: 71,
    title: "Reverse Linked List",
    difficulty: "Easy",
    category: "Linked List",
    description: "Reverse a linked list iteratively or recursively.",
    examples: ["Input: head = [1,2,3]. Output: [3,2,1]"],
    hints: ["Three pointers (prev, curr, next)", "Recursive approach"]
  },
  {
    id: 72,
    title: "Linked List Cycle",
    difficulty: "Easy",
    category: "Linked List",
    description: "Detect cycle in linked list.",
    examples: ["Input: head with cycle. Output: true"],
    hints: ["Floyd's cycle detection", "Slow and fast pointers"]
  },
  {
    id: 73,
    title: "Linked List Cycle II",
    difficulty: "Medium",
    category: "Linked List",
    description: "Find node where cycle begins.",
    examples: ["Input: head with cycle. Output: node where cycle starts"],
    hints: ["Floyd's algorithm", "Two-phase detection"]
  },
  {
    id: 74,
    title: "Merge Two Sorted Lists",
    difficulty: "Easy",
    category: "Linked List",
    description: "Merge two sorted linked lists.",
    examples: ["Input: list1 = [1,2,4], list2 = [1,3,4]. Output: [1,1,2,3,4,4]"],
    hints: ["Two pointers", "Create dummy node"]
  },
  {
    id: 75,
    title: "Merge K Sorted Lists",
    difficulty: "Hard",
    category: "Linked List",
    description: "Merge multiple sorted linked lists.",
    examples: ["Input: lists = [[1,4,5],[1,3,4],[2,6]]. Output: [1,1,1,2,3,4,4,5,6]"],
    hints: ["Min heap", "Divide and conquer", "Merge two lists"]
  },
  {
    id: 76,
    title: "Remove Nth Node From End of List",
    difficulty: "Medium",
    category: "Linked List",
    description: "Remove nth node from end of list.",
    examples: ["Input: head = [1,2,3,4,5], n = 2. Output: [1,2,3,5]"],
    hints: ["Two pointers", "Dummy node for edge cases"]
  },
  {
    id: 77,
    title: "Reorder List",
    difficulty: "Medium",
    category: "Linked List",
    description: "Reorder list to L0->Ln->L1->Ln-1... pattern.",
    examples: ["Input: [1,2,3,4]. Output: [1,4,2,3]"],
    hints: ["Find middle", "Reverse second half", "Merge halves"]
  },
  {
    id: 78,
    title: "Add Two Numbers",
    difficulty: "Medium",
    category: "Linked List",
    description: "Add two numbers represented by linked lists.",
    examples: ["Input: l1 = [2,4,3], l2 = [5,6,4]. Output: [7,0,8]"],
    hints: ["Keep track of carry", "Handle final carry"]
  },
  {
    id: 79,
    title: "Copy List With Random Pointer",
    difficulty: "Medium",
    category: "Linked List",
    description: "Copy linked list with random pointers.",
    examples: ["Input: linked list with random pointers. Output: deep copy"],
    hints: ["HashMap for mapping", "Three passes or one pass with map"]
  },
  {
    id: 80,
    title: "Reverse Nodes in K Group",
    difficulty: "Hard",
    category: "Linked List",
    description: "Reverse nodes in groups of k.",
    examples: ["Input: [1,2,3,4,5], k = 2. Output: [2,1,4,3,5]"],
    hints: ["Recursion", "Reverse k nodes", "Connect groups"]
  },
  {
    id: 81,
    title: "Intersection of Two Linked Lists",
    difficulty: "Easy",
    category: "Linked List",
    description: "Find intersection point of two linked lists.",
    examples: ["Input: two lists intersecting. Output: intersection node"],
    hints: ["Two pointer technique", "Length difference"]
  },
  {
    id: 82,
    title: "Palindrome Linked List",
    difficulty: "Easy",
    category: "Linked List",
    description: "Check if linked list is palindrome.",
    examples: ["Input: [1,2,2,1]. Output: true"],
    hints: ["Find middle", "Reverse second half", "Compare halves"]
  },
  {
    id: 83,
    title: "Flatten a Multilevel Doubly Linked List",
    difficulty: "Medium",
    category: "Linked List",
    description: "Flatten multilevel doubly linked list.",
    examples: ["Input: list with child pointers. Output: flattened list"],
    hints: ["DFS traversal", "Update pointers properly"]
  },
  {
    id: 84,
    title: "Rotate List",
    difficulty: "Medium",
    category: "Linked List",
    description: "Rotate list to the right by k steps.",
    examples: ["Input: [1,2,3,4,5], k = 2. Output: [4,5,1,2,3]"],
    hints: ["Find length", "Connect tail to head", "Find new tail"]
  },
  {
    id: 85,
    title: "Swap Nodes in Pairs",
    difficulty: "Medium",
    category: "Linked List",
    description: "Swap adjacent nodes in pairs.",
    examples: ["Input: [1,2,3,4]. Output: [2,1,4,3]"],
    hints: ["Iterative or recursive", "Dummy node"]
  },

  // 86-105: Trees
  {
    id: 86,
    title: "Maximum Depth of Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    description: "Find maximum depth of binary tree.",
    examples: ["Input: [3,9,20,null,null,15,7]. Output: 3"],
    hints: ["DFS recursion", "BFS level traversal"]
  },
  {
    id: 87,
    title: "Same Tree",
    difficulty: "Easy",
    category: "Trees",
    description: "Check if two trees are identical.",
    examples: ["Input: two trees. Output: true/false"],
    hints: ["Recursive comparison", "Check values and structure"]
  },
  {
    id: 88,
    title: "Invert Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    description: "Invert binary tree (mirror).",
    examples: ["Input: [4,2,7,1,3,6,9]. Output: [4,7,2,9,6,3,1]"],
    hints: ["Recursion", "Swap children"]
  },
  {
    id: 89,
    title: "Binary Tree Level Order Traversal",
    difficulty: "Medium",
    category: "Trees",
    description: "Level order traversal of binary tree.",
    examples: ["Input: [3,9,20,null,null,15,7]. Output: [[3],[9,20],[15,7]]"],
    hints: ["BFS with queue", "Process level by level"]
  },
  {
    id: 90,
    title: "Binary Tree Right Side View",
    difficulty: "Medium",
    category: "Trees",
    description: "Get rightmost node at each level.",
    examples: ["Input: [1,2,3,null,5,null,4]. Output: [1,3,4]"],
    hints: ["BFS", "DFS with depth tracking"]
  },
  {
    id: 91,
    title: "Count Good Nodes in Binary Tree",
    difficulty: "Medium",
    category: "Trees",
    description: "Count nodes greater than all ancestors.",
    examples: ["Input: tree with values. Output: count of good nodes"],
    hints: ["DFS with max value tracking"]
  },
  {
    id: 92,
    title: "Validate Binary Search Tree",
    difficulty: "Medium",
    category: "Trees",
    description: "Check if tree is valid BST.",
    examples: ["Input: [2,1,3]. Output: true"],
    hints: ["DFS with min/max bounds", "In-order traversal"]
  },
  {
    id: 93,
    title: "Kth Smallest Element in BST",
    difficulty: "Medium",
    category: "Trees",
    description: "Find kth smallest element in BST.",
    examples: ["Input: root, k = 1. Output: smallest element"],
    hints: ["In-order traversal", "Stack-based iteration"]
  },
  {
    id: 94,
    title: "Lowest Common Ancestor of BST",
    difficulty: "Easy",
    category: "Trees",
    description: "Find LCA of two nodes in BST.",
    examples: ["Input: root, p, q. Output: LCA node"],
    hints: ["Use BST properties", "Recursive approach"]
  },
  {
    id: 95,
    title: "Lowest Common Ancestor of Binary Tree",
    difficulty: "Medium",
    category: "Trees",
    description: "Find LCA of two nodes in binary tree.",
    examples: ["Input: root, p, q. Output: LCA node"],
    hints: ["DFS post-order", "Check left and right subtrees"]
  },
  {
    id: 96,
    title: "Construct Binary Tree from Preorder and Inorder Traversal",
    difficulty: "Medium",
    category: "Trees",
    description: "Build tree from preorder and inorder.",
    examples: ["Input: preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]"],
    hints: ["Find root from preorder", "Split inorder", "Recursively build subtrees"]
  },
  {
    id: 97,
    title: "Binary Tree Maximum Path Sum",
    difficulty: "Hard",
    category: "Trees",
    description: "Find maximum path sum in tree.",
    examples: ["Input: [-10,9,20,null,null,15,7]. Output: 42"],
    hints: ["DFS post-order", "Track max at each node"]
  },
  {
    id: 98,
    title: "Serialize and Deserialize Binary Tree",
    difficulty: "Hard",
    category: "Trees",
    description: "Serialize tree to string and back.",
    examples: ["Input: tree. Output: serialized string, deserialize back"],
    hints: ["Pre-order traversal", "Use markers for null nodes"]
  },
  {
    id: 99,
    title: "Path Sum",
    difficulty: "Easy",
    category: "Trees",
    description: "Check if path from root to leaf sums to target.",
    examples: ["Input: root, targetSum. Output: true/false"],
    hints: ["DFS recursion", "Subtract current node from target"]
  },
  {
    id: 100,
    title: "Path Sum II",
    difficulty: "Medium",
    category: "Trees",
    description: "Find all paths from root to leaf with target sum.",
    examples: ["Input: root, targetSum. Output: list of paths"],
    hints: ["DFS backtracking", "Build path during recursion"]
  },
  {
    id: 101,
    title: "Diameter of Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    description: "Find diameter of binary tree.",
    examples: ["Input: [1,2,3,4,5]. Output: 3"],
    hints: ["DFS post-order", "Height of each subtree"]
  },
  {
    id: 102,
    title: "Balanced Binary Tree",
    difficulty: "Easy",
    category: "Trees",
    description: "Check if tree is height-balanced.",
    examples: ["Input: tree. Output: true/false"],
    hints: ["DFS post-order", "Check height difference"]
  },
  {
    id: 103,
    title: "Subtree of Another Tree",
    difficulty: "Easy",
    category: "Trees",
    description: "Check if one tree is subtree of another.",
    examples: ["Input: root, subRoot. Output: true/false"],
    hints: ["DFS on main tree", "Check if subtree matches"]
  },
  {
    id: 104,
    title: "Binary Tree Zigzag Level Order Traversal",
    difficulty: "Medium",
    category: "Trees",
    description: "Level order traversal alternating directions.",
    examples: ["Input: [3,9,20,null,null,15,7]. Output: [[3],[20,9],[15,7]]"],
    hints: ["BFS", "Alternate direction using deque"]
  },
  {
    id: 105,
    title: "Sum Root to Leaf Numbers",
    difficulty: "Medium",
    category: "Trees",
    description: "Sum of all root-to-leaf numbers.",
    examples: ["Input: [1,2,3]. Output: 25 (12+13)"],
    hints: ["DFS with path tracking", "Build numbers during recursion"]
  },

  // 106-120: Graphs
  {
    id: 106,
    title: "Clone Graph",
    difficulty: "Medium",
    category: "Graphs",
    description: "Deep copy of undirected graph.",
    examples: ["Input: adjacency list. Output: cloned graph"],
    hints: ["DFS or BFS", "HashMap for node mapping"]
  },
  {
    id: 107,
    title: "Course Schedule",
    difficulty: "Medium",
    category: "Graphs",
    description: "Check if can finish all courses.",
    examples: ["Input: numCourses, prerequisites. Output: true/false"],
    hints: ["Topological sort", "Detect cycle with DFS"]
  },
  {
    id: 108,
    title: "Course Schedule II",
    difficulty: "Medium",
    category: "Graphs",
    description: "Return order to finish all courses.",
    examples: ["Input: numCourses, prerequisites. Output: order or empty"],
    hints: ["Topological sort", "Kahn's algorithm or DFS"]
  },
  {
    id: 109,
    title: "Graph Valid Tree",
    difficulty: "Medium",
    category: "Graphs",
    description: "Check if graph is valid tree.",
    examples: ["Input: n, edges. Output: true/false"],
    hints: ["n nodes, n-1 edges", "No cycle, connected"]
  },
  {
    id: 110,
    title: "Number of Connected Components in Graph",
    difficulty: "Medium",
    category: "Graphs",
    description: "Count connected components.",
    examples: ["Input: n, edges. Output: number of components"],
    hints: ["DFS or BFS", "Union-Find"]
  },
  {
    id: 111,
    title: "Redundant Connection",
    difficulty: "Medium",
    category: "Graphs",
    description: "Find edge that creates cycle.",
    examples: ["Input: edges forming tree with one extra. Output: extra edge"],
    hints: ["Union-Find", "DFS cycle detection"]
  },
  {
    id: 112,
    title: "Word Ladder",
    difficulty: "Hard",
    category: "Graphs",
    description: "Find shortest path between words.",
    examples: ["Input: beginWord, endWord, wordList. Output: length"],
    hints: ["BFS", "Build word graph"]
  },
  {
    id: 113,
    title: "Alien Dictionary",
    difficulty: "Hard",
    category: "Graphs",
    description: "Derive alien dictionary order from words.",
    examples: ["Input: sorted words in alien dictionary. Output: order"],
    hints: ["Build graph from character differences", "Topological sort"]
  },
  {
    id: 114,
    title: "Network Delay Time",
    difficulty: "Medium",
    category: "Graphs",
    description: "Time for signal to reach all nodes.",
    examples: ["Input: times, n, k. Output: minimum time"],
    hints: ["Dijkstra's algorithm", "Priority queue"]
  },
  {
    id: 115,
    title: "Cheapest Flights Within K Stops",
    difficulty: "Medium",
    category: "Graphs",
    description: "Cheapest price from src to dst with k stops.",
    examples: ["Input: flights, n, src, dst, k. Output: price"],
    hints: ["Dijkstra or Bellman-Ford variant", "Track stops"]
  },
  {
    id: 116,
    title: "Reconstruct Itinerary",
    difficulty: "Hard",
    category: "Graphs",
    description: "Reconstruct itinerary from tickets.",
    examples: ["Input: list of airline tickets. Output: itinerary"],
    hints: ["Eulerian path", "Hierholzer's algorithm"]
  },
  {
    id: 117,
    title: "Minimum Height Trees",
    difficulty: "Medium",
    category: "Graphs",
    description: "Find nodes minimizing tree height.",
    examples: ["Input: n, edges. Output: nodes for minimum height"],
    hints: ["Topological sort", "Remove leaf nodes iteratively"]
  },
  {
    id: 118,
    title: "Evaluate Division",
    difficulty: "Medium",
    category: "Graphs",
    description: "Evaluate division queries in graph.",
    examples: ["Input: equations, values, queries. Output: results"],
    hints: ["Build weighted graph", "DFS path finding", "Union-Find"]
  },
  {
    id: 119,
    title: "Accounts Merge",
    difficulty: "Medium",
    category: "Graphs",
    description: "Merge accounts with common emails.",
    examples: ["Input: list of accounts. Output: merged accounts"],
    hints: ["Union-Find", "Graph of emails"]
  },
  {
    id: 120,
    title: "All Paths From Source to Target",
    difficulty: "Medium",
    category: "Graphs",
    description: "Find all paths from 0 to n-1.",
    examples: ["Input: graph adjacency list. Output: all paths"],
    hints: ["DFS backtracking", "Build path during traversal"]
  },

  // 121-135: Dynamic Programming
  {
    id: 121,
    title: "Climbing Stairs",
    difficulty: "Easy",
    category: "Dynamic Programming",
    description: "Number of ways to climb stairs.",
    examples: ["Input: n = 3. Output: 3 (1+1+1, 1+2, 2+1)"],
    hints: ["dp[i] = dp[i-1] + dp[i-2]", "Fibonacci pattern"]
  },
  {
    id: 122,
    title: "House Robber",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Maximum money to rob non-adjacent houses.",
    examples: ["Input: [1,2,3,1]. Output: 4"],
    hints: ["dp[i] = max(dp[i-1], dp[i-2] + nums[i])"]
  },
  {
    id: 123,
    title: "House Robber II",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Rob houses in circular arrangement.",
    examples: ["Input: [1,2,3,1]. Output: 3"],
    hints: ["Two cases: rob first or last", "House Robber logic"]
  },
  {
    id: 124,
    title: "Longest Increasing Subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Length of longest increasing subsequence.",
    examples: ["Input: [10,9,2,5,3,7,101,18]. Output: 4"],
    hints: ["dp[i] = length of LIS ending at i", "Binary search optimization"]
  },
  {
    id: 125,
    title: "Coin Change",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Minimum coins for amount.",
    examples: ["Input: coins = [1,2,5], amount = 5. Output: 2"],
    hints: ["dp[i] = minimum coins for amount i", "Bottom-up DP"]
  },
  {
    id: 126,
    title: "Coin Change II",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Number of combinations for amount.",
    examples: ["Input: amount = 5, coins = [1,2,5]. Output: 5"],
    hints: ["Knapsack variant", "Avoid counting duplicates"]
  },
  {
    id: 127,
    title: "Partition Equal Subset Sum",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Check if can partition into equal sum subsets.",
    examples: ["Input: [1,5,11,5]. Output: true"],
    hints: ["Knapsack problem", "Target = sum/2"]
  },
  {
    id: 128,
    title: "Word Break",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Check if word can be segmented.",
    examples: ["Input: s = 'leetcode', wordDict = ['leet','code']. Output: true"],
    hints: ["dp[i] = can segment s[0:i]", "Memoization"]
  },
  {
    id: 129,
    title: "Decode Ways",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Number of ways to decode string.",
    examples: ["Input: '226'. Output: 3"],
    hints: ["dp[i] = dp[i-1] + dp[i-2] conditionally", "Handle edge cases"]
  },
  {
    id: 130,
    title: "Unique Paths",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Number of paths from top-left to bottom-right.",
    examples: ["Input: m = 3, n = 7. Output: 28"],
    hints: ["dp[i][j] = dp[i-1][j] + dp[i][j-1]", "Combinations formula"]
  },
  {
    id: 131,
    title: "Unique Paths II",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Paths with obstacles.",
    examples: ["Input: obstacle grid. Output: paths"],
    hints: ["Skip cells with obstacles", "Similar to Unique Paths"]
  },
  {
    id: 132,
    title: "Longest Common Subsequence",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Length of longest common subsequence.",
    examples: ["Input: 'ac', 'bc'. Output: 1"],
    hints: ["2D DP table", "Match characters"]
  },
  {
    id: 133,
    title: "Edit Distance",
    difficulty: "Hard",
    category: "Dynamic Programming",
    description: "Minimum operations to transform word.",
    examples: ["Input: 'horse', 'ros'. Output: 3"],
    hints: ["Levenshtein distance", "3 operations: insert, delete, replace"]
  },
  {
    id: 134,
    title: "Palindrome Partitioning",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "All ways to partition palindromic substrings.",
    examples: ["Input: 'nitin'. Output: all palindrome partitions"],
    hints: ["Backtracking", "Check palindromes"]
  },
  {
    id: 135,
    title: "Maximum Product Subarray",
    difficulty: "Medium",
    category: "Dynamic Programming",
    description: "Maximum product of contiguous subarray.",
    examples: ["Input: [2,3,-2,4]. Output: 6"],
    hints: ["Track max and min ending here", "Handle negative numbers"]
  },

  // 136-150: Misc / Greedy / Heap
  {
    id: 136,
    title: "Single Number",
    difficulty: "Easy",
    category: "Misc",
    description: "Find number appearing once (others twice).",
    examples: ["Input: [4,1,2,1,2]. Output: 4"],
    hints: ["XOR property: a^a=0, a^0=a"]
  },
  {
    id: 137,
    title: "Single Number II",
    difficulty: "Medium",
    category: "Misc",
    description: "Find number appearing once (others thrice).",
    examples: ["Input: [2,2,3,2]. Output: 3"],
    hints: ["Bit manipulation", "Count bits"]
  },
  {
    id: 138,
    title: "Bitwise AND of Numbers Range",
    difficulty: "Medium",
    category: "Misc",
    description: "Bitwise AND of all numbers in range.",
    examples: ["Input: left = 5, right = 7. Output: 4"],
    hints: ["Find common prefix"]
  },
  {
    id: 139,
    title: "Add Binary",
    difficulty: "Easy",
    category: "Misc",
    description: "Add two binary strings.",
    examples: ["Input: '11', '1'. Output: '100'"],
    hints: ["Convert or simulate addition"]
  },
  {
    id: 140,
    title: "Reverse Bits",
    difficulty: "Easy",
    category: "Misc",
    description: "Reverse bits of 32-bit unsigned integer.",
    examples: ["Input: 43261596. Output: 964176192"],
    hints: ["Process bits", "Build reversed number"]
  },
  {
    id: 141,
    title: "Number of 1 Bits",
    difficulty: "Easy",
    category: "Misc",
    description: "Count number of 1 bits.",
    examples: ["Input: 11 (binary: 1011). Output: 3"],
    hints: ["Brian Kernighan's algorithm", "n & (n-1)"]
  },
  {
    id: 142,
    title: "Kth Largest Element in Array",
    difficulty: "Medium",
    category: "Misc",
    description: "Find kth largest element.",
    examples: ["Input: [3,2,1,5,6,4], k = 2. Output: 5"],
    hints: ["Min heap", "QuickSelect algorithm"]
  },
  {
    id: 143,
    title: "Top K Frequent Elements",
    difficulty: "Medium",
    category: "Misc",
    description: "K most frequent elements.",
    examples: ["Input: [1,1,1,2,2,3], k = 2. Output: [1,2]"],
    hints: ["Frequency map", "Min heap or bucket sort"]
  },
  {
    id: 144,
    title: "Find Median from Data Stream",
    difficulty: "Hard",
    category: "Misc",
    description: "Find median of stream of integers.",
    examples: ["addNum(1), addNum(2), findMedian() -> 1.5"],
    hints: ["Two heaps: max and min", "Balance heap sizes"]
  },
  {
    id: 145,
    title: "Merge Intervals",
    difficulty: "Medium",
    category: "Misc",
    description: "Merge overlapping intervals.",
    examples: ["Input: [[1,3],[2,6],[8,10],[15,18]]. Output: [[1,6],[8,10],[15,18]]"],
    hints: ["Sort by start", "Merge overlapping"]
  },
  {
    id: 146,
    title: "Insert Interval",
    difficulty: "Medium",
    category: "Misc",
    description: "Insert new interval into intervals.",
    examples: ["Input: intervals, newInterval. Output: merged intervals"],
    hints: ["Add non-overlapping", "Merge overlapping"]
  },
  {
    id: 147,
    title: "Non-overlapping Intervals",
    difficulty: "Medium",
    category: "Misc",
    description: "Remove minimum intervals to make non-overlapping.",
    examples: ["Input: [[1,2],[2,3],[3,4],[1,3]]. Output: 1"],
    hints: ["Greedy: sort by end", "Remove maximum overlapping"]
  },
  {
    id: 148,
    title: "Meeting Rooms II",
    difficulty: "Medium",
    category: "Misc",
    description: "Minimum meeting rooms needed.",
    examples: ["Input: [],[1,13],[13,15]]. Output: 1"],
    hints: ["Timeline events", "Min heap or sweep line"]
  },
  {
    id: 149,
    title: "Minimum Number of Arrows to Burst Balloons",
    difficulty: "Medium",
    category: "Misc",
    description: "Minimum arrows to burst balloons.",
    examples: ["Input: [[10,16],[2,8],[1,6],[7,12]]. Output: 2"],
    hints: ["Greedy: sort by end", "Minimum arrow positions"]
  },
  {
    id: 150,
    title: "Task Scheduler",
    difficulty: "Medium",
    category: "Misc",
    description: "Minimum time to schedule tasks.",
    examples: ["Input: ['A','A','A','B','B','B'], n = 2. Output: 8"],
    hints: ["Greedy with most frequent", "Calculate idle time"]
  }
];
