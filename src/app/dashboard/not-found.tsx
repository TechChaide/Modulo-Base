'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Compass, FileQuestion, FileX, MapPinOff, SearchX, Unlink } from 'lucide-react';
import { AccessDenied } from '@/components/access-denied';
import { Button } from '@/components/ui/button';

// Mismo criterio de sesión que useAuth (token httpOnly no legible desde JS;
// un 401 en fetchWithAuth limpia estos datos), sin toast ni redirección.
function hasActiveSession(): boolean {
    try {
        const userData = localStorage.getItem('user');
        const appsByProfile = localStorage.getItem('appsByProfile');
        if (!userData || !appsByProfile) return false;
        JSON.parse(userData);
        return Object.keys(JSON.parse(appsByProfile) || {}).length > 0;
    } catch {
        return false;
    }
}

// 404 dentro del layout del dashboard (sidebar visible)
export default function DashboardNotFound() {
    // null mientras se verifica, para no mostrar el botón por un instante
    const [loggedIn, setLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        setLoggedIn(hasActiveSession());
    }, []);

    return (
        <div className="flex flex-1 min-h-full bg-gray-100">
            <AccessDenied
                title="Página no encontrada"
                description="La página que busca no existe o fue movida."
                icons={[FileQuestion, SearchX, MapPinOff, Compass, Unlink, FileX]}
                tone="destructive"
            >
                {loggedIn === false && (
                    <Button asChild>
                        <Link href="/">Ir al inicio</Link>
                    </Button>
                )}
            </AccessDenied>
        </div>
    );
}
