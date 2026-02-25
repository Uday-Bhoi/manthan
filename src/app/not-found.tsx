import Link from 'next/link';

export default function NotFound() {
    return (
        <main className="min-h-screen flex items-center justify-center px-4 bg-manthan-black">
            <div className="text-center relative z-10">
                <h1 className="font-heading text-8xl font-black text-gold-gradient mb-4">404</h1>
                <p className="text-gray-400 text-lg mb-8">Page not found</p>
                <Link
                    href="/"
                    className="px-8 py-3 bg-gradient-to-r from-manthan-maroon to-manthan-crimson text-white font-semibold rounded-lg hover:from-manthan-crimson hover:to-manthan-maroon transition-all"
                >
                    Back to Home
                </Link>
            </div>
        </main>
    );
}
