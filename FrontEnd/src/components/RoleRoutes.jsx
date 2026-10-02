import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import { LoaderIcon } from "lucide-react";

function getAuth(useUserHook) {
    const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn: clerkSignedIn } = useUserHook();
    const e2eUser = typeof window !== 'undefined' && window.__E2E_USER__;
    if (e2eUser) {
        return {
            user: e2eUser,
            isLoaded: true,
            isSignedIn: true,
            role: e2eUser.publicMetadata?.role || e2eUser.role || 'host',
        };
    }
    return {
        user: clerkUser,
        isLoaded: clerkLoaded,
        isSignedIn: clerkSignedIn,
        role: clerkUser?.publicMetadata?.role || clerkUser?.role,
    };
}

export function AdminRoute({ children }) {
    const { isLoaded, isSignedIn, role } = getAuth(useUser);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-300">
                <LoaderIcon className="size-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!isSignedIn) return <Navigate to="/" />;

    if (!role) return <Navigate to="/select-role" />;

    if (role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    return children;
}

export function HostRoute({ children }) {
    const { isLoaded, isSignedIn, role } = getAuth(useUser);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-300">
                <LoaderIcon className="size-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!isSignedIn) return <Navigate to="/" />;

    if (!role) return <Navigate to="/select-role" />;

    if (role !== 'host') {
        return <Navigate to="/my-interviews" />;
    }

    return children;
}

export function ParticipantRoute({ children }) {
    const { isLoaded, isSignedIn, role } = getAuth(useUser);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-300">
                <LoaderIcon className="size-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!isSignedIn) return <Navigate to="/" />;

    if (!role) return <Navigate to="/select-role" />;

    if (role !== 'participant') {
        return <Navigate to="/dashboard" />;
    }

    return children;
}

export function AuthenticatedRoute({ children }) {
    const { isLoaded, isSignedIn, role } = getAuth(useUser);

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-300">
                <LoaderIcon className="size-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!isSignedIn) return <Navigate to="/" />;

    if (!role) return <Navigate to="/select-role" />;

    return children;
}
