
import "../styles/SectionOverview.scss";
import Image from 'next/image';
import useIsMobile from '@/utils/useIsMobile';

export interface StoryItem {
  num: string;
  color: string;
  highlight: string;
  title: string;
  desc: string;
}

export const storyList: StoryItem[] = [
  {
    num: "01",
    color: "#7193BA",
    highlight: "우리",
    title: "의 이야기",
    desc: `리본회생은 단순히 법률서비스를 제공하는 곳이 아닙니다.<br />
           새로운 삶의 시작을 바라며 서류 한 장, 절차 하나에도<br />
           진심을 다하는 리본회생의 이야기를 전합니다.`,
  },
  {
    num: "02",
    color: "#85AC6C",
    highlight: "당신",
    title: "의 이야기",
    desc: `나와 같은 상황에서 변화를 이뤄낸 사람들이<br />
           또 다른 누군가에게 희망을 전하는 이야기,<br />
           당신에게 용기가 될 수 있는 이야기를 전합니다.`,
  },
  {
    num: "03",
    color: "#795CC2",
    highlight: "세상",
    title: "의 이야기",
    desc: `여전히 많은 사람들에게 회생 제도는 어렵고<br />
           멀게만 느껴집니다. 복잡하고 방대한 정보 속에서<br />
           길을 잃지 않도록 리본회생이 바라보는<br />
           세상의 이야기를 전합니다.`,
  },
];


export default function SectionOverview() {

    const isMobile = useIsMobile();

    return (
        <section className="section-overview">
            <div className="section-overview_inner">
                <ol>
                    {storyList.map((item, index) => (
                        <li key={index} data-aos="fade-up">
                        <span className="num" style={{ color: item.color }}>
                            {item.num}
                        </span>
                        <span className="title">
                            <span style={{ color: item.color }}>{item.highlight}</span>
                            {item.title}
                        </span>
                        <p
                            className="desc"
                            dangerouslySetInnerHTML={{ __html: item.desc }}
                        />
                        </li>
                    ))}
                </ol>
            </div>

            <div className="b-o_shape shape-1">
                <Image src={
                    isMobile ?
                        '/workout-v2/images/contents/img_brand_shape-1-mo.png' :
                        '/workout-v2/images/contents/img_brand_shape-1-pc.png'
                }
                    alt={'shape1'}
                    width={isMobile ? 342 : 752} height={isMobile ? 342 : 752} />
            </div>

            <div className="b-o_shape shape-2">
                <Image src={
                    isMobile ?
                        '/workout-v2/images/contents/img_brand_shape-2-mo.png' :
                        '/workout-v2/images/contents/img_brand_shape-2-pc.png'
                }
                    alt={'shape1'}
                    width={isMobile ? 401 : 851} height={isMobile ? 401 : 851} />
            </div>

            <div className="b-o_shape shape-3">
                <Image src={
                    isMobile ?
                        '/workout-v2/images/contents/img_brand_shape-3-mo.png' :
                        '/workout-v2/images/contents/img_brand_shape-3-pc.png'
                }
                    alt={'shape1'}
                    width={isMobile ? 637 : 747} height={isMobile ? 637 : 747} />
            </div>
        </section>
    )
}