'use client';

import SlotCounter from 'react-slot-counter';

interface Props {
    value: number;
    inView: boolean; // 1. 화면에 보이는지 여부를 prop으로 받습니다.
}

// 서버 컴포넌트에서 받은 value prop을 사용
export default function AnimatedCounter({ value, inView }: Props) {
    return (
        <>
            <div className='hidden desktop:block'>
                {/* 2. inView가 true일 때만 SlotCounter를 마운트하여 애니메이션을 시작합니다. */}
                {inView ? (
                    <SlotCounter value={value} containerClassName='massive-counter' duration={2} speed={2} />
                ) : (
                    // 3. 화면에 보이지 않을 때는 0을 표시해 레이아웃을 유지합니다.
                    <div className='massive-counter'>0</div>
                )}
            </div>
            <div className='block desktop:hidden'>
                {inView ? (
                    <SlotCounter value={value} containerClassName='semi-massive-counter' duration={2} speed={2} />
                ) : (
                    <div className='semi-massive-counter'>0</div>
                )}
            </div>
        </>
    );
}
