import { notFound } from 'next/navigation';

// Captura cualquier ruta inexistente bajo /dashboard para mostrar el 404 dentro del layout.
// Las rutas definidas explícitamente tienen prioridad sobre este catch-all.
// RouteGuard usa el parámetro "missingRoute" para saber que la página no existe:
// no renombrar la carpeta sin actualizar MISSING_ROUTE_PARAM en route-guard.tsx.
export default function DashboardCatchAll() {
    notFound();
}
