'use client';

import Image from 'next/image';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useToast } from '../ToastProvider';
import ErrorMessage from '../ErrorMessage';
import dynamic from 'next/dynamic';
import FormLabel from '../FormLabel';
import { FileUploadRequest } from '@/types/api';
import { getPresignedUrls, submitRegistration } from '@/lib/api';
import { SyncLoader } from 'react-spinners';

interface FilePreview {
    url: string;
    type: string;
    name: string;
}

interface FormErrors {
    name?: string;
    phone?: string;
    serviceLink?: string;
    agreement?: string;
}

// 입력 필드 공통 스타일
const inputStyles = `w-full rounded-[10px] px-4 py-4 text-base-l-16-1 text-gray-700 placeholder-gray-400
    outline focus:outline-2 focus:outline-primary-400
    hover:shadow-level-0`;
const MAX_FILES = 10;

const PdfPreview = dynamic(() => import('../PdfPreview'), {
    ssr: false, // 서버 사이드 렌더링 비활성화
    loading: () => (
        <div className='flex h-32 w-32 items-center justify-center bg-gray-100 text-xs'>미리보기 로딩...</div>
    ), // 로딩 중 UI
});

export default function SubmitForm() {
    const toast = useToast();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [serviceLink, setServiceLink] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const charCount = suggestion.length;
    const [agreement, setAgreement] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [roomImages, setRoomImages] = useState<File[]>([]);
    const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
    const [errors, setErrors] = useState<FormErrors>({});
    const [limitToastShown, setLimitToastShown] = useState(false);
    const [viewModal, setViewModal] = useState(false);
    const [loadingSubmit, setLoadingSubmit] = useState(false);

    const nameRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const serviceLinkRef = useRef<HTMLInputElement>(null);
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

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newFiles = e.target.files;

        if (!newFiles || newFiles.length === 0) {
            return;
        }

        const combinedFiles = [...roomImages, ...Array.from(newFiles)];

        if (combinedFiles.length > MAX_FILES) {
            toast(`파일은 최대 ${MAX_FILES}개까지 첨부할 수 있습니다.`);
            e.target.value = '';
            return;
        }

        const newPreviewUrls = Array.from(newFiles).map(
            (file): FilePreview => ({
                url: URL.createObjectURL(file),
                type: file.type,
                name: file.name,
            })
        );

        setRoomImages(combinedFiles);
        setFilePreviews((prevPreviews) => [...prevPreviews, ...newPreviewUrls]);

        e.target.value = '';
    };

    const handleDeleteFile = (indexToRemove: number) => {
        // 1a. 삭제할 미리보기 객체 찾기
        const previewToRemove = filePreviews[indexToRemove];
        if (previewToRemove) {
            // 1b. 메모리에서 Object URL 해제
            URL.revokeObjectURL(previewToRemove.url);
        }

        // 1c. roomImages state 업데이트 (해당 인덱스 제거)
        setRoomImages((prevFiles) => prevFiles.filter((_, index) => index !== indexToRemove));
        // 1d. filePreviews state 업데이트 (해당 인덱스 제거)
        setFilePreviews((prevPreviews) => prevPreviews.filter((_, index) => index !== indexToRemove));
    };
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
        setLoadingSubmit(true);
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
        if (!serviceLink.trim() || !serviceLink.includes('.')) {
            newErrors.serviceLink = '올바른 서비스 링크를 입력해주세요.';
            if (!hasError) {
                toast(newErrors.serviceLink);
                serviceLinkRef.current?.focus();
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
            setLoadingSubmit(false);
            return;
        }

        // setSubmitted(true);
        toast('등록을 진행하고 있습니다. 잠시만 기다려주세요.');

        try {
            let uploadedFileKeys: string[] = [];

            // 1. 이미지 파일이 있는 경우, Presigned URL 요청 및 S3 업로드
            if (roomImages.length > 0) {
                toast('이미지 업로드 준비 중...');
                const fileRequests: FileUploadRequest[] = roomImages.map((file) => ({
                    type: 'BETA_PROPERTY',
                    fileName: file.name,
                    contentType: file.type,
                }));

                const presignedUrlsData = await getPresignedUrls(fileRequests);

                // S3에 파일 업로드 (병렬 처리)
                const uploadPromises = presignedUrlsData.map(async (presignedData, index) => {
                    const file = roomImages[index];
                    if (!file) {
                        return null;
                    }

                    const response = await fetch(presignedData.url, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': file.type,
                        },
                        body: file,
                    });

                    if (!response.ok) {
                        setLoadingSubmit(false);
                        throw new Error(`파일 업로드 실패: ${file.name} - ${response.statusText}`);
                    }

                    return presignedData.fileKey;
                    // await uploadFileToS3(presignedData.url, file);
                    // return presignedData.fileKey;
                });

                const results = await Promise.allSettled(uploadPromises);

                uploadedFileKeys = results
                    .filter((result) => result.status === 'fulfilled' && result.value !== null)
                    .map((result) => (result as PromiseFulfilledResult<string>).value);

                // 모든 파일이 성공적으로 업로드되지 않았다면 에러 처리
                if (uploadedFileKeys.length !== roomImages.length) {
                    setLoadingSubmit(false);
                    throw new Error('일부 이미지 파일 업로드에 실패했습니다.');
                }
            }

            // 2. 최종 폼 데이터 제출
            const submissionData = {
                name,
                phoneNumber: phone, // formatPhoneNumber로 이미 처리된 상태
                thirdPartyUrl: serviceLink,
                agreedToPrivacy: agreement,
                featureSuggestions: suggestion,
                introductoryImageFileKeys: uploadedFileKeys, // S3에 업로드된 파일들의 키
            };

            await submitRegistration(submissionData);

            setLoadingSubmit(false);
            setSubmitted(true);
            toast('등록이 완료되었습니다.');
            // 성공 시 폼 초기화 등의 추가 작업 가능
            setTimeout(() => {
                setName('');
                setPhone('');
                setServiceLink('');
                setSuggestion('');
                setAgreement(false);
                setRoomImages([]);
                setFilePreviews([]);
                setSubmitted(false);
                setErrors({});
            }, 3000);
        } catch (_error) {
            toast('등록에 실패했습니다. 다시 시도해주세요.');
            setLoadingSubmit(false);
            setSubmitted(false);
        }
    };

    const handleSuggestionKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
        if (suggestion.length >= 200 && e.key.length === 1 && !limitToastShown) {
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
                                    <span className='block w-1 h-1 ml-2 mr-3 rounded-full bg-gray-600'></span>페이지 내
                                    매물 등록
                                </li>
                                <li className='flex items-center'>
                                    <span className='block w-1 h-1 ml-2 mr-3 rounded-full bg-gray-600'></span>상담 접수
                                    및 처리
                                </li>
                                <li className='flex items-center'>
                                    <span className='block w-1 h-1 ml-2 mr-3 rounded-full bg-gray-600'></span>처리 내역
                                    보관 용도
                                </li>
                                <li className='flex items-center'>
                                    <span className='block w-1 h-1 ml-2 mr-3 rounded-full bg-gray-600'></span>중복 상담
                                    확인
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
                            <h3 className='text-base-l-16-2 text-gray-600 mb-1'>수집 및 이용 목적</h3>
                            <ul className='text-base-l-16-1 text-gray-600 mb-6'>
                                <li className='flex items-center'>
                                    <span className='block w-1 h-1 ml-2 mr-3 rounded-full bg-gray-600'></span>페이지 내
                                    매물 등록
                                </li>
                                <li className='flex items-center'>
                                    <span className='block w-1 h-1 ml-2 mr-3 rounded-full bg-gray-600'></span>상담 접수
                                    및 처리
                                </li>
                                <li className='flex items-center'>
                                    <span className='block w-1 h-1 ml-2 mr-3 rounded-full bg-gray-600'></span>처리 내역
                                    보관 용도
                                </li>
                                <li className='flex items-center'>
                                    <span className='block w-1 h-1 ml-2 mr-3 rounded-full bg-gray-600'></span>중복 상담
                                    확인
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
                                    setErrors((prev) => ({ ...prev, agreement: undefined }));
                                    setViewModal(false);
                                }}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <form className='px-4 desktop:px-43.5' onSubmit={handleSubmit} noValidate>
                {/* <Toaster position='top-center' /> */}
                <h1 className='text-title-s-22-1 text-gray-800 mb-10'>등록정보</h1>

                <div className='grid desktop:grid-cols-2 gap-5 mb-5 desktop:mb-10'>
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
                                className={`${inputStyles} ${name.trim() ? 'outline-gray-600' : 'outline-gray-400'}`}
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
                                placeholder='기존 서비스에 등록한 번호로 입력해주세요'
                                className={`${inputStyles} ${phone.trim() ? 'outline-gray-600' : 'outline-gray-400'}`}
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
                    <FormLabel htmlFor='serviceLink' required>
                        기존 서비스 링크
                    </FormLabel>
                    <div className='group relative'>
                        <Image
                            src='/images/icons/link-icon.svg'
                            alt='link'
                            width={20}
                            height={20}
                            className={`absolute left-3 desktop:left-4 top-1/2 -translate-y-1/2 w-5 h-5
                        duration-300 group-hover:opacity-0 group-focus-within:opacity-0 ${
                            serviceLink.trim() ? 'opacity-0' : 'opacity-100'
                        }`}
                        />
                        <input
                            ref={serviceLinkRef}
                            id='serviceLink'
                            placeholder='등록하신 기존 서비스 링크를 입력해주세요'
                            className={`${inputStyles} ${
                                serviceLink.trim() ? 'outline-gray-600 ' : 'outline-gray-400 pl-9 desktop:pl-11'
                            }
                        duration-300 group-hover:pl-4 focus:pl-4`}
                            value={serviceLink}
                            onChange={(e) => {
                                const serviceLinkInput = e.target.value;
                                setServiceLink(serviceLinkInput);

                                if (!serviceLinkInput.trim()) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        serviceLink: '올바른 서비스 링크를 입력해주세요.',
                                    }));
                                } else if (!serviceLinkInput.includes('.')) {
                                    setErrors((prev) => ({
                                        ...prev,
                                        serviceLink: '올바른 서비스 링크를 입력해주세요.',
                                    }));
                                } else {
                                    setErrors((prev) => ({ ...prev, serviceLink: undefined }));
                                }
                            }}
                        />
                        <ErrorMessage message={errors.serviceLink} />
                    </div>
                </div>

                <div className='mb-5 desktop:mb-10'>
                    <FormLabel htmlFor='roomImage'>작업실 정보 이미지</FormLabel>
                    <div className='hidden desktop:flex items-center justify-between'>
                        <span className='-mt-1 mb-2 text-base-l-16-1 text-gray-400'>
                            등록하신 기존 서비스에 올리셨던 작업실 정보가 포함된 이미지
                        </span>
                        <div className='w-[33px] flex items-center justify-around -mt-1 mb-2 text-base-l-16-1'>
                            <span className='text-gray-600'>{filePreviews.length}</span>
                            <span className='text-gray-400'>/</span>
                            <span className='text-gray-400'>10</span>
                        </div>
                    </div>
                    <div
                        className={`relative flex flex-col items-center justify-center
                        rounded-lg text-base-l-16-1 text-gray-600 overflow-hidden
                        border ${
                            filePreviews.length == 0
                                ? 'hover:shadow-level-0 border-dashed border-gray-400'
                                : 'border-gray-600'
                        }`}
                    >
                        {filePreviews.length === 0 ? (
                            <label
                                htmlFor='file-upload'
                                className='grid place-items-center w-full h-full py-10 cursor-pointer'
                            >
                                <Image
                                    src='/images/icons/upload-file-icon.svg'
                                    alt='+'
                                    width={72}
                                    height={72}
                                    className='mb-3 w-[72px] h-[72px]'
                                />
                                <p className='text-base-l-16-1 text-gray-600'>png, pdf, jpg, jpeg 등</p>
                            </label>
                        ) : (
                            <div className='relative flex h-full w-full items-center gap-5 px-5 py-10 overflow-hidden'>
                                <div className='flex gap-5 overflow-x-auto mr-37.5 no-scrollbar'>
                                    {filePreviews.map((preview, index) => (
                                        <div key={index} className='relative'>
                                            <div className='w-32.5 h-32.5 shrink-0 rounded-[4px] outline outline-gray-100 overflow-hidden cursor-default'>
                                                {preview.type.startsWith('image/') ? (
                                                    <Image
                                                        src={preview.url}
                                                        alt={`업로드 미리보기 ${index + 1}`}
                                                        layout='fill'
                                                        objectFit='cover'
                                                        className='rounded-[4px] w-auto h-auto'
                                                    />
                                                ) : (
                                                    <PdfPreview fileUrl={preview.url} />
                                                )}
                                            </div>
                                            <button
                                                type='button'
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    handleDeleteFile(index);
                                                }}
                                                className='absolute top-1 right-1 p-1 rounded-full cursor-pointer bg-white border-[0.5px] border-gray-300'
                                            >
                                                <Image
                                                    src='/images/icons/delete-icon.svg'
                                                    alt='delete'
                                                    width={12}
                                                    height={12}
                                                    className='w-3 h-3'
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <label
                                    htmlFor='file-upload'
                                    className='absolute right-0 w-42.5 h-32.5 grid place-items-center bg-white cursor-pointer'
                                >
                                    <div
                                        className='w-32.5 h-32.5 rounded-[4px] border border-gray-300 border-dashed flex flex-col items-center justify-center
                                    hover:shadow-level-0'
                                    >
                                        <Image
                                            src='/images/icons/add-file-circular-icon.svg'
                                            alt='add file'
                                            width={22}
                                            height={22}
                                            className='mb-4 w-[22px] h-[22px]'
                                        />
                                        <p className='text-base-s-12-1 text-gray-600'>png, pdf, jpg, jpeg 등</p>
                                    </div>
                                </label>
                            </div>
                        )}
                    </div>

                    <input
                        id='file-upload'
                        type='file'
                        multiple
                        className='hidden'
                        onChange={handleFileChange}
                        accept='image/*, application/pdf'
                    />
                </div>

                <div className='mb-9 desktop:mb-20'>
                    <FormLabel htmlFor='suggestion'>기능제안</FormLabel>
                    <div className='relative'>
                        <textarea
                            id='suggestion'
                            rows={5}
                            placeholder='추가하고 싶으신 기능이 있으시다면 작성해주세요'
                            className={`w-full rounded-[10px] px-4 py-5 text-base-l-16-1 text-gray-700 resize-none whitespace-pre-line break-keep
                            outline outline-gray-400 placeholder-gray-400 focus:outline-2 focus:outline-primary-400
                            hover:shadow-level-0 ${suggestion.trim() ? 'outline-gray-600' : 'outline-gray-400'}`}
                            maxLength={200}
                            value={suggestion}
                            onChange={(e) => {
                                setSuggestion(e.target.value);
                                if (e.target.value.length < 200) {
                                    setLimitToastShown(false);
                                }
                            }}
                            onKeyDown={handleSuggestionKeyDown}
                        />
                        <span className='absolute bottom-5 right-5 text-base-l-16-1 text-gray-400'>
                            ({charCount}/200)
                        </span>
                    </div>
                </div>

                <div className='mb-20'>
                    <div className='mb-5 desktop:mb-10 flex items-center'>
                        <h2 className='text-title-s-22-2 text-gray-800'>개인정보 수집 동의</h2>
                        <button type='button' className='ml-1 cursor-pointer' onClick={() => setViewModal(true)}>
                            <Image
                                src='/images/icons/right-arrow-icon-dark.svg'
                                alt=''
                                width={24}
                                height={24}
                                className='w-6 h-6'
                            />
                        </button>
                    </div>
                    <p className='mb-1 text-base-exl-18-1 text-gray-600'>
                        뮤룸이 상단에 나와있는 사장님의 개인데이터를 처리하는데 동의하시겠습니까?
                    </p>
                    <p className='mb-5 text-base-l-16-1 text-gray-400'>
                        *제공해주신 개인데이터는 매물 등록을 위한 목적 외에는 사용되지 않습니다.
                    </p>

                    <div className='mb-10'>
                        <label htmlFor='agreementInSubmitForm' className='group w-30 flex items-center cursor-pointer'>
                            <input
                                type='checkbox'
                                checked={agreement}
                                id='agreementInSubmitForm'
                                name='agreement'
                                className='peer hidden'
                                required
                                onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    setAgreement(isChecked);

                                    if (!isChecked) {
                                        setErrors((prev) => ({ ...prev, agreement: '개인정보 수집에 동의해주세요.' }));
                                    } else {
                                        setErrors((prev) => ({ ...prev, agreement: undefined }));
                                    }
                                }}
                            />
                            <div
                                ref={agreementRef}
                                tabIndex={-1}
                                className='relative grid h-6 w-6 place-items-center bg-white'
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

                            <span className='ml-2 text-base-l-16-1 text-gray-600'>동의합니다</span>
                        </label>
                        <span className='mt-2 text-base-s-12-1 text-red-500'>{errors.agreement}</span>
                    </div>

                    <div className='grid place-items-center'>
                        <button
                            type='submit'
                            disabled={submitted || loadingSubmit}
                            className={`flex items-center justify-center w-29 h-14 rounded-[4px] text-base-l-16-2 text-white
                            hover:bg-primary-600
                            ${
                                !submitted && !loadingSubmit
                                    ? 'bg-primary-400 cursor-pointer'
                                    : 'bg-primary-600 cursor-not-allowed'
                            }
                            `}
                        >
                            {!submitted ? (
                                !loadingSubmit ? (
                                    <>
                                        <span className='mr-1'>등록하기</span>
                                        <Image
                                            src='/images/icons/right-arrow-icon.svg'
                                            alt='send'
                                            width={24}
                                            height={24}
                                            className=' w-6 h-6'
                                        />
                                    </>
                                ) : (
                                    <SyncLoader size={8} margin={3} color='#ffffff' speedMultiplier={0.7} />
                                )
                            ) : (
                                <>
                                    <span className='mr-2'>등록 완료</span>
                                    <Image
                                        src='/images/icons/check-icon.svg'
                                        alt='check'
                                        width={12}
                                        height={9}
                                        className=' w-3 h-[9px]'
                                    />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </form>
        </>
    );
}
