"use client";

import "../styles/SectionMore.scss";
import ReadMoreButton from '@/components/new-reborn/ReadMoreButton';

export default function SectionMore() {

  return (
      <section className="section-more"data-aos="fade-up">
        <p>리본회생 브랜드에 대해 <br className="mo-only"/>자세히 알아보기</p>
        <div>
          <ReadMoreButton text="브랜드소개" color="black" direction="right" />
        </div>
      </section>
  );
}