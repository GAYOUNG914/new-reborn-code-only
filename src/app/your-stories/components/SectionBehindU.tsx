import { useState, useEffect } from 'react';
import "../styles/SectionVideoList.scss";
import "../styles/SectionBehindU.scss";
import Title from './Title';
import VideoList from './VideoList';
import ButtonMore from '../../../components/new-reborn/ReadMoreButton';
import Image from 'next/image';
import type { YourStoriesContent } from "@/types/YourStories";
import { BehindUData } from '@/data/your-stories/BehindUData';
import { VideoProvider } from './VideoProvider';

export default function BehindU() {
  
  const [activeSort, setActiveSort] = useState('latest');

  const allContents: YourStoriesContent[] = BehindUData.flatMap(
    (page) => page.result.contents
  );
  const totalCurrentSize = BehindUData.reduce((sum, page) => sum + page.result.currentSize, 0);
  

  return (
    <>
      <section className="section-u-videolist section-behind-u">
        <div className="contents-wrap">

          <Title title="비하인드 U"
            desc={
              <>
              변호사와 직원들의 시선으로 풀어낸 <br />고객들의 이야기를 만나보세요
              </>
            }>
            <div className='title-img'>
              <Image
                src="/workout-v2/images/contents/img_behind-u_title.png"
                alt="당신의 뒤에서"
                width={143}
                height={50}
              />
            </div>
          </Title>

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

        {/*rowan 추가*/}
        <div className="behind-u-bg-image"></div>

      </section>
    </>
  );
}