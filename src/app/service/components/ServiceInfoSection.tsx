"use client";

import Image from "next/image";

interface ServiceInfoSectionProps {
  backgroundImage: string;
  mainTitle: string;
  mainTitleColor?: string;
  subTitle: React.ReactNode;
  tagTexts: string[];
  visualImg: string;
  visualPosition?: 'green' | 'blue' | 'purple';
}

export default function ServiceInfoSection({
  backgroundImage,
  mainTitle,
  mainTitleColor,
  subTitle,
  tagTexts,
  visualImg,
  visualPosition = 'green'
}: ServiceInfoSectionProps) {
  return (
    <section 
      className={`content-section ${visualPosition}-section`} 
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="content-section_container">
        <div className="content-section_text">
          <h2 
            className="content-section_main-title"
            style={{ color: mainTitleColor }}
          >
            {mainTitle}
          </h2>
          <p className="content-section_sub-title">
            {subTitle}
          </p>
          <ul className="content-section_tags">
            {tagTexts.map((tagText, index) => (
              <li key={index} className="content-section_tag">
                {tagText}
              </li>
            ))}
          </ul>
        </div>
        <div className={`content-section_visual content-section_visual--${visualPosition}`}>
          <Image src={visualImg} alt="" width={600} height={400} />
        </div>
      </div>
    </section>
  );
} 