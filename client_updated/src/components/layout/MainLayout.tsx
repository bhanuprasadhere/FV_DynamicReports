import type { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    return (
        <main className="max-w-[1600px] mx-auto px-6 py-8">
            {children}
        </main>
    );
}
