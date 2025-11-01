export default function FeatureIntroSection() {
    return (
        <section id='feature-intro-section' className='relative'>
            <div className='mb-25 desktop:mb-50 leading-[140%] text-2xl desktop:text-5xl font-bold text-white text-center'>
                <p className='mb-3 desktop:mb-4 leading-[140%] text-[20px] desktop:text-title-xl-32-size font-bold text-primary-50'>
                    그래서 우리는,
                </p>
                <p>고객은 쉽고 빠르게 작업실을 찾고</p>
                <p>
                    사장님은 <span className='hidden desktop:inline'>진짜</span> 고객과{' '}
                    <span className='inline desktop:hidden'>연결해드려요!</span>
                    <span className='hidden desktop:inline'>연결되게 만들었어요!</span>
                </p>
            </div>
        </section>
    );
}
