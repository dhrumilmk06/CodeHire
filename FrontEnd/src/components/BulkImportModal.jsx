import { useState, useRef } from "react";
import { X, Download, Upload, Check, AlertCircle, Loader2, FileJson } from "lucide-react";
import DOMPurify from 'isomorphic-dompurify';
import axios from 'axios';
import toast from "react-hot-toast";

// ─────────────────────────────────────────────────────────────────────────────
// FIELD GUIDE — injected as the first entry so users see it when they open the
// template. Fields marked [REQUIRED] MUST be present. [OPTIONAL] fields can be
// omitted entirely and CodeHire will use safe defaults.
// ─────────────────────────────────────────────────────────────────────────────
const FIELD_GUIDE = {
  "_READ_THIS_FIRST": "Delete this guide object before importing. It is here only to explain each field.",

  "title": "[REQUIRED] string — Problem title. Max 100 characters. Must be unique in your problem bank.",
  "difficulty": "[REQUIRED] string — Must be exactly one of: 'Easy', 'Medium', or 'Hard'.",
  "description": {
    "_note": "[REQUIRED] Object with two sub-fields below.",
    "text": "[REQUIRED] string — The main problem statement. Max 10,000 characters.",
    "notes": "[OPTIONAL] array of strings — Extra hints, clarifications, or edge-case notes shown below the main description. Can be an empty array []."
  },

  "category": "[OPTIONAL] string — Topic tags shown on the problem card, e.g. 'Array • Hash Table'. Leave as '' if not needed.",
  "constraints": "[OPTIONAL] array of strings — Problem constraints shown to the candidate, e.g. ['1 <= n <= 10^4']. Can be [].",
  "examples": {
    "_note": "[OPTIONAL] array — Worked examples shown to the candidate in the problem description.",
    "input": "[REQUIRED inside each example] string",
    "output": "[REQUIRED inside each example] string",
    "explanation": "[OPTIONAL inside each example] string"
  },

  "starterCode": {
    "_note": "[OPTIONAL] object — Boilerplate code shown to the candidate in the editor. Only include languages you want to support. Leave out any language key to show an empty editor for that language.",
    "javascript": "[OPTIONAL] string",
    "python": "[OPTIONAL] string",
    "java": "[OPTIONAL] string",
    "cpp": "[OPTIONAL] string"
  },

  "expectedOutput": {
    "_note": "[OPTIONAL] object — The expected output used for quick-run checking in the editor. Only needed for languages you provide starter code for.",
    "javascript": "[OPTIONAL] string",
    "python": "[OPTIONAL] string",
    "java": "[OPTIONAL] string",
    "cpp": "[OPTIONAL] string"
  },

  "hiddenTestCases": {
    "_note": "[OPTIONAL] array — Secret test cases used for automated scoring. Each entry must have the fields below.",
    "id": "[REQUIRED inside each test case] number — Unique ID, e.g. 1, 2, 3.",
    "description": "[REQUIRED inside each test case] string — A short label like 'Large input test'.",
    "inputCode": {
      "_note": "[REQUIRED inside each test case] object — Per-language driver code that calls the solution and prints the output. Only include keys for the languages you support.",
      "javascript": "[OPTIONAL] string — e.g. console.log(JSON.stringify(solve(args)));",
      "python": "[OPTIONAL] string — e.g. import json; print(json.dumps(solve(args)))",
      "java": "[OPTIONAL] string — e.g. System.out.println(new Solution().solve(args));",
      "cpp": "[OPTIONAL] string — e.g. Solution sol; cout << sol.solve(args) << endl;"
    },
    "expectedOutput": "[REQUIRED inside each test case] string — The exact stdout the driver code must produce for the test to pass."
  }
};

const TEMPLATE_DATA = [
  // ── PROBLEM 1 — Two Sum (demonstrates all fields including optional ones) ──
  {
    // [REQUIRED] Unique title — max 100 chars
    "title": "Two Sum",
    // [REQUIRED] Exactly "Easy", "Medium", or "Hard"
    "difficulty": "Easy",
    // [OPTIONAL] Topic tags shown on the card
    "category": "Array • Hash Table",

    // [REQUIRED] Description object
    "description": {
      // [REQUIRED] Main problem statement
      "text": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
      // [OPTIONAL] Additional hints or clarifications shown below the main text
      "notes": [
        "You can return the answer in any order.",
        "Consider using a hash map for an O(n) solution.",
        "Do not reuse the same element — nums[i] + nums[i] is not allowed."
      ]
    },

    // [OPTIONAL] Constraints shown to the candidate
    "constraints": [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "Only one valid answer exists"
    ],

    // [OPTIONAL] Worked examples shown in the problem panel
    "examples": [
      {
        "input": "nums = [2,7,11,15], target = 9",
        "output": "[0,1]",
        // [OPTIONAL] explanation inside each example
        "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        "input": "nums = [3,2,4], target = 6",
        "output": "[1,2]",
        "explanation": "Because nums[1] + nums[2] == 6, we return [1, 2]."
      }
    ],

    // [OPTIONAL] Starter code shown in the editor — omit any language to leave it blank
    "starterCode": {
      "javascript": "function twoSum(nums, target) {\n  // Write your solution here\n}",
      "python": "def twoSum(nums, target):\n    # Write your solution here\n    pass",
      "java": "import java.util.*;\n\nclass Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Write your solution here\n        return new int[]{};\n    }\n}",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        // Write your solution here\n        return {};\n    }\n};"
    },

    // [OPTIONAL] Expected output per language for quick-run checking
    "expectedOutput": {
      "javascript": "[0,1]",
      "python": "[0, 1]",
      "java": "[0, 1]",
      "cpp": "[0, 1]"
    },

    // [OPTIONAL] Hidden test cases for automated scoring
    "hiddenTestCases": [
      {
        "id": 1,
        "description": "Basic case — [2,7,11,15] target=9",
        // Per-language driver code — only include languages you support
        "inputCode": {
          "javascript": "console.log(JSON.stringify(twoSum([2,7,11,15],9)));",
          "python": "import json\nprint(json.dumps(twoSum([2,7,11,15],9), separators=(',',':')))",
          "java": "Solution sol = new Solution();\nint[] nums = {2,7,11,15};\nint[] result = sol.twoSum(nums, 9);\nSystem.out.println(Arrays.toString(result));",
          "cpp": "Solution sol;\nvector<int> nums = {2,7,11,15};\nvector<int> result = sol.twoSum(nums, 9);\ncout << \"[\" << result[0] << \", \" << result[1] << \"]\" << endl;"
        },
        // Exact stdout the driver must produce
        "expectedOutput": "[0, 1]"
      },
      {
        "id": 2,
        "description": "Second case — [3,2,4] target=6",
        "inputCode": {
          "javascript": "console.log(JSON.stringify(twoSum([3,2,4],6)));",
          "python": "import json\nprint(json.dumps(twoSum([3,2,4],6), separators=(',',':')))",
          "java": "Solution sol = new Solution();\nint[] nums = {3,2,4};\nint[] result = sol.twoSum(nums, 6);\nSystem.out.println(Arrays.toString(result));",
          "cpp": "Solution sol;\nvector<int> nums = {3,2,4};\nvector<int> result = sol.twoSum(nums, 6);\ncout << \"[\" << result[0] << \", \" << result[1] << \"]\" << endl;"
        },
        "expectedOutput": "[1, 2]"
      }
    ]
  },

  // ── PROBLEM 2 — Reverse String (shows minimal required fields only) ────────
  {
    "title": "Reverse String",
    "difficulty": "Easy",
    "category": "String • Two Pointers",  // [OPTIONAL] — remove this line if not needed

    "description": {
      "text": "Write a function that reverses a string. The input string is given as an array of characters s. You must do this by modifying the input array in-place with O(1) extra memory.",
      "notes": [
        "Do not allocate extra space for another array.",
        "Modifying the array in place means you should swap characters without creating a new array."
      ]
    },

    "constraints": [  // [OPTIONAL]
      "1 <= s.length <= 10^5",
      "s[i] is a printable ASCII character"
    ],

    "examples": [  // [OPTIONAL]
      {
        "input": "s = ['h','e','l','l','o']",
        "output": "['o','l','l','e','h']",
        "explanation": "Reverse the characters array in place."  // [OPTIONAL inside example]
      }
    ],

    "starterCode": {  // [OPTIONAL]
      "javascript": "function reverseString(s) {\n  // Modify s in-place, no return needed\n}",
      "python": "def reverseString(s):\n    # Modify s in-place, no return needed\n    pass",
      "java": "class Solution {\n    public void reverseString(char[] s) {\n        // Modify s in-place, no return needed\n    }\n}",
      "cpp": "#include <bits/stdc++.h>\nusing namespace std;\n\nclass Solution {\npublic:\n    void reverseString(vector<char>& s) {\n        // Modify s in-place, no return needed\n    }\n};"
    },

    "expectedOutput": {  // [OPTIONAL]
      "javascript": "[\"o\",\"l\",\"l\",\"e\",\"h\"]",
      "python": "[\"o\",\"l\",\"l\",\"e\",\"h\"]",
      "java": "[o, l, l, e, h]",
      "cpp": "o l l e h"
    },

    "hiddenTestCases": [  // [OPTIONAL]
      {
        "id": 1,
        "description": "Basic case — ['h','e','l','l','o']",
        "inputCode": {
          "javascript": "let s = ['h','e','l','l','o'];\nreverseString(s);\nconsole.log(JSON.stringify(s));",
          "python": "import json\ns = ['h','e','l','l','o']\nreverseString(s)\nprint(json.dumps(s, separators=(',',':')))",
          "java": "Solution sol = new Solution();\nchar[] s = {'h','e','l','l','o'};\nsol.reverseString(s);\nSystem.out.println(Arrays.toString(s));",
          "cpp": "Solution sol;\nvector<char> s = {'h','e','l','l','o'};\nsol.reverseString(s);\nfor (char c : s) cout << c << ' ';\ncout << endl;"
        },
        "expectedOutput": "[\"o\",\"l\",\"l\",\"e\",\"h\"]"
      }
    ]
  }
];

// The guide is bundled as a comment at the top of the downloaded file
const TEMPLATE_FILE_DATA = [FIELD_GUIDE, ...TEMPLATE_DATA];

export function BulkImportModal({ onClose, onRefresh }) {
    const [file, setFile] = useState(null);
    const [problems, setProblems] = useState([]);
    const [errors, setErrors] = useState([]);
    const [isImporting, setIsImporting] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const fileInputRef = useRef(null);

    const downloadTemplate = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(TEMPLATE_FILE_DATA, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "codehire-problems-template.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const validateProblem = (problem) => {
        const errs = [];
        if (!problem.title || typeof problem.title !== 'string') errs.push('title is required');
        if (!['Easy', 'Medium', 'Hard'].includes(problem.difficulty)) errs.push('difficulty must be Easy, Medium or Hard');
        if (!problem.description || (typeof problem.description !== 'string' && typeof problem.description !== 'object')) errs.push('description is required');
        if (problem.title?.length > 100) errs.push('title too long (max 100 chars)');
        
        // Handle both string and object description
        const descLen = typeof problem.description === 'string' ? problem.description.length : JSON.stringify(problem.description).length;
        if (descLen > 10000) errs.push('description too long (max 10000 chars)');

        if (problem.examples && !Array.isArray(problem.examples)) errs.push('examples must be an array');
        if (problem.hiddenTestCases && !Array.isArray(problem.hiddenTestCases)) errs.push('hiddenTestCases must be an array');
        return errs;
    };

    const sanitizeProblem = (problem) => {
        // If description is string, convert it to the expected format { text: "..." }
        let description = problem.description;
        if (typeof description === 'string') {
            description = { text: DOMPurify.sanitize(description), notes: [] };
        } else if (typeof description === 'object') {
            description = {
                text: DOMPurify.sanitize(description.text || ""),
                notes: (description.notes || []).map(n => DOMPurify.sanitize(n))
            };
        }

        return {
            title: DOMPurify.sanitize(problem.title),
            difficulty: problem.difficulty,
            category: DOMPurify.sanitize(problem.category || ""),
            description: description,
            examples: problem.examples || [],
            starterCode: problem.starterCode || {},
            hiddenTestCases: problem.hiddenTestCases || [],
            constraints: problem.constraints || []
        };
    };

    const handleFile = async (selectedFile) => {
        if (!selectedFile) return;

        if (!selectedFile.name.endsWith('.json')) {
            toast.error('Only .json files are allowed');
            return;
        }

        if (selectedFile.size > 1 * 1024 * 1024) {
            toast.error('File too large. Maximum size is 1MB');
            return;
        }

        setFile(selectedFile);
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const json = JSON.parse(e.target.result);
                if (!Array.isArray(json)) {
                    throw new Error("JSON must be an array of problems");
                }
                if (json.length > 50) {
                    throw new Error("Maximum 50 problems allowed per import");
                }

                const validated = json.map((p, idx) => {
                    const pErrors = validateProblem(p);
                    return {
                        original: p,
                        errors: pErrors,
                        isValid: pErrors.length === 0,
                        id: idx + 1
                    };
                });

                setProblems(validated);
            } catch (err) {
                toast.error("Invalid JSON format: " + err.message);
                setFile(null);
                setProblems([]);
            }
        };
        reader.readAsText(selectedFile);
    };

    const handleImport = async () => {
        const validProblems = problems.filter(p => p.isValid).map(p => sanitizeProblem(p.original));
        if (validProblems.length === 0) return;

        setIsImporting(true);
        try {
            const response = await axios.post('/api/problems/bulk', { problems: validProblems });
            toast.success(response.data.message);
            if (response.data.skipped > 0) {
                toast(`${response.data.skipped} duplicates were skipped`, { icon: 'ℹ️' });
            }
            onRefresh();
            onClose();
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Import failed — please check your JSON format");
        } finally {
            setIsImporting(false);
        }
    };

    const onDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const validCount = problems.filter(p => p.isValid).length;
    const invalidCount = problems.length - validCount;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
            <div className="bg-[#111111] border border-[#2a2a2a] rounded-xl w-full max-w-5xl h-[85vh] flex flex-col shadow-2xl animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-[#2a2a2a] flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <Upload className="w-5 h-5 text-[#22c55e]" />
                            Bulk Import Problems
                        </h2>
                        <p className="text-[#888888] text-sm">Import multiple problems at once using a JSON file</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-[#1a1a1a] rounded-lg transition-colors text-[#888888] hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Section 1 - Download Template */}
                    <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-6 flex items-center justify-between">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 bg-[#22c55e]/10 rounded-xl flex items-center justify-center shrink-0">
                                <FileJson className="w-6 h-6 text-[#22c55e]" />
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Download JSON Template</h3>
                                <p className="text-[#888888] text-sm max-w-md">
                                    Use our template to format your problems correctly before importing. 
                                    Ensures all required fields like title, difficulty, and test cases are present.
                                </p>
                            </div>
                        </div>
                        <button 
                            onClick={downloadTemplate}
                            className="btn bg-[#1a1a1a] hover:bg-[#22c55e]/10 border-[#2a2a2a] hover:border-[#22c55e] text-[#22c55e] gap-2 transition-all duration-300 shadow-sm"
                        >
                            <Download className="w-4 h-4" />
                            Download Template
                        </button>
                    </div>

                    {/* Section 2 - Upload Area */}
                    <div 
                        onDragEnter={onDrag}
                        onDragLeave={onDrag}
                        onDragOver={onDrag}
                        onDrop={onDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`
                            relative border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer
                            ${dragActive ? 'border-[#22c55e] bg-[#22c55e]/5' : 'border-[#2a2a2a] hover:border-[#22c55e] hover:bg-[#22c55e]/5'}
                        `}
                    >
                        <input 
                            ref={fileInputRef}
                            type="file" 
                            accept=".json"
                            onChange={(e) => handleFile(e.target.files?.[0])}
                            className="hidden" 
                        />
                        
                        {file ? (
                          <div className="flex flex-col items-center animate-in slide-in-from-bottom-2 duration-300">
                             <div className="w-16 h-16 bg-[#22c55e]/20 rounded-full flex items-center justify-center mb-2">
                                <Check className="w-8 h-8 text-[#22c55e]" />
                             </div>
                             <p className="text-white font-medium">{file.name}</p>
                             <p className="text-[#888888] text-xs">{(file.size / 1024).toFixed(1)} KB • Ready to check</p>
                          </div>
                        ) : (
                          <>
                             <div className="w-16 h-16 bg-[#2a2a2a] rounded-full flex items-center justify-center mb-2">
                                <Upload className="w-8 h-8 text-[#888888]" />
                             </div>
                             <p className="text-white font-medium">Drag & Drop your JSON file or click to browse</p>
                             <p className="text-[#888888] text-xs">Only .json files • Max 1MB</p>
                          </>
                        )}
                    </div>

                    {/* Section 3 - Preview Table */}
                    {problems.length > 0 && (
                        <div className="space-y-4 animate-in fade-in duration-500">
                            <div className="flex items-center justify-between">
                                <h3 className="text-white font-semibold flex items-center gap-2">
                                    Preview Problems
                                    <span className="text-xs bg-[#2a2a2a] text-[#888888] px-2 py-0.5 rounded-full">{problems.length} Total</span>
                                </h3>
                                <div className="flex gap-4 text-sm">
                                    <span className="flex items-center gap-1.5 text-[#22c55e]">
                                        <Check className="w-4 h-4" /> {validCount} valid Problems
                                    </span>
                                    {invalidCount > 0 && (
                                        <span className="flex items-center gap-1.5 text-[#ef4444]">
                                            <AlertCircle className="w-4 h-4" /> {invalidCount} with errors (will be skipped)
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="border border-[#2a2a2a] rounded-xl overflow-hidden bg-[#161616]">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead className="bg-[#1a1a1a] text-[#ffffff] font-medium border-b border-[#2a2a2a]">
                                        <tr>
                                            <th className="p-4 w-12 text-center">#</th>
                                            <th className="p-4">Title</th>
                                            <th className="p-4">Difficulty</th>
                                            <th className="p-4">Category</th>
                                            <th className="p-4 text-center">Tests</th>
                                            <th className="p-4">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#2a2a2a]">
                                        {problems.map((p) => (
                                            <tr key={p.id} className={`hover:bg-[#1a1a1a]/50 transition-colors ${p.isValid ? 'border-l-2 border-l-[#22c55e]' : 'border-l-2 border-l-[#ef4444]'}`}>
                                                <td className="p-4 text-[#888888] text-center font-mono">{p.id}</td>
                                                <td className="p-4 font-medium text-white">{p.original.title || <span className="text-[#ef4444]">Missing title</span>}</td>
                                                <td className="p-4">
                                                    {p.original.difficulty ? (
                                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase
                                                            ${p.original.difficulty === 'Easy' ? 'bg-[#22c55e]/10 text-[#22c55e]' : 
                                                              p.original.difficulty === 'Medium' ? 'bg-[#eab308]/10 text-[#eab308]' : 
                                                              'bg-[#ef4444]/10 text-[#ef4444]'}
                                                        `}>
                                                            {p.original.difficulty}
                                                        </span>
                                                    ) : '-'}
                                                </td>
                                                <td className="p-4 text-[#888888]">{p.original.category || '-'}</td>
                                                <td className="p-4 text-center font-mono text-[#888888]">
                                                    {p.original.hiddenTestCases?.length || 0}
                                                </td>
                                                <td className="p-4">
                                                    {p.isValid ? (
                                                        <span className="flex items-center gap-1 text-[#22c55e]">
                                                            <Check className="w-4 h-4" /> Valid
                                                        </span>
                                                    ) : (
                                                        <span className="flex items-center gap-1 text-[#ef4444] group relative cursor-help">
                                                            <AlertCircle className="w-4 h-4" />
                                                            Invalid
                                                            <div className="absolute bottom-full left-0 mb-2 invisible group-hover:visible bg-[#1a1a1a] border border-[#2a2a2a] p-2 rounded shadow-xl z-10 w-48 text-[10px] text-white">
                                                                {p.errors.join(', ')}
                                                            </div>
                                                        </span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-[#2a2a2a] flex justify-end gap-3 bg-[#111111]">
                    <button 
                        onClick={onClose}
                        className="btn bg-[#1a1a1a] hover:bg-[#22c55e]/10 border-[#2a2a2a] hover:border-[#22c55e]/20 text-white transition-all duration-300"
                    >
                        Cancel
                    </button>
                    <button 
                        disabled={validCount === 0 || isImporting}
                        onClick={handleImport}
                        className="btn bg-[#22c55e] hover:bg-[#16a34a] border-none text-[#0a0a0a] font-bold gap-2 px-8 shadow-lg shadow-[#22c55e]/20 disabled:bg-[#2a2a2a] disabled:text-[#888888] disabled:cursor-not-allowed transition-all duration-300"
                    >
                        {isImporting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Importing...
                            </>
                        ) : (
                            <>
                                <Upload className="w-4 h-4" />
                                Import {validCount} Problems
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
