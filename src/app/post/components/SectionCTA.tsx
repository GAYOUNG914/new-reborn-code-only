import '@/app/post/styles/SectionCTA.scss';
import ReadMoreButton from '@/components/new-reborn/ReadMoreButton';


export default function SectionCTA(props: {
  title: React.ReactNode;
  buttonText: string;
  buttonColor: 'black' | 'gray' | 'border-w' | 'border-b';
  backgroundColor?: string;
}) {
  const { title, buttonText, buttonColor, backgroundColor } = props;
  
  return (
    <div className="section-cta" style={{ backgroundColor: backgroundColor }}>
      <div className="section-cta-container">
        <div className="section-cta-title" data-aos="fade-up">
          {title}
        </div>
        <div className="section-cta-content" data-aos="fade-up" data-aos-delay="100">
          <ReadMoreButton text={buttonText} color={buttonColor} direction="right" />
        </div>
      </div>
    </div>
  )}