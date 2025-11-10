import Image from 'next/image';

function SquarePattern({ styles }: { styles: string }) {
    return <div className={`absolute w-4 h-4 rounded-[4px] bg-[#EEE8FF] ${styles}`}></div>;
}

export default function BackgroundWithPatterns() {
    return (
        <div
            id='background-with-title'
            className='
                absolute left-0 col-span-full w-full h-[700px] desktop:h-700
                rounded-t-[30px]
                bg-linear-to-b from-primary-400 from-[-60px] via-[#DDD6FF] via-45% desktop:via-20% to-white to-[400px] desktop:to-[700px]
                flex justify-center items-center
                overflow-hidden
                '
        >
            {/* to-[450px] desktop:to-[600px] */}
            <Image
                src='/images/patterns/hexagon-1.svg'
                alt='hexagonal pattern'
                width={90}
                height={90}
                className='hidden desktop:block absolute top-38 left-18 opacity-30 desktop:left-28 desktop:opacity-100 w-[90px] h-[90px]'
            />
            <Image
                src='/images/patterns/hexagon-2.svg'
                alt='hexagonal pattern'
                width={55}
                height={55}
                className='hidden desktop:block absolute top-12 right-70 w-[70px] h-[70px]'
            />

            <SquarePattern styles={'top-8 left-45 bg-primary-200 hidden desktop:block'} />
            <SquarePattern styles={'top-26 right-32 bg-primary-200 hidden desktop:block'} />
            <SquarePattern styles={'top-20 left-88 bg-primary-200 hidden desktop:block'} />
            <SquarePattern styles={'top-60 right-48 bg-primary-100 hidden desktop:block'} />
            <SquarePattern styles={'top-84 left-5 bg-primary-100 hidden desktop:block'} />
            <SquarePattern styles={'top-104 left-36 bg-primary-50 hidden desktop:block'} />

            <Image
                src='/images/patterns/iconic-1.svg'
                alt='hexagonal pattern'
                width={190.64}
                height={188.93}
                className='hidden desktop:block absolute top-113 right-5 w-[190.64px] h-[188.93px]'
            />
            <Image
                src='/images/patterns/iconic-1.svg'
                alt='hexagonal pattern'
                width={107.48}
                height={106.52}
                className='absolute top-190 left-12 hidden desktop:block w-[107.48px] h-[106.52px]'
            />
        </div>
    );
}
