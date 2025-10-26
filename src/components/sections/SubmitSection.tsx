import SubmitForm from './SubmitForm';

export default function SubmitSection() {
    return (
        <section id='submit-form' className='w-306 min-w-306 relative px-25 mb-20'>
            <div className='mb-10 text-center leading-17 text-5xl font-bold text-gray-800'>
                <p>지금 등록하면,</p>
                <p>
                    <span className='text-primary-500'>30만원 이상의 광고혜택</span>을 받을 수 있어요!
                </p>
            </div>
            <div className='text-center text-title-exs-18 text-gray-600 mb-20'>
                <span>
                    6개월 최상단 프리미엄 광고 혜택과 신규 서비스의 &apos;핫 매물&apos;로 지정되어 3개월간 가장 눈에 잘
                    띄는 위치에 노출됩니다.
                </span>
            </div>
            <SubmitForm />
        </section>
    );
}
