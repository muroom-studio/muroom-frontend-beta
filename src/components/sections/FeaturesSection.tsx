import Image from 'next/image';

interface Feature {
    id: number;
    title: string;
    description: string;
    icon: string;
    image: string;
    imageWidth: number;
    imageHeight: number;
    imagePosition: string;
    hasWhiteBottom?: boolean;
}

const features: Feature[] = [
    {
        id: 1,
        title: '지도',
        description: '작업실을 가격 태그로 구분해\n위치를 쉽게 찾을 수 있어요',
        icon: 'map-icon.svg',
        image: 'map-mockup.svg',
        imageWidth: 560,
        imageHeight: 387,
        imagePosition: 'left-[-20px] top-[208px]',
    },
    {
        id: 2,
        title: '리스트',
        description: '최적화된 정보만 리스트에 공개해\n빠르게 매물을 고를 수 있어요',
        icon: 'list-icon.svg',
        image: 'list-mockup.svg',
        imageWidth: 217,
        imageHeight: 428,
        imagePosition: 'left-[60px] top-[147px]',
        hasWhiteBottom: true,
    },
    {
        id: 3,
        title: '상세페이지',
        description: '일관된 정보 구조로 어떤 작업실이어도\n혼란없이 구분 할 수 있어요',
        icon: 'detail-icon.svg',
        image: 'detail-mockup.svg',
        imageWidth: 268,
        imageHeight: 539,
        imagePosition: 'left-[32px] top-[144px]',
        hasWhiteBottom: true,
    },
    {
        id: 4,
        title: '메모와 찜',
        description: '찜으로 원하는 작업실을 구분하고\n문의 전 확인할 정보들을 입력할 수 있어요',
        icon: 'scrap-icon.svg',
        image: 'scrap-mockup.svg',
        imageWidth: 355,
        imageHeight: 336,
        imagePosition: 'left-[21px] top-[157px]',
    },
    {
        id: 5,
        title: '비교함',
        description: '찜한 작업실들 중 골라\n쉽게 비교하고 최종결정할 수 있어요',
        icon: 'comparing-icon.svg',
        image: 'comparing-mockup.png',
        imageWidth: 478,
        imageHeight: 470,
        imagePosition: 'left-[32px] top-[169px]',
        hasWhiteBottom: true,
    },
    {
        id: 6,
        title: '필터링',
        description: '내가 필요한 조건들을 골라\n원하는 작업실을 찾을 수 있어요',
        icon: 'filter-icon.svg',
        image: 'filter-mockup.svg',
        imageWidth: 289,
        imageHeight: 445.5,
        imagePosition: 'left-[31px] top-[150px]',
    },
];

const FeatureCard = ({ feature }: { feature: Feature }) => {
    return (
        <div className='relative h-107 py-5 px-8.5 bg-white border border-primary-100 rounded-[10px] shadow-level-0 overflow-hidden'>
            <div className='flex'>
                <Image src={`/images/icons/${feature.icon}`} alt={`${feature.title}`} width={24} height={24} />
                <span className='ml-2 mb-2 leading-11 text-2xl font-semibold text-gray-700'>{feature.title}</span>
            </div>
            <p className='whitespace-pre-line leading-6 text-[1rem] font-medium text-gray-500'>{feature.description}</p>
            <Image
                src={`/images/${feature.image}`}
                alt={`${feature.title}-mockup`}
                width={feature.imageWidth}
                height={feature.imageHeight}
                className={`absolute max-w-none ${feature.imagePosition}`}
            />
            {feature.hasWhiteBottom && (
                <div className='absolute left-0 bottom-0 w-full h-full bg-linear-to-t from-white to-transparent to-[68px]'></div>
            )}
        </div>
    );
};

export default function FeaturesSection() {
    return (
        <>
            <section id='feature-section-title' className='w-306 min-w-306 relative px-25'>
                <div className='mb-14 leading-14 text-special-m-40-size font-bold text-gray-800'>
                    <p>
                        <span className='text-primary-600'>지도 + 리스트</span> UI로 사장님의 연습실을
                    </p>
                    <p>가장 빠르고 정확하게 연결합니다.</p>
                </div>
            </section>
            <div className='w-full grid grid-flow-col auto-cols-[328px] overflow-x-auto gap-x-5 px-[calc((100vw-1224px)/2+6.25rem)] mb-50'>
                {features.map((feature) => (
                    <FeatureCard key={feature.id} feature={feature} />
                ))}
            </div>
        </>
    );
}
