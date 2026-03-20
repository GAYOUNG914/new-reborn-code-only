import '@/app/post/styles/LibraryGrid.scss';
import Image from 'next/image';
import ReadMoreButton from '@/components/new-reborn/ReadMoreButton';

import bookCover01 from '@/app/assets/images/contents/post_li_book-01.png';
import bookCover02 from '@/app/assets/images/contents/post_li_book-02.png';
import bookCover03 from '@/app/assets/images/contents/post_li_book-03.png';
import bookCover04 from '@/app/assets/images/contents/post_li_book-04.png';

// API 응답 타입
interface LibraryContent {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  author: string;
  company: string;
  hide: boolean;
  isNew: boolean;
}

interface LibraryResponse {
  statusCode: string;
  message: string;
  result: {
    contents: LibraryContent[];
    currentSize: number;
    hasMore: boolean;
    nextId: string;
    nextValue: string | number;
    firstPage: boolean;
  };
}

// 샘플 데이터 (실제로는 API에서 받아올 데이터)
const sampleData: LibraryResponse = {
  statusCode: "200",
  message: "ok",
  result: {
    contents: [
      {
        id: "article_1",
        imageUrl: bookCover01.src,
        title: "12312315sagasg############",
        subtitle: "경제적으로 설명 설명 경경제적으로 설명 설명 경 경제적으로 설명 설명 경제적으로 설명 설명 경제적으로 설명 설명 경제적으로 설명",
        author: "김민수",
        company: "스타출판사",
        hide: false,
        isNew: true,
      },
      {
        id: "article_2",
        imageUrl: bookCover02.src,
        title: "홀가분하게 산다",
        subtitle: "경제적으로 설명 설명 경제적으로 설명 설명 경제적으로 설명 설명 경제적으로 설명",
        author: "김민수",
        company: "스타출판사",
        hide: false,
        isNew: true,
      },
      {
        id: "article_3",
        imageUrl: bookCover03.src,
        title: "홀가분하게 산다",
        subtitle: "경제적으로 설명 설명 경제적으로 설명 설명 경제적으로 설명 설명 경제적으로 설명",
        author: "김민수",
        company: "스타출판사",
        hide: false,
        isNew: true,
      },
      {
        id: "article_4",
        imageUrl: bookCover04.src,
        title: "홀가분하게 산다",
        subtitle: "경제적으로 설명 설명 경제적으로 설명 설명 경제적으로 설명 설명 경제적으로 설명",
        author: "김민수",
        company: "스타출판사",
        hide: false,
        isNew: true,
      }
    ],
    currentSize: 4,
    hasMore: true,
    nextId: "article_5",
    nextValue: "179749374_EP.03 스무 해",
    firstPage: true
  }
};

export default function LibraryGrid() {
  // 실제로는 API에서 데이터를 받아올 예정
  const { contents } = sampleData.result;
  
  return (
    <div className="library-grid">
      <div className="library-grid-container" data-aos="fade-up">
        {contents.map((book) => (
          <button key={book.id} className="book-item">
            <div className="book-item_cover">
              <Image 
                className="cover-image"
                src={book.imageUrl} 
                alt={book.title}
                width={135}
                height={200}
              />
            </div>
            <div className="book-item_info">
              <div className="book-item_info_title">
                <span>{book.title}</span>
                {book.isNew && <span className="new-badge">NEW</span>}
              </div>
              <div className="book-item_info_publisher">{book.company}</div>
              <div className="book-item_info_description">{book.subtitle}</div>
            </div>
          </button>
        ))}
      </div>
      <div data-aos="fade-up">
        <ReadMoreButton
          text="더보기"
          color="border-w"
        />
      </div>
    </div>
  );
}