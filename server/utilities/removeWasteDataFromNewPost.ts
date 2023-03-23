import { PostFromDB } from "../types";

const removeWasteDataFromNewPost = (post: unknown): PostFromDB => {
  const dbPost = post as PostFromDB;
  if (dbPost.name && dbPost.report && dbPost._id) {
    const newPost = {
      _id: dbPost._id,
      name: dbPost.name,
      report: dbPost.report,
      imageName: dbPost.imageName,
      createdAt: dbPost.createdAt,
    };

    return newPost;
  } else {
    throw new Error(
      `newPost missing a value - name:${dbPost.name}, id: ${dbPost._id}, report: ${dbPost.report}`
    );
  }
};

export default removeWasteDataFromNewPost;
