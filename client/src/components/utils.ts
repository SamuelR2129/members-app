import { PostState } from "../types";

export const pulsePostCardToggle = () => {
  document.querySelector("#post-wrapper")?.classList.toggle("animate-pulse");
};

export const filterTrimOrderPosts = (
  globalFeed: PostState[],
  selectedSite: string
) => {
  const filteredPosts = globalFeed.filter((post) =>
    post.buildSite.toLowerCase().includes(selectedSite.toLowerCase())
  );

  const removedDuplicatesFromPosts = filteredPosts.filter(
    (post, index, self) => index === self.findIndex((o) => o._id === post._id)
  );

  const newestPostsFirst = removedDuplicatesFromPosts.sort(
    (postA, postB) =>
      new Date(postB.createdAt).getTime() - new Date(postA.createdAt).getTime()
  );

  return newestPostsFirst;
};

export const injectEditedPostIntoFeed = (
  editedPost: PostState,
  globalFeed: PostState[]
) => {
  return globalFeed.map((post) =>
    post._id !== editedPost._id ? post : editedPost
  );
};
