export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
    const sizes = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
    };

    return (
        <div className="flex items-center justify-center">
            <div
                className={`${sizes[size]} border-manthan-gold/20 border-t-manthan-gold rounded-full animate-spin`}
            />
        </div>
    );
}
