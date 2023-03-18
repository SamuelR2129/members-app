import { PostFromDB } from "../types";
import makePostWithImage from "./makePostWithImage";

const mapPost = async (postsFromDB: PostFromDB[]) => {
  const mappedPosts = await Promise.all(
    postsFromDB.map(async (post) => {
      if (post.imageName) {
        const postWithImageUrl = await makePostWithImage(post);
        return postWithImageUrl;
      }
      return post;
    })
  );

  return mappedPosts;
};

export default mapPost;
