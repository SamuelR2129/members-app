export type PostType = {
  _id?: string;
  name: string;
  hours: string;
  costs: string;
  report: string;
  createdAt?: string;
  imageName?: string;
  imageUrl?: string;
};

export type PostFromDB = {
  _id: string;
  name: string;
  report: string;
  createdAt: string;
  imageName?: string;
  imageUrl?: string;
};

export type PostWithImageName = {
  _id: string;
  name: string;
  report: string;
  createdAt: string;
  imageName: string;
};

export type PostWithImageUrl = {
  _id: string;
  name: string;
  report: string;
  createdAt: string;
  imageName: string;
  imageUrl: string;
};
