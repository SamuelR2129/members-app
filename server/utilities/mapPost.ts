import { PostFromDB } from "../types";
import makePostWithImage from "./makePostWithImage";

const mapPost = async (postsFromDB: PostFromDB[]) => {
  const postsWithImages = await Promise.all(
    postsFromDB.map(async (post) => {
      if (post.imageName) {
        const postWithImageUrl = await makePostWithImage(post);
        return postWithImageUrl;
      }
      return post;
    })
  );

  const mappedPosts = postsWithImages.sort(
    (post1, post2) => Date.parse(post2.createdAt) - Date.parse(post1.createdAt)
  );

  return mappedPosts;
};

export default mapPost;
