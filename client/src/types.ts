export type PostState = {
  id: string;
  name: string;
  report: string;
  createdAt: string;
  buildSite: string;
  imageNames?: string[];
  imageUrls?: string[];
};

export type EditedPost = {
  status: number;
  result: string;
  data: { data: PostState };
};
