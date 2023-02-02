type PostType = {
  post: {
    image?: string;
    name: string;
    report: string;
    _id: string;
  };
};

const Posts = ({ post }: PostType) => {
  return (
    <div>
      <div>{post.name}</div>
      <div>{post.report}</div>
    </div>
  );
};

export default Posts;
