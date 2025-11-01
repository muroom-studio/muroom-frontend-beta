export default function ErrorMessage({ message }: { message?: string }) {
    if (!message) return null;
    return (
        <span className='absolute right-0 desktop:left-4 -top-8.5 desktop:top-full mt-2 text-base-s-12-1 text-red-500'>
            {message}
        </span>
    );
}
