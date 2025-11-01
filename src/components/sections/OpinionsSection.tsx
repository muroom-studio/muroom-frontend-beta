export default function OpinionsSection() {
    const opinionsAboutCommunityPlatform = [
        {
            title: `떨어지는\n커뮤니티의 인식`,
            description:
                '커뮤니티로 작업실을 구할 수 있는지도 몰랐습니다. 실용음악과 관련된 것들인 줄 알았어요. 네이버에 어디 근처 연습실이라는 키워드로 찾아도 잘 나왔습니다.',
            author: {
                age: '20대 남성',
                duration: '1년 이용',
                occupation: '성악과학생',
            },
        },
        {
            title: '커뮤니티의\n불편한 사용성',
            description:
                '20대부터 커뮤니티를 사용하기 시작했습니다. 베이스 갤러리에서 중고 거래를 하다 알게 되어 커뮤니티의 존재를 알게 되고 이를 통해 연습실을 구하는 것도 알게 됐지만, 가독성이 불편하여 네이버 지도로 찾고 있습니다.',
            author: {
                age: '20대 남성',
                duration: '5년 이용',
                occupation: '베이시스트',
            },
        },
        {
            title: '의미없는\n프리미엄 광고',
            description: '프리미엄이라고 생각되는 건 어차피 돈을 내면 올리는 것이기 때문에 굳이 참고하지 않습니다.',
            author: {
                age: '30대 남성',
                duration: '6개월 이용',
                occupation: '회사원',
            },
        },
    ];

    return (
        <section id='opinions-section' className='desktop:w-full col-span-full mb-25 desktop:mb-50'>
            <div className='leading-[140%] text-2xl desktop:text-special-m-40-s font-bold'>
                <p>
                    고객은 <span className='text-gray-500'>커뮤니티 플랫폼</span>에 대해
                </p>
                <p>어떻게 생각하고 있을까요?</p>
            </div>
            <div className='h-full flex gap-3 overflow-x-auto desktop:grid desktop:grid-cols-6 desktop:gap-4 px-1'>
                {opinionsAboutCommunityPlatform.map((opinion, index) => {
                    return (
                        <div
                            key={index}
                            className='relative w-[254px] h-[361px] desktop:w-[328px] desktop:h-[407px] outline outline-gray-100 rounded-[10px] shadow-level-1 mt-10 desktop:mt-14 px-6 desktop:px-10 py-10
                            shrink-0 desktop:col-span-2'
                        >
                            <div className='leading-[140%] text-[22px] desktop:text-3xl font-bold text-gray-700 mb-6'>
                                <p className='whitespace-pre-line'>{opinion.title}</p>
                            </div>
                            <div className='leading-[150%] text-[14px] desktop:text-[1rem] font-medium text-gray-500'>
                                <p>{opinion.description}</p>
                            </div>
                            <div className='absolute bottom-10 py-2.5 px-2 desktop:px-3 flex items-center rounded-[10px] bg-primary-50'>
                                <span className='leading-5.25 text-[0.875rem] font-semibold text-primary-800 mr-3'>
                                    {opinion.author.age}
                                </span>
                                <span className='leading-5.25 text-[0.875rem] font-medium text-gray-600 mr-1.5'>
                                    {opinion.author.duration}
                                </span>
                                <span className='inline-block w-1 h-1 bg-gray-400 mr-1.5 rounded-full'></span>

                                <span className='leading-5.25 text-[0.875rem] font-medium text-gray-600 mr-1.5'>
                                    {opinion.author.occupation}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
