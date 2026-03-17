import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router";
import { LoaderIcon } from "lucide-react";

export function AdminRoute({ children }) {
    const { user, isLoaded, isSignedIn } = useUser();

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-300">
                <LoaderIcon className="size-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!isSignedIn) return <Navigate to="/" />;

    // Assuming role is stored in publicMetadata as per Clerk best practices 
    // or as a custom property synced with our DB.
    // The README specifies 'user.role'
    const role = user?.publicMetadata?.role || user?.role;
    
    if (!role) return <Navigate to="/select-role" />;

    if (role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    return children;
}

export function HostRoute({ children }) {
    const { user, isLoaded, isSignedIn } = useUser();

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-300">
                <LoaderIcon className="size-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!isSignedIn) return <Navigate to="/" />;

    const role = user?.publicMetadata?.role || user?.role;

    if (!role) return <Navigate to="/select-role" />;

    if (role !== 'host') {
        return <Navigate to="/my-interviews" />;
    }

    return children;
}

export function ParticipantRoute({ children }) {
    const { user, isLoaded, isSignedIn } = useUser();

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-300">
                <LoaderIcon className="size-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!isSignedIn) return <Navigate to="/" />;

    const role = user?.publicMetadata?.role || user?.role;

    if (!role) return <Navigate to="/select-role" />;

    // Admin can also see these pages usually, but following strict participant-only guard from README
    if (role !== 'participant') {
        return <Navigate to="/dashboard" />;
    }

    return children;
}

export function AuthenticatedRoute({ children }) {
    const { user, isLoaded, isSignedIn } = useUser();

    if (!isLoaded) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-300">
                <LoaderIcon className="size-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!isSignedIn) return <Navigate to="/" />;

    const role = user?.publicMetadata?.role || user?.role;

    if (!role) return <Navigate to="/select-role" />;

    return children;
}
