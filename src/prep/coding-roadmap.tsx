"use client";

import { useState } from "react";

// ─── Data ────────────────────────────────────────────────────────────────────

type Difficulty = "Easy" | "Medium" | "Hard";

interface Problem {
  name: string;
  difficulty: Difficulty;
  leetcodeUrl?: string;
}

interface Topic {
  id: string;
  label: string;
  problems: Problem[];
  prerequisites?: string[];
  children?: string[];
}

const TOPICS: Topic[] = [
  {
    id: "arrays-hashing",
    label: "Arrays & Hashing",
    problems: [
      { name: "Contains Duplicate", difficulty: "Easy" },
      { name: "Valid Anagram", difficulty: "Easy" },
      { name: "Two Sum", difficulty: "Easy" },
      { name: "Group Anagrams", difficulty: "Medium" },
      { name: "Top K Frequent Elements", difficulty: "Medium" },
      { name: "Encode and Decode Strings", difficulty: "Medium" },
      { name: "Product of Array Except Self", difficulty: "Medium" },
      { name: "Valid Sudoku", difficulty: "Medium" },
      { name: "Longest Consecutive Sequence", difficulty: "Medium" },
    ],
    children: ["two-pointers", "stack"],
  },
  {
    id: "two-pointers",
    label: "Two Pointers",
    problems: [
      { name: "Valid Palindrome", difficulty: "Easy" },
      { name: "Two Sum II", difficulty: "Medium" },
      { name: "3Sum", difficulty: "Medium" },
      { name: "Container With Most Water", difficulty: "Medium" },
      { name: "Trapping Rain Water", difficulty: "Hard" },
    ],
    children: ["binary-search", "sliding-window"],
  },
  {
    id: "stack",
    label: "Stack",
    problems: [
      { name: "Valid Parentheses", difficulty: "Easy" },
      { name: "Min Stack", difficulty: "Medium" },
      { name: "Evaluate Reverse Polish Notation", difficulty: "Medium" },
      { name: "Generate Parentheses", difficulty: "Medium" },
      { name: "Daily Temperatures", difficulty: "Medium" },
      { name: "Car Fleet", difficulty: "Medium" },
      { name: "Largest Rectangle in Histogram", difficulty: "Hard" },
    ],
    children: ["linked-list"],
  },
  {
    id: "binary-search",
    label: "Binary Search",
    problems: [
      { name: "Binary Search", difficulty: "Easy" },
      { name: "Search a 2D Matrix", difficulty: "Medium" },
      { name: "Koko Eating Bananas", difficulty: "Medium" },
      { name: "Find Minimum in Rotated Sorted Array", difficulty: "Medium" },
      { name: "Search in Rotated Sorted Array", difficulty: "Medium" },
      { name: "Time Based Key-Value Store", difficulty: "Medium" },
      { name: "Median of Two Sorted Arrays", difficulty: "Hard" },
    ],
    children: ["trees"],
  },
  {
    id: "sliding-window",
    label: "Sliding Window",
    problems: [
      { name: "Best Time to Buy and Sell Stock", difficulty: "Easy" },
      { name: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
      { name: "Longest Repeating Character Replacement", difficulty: "Medium" },
      { name: "Permutation in String", difficulty: "Medium" },
      { name: "Minimum Window Substring", difficulty: "Hard" },
      { name: "Sliding Window Maximum", difficulty: "Hard" },
    ],
    children: ["trees"],
  },
  {
    id: "linked-list",
    label: "Linked List",
    problems: [
      { name: "Reverse Linked List", difficulty: "Easy" },
      { name: "Merge Two Sorted Lists", difficulty: "Easy" },
      { name: "Reorder List", difficulty: "Medium" },
      { name: "Remove Nth Node From End of List", difficulty: "Medium" },
      { name: "Copy List with Random Pointer", difficulty: "Medium" },
      { name: "Add Two Numbers", difficulty: "Medium" },
      { name: "Linked List Cycle", difficulty: "Easy" },
      { name: "Find the Duplicate Number", difficulty: "Medium" },
      { name: "LRU Cache", difficulty: "Medium" },
      { name: "Merge K Sorted Lists", difficulty: "Hard" },
      { name: "Reverse Nodes in K-Group", difficulty: "Hard" },
    ],
    children: ["trees"],
  },
  {
    id: "trees",
    label: "Trees",
    problems: [
      { name: "Invert Binary Tree", difficulty: "Easy" },
      { name: "Maximum Depth of Binary Tree", difficulty: "Easy" },
      { name: "Diameter of Binary Tree", difficulty: "Easy" },
      { name: "Balanced Binary Tree", difficulty: "Easy" },
      { name: "Same Tree", difficulty: "Easy" },
      { name: "Subtree of Another Tree", difficulty: "Easy" },
      { name: "Lowest Common Ancestor of BST", difficulty: "Medium" },
      { name: "Binary Tree Level Order Traversal", difficulty: "Medium" },
      { name: "Binary Tree Right Side View", difficulty: "Medium" },
      { name: "Count Good Nodes in Binary Tree", difficulty: "Medium" },
      { name: "Validate Binary Search Tree", difficulty: "Medium" },
      { name: "Kth Smallest Element in BST", difficulty: "Medium" },
      { name: "Construct Binary Tree from Preorder and Inorder", difficulty: "Medium" },
      { name: "Binary Tree Maximum Path Sum", difficulty: "Hard" },
      { name: "Serialize and Deserialize Binary Tree", difficulty: "Hard" },
    ],
    children: ["tries", "heap-priority-queue", "backtracking"],
  },
  {
    id: "tries",
    label: "Tries",
    problems: [
      { name: "Implement Trie (Prefix Tree)", difficulty: "Medium" },
      { name: "Design Add and Search Words Data Structure", difficulty: "Medium" },
      { name: "Word Search II", difficulty: "Hard" },
    ],
  },
  {
    id: "heap-priority-queue",
    label: "Heap / Priority Queue",
    problems: [
      { name: "Kth Largest Element in a Stream", difficulty: "Easy" },
      { name: "Last Stone Weight", difficulty: "Easy" },
      { name: "K Closest Points to Origin", difficulty: "Medium" },
      { name: "Kth Largest Element in an Array", difficulty: "Medium" },
      { name: "Task Scheduler", difficulty: "Medium" },
      { name: "Design Twitter", difficulty: "Medium" },
      { name: "Find Median from Data Stream", difficulty: "Hard" },
    ],
    children: ["intervals", "greedy"],
  },
  {
    id: "backtracking",
    label: "Backtracking",
    problems: [
      { name: "Subsets", difficulty: "Medium" },
      { name: "Combination Sum", difficulty: "Medium" },
      { name: "Permutations", difficulty: "Medium" },
      { name: "Subsets II", difficulty: "Medium" },
      { name: "Combination Sum II", difficulty: "Medium" },
      { name: "Word Search", difficulty: "Medium" },
      { name: "Palindrome Partitioning", difficulty: "Medium" },
      { name: "Letter Combinations of a Phone Number", difficulty: "Medium" },
      { name: "N-Queens", difficulty: "Hard" },
    ],
    children: ["graphs", "1d-dp"],
  },
  {
    id: "graphs",
    label: "Graphs",
    problems: [
      { name: "Number of Islands", difficulty: "Medium" },
      { name: "Clone Graph", difficulty: "Medium" },
      { name: "Max Area of Island", difficulty: "Medium" },
      { name: "Pacific Atlantic Water Flow", difficulty: "Medium" },
      { name: "Surrounded Regions", difficulty: "Medium" },
      { name: "Rotting Oranges", difficulty: "Medium" },
      { name: "Walls and Gates", difficulty: "Medium" },
      { name: "Course Schedule", difficulty: "Medium" },
      { name: "Course Schedule II", difficulty: "Medium" },
      { name: "Redundant Connection", difficulty: "Medium" },
      { name: "Number of Connected Components in Graph", difficulty: "Medium" },
      { name: "Graph Valid Tree", difficulty: "Medium" },
      { name: "Word Ladder", difficulty: "Hard" },
    ],
    children: ["advanced-graphs", "2d-dp"],
  },
  {
    id: "1d-dp",
    label: "1-D DP",
    problems: [
      { name: "Climbing Stairs", difficulty: "Easy" },
      { name: "Min Cost Climbing Stairs", difficulty: "Easy" },
      { name: "House Robber", difficulty: "Medium" },
      { name: "House Robber II", difficulty: "Medium" },
      { name: "Longest Palindromic Substring", difficulty: "Medium" },
      { name: "Palindromic Substrings", difficulty: "Medium" },
      { name: "Decode Ways", difficulty: "Medium" },
      { name: "Coin Change", difficulty: "Medium" },
      { name: "Maximum Product Subarray", difficulty: "Medium" },
      { name: "Word Break", difficulty: "Medium" },
      { name: "Longest Increasing Subsequence", difficulty: "Medium" },
      { name: "Partition Equal Subset Sum", difficulty: "Medium" },
    ],
    children: ["2d-dp"],
  },
  {
    id: "intervals",
    label: "Intervals",
    problems: [
      { name: "Insert Interval", difficulty: "Medium" },
      { name: "Merge Intervals", difficulty: "Medium" },
      { name: "Non Overlapping Intervals", difficulty: "Medium" },
      { name: "Meeting Rooms", difficulty: "Easy" },
      { name: "Meeting Rooms II", difficulty: "Medium" },
      { name: "Minimum Interval to Include Each Query", difficulty: "Hard" },
    ],
  },
  {
    id: "greedy",
    label: "Greedy",
    problems: [
      { name: "Maximum Subarray", difficulty: "Medium" },
      { name: "Jump Game", difficulty: "Medium" },
      { name: "Jump Game II", difficulty: "Medium" },
      { name: "Gas Station", difficulty: "Medium" },
      { name: "Hand of Straights", difficulty: "Medium" },
      { name: "Merge Triplets to Form Target Triplet", difficulty: "Medium" },
      { name: "Partition Labels", difficulty: "Medium" },
      { name: "Valid Parenthesis String", difficulty: "Medium" },
    ],
  },
  {
    id: "advanced-graphs",
    label: "Advanced Graphs",
    problems: [
      { name: "Reconstruct Itinerary", difficulty: "Hard" },
      { name: "Min Cost to Connect All Points", difficulty: "Medium" },
      { name: "Network Delay Time", difficulty: "Medium" },
      { name: "Swim in Rising Water", difficulty: "Hard" },
      { name: "Alien Dictionary", difficulty: "Hard" },
      { name: "Cheapest Flights Within K Stops", difficulty: "Medium" },
    ],
  },
  {
    id: "2d-dp",
    label: "2-D DP",
    problems: [
      { name: "Unique Paths", difficulty: "Medium" },
      { name: "Longest Common Subsequence", difficulty: "Medium" },
      { name: "Best Time to Buy and Sell Stock with Cooldown", difficulty: "Medium" },
      { name: "Coin Change II", difficulty: "Medium" },
      { name: "Target Sum", difficulty: "Medium" },
      { name: "Interleaving String", difficulty: "Medium" },
      { name: "Longest Increasing Path in Matrix", difficulty: "Hard" },
      { name: "Distinct Subsequences", difficulty: "Hard" },
      { name: "Edit Distance", difficulty: "Medium" },
      { name: "Burst Balloons", difficulty: "Hard" },
      { name: "Regular Expression Matching", difficulty: "Hard" },
    ],
    children: ["math-geometry"],
  },
  {
    id: "bit-manipulation",
    label: "Bit Manipulation",
    problems: [
      { name: "Single Number", difficulty: "Easy" },
      { name: "Number of 1 Bits", difficulty: "Easy" },
      { name: "Counting Bits", difficulty: "Easy" },
      { name: "Reverse Bits", difficulty: "Easy" },
      { name: "Missing Number", difficulty: "Easy" },
      { name: "Sum of Two Integers", difficulty: "Medium" },
      { name: "Reverse Integer", difficulty: "Medium" },
    ],
    children: ["math-geometry"],
  },
  {
    id: "math-geometry",
    label: "Math & Geometry",
    problems: [
      { name: "Rotate Image", difficulty: "Medium" },
      { name: "Spiral Matrix", difficulty: "Medium" },
      { name: "Set Matrix Zeroes", difficulty: "Medium" },
      { name: "Happy Number", difficulty: "Easy" },
      { name: "Plus One", difficulty: "Easy" },
      { name: "Pow(x, n)", difficulty: "Medium" },
      { name: "Multiply Strings", difficulty: "Medium" },
      { name: "Detect Squares", difficulty: "Medium" },
    ],
  },
];

// ─── Layout positions (col, row) for the tree ────────────────────────────────
const POSITIONS: Record<string, { col: number; row: number }> = {
  "arrays-hashing":       { col: 4, row: 0 },
  "two-pointers":         { col: 3, row: 2 },
  "stack":                { col: 5, row: 2 },
  "binary-search":        { col: 2, row: 4 },
  "sliding-window":       { col: 4, row: 4 },
  "linked-list":          { col: 6, row: 4 },
  "trees":                { col: 4, row: 6 },
  "tries":                { col: 1, row: 8 },
  "heap-priority-queue":  { col: 3, row: 8 },
  "backtracking":         { col: 6, row: 8 },
  "intervals":            { col: 1, row: 10 },
  "greedy":               { col: 3, row: 10 },
  "graphs":               { col: 5, row: 10 },
  "1d-dp":                { col: 7, row: 10 },
  "advanced-graphs":      { col: 4, row: 12 },
  "2d-dp":                { col: 6, row: 12 },
  "bit-manipulation":     { col: 8, row: 12 },
  "math-geometry":        { col: 6, row: 14 },
};

// Explicit edges
const EDGES: [string, string][] = [
  ["arrays-hashing", "two-pointers"],
  ["arrays-hashing", "stack"],
  ["two-pointers", "binary-search"],
  ["two-pointers", "sliding-window"],
  ["stack", "linked-list"],
  ["binary-search", "trees"],
  ["sliding-window", "trees"],
  ["linked-list", "trees"],
  ["trees", "tries"],
  ["trees", "heap-priority-queue"],
  ["trees", "backtracking"],
  ["heap-priority-queue", "intervals"],
  ["heap-priority-queue", "greedy"],
  ["backtracking", "graphs"],
  ["backtracking", "1d-dp"],
  ["graphs", "advanced-graphs"],
  ["graphs", "2d-dp"],
  ["1d-dp", "2d-dp"],
  ["2d-dp", "math-geometry"],
  ["backtracking", "bit-manipulation"],
  ["bit-manipulation", "math-geometry"],
];

const COL_W = 130;
const ROW_H = 90;
const NODE_W = 160;
const NODE_H = 42;
const PAD_X = 30;
const PAD_Y = 30;

function nodeCenter(id: string) {
  const p = POSITIONS[id];
  return {
    x: PAD_X + p.col * COL_W + NODE_W / 2,
    y: PAD_Y + p.row * ROW_H + NODE_H / 2,
  };
}

function nodeTopLeft(id: string) {
  const p = POSITIONS[id];
  return {
    x: PAD_X + p.col * COL_W,
    y: PAD_Y + p.row * ROW_H,
  };
}

const SVG_W = PAD_X * 2 + 9 * COL_W + NODE_W;
const SVG_H = PAD_Y * 2 + 14 * ROW_H + NODE_H + 20;

function diffColor(d: Difficulty) {
  if (d === "Easy") return "#22c55e";
  if (d === "Medium") return "#f59e0b";
  return "#ef4444";
}

export default function CodingRoadmap() {
  const [selected, setSelected] = useState<Topic | null>(null);
  const [completed, setCompleted] = useState<Record<string, Set<number>>>({});

  function toggleProblem(topicId: string, idx: number) {
    setCompleted((prev) => {
      const s = new Set(prev[topicId] ?? []);
      s.has(idx) ? s.delete(idx) : s.add(idx);
      return { ...prev, [topicId]: s };
    });
  }

  function topicProgress(t: Topic) {
    const done = completed[t.id]?.size ?? 0;
    return { done, total: t.problems.length };
  }

  const totalProblems = TOPICS.reduce((a, t) => a + t.problems.length, 0);
  const totalDone = Object.values(completed).reduce((a, s) => a + s.size, 0);

  return (
    <div style={{ fontFamily: "'Segoe UI', sans-serif", background: "#0f1117", minHeight: "100vh", color: "#e2e8f0", display: "flex", flexDirection: "column" }}>
      {/* Main Content - Combined View */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        {/* Tree SVG */}
        <div style={{ flex: 1, overflow: "auto", padding: "16px 0", borderRight: selected ? "1px solid #1e2433" : "none" }}>
          <svg width={SVG_W} height={SVG_H} style={{ display: "block" }}>
            {/* Edges */}
            {EDGES.map(([from, to]) => {
              const a = nodeCenter(from);
              const b = nodeCenter(to);
              const mx = (a.x + b.x) / 2;
              const my = (a.y + b.y) / 2;
              return (
                <path
                  key={`${from}-${to}`}
                  d={`M${a.x},${a.y + NODE_H / 2} C${a.x},${my} ${b.x},${my} ${b.x},${b.y - NODE_H / 2}`}
                  fill="none"
                  stroke="#334155"
                  strokeWidth={1.5}
                />
              );
            })}

            {/* Nodes */}
            {TOPICS.map((t) => {
              const tl = nodeTopLeft(t.id);
              const { done, total } = topicProgress(t);
              const pct = done / total;
              const isSelected = selected?.id === t.id;

              return (
                <g
                  key={t.id}
                  onClick={() => setSelected(isSelected ? null : t)}
                  style={{ cursor: "pointer" }}
                >
                  {/* Shadow / glow when selected */}
                  {isSelected && (
                    <rect
                      x={tl.x - 3} y={tl.y - 3}
                      width={NODE_W + 6} height={NODE_H + 6}
                      rx={9} ry={9}
                      fill="none"
                      stroke="#4f6ef7"
                      strokeWidth={2}
                      opacity={0.6}
                    />
                  )}
                  {/* Background */}
                  <rect
                    x={tl.x} y={tl.y}
                    width={NODE_W} height={NODE_H}
                    rx={7} ry={7}
                    fill={isSelected ? "#2a3a7c" : "#1e2a5e"}
                    stroke={isSelected ? "#4f6ef7" : "#3b4fd4"}
                    strokeWidth={1.5}
                  />
                  {/* Progress bar */}
                  {done > 0 && (
                    <rect
                      x={tl.x + 8} y={tl.y + NODE_H - 8}
                      width={(NODE_W - 16) * pct} height={4}
                      rx={2} ry={2}
                      fill="#4f6ef7"
                    />
                  )}
                  <rect
                    x={tl.x + 8} y={tl.y + NODE_H - 8}
                    width={NODE_W - 16} height={4}
                    rx={2} ry={2}
                    fill="none"
                    stroke="#334155"
                    strokeWidth={1}
                  />
                  {/* Label */}
                  <text
                    x={tl.x + NODE_W / 2}
                    y={tl.y + NODE_H / 2 - 3}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#e2e8f0"
                    fontSize={12}
                    fontWeight={600}
                  >
                    {t.label}
                  </text>
                  {/* Count */}
                  <text
                    x={tl.x + NODE_W / 2}
                    y={tl.y + NODE_H - 14}
                    textAnchor="middle"
                    fill="#64748b"
                    fontSize={9}
                  >
                    {done}/{total}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>

        {/* Panel - Problems List */}
        {selected && (
          <div style={{
            width: 380,
            background: "#0d1117",
            overflow: "auto",
            flexShrink: 0,
            display: "flex",
            flexDirection: "column",
          }}>
            {/* Panel Header */}
            <div style={{ padding: "20px 24px 16px", borderBottom: "1px solid #1e2433", background: "#0d1117", zIndex: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>{selected.label}</h2>
                <button
                  onClick={() => setSelected(null)}
                  style={{ background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 20, lineHeight: 1 }}
                >
                  ✕
                </button>
              </div>
              <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 13 }}>
                {topicProgress(selected).done} / {topicProgress(selected).total} completed
              </p>
              <div style={{ height: 4, background: "#1e2433", borderRadius: 2, marginTop: 10 }}>
                <div style={{
                  height: "100%", borderRadius: 2, background: "#4f6ef7",
                  width: `${(topicProgress(selected).done / topicProgress(selected).total) * 100}%`,
                  transition: "width 0.2s"
                }} />
              </div>
            </div>

            {/* Problem list */}
            <div style={{ padding: "12px 0", flex: 1, overflow: "auto" }}>
              {/* Header row */}
              <div style={{ display: "grid", gridTemplateColumns: "32px 1fr 80px", padding: "6px 24px", borderBottom: "1px solid #1e2433", marginBottom: 4 }}>
                <span style={{ color: "#475569", fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>✓</span>
                <span style={{ color: "#475569", fontSize: 11, fontWeight: 600, textTransform: "uppercase" }}>Problem</span>
                <span style={{ color: "#475569", fontSize: 11, fontWeight: 600, textTransform: "uppercase", textAlign: "right" }}>Difficulty</span>
              </div>
              {selected.problems.map((p, i) => {
                const done = completed[selected.id]?.has(i);
                return (
                  <div
                    key={i}
                    onClick={() => toggleProblem(selected.id, i)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "32px 1fr 80px",
                      padding: "10px 24px",
                      cursor: "pointer",
                      borderBottom: "1px solid #0f1624",
                      background: done ? "#0f1624" : "transparent",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#131b2e")}
                    onMouseLeave={e => (e.currentTarget.style.background = done ? "#0f1624" : "transparent")}
                  >
                    {/* Checkbox */}
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, border: done ? "none" : "1.5px solid #334155",
                      background: done ? "#4f6ef7" : "transparent",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {done && <span style={{ color: "#fff", fontSize: 11, fontWeight: 700 }}>✓</span>}
                    </div>
                    {/* Name */}
                    <span style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: done ? "#64748b" : "#e2e8f0",
                      textDecoration: done ? "line-through" : "none",
                      alignSelf: "center",
                    }}>
                      {p.name}
                    </span>
                    {/* Difficulty */}
                    <span style={{
                      fontSize: 12,
                      fontWeight: 600,
                      color: diffColor(p.difficulty),
                      textAlign: "right",
                      alignSelf: "center",
                    }}>
                      {p.difficulty}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Progress */}
      <div style={{ padding: "16px 24px", borderTop: "1px solid #1e2433", background: "#0f1117" }}>
        <p style={{ margin: "0 0 8px", color: "#64748b", fontSize: 13 }}>
          Overall Progress: {totalDone} / {totalProblems} problems completed
        </p>
        <div style={{ height: 6, background: "#1e2433", borderRadius: 3, maxWidth: "100%" }}>
          <div style={{ height: "100%", borderRadius: 3, background: "#4f6ef7", width: `${(totalDone / totalProblems) * 100}%`, transition: "width 0.3s" }} />
        </div>
      </div>
    </div>
  );
}
