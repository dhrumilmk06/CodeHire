import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
    UsersIcon, 
    VideoIcon, 
    TrophyIcon, 
    ShieldCheckIcon, 
    BanIcon, 
    Trash2Icon, 
    SearchIcon,
    PieChartIcon,
    Code2Icon,
    LoaderIcon,
    AlertCircleIcon
} from "lucide-react";
import { adminApi } from "../api/admin";
import toast from "react-hot-toast";
import { formatDistanceToNow } from "date-fns";

export const AdminPanelPage = () => {
    const { tab } = useParams();
    const navigate = useNavigate();
    const activeTab = tab || "users";
    
    const setActiveTab = (newTab) => {
        navigate(`/admin/${newTab}`);
    };

    const [searchQuery, setSearchQuery] = useState("");
    const queryClient = useQueryClient();

    // --- Analytics API ---
    const { data: analytics, isLoading: analyticsLoading } = useQuery({
        queryKey: ["admin-analytics"],
        queryFn: adminApi.getAnalytics,
    });

    // --- Users API ---
    const { data: usersData, isLoading: usersLoading } = useQuery({
        queryKey: ["admin-users", searchQuery],
        queryFn: () => adminApi.getUsers(1, searchQuery),
    });

    // --- Sessions API ---
    const { data: sessions, isLoading: sessionsLoading } = useQuery({
        queryKey: ["admin-sessions"],
        queryFn: adminApi.getSessions,
    });

    // --- Problems API ---
    const { data: problems, isLoading: problemsLoading } = useQuery({
        queryKey: ["admin-problems"],
        queryFn: adminApi.getProblems,
    });

    // --- Mutations ---
    const roleMutation = useMutation({
        mutationFn: ({ id, role }) => adminApi.updateUserRole(id, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            toast.success("User role updated");
        }
    });

    const banMutation = useMutation({
        mutationFn: ({ id, banned }) => adminApi.toggleBan(id, banned),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            toast.success("User status changed");
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id) => adminApi.deleteUser(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["admin-users"] });
            toast.success("User deleted");
        }
    });

    const isLoading = analyticsLoading || usersLoading || sessionsLoading || problemsLoading;

    const renderAnalytics = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <StatCard label="Total Users" value={analytics?.totalUsers} icon={<UsersIcon className="text-primary"/>} />
            <StatCard label="Total Hosts" value={analytics?.totalHosts} icon={<ShieldCheckIcon className="text-secondary"/>} />
            <StatCard label="Total Participants" value={analytics?.totalParticipants} icon={<UsersIcon className="text-accent"/>} />
            <StatCard label="Total Sessions" value={analytics?.totalSessions} icon={<VideoIcon className="text-warning"/>} />
            <StatCard label="Custom Problems" value={analytics?.totalProblems} icon={<Code2Icon className="text-info"/>} />
        </div>
    );

    const renderUsers = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-3 bg-[#111111] border border-white/10 rounded-2xl p-4 max-w-md">
                <SearchIcon className="size-5 text-zinc-500" />
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-sm text-white outline-none w-full"
                />
            </div>

            <div className="overflow-x-auto rounded-3xl border border-white/5 bg-[#111111]">
                <table className="table">
                    <thead>
                        <tr className="border-b border-white/5 text-zinc-500">
                            <th>User</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Signed Up</th>
                            <th className="text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usersData?.users?.map(user => (
                            <tr key={user._id} className="border-b border-white/5 hover:bg-white/2">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <div className="avatar">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-zinc-800">
                                                {user.profileImage ? (
                                                    <img src={user.profileImage} alt={user.name} />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-zinc-500 font-bold uppercase truncate">{user.name?.charAt(0)}</div>
                                                )}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="font-bold">{user.name || "Anonymous"}</div>
                                            <div className="text-xs text-zinc-500 font-mono">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <select 
                                        value={user.role} 
                                        onChange={(e) => roleMutation.mutate({ id: user._id, role: e.target.value })}
                                        className="select bg-[#0c0c0c] select-xs border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-primary focus:border-primary"
                                    >
                                        <option value="participant">PARTICIPANT</option>
                                        <option value="host">HOST</option>
                                        <option value="admin">ADMIN</option>
                                    </select>
                                </td>
                                <td>
                                    {user.banned ? (
                                        <span className="badge badge-error badge-sm text-[10px] font-black uppercase tracking-widest">BANNED</span>
                                    ) : (
                                        <span className="badge badge-success badge-sm text-[10px] font-black uppercase tracking-widest">ACTIVE</span>
                                    )}
                                </td>
                                <td className="text-xs text-zinc-500">{formatDistanceToNow(new Date(user.createdAt), { addSuffix: true })}</td>
                                <td className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={() => banMutation.mutate({ id: user._id, banned: !user.banned })}
                                            className={`btn btn-square btn-ghost btn-sm ${user.banned ? "text-success" : "text-error"}`}
                                            title={user.banned ? "Unban User" : "Ban User"}
                                        >
                                            <BanIcon className="size-4" />
                                        </button>
                                        <button 
                                            onClick={() => confirm("Are you sure you want to delete this user?") && deleteMutation.mutate(user._id)}
                                            className="btn btn-square btn-ghost btn-sm text-zinc-500 hover:text-error"
                                            title="Delete User"
                                        >
                                            <Trash2Icon className="size-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const renderSessions = () => (
        <div className="overflow-x-auto rounded-3xl border border-white/5 bg-[#111111]">
            <table className="table">
                <thead>
                    <tr className="border-b border-white/5 text-zinc-500">
                        <th>Session Name</th>
                        <th>Host</th>
                        <th>Participant</th>
                        <th>Status</th>
                        <th>Outcome</th>
                    </tr>
                </thead>
                <tbody>
                    {sessions?.map(session => (
                        <tr key={session._id} className="border-b border-white/5 hover:bg-white/2 text-sm italic">
                            <td className="font-bold text-white not-italic">{session.problem}</td>
                            <td>{session.host?.name || "N/A"}</td>
                            <td>{session.participant?.name || "Searching..."}</td>
                            <td>
                                <span className={`badge badge-sm font-black uppercase tracking-widest text-[10px] ${session.status === 'completed' ? 'badge-success' : 'badge-primary'}`}>
                                    {session.status}
                                </span>
                            </td>
                            <td>{session.decision || "-"}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderProblems = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {problems?.map(problem => (
                <div key={problem._id} className="p-6 bg-[#111111] border border-white/5 rounded-3xl hover:border-primary/40 transition-all flex flex-col justify-between">
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-primary/10 rounded-2xl">
                                <Code2Icon className="size-6 text-primary" />
                            </div>
                            <span className={`badge badge-sm uppercase tracking-widest font-black ${
                                problem.difficulty === 'Easy' ? 'badge-success' : problem.difficulty === 'Medium' ? 'badge-warning' : 'badge-error'
                            }`}>
                                {problem.difficulty}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{problem.title}</h3>
                        <p className="text-sm text-zinc-500 mb-6">{problem.category}</p>
                    </div>
                    <div className="text-[10px] text-zinc-700 font-bold uppercase tracking-widest">
                        Created by: {problem.ownerClerkId}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] p-8 -mt-12 text-white">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-5xl font-black bg-linear-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Admin Panel</h1>
                        <p className="text-zinc-500 font-medium mt-2">Oversee infrastructure, users, and session activity.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <TabButton id="users" label="Users" icon={<UsersIcon className="size-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton id="sessions" label="Sessions" icon={<VideoIcon className="size-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton id="problems" label="Problems" icon={<Code2Icon className="size-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton id="analytics" label="Analytics" icon={<PieChartIcon className="size-4" />} activeTab={activeTab} setActiveTab={setActiveTab} />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4 text-primary/40">
                        <LoaderIcon className="size-16 animate-spin" />
                        <span className="text-xs font-black uppercase tracking-[0.2em]">Synchronizing platform...</span>
                    </div>
                ) : (
                    <div className="animate-in fade-in duration-500 slide-in-from-bottom-5">
                       {activeTab === 'users' && renderUsers()}
                       {activeTab === 'sessions' && renderSessions()}
                       {activeTab === 'problems' && renderProblems()}
                       {activeTab === 'analytics' && renderAnalytics()}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Helper Components ---
const StatCard = ({ label, value, icon }) => (
    <div className="p-6 bg-[#111111] border border-white/5 rounded-3xl relative overflow-hidden group">
        <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
        </div>
        <div className="text-3xl font-black">{value || 0}</div>
        <p className="text-xs text-zinc-500 uppercase tracking-widest font-bold mt-1">{label}</p>
    </div>
);

const TabButton = ({ id, label, icon, activeTab, setActiveTab }) => {
    const isActive = activeTab === id;
    return (
        <button 
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all ${
                isActive ? "bg-primary text-white shadow-[0_0_20px_rgba(34,197,94,0.3)] scale-105" : "bg-[#111111] border border-white/5 text-zinc-500 hover:border-primary/40"
            }`}
        >
            {icon}
            {label}
        </button>
    );
};
