import Image from 'next/image';
import { ReactNode } from 'react';

interface FormLabelProps {
    htmlFor: string;
    children: ReactNode;
    required?: boolean;
}
export default function FormLabel({ htmlFor, children, required = false }: FormLabelProps) {
    return (
        <label htmlFor={htmlFor} className='flex items-center text-base-exl-18-2 text-gray-800 mb-2'>
            <span className='mr-1'>{children}</span>
            {required && <Image src='/images/icons/essential-icon.svg' alt='essential' width={16} height={16} />}
        </label>
    );
}
