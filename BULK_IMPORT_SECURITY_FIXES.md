# 🔒 Bulk Import Security Fixes — CodeHire

## Overview

This document covers all **10 security fixes** that must be implemented for the **Bulk JSON Import** feature in the CodeHire Problem Bank. These fixes cover file validation, size limits, count limits, depth checks, field validation, sanitization, rate limiting, duplicate detection, auth checks, and transaction safety.

---

## 🛡️ Security Fix 1 — File Type Validation

Add this validation in the frontend file upload handler **before** doing anything with the file:

```javascript
function validateFileType(file) {
  // Check 1 — file extension
  if (!file.name.endsWith('.json')) {
    throw new Error('Only .json files are allowed')
  }

  // Check 2 — MIME type
  if (file.type !== 'application/json' && file.type !== '') {
    throw new Error('Invalid file type. Please upload a JSON file')
  }

  // Check 3 — Read and verify it actually parses as JSON
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result)
        resolve(parsed)
      } catch {
        reject(new Error('File is not valid JSON. Please check the format'))
      }
    }
    reader.onerror = () => reject(new Error('Could not read file'))
    reader.readAsText(file)
  })
}
```

---

## 📦 Security Fix 2 — File Size Limit

Check file size **immediately** when file is selected before reading content:

```javascript
function validateFileSize(file) {
  const MAX_SIZE = 1 * 1024 * 1024 // 1MB in bytes

  if (file.size > MAX_SIZE) {
    throw new Error(
      `File too large. Your file is ${(file.size / 1024).toFixed(1)}KB. Maximum allowed is 1MB`
    )
  }

  if (file.size === 0) {
    throw new Error('File is empty. Please upload a valid JSON file')
  }
}
```

---

## 🔢 Security Fix 3 — Problem Count Limit

After parsing JSON check the number of problems:

```javascript
function validateProblemCount(problems) {
  const MAX_PROBLEMS = 50
  const MIN_PROBLEMS = 1

  if (!Array.isArray(problems)) {
    throw new Error('JSON must be an array of problems')
  }

  if (problems.length < MIN_PROBLEMS) {
    throw new Error('JSON file contains no problems')
  }

  if (problems.length > MAX_PROBLEMS) {
    throw new Error(
      `Too many problems. Your file has ${problems.length} problems. Maximum allowed is ${MAX_PROBLEMS}`
    )
  }
}
```

---

## 🌊 Security Fix 4 — JSON Depth Check

Prevent deeply nested malicious JSON from causing stack overflow:

```javascript
function checkJsonDepth(obj, maxDepth = 5, currentDepth = 0) {
  if (currentDepth > maxDepth) {
    throw new Error('JSON structure is too deeply nested. Maximum depth is 5 levels')
  }

  if (obj !== null && typeof obj === 'object') {
    for (const value of Object.values(obj)) {
      checkJsonDepth(value, maxDepth, currentDepth + 1)
    }
  }

  if (Array.isArray(obj)) {
    for (const item of obj) {
      checkJsonDepth(item, maxDepth, currentDepth + 1)
    }
  }
}
```

---

## ✅ Security Fix 5 — Per Problem Field Validation

Validate every single problem in the array before showing preview table:

```javascript
function validateProblem(problem, index) {
  const errors = []
  const label = `Problem ${index + 1}`

  // Required field — title
  if (!problem.title || typeof problem.title !== 'string' ||
      problem.title.trim() === '') {
    errors.push(`${label}: title is required and must be a string`)
  } else if (problem.title.length > 100) {
    errors.push(`${label}: title is too long (max 100 characters)`)
  }

  // Required field — difficulty
  const validDifficulties = ['Easy', 'Medium', 'Hard']
  if (!problem.difficulty ||
      !validDifficulties.includes(problem.difficulty)) {
    errors.push(`${label}: difficulty must be exactly 'Easy', 'Medium', or 'Hard'`)
  }

  // Required field — description
  if (!problem.description) {
    errors.push(`${label}: description is required`)
  } else if (typeof problem.description === 'object') {
    if (!problem.description.text ||
        typeof problem.description.text !== 'string') {
      errors.push(`${label}: description.text is required`)
    } else if (problem.description.text.length > 10000) {
      errors.push(`${label}: description.text is too long (max 10000 characters)`)
    }
  } else if (typeof problem.description === 'string') {
    if (problem.description.length > 10000) {
      errors.push(`${label}: description is too long (max 10000 characters)`)
    }
  }

  // Optional field — examples must be array if present
  if (problem.examples !== undefined && !Array.isArray(problem.examples)) {
    errors.push(`${label}: examples must be an array`)
  }

  // Optional field — hiddenTestCases must be array if present
  if (problem.hiddenTestCases !== undefined &&
      !Array.isArray(problem.hiddenTestCases)) {
    errors.push(`${label}: hiddenTestCases must be an array`)
  }

  // Optional field — starterCode must be object if present
  if (problem.starterCode !== undefined &&
      typeof problem.starterCode !== 'object') {
    errors.push(`${label}: starterCode must be an object`)
  }

  // Optional field — constraints must be array if present
  if (problem.constraints !== undefined &&
      !Array.isArray(problem.constraints)) {
    errors.push(`${label}: constraints must be an array`)
  }

  return errors
}

// Run validation on ALL problems
function validateAllProblems(problems) {
  const results = problems.map((problem, index) => ({
    problem,
    index,
    errors: validateProblem(problem, index),
    isValid: validateProblem(problem, index).length === 0
  }))

  return {
    valid:   results.filter(r => r.isValid),
    invalid: results.filter(r => !r.isValid),
    results
  }
}
```

---

## 🧹 Security Fix 6 — Input Sanitization

Install and use DOMPurify to sanitize all string fields before sending to backend:

```bash
npm install isomorphic-dompurify
```

```javascript
import DOMPurify from 'isomorphic-dompurify'

function sanitizeString(str) {
  if (typeof str !== 'string') return str
  return DOMPurify.sanitize(str.trim())
}

function sanitizeProblem(problem) {
  return {
    title:      sanitizeString(problem.title),
    difficulty: sanitizeString(problem.difficulty),
    category:   sanitizeString(problem.category || ''),
    description: typeof problem.description === 'object'
      ? {
          text:  sanitizeString(problem.description.text),
          notes: (problem.description.notes || []).map(sanitizeString)
        }
      : sanitizeString(problem.description),
    constraints:     (problem.constraints     || []).map(sanitizeString),
    examples:        (problem.examples        || []).map(ex => ({
      input:       sanitizeString(ex.input),
      output:      sanitizeString(ex.output),
      explanation: sanitizeString(ex.explanation || '')
    })),
    starterCode:     problem.starterCode     || {},
    hiddenTestCases: problem.hiddenTestCases || []
  }
}

function sanitizeAllProblems(problems) {
  return problems.map(sanitizeProblem)
}
```

---

## ⏱️ Security Fix 7 — Rate Limiting on Backend

Add rate limiting middleware to the bulk import endpoint:

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit'

const bulkImportLimiter = rateLimit({
  windowMs:       60 * 60 * 1000, // 1 hour window
  max:            5,               // max 5 bulk imports per hour per user
  standardHeaders: true,
  legacyHeaders:  false,
  message: {
    error: 'Too many bulk import requests. Please try again after 1 hour'
  },
  keyGenerator: (req) => req.user?.id || req.ip // rate limit per user not just IP
})
```

---

## 🔁 Security Fix 8 — Duplicate Problem Check on Backend

Before inserting check if any problem titles already exist for this host:

```javascript
async function checkDuplicates(problems, hostId) {
  const incomingTitles = problems.map(p => p.title.trim())

  // Check against database
  const existingProblems = await prisma.customProblem.findMany({
    where: {
      createdBy: hostId,
      title: { in: incomingTitles }
    },
    select: { title: true }
  })

  const duplicateTitles = existingProblems.map(p => p.title)

  // Also check for duplicates within the uploaded file itself
  const titleCounts = {}
  incomingTitles.forEach(title => {
    titleCounts[title] = (titleCounts[title] || 0) + 1
  })
  const internalDuplicates = Object.entries(titleCounts)
    .filter(([_, count]) => count > 1)
    .map(([title]) => title)

  return {
    databaseDuplicates: duplicateTitles,
    internalDuplicates: internalDuplicates,
    newProblems: problems.filter(
      p => !duplicateTitles.includes(p.title.trim())
    )
  }
}
```

---

## 🔐 Security Fix 9 — Authentication and Role Check

Make sure the bulk import endpoint is fully protected:

```javascript
// Middleware to verify user is logged in and is a host
function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized. Please log in' })
  }
  next()
}

function requireHostRole(req, res, next) {
  if (req.user.role !== 'host') {
    return res.status(403).json({
      error: 'Forbidden. Only hosts can import problems'
    })
  }
  next()
}

// Apply ALL middleware in correct order
app.post('/api/problems/bulk',
  requireAuth,          // 1. Must be logged in
  requireHostRole,      // 2. Must be a host
  bulkImportLimiter,    // 3. Rate limited
  bulkImportController  // 4. Handle request
)
```

---

## 💾 Security Fix 10 — Database Transaction Safety

Use Prisma transaction so either ALL problems save or NONE save:

```javascript
export const bulkImportController = async (req, res) => {
  try {
    const { problems } = req.body
    const hostId = req.user.id

    // Step 1 — Count limit check
    if (!problems || problems.length === 0) {
      return res.status(400).json({ error: 'No problems provided' })
    }
    if (problems.length > 50) {
      return res.status(400).json({
        error: 'Maximum 50 problems allowed per import'
      })
    }

    // Step 2 — Validate all problems
    const validationResults = problems.map((p, i) => ({
      problem: p,
      errors:  validateProblem(p, i)
    }))

    const invalidProblems = validationResults.filter(r => r.errors.length > 0)

    if (invalidProblems.length === problems.length) {
      return res.status(400).json({
        error:   'All problems failed validation',
        details: invalidProblems.map(r => r.errors)
      })
    }

    const validProblems = validationResults
      .filter(r => r.errors.length === 0)
      .map(r => r.problem)

    // Step 3 — Duplicate check
    const { databaseDuplicates, internalDuplicates, newProblems } =
      await checkDuplicates(validProblems, hostId)

    if (newProblems.length === 0) {
      return res.status(400).json({
        error:      'All problems already exist in your Problem Bank',
        duplicates: databaseDuplicates
      })
    }

    // Step 4 — Sanitize all problems
    const sanitizedProblems = sanitizeAllProblems(newProblems)

    // Step 5 — Save in single transaction
    await prisma.$transaction(async (tx) => {
      await tx.customProblem.createMany({
        data: sanitizedProblems.map(p => ({
          title:           p.title,
          difficulty:      p.difficulty,
          category:        p.category        || '',
          description:     p.description,
          constraints:     p.constraints     || [],
          examples:        p.examples        || [],
          starterCode:     p.starterCode     || {},
          hiddenTestCases: p.hiddenTestCases || [],
          createdBy:       hostId,
          isPublic:        false
        }))
      })
    })

    // Step 6 — Return detailed summary
    return res.status(200).json({
      success:            true,
      created:            newProblems.length,
      skippedDuplicates:  databaseDuplicates.length,
      skippedInvalid:     invalidProblems.length,
      internalDuplicates: internalDuplicates,
      message:            `Successfully imported ${newProblems.length} problems`
    })

  } catch (error) {
    console.error('Bulk import error:', error)
    return res.status(500).json({
      error: 'Import failed. Please try again'
    })
  }
}
```

---

## 🔗 Complete Frontend Flow — All Fixes Combined

Wire all security checks together in the **correct order** in the file upload handler:

```javascript
async function handleFileUpload(file) {
  try {
    // Fix 2 — Size check first (cheapest check)
    validateFileSize(file)

    // Fix 1 — File type check
    const parsedJSON = await validateFileType(file)

    // Fix 3 — Problem count check
    validateProblemCount(parsedJSON)

    // Fix 4 — JSON depth check
    checkJsonDepth(parsedJSON)

    // Fix 5 — Per problem validation
    const { valid, invalid, results } = validateAllProblems(parsedJSON)

    // Show preview table with results
    showPreviewTable(results)

    // Store valid sanitized problems ready for import button
    const sanitized = sanitizeAllProblems(valid.map(r => r.problem))
    setValidProblems(sanitized)

    // Update import button count
    setImportCount(valid.length)

  } catch (error) {
    // Show error message in upload zone
    showUploadError(error.message)
  }
}
```

---

## 🎨 Error State Styling — Match CodeHire Dark Theme

| Error Type | Style |
|------------|-------|
| File type error | Red border on upload zone + red error text below |
| File size error | Red border on upload zone + shows actual file size |
| Count limit error | Red banner above preview table |
| Validation errors | Red left border on invalid rows in preview table |
| Rate limit error | Red toast notification at top of screen |
| Duplicate warning | Yellow warning badge on duplicate rows |

---

## 📋 Security Fix Priority Order

| Priority | Fix | Reason |
|----------|-----|--------|
| 🔴 Critical | Fix 1 — File Type Validation | Prevents malicious file uploads |
| 🔴 Critical | Fix 2 — File Size Limit | Prevents server overload |
| 🔴 Critical | Fix 6 — Input Sanitization | Prevents XSS attacks |
| 🔴 Critical | Fix 9 — Auth Check | Prevents unauthorized access |
| 🟡 Important | Fix 3 — Count Limit | Prevents database flooding |
| 🟡 Important | Fix 5 — Field Validation | Prevents corrupt data |
| 🟡 Important | Fix 7 — Rate Limiting | Prevents spam imports |
| 🟡 Important | Fix 10 — Transaction Safety | Prevents partial data saves |
| 🟢 Nice to Have | Fix 4 — Depth Check | Prevents stack overflow edge case |
| 🟢 Nice to Have | Fix 8 — Duplicate Check | Prevents cluttered problem bank |

---

## ❌ Do NOT Change

- Existing single problem creation modal
- Problem Bank card grid
- Navbar, search bar, filter buttons
- Any other existing features outside of bulk import
