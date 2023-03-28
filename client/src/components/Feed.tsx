import { useEffect, useState } from "react";
import Posts from "./Posts";
import { feedState } from "../atom/feedAtom";
import { useRecoilState } from "recoil";

const Feed = (): JSX.Element => {
  const [feed, setFeed] = useRecoilState(feedState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchFeed = async () => {
    const response = await fetch("/api/member/posts/feed");
    if (!response.ok) {
      setError(true);
      throw new Error(
        `This is an HTTP error loading the feed: The status is ${response.status}`
      );
    }
    const feedData = await response.json();
    setFeed(feedData);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h3>What is happening on site:</h3>
      <div>
        <h4>Filter sites:</h4>
        <select value={""}>
          <option value="All Sites">All Sites</option>
          <option value="32 James St">32 James St</option>
          <option value="Nib">Nib</option>
          <option value="7 Rose St">7 Rose St</option>
        </select>
      </div>
      <div>
        {!error ? (
          <>
            {loading ? (
              <div>Searching for posts...</div>
            ) : (
              feed.map((post) => (
                <div key={post._id}>
                  <Posts post={post} />
                </div>
              ))
            )}
          </>
        ) : (
          <div>There has been an error loading the feed, please refresh</div>
        )}
      </div>
    </>
  );
};

export default Feed;
