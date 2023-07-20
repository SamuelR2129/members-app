import { useRecoilState } from "recoil";
import { feedState, updatePostState } from "../atom/feedAtom";
import { PostState } from "../types";
import { pulsePostCardToggle } from "./utils";
import { Link, useLocation } from "react-router-dom";
import { DeleteButton, PostWrapper } from "../styles/posts";

type PostType = {
  post: {
    _id: string;
    name: string;
    report: string;
    buildSite: string;
    createdAt: string;
    imageNames: (string | undefined)[];
    imageUrls: (string | undefined)[];
  };
};

export type EditFormValues = {
  _id: string;
  report: string;
  buildSite: string;
};

const removeStatePostById = (
  feed: PostState[],
  _idToRemove: string
): PostState[] => {
  const newArray = feed.filter((post) => post._id !== _idToRemove);
  return newArray;
};

const Posts = ({ post }: PostType) => {
  const [globalFeed, setGlobalFeed] = useRecoilState(feedState);
  const [formValues, setFormValues] = useRecoilState(updatePostState);
  const location = useLocation();

  const deletePost = async (post: PostState) => {
    pulsePostCardToggle();

    const deleteBodyData = { imageNames: post.imageNames || "" };

    const response = await fetch(`/posts/delete/${post._id}`, {
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

    const newFeed = removeStatePostById(globalFeed, post._id);
    setGlobalFeed(newFeed);
    pulsePostCardToggle();
    alert("Post was deleted!");
  };

  console.log(post);

  return (
    <>
      <PostWrapper id="post-wrapper">
        <div>{post.name}</div>
        <div>{post.buildSite}</div>
        <div>{post.report}</div>
        {post.imageUrls && (
          <img
            alt="Feed"
            src={post.imageUrls}
            id={post.imageNames}
            style={{ width: "300px", height: "300px" }}
          />
        )}
        <div className="flex justify-between mt-4">
          <Link
            className="edit-link"
            to="/modal/1"
            state={{ previousLocation: location }}
            onClick={() => setFormValues(post)}
          >
            Edit
          </Link>
          <DeleteButton onClick={() => deletePost(post)}>Delete</DeleteButton>
        </div>
      </PostWrapper>
    </>
  );
};

export default Posts;
