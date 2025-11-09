'use client';

import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import ErrorMessage from '../ErrorMessage';
import FormLabel from '../FormLabel';
import { useToast } from '../ToastProvider';
import Image from 'next/image';
import { submitInquiry } from '@/lib/api';

const inputStyles = `w-full rounded-[10px] px-4 py-4 text-base-l-16-1 text-gray-700 placeholder-gray-400
    outline focus:outline-2 focus:outline-primary-400
    hover:shadow-level-0`;

interface FormErrors {
    name?: string;
    phone?: string;
    inquiry?: string;
    agreement?: string;
}

export default function InquirySection() {
    const toast = useToast();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [inquiry, setInquiry] = useState('');
    const charCount = inquiry.length;
    const [agreement, setAgreement] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [errors, setErrors] = useState<FormErrors>({});
    const [limitToastShown, setLimitToastShown] = useState(false);
    const [viewModal, setViewModal] = useState(false);

    const nameRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const inquiryRef = useRef<HTMLInputElement>(null);
    const agreementRef = useRef<HTMLDivElement>(null);

    const [isDragging, setIsDragging] = useState(false);
    const [dragY, setDragY] = useState(0); // 현재 드래그된 Y축 거리
    const dragStartY = useRef<number>(0);
    const DRAG_THRESHOLD = 100;

    /** 드래그 시작 (손가락/마우스 누름) */
    const handleDragStart = (e: React.PointerEvent<HTMLElement>) => {
        // e.preventDefault(); // 버튼의 기본 클릭 이벤트를 막을 수 있으므로 주석 처리
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
        dragStartY.current = e.clientY;
        setIsDragging(true); // "드래그 중" 상태로 변경
    };
    /** 드래그 중 (손가락/마우스 이동) */
    const handleDragMove = (e: React.PointerEvent<HTMLElement>) => {
        if (!isDragging) return; // 드래그 중이 아니면 무시

        e.preventDefault(); // 페이지 스크롤 방지
        const currentY = e.clientY;
        const deltaY = currentY - dragStartY.current;

        // 1. 아래로만 드래그되도록 (위로 올리는 건 무시)
        // 2. 모달이 따라오는 느낌을 주기 위해 dragY 상태 업데이트
        setDragY(Math.max(0, deltaY));
    };
    /** 드래그 종료 (손가락/마우스 뗌) */
    const handleDragEnd = (e: React.PointerEvent<HTMLElement>) => {
        if (!isDragging) return;

        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
        setIsDragging(false); // "드래그 종료" 상태

        // 1. 닫기 기준(THRESHOLD)을 넘었는지 확인
        if (dragY > DRAG_THRESHOLD) {
            setViewModal(false); // 모달 닫기
        }

        // 2. 기준을 넘지 않았으면 원위치로 스냅백
        //    (기준을 넘었어도 닫히기 전 상태를 리셋)
        setDragY(0);
        dragStartY.current = 0;
    };

    // 480px 미만인지 여부를 저장합니다. (기본값: false)
    const [isMobileView, setIsMobileView] = useState(false);
    useEffect(() => {
        const MOBILE_WIDTH_THRESHOLD = 480;

        const checkIsMobile = () => {
            return window.innerWidth < MOBILE_WIDTH_THRESHOLD;
        };

        // 1. 컴포넌트가 클라이언트에 마운트될 때 초기 상태 설정
        setIsMobileView(checkIsMobile());

        // 2. 창 크기가 변경될 때마다 상태 업데이트
        const handleResize = () => {
            setIsMobileView(checkIsMobile());
        };

        window.addEventListener('resize', handleResize);

        // 3. 컴포넌트 언마운트 시 이벤트 리스너 제거 (메모리 누수 방지)
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    /** 이름 유효성 검사 (2~30자, 한글/영문/공백) */
    const validateName = (name: string) => {
        const regex = /^[a-zA-Z가-힣\s]{2,30}$/;
        return regex.test(name);
    };

    /** 전화번호 유효성 검사 (010-XXXX-XXXX) */
    const validatePhone = (phone: string) => {
        const regex = /^\d{2,4}-\d{3,4}-\d{4}$/;
        return regex.test(phone);
    };

    const formatPhoneNumber = (value: string) => {
        const d = value.replace(/[^\d]/g, ''); // 숫자만 추출

        if (d.startsWith('02')) {
            // 서울: 02-XXX-XXXX (9자리) or 02-XXXX-XXXX (10자리)
            if (d.length <= 2) return d; // 02
            if (d.length <= 5) return `${d.slice(0, 2)}-${d.slice(2)}`; // 02-123
            if (d.length === 9) return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`; // 02-123-4567
            if (d.length > 9) return `${d.slice(0, 2)}-${d.slice(2, 6)}-${d.slice(6, 10)}`; // 02-1234-5678 (10자리)
            // 6~8자리 입력 중: 9자리 형식으로 우선 적용
            return `${d.slice(0, 2)}-${d.slice(2, 5)}-${d.slice(5)}`; // 02-123-456
        } else if (d.startsWith('010')) {
            // 휴대폰: 010-XXXX-XXXX (11자리)
            if (d.length <= 3) return d;
            if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`; // 010-1234
            return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7, 11)}`; // 010-1234-5678
        } else if (d.startsWith('0507')) {
            // 0507 (안심번호): 0507-XXX-XXXX (11자리)
            if (d.length <= 4) return d; // 0507
            if (d.length <= 8) return `${d.slice(0, 4)}-${d.slice(4)}`; // 0507-1234
            return `${d.slice(0, 4)}-${d.slice(4, 8)}-${d.slice(8, 12)}`; // 0507-1234-5678
        } else if (d.match(/^(0(1[1-9]|3[1-3]|4[1-4]|5[1-5]|6[1-4]))/)) {
            // 기타 3자리 지역번호: 0XX-XXX-XXXX (10자리) or 0XX-XXXX-XXXX (11자리)
            if (d.length <= 3) return d; // 031
            if (d.length <= 6) return `${d.slice(0, 3)}-${d.slice(3)}`; // 031-123
            if (d.length === 10) return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`; // 031-123-4567 (10자리)
            if (d.length > 10) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7, 11)}`; // 031-1234-5678 (11자리)
            // 7~9자리 입력 중: 10자리 형식으로 우선 적용
            return `${d.slice(0, 3)}-${d.slice(3, 6)}-${d.slice(6)}`; // 031-123-456
        }

        // 기타 1588 등
        // 혹은 01X (011, 016 등) - 010과 동일한 11자리로 처리
        if (d.length <= 3) return d;
        if (d.length <= 7) return `${d.slice(0, 3)}-${d.slice(3)}`;
        if (d.length <= 11) return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7, 11)}`;
        return `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7, 11)}`;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        // 폼의 기본 동작(페이지 새로고침) 방지
        e.preventDefault();
        const newErrors: FormErrors = {};
        let hasError = false;

        if (!name.trim()) {
            newErrors.name = '성함을 입력해주세요.';
            if (!hasError) {
                toast(newErrors.name);
                nameRef.current?.focus();
            }
            hasError = true;
        } else if (!validateName(name.trim())) {
            newErrors.name = '올바른 성함(2~30자, 한글/영문)을 입력해주세요.';
            if (!hasError) {
                toast(newErrors.name);
                nameRef.current?.focus();
            }
            hasError = true;
        }
        if (!phone.trim()) {
            newErrors.phone = '전화번호를 입력해주세요.';
            if (!hasError) {
                toast(newErrors.phone);
                phoneRef.current?.focus();
            }
            hasError = true;
        } else if (!validatePhone(phone.trim())) {
            newErrors.phone = '올바른 전화번호 형식(010-1234-5678)을 입력해주세요.';
            if (!hasError) {
                toast(newErrors.phone);
                phoneRef.current?.focus();
            }
            hasError = true;
        }
        if (!inquiry.trim()) {
            newErrors.inquiry = '문의사항을 입력해주세요.';
            if (!hasError) {
                toast(newErrors.inquiry);
                inquiryRef.current?.focus();
            }
            hasError = true;
        }
        if (!agreement) {
            newErrors.agreement = '개인정보 수집에 동의해주세요.';
            if (!hasError) {
                toast(newErrors.agreement);
                agreementRef.current?.focus();
            }
            hasError = true;
        }

        setErrors(newErrors);
        if (hasError) {
            return;
        }

        toast('문의 등록을 진행하고 있습니다. 잠시만 기다려주세요.');
        setSubmitted(true);

        try {
            const inquiryData = {
                name,
                phoneNumber: phone,
                content: inquiry,
                agreedToPrivacy: agreement,
            };

            await submitInquiry(inquiryData);

            toast('문의 등록이 완료되었습니다.');
            setName('');
            setPhone('');
            setInquiry('');
            setAgreement(false);
            setSubmitted(false);
            setErrors({});
        } catch (error) {
            toast('문의등록에 실패했습니다. 다시 시도해주세요.');
            setSubmitted(false);
        }
    };

    const handleChange = (field: keyof FormErrors) => {
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const handleSuggestionKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (inquiry.length >= 200 && e.key.length === 1 && !limitToastShown) {
            toast('최대 200자까지 입력할 수 있습니다.');
        }
    };

    return (
        <>
            {isMobileView && (
                <>
                    {' '}
                    <div
                        className={`fixed z-998 left-0 top-0 w-full h-full grid place-items-center
                                transition-all duration-500
                                ${
                                    viewModal
                                        ? 'opacity-100 visibility-visible bg-black/50'
                                        : 'opacity-0 visibility-hidden bg-transparent pointer-events-none'
                                }`}
                        // [수정]
                        // 1. (보일 때) opacity-100, visibility-visible, bg-black/50
                        // 2. (숨길 때) opacity-0, visibility-hidden, bg-transparent
                        // 3. (숨길 때) pointer-events-none: 숨겨져 있을 때 클릭 이벤트를 막음
                    ></div>
                    {/* <div
                                className={`fixed z-999 left-0 bottom-0 bg-white w-full rounded-[10px]
                                    transition-all duration-300
                                ${viewModal ? 'translate-y-0' : 'translate-y-150'}`}
                            > */}
                    <div
                        className={`fixed z-999 left-0 bottom-0 bg-white w-full rounded-t-[10px]
                        ${isDragging ? '' : 'transition-transform duration-300'}
                    `}
                        // [수정]
                        // 1. 'translate-y-0', 'translate-y-150' 제거
                        // 2. 드래그 중(isDragging)일 때는 transition을 제거해야 부드럽게 따라옴

                        style={{
                            // 3. style에서 transform을 직접 제어
                            transform: viewModal
                                ? `translateY(${dragY}px)` // 드래그 중인 Y값 적용
                                : 'translateY(100%)', // 닫혔을 때 (150% 대신 100%로 수정)
                        }}
                        onClick={(e) => e.stopPropagation()} // 배경 클릭 시 닫힘 방지
                    >
                        <div className='w-full h-9 py-2 grid place-items-center'>
                            <button
                                onPointerDown={handleDragStart}
                                onPointerMove={handleDragMove}
                                onPointerUp={handleDragEnd}
                                onPointerCancel={handleDragEnd} // 드래그가 비정상적으로 취소될 때 (예: 알림)
                                className='cursor-grab active:cursor-grabbing touch-none w-full h-full grid place-items-center'
                            >
                                <Image
                                    src='/images/icons/drag-handle-icon.svg'
                                    alt='close'
                                    width={32}
                                    height={4}
                                    className='w-8 h-1'
                                />
                            </button>
                        </div>
                        <div className='px-5 pt-2 pb-5'>
                            <h2 className='text-title-s-22-2 text-gray-800 mb-6'>개인정보 수집 및 이용 동의</h2>
                            <p className='mb-8'>
                                수집하는 개인정보의 항목, 개인정보의 수집 및 이용 목적, 개인정보의 보유 및 이용 기간을
                                안내해 드리오니 자세히 읽으신 후 동의해 주시기 바랍니다.
                            </p>
                            <h3 className='text-base-l-16-2 text-gray-600 mb-1'>수집 및 이용 목적</h3>
                            <ul className='text-base-l-16-1 text-gray-600 mb-6'>
                                <li className='flex items-center'>
                                    <span className='block w-1 h-1 ml-2 mr-3 rounded-full bg-gray-600'></span>상담 접수
                                    및 처리
                                </li>
                                <li className='flex items-center'>
                                    <span className='block w-1 h-1 ml-2 mr-3 rounded-full bg-gray-600'></span>처리 내역
                                    보관 용도
                                </li>
                            </ul>
                            <h3 className='text-base-l-16-2 text-gray-600 mb-1'>수집항목</h3>
                            <p className='text-base-l-16-1 text-gray-600 mb-6'>
                                (필수) 성함, 전화번호, 기존 서비스 링크
                            </p>
                            <h3 className='text-base-l-16-2 text-gray-600 mb-1'>보관 기간</h3>
                            <p className='text-base-l-16-1 text-gray-600 mb-6'>
                                수집 이용 동의일로부터 12개월 (단, 요청시 삭제)
                            </p>
                            <hr className='text-gray-300 mb-5' />
                            <p className='text-base-m-14-1 text-gray-400'>
                                귀하는 위 개인 정보 수집 및 이용을 거부할 수 있으나, 동의를 거부하실 경우 서비스를
                                이용하실 수 없습니다.
                            </p>
                        </div>
                        <div className='px-5 mb-10'>
                            <button
                                className='bg-primary-600 text-white w-full h-14 rounded-[4px]'
                                onClick={() => {
                                    setAgreement(true);
                                    setErrors((prev) => ({ ...prev, agreement: undefined }));
                                    setViewModal(false);
                                }}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </>
            )}
            {!isMobileView && viewModal && (
                <div className='fixed bg-black/50 z-999 left-0 top-0 w-full h-full grid place-items-center'>
                    <div className='bg-white w-105 rounded-[10px]'>
                        <div className='w-full h-14 px-5 py-4 flex justify-end border-b border-gray-300'>
                            <button onClick={() => setViewModal(false)} className='cursor-pointer'>
                                <Image
                                    src='/images/icons/delete-icon.svg'
                                    alt='close'
                                    width={24}
                                    height={24}
                                    className='w-6 h-6'
                                />
                            </button>
                        </div>
                        <div className='px-5 py-6'>
                            <h2 className='text-center text-base-exl-18-2 text-gray-800 mb-6'>
                                개인정보 수집 및 이용 동의
                            </h2>
                            <p className='mb-8'>
                                수집하는 개인정보의 항목, 개인정보의 수집 및 이용 목적, 개인정보의 보유 및 이용 기간을
                                안내 드리오니 자세히 읽으신 후 동의하여 주시기 바랍니다.
                            </p>
                            <h3 className='text-base-l-16-2 text-gray-600 mb-1'>수집항목</h3>
                            <p className='text-base-l-16-1 text-gray-600 mb-6'>
                                (필수) 성함, 전화번호, 기존 서비스 링크
                            </p>
                            <h3 className='text-base-l-16-2 text-gray-600 mb-1'>보관 기간</h3>
                            <p className='text-base-l-16-1 text-gray-600 mb-6'>
                                수집 이용 동의일로부터 12개월 (단, 요청시 삭제)
                            </p>
                            <hr className='text-gray-300 mb-6' />
                            <p className='text-base-m-14-1 text-gray-400'>
                                귀하는 위 개인 정보 수집 및 이용을 거부할 수 있으나, 동의를 거부하실 경우 서비스를
                                이용하실 수 없습니다.
                            </p>
                        </div>
                        <div className='px-5 py-4'>
                            <button
                                className='border border-gray-300 w-full h-14 rounded-[4px]'
                                onClick={() => {
                                    setAgreement(true);
                                    handleChange('agreement');
                                    setViewModal(false);
                                }}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <section
                id='inquiry-section'
                className='w-full min-w-90 desktop:w-306 desktop:min-w-306 relative px-4 desktop:px-25 mb-15 desktop:mb-50'
            >
                <div className='mb-10 desktop:mb-14 leading-[150%] text-2xl desktop:text-[42px] font-semibold text-gray-800'>
                    <p>1:1 문의하기</p>
                </div>
                <form onSubmit={handleSubmit} noValidate>
                    <div className='grid desktop:grid-cols-3 gap-5 mb-5 desktop:mb-10'>
                        <div>
                            <FormLabel htmlFor='name' required>
                                성함
                            </FormLabel>
                            <div className='relative'>
                                <input
                                    ref={nameRef}
                                    type='text'
                                    id='name'
                                    placeholder='성함을 입력해주세요'
                                    className={`${inputStyles} ${
                                        name.trim() ? 'outline-gray-600' : 'outline-gray-400'
                                    }`}
                                    value={name}
                                    onChange={(e) => {
                                        const nameInput = e.target.value;
                                        setName(nameInput);

                                        if (!nameInput.trim()) {
                                            setErrors((prev) => ({ ...prev, name: '성함을 입력해주세요.' }));
                                        } else if (!validateName(nameInput.trim())) {
                                            setErrors((prev) => ({
                                                ...prev,
                                                name: '2~30자, 한글/영문으로 입력해주세요.',
                                            }));
                                        } else {
                                            setErrors((prev) => ({ ...prev, name: undefined }));
                                        }
                                    }}
                                />
                                <ErrorMessage message={errors.name} />
                            </div>
                        </div>
                        <div>
                            <FormLabel htmlFor='phone' required>
                                전화번호
                            </FormLabel>
                            <div className='relative'>
                                <input
                                    ref={phoneRef}
                                    type='tel'
                                    id='phone'
                                    placeholder='연락 받으실 번호를 입력해주세요'
                                    className={`${inputStyles} ${
                                        phone.trim() ? 'outline-gray-600' : 'outline-gray-400'
                                    }`}
                                    value={phone}
                                    onChange={(e) => {
                                        const formattedPhone = formatPhoneNumber(e.target.value);
                                        setPhone(formattedPhone);

                                        if (!formattedPhone.trim()) {
                                            setErrors((prev) => ({ ...prev, phone: '전화번호를 입력해주세요.' }));
                                        } else if (!validatePhone(formattedPhone.trim())) {
                                            setErrors((prev) => ({
                                                ...prev,
                                                phone: '[010-1234-5678] 형식으로 입력해주세요.',
                                            }));
                                        } else {
                                            setErrors((prev) => ({ ...prev, phone: undefined }));
                                        }
                                    }}
                                />
                                <ErrorMessage message={errors.phone} />
                            </div>
                        </div>
                    </div>
                    <div className='mb-5 desktop:mb-10'>
                        <FormLabel htmlFor='inquiry' required>
                            문의사항
                        </FormLabel>
                        <div className='relative h-[140px]'>
                            <textarea
                                id='inquiry'
                                rows={5}
                                placeholder='문의하고 싶으신 사항이 있으시다면 작성해주세요'
                                className={`w-full rounded-[10px] px-4 py-5 text-base-l-16-1 text-gray-700 resize-none
                                                outline outline-gray-400 placeholder-gray-400 focus:outline-2 focus:outline-primary-400
                                                hover:shadow-level-0 ${
                                                    inquiry.trim() ? 'outline-gray-600' : 'outline-gray-400'
                                                }`}
                                maxLength={200}
                                value={inquiry}
                                onChange={(e) => {
                                    const inquiryInput = e.target.value;
                                    setInquiry(inquiryInput);
                                    if (!inquiryInput.trim()) {
                                        setErrors((prev) => ({ ...prev, inquiry: '문의사항을 입력해주세요.' }));
                                    } else {
                                        setErrors((prev) => ({ ...prev, inquiry: undefined }));
                                    }
                                    if (e.target.value.length < 200) {
                                        setLimitToastShown(false);
                                    }
                                }}
                                onKeyDown={handleSuggestionKeyDown}
                            />
                            <span className='absolute bottom-5 right-5 text-base-l-16-1 text-gray-400'>
                                ({charCount}/200)
                            </span>
                            <ErrorMessage message={errors.inquiry} />
                        </div>
                    </div>
                    <div className='h-6 mb-10 flex items-center'>
                        <div className='relative'>
                            <label htmlFor='agreementInInquiry' className='group flex items-center cursor-pointer'>
                                <input
                                    type='checkbox'
                                    id='agreementInInquiry'
                                    name='agreement'
                                    className='peer hidden'
                                    checked={agreement}
                                    required
                                    onChange={(e) => {
                                        setAgreement(e.target.checked);
                                        handleChange('agreement');
                                    }}
                                />
                                <div
                                    ref={agreementRef}
                                    tabIndex={-1}
                                    className='relative grid h-6 w-6 place-items-center'
                                >
                                    {!agreement && (
                                        <>
                                            <Image
                                                src='/images/icons/unchecked-icon.svg'
                                                alt='check'
                                                width={24}
                                                height={24}
                                                className='group-hover:hidden w-6 h-6'
                                            />
                                            <Image
                                                src='/images/icons/unchecked-icon-hovered.svg'
                                                alt='check'
                                                width={24}
                                                height={24}
                                                className='hidden group-hover:block group-hover:shadow-level-0 w-6 h-6'
                                            />
                                        </>
                                    )}
                                    {agreement && (
                                        <Image
                                            src='/images/icons/checked-icon.svg'
                                            alt='check'
                                            width={24}
                                            height={24}
                                            className=' w-6 h-6'
                                        />
                                    )}
                                </div>

                                <span className='ml-2 text-base-exl-18-1 text-gray-600 mr-2'>
                                    개인정보 수집 및 이용에 동의합니다.
                                </span>
                            </label>
                            <span className='absolute w-40 mt-1 desktop:mt-2 text-base-s-12-1 text-red-500'>
                                {errors.agreement}
                            </span>
                        </div>
                        <button type='button' className='ml-1' onClick={() => setViewModal(true)}>
                            <Image
                                src='/images/icons/right-arrow-icon-dark.svg'
                                alt=''
                                width={24}
                                height={24}
                                className=' w-6 h-6'
                            />
                        </button>
                    </div>
                    <div className='grid place-items-center desktop:place-items-start'>
                        <button
                            type='submit'
                            disabled={submitted}
                            className={`flex items-center justify-center w-29 h-14 rounded-[4px] text-base-l-16-2 text-white
                                            ${
                                                !submitted
                                                    ? 'bg-primary-400 cursor-pointer'
                                                    : 'bg-primary-600 cursor-not-allowed'
                                            } hover:bg-primary-600`}
                        >
                            {!submitted ? (
                                <>
                                    <span className='mr-1'>문의하기</span>
                                    <Image
                                        src='/images/icons/right-arrow-icon.svg'
                                        alt='send'
                                        width={24}
                                        height={24}
                                        className=' w-6 h-6'
                                    />
                                </>
                            ) : (
                                <>
                                    <span className='mr-2'>문의 완료</span>
                                    <Image
                                        src='/images/icons/check-icon.svg'
                                        alt='check'
                                        width={12}
                                        height={9}
                                        className='w-3 h-[9px]'
                                    />
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </section>
        </>
    );
}
