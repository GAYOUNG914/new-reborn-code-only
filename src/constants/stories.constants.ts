// 배경 데이터 타입 정의
type BackgroundData = {
  type: "video" | "image";
  image: {
    desktop: string;
    mobile: string;
    alt: string;
    width: number;
    height: number;
  }[];
  video?: {
    src: string;
    type: string;
    poster?: string;
  };
};

// 배경 데이터
export const backgroundData: BackgroundData = {
  type: "image", // 'video' 또는 'image'
  image: [
    {
      desktop:
        "https://d1as53h2pztvcj.cloudfront.net/images/main/bg_customer.avif",
      mobile:
        "https://d1as53h2pztvcj.cloudfront.net/images/main/bg_customer_m.avif",
      alt: "다시와 함께한 이야기",
      width: 1440,
      height: 810,
    },
    {
      desktop:
        "https://d1as53h2pztvcj.cloudfront.net/images/main/bg_customer2.avif",
      mobile:
        "https://d1as53h2pztvcj.cloudfront.net/images/main/bg_customer2_m.avif",
      alt: "다시와 함께한 이야기",
      width: 1440,
      height: 810,
    },
    {
      desktop:
        "https://d1as53h2pztvcj.cloudfront.net/images/main/bg_customer3.avif",
      mobile:
        "https://d1as53h2pztvcj.cloudfront.net/images/main/bg_customer3_m.avif",
      alt: "다시와 함께한 이야기",
      width: 1440,
      height: 810,
    },
  ],
  // video: {
  //   src: "https://d1as53h2pztvcj.cloudfront.net/videos/main/video.mp4",
  //   type: "video/mp4",
  //   // poster: "https://d1as53h2pztvcj.cloudfront.net/images/main/img_vid-poster.png" // 필요시 주석 해제
  // }
};

export const caseData = [
  "이혼소송",
  "상간자소송",
  "위자료청구",
  "협의이혼",
  "조정이혼",
  "양육권분쟁",
  "친권양육권"
];

export const ageData = [
  "10대 남성",
  "10대 여성",
  "10대",
  "20대 남성",
  "20대 여성",
  "20대",
  "30대 남성",
  "30대 여성",
  "30대",
  "40대 남성",
  "40대 여성",
  "40대",
  "50대 남성",
  "50대 여성",
  "50대",
  "60대 남성",
  "60대 여성",
  "60대",
  "70대 남성",
  "70대 여성",
  "70대",
  "80대 남성",
  "80대 여성",
  "80대",
  "90대 남성",
  "90대 여성",
  "90대",
  "남성",
  "여성",
];

export const tagData = [
  "황혼이혼",
  "신혼이혼",
  "육아전담",
  "경제적갈등",
  "가정폭력피해",
  "외도증거확보",
  "배우자외도"
];

export const disagreementData = [
  "이혼반대",
  "이혼거부"
]

export const snsLinks = [
  {
    href: "https://pf.kakao.com/_FWHWG",
    alt: "카카오 채널 바로가기",
    src: "https://imagedelivery.net/e0-3jqSze_fGgLHLQnpXsA/2384059b-d233-426b-ef51-8c7122b66000/public",
    isNextImage: false,
    channel: "kakao",
  },
  {
    href: "https://www.youtube.com/channel/UCk7gBQeJmBt6VlA_W0NpkZw/featured",
    alt: "유튜브 바로가기",
    src: "https://imagedelivery.net/e0-3jqSze_fGgLHLQnpXsA/ace98c9c-a7fd-4a63-d1a9-00b9cf2b5000/public",
    isNextImage: true,
    width: 150,
    height: 150,
    quality: 100,
    channel: "youtube",
  },
  {
    href: "https://blog.naver.com/star_law",
    alt: "네이버 블로그 바로가기",
    src: "https://imagedelivery.net/e0-3jqSze_fGgLHLQnpXsA/168abe65-0520-4d4d-e947-59690c9db200/public",
    isNextImage: false,
    channel: "blog",
  },
  {
    href: "https://www.instagram.com/starlawfirm_official/",
    alt: "인스타 바로가기",
    src: "https://imagedelivery.net/e0-3jqSze_fGgLHLQnpXsA/bd5bdea7-1825-4bb9-d3d3-ce2c9e49ec00/public",
    isNextImage: true,
    width: 150,
    height: 150,
    quality: 100,
    channel: "instagram",
  },
];
