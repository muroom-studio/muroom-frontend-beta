import Image from 'next/image';

export default function IntroSection() {
    return (
        <section
            id='intro-section'
            className='grid place-items-center col-span-full w-full text-center row-start-1 pt-35 desktop:pt-50 mb-14 desktop:mb-50'
        >
            <div className='leading-[150%] text-[1rem] desktop:text-[1.25rem] font-bold text-primary-500 mb-6'>
                <p>새로운 음악 연습실 대여 플랫폼, 뮤룸</p>
            </div>
            <div className='leading-[140%] text-2xl desktop:text-5xl font-bold text-black mb-14'>
                <p>복잡한 커뮤니티 플랫폼에서 </p>
                <p>
                    <span className='text-primary-500'>원하는 작업실</span>을 찾을 수 있을까요?
                </p>
            </div>
            <div className='hidden desktop:block leading-[150%] text-lg mb-24'>
                <p>
                    <span className='font-semibold'>뮤룸</span>은 기존 플랫폼 게시판 형태의 불편을 개선해 고객들이 훨씬
                    사용하기 쉬운 새로운 작업실 매물 탐색 플랫폼입니다.
                </p>
                <p>사용자 테스트 결과, 기존 플랫폼 대비 40% 이상의 사용자 만족도 상승을 기록했습니다.</p>
                <p>12월 런칭 예정이며, 현재 함께하실 사장님을 모집 중입니다.</p>
            </div>
            <div className='desktop:hidden leading-[150%] text-lg mb-8 desktop:mb-24 whitespace-pre-line break-keep'>
                <p>
                    <span className='font-semibold'>뮤룸</span>은 기존 플랫폼 게시판 형태의 불편을 개선해 고객들이 훨씬
                    사용하기 쉬운 새로운 작업실 매물 탐색 플랫폼입니다.
                </p>
                <br />
                <p>사용자 테스트 결과, 기존 플랫폼 대비 40% 이상의 사용자 만족도 상승을 기록했습니다.</p>
                <br />
                <p>12월 런칭 예정이며, 현재 함께하실 사장님을 모집 중입니다.</p>
            </div>
            <div className='grid place-items-center'>
                <Image
                    src='/images/mockup.svg'
                    alt='screen image'
                    width={1024}
                    height={576}
                    priority={true}
                    className='hidden desktop:block w-5xl h-[576px]'
                />
                <Image
                    src='/images/mobile-mockup.svg'
                    alt='screen image'
                    width={239}
                    height={482}
                    priority={true}
                    className='desktop:hidden block w-[239px] h-[482px]'
                />
            </div>
        </section>
    );
}
