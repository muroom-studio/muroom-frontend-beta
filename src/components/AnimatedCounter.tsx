'use client';

import SlotCounter from 'react-slot-counter';

interface Props {
    value: number;
}

// 서버 컴포넌트에서 받은 value prop을 사용
export default function AnimatedCounter({ value }: Props) {
    return <SlotCounter value={value} containerClassName='massive-counter' duration={2} speed={2} />;
}
