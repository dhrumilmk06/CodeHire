import { useState } from "react";
import { Plus, Pencil, Trash2, Search, Lock, X, Check } from "lucide-react";
import { BookOpenIcon, CodeIcon, Loader2Icon } from "lucide-react";
import { useMyProblems, useCreateProblem, useUpdateProblem, useDeleteProblem } from "../hooks/useCustomProblems";
import { PROBLEMS } from "../data/problems";
import toast from "react-hot-toast";

// ── Helpers ─────────────────────────────────────────────────────────────────
const DIFFICULTY_COLORS = {
    Easy: "badge-success",
    Medium: "badge-warning",
    Hard: "badge-error",
};

const EMPTY_FORM = {
    title: "",
    difficulty: "Easy",
    category: "",
    description: { text: "", notes: [] },
    examples: [{ input: "", output: "", explanation: "" }],
    constraints: [],
    starterCode: { javascript: "", python: "", java: "" },
    expectedOutput: { javascript: "", python: "", java: "" },
};

const BUILT_IN_LIST = Object.values(PROBLEMS);

// ── Reusable Tag-style text input ────────────────────────────────────────────
function TagInput({ label, values, onChange, placeholder }) {
    const [draft, setDraft] = useState("");
    const add = () => {
        if (!draft.trim()) return;
        onChange([...values, draft.trim()]);
        setDraft("");
    };
    return (
        <div className="space-y-2">
            <label className="label-text font-semibold">{label}</label>
            <div className="flex gap-2">
                <input
                    className="input input-sm input-bordered flex-1"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
                    placeholder={placeholder}
                />
                <button type="button" className="btn btn-sm btn-primary" onClick={add}>Add</button>
            </div>
            <div className="flex flex-wrap gap-2 mt-1">
                {values.map((v, i) => (
                    <span key={i} className="badge badge-outline gap-1">
                        {v}
                        <button type="button" onClick={() => onChange(values.filter((_, j) => j !== i))}>
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}
            </div>
        </div>
    );
}

// ── Problem Form Modal ───────────────────────────────────────────────────────
function ProblemFormModal({ initial, onClose, onSave, isSaving }) {
    const [form, setForm] = useState(initial || EMPTY_FORM);
    const [tab, setTab] = useState("basic"); // basic | examples | code

    const set = (path, val) => {
        const keys = path.split(".");
        setForm((prev) => {
            const copy = structuredClone(prev);
            let cur = copy;
            for (let i = 0; i < keys.length - 1; i++) cur = cur[keys[i]];
            cur[keys[keys.length - 1]] = val;
            return copy;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.title.trim()) return toast.error("Title is required");
        if (!form.description.text.trim()) return toast.error("Description is required");
        onSave(form);
    };

    return (
        <div className="modal modal-open">
            <div className="modal-box max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-2xl">{initial ? "Edit Problem" : "Create Custom Problem"}</h3>
                    <button className="btn btn-ghost btn-sm btn-circle" onClick={onClose}><X /></button>
                </div>

                {/* Tabs */}
                <div className="tabs tabs-boxed mb-6">
                    {["basic", "examples", "code"].map((t) => (
                        <button key={t} className={`tab capitalize ${tab === t ? "tab-active" : ""}`} onClick={() => setTab(t)}>
                            {t}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* ── BASIC ─────────────────────────────────────────────────── */}
                    {tab === "basic" && (
                        <div className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 space-y-1">
                                    <label className="label-text font-semibold">Title *</label>
                                    <input
                                        className="input input-bordered w-full"
                                        value={form.title}
                                        onChange={(e) => set("title", e.target.value)}
                                        placeholder="e.g. Binary Search"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="label-text font-semibold">Difficulty *</label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={form.difficulty}
                                        onChange={(e) => set("difficulty", e.target.value)}
                                    >
                                        <option>Easy</option>
                                        <option>Medium</option>
                                        <option>Hard</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="label-text font-semibold">Category</label>
                                    <input
                                        className="input input-bordered w-full"
                                        value={form.category}
                                        onChange={(e) => set("category", e.target.value)}
                                        placeholder="e.g. Array • Binary Search"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="label-text font-semibold">Description *</label>
                                <textarea
                                    className="textarea textarea-bordered w-full h-24"
                                    value={form.description.text}
                                    onChange={(e) => set("description.text", e.target.value)}
                                    placeholder="Problem statement..."
                                />
                            </div>

                            <TagInput
                                label="Description Notes (optional hints/clarifications)"
                                values={form.description.notes}
                                onChange={(v) => set("description.notes", v)}
                                placeholder="Add a note and press Enter..."
                            />

                            <TagInput
                                label="Constraints"
                                values={form.constraints}
                                onChange={(v) => set("constraints", v)}
                                placeholder="e.g. 1 ≤ n ≤ 10⁴"
                            />
                        </div>
                    )}

                    {/* ── EXAMPLES ──────────────────────────────────────────────── */}
                    {tab === "examples" && (
                        <div className="space-y-4">
                            {form.examples.map((ex, i) => (
                                <div key={i} className="card bg-base-200 p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold">Example {i + 1}</span>
                                        <button
                                            type="button"
                                            className="btn btn-ghost btn-xs text-error"
                                            disabled={form.examples.length === 1}
                                            onClick={() => set("examples", form.examples.filter((_, j) => j !== i))}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                    <input
                                        className="input input-bordered input-sm w-full"
                                        value={ex.input}
                                        onChange={(e) => {
                                            const exs = [...form.examples];
                                            exs[i] = { ...exs[i], input: e.target.value };
                                            set("examples", exs);
                                        }}
                                        placeholder="Input: nums = [2,7,11,15], target = 9"
                                    />
                                    <input
                                        className="input input-bordered input-sm w-full"
                                        value={ex.output}
                                        onChange={(e) => {
                                            const exs = [...form.examples];
                                            exs[i] = { ...exs[i], output: e.target.value };
                                            set("examples", exs);
                                        }}
                                        placeholder="Output: [0,1]"
                                    />
                                    <input
                                        className="input input-bordered input-sm w-full"
                                        value={ex.explanation}
                                        onChange={(e) => {
                                            const exs = [...form.examples];
                                            exs[i] = { ...exs[i], explanation: e.target.value };
                                            set("examples", exs);
                                        }}
                                        placeholder="Explanation (optional)"
                                    />
                                </div>
                            ))}
                            <button
                                type="button"
                                className="btn btn-outline btn-sm gap-2"
                                onClick={() => set("examples", [...form.examples, { input: "", output: "", explanation: "" }])}
                            >
                                <Plus className="w-4 h-4" /> Add Example
                            </button>
                        </div>
                    )}

                    {/* ── CODE ──────────────────────────────────────────────────── */}
                    {tab === "code" && (
                        <div className="space-y-5">
                            {["javascript", "python", "java"].map((lang) => (
                                <div key={lang} className="space-y-2">
                                    <label className="label-text font-semibold capitalize">{lang} Starter Code</label>
                                    <textarea
                                        className="textarea textarea-bordered w-full h-36 font-mono text-sm"
                                        value={form.starterCode[lang]}
                                        onChange={(e) => set(`starterCode.${lang}`, e.target.value)}
                                        placeholder={`// ${lang} starter code...`}
                                    />
                                    <label className="label-text font-semibold capitalize">{lang} Expected Output</label>
                                    <input
                                        className="input input-bordered input-sm w-full font-mono"
                                        value={form.expectedOutput[lang]}
                                        onChange={(e) => set(`expectedOutput.${lang}`, e.target.value)}
                                        placeholder="Expected output (line-separated)..."
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Action buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t border-base-300">
                        <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn btn-primary gap-2" disabled={isSaving}>
                            {isSaving ? <Loader2Icon className="size-4 animate-spin" /> : <Check className="size-4" />}
                            {initial ? "Save Changes" : "Create Problem"}
                        </button>
                    </div>
                </form>
            </div>
            <div className="modal-backdrop" onClick={onClose} />
        </div>
    );
}

// ── Problem Card ─────────────────────────────────────────────────────────────
function ProblemCard({ problem, isCustom, onEdit, onDelete, isDeleting }) {
    return (
        <div className="card bg-base-100 border border-base-300 hover:border-primary/40 hover:shadow-lg transition-all duration-200 group">
            <div className="card-body p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`badge badge-sm ${DIFFICULTY_COLORS[problem.difficulty]}`}>
                                {problem.difficulty}
                            </span>
                            {isCustom && (
                                <span className="badge badge-sm badge-outline badge-primary gap-1">
                                    <Lock className="w-2.5 h-2.5" /> Custom
                                </span>
                            )}
                        </div>
                        <h3 className="font-bold text-base truncate">{problem.title}</h3>
                        {problem.category && (
                            <p className="text-xs text-base-content/50 mt-0.5">{problem.category}</p>
                        )}
                    </div>

                    {isCustom && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                            <button
                                className="btn btn-ghost btn-xs"
                                onClick={() => onEdit(problem)}
                                title="Edit"
                            >
                                <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                                className="btn btn-ghost btn-xs text-error"
                                onClick={() => onDelete(problem._id)}
                                disabled={isDeleting}
                                title="Delete"
                            >
                                {isDeleting ? <Loader2Icon className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                            </button>
                        </div>
                    )}
                </div>

                {problem.description?.text && (
                    <p className="text-xs text-base-content/60 line-clamp-2 mt-1">
                        {problem.description.text}
                    </p>
                )}
            </div>
        </div>
    );
}

// ── Main Page ────────────────────────────────────────────────────────────────
export const ProblemBankPage = () => {
    const { data: customProblems = [], isLoading } = useMyProblems();
    const createMutation = useCreateProblem();
    const updateMutation = useUpdateProblem();
    const deleteMutation = useDeleteProblem();

    const [search, setSearch] = useState("");
    const [diffFilter, setDiffFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All"); // All | Built-in | Custom
    const [showForm, setShowForm] = useState(false);
    const [editingProblem, setEditingProblem] = useState(null);

    // Merge both lists
    const builtInWithMeta = BUILT_IN_LIST.map((p) => ({ ...p, _isCustom: false }));
    const customWithMeta = customProblems.map((p) => ({ ...p, _isCustom: true }));
    const all = [...builtInWithMeta, ...customWithMeta];

    const filtered = all.filter((p) => {
        const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
            (p.category || "").toLowerCase().includes(search.toLowerCase());
        const matchDiff = diffFilter === "All" || p.difficulty === diffFilter;
        const matchType = typeFilter === "All" || (typeFilter === "Custom" ? p._isCustom : !p._isCustom);
        return matchSearch && matchDiff && matchType;
    });

    const handleSave = async (formData) => {
        if (editingProblem) {
            await updateMutation.mutateAsync({ id: editingProblem._id, ...formData });
            toast.success("Problem updated!");
        } else {
            await createMutation.mutateAsync(formData);
            toast.success("Problem created!");
        }
        setShowForm(false);
        setEditingProblem(null);
    };

    const handleEdit = (problem) => {
        setEditingProblem(problem);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this problem? This action cannot be undone.")) return;
        await deleteMutation.mutateAsync(id);
        toast.success("Problem deleted");
    };

    const isSaving = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="min-h-screen bg-base-300">
            {/* Hero header */}
            <div className="bg-linear-to-br from-primary/20 via-base-200 to-secondary/10 border-b border-base-300">
                <div className="container mx-auto px-6 py-12">
                    <div className="flex items-center justify-between gap-6 flex-wrap">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                                    <BookOpenIcon className="w-5 h-5 text-primary" />
                                </div>
                                <h1 className="text-4xl font-bold">Problem Bank</h1>
                            </div>
                            <p className="text-base-content/60 text-lg">
                                Browse built-in problems or create your own private problems for interview sessions.
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-base-content/50">
                                <span className="flex items-center gap-1.5">
                                    <CodeIcon className="w-4 h-4" />
                                    {BUILT_IN_LIST.length} built-in
                                </span>
                                <span className="flex items-center gap-1.5">
                                    <Lock className="w-4 h-4" />
                                    {customProblems.length} custom (private)
                                </span>
                            </div>
                        </div>
                        <button
                            className="btn btn-primary gap-2 shadow-lg"
                            onClick={() => { setEditingProblem(null); setShowForm(true); }}
                        >
                            <Plus className="w-5 h-5" />
                            New Custom Problem
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-8">
                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3 mb-8">
                    <div className="relative flex-1 min-w-48">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 w-4 h-4" />
                        <input
                            className="input input-bordered w-full pl-9"
                            placeholder="Search problems..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <select
                        className="select select-bordered"
                        value={diffFilter}
                        onChange={(e) => setDiffFilter(e.target.value)}
                    >
                        <option>All</option>
                        <option>Easy</option>
                        <option>Medium</option>
                        <option>Hard</option>
                    </select>

                    <div className="join">
                        {["All", "Built-in", "Custom"].map((t) => (
                            <button
                                key={t}
                                className={`btn btn-sm join-item ${typeFilter === t ? "btn-primary" : "btn-ghost btn-outline"}`}
                                onClick={() => setTypeFilter(t)}
                            >
                                {t}
                            </button>
                        ))}
                    </div>

                    <span className="text-sm text-base-content/50 ml-auto">
                        {filtered.length} problem{filtered.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="flex items-center justify-center py-24">
                        <Loader2Icon className="w-10 h-10 animate-spin text-primary" />
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-24 text-base-content/40">
                        <BookOpenIcon className="w-16 h-16 mx-auto mb-4 opacity-30" />
                        <p className="text-lg font-medium">No problems found</p>
                        <p className="text-sm mt-1">Try adjusting your filters or create a new problem.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filtered.map((problem) => (
                            <ProblemCard
                                key={problem._id || problem.id}
                                problem={problem}
                                isCustom={problem._isCustom}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                                isDeleting={deleteMutation.isPending}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Form Modal */}
            {showForm && (
                <ProblemFormModal
                    initial={editingProblem}
                    onClose={() => { setShowForm(false); setEditingProblem(null); }}
                    onSave={handleSave}
                    isSaving={isSaving}
                />
            )}
        </div>
    );
};
