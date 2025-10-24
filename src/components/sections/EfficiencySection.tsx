import Image from 'next/image';

export default function EfficiencySection() {
    return (
        <section id='efficiency-section' className='w-306 min-w-306 relative px-25 mb-50'>
            <div className='mb-14 leading-14 text-special-m-40-size font-bold text-gray-800'>
                <p>커뮤니티보다 탐색 속도와 정확도가</p>
                <p>
                    <span className='text-primary-600'>25% 이상</span> 확인됐습니다.
                </p>
            </div>
            <div className='leading-5 text-[1rem] font-normal text-gray-500 mb-10'>
                <span>
                    이용자들을 대상으로 사용성 테스트를 실시하여 효율성, 인지 부하, 완료 시간, 사후 만족도 등으로 비교
                    평가했습니다.
                </span>
            </div>
            <Image src='/images/test-result.svg' alt='test-result' width={1024} height={449} className='-mt-1.5' />
        </section>
    );
}
