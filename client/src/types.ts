export type PostState = {
  _id: string;
  name: string;
  report: string;
  createdAt: string;
  buildSite: string;
  imageUrl?: string;
  imageName?: string;
};

export type EditedPost = {
  status: number;
  result: string;
  data: { data: PostState };
};
