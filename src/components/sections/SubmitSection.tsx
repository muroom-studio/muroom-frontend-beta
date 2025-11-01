import SubmitForm from './SubmitForm';

export default function SubmitSection() {
    return (
        <section
            id='submit-form'
            className='w-full min-w-90 desktop:w-306 desktop:min-w-306 relative px-4 desktop:px-25'
        >
            <div className='mb-10 text-center leading-[140%] text-2xl desktop:text-5xl font-bold text-gray-800'>
                <p>지금 등록하면,</p>
                <p>
                    <span className='text-primary-500'>30만원 이상의 광고혜택</span>을
                </p>
                <p>받을 수 있어요!</p>
            </div>
            <div className='text-center text-title-exs-18 text-gray-600 mb-20 hidden desktop:block'>
                <span>
                    6개월 최상단 프리미엄 광고 혜택과 신규 서비스의 &apos;핫 매물&apos;로 지정되어 3개월간 가장 눈에 잘
                    띄는 위치에 노출됩니다.
                </span>
            </div>
            <SubmitForm />
        </section>
    );
}
