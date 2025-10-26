export default function ErrorMessage({ message }: { message?: string }) {
    if (!message) return null;
    return <span className='absolute left-4 top-full mt-2 text-base-s-12-1 text-red-500'>{message}</span>;
}
