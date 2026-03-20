"use client";

import "../styles/SectionVlog.scss";
import Title from "@/app/our-stories/components/Title";
import { VlogWorkData } from '@/data/our-stories/VlogWork';
import { VlogCultureData } from '@/data/our-stories/VlogCulture';
import { VlogCard } from './VlogCard';


type SectionVlogProps = {
  setActiveVideoUrl: (url: string) => void;
};

export default function SectionVlog({ setActiveVideoUrl }: SectionVlogProps) {


  return (
    <section className="section-vlog">
      <Title
        title="브이로그"
        desc={<>리본회생의 순간들을 모아 이야기를 담았습니다.</>}></Title>

      <VlogCard
        type="work"
        title="WORK"
        description="리본회생이 일하는 모습을 생생히 담았습니다."
        coverImage={{
          mobile: "/workout-v2/images/contents/img_our-stories_work-mo.png",
          pc: "/workout-v2/images/contents/img_our-stories_work-pc.png",
          widthMo: 374, heightMo: 181,
          widthPc: 894, heightPc: 313,
        }}
        data={VlogWorkData}
        setActiveVideoUrl={setActiveVideoUrl}
      />

      <VlogCard
        type="culture"
        title="CULTURE"
        description="리본회생의 일상을 담은 모습을 생생히 담았습니다."
        coverImage={{
          mobile: "/workout-v2/images/contents/img_our-stories_culture-mo.png",
          pc: "/workout-v2/images/contents/img_our-stories_culture-pc.png",
          widthMo: 265, heightMo: 194,
          widthPc: 588, heightPc: 378,
        }}
        data={VlogCultureData}
        setActiveVideoUrl={setActiveVideoUrl}
      />

    </section>
  );
}