import ReadMoreButton from '@/components/new-reborn/ReadMoreButton';
import "../styles/Title.scss";
export default function Title({ title, desc, desc2, readmorebtn, color, main }: { title?: string | React.ReactNode, desc?: string | React.ReactNode, desc2?: string | React.ReactNode, readmorebtn: string, color: "black" | "gray" | "border-w" | "border-b" | undefined, main?: boolean }) {
  return (
    <>
      <h3 className="heading h4_n" data-aos="fade-up" data-aos-offset="50">{title}</h3>
      <p className="s1_n desc" data-aos="fade-up" data-aos-delay="100" data-aos-offset="50"><strong>{desc}</strong></p>
      <p className="desc2" data-aos="fade-up" data-aos-delay="200" data-aos-offset="50">{desc2}</p>
      <div className={`readmorebtn ${main ? "" : "pc-tablet-only"}`} data-aos="fade-up" data-aos-delay="300" data-aos-offset="50">
        <ReadMoreButton text={readmorebtn} direction="right" color={color}/>
      </div>
    </>
  )
}