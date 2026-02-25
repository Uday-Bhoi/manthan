import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
    title: 'Manthan 2026 | College Tech Fest',
    description:
        'Manthan 2026 - The ultimate college tech fest featuring technical, cultural, and sports events. Register now!',
    keywords: ['manthan', 'tech fest', 'college fest', 'hackathon', 'cultural fest'],
    openGraph: {
        title: 'Manthan 2026 | College Tech Fest',
        description: 'The ultimate college tech fest. Register now!',
        type: 'website',
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/favicon.ico" />
            </head>
            <body className="min-h-screen bg-manthan-black text-gray-200 antialiased">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="fixed top-0 left-0 w-full h-full object-cover -z-10 opacity-30 pointer-events-none"
                >
                    <source src="/p2.mp4" type="video/mp4" />
                </video>
                {children}
            </body>
        </html>
    );
}
