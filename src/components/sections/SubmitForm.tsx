'use client';

import { FileIcon } from 'lucide-react';
import Image from 'next/image';
import { ChangeEvent, ReactNode, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';

interface FormLabelProps {
    htmlFor: string;
    children: ReactNode;
    required?: boolean;
}

interface FilePreview {
    url: string;
    type: string;
    name: string;
}

const FormLabel = ({ htmlFor, children, required = false }: FormLabelProps) => (
    <label htmlFor={htmlFor} className='flex items-center text-base-exl-18-2 text-gray-800 mb-2'>
        <span className='mr-1'>{children}</span>
        {required && <Image src='/images/icons/essential-icon.svg' alt='essential' width={16} height={16} />}
    </label>
);

// 입력 필드 공통 스타일
const inputStyles =
    'w-full rounded-[10px] outline outline-gray-400 px-4 py-4 text-base-l-16-1 text-gray-700 placeholder-gray-400 focus:outline-2 focus:outline-primary-400';
const MAX_FILES = 10;

export default function SubmitForm() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [serviceLink, setServiceLink] = useState('');
    const [suggestion, setSuggestion] = useState('');
    const [agreement, setAgreement] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [roomImages, setRoomImages] = useState<FileList | null>(null);
    const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);

    const nameRef = useRef<HTMLInputElement>(null);
    const phoneRef = useRef<HTMLInputElement>(null);
    const serviceLinkRef = useRef<HTMLInputElement>(null);
    const agreementRef = useRef<HTMLInputElement>(null);

    const charCount = suggestion.length;

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;

        if (!files || files.length === 0) {
            setRoomImages(null);
            setFilePreviews([]);
            return;
        }

        // 6. 파일 개수 제한 검사
        if (files.length > MAX_FILES) {
            toast.error(`파일은 최대 ${MAX_FILES}개까지 첨부할 수 있습니다.`);
            e.target.value = ''; // input 값 초기화
            return;
        }

        // (중요) 기존 미리보기 URL 메모리 해제
        filePreviews.forEach((file) => URL.revokeObjectURL(file.url));

        // state에 파일 리스트와 미리보기 URL 저장
        setRoomImages(files);

        const newPreviewUrls = Array.from(files).map(
            (file): FilePreview => ({
                url: URL.createObjectURL(file),
                type: file.type,
                name: file.name,
            })
        );

        setFilePreviews(newPreviewUrls);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        // 폼의 기본 동작(페이지 새로고침) 방지
        e.preventDefault();

        if (!name.trim()) {
            toast.error('성함을 입력해주세요.');
            nameRef.current?.focus();
            return;
        }
        if (!phone.trim()) {
            toast.error('전화번호를 입력해주세요.');
            phoneRef.current?.focus();
            return;
        }
        if (!serviceLink.trim() || !serviceLink.includes('.')) {
            toast.error('올바른 서비스 링크를 입력해주세요.');
            serviceLinkRef.current?.focus();
            return;
        }
        if (!agreement) {
            toast.error('개인정보 수집에 동의해주세요.');
            agreementRef.current?.focus();
            return;
        }

        toast.success('전송이 완료되었습니다.');
        setSubmitted(true);

        const formData = {
            name,
            phone,
            serviceLink,
            suggestion,
            // 실제 파일 업로드는 new FormData()를 사용해야 합니다.
            roomImages: roomImages ? Array.from(roomImages).map((file) => file.name) : [],
        };
        console.log('제출할 데이터:', formData);
    };

    return (
        <form className='px-43.5' onSubmit={handleSubmit} noValidate>
            <Toaster position='top-center' />
            <h1 className='text-title-s-22-1 text-gray-800 mb-10'>등록정보</h1>

            <div className='grid grid-cols-2 gap-5 mb-10'>
                <div>
                    <FormLabel htmlFor='name' required>
                        성함
                    </FormLabel>
                    <input
                        ref={nameRef}
                        type='text'
                        id='name'
                        placeholder='이름을 입력해주세요'
                        className={inputStyles}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <FormLabel htmlFor='phone' required>
                        전화번호
                    </FormLabel>
                    <input
                        ref={phoneRef}
                        type='tel'
                        id='phone'
                        placeholder='-를 빼고 입력해주세요'
                        className={inputStyles}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
            </div>

            <div className='mb-10'>
                <FormLabel htmlFor='serviceLink' required>
                    기존 서비스 링크
                </FormLabel>
                <div className='relative'>
                    <Image
                        src='/images/icons/link-icon.svg'
                        alt='link'
                        width={20}
                        height={20}
                        className='absolute left-4 top-1/2 -translate-y-1/2'
                    />
                    <input
                        ref={serviceLinkRef}
                        id='serviceLink'
                        placeholder='등록하실 기존 서비스 링크를 입력해주세요'
                        className={`${inputStyles} pl-11`}
                        value={serviceLink}
                        onChange={(e) => setServiceLink(e.target.value)}
                    />
                </div>
            </div>

            <div className='mb-10'>
                <FormLabel htmlFor='roomImage'>작업실 정보 이미지</FormLabel>
                <label
                    htmlFor='file-upload'
                    className='
                    flex flex-col items-center justify-center h-45 cursor-pointer
                    rounded-lg border-2 border-dashed border-gray-300 bg-gray-50
                    hover:bg-primary-50 hover:border-primary-300
                    text-base-l-16-1 text-gray-400 hover:text-primary-400
                    overflow-hidden
                    '
                >
                    {filePreviews.length === 0 ? (
                        <>
                            <div className='mb-3 w-12 h-12 flex items-center justify-center border-2 border-primary-400 rounded-[10px]'>
                                <Image src='/images/icons/plus-icon.svg' alt='+' width={24} height={24} />
                            </div>
                            <p>서비스에 올리셨던 정보들이 요약된</p>
                            <p>이미지를 첨부해주세요.</p>
                        </>
                    ) : (
                        // Case 2: 파일 있을 때 (미리보기 UI)
                        <div className='flex h-full w-full items-center gap-4 p-4 overflow-x-auto'>
                            {filePreviews.map((preview, index) => (
                                // 각 미리보기 아이템
                                <div
                                    key={index}
                                    className='relative h-32 w-32 shrink-0 rounded-md border border-gray-200'
                                >
                                    {preview.type.startsWith('image/') ? (
                                        <Image
                                            src={preview.url}
                                            alt={`업로드 미리보기 ${index + 1}`}
                                            layout='fill'
                                            objectFit='cover'
                                            className='rounded-md'
                                        />
                                    ) : (
                                        <div className='flex h-full w-full flex-col items-center justify-center gap-2 p-2'>
                                            <Image
                                                src='/images/icons/detail-icon.svg'
                                                alt='file'
                                                width={70}
                                                height={70}
                                            />
                                            <p
                                                className='w-full overflow-x-hidden truncate px-1 text-xs text-gray-700'
                                                title={preview.name}
                                            >
                                                {preview.name.slice(0, 15)}... .{preview.type.split('/').pop()}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </label>
                <input
                    id='file-upload'
                    type='file'
                    multiple
                    className='hidden'
                    onChange={handleFileChange}
                    accept='image/*, application/pdf'
                />
            </div>

            <div className='mb-20'>
                <FormLabel htmlFor='suggestion'>기능제안</FormLabel>
                <div className='relative'>
                    <textarea
                        id='suggestion'
                        rows={5}
                        placeholder='추가하고 싶으신 기능이 있으시다면 작성해주세요.'
                        className={`w-full rounded-[10px] px-4 py-5 text-base-l-16-1 text-gray-700 resize-none
                            outline outline-gray-400 placeholder-gray-400 focus:outline-2 focus:outline-primary-400`}
                        maxLength={200}
                        value={suggestion}
                        onChange={(e) => setSuggestion(e.target.value)}
                    />
                    <span className='absolute bottom-5 right-5 text-base-l-16-1 text-gray-400'>({charCount}/200)</span>
                </div>
            </div>

            <div className='mb-10'>
                <h2 className='mb-10 text-title-s-22-2 text-gray-800'>개인정보 수집 동의</h2>
                <p className='mb-1 text-base-exl-18-1 text-gray-600'>
                    뮤룸이 상단에 나와있는 사장님의 개인데이터를 처리하는데 동의하시겠습니까?
                </p>
                <p className='mb-5 text-base-l-16-1 text-gray-400'>
                    *제공해주신 개인데이터는 매물 등록을 위한 목적 외에는 사용되지 않습니다.
                </p>

                <div className='mb-10'>
                    <label htmlFor='agreement' className='w-30 flex items-center cursor-pointer'>
                        <input
                            ref={agreementRef}
                            type='checkbox'
                            id='agreement'
                            name='agreement'
                            className='peer hidden'
                            required
                            onChange={(e) => setAgreement(e.target.checked)}
                        />
                        <div
                            className='
                                relative grid h-6 w-6 place-items-center 
                                rounded-md border border-gray-400 bg-white
                                transition-all
                                peer-checked:border-primary-500
                                peer-checked:bg-primary-500
                            '
                        >
                            {agreement && (
                                <Image src='/images/icons/check-icon.svg' alt='check' width={12} height={9} />
                            )}
                        </div>

                        <span className='ml-2 text-base-l-16-1 text-gray-600'>동의합니다</span>
                    </label>
                </div>

                <div className='grid place-items-center'>
                    <button
                        type='submit'
                        disabled={submitted}
                        className={`flex items-center justify-center w-29 h-14 rounded-[4px] text-base-l-16-2 text-white
                        ${
                            !submitted ? 'bg-primary-400 cursor-pointer' : 'bg-primary-600 cursor-not-allowed'
                        } hover:bg-primary-600`}
                    >
                        {!submitted ? (
                            <>
                                <span className='mr-1'>전송하기</span>
                                <Image src='/images/icons/right-arrow-icon.svg' alt='send' width={24} height={24} />
                            </>
                        ) : (
                            <>
                                <span className='mr-2'>전송 완료</span>
                                <Image src='/images/icons/check-icon.svg' alt='check' width={12} height={9} />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </form>
    );
}
