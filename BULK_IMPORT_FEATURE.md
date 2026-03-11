# 📦 Bulk Import Problems Feature — CodeHire

## Overview

Add a **Bulk JSON Import** feature to the Problem Bank page so hosts can create multiple problems at once instead of one at a time.

---

## 🎨 Color Palette (Match Exactly)

| Element | Color |
|---------|-------|
| Main Background | `#0a0a0a` |
| Card / Modal Background | `#111111` or `#1a1a1a` |
| Border | `#2a2a2a` |
| Primary Green | `#22c55e` |
| Text Primary | `#ffffff` |
| Text Secondary | `#888888` |
| Easy Badge | `#22c55e` (green) |
| Medium Badge | `#eab308` (yellow) |
| Hard Badge | `#ef4444` (red) |

---

## 🖥️ UI Changes — Problem Bank Page

Add a **"⬆ Bulk Import"** button next to the existing **"+ New Custom Problem"** button:

```
[⬆ Bulk Import]   [+ New Custom Problem]
```

- Bulk Import button: dark background, green border, green text
- Matches existing button styling exactly

---

## 🪟 Bulk Import Modal UI

Open a large modal **(80% width, 80% height)** when "Bulk Import" is clicked.

### Header
```
⬆ Bulk Import Problems                    [X]
Import multiple problems at once using a JSON file
```

### Section 1 — Download Template
```
┌─────────────────────────────────────────┐
│  📄 Download JSON Template              │
│  Use our template to format your        │
│  problems correctly before importing    │
│                                         │
│  [⬇ Download Template]                  │
└─────────────────────────────────────────┘
```
- Downloads `codehire-problems-template.json`
- Template contains 2 pre-filled example problems

### Section 2 — File Upload Area
```
┌─────────────────────────────────────────┐
│                                         │
│     ☁  Drag & Drop your JSON file      │
│          or click to browse             │
│                                         │
│      Only .json files  •  Max 1MB       │
└─────────────────────────────────────────┘
```
- Drag and drop zone with **dashed green border**
- On hover: border becomes **solid green**
- After file selected: show filename + size
- Valid JSON → green checkmark ✅
- Invalid file → red error message ❌

### Section 3 — Preview Table (after valid file upload)

| # | Title | Difficulty | Category | Examples | Hidden Tests | Status |
|---|-------|------------|----------|----------|--------------|--------|
| 1 | Two Sum | Easy | Array • Hash Table | 2 | 3 | ✅ Valid |
| 2 | Reverse String | Easy | String | 1 | 2 | ✅ Valid |
| 3 | Bad Problem | - | - | 0 | 0 | ❌ Missing title |

- ✅ Valid rows → subtle **green left border**
- ❌ Invalid rows → **red left border** + red warning text
- Summary above table:
```
✅ 4 valid problems ready to import
❌ 1 problem has errors (will be skipped)
```

### Footer
```
[Cancel]                [⬆ Import 4 Problems →]
```
- Import button **disabled** if 0 valid problems
- Import button shows count of valid problems only
- On click → loading spinner → success toast

---

## 🔒 Security Validations

### Frontend Validations

```javascript
// 1. File type check
if (!file.name.endsWith('.json') || file.type !== 'application/json') {
  showError('Only .json files are allowed')
}

// 2. File size check — Max 1MB
if (file.size > 1 * 1024 * 1024) {
  showError('File too large. Maximum size is 1MB')
}

// 3. Problem count limit
if (problems.length > 50) {
  showError('Maximum 50 problems allowed per import')
}

// 4. JSON depth check
function checkDepth(obj, maxDepth = 5, depth = 0) {
  if (depth > maxDepth) throw new Error('JSON too deeply nested')
  if (typeof obj === 'object' && obj !== null) {
    Object.values(obj).forEach(v => checkDepth(v, maxDepth, depth + 1))
  }
}
```

### Per Problem Validation

```javascript
function validateProblem(problem, index) {
  const errors = []

  if (!problem.title || typeof problem.title !== 'string')
    errors.push('title is required')

  if (!['Easy', 'Medium', 'Hard'].includes(problem.difficulty))
    errors.push('difficulty must be Easy, Medium or Hard')

  if (!problem.description || typeof problem.description !== 'string')
    errors.push('description is required')

  if (problem.title?.length > 100)
    errors.push('title too long (max 100 chars)')

  if (problem.description?.length > 10000)
    errors.push('description too long (max 10000 chars)')

  if (problem.examples && !Array.isArray(problem.examples))
    errors.push('examples must be an array')

  if (problem.hiddenTestCases && !Array.isArray(problem.hiddenTestCases))
    errors.push('hiddenTestCases must be an array')

  return errors
}
```

### Input Sanitization

```bash
npm install isomorphic-dompurify
```

```javascript
import DOMPurify from 'isomorphic-dompurify'

function sanitizeProblem(problem) {
  return {
    title:           DOMPurify.sanitize(problem.title),
    description:     DOMPurify.sanitize(problem.description),
    difficulty:      DOMPurify.sanitize(problem.difficulty),
    category:        DOMPurify.sanitize(problem.category || ''),
    examples:        problem.examples        || [],
    starterCode:     problem.starterCode     || {},
    hiddenTestCases: problem.hiddenTestCases || []
  }
}
```

---

## 🔧 Backend Changes

### Rate Limiting

```javascript
import rateLimit from 'express-rate-limit'

const bulkImportLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,                    // max 5 bulk imports per hour
  message: 'Too many bulk imports. Try again after 1 hour'
})
```

### New Endpoint

```
POST /api/problems/bulk
Protected by: requireAuth + requireHostRole + bulkImportLimiter
```

```javascript
export const bulkImportProblems = async (req, res) => {
  const { problems } = req.body
  const hostId = req.user.id

  // 1. Count limit
  if (problems.length > 50) {
    return res.status(400).json({ error: 'Maximum 50 problems allowed' })
  }

  // 2. Check for duplicates
  const existingTitles = await prisma.customProblem.findMany({
    where: {
      createdBy: hostId,
      title: { in: problems.map(p => p.title) }
    },
    select: { title: true }
  })

  const duplicates  = existingTitles.map(p => p.title)
  const newProblems = problems.filter(p => !duplicates.includes(p.title))

  // 3. Save all in a single transaction
  await prisma.$transaction(async (tx) => {
    await tx.customProblem.createMany({
      data: newProblems.map(p => ({
        ...p,
        createdBy: hostId,
        isPublic: false
      }))
    })
  })

  // 4. Return summary
  return res.json({
    created:    newProblems.length,
    skipped:    duplicates.length,
    duplicates: duplicates,
    message:    `Successfully imported ${newProblems.length} problems`
  })
}
```

### Route Setup

```javascript
app.post('/api/problems/bulk',
  requireAuth,
  requireHostRole,
  bulkImportLimiter,
  bulkImportProblems
)
```

---

## 📄 JSON Template Format

The downloaded template file `codehire-problems-template.json` should contain:

```json
[
  {
    "title": "Two Sum",
    "difficulty": "Easy",
    "category": "Array • Hash Table",
    "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
    "examples": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0,1]",
        "explanation": "nums[0] + nums[1] = 9"
      }
    ],
    "starterCode": {
      "javascript": "function twoSum(nums, target) {\n  \n}",
      "python": "def twoSum(nums, target):\n    pass"
    },
    "hiddenTestCases": [
      {
        "id": 1,
        "description": "Basic case",
        "inputCode": "console.log(JSON.stringify(twoSum([2,7,11,15],9)))",
        "expectedOutput": "[0,1]"
      }
    ]
  },
  {
    "title": "Reverse String",
    "difficulty": "Easy",
    "category": "String • Two Pointers",
    "description": "Write a function that reverses a string given as an array of characters.",
    "examples": [
      {
        "input": "s = ['h','e','l','l','o']",
        "output": "['o','l','l','e','h']",
        "explanation": "Reverse the array in place"
      }
    ],
    "starterCode": {
      "javascript": "function reverseString(s) {\n  \n}",
      "python": "def reverseString(s):\n    pass"
    },
    "hiddenTestCases": [
      {
        "id": 1,
        "description": "Basic case",
        "inputCode": "import json; s=['h','e','l','l','o']; reverseString(s); print(json.dumps(s, separators=(',',':')))",
        "expectedOutput": "[\"o\",\"l\",\"l\",\"e\",\"h\"]"
      }
    ]
  }
]
```

---

## ✅ Success & Error States

### Success Toast
```
✅ Successfully imported 4 problems
   2 duplicates were skipped
```

### Error Toast
```
❌ Import failed — please check your JSON format
```

---

## 🎨 Styling Rules

| Element | Style |
|---------|-------|
| Modal background | `#111111` |
| Modal border | `#2a2a2a` |
| Upload zone border | dashed `#22c55e` |
| Upload zone hover | solid `#22c55e` + subtle glow |
| Valid row left border | `#22c55e` green |
| Invalid row left border | `#ef4444` red |
| Import button | solid `#22c55e` background |
| Cancel button | dark bg + `#2a2a2a` border |
| Table header | `#1a1a1a` background |
| Success text | `#22c55e` |
| Error text | `#ef4444` |

---

## ❌ Do NOT Change

- Navbar
- Existing problem cards
- Search bar and filter buttons
- "New Custom Problem" button or modal
- Any other existing UI elements
