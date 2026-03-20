import Image from "next/image";
import "../styles/InsightGrid.scss";
import { useState } from "react";
import { InsightGridItem } from "@/types/Post";
import { mockGridData } from "@/data/post/InsightGridData";
import ReadMoreButton from "@/components/new-reborn/ReadMoreButton";

import gridBg01 from "@/app/assets/images/contents/post_is_grid-01.png";
import gridBg02 from "@/app/assets/images/contents/post_is_grid-02.png";
import gridBg03 from "@/app/assets/images/contents/post_is_grid-03.png";

export default function InsightGrid() {
  const [gridData] = useState<InsightGridItem[]>(mockGridData.result.contents);

  const getBackgroundImage = (index: number) => {
    const images = [gridBg01, gridBg02, gridBg03];
    return images[index % images.length];
  };

  return (
    <div className="insight-grid">
      <div className="insight-grid-container" data-aos="fade-up" data-aos-delay="100">
        {gridData
          .filter(item => !item.hide)
          .map((item, index) => (
            <button key={item.id} className="insight-grid-item" onClick={() => {
              console.log(item);
            }}>
              <div className="insight-grid-item-flag-wrapper">
                {item.isHot && <div className="insight-grid-item-flag_hot">HOT</div>}
                {item.isNew && <div className="insight-grid-item-flag_new">NEW</div>}
              </div>
              <div className="insight-grid-item-text-wrapper">
                <div className="insight-grid-item-text-wrapper_badge">
                  <span>
                    {item.categoryIds[0]?.title || "카테고리"}
                  </span>
                </div>
                <div className="insight-grid-item-text-wrapper_title">
                  <span className="s1_n">
                    {item.title}
                  </span>
                </div>
                <div className="insight-grid-item-text-wrapper_date">
                  <span>{item.date}</span>
                </div>
              </div>
              <div className="insight-grid-item_bg">
                <Image
                  src={getBackgroundImage(index)}
                  alt="grid-bg"
                  width={276}
                  height={413}
                />
              </div>
            </button>
          ))}
      </div>
      <div data-aos="fade-up">
        <ReadMoreButton color="border-b"/>
      </div>
    </div>
  );
}