import Header from '@/components/Header';
import Image from 'next/image';

export default function Intro() {
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

    //불편했던 점
    const problems = [
        {
            id: 1,
            description: '원하는 조건으로 필터링 할 수 없다',
            selected: '22.6%',
            width: 'full',
        },
        {
            id: 2,
            description: '정보가 표준화되어 있지 않다',
            selected: '20.4%',
            width: '577px',
        },
        {
            id: 3,
            description: '가격이 애매하거나 투명하지 않다',
            selected: '20.3%',
            width: '559px',
        },
    ];

    return (
        <div className='relative w-full min-w-306 h-full bg-white flex justify-center'>
            <div
                id='background-muroom'
                className='
                absolute w-full min-w-5xl h-[1138px]
                bg-linear-to-b from-primary-50 to-white 
                flex justify-center items-center
                overflow-hidden
                '
            >
                <span className='leading-112 text-[20rem] font-bold text-white'>muroom</span>
            </div>
            <div
                className='
                relative z-20
                w-306 min-w-306 h-full
                px-25
                '
            >
                {/* TODO: 440px까지는 횡단 스크롤, 그 이하부터는 모바일뷰 */}
                <div className='grid grid-cols-6 gap-5'>
                    <Header />

                    <section id='section1' className='col-span-full w-full text-center row-start-1 pt-50 mb-50'>
                        <div className='leading-7.5 text-[1.25rem] font-bold text-primary-500 mb-6'>
                            <p>새로운 음악 연습실 대여 플랫폼, 뮤룸</p>
                        </div>
                        <div className='leading-16.75 text-5xl font-bold text-black mb-14'>
                            <p>복잡한 커뮤니티 플랫폼에서 </p>
                            <p>
                                <span className='text-primary-500'>원하는 작업실</span>을 찾을 수 있을까요?
                            </p>
                        </div>
                        <div className='leading-6.75 text-lg mb-24'>
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

                    <section id='section2' className='col-span-full'>
                        <div className='leading-14 text-[2.5rem] font-bold mb-14'>
                            <p>
                                고객은 <span className='text-gray-500'>커뮤니티 플랫폼</span>에 대해
                            </p>
                            <p>어떻게 생각하고 있을까요?</p>
                        </div>
                        <div className='grid grid-cols-6 gap-5 mb-50'>
                            {opinionsAboutCommunityPlatform.map((opinion, index) => {
                                return (
                                    <div
                                        key={index}
                                        className='relative h-[407px] col-span-2 outline outline-gray-100 rounded-[10px] shadow-[0_2px_6px_0_rgba(0,0,0,0.2)] p-10'
                                    >
                                        <div className='leading-10.5 text-3xl font-bold text-gray-700 mb-6'>
                                            <p className='whitespace-pre-line'>{opinion.title}</p>
                                        </div>
                                        <div className='leading-6 text-[1rem] font-medium text-gray-500'>
                                            <p>{opinion.description}</p>
                                        </div>
                                        <div className='absolute bottom-10 py-2.5 px-3 flex items-center rounded-[10px] bg-primary-50'>
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

                    <section id='section3' className='col-span-full mb-14'>
                        <div className='leading-14 text-[2.5rem] font-bold mb-14'>
                            <p>고객은 음악 연습실 탐색에서</p>
                            <p>이러한 불편함을 드러냈습니다.</p>
                        </div>
                        <div className='leading-5 text-[1rem] font-normal text-gray-500 mb-4.5'>
                            장기 연습실 대여 플랫폼 관련 설문조사 음악 작업실 사용자 109명 대상으로 조사했습니다.
                        </div>
                        <div className='w-full py-10 px-50 outline outline-gray-100 rounded-[10px] shadow-[0_2px_6px_0_rgba(0,0,0,0.2)] mb-14'>
                            <div className='w-full flex items-center justify-center mb-10'>
                                <div className='w-10 h-10 bg-primary-400 grid place-items-center rounded-[10px] leading-7 text-[1.25rem] font-bold text-white mr-3'>
                                    Q
                                </div>
                                <span className='leading-[2.45rem] text-[1.75rem] font-bold tracking-[-0.02em]'>
                                    작업실을 찾으실 때 가장 불편했던 점은 무엇이었나요?
                                </span>
                            </div>
                            {problems.map((problem) => {
                                return (
                                    <div
                                        key={problem.id}
                                        className={`flex justify-between mb-4 last:mb-0 py-6 px-10 rounded-[10px] leading-[33px] text-[1.375rem] ${
                                            problem.id === 1 ? 'bg-primary-50' : 'bg-gray-50'
                                        }`}
                                        style={{ width: problem.width }}
                                    >
                                        <div>
                                            <span className='mr-4.5 font-extrabold text-primary-600'>
                                                {problem.id}위
                                            </span>
                                            <span className='font-semibold text-gray-800'>{problem.description}</span>
                                        </div>
                                        <span className='font-extrabold text-primary-600'>{problem.selected}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className='flex flex-col items-center space-y-1 mb-14'>
                            <div
                                className='
                                    w-0 h-0
                                    border-l-10 border-l-transparent
                                    border-r-10 border-r-transparent
                                    border-t-10 border-t-primary-400
                                '
                            ></div>

                            <div
                                className='
                                    w-0 h-0
                                    border-l-10 border-l-transparent
                                    border-r-10 border-r-transparent
                                    border-t-10 border-t-primary-200
                                '
                            ></div>

                            <div
                                className='
                                    w-0 h-0
                                    border-l-10 border-l-transparent
                                    border-r-10 border-r-transparent
                                    border-t-10 border-t-primary-100
                                '
                            ></div>
                        </div>
                        <div className='grid grid-cols-2 gap-5'>
                            <div className='col-span-1 rounded-[10px] bg-primary-400 grid place-items-center shadow-[0_0_20px_0_rgba(138,56,245,0.2)]'>
                                <span className='my-4 font-bold text-3xl leading-[36px] text-white'>
                                    비효율적인 정보 탐색
                                </span>
                                <div className='w-full py-10 text-center rounded-b-[10px] bg-white text-[1.75rem] font-medium leading-9.75 shadow-[0_2px_6px_0_rgba(0,0,0,0.2)]'>
                                    <p>이용자들은 수많은 글 속에서</p>
                                    <p>필요한 정보를 찾느라 피로를 느낍니다.</p>
                                </div>
                            </div>
                            <div className='col-span-1 rounded-[10px] bg-primary-400 grid place-items-center shadow-[0_0_20px_0_rgba(138,56,245,0.2)]'>
                                <span className='my-4 font-bold text-3xl leading-[36px] text-white'>
                                    매물의 노출 한계
                                </span>
                                <div className='w-full py-10 text-center rounded-b-[10px] bg-white text-[1.75rem] font-medium leading-9.75 shadow-[0_2px_6px_0_rgba(0,0,0,0.2)]'>
                                    <p>좋은 시설을 갖춰도, 검색되지 않으면</p>
                                    <p>외면받기 쉽습니다.</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section id='submit-form' className='col-span-full text-center mt-100'>
                        <p>여기 input</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
