export type PostType = {
    _id?: string;
    name: string;
    hours: string;
    costs: string;
    report: string;
    buildSite: string;
    createdAt?: string;
    imageNames?: string;
    imageUrls?: string;
};

export type DynamoDb = {
    Items: PostFromDB[];
    LastEvaluatedKey: object;
};

export type PostFromDB = {
    _id: string;
    name: string;
    report: string;
    buildSite: string;
    createdAt: string;
    imageNames?: string[];
    imageUrls?: string[];
};

export type PostWithImageName = {
    _id: string;
    name: string;
    report: string;
    buildSite: string;
    createdAt: string;
    imageNames: string;
};

export type PostWithImageUrl = {
    _id: string;
    name: string;
    report: string;
    buildSite: string;
    createdAt: string;
    imageNames: (string | undefined)[];
    imageUrls: (string | undefined)[];
};
