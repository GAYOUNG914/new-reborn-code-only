import "../styles/SectionInsight.scss";
// import Title from "./Title";
import InsightSwiper from "./InsightSwiper";
import InsightCategory from "./InsightCategory";
import InsightGrid from "./InsightGrid";
import ReadMoreButton from "@/components/new-reborn/ReadMoreButton";
import SectionCTA from "./SectionCTA";

export default function SectionInsight() {
  return (
    <div className="section-insight">
      <InsightSwiper/>
      <InsightCategory/>
      <InsightGrid/>
      <SectionCTA 
        title={<p>리본회생과 함께한 <br />사람들의 이야기도 만나보세요</p>} buttonText="당신의 이야기 보러가기" buttonColor="black" backgroundColor="#FEFBF7"/>
    </div>
  );
}