import { useRecoilState } from "recoil";
import { feedState } from "../atom/feedAtom";
import { PostState } from "../types";
import { pulsePostCardToggle } from "./utils";
import axios from "axios";
import {
  PostName,
  PostBuildSite,
  PostReport,
  ImageWrapper,
  PostImage,
  StyledLink,
  PostWrapper,
  DeleteButton,
} from "../styles/post";
import { useState } from "react";
import { EditPostModal } from "./EditPostModal";

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

const Post = ({ post }: PostType) => {
  const [globalFeed, setGlobalFeed] = useRecoilState(feedState);
  const [modal, setModal] = useState(false);

  const toggle = () => setModal(!modal);

  const deletePost = async (post: PostState) => {
    pulsePostCardToggle();

    const response = await axios.post(`/posts/delete/${post._id}`, post);

    if (!response) {
      pulsePostCardToggle();

      alert("There was an issue removing the post, try again!");

      throw new Error(
        `This is an HTTP error deleting your post: The status is ${response}`
      );
    }

    const newFeed = removeStatePostById(globalFeed, post._id);
    setGlobalFeed(newFeed);
    pulsePostCardToggle();
    alert("Post was deleted!");
  };

  return (
    <PostWrapper id="post-wrapper">
      <PostName>{post.name}</PostName>
      <PostBuildSite>{post.buildSite}</PostBuildSite>
      <PostReport>{post.report}</PostReport>
      <ImageWrapper>
        {post.imageUrls &&
          post.imageUrls.map((url, index) => (
            <PostImage key={index} alt="Feed" src={url} />
          ))}
      </ImageWrapper>

      <div className="flex justify-between w-full mt-4 mb-10">
        <StyledLink onClick={() => toggle()}>Edit</StyledLink>
        <EditPostModal show={modal} post={post} close={toggle} />
        <DeleteButton onClick={() => deletePost(post)}>Delete</DeleteButton>
      </div>
      <div className="h-0.5 bg-slate-200 w-full"></div>
    </PostWrapper>
  );
};

export default Post;
