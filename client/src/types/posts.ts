export type PostState = {
  _id: string;
  name: string;
  report: string;
  createdAt: string;
  buildSite: string;
  imageUrl?: string;
  imageName?: string;
};

export type AddPostResponseData = {
  status: number;
  result: string;
  data: [PostState];
};
