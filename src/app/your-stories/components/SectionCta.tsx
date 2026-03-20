import { useState, useEffect } from 'react';
import "../styles/SectionCta.scss";

const descriptions = [
  <>
    나와 비슷한 사례로 느껴진다면<br />
    <span>자세하게 <strong className='blue'>상담</strong> 받아보세요</span>
  </>,
  <>
    <p>고객님이 다시 웃을 수 있도록<br />저희는 늘 먼저 생각합니다</p>
    <span>지금 상담으로, <strong className='purple'>새로운 시작</strong> 함께해요</span>
  </>,
  <>
    <p>고객님이 다시 웃을 수 있도록<br />저희는 늘 먼저 생각합니다</p>
    <span>지금 상담으로, <strong className='green'>새로운 시작</strong> 함께해요</span>
  </>
];

export default function CtaSection() {

  const [randomIndex, setRandomIndex] = useState(0);

  useEffect(() => {
    const random = Math.floor(Math.random() * descriptions.length);
    setRandomIndex(random);
  }, []);


  return (
    <>
      <section className="section-cta">
        <button type="button" data-aos="fade-up">

          <span className='cta_desc'>
            {descriptions[randomIndex]}
          </span>

          <span className="cta_button">
            <span className="blind">이동</span>
            <span className="arrow"></span>
          </span>

        </button>
      </section>
    </>
  );
}