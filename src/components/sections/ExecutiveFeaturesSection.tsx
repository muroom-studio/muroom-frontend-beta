import Image from 'next/image';

interface ExecutiveFeature {
    id: number;
    icon: string;
    iconHovered: string;
    title: string;
    details: string[];
}

const executiveFeature: ExecutiveFeature[] = [
    {
        id: 1,
        icon: 'contract-icon.svg',
        iconHovered: 'contract-icon-hovered.svg',
        title: '계약서',
        details: ['온라인 전자계약 제공', '계약서 양식 제공 및 출력 가능', '계약서 관리 서비스'],
    },
    {
        id: 2,
        icon: 'payments-icon.svg',
        iconHovered: 'payments-icon-hovered.svg',
        title: '페이먼츠',
        details: ['실시간 카드/간편 결제 서비스', '자동전산 및 보고서 제공'],
    },
    {
        id: 3,
        icon: 'chat-icon.svg',
        iconHovered: 'chat-icon-hovered.svg',
        title: '톡톡',
        details: ['실시간 채팅 서비스', '자동 응답 메시지 관리', '고객 단체 홍보 메시지 발송'],
    },
    {
        id: 4,
        icon: 'customized-solution-icon.svg',
        iconHovered: 'customized-solution-icon-hovered.svg',
        title: '고객 맞춤 솔루션',
        details: ['이용 정보를 통한 작업실 노출', '고객 이용 데이터 분석 제공'],
    },
    {
        id: 5,
        icon: 'calendar-icon.svg',
        iconHovered: 'calendar-icon-hovered.svg',
        title: '월세 및 일정관리',
        details: ['실시간 현황 대시보드 서비스', '월세 수금 알림', '재무 분석 보고서 제공'],
    },
    {
        id: 6,
        icon: 'reservation-icon.svg',
        iconHovered: 'reservation-icon-hovered.svg',
        title: '공실 예약',
        details: ['만실 시 고객 예약 서비스', '공실 시 예약 고객에게 메세지 자동 발송'],
    },
];

const ExecutiveFeatureCard = ({ feature }: { feature: ExecutiveFeature }) => {
    return (
        <>
            <div
                className='hidden group h-83 py-14 px-15 desktop:flex flex-col outline outline-gray-200 rounded-20 shadow-level-0
            transition-transform duration-300 hover:-translate-y-2.5 hover:outline-2 hover:outline-primary-200 hover:[box-shadow:var(--shadow-level-0),var(--shadow-surrounded)]'
            >
                <div className='grid place-items-center mb-4'>
                    <Image
                        src={`/images/icons/${feature.icon}`}
                        alt={`${feature.title}`}
                        width={80}
                        height={80}
                        className='mb-4 block group-hover:hidden'
                    />
                    <Image
                        src={`/images/icons/${feature.iconHovered}`}
                        alt={`${feature.title}`}
                        width={80}
                        height={80}
                        className='mb-4 hidden group-hover:block'
                    />
                    <span className='leading-9 text-2xl font-bold group-hover:text-primary-500'>{feature.title}</span>
                </div>
                <ul className='flex flex-col items-start justify-start'>
                    {feature.details.map((detail) => (
                        <li key={detail} className='w-full pl-2.5 text-gray-700 flex items-center justify-start'>
                            <span className='inline-block w-1 h-1 bg-gray-700 rounded-full mr-2.5'></span>
                            <p>{detail}</p>
                        </li>
                    ))}
                </ul>
            </div>

            <div
                className={`desktop:hidden group h-83 py-14 px-15 flex flex-col outline outline-gray-200 rounded-20 shadow-level-0
                transform transition-all duration-500 ease-out`}
            >
                <div className='grid place-items-center mb-4'>
                    <Image
                        src={`/images/icons/${feature.icon}`}
                        alt={`${feature.title}`}
                        width={80}
                        height={80}
                        className='mb-4 block group-hover:hidden'
                    />
                    <Image
                        src={`/images/icons/${feature.iconHovered}`}
                        alt={`${feature.title}`}
                        width={80}
                        height={80}
                        className='mb-4 hidden group-hover:block'
                    />
                    <span className='leading-9 text-2xl font-bold group-hover:text-primary-500'>{feature.title}</span>
                </div>
                <ul className='flex flex-col items-start justify-start'>
                    {feature.details.map((detail) => (
                        <li key={detail} className='w-full pl-2.5 text-gray-700 flex items-center justify-start'>
                            <span className='inline-block w-1 h-1 bg-gray-700 rounded-full mr-2.5'></span>
                            <p>{detail}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default function ExecutiveFeaturesSection() {
    return (
        <section
            id='custom-section'
            className='w-full min-w-90 desktop:w-306 desktop:min-w-306 relative px-4 desktop:px-25 mb-25 desktop:mb-50'
        >
            <div className='mb-10 desktop:mb-14 leading-[140%] text-2xl desktop:text-special-m-40-size font-bold text-gray-800'>
                <p>
                    사장님을 위한 <br className='desktop:hidden' />
                    <span className='text-primary-500'>맞춤 기능</span>도 준비하고 있어요!
                </p>
            </div>
            <div className='relative grid desktop:grid-cols-3 gap-3 desktop:gap-5 mb-4 desktop:mb-10'>
                {executiveFeature.map((feature) => (
                    <ExecutiveFeatureCard key={feature.id} feature={feature} />
                ))}
            </div>

            <div className='w-full flex justify-end text-[14px] desktop:text-title-exs-18 text-gray-600'>
                <span className='tracking-tighter desktop:tracking-normal'>
                    * 위 기능 오픈 베타 런칭 이후 추가될 예정이며, 변경 될 수 있습니다.
                </span>
            </div>
        </section>
    );
}
