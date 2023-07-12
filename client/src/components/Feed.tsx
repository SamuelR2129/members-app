import { useEffect, useState } from "react";
import Posts from "./Posts";
import { feedState } from "../atom/feedAtom";
import { useRecoilState } from "recoil";
import { PostState } from "../types/posts";
import tw from "tailwind-styled-components";

const SiteFilter = tw.div`
  flex pt-4 pb-4
`;

const FilterHeading = tw.h4`
  my-0 mr-10
`;

const Feed = (): JSX.Element => {
  const [feed, setFeed] = useRecoilState<PostState[]>(feedState);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [site, setSite] = useState<string>("");
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [pagination, setPagination] = useState<number>(0);
  const [noMorePosts, setNoMorePosts] = useState<boolean>(false);
  const [selectedOptionPosts, setSelectedOptionPosts] = useState<PostState[]>(
    []
  );

  const fetchFeed = async () => {
    try {
      const response = await fetch(`/posts/feed?page=${pagination}&limit=10`);

      if (!response.ok) {
        setError(true);
        throw new Error(
          `This is an HTTP error loading the feed: The status is ${response.status}`
        );
      }

      if (response.status === 204) {
        setNoMorePosts(true);
        setLoading(false);
        return;
      }

      const feedData: PostState[] = await response.json();

      setFeed(feedData);
      setSelectedOptionPosts(feedData);
      setPagination((prevPagination) => prevPagination + 1);

      setLoading(false);
    } catch (error) {
      setError(true);
      console.error("An error occurred while fetching the feed:", error);
    }
  };

  const handleSiteSelect = (selectedSite: string) => {
    const filteredPosts = feed.filter((post) =>
      post.buildSite.toLowerCase().includes(selectedSite.toLowerCase())
    );

    setSelectedOptionPosts(filteredPosts);
  };

  const fetchMorePosts = async () => {
    try {
      const response = await fetch(`/posts/feed?page=${pagination}&limit=2`);

      if (!response.ok) {
        setError(true);
        throw new Error(
          `This is an HTTP error loading more posts: The status is ${response.status}`
        );
      }

      if (response.status === 204) {
        setNoMorePosts(true);
        setIsFetching(false);
        return;
      }

      const morePosts: PostState[] = await response.json();

      setFeed((prevFeed) => [...prevFeed, ...morePosts]);
      setSelectedOptionPosts((prevPosts) => [...prevPosts, ...morePosts]);
      setPagination((prevPagination) => prevPagination + 1);

      setIsFetching(false);
    } catch (error) {
      setError(true);
      console.error("An error occurred while fetching more posts:", error);
    }
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

  const handleSiteChange = (selectedSite: string) => {
    setSite(selectedSite);
    if (selectedSite === "") {
      setSelectedOptionPosts(feed);
    } else {
      handleSiteSelect(selectedSite);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    fetchFeed();
  }, []);

  useEffect(() => {
    if (!isFetching) return;

    fetchMorePosts();
  }, [isFetching, pagination, setFeed]);

  return (
    <>
      <SiteFilter>
        <FilterHeading>Filter build sites:</FilterHeading>
        <select value={site} onChange={(e) => handleSiteChange(e.target.value)}>
          <option value="">All Sites</option>
          <option value="32 James St">32 James St</option>
          <option value="NIB">NIB</option>
          <option value="7 Rose St">7 Rose St</option>
        </select>
      </SiteFilter>
      <div>
        {!error ? (
          <>
            {loading ? (
              <div>Searching for posts...</div>
            ) : selectedOptionPosts.length > 0 ? (
              selectedOptionPosts.map((post) => (
                <Posts key={post._id} post={post} />
              ))
            ) : (
              <div>No posts to view</div>
            )}
            <div>{noMorePosts && <div>No more posts to load</div>}</div>
          </>
        ) : (
          <div>There has been an error loading the feed, please refresh</div>
        )}
      </div>
    </>
  );
};

export default Feed;
