'use client'; // state와 effect를 사용하므로 'use client'가 필요합니다.

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react'; // hook 임포트

export default function Header() {
    const [isVisible, setIsVisible] = useState(true);
    const lastScrollY = useRef(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    // 1. "화면 최상단"으로 간주할 스크롤 위치 (px)
    // 이 위치보다 스크롤이 적으면 헤더는 항상 고정됩니다.
    const TOP_THRESHOLD = 50;

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

        // 2. 스크롤 이벤트 처리
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            // 1번 조건: 최상단인 경우
            if (currentScrollY < TOP_THRESHOLD) {
                setIsVisible(true);
                // 최상단에서는 타이머가 돌면 안 되므로, 타이머 제거
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            }
            // 2번 조건: 스크롤 내릴 때
            else if (currentScrollY > lastScrollY.current) {
                setIsVisible(false);
                // 어차피 숨겨지므로 타이머 제거
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            }
            // 3번 조건: 스크롤 올릴 때
            else {
                setIsVisible(true);
                // 헤더가 보였으므로 타이머 (재)시작
                resetTimer();
            }

            lastScrollY.current = currentScrollY;
        };

        // 3. 기타 활동(마우스, 터치) 처리
        // 헤더가 보이는 상태에서 활동이 감지되면 타이머를 리셋합니다.
        const handleGenericActivity = () => {
            if (isVisible) {
                resetTimer();
            }
        };

        // 이벤트 리스너 등록
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('mousemove', handleGenericActivity);
        window.addEventListener('touchstart', handleGenericActivity);

        // 컴포넌트 언마운트 시 리스너 및 타이머 제거
        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('mousemove', handleGenericActivity);
            window.removeEventListener('touchstart', handleGenericActivity);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
        // isVisible 상태가 바뀔 때마다 handleGenericActivity 함수를
        // 최신 상태로 참조하기 위해 의존성 배열에 추가합니다.
    }, [isVisible]);

    return (
        <header
            className={`fixed z-50 top-10 
                        transition-transform duration-500 ease-in-out
                        ${isVisible ? 'translate-y-0' : '-translate-y-30 desktop:-translate-y-35'}
                        w-90 min-w-90 px-5
                        desktop:w-306 desktop:min-w-306 desktop:px-25`}
            // Hiding: 헤더 높이(h-20, 80px) + 상단 마진(top-10, 40px) = 120px 만큼 위로 올림
        >
            <div className='w-full h-15 desktop:h-20 desktop:px-20 flex justify-center desktop:justify-between items-center bg-white rounded-100 shadow-level-1'>
                <Image src='/images/logo/logo.png' alt='muroom logo' width={128} height={25} />
                <Link
                    href='#submit-form'
                    className='hidden desktop:grid place-items-center w-[125px] h-9 text-base-m-14-2 text-white bg-primary-600 rounded-8'
                >
                    내 작업실 등록하기
                </Link>
            </div>
        </header>
    );
}
