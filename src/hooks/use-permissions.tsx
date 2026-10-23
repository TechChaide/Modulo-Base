'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { usePathname } from 'next/navigation';
import { environment } from '@/environments/environments.prod';

// C = Create, R = Read, U = Update, D = Delete, X = Execute
export type Permiso = 'C' | 'R' | 'U' | 'D' | 'X';

const PERMISO_ORDER: Permiso[] = ['C', 'R', 'U', 'D', 'X'];

// Rutas accesibles para cualquier usuario autenticado aunque no estén en su menú
const PUBLIC_PATHS = ['/dashboard'];

type PermisoNode = {
    path: string;
    permisos?: string | null;
    children?: PermisoNode[];
};

// Unir dos cadenas de permisos (ej. "RX" + "CR" => "CRX")
export function unionPermisos(a?: string | null, b?: string | null): string {
    const set = new Set(`${a ?? ''}${b ?? ''}`.toUpperCase());
    return PERMISO_ORDER.filter(p => set.has(p)).join('');
}

function normalizePath(path: string): string {
    let p = path.trim();
    const base = environment.basePath || '';
    if (base && p.startsWith(base)) p = p.slice(base.length) || '/';
    if (p.length > 1) p = p.replace(/\/+$/, '');
    return p;
}

// Construir mapa ruta -> permisos a partir de árboles de menú (solo nodos navegables)
export function buildPermisosMap(nodes: PermisoNode[], map: Record<string, string> = {}): Record<string, string> {
    for (const n of nodes) {
        const isNavigable = !!n.path && !['.', '|', '#'].includes(n.path);
        if (isNavigable) {
            const key = normalizePath(n.path);
            map[key] = unionPermisos(map[key], n.permisos);
        }
        if (n.children?.length) buildPermisosMap(n.children, map);
    }
    return map;
}

// Permisos de una ruta: coincidencia exacta o el prefijo de menú más largo
// (ej. /dashboard/users/15 hereda de /dashboard/users). null si no está en el menú.
// Nunca se hereda de una ruta raíz (/dashboard): si no, cualquier ruta bajo
// /dashboard tomaría los permisos del menú "Dashboard".
export function resolvePermisos(map: Record<string, string>, pathname: string): string | null {
    const target = normalizePath(pathname);
    if (target in map) return map[target];

    let current = target;
    while (true) {
        const idx = current.lastIndexOf('/');
        if (idx <= 0) return null;
        current = current.slice(0, idx);
        if (PUBLIC_PATHS.includes(current)) return null;
        if (current in map) return map[current];
    }
}

type PermissionsContextValue = {
    loading: boolean;
    permisosByPath: Record<string, string>;
};

const PermissionsContext = createContext<PermissionsContextValue>({ loading: true, permisosByPath: {} });

export function PermissionsProvider({
    loading,
    permisosByPath,
    children,
}: PermissionsContextValue & { children: React.ReactNode }) {
    const value = useMemo(() => ({ loading, permisosByPath }), [loading, permisosByPath]);
    return <PermissionsContext.Provider value={value}>{children}</PermissionsContext.Provider>;
}

// Permisos del usuario para la vista actual
export function usePermissions() {
    const { loading, permisosByPath } = useContext(PermissionsContext);
    const pathname = usePathname() || '/';

    return useMemo(() => {
        const isPublic = PUBLIC_PATHS.includes(normalizePath(pathname));
        const permisos = resolvePermisos(permisosByPath, pathname) ?? '';
        const can = (p: Permiso) => permisos.includes(p);
        return {
            loading,
            permisos,
            can,
            // X (Execute) es el permiso mínimo para abrir una vista
            canView: isPublic || can('X'),
        };
    }, [loading, permisosByPath, pathname]);
}
