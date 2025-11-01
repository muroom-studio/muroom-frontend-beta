'use client';

import Image from 'next/image';

export default function TopAnchorButton() {
    return (
        <button
            className='hidden fixed z-999 right-10 bottom-10 w-16 h-16 desktop:grid place-items-center bg-white transition-shadow duration-300 shadow-level-1 hover:shadow-level-2 rounded-[10px]'
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
            <Image
                src='/images/icons/top-anchor-icon.svg'
                alt='top page'
                width={48}
                height={48}
                className='w-12 h-12'
            />
        </button>
    );
}
