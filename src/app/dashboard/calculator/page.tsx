'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { usePermissions, type Permiso } from '@/hooks/use-permissions';

const PERMISO_LABELS: Record<Permiso, string> = {
    C: 'Create',
    R: 'Read',
    U: 'Update',
    D: 'Delete',
    X: 'Execute',
};

// Hola mundo para probar RouteGuard y usePermissions
export default function CalculatorPage() {
    const { permisos, can } = usePermissions();

    return (
        <div className="flex flex-1 min-h-full bg-gray-100 p-4">
            <Card className="flex-1">
                <CardHeader>
                    <CardTitle>Hola mundo 👋</CardTitle>
                    <CardDescription>
                        Si ves esta página, tienes el permiso mínimo (X) sobre esta ruta.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <div>
                        <p className="text-sm font-medium mb-2">
                            Permisos recibidos: <code className="rounded bg-muted px-1.5 py-0.5">{permisos || '(ninguno)'}</code>
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {(Object.keys(PERMISO_LABELS) as Permiso[]).map(p => (
                                <span
                                    key={p}
                                    className={`rounded-md px-2 py-1 text-xs font-medium ${
                                        can(p) ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground line-through'
                                    }`}
                                >
                                    {p} · {PERMISO_LABELS[p]}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-medium mb-2">Botones según permiso:</p>
                        <div className="flex flex-wrap gap-2">
                            {can('C') && <Button>Crear</Button>}
                            {can('R') && <Button variant="secondary">Consultar</Button>}
                            {can('U') && <Button variant="outline">Editar</Button>}
                            {can('D') && <Button variant="destructive">Eliminar</Button>}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
