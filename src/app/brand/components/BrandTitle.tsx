
import "../styles/BrandTitle.scss";

export default function BrandTitle({ title, desc }: { title?: string, desc?: string }) {
  return (
    <>
      <h2 className="brand-title">{title}</h2>
      {
        desc && <p className="brand-desc">{desc}</p>
      }
    </>
  )  
}