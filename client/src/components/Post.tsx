import { useRecoilState } from 'recoil';
import { feedState } from '../atom/feedAtom';
import { pulsePostCardToggle, restructureDateTime } from './utils';
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
    name: string;
    report: string;
    buildSite: string;
    createdAt: string;
    imageNames?: string[];
  };
};

export type EditFormValues = {
  id: string;
  report: string;
  buildSite: string;
};

const removeStatePostById = (feed: PostState[], _idToRemove: string): PostState[] => {
  const newArray = feed.filter((post) => post.id !== _idToRemove);
  return newArray;
};

const Post = ({ post }: PostType) => {
  const [globalFeed, setGlobalFeed] = useRecoilState(feedState);
  const [modal, setModal] = useState(false);

  const timeAndDateCreated = restructureDateTime(post.createdAt);

  const toggle = () => setModal(!modal);

  const deletePost = async (post: PostState) => {
    pulsePostCardToggle();

    const response = await axios.post(`/posts/delete/${post.id}`, post);

    if (!response) {
      pulsePostCardToggle();

      alert('There was an issue removing the post, try again!');

      throw new Error(`This is an HTTP error deleting your post: The status is ${response}`);
    }

    const newFeed = removeStatePostById(globalFeed, post.id);
    setGlobalFeed(newFeed);
    pulsePostCardToggle();
    alert('Post was deleted!');
  };

  return (
    <PostWrapper className="pulse">
      <PostName>{post.name}</PostName>

      <PostBuildSite>{post.buildSite}</PostBuildSite>
      <PostTimeCreated>{timeAndDateCreated}</PostTimeCreated>
      <PostReport>{post.report}</PostReport>
      {post.imageNames && <ImageCarousel imageUrlArray={post.imageNames} />}

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
