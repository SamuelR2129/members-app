type PostType = {
  post: {
    image: string;
    name: string;
    text: string;
    time: string;
    _id: string;
  };
};

const Posts = ({ post }: PostType) => {
  return (
    <div>
      <div>{post.name}</div>
      <div>{post.text}</div>
      <div>{post.image}</div>
      <div>{post.time}</div>
    </div>
  );
};

export default Posts;
