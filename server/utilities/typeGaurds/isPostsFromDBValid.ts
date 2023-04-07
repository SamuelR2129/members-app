import { PostFromDB } from "../../types";

export const isPostsFromDBValid = (
  unknownData: PostFromDB[] | unknown
): unknownData is PostFromDB[] => {
  const postsFromDB = unknownData as PostFromDB[];
  return (
    Array.isArray(postsFromDB) &&
    typeof postsFromDB[0]._id &&
    typeof postsFromDB[0].buildSite === "string" &&
    typeof postsFromDB[0].createdAt &&
    typeof postsFromDB[0].name === "string" &&
    typeof postsFromDB[0].report === "string"
  );
};
