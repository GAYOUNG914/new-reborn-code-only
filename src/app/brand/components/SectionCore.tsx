import { ShapeSwiperItem, ShapeItem } from "@/types/Brand";
import "../styles/SectionCore.scss";
import ShapeSwiper from "./ShapeSwiper";

export const coreList: ShapeSwiperItem[] = [
  {
    title: "Ribbon",
    subTitle: "리본으로 선물하다",
    desc: `우리는 새로운 삶이라는 선물을 드리고 싶다는 뜻으로,<br />리본을 감듯 조심스럽게, 당신의 일상을 감싸 안겠습니다`,
    imgSrcPc: "/workout-v2/images/contents/img_brand_core-1-pc.png",
    imgSrcMo: "/workout-v2/images/contents/img_brand_core-1-mo.png",
    wPc: 873,
    wMo: 276,
    hPc: 587,
    hMo: 88,
  },
  {
    title: "Vision",
    subTitle: "비전",
    desc: `언제든 다시 시작할 수 있도록<br />고객의 삶을 새롭게`,
    imgSrcPc: "/workout-v2/images/contents/img_brand_core-2-pc.png",
    imgSrcMo: "/workout-v2/images/contents/img_brand_core-2-mo.png",
    wPc: 200,
    wMo: 276,
    hPc: 267,
    hMo: 88,
  },
  {
    title: "Mission",
    subTitle: "미션",
    desc: `재정적 어려움 속에서도<br />삶의 회복과 새로운 출발을 위해`,
    imgSrcPc: "/workout-v2/images/contents/img_brand_core-3-pc.png",
    imgSrcMo: "/workout-v2/images/contents/img_brand_core-3-mo.png",
    wPc: 280,
    wMo: 276,
    hPc: 290,
    hMo: 88,
  },
];

export const shapeList: ShapeItem[] = [
  {
    id: "shape-1",
    imgPc: "/workout-v2/images/contents/img_brand_core-shape1-pc.png",
    imgMo: "/workout-v2/images/contents/img_brand_core-shape1-mo.png",
    wPc: 1000,
    hPc: 670,
    wMo: 500,
    hMo: 500,
  },
  {
    id: "shape-2",
    imgPc: "/workout-v2/images/contents/img_brand_core-shape2-pc.png",
    imgMo: "/workout-v2/images/contents/img_brand_core-shape2-mo.png",
    wPc: 1000,
    hPc: 1000,
    wMo: 500,
    hMo: 500,
  },
];


export default function SectionCore() {
  return (
    <ShapeSwiper
      sectionName="section-core"
      title="Core Values"
      subTitle="핵심가치"
      list={coreList}
      shapes={shapeList}
    />
  );
}
