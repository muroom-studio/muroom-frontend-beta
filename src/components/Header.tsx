'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

// 1. 데스크탑 브레이크포인트 정의
const DESKTOP_BREAKPOINT = 1024; // 'lg' (1024px)
const TOP_THRESHOLD = 50; // 헤더가 고정되는 최상단 범위

export default function Header() {
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // --- 데스크탑 여부를 판단하는 state ---
    const [isDesktop, setIsDesktop] = useState(false); // SSR시 기본값

    // --- 클라이언트 마운트 시, 화면 크기 감지 useEffect ---
    useEffect(() => {
        const checkScreenSize = () => {
            setIsDesktop(window.innerWidth >= DESKTOP_BREAKPOINT);
        };
        // 클라이언트에서 마운트될 때 즉시 실행
        checkScreenSize();
        // 리사이즈 이벤트 리스너 등록
        window.addEventListener('resize', checkScreenSize);
        // 컴포넌트 언마운트 시 리스너 제거
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []); // 마운트 시 한 번만 실행

    // --- 데스크탑 전용 로직 useEffect ---
    useEffect(() => {
        // 데스크탑이 아니면 아무 로직도 실행하지 않음
        // (isDesktop이 true -> false로 바뀔 때,
        //  아래 return의 cleanup 함수가 실행되어 리스너가 정리됨)
        if (!isDesktop) {
            return;
        }

        // --- 여기서부터는 데스크탑 전용 로직 ---
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
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            } else if (currentScrollY > lastScrollY.current) {
                setIsVisible(false);
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            } else {
                setIsVisible(true);
                resetTimer();
            }

            lastScrollY.current = currentScrollY;
        };

        const handleGenericActivity = () => {
            if (isVisible) {
                resetTimer();
            }
        };

        // 이벤트 리스너 등록
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleGenericActivity);
        window.addEventListener('touchstart', handleGenericActivity);

        // 컴포넌트 언마운트 또는 isDesktop/isVisible 변경 시 리스너 제거
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleGenericActivity);
            window.removeEventListener('touchstart', handleGenericActivity);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [isVisible, isDesktop]);

    return (
        <>
            {/* --- 1. 데스크탑 헤더 --- */}
            <header
                className={`desktop:fixed desktop:block hidden z-50 top-10 
                        transition-transform duration-500 ease-in-out
                        ${isVisible ? 'translate-y-0' : '-translate-y-35'}
                        w-306 min-w-306 px-25`}
            >
                <div className='w-full h-20 px-20 flex justify-between items-center bg-white rounded-100 shadow-level-1'>
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
                        className='grid place-items-center w-[125px] h-9 text-base-m-14-2 text-white bg-primary-600 rounded-8'
                    >
                        내 작업실 등록하기
                    </Link>
                </div>
            </header>

            {/* --- 2. 모바일 헤더 --- */}
            {/* (JavaScript 로직의 영향을 받지 않음) */}
            <header className={`desktop:hidden block absolute z-50 top-10 w-90 min-w-90 px-5`}>
                <div className='w-full h-15 flex justify-center items-center bg-white rounded-100 shadow-level-1'>
                    <Image
                        src='/images/logo/logo.svg'
                        alt='muroom logo'
                        width={128}
                        height={25}
                        className='w-32 h-auto'
                        loading='eager'
                    />
                </div>
            </header>
        </>
    );
}
