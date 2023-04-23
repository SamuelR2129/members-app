import { useRecoilState } from "recoil";
import tw from "tailwind-styled-components";
import { feedState } from "../atom/feedAtom";
import { PostState } from "../types";
import { pulsePostCardToggle } from "./utilities";

type PostType = {
  post: {
    _id: string;
    name: string;
    report: string;
    buildSite: string;
    createdAt: string;
    imageUrl?: string;
    imageName?: string;
  };
};

const PostWrapper = tw.div`
  m-2
  p-2
  border-2
  border-solid
  border-gray-200
`;

const DeleteButton = tw.button`
  p-1 
  border-1 
  border-solid 
  bg-red-100
  border-red-500
  hover:bg-red-300
  active:bg-red-500
  active:ring 
  active:ring-red-300
  cursor-pointer
`;

const EditButton = tw.button`
  p-1 
  border-1 
  border-solid 
  bg-blue-100
  border-blue-500
  hover:bg-blue-300
  active:bg-blue-500
  active:ring 
  active:ring-blue-300
  cursor-pointer
`;

const removeStatePostById = (
  feed: PostState[],
  _idToRemove: string
): PostState[] => {
  const newArray = feed.filter((post) => post._id !== _idToRemove);
  return newArray;
};

const Posts = ({ post }: PostType) => {
  const [feed, setFeed] = useRecoilState(feedState);

  const deletePost = async (post: PostState) => {
    pulsePostCardToggle();

    const deleteBodyData = { imageName: post.imageName || "" };

    const response = await fetch(`/api/member/posts/delete/${post._id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(deleteBodyData),
    });

    if (!response.ok) {
      pulsePostCardToggle();

      alert("There was an issue removing the post, try again!");

      throw new Error(
        `This is an HTTP error deleting your post: The status is ${response.status}`
      );
    }

    const newFeed = removeStatePostById(feed, post._id);
    setFeed(newFeed);
    pulsePostCardToggle();
    alert("Post was deleted!");
  };

  const editPost = (post: PostState) => {};

  return (
    <PostWrapper id="post-wrapper">
      <div>{post.name}</div>
      <div>{post.buildSite}</div>
      <div>{post.report}</div>
      {post.imageUrl && (
        <img
          alt="Feed"
          src={post.imageUrl}
          id={post.imageName}
          style={{ width: "300px", height: "300px" }}
        />
      )}
      <div className="flex justify-between mt-4">
        <EditButton onClick={() => editPost(post)}>Edit</EditButton>
        <DeleteButton onClick={() => deletePost(post)}>Delete</DeleteButton>
      </div>
    </PostWrapper>
  );
};

export default Posts;
