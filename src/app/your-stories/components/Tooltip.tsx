import { useState, useEffect, useRef } from "react";
import "../styles/Tooltip.scss";


export default function Tooltip({ info }: { info: string | React.ReactNode }) {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // ⓘ 클릭 → 토글 동작
  const handleToggleTooltip = () => {
    setIsTooltipVisible((prev) => !prev);
  };

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setIsTooltipVisible(false);
      }
    };
    if (isTooltipVisible) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isTooltipVisible]);

  // 말풍선 전체 클릭 → 닫기
  const handleTooltipClick = () => {
    setIsTooltipVisible(false);
  };

  
  return (
    <div className="tooltip-wrapper" ref={tooltipRef}>
      <span className="icon" onClick={handleToggleTooltip}></span>

      {isTooltipVisible && (
        <div className="tooltip" onClick={handleTooltipClick}>
          <div className="contents">
            <p>{info}</p>
            <button type="button" className="btn-close">
              <span className="blind">닫기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
