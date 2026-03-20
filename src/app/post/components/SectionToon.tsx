import "../styles/SectionToon.scss";
import Image from 'next/image';

import Title from '@/app/post/components/Title';
import ReadMoreButton from '@/components/new-reborn/ReadMoreButton';

import toonUser from '@/app/assets/images/contents/post_toon_user.png';

import { sampleToonData } from "@/data/post/ToonData";
import { KvData } from "@/data/post/KvData";



export default function SectionToon() {
  return (
    <div className="section-toon">
      {/* 히어로 일러스트레이션 섹션 */}
      <div className="section-toon_hero" data-aos="fade-in">
        <div className="section-toon_hero-background">
          <Image 
            src={KvData.result.secondLayout.imageUrl} 
            alt="리본회생 웹툰 히어로 일러스트레이션"
            width={1920}
            height={600}
            className="section-toon_hero-background-image pc-tablet-only"
          />
          <Image 
            src={KvData.result.secondLayoutMo.imageUrl} 
            alt="리본회생 웹툰 히어로 일러스트레이션"
            width={375}
            height={400}
            className="section-toon_hero-background-image mo-only"
          />
        </div>
      </div>

      {/* 중간 텍스트 섹션 */}
      <div className="section-toon_intro" data-aos="fade-up">
        <div className="section-toon_intro-content">
          <Title title="TOON"
          desc={
            <>
              리본회생과 함께한 고객들과의 <br className="mo-only"/>재밌는 이야기를 웹툰으로 만나보세요.
            </>
          }
          isToon={true}
          />
          <div className="section-toon_author">
            <Image 
              src={toonUser} 
              alt="리본회생 웹툰 작가"
              width={96}
              height={96}
              className="section-toon_author-avatar-image"
            />
          </div>
        </div>
      </div>

      {/* 웹툰 그리드 섹션 */}
      <div className="section-toon_grid" data-aos="fade-up">
        <div className="section-toon_grid-container">
          {sampleToonData.result.contents.map((toon) => (
            <button key={toon.id} className="section-toon_item">
              <div className="section-toon_item-cover">
                <Image 
                  src={toon.imageUrl} 
                  alt={toon.title}
                  width={200}
                  height={200}
                  className="section-toon_item-image"
                />
              </div>
              <div className="section-toon_item-info">
                <div className="section-toon_item-header">
                  <div className="section-toon_item-episode">
                    [{toon.episode}화]
                  </div>
                  <div className="section-toon_item-badges">
                    {toon.isNew && <span className="section-toon_item-badges_badge section-toon_item-badges_badge--new">NEW</span>}
                    {toon.isHot && <span className="section-toon_item-badges_badge section-toon_item-badges_badge--hot">HOT</span>}
                  </div>
                </div>
                <div className="section-toon_item-title h6_n">{toon.title}</div>
                <div className="section-toon_item-description">{toon.subtitle}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div data-aos="fade-up">
        <ReadMoreButton text="더보기" color="border-b" />
      </div>
    </div>
  );
}