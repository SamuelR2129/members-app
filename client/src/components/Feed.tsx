import { ChangeEvent, useEffect, useState } from "react";
import Posts from "./Posts";
import { feedState } from "../atom/feedAtom";
import { useRecoilState } from "recoil";

const Feed = (): JSX.Element => {
  const [feed, setFeed] = useRecoilState(feedState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [site, setSite] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [pagination, setPagination] = useState(0);
  const [noMorePosts, setNoMorePosts] = useState(false);

  console.log(feed);

  const handleSiteSelect = (event: ChangeEvent<HTMLSelectElement>) => {
    setSite(event?.target.value);
  };

  const filteredSite = feed.filter((post) => {
    return post.buildSite.toLowerCase().includes(site.toLowerCase());
  });

  const fetchFeed = async () => {
    const response = await fetch(
      `/api/member/posts/feed?page=${pagination}&limit=2`
    );

    if (!response.ok) {
      setError(true);
      throw new Error(
        `This is an HTTP error loading the feed: The status is ${response.status}`
      );
    }

    if (response.status === 204) {
      setNoMorePosts(true);
      setLoading(false);
    }

    const feedData = await response.json();

    if (feed.length === 0) {
      setFeed(feedData);
    } else {
      setFeed([...feed, ...feedData]);
    }

    setLoading(false);
  };

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
      document.documentElement.offsetHeight
    ) {
      return;
    }
    setIsFetching(true);
  };

  const fetchMoreListItems = () => {
    fetchFeed();
    setPagination(pagination + 1);
    setIsFetching(false);
  };

  useEffect(() => {
    if (!isFetching) return;
    fetchMoreListItems();
  }, [isFetching]);

  useEffect(() => {
    fetchFeed();
    setPagination(pagination + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <h3>What is happening on site:</h3>
      <div>
        <h4>Filter sites:</h4>
        <select value={site} onChange={handleSiteSelect}>
          <option value="">All Sites</option>
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
            ) : filteredSite.length > 0 ? (
              filteredSite.map((post) => <Posts key={post._id} post={post} />)
            ) : (
              <div>No posts to view</div>
            )}
            <div>{noMorePosts && <div>No more posts to load </div>}</div>
          </>
        ) : (
          <div>There has been an error loading the feed, please refresh</div>
        )}
      </div>
    </>
  );
};

export default Feed;
