// ===Post 섹션 공통 타입 ===
export interface PostCommonResponse {
  statusCode: string;
  message: string;
  result: {
    // 세상의 이야기 상단
    firstLayout: {
      innerImageUrl: string;
      outterImageUrl: string;
      outterImageUrlMo: string; // mo추가
      mainText: string;
      subText: string;
      date: string;
      dateEng: string;
    };
    // 리본툰 대문 
    secondLayout: {
      imageUrl: string;
    };
    secondLayoutMo: { // mo추가
      imageUrl: string; 
    };
  };
}


// ===Insight 섹션 Swiper 타이틀===
export type InsightSwiperContent = {
  id: string;
  bgImageUrl: string;
  imageUrl: string;
  index: number;
  title: string;
  subtitle: string;
  date: string;
  categoryIds: [
    {
      id: number;
      title: string;
    }
  ];
  manager: {
    id: string;
    name: string;
    profileImage: string;
  };
}

export type InsightSwiperResult = {
  contents: InsightSwiperContent[];
}

export type InsightSwiperResponse = {
  statusCode: string;
  message: string;
  result: InsightSwiperResult;
}



// ===Insight 섹션 카테고리 ===
export interface CategoryItem {
  categoryId: number;
  order: number;
  title: string;
  hide: boolean;
}

export interface CategoryResponse {
  statusCode: string;
  message: string;
  result: CategoryItem[];
} 



// ===Insight Grid 아이템 ===
export interface InsightGridItem {
  id: string;
  title: string;
  date: string;
  categoryIds: {
    id: number;
    title: string;
  }[];
  imageUrl: string;
  isHot: boolean;
  isNew: boolean;
  hide: boolean;
}

export interface InsightGridResult {
  contents: InsightGridItem[];
  currentSize: number;
  hasMore: boolean;
  nextId: string;
  nextValue: string;
  firstPage: boolean;
}

export interface InsightGridResponse {
  statusCode: string;
  message: string;
  result: InsightGridResult;
}


// ===Library Swiper ===
export interface LibraryManager {
  id: string;
  name: string;
  profileImage: string;
  bgImage: string;
  bgImageMo: string; //mo 추가
}

export interface LibraryBook {
  title: string;
  imageUrl: string;
  subtitle: string;
  author: string;
  company: string;
}

export interface LibraryMonthlyBook {
  id: string;
  subtitle: string;
  manager: LibraryManager;
  book: LibraryBook;
}

export interface LibraryEditorsPick {
  id: string;
  subtitle: string;
  manager: LibraryManager;
  book: LibraryBook;
  editorsMention: string;
}

export interface LibraryQuotes {
  id: string;
  manager: LibraryManager;
  book: LibraryBook;
  quotes: string;
}

export interface LibraryResult {
  monthlyBook: LibraryMonthlyBook;
  editorsPick: LibraryEditorsPick;
  quotes: LibraryQuotes;
}

export interface LibraryResponse {
  statusCode: string;
  message: string;
  result: LibraryResult;
}


// ===Toon 섹션 ===
// API 응답 타입
export interface ToonContent {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  episode: number;
  hide: boolean;
  isHot: boolean;
  isNew: boolean;
}

export interface ToonResponse {
  statusCode: string;
  message: string;
  result: {
    contents: ToonContent[];
    currentSize: number;
    hasMore: boolean;
    nextId: string;
    nextValue: string | number;
    firstPage: boolean;
  };
}