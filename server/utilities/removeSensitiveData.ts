import { PostFromDB } from "../types";

const removeSensitiveData = (post: PostFromDB): PostFromDB => {
  const newPost = {
    _id: post._id,
    name: post.name,
    report: post.report,
    buildSite: post.buildSite,
    imageNames: post.imageNames,
    createdAt: post.createdAt,
  };

  return newPost;
};

export default removeSensitiveData;
