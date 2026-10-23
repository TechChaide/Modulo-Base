'use client';

import Image from 'next/image';
import { Ban, EyeOff, KeyRound, Lock, ShieldX, UserX, type LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { environment } from '@/environments/environments.prod';
import { cn } from '@/lib/utils';

// Matriz de 2 filas x 3 columnas
const accessIcons: LucideIcon[] = [ShieldX, Lock, KeyRound, UserX, Ban, EyeOff];

type AccessDeniedProps = {
    title?: string;
    description?: string;
    // 6 iconos para la matriz de 2x3
    icons?: LucideIcon[];
    // Color de los iconos: azul de marca (por defecto) o rojo
    tone?: 'primary' | 'destructive';
    className?: string;
    // Contenido opcional bajo el mensaje (ej. botón para volver)
    children?: React.ReactNode;
};

// Ocupa todo el ancho y alto disponible del contenedor padre
export function AccessDenied({
    title = 'Usted no tiene acceso a esta página',
    description = 'Si cree que se trata de un error, comuníquese con el administrador del sistema.',
    icons = accessIcons,
    tone = 'primary',
    className,
    children,
}: AccessDeniedProps) {
    return (
        <div className={cn('flex h-full w-full flex-1 p-4', className)}>
            <Card className="relative flex flex-1 items-center justify-center">
                <Image
                    src={`${environment.basePath}/img/Chide.svg`}
                    alt="Chaide Logo"
                    width={48}
                    height={46}
                    priority
                    className="absolute right-4 top-4 select-none"
                />

                <CardContent className="flex flex-col items-center gap-6 p-6">
                    <div className="grid grid-cols-3 gap-3" aria-hidden="true">
                        {icons.map((Icon, i) => (
                            <div
                                key={i}
                                className={cn(
                                    'flex h-14 w-14 items-center justify-center rounded-lg',
                                    tone === 'destructive' ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary'
                                )}
                            >
                                <Icon className="h-7 w-7" />
                            </div>
                        ))}
                    </div>

                    <CardHeader className="items-center p-0 text-center">
                        <CardTitle className="text-xl">{title}</CardTitle>
                        {description && <CardDescription>{description}</CardDescription>}
                    </CardHeader>

                    {children && <div className="flex w-full justify-center">{children}</div>}
                </CardContent>
            </Card>
        </div>
    );
}
