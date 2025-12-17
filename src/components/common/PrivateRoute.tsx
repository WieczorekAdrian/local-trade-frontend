
import { useAuth } from '@/context/auth.context';
import { Navigate, Outlet } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export const PrivateRoute = () => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">

                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                <span className="ml-3 text-gray-600">Weryfikacja sesji...</span>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
