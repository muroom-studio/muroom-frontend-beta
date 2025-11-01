export default function BackgroundWithTitle() {
    return (
        <div
            id='background-with-title'
            className='
                absolute w-full min-w-[375px] desktop:min-w-5xl h-[931px] desktop:h-[1138px]
                bg-linear-to-b from-primary-50 to-white 
                flex justify-center items-center
                overflow-hidden
                '
        >
            <span className='hidden desktop:block leading-112 text-[20rem] font-bold text-white'>muroom</span>
        </div>
    );
}
