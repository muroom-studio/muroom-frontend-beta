// components/modals/PersonalInfoModal.tsx

import Image from 'next/image';
import { useRef } from 'react';

// 모바일 드래그 관련 props를 포함합니다.
interface MarketingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isMobileView: boolean;

    // 모바일 드래그 관련 props
    isDragging: boolean;
    dragY: number;
    handleDragStart: (e: React.PointerEvent<HTMLElement>) => void;
    handleDragMove: (e: React.PointerEvent<HTMLElement>) => void;
    handleDragEnd: (e: React.PointerEvent<HTMLElement>) => void;
}

export default function MarketingModal({
    isOpen,
    onClose,
    onConfirm,
    isMobileView,
    isDragging,
    dragY,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
}: MarketingModalProps) {
    if (!isOpen) return null;

    const title = '[선택] 마케팅 정보 수신 동의';

    // 모바일 뷰 (드래그 가능한 바텀 시트)
    if (isMobileView) {
        return (
            <>
                <div
                    className={`fixed z-998 left-0 top-0 w-full h-full grid place-items-center
                        transition-all duration-500
                        ${
                            isOpen
                                ? 'opacity-100 visibility-visible bg-black/50'
                                : 'opacity-0 visibility-hidden bg-transparent pointer-events-none'
                        }`}
                ></div>
                <div
                    className={`fixed z-999 left-0 bottom-0 bg-white w-full rounded-t-[10px]
                        ${isDragging ? '' : 'transition-transform duration-300'}
                    `}
                    style={{
                        transform: isOpen ? `translateY(${dragY}px)` : 'translateY(100%)',
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className='w-full h-9 py-2 grid place-items-center'>
                        <button
                            onPointerDown={handleDragStart}
                            onPointerMove={handleDragMove}
                            onPointerUp={handleDragEnd}
                            onPointerCancel={handleDragEnd}
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
                        <h2 className='text-title-s-22-2 text-gray-800 mb-6'>{title}</h2>
                        <p className=''>
                            Muroom의 새로운 소식, 이벤트 및 광고성 정보를 (문자, 이메일 등)으로 수신합니다.
                        </p>
                    </div>
                    <div className='px-5 mb-10'>
                        <button className='bg-primary-600 text-white w-full h-14 rounded-[4px]' onClick={onConfirm}>
                            확인
                        </button>
                    </div>
                </div>
            </>
        );
    }

    // 데스크톱 뷰
    return (
        <div className='fixed bg-black/50 z-998 left-0 top-0 w-full h-full grid place-items-center'>
            <div className='bg-white w-105 rounded-[10px]'>
                <div className='w-full h-14 px-5 py-4 flex justify-end border-b border-gray-300'>
                    <button onClick={onClose} className='cursor-pointer'>
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
                    <h2 className='text-center text-base-exl-18-2 text-gray-800 mb-6'>{title}</h2>
                    <p className=''>Muroom의 새로운 소식, 이벤트 및 광고성 정보를 (문자, 이메일 등)으로 수신합니다.</p>
                </div>
                <div className='px-5 py-4'>
                    <button className='border border-gray-300 w-full h-14 rounded-[4px]' onClick={onConfirm}>
                        확인
                    </button>
                </div>
            </div>
        </div>
    );
}
