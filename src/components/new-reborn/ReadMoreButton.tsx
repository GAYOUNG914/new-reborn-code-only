import "./ReadMoreButton.scss";

type ReadMoreButtonProps = {
  text?: string,
  color?: "black" | "gray" | "border-w" | "border-b";
  direction?: "down" | "right" | "top";
  onClick?: () => void;
};

export default function ReadMoreButton({
  text = "더보기",
  color = "black",
  direction = "down",
  onClick,
}: ReadMoreButtonProps) {
  const className = `btn-readmore c-${color} d-${direction}`;

  return (
    <button type="button" className={className} onClick={onClick}>
      <span className="text">{text}</span>
      <span className="icon" />
    </button>
  );
}
