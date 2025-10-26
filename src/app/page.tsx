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

// TODO: 440px까지는 횡단 스크롤, 그 이하부터는 모바일뷰
export default function Intro() {
    return (
        <div className='relative w-full min-w-306 h-full bg-white flex flex-col items-center'>
            <BackgroundWithTitle />
            <div className='relative z-20 w-306 min-w-306 px-25 mb-25'>
                <div className='grid grid-cols-6 gap-x-5'>
                    <Header />
                    <IntroSection />
                    <OpinionsSection />
                    <ProblemsSection />
                </div>
            </div>

            <div className='mb-21'>
                <BackgroundWithPatterns />
            </div>

            <div className='relative z-20 w-306 min-w-306 h-full px-25'>
                <FeatureIntroSection />
            </div>
            <FeaturesSection />

            <EfficiencySection />

            <ExecutiveFeaturesSection />

            <SubmitSection />

            {/* TODO: 회색배경 */}
            <FAQSection />

            <InquirySection />
        </div>
    );
}
