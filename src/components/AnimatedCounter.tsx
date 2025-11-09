'use client';

import SlotCounter from 'react-slot-counter';

interface Props {
    value: number;
}

// 서버 컴포넌트에서 받은 value prop을 사용
export default function AnimatedCounter({ value }: Props) {
    return (
        <>
            <div className='hidden desktop:block'>
                <SlotCounter value={value} containerClassName='massive-counter' duration={2} speed={2} />
            </div>
            <div className='block desktop:hidden'>
                <SlotCounter value={value} containerClassName='semi-massive-counter' duration={2} speed={2} />
            </div>
        </>
    );
}
