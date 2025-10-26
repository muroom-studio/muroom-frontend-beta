'use client';

import { useRef, useState } from 'react';

export default function InquirySection() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [agreement, setAgreement] = useState(false);
    const [inquiry, setInquiry] = useState('');

    const nameRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const agreementRef = useRef<HTMLInputElement>(null);

    const charCount = inquiry.length;

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // 폼의 기본 동작(페이지 새로고침) 방지
        e.preventDefault();

        if (!name.trim()) {
            // toast.error('성함을 입력해주세요.');
            nameRef.current?.focus();
            return;
        }
        if (!phone.trim()) {
            // toast.error('전화번호를 입력해주세요.');
            phoneRef.current?.focus();
            return;
        }
        if (!agreement) {
            // toast.error('개인정보 수집에 동의해주세요.');
            agreementRef.current?.focus();
            return;
        }

        // toast.success('문의가 완료되었습니다.');
        // setSubmitted(true);

        const formData = {
            name,
            phone,
        };
        console.log('제출할 데이터:', formData);
    };

    return (
        <section id='inquiry-section' className='w-306 min-w-306 relative px-25 mb-50'>
            <div className='mb-14 leading-[63px] text-[42px] font-semibold text-gray-800'>
                <p>직접 문의하기</p>
            </div>
        </section>
    );
}
