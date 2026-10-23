'use client';

import { useParams } from 'next/navigation';
import { usePermissions } from '@/hooks/use-permissions';
import { AccessDenied } from '@/components/access-denied';

// Parámetro del catch-all src/app/dashboard/[...missingRoute]: solo existe cuando
// ninguna página real coincide con la URL (las rutas reales tienen prioridad).
const MISSING_ROUTE_PARAM = 'missingRoute';

// Verifica en cada navegación:
// 1. Si la página no existe => deja pasar al 404 (not-found.tsx), sin evaluar permisos.
// 2. Si existe => exige el permiso mínimo (X) sobre la vista actual.
export function RouteGuard({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const { loading, canView } = usePermissions();

    if (params && MISSING_ROUTE_PARAM in params) {
        return <>{children}</>;
    }

    if (loading) {
        return (
            <div className="flex flex-1 items-center justify-center min-h-full bg-gray-100">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!canView) {
        return (
            <div className="flex flex-1 min-h-full bg-gray-100">
                <AccessDenied />
            </div>
        );
    }

    return <>{children}</>;
}
