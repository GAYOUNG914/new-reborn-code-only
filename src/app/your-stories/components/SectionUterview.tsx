import { useState, useEffect } from 'react';
import "../styles/SectionVideoList.scss";
import "../styles/SectionUterview.scss";
import Title from './Title';
import VideoList from './VideoList';
import ButtonMore from '../../../components/new-reborn/ReadMoreButton';
import useIsMobile from '@/utils/useIsMobile';
import type { YourStoriesContent } from "@/types/YourStories";
import { UterviewData } from '@/data/your-stories/UterviewData';
import { VideoProvider } from './VideoProvider';


export default function Uterview() {
  
  const isMobile = useIsMobile();
  const [activeSort, setActiveSort] = useState('latest');

  const allContents: YourStoriesContent[] = UterviewData.flatMap(
    (page) => page.result.contents
  );
  const totalCurrentSize = UterviewData.reduce((sum, page) => sum + page.result.currentSize, 0);
  

  return (
    <>
      <section className="section-u-videolist section-uterview">
        <div className="contents-wrap">

          <Title title="U터뷰"
            desc={
              isMobile ? 
              <>
                리본회생을 만나 새로운 삶을 시작하는 <br /><strong>고객님이 전하는 이야기</strong>를 영상으로 만나보세요
              </> :
              <>
                리본회생을 만나 새로운 삶을 시작하는 <br />고객님이 전하는 이야기를 영상으로 만나보세요
              </>
            } />

          <div className="u-videolist-sort" data-aos="fade-up">
            <button type="button"
              className={`btn-sort ${activeSort === 'latest' ? 'active' : ''}`}
              onClick={() => setActiveSort('latest')}>
              <span>최신순</span>
            </button>

            <button type="button"
              className={`btn-sort ${activeSort === 'popular' ? 'active' : ''}`}
              onClick={() => setActiveSort('popular')}>
              <span>인기순</span>
            </button>
          </div>

          <VideoProvider>
            <VideoList
              items={allContents}
              currentSize={totalCurrentSize}
            />
          </VideoProvider>

          <ButtonMore text="더보기" color="gray" direction="down"
          onClick={() => { console.log("더보기 버튼 클릭") }} />

        </div>
      </section>
    </>
  );
}