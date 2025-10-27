'use client';

import Image from 'next/image';

export default function TopAnchorButton() {
    return (
        <button
            className='fixed z-999 right-10 top-[calc(50vh-4rem)] w-16 h-16 grid place-items-center bg-white transition-shadow duration-300 shadow-level-1 hover:shadow-level-2 rounded-[10px]'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <Image src='/images/icons/top-anchor-icon.svg' alt='top page' width={48} height={48} />
        </button>
    );
}
