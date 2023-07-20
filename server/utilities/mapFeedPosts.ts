import { PostFromDB, PostWithImageUrl } from "../types";
import addImageToPost from "./addImageToPost";

const mapPosts = async (
  postsFromDB: PostFromDB[]
): Promise<PostWithImageUrl[]> => {
  const postsWithImages = await Promise.all(
    postsFromDB.map(async (post) => {
      return await addImageToPost(post);
    })
  );

  const mappedPosts = postsWithImages.sort(
    (post1, post2) => Date.parse(post2.createdAt) - Date.parse(post1.createdAt)
  );

  return mappedPosts;
};

export default mapPosts;
