import Image from 'next/image';
import AnimatedCounter from '../AnimatedCounter';
import { getRemainingCount } from '@/lib/api';
import { useEffect, useState } from 'react';
import { SyncLoader } from 'react-spinners';
import { useToast } from '../ToastProvider';
import { useInView } from 'react-intersection-observer';

export default function EventSection() {
    const toast = useToast();
    const [remainingCount, setRemainingCount] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1. 데스크탑 카운터 전용 useInView 훅
    const { ref: desktopCounterRef, inView: isDesktopCounterVisible } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    // 2. 모바일 카운터 전용 useInView 훅
    const { ref: mobileCounterRef, inView: isMobileCounterVisible } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    useEffect(() => {
        // 데스크톱 또는 모바일 카운터가 화면에 보이기 시작했다면
        if (isDesktopCounterVisible || isMobileCounterVisible) {
            // *중요*: 이미 로딩 중이거나, 데이터를 가져왔거나, 에러가 있다면 중복 호출 방지
            if (isLoading || remainingCount !== null || error !== null) {
                return;
            }

            const fetchCount = async () => {
                try {
                    // 3. API 호출 '직전'에 로딩 상태를 true로 설정
                    setIsLoading(true);
                    const count = await getRemainingCount();
                    setRemainingCount(count);
                } catch (err) {
                    console.error('Failed to fetch remaining count:', err);
                    setError(`이벤트 참가자 수를\n불러오는데 실패했습니다.`);
                    // 4. 에러도 '이때' 발생하므로 토스트가 제때 뜹니다.
                    toast('이벤트 참가자 수를 불러오는 데 실패했습니다.');
                } finally {
                    setIsLoading(false);
                }
            };

            fetchCount();
        }
        // 5. 이 Effect가 의존하는 모든 상태를 배열에 추가합니다.
    }, [isDesktopCounterVisible, isMobileCounterVisible, isLoading, remainingCount, error, toast]);

    return (
        <section
            id='event-section'
            className='w-full min-w-90 desktop:w-306 desktop:min-w-306 relative px-4 desktop:px-25'
        >
            <div className='hidden desktop:block relative'>
                <div className={`${remainingCount !== null && remainingCount === 0 ? 'blur-xs' : ''}`}>
                    <div className='mb-10 text-center leading-[140%] text-2xl desktop:text-5xl font-bold text-gray-800'>
                        <p>지금 등록하면,</p>
                        <p>
                            <span className='text-primary-500'>3만명 팔로워 음악전문 채널의 광고혜택</span>을
                        </p>
                        <p className='mb-10'>받을 수 있어요!</p>
                    </div>
                    <div className='text-base-exl-18-1 text-gray-600 mb-10 text-center'>
                        <p>
                            음악인을 위한 전문 커뮤니티 ‘buv’, ‘GROUNZ 그라운즈’ 인스타그램 피드와 스토리에 내 작업실
                            무료 홍보 기회
                        </p>
                        <p>
                            <span className='text-base-exl-18-2'>약 3만명의 팔로워를 보유한 채널</span>에 내 작업실을
                            소개하는 피드를 무료로 홍보해보세요!
                        </p>
                    </div>
                    <Image
                        src='/images/instagram-event-banner.svg'
                        alt='event'
                        width={1132}
                        height={614}
                        className='mb-25'
                    />
                </div>
                {remainingCount !== null && remainingCount === 0 ? (
                    <>
                        <div className='absolute w-full h-[951px] flex items-end justify-center pb-10 bg-white/80 top-0 mb-25'>
                            <p className='font-bold text-title-xl-32-size text-gray-600'>
                                선착순 이벤트가 종료되었습니다. 성원에 감사드립니다.
                            </p>
                        </div>
                        <div className='text-center mb-35 leading-[140%] text-2xl desktop:text-5xl font-bold text-gray-800'>
                            <p>대신 11월 30일까지 등록하신 사장님께는</p>
                            <p>
                                <span className='text-primary-600'>30만원 상당의 뮤룸 내 광고 배너 이용권</span>을
                                드립니다.
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='w-full grid place-items-center text-gray-600 mb-10'>
                            <div className='w-[811px] flex flex-col'>
                                <p className='font-semibold text-[18px] leading-[22px]'>홍보 방법</p>
                                <div className='flex items-start justify-start'>
                                    <div className='h-6 grid place-items-center mr-2.5'>
                                        <span className='inline-block w-1 h-1 bg-gray-600 rounded-full'></span>
                                    </div>
                                    <p className='whitespace-pre-line break-keep'>
                                        {`등록해주신 작업실 사진과 주소로 "가성비 좋은 작업실", "분위기 좋은 작업실" 등\nGROUNZ 인스타그램 피드와 BUV 인스타그램 스토리에 홍보`}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='w-full grid place-items-center text-gray-600 mb-10'>
                            <div className='w-[811px] flex flex-col'>
                                <p className='font-semibold text-[18px] leading-[22px]'>업로드 일시</p>
                                <div className='flex items-start justify-start'>
                                    <div className='h-6 grid place-items-center mr-2.5'>
                                        <span className='inline-block w-1 h-1 bg-gray-600 rounded-full'></span>
                                    </div>
                                    <p className='whitespace-pre-line break-keep'>
                                        {`12월 8일(월), 12월 15일(월), 12월 22일(월)`}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='w-full grid place-items-center text-gray-600 mb-10'>
                            <div className='w-[811px] flex flex-col'>
                                <p className='font-semibold text-[18px] leading-[22px]'>대상</p>
                                <div className='flex items-start justify-start'>
                                    <div className='h-6 grid place-items-center mr-2.5'>
                                        <span className='inline-block w-1 h-1 bg-gray-600 rounded-full'></span>
                                    </div>
                                    <p className='whitespace-pre-line break-keep'>{`선착순 54명`}</p>
                                </div>
                            </div>
                        </div>
                        <div className='w-full grid place-items-center text-gray-600 mb-25'>
                            <div className='w-[811px] flex flex-col'>
                                <div className='flex items-start justify-start text-[14px]'>
                                    <p className='whitespace-pre-line break-keep'>
                                        {`*업로드 일정은 2-3일 정도 변경될 수 있습니다.
                                *본 이벤트는 선착순 이벤트로 모집 작업실이 소진되면 종료됩니다.
                                *게시글로 올리는 카테고리 기준은 안내되지 않습니다.
                                *모든 정보를 입력해 주셔야 원활한 등재가 가능합니다.
                                *각 게시물의 게시 기간은 1개월(한달)입니다.
                                *게시물의 순서는 홍보물의 분위기에 따라 임의로 배정됩니다.`}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex items-center justify-center mb-25 font-semibold text-6xl leading-[140%]'>
                            <p className='whitespace-pre-line break-keep leading-[200%]'>{`\n지금까지`}</p>

                            <div
                                ref={desktopCounterRef}
                                className='mx-5.5 w-[343px] h-[343px] bg-primary-600 rounded-[30px] text-white grid place-items-center'
                            >
                                {error ? (
                                    // 1. 에러가 발생한 경우
                                    <div className='relative w-full grid place-items-center h-full text-center p-4 pb-10'>
                                        <p className='text-[240px] font-bold'>-</p>
                                        <p className='absolute bottom-8 text-base mt-2 whitespace-pre-line break-keep'>
                                            {error}
                                        </p>
                                    </div>
                                ) : isLoading ? (
                                    // 2. 로딩 중인 경우
                                    <div className='relative -top-2'>
                                        <SyncLoader size={20} margin={15} color='#ffffff' speedMultiplier={0.7} />
                                    </div>
                                ) : remainingCount !== null ? (
                                    // 3. 성공한 경우
                                    <AnimatedCounter value={remainingCount} inView={isDesktopCounterVisible} />
                                ) : (
                                    // 4. (혹시 모를) 데이터가 null인 경우
                                    <AnimatedCounter value={0} inView={isDesktopCounterVisible} />
                                )}
                            </div>
                            <p className='whitespace-pre-line break-keep leading-[200%]'>
                                <span className='text-primary-600'>{`명\n`}</span>남았어요
                            </p>
                        </div>{' '}
                    </>
                )}
            </div>

            <div className='block desktop:hidden'>
                <div className={`${remainingCount !== null && remainingCount === 0 ? 'blur-[3px]' : ''}`}>
                    <div className='mb-10 text-center leading-[140%] text-2xl desktop:text-5xl font-bold text-gray-800'>
                        <p>지금 등록하면,</p>
                        <p>
                            <span className='text-primary-500'>3만명 팔로워 음악전문 채널</span>의
                        </p>
                        <p>광고혜택을 받을 수 있어요!</p>
                    </div>
                    <Image
                        src='/images/instagram-event-banner-mobile.svg'
                        alt='event'
                        width={408}
                        height={556}
                        className='mb-10'
                    />
                </div>
                {remainingCount !== null && remainingCount === 0 ? (
                    <>
                        <div className='absolute w-88 h-[620px] flex items-end justify-center pb-10 bg-white/80 top-0'>
                            <p className='text-center font-bold text-[16px] text-gray-600'>
                                선착순 이벤트가 종료되었습니다. 성원에 감사드립니다.
                            </p>
                        </div>
                        <div className='text-center mb-10 leading-[140%] text-2xl font-bold text-gray-800'>
                            <p>11월 30일까지 등록하신 사장님께는</p>
                            <p className='whitespace-pre-line break-keep'>
                                <span className='text-primary-600'>30만원 상당의 뮤룸 광고 이용권</span>을 드립니다.
                            </p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className='w-full text-gray-600 mb-10'>
                            <div className='flex flex-col'>
                                <p className='font-semibold text-[16px] leading-[22px]'>홍보 방법</p>
                                <div className='flex items-start justify-start'>
                                    <div className='h-6 grid place-items-center mr-2.5'>
                                        <span className='inline-block w-1 h-1 bg-gray-600 rounded-full'></span>
                                    </div>
                                    <p className='whitespace-pre-line break-keep'>
                                        등록해주신 작업실 사진과 주소로 &quot;가성비 좋은 작업실&quot;, &quot;분위기
                                        좋은 작업실&quot; 등 GROUNZ 인스타그램 피드와 BUV 인스타그램 스토리에 홍보
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='text-gray-600 mb-10'>
                            <div className='flex flex-col'>
                                <p className='font-semibold text-[16px] leading-[22px]'>업로드 일시</p>
                                <div className='flex items-start justify-start'>
                                    <div className='h-6 grid place-items-center mr-2.5'>
                                        <span className='inline-block w-1 h-1 bg-gray-600 rounded-full'></span>
                                    </div>
                                    <p className='whitespace-pre-line break-keep'>
                                        12월 8일(월), 12월 15일(월), 12월 22일(월)
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='w-full text-gray-600 mb-10'>
                            <div className='flex flex-col'>
                                <p className='font-semibold text-[16px] leading-[22px]'>대상</p>
                                <div className='flex items-start justify-start'>
                                    <div className='h-6 grid place-items-center mr-2.5'>
                                        <span className='inline-block w-1 h-1 bg-gray-600 rounded-full'></span>
                                    </div>
                                    <p className='whitespace-pre-line break-keep'>{`선착순 54명`}</p>
                                </div>
                            </div>
                        </div>
                        <div className='w-full grid place-items-center text-gray-600 mb-20'>
                            <div className='flex flex-col'>
                                <div className='flex items-start justify-start text-[14px]'>
                                    <p className='whitespace-pre-line break-keep'>
                                        {`*업로드 일정은 2-3일 정도 변경될 수 있습니다.
                                *본 이벤트는 선착순 이벤트로 모집 작업실이 소진되면 종료됩니다.
                                *게시글로 올리는 카테고리 기준은 안내되지 않습니다.
                                *모든 정보를 입력해 주셔야 원활한 등재가 가능합니다.
                                *각 게시물의 게시 기간은 1개월(한달)입니다.
                                *게시물의 순서는 홍보물의 분위기에 따라 임의로 배정됩니다.`}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className='w-full flex items-center justify-center mb-20 font-semibold text-special-m-40-size leading-[140%]'>
                            <div
                                ref={mobileCounterRef}
                                className='mr-3 w-50 h-50 bg-primary-600 rounded-[30px] text-white grid place-items-center'
                            >
                                {error ? (
                                    // 1. 에러
                                    <div className='relative w-full grid place-items-center h-full text-center p-4 pb-6'>
                                        <p className='text-[120px] font-bold'>-</p>
                                        <p className='absolute bottom-5 text-base-m-14-2 mt-2 whitespace-pre-line break-keep'>
                                            {error}
                                        </p>
                                    </div>
                                ) : isLoading ? (
                                    // 2. 로딩
                                    <div className='relative'>
                                        <SyncLoader size={20} margin={15} color='#ffffff' speedMultiplier={0.7} />
                                    </div>
                                ) : remainingCount !== null ? (
                                    // 3. 성공
                                    <AnimatedCounter value={remainingCount} inView={isMobileCounterVisible} />
                                ) : (
                                    // 4. 데이터가 null (ex: 0으로 표시)
                                    <AnimatedCounter value={0} inView={isMobileCounterVisible} />
                                )}
                            </div>
                            <p className='whitespace-pre-line break-keep leading-[200%]'>
                                <span className='text-primary-600'>{`명\n`}</span>남았어요
                            </p>
                        </div>{' '}
                    </>
                )}
            </div>
        </section>
    );
}
