import { useEffect, useState } from "react";
import Posts from "./Posts";

type FeedType = {
  name: string;
  text: string;
  time: string;
  image: string;
  _id: string;
};

const Feed = (): JSX.Element => {
  const [feed, setFeed] = useState<FeedType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/member/posts/")
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        return response.json();
      })
      .then((feedData) => {
        setFeed(feedData);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err.message);
        setError(true);
      });
  }, []);

  console.log("first render", feed.length);

  return (
    <>
      <h3>What is happening in this space:</h3>
      <div>
        {loading ? (
          <div>Searching for posts...</div>
        ) : (
          feed.map((post) => (
            <div key={post._id}>
              <Posts post={post} />
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default Feed;
