import { ShapeItem, ShapeSwiperItem } from "@/types/Brand";
import "../styles/SectionIdentity.scss";
import ShapeSwiper from "./ShapeSwiper";

export const identityList: ShapeSwiperItem[] = [
  {
    title: "Re-born",
    subTitle: "다시 태어나다",
    desc: `지금의 어려움이 끝이 아닌, 새로운 시작이 되기를 바라며,<br/>다시 일어설 수 있도록 함께 도와드리겠습니다`,
    imgSrcPc: "/workout-v2/images/contents/img_brand_identity-1-pc.png",
    imgSrcMo: "/workout-v2/images/contents/img_brand_identity-1-mo.png",
    wPc: 463,
    wMo: 240,
    hPc: 540,
    hMo: 280,
  },
  {
    title: "Better",
    subTitle: "비전",
    desc: `레이어드와 상승을 직관적으로 보여주어<br/>더 좋은 방향으로 나아감을 표현`,
    imgSrcPc: "/workout-v2/images/contents/img_brand_identity-2-pc.png",
    imgSrcMo: "/workout-v2/images/contents/img_brand_identity-2-mo.png",
    wPc: 200,
    wMo: 149,
    hPc: 200,
    hMo: 149,
  },
  {
    title: "Focus",
    subTitle: "맞춤형",
    desc: `점이 모이면 선이 되고 선이 모이면 면이 되듯,<br/>각 개체가 맞춰지는 것을 표현`,
    imgSrcPc: "/workout-v2/images/contents/img_brand_identity-3-pc.png",
    imgSrcMo: "/workout-v2/images/contents/img_brand_identity-3-mo.png",
    wPc: 237,
    wMo: 162,
    hPc: 253,
    hMo: 173,
  },
];

export const shapeList: ShapeItem[] = [
  {
    id: "shape-1",
    imgPc: "/workout-v2/images/contents/img_brand_identity-shape1-pc.png",
    imgMo: "/workout-v2/images/contents/img_brand_identity-shape1-mo.png",
    wPc: 163,
    hPc: 163,
    wMo: 100,
    hMo: 100,
  },
  {
    id: "shape-2",
    imgPc: "/workout-v2/images/contents/img_brand_identity-shape2-pc.png",
    imgMo: "/workout-v2/images/contents/img_brand_identity-shape2-mo.png",
    wPc: 892,
    hPc: 892,
    wMo: 500,
    hMo: 500,
  },
  {
    id: "shape-3",
    imgPc: "/workout-v2/images/contents/img_brand_identity-shape3-pc.png",
    imgMo: "/workout-v2/images/contents/img_brand_identity-shape3-mo.png",
    wPc: 1078,
    hPc: 952,
    wMo: 710,
    hMo: 635,
  },
];


export default function SectionIdentity() {
  return (
    <ShapeSwiper
      sectionName="section-identity"
      title="Brand Identity"
      subTitle="브랜드 아이덴티티"
      list={identityList}
      shapes={shapeList}
    />
  );
}
