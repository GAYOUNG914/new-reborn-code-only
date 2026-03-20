export type OurStoriesContent = {
  id: number;
  title: string;
  article: string;
  imageUrl: string;
  videoUrl: string;
  tagIds: string[];
  hide: boolean;
  divisionUScatch: boolean;
  divisionWork: boolean;
  divisionCulture: boolean;
};

export type OurStoriesResult = {
  contents: OurStoriesContent[];
  currentSize: number;
  hasMore: boolean;
  nextId: number;
  nextValue: string | 0;
  firstPage: boolean;
};

export type OurStoriesResponse = {
  statusCode: string;
  message: string;
  result: OurStoriesResult;
};


export type VlogResponse = {
  statusCode: string;
  message: string;
  result: {
    contents: VlogItem[];
    currentSize: number;
    hasMore: boolean;
    nextId: number;
    nextValue: string | number;
    firstPage: boolean;
  };
}

export type VlogItem = {
  id: number;
  title: string;
  imageUrl: string;
  videoUrl: string;
  hide: boolean;
  divisionUSketch: number;
  divisionWork: number;
  divisionCulture: number;
}

export type KvResponse = {
  statusCode: string;
  message: string;
  result: {
    contents: KvItem[];
  };
};

export type KvItem = {
  id: number;
  article: string;
  imageUrl: string;
  pcImageUrl: string;
  videoUrl: string;
  autoColor: boolean;
  color: string;
};
