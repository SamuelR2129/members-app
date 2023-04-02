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

const Posts = ({ post }: PostType) => {
  return (
    <div>
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
    </div>
  );
};

export default Posts;
