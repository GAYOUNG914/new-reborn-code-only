export type YourStoriesContent = {
  id: number;
  title: string;
  date: string;
  article: string;
  tagIds: string[];
  imageUrl: string;
  videoUrl: string;
  info?: string;
  view: number;
  isProfile: boolean;
  profileUrl: string;
  timeLength?: number,
};

export type YourStoriesResult = {
  contents: YourStoriesContent[];
  currentSize: number;
  hasMore: boolean;
  nextId: number;
  nextValue: string | 0; // 문자열 또는 숫자 0
  firstPage: boolean;
};

export type YourStoriesResponse = {
  statusCode: string;
  message: string;
  result: YourStoriesResult;
};
