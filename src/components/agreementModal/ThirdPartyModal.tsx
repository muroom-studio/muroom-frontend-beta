// components/modals/PersonalInfoModal.tsx

import Image from 'next/image';
import { useRef } from 'react';

// 모바일 드래그 관련 props를 포함합니다.
interface ThirdPartyModalProps {
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

export default function ThirdPartyModal({
    isOpen,
    onClose,
    onConfirm,
    isMobileView,
    isDragging,
    dragY,
    handleDragStart,
    handleDragMove,
    handleDragEnd,
}: ThirdPartyModalProps) {
    if (!isOpen) return null;

    const title = '[필수] 개인정보 제3자 제공 동의';

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
                        <p className='mb-8'>
                            수집하는 개인정보의 항목, 개인정보의 수집 및 이용 목적, 개인정보의 보유 및 이용 기간을
                            안내해 드리오니 자세히 읽으신 후 동의해 주시기 바랍니다.
                        </p>
                        <h3 className='text-base-l-16-2 text-gray-600 mb-1'>제공받는 자</h3>
                        <p className='text-base-l-16-1 text-gray-600 mb-6'>Muroom 서비스 불특정 다수 이용자</p>
                        <h3 className='text-base-l-16-2 text-gray-600 mb-1'>제공 목적</h3>
                        <ul className='text-base-l-16-1 text-gray-600 mb-6'>
                            <li className='flex items-start'>
                                <div className='h-5 flex items-center'>
                                    <span className='block w-1 h-1 ml-2 mr-3 rounded-full bg-gray-600'></span>
                                </div>
                                (서비스 핵심 기능) 매물 정보를 확인한 이용자가 임대인(사장님)에게 직접 연락하여 계약을
                                문의할 수 있도록 함
                            </li>
                        </ul>
                        <h3 className='text-base-l-16-2 text-gray-600 mb-1'>제공 항목</h3>
                        <p className='text-base-l-16-1 text-gray-600 mb-6'>연락처 (전화번호)</p>
                        <h3 className='text-base-l-16-2 text-gray-600 mb-1'>보유 및 이용 기간</h3>
                        <p className='text-base-l-16-1 text-gray-600 mb-6'>
                            서비스 제공 기간 (매물 등록 동의 철회 시 또는 회원 탈퇴 시)까지
                        </p>
                        <hr className='text-gray-300 mb-5' />
                        <p className='text-base-m-14-1 text-gray-400'>
                            동의를 거부할 권리가 있으며, 거부 시 서비스 이용이 불가능합니다.
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
                    <p className='mb-8'>
                        수집하는 개인정보의 항목, 개인정보의 수집 및 이용 목적, 개인정보의 보유 및 이용 기간을 안내
                        드리오니 자세히 읽으신 후 동의하여 주시기 바랍니다.
                    </p>
                    <h3 className='text-base-l-16-2 text-gray-600 mb-1'>제공받는 자</h3>
                    <p className='text-base-l-16-1 text-gray-600 mb-6'>Muroom 서비스 불특정 다수 이용자</p>
                    <h3 className='text-base-l-16-2 text-gray-600 mb-1'>제공 목적</h3>
                    <ul className='text-base-l-16-1 text-gray-600 mb-6'>
                        <li className='flex items-start'>
                            <div className='h-5 flex items-center'>
                                <span className='block w-1 h-1 ml-2 mr-3 rounded-full bg-gray-600'></span>
                            </div>
                            (서비스 핵심 기능) 매물 정보를 확인한 이용자가 임대인(사장님)에게 직접 연락하여 계약을
                            문의할 수 있도록 함
                        </li>
                    </ul>
                    <h3 className='text-base-l-16-2 text-gray-600 mb-1'>제공 항목</h3>
                    <p className='text-base-l-16-1 text-gray-600 mb-6'>연락처 (전화번호)</p>
                    <h3 className='text-base-l-16-2 text-gray-600 mb-1'>보유 및 이용 기간</h3>
                    <p className='text-base-l-16-1 text-gray-600 mb-6'>
                        서비스 제공 기간 (매물 등록 동의 철회 시 또는 회원 탈퇴 시)까지
                    </p>
                    <hr className='text-gray-300 mb-6' />
                    <p className='text-base-m-14-1 text-gray-400'>
                        동의를 거부할 권리가 있으며, 거부 시 서비스 이용이 불가능합니다.
                    </p>
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
