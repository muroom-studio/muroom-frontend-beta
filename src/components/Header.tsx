'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

const TOP_THRESHOLD = 50;

export default function Header() {
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const hideHeader = () => {
            if (window.scrollY > TOP_THRESHOLD) {
                setIsVisible(false);
            }
        };

        const resetTimer = () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(hideHeader, 6000);
        };

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < TOP_THRESHOLD) {
                setIsVisible(true);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            } else if (currentScrollY > lastScrollY.current) {
                setIsVisible(false);
                if (timeoutRef.current) clearTimeout(timeoutRef.current);
            } else {
                setIsVisible(true);
                resetTimer();
            }
            lastScrollY.current = currentScrollY;
        };

        const handleGenericActivity = () => {
            if (isVisible) resetTimer();
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleGenericActivity);
        window.addEventListener('touchstart', handleGenericActivity);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleGenericActivity);
            window.removeEventListener('touchstart', handleGenericActivity);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [isVisible]);

    return (
        <>
            <header
                className={`fixed z-50 top-10 left-1/2 -translate-x-1/2
                        transition-transform duration-500 ease-in-out
                        ${isVisible ? 'translate-y-0' : '-translate-y-[200%]'}
                        w-full min-w-90 px-4
                        desktop:w-306 desktop:min-w-306 desktop:px-25`}
            >
                {/* 수정된 포인트:
                   1. opacity-0 제거: 이제 투명해지지 않고 위로 이동만 합니다.
                   2. -translate-y-[200%]: top-10(약 40px) 여백까지 고려해서 
                      확실하게 화면 밖으로 밀어 올리기 위해 이동 거리를 늘렸습니다.
                */}

                <div className='w-full h-20 px-6 desktop:px-20 flex justify-between items-center bg-white rounded-100 shadow-level-1'>
                    <Image
                        src='/images/logo/logo.svg'
                        alt='muroom logo'
                        width={128}
                        height={25}
                        className='w-32 h-auto'
                        loading='eager'
                    />
                    <Link
                        href='#submit-form'
                        className='grid place-items-center w-[111px] desktop:w-[125px] h-9 text-base-m-14-2 text-white bg-primary-600 rounded-8'
                    >
                        이벤트 참여하기
                    </Link>
                </div>
            </header>
        </>
    );
}
