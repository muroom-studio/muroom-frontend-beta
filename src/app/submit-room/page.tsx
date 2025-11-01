'use client';

import BackgroundWithPatterns from '@/components/BackgroundWithPatterns';
import BackgroundWithTitle from '@/components/BackgroundWithTitle';
import Header from '@/components/Header';
import EfficiencySection from '@/components/sections/EfficiencySection';
import FeatureIntroSection from '@/components/sections/FeatureIntroSection';
import FeaturesSection from '@/components/sections/FeaturesSection';
import IntroSection from '@/components/sections/IntroSection';
import OpinionsSection from '@/components/sections/OpinionsSection';
import ProblemsSection from '@/components/sections/ProblemsSection';
import SubmitSection from '@/components/sections/SubmitSection';
import ExecutiveFeaturesSection from '@/components/sections/ExecutiveFeaturesSection';
import FAQSection from '@/components/sections/FAQSection';
import InquirySection from '@/components/sections/InquirySection';
import TopAnchorButton from '@/components/TopAnchorButton';
import Footer from '@/components/Footer';

// TODO: 440px까지는 횡단 스크롤, 그 이하부터는 모바일뷰
export default function Intro() {
    return (
        <div className='relative w-full min-w-90 desktop:min-w-306 h-full bg-white flex flex-col items-center'>
            <BackgroundWithTitle />

            <Header />

            <TopAnchorButton />

            <div className='relative z-20 w-full min-w-90 desktop:w-306 desktop:min-w-306 px-4 desktop:px-25 mb-20 desktop:mb-25'>
                <div className='grid grid-cols-4 desktop:grid-cols-6 gap-x-4 desktop:gap-x-5'>
                    <IntroSection />
                    <OpinionsSection />
                    <ProblemsSection />
                </div>
            </div>

            <div className='mb-20'>
                <BackgroundWithPatterns />
            </div>

            <div className='relative z-20 w-full min-w-90 desktop:w-306 desktop:min-w-306 h-full px-4 desktop:px-25'>
                <FeatureIntroSection />
            </div>
            <FeaturesSection />

            <EfficiencySection />

            <ExecutiveFeaturesSection />

            <SubmitSection />

            <div
                id='background-with-title'
                className='
                col-span-full w-full bg-gray-50 py-8 desktop:py-20
                flex flex-col justify-center items-center
                overflow-hidden
                '
            >
                <FAQSection />
                <InquirySection />
            </div>

            <Footer />
        </div>
    );
}
