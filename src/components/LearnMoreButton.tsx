import React from "react";
import Image from "next/image";

//color: black, emboss - size : l 만 사용 가능
//color: white - size : l, m, s 모두 사용 가능
const LearnMoreButton = (props: {
  text?: string;
  link?: string;
  color?: string;
  target?: string;
  size?: string;
  onClick?: (e: React.MouseEvent) => void;
}) => {
  return (
    <>
      <a
        className="learn-more-button"
        data-color={props.color}
        data-size={props.size}
        href={props.link}
        target={props.target}
        onClick={props.onClick}
      >
        <span className="learn-more-button-text">
          <span className="text-cover">
            <strong className="text" data-text={props.text}>
              {props.text}
            </strong>
          </span>
        </span>
        <span className="ic-wrap">
          <i>
            <Image
              className="arrow-black"
              src="https://d1as53h2pztvcj.cloudfront.net/images/common/ic_arrow-right-b.png"
              alt="arrow-right"
              width={16}
              height={16}
            />
            <Image
              className="arrow-white"
              src="https://d1as53h2pztvcj.cloudfront.net/images/common/ic_arrow-right-w.png"
              alt="arrow-right"
              width={16}
              height={16}
            />
          </i>
        </span>
        <span className="bg-wrap">
          <div className="black">
            <Image
              src="https://d1as53h2pztvcj.cloudfront.net/images/common/btn_learnmore_black.png"
              alt=""
              width={368}
              height={57}
              unoptimized={true}
            />
          </div>
          <div className="black2">
            <Image
              src="https://d1as53h2pztvcj.cloudfront.net/images/common/btn_learnmore_black_v2.png"
              alt=""
              width={368}
              height={57}
              unoptimized={true}
            />
          </div>
          <div className="white">
            <Image
              src="https://d1as53h2pztvcj.cloudfront.net/images/common/btn_learnmore_white.png"
              alt=""
              width={368}
              height={57}
              unoptimized={true}
            />
          </div>
          <div className="emboss">
            <Image
              src="https://d1as53h2pztvcj.cloudfront.net/images/common/btn_learnmore_emboss.png"
              alt=""
              width={368}
              height={57}
              unoptimized={true}
            />
          </div>
          <div className="white-m">
            <Image
              src="https://d1as53h2pztvcj.cloudfront.net/images/common/btn_learnmore_white-mid.png"
              alt=""
              width={368}
              height={57}
              unoptimized={true}
            />
          </div>
          <div className="white-s">
            <Image
              src="https://d1as53h2pztvcj.cloudfront.net/images/common/btn_learnmore_white-sml.png"
              alt=""
              width={368}
              height={57}
              unoptimized={true}
            />
          </div>
        </span>
      </a>
    </>
  );
};

export default LearnMoreButton;
