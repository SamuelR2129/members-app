type PostType = {
  post: {
    _id: string;
    name: string;
    report: string;
    imageUrl?: string;
    imageName?: string;
  };
};

const Posts = ({ post }: PostType) => {
  return (
    <div>
      <div>{post.name}</div>
      <div>{post.report}</div>
      {post.imageUrl && (
        <img alt="Feed" src={post.imageUrl} id={post.imageName} />
      )}
    </div>
  );
};

export default Posts;
