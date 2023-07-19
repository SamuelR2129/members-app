export type PostState = {
  _id: string;
  name: string;
  report: string;
  createdAt: string;
  buildSite: string;
  imageNames: (string | undefined)[];
  imageUrls: (string | undefined)[];
};

export type EditedPost = {
  status: number;
  result: string;
  data: { data: PostState };
};
