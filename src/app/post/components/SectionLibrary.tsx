import "../styles/SectionLibrary.scss";
import LibrarySwiper from "./LibrarySwiper";
import LibraryGrid from "./LibraryGrid";
import SectionCTA from "./SectionCTA";

export default function SectionLibrary() {
  return (
    <div className="section-library">
      <LibrarySwiper />
      <LibraryGrid />
      <SectionCTA title={<p>얻은 정보가 도움이 되셨다면 <br />리본회생에 대해 더 알아보세요.</p>} buttonText="브랜드 소개 보러가기" buttonColor="gray" backgroundColor="#222"/>
    </div>
  );
}