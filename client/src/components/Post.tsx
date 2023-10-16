import { useRecoilState } from 'recoil';
import { feedState } from '../atom/feedAtom';
import { restructureDateTime } from './utils';
import axios from 'axios';
import {
  PostName,
  PostBuildSite,
  PostReport,
  EditButton,
  PostWrapper,
  DeleteButton,
  PostTimeCreated
} from '../styles/post';
import { useState } from 'react';
import { EditPostModal } from '../forms/EditPostModal';
import ImageCarousel from './ImageCarousel';
import { PostState } from '../pages/Feed';

type PostType = {
  post: {
    id: string;
    postId: string;
    name: string;
    report: string;
    buildSite: string;
    createdAt: string;
    imageNames?: string[];
    imageUrls?: string[];
  };
};

export type EditFormValues = {
  id: string;
  postId: string;
  report: string;
  buildSite: string;
};

const removeStatePostById = (feed: PostState[], _idToRemove: string): PostState[] => {
  const newArray = feed.filter((post) => post.postId !== _idToRemove);
  return newArray;
};

const Post = ({ post }: PostType) => {
  const [globalFeed, setGlobalFeed] = useRecoilState(feedState);
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);

  console.log(post.imageUrls);

  const timeAndDateCreated = restructureDateTime(post.createdAt);

  const toggle = () => setModal(!modal);

  const deletePost = async (post: PostState) => {
    try {
      setLoading(true);

      const response = await axios.delete(
        `${process.env.REACT_APP_API_GATEWAY_PROD}deletePost/${post.postId}?createdAt=${post.createdAt}`
      );

      if (!response) {
        setLoading(false);

        alert('There was an issue removing the post, try again!');

        throw new Error(`This is an HTTP error deleting your post: The status is ${response}`);
      }

      const newFeed = removeStatePostById(globalFeed, post.postId);
      setGlobalFeed(newFeed);
      setLoading(false);
      alert('Post was deleted!');
    } catch (err) {
      console.error(err);
      setLoading(false);
      alert('There was an issue removing the post, try again!');
    }
  };

  return (
    <PostWrapper className={`${loading ? 'animate-pulse' : ''}`}>
      <PostName>{post.name}</PostName>

      <PostBuildSite>{post.buildSite}</PostBuildSite>
      <PostTimeCreated>{timeAndDateCreated}</PostTimeCreated>
      <PostReport>{post.report}</PostReport>
      {post.imageUrls && <ImageCarousel imageUrlArray={post.imageUrls} />}

      <div className="flex justify-between w-full mt-4 mb-7">
        <EditButton onClick={() => toggle()}>Edit</EditButton>
        <EditPostModal show={modal} post={post} close={toggle} />
        <DeleteButton onClick={() => deletePost(post)}>Delete</DeleteButton>
      </div>
      <div className="h-0.5 bg-slate-200 w-full"></div>
    </PostWrapper>
  );
};

export default Post;
