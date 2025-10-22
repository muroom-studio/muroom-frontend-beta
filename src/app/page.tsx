import Header from '@/components/Header';
import Image from 'next/image';

export default function Intro() {
    return (
        <div className='relative w-full h-full'>
            <div
                className='
                absolute w-full h-[1138px]
                bg-linear-to-b from-primary-50 to-white 
                flex justify-center items-center
                overflow-hidden
                '
            >
                <span className='leading-[448px] text-[320px] font-bold text-white'>muroom</span>
            </div>
            <div
                className='
                relative z-20
                mx-auto w-full h-full
                max-w-[375px] px-5
                lg:max-w-[1024px] lg:px-5
                desktop:max-w-[calc(1440px - 2 * 208px)] desktop:px-0
                '
            >
                <div className='grid grid-cols-1 desktop:grid-cols-6 gap-5'>
                    <Header />
                    <section className='col-span-full w-full text-center row-start-1 pt-50'>
                        <div className='leading-[30px] text-[20px] font-bold text-primary-500 mb-6'>
                            <p>새로운 음악 연습실 대여 플랫폼, 뮤룸</p>
                        </div>
                        <div className='leading-[67px] text-5xl font-bold text-black mb-14'>
                            <p>복잡한 커뮤니티 플랫폼에서 </p>
                            <p>
                                <span className='text-primary-500'>원하는 작업실</span>을 찾을 수 있을까요?
                            </p>
                        </div>
                        <div className='leading-[27px] text-[20px] mb-24'>
                            <p>
                                <span className='font-semibold'>뮤룸</span>은 기존 플랫폼 게시판 형태의 불편을 개선해
                                고객들이 훨씬 사용하기 쉬운 새로운 작업실매물 탐색 플랫폼입니다.
                            </p>
                            <p>사용자 테스트 결과, 기존 플랫폼 대비 40% 이상의 사용자 만족도 상승을 기록했습니다.</p>
                            <p>12월 런칭 예정이며, 현재 함께하실 사장님을 모집 중입니다.</p>
                        </div>
                        <div className='grid place-items-center'>
                            <Image src='/images/laptop.png' alt='laptop image' width={720} height={437} />
                        </div>
                    </section>
                    <section className='col-span-full'>
                        <div className='w-1 h-1000'></div>
                    </section>
                    <section id='submit-form' className='col-span-full text-center'>
                        <p>여기 input</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
