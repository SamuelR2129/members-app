import { useEffect, useState } from "react";
import Post from "./Post";
import { feedState } from "../atom/feedAtom";
import { useRecoilState } from "recoil";
import { PostState } from "../types";
import { filterTrimOrderPosts } from "./utils";
import { FilterHeading, SiteFilter } from "../styles/feed";
import axios, { AxiosResponse } from "axios";

const isFetchingFeedResponseValid = (
  unknownData: unknown
): unknownData is AxiosResponse<PostState[]> => {
  const data = unknownData as AxiosResponse<PostState[]>;
  return data !== undefined && data.status === 200 && Array.isArray(data.data);
};

const Feed = (): JSX.Element => {
  const [globalFeed, setGlobalFeed] = useRecoilState<PostState[]>(feedState);
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
    const response = await axios(`/posts/feed?page=${pagination}&limit=5`);

    if (!isFetchingFeedResponseValid(response) && response.status !== 204) {
      console.error("An error occurred while fetching the feed:", response);
      setError(true);
    }

    if (response.status === 204) {
      setNoMorePosts(true);
      setIsFetching(false);
      setLoading(false);
      return;
    }

    setGlobalFeed((prevFeed) => [...prevFeed, ...response.data]);
    setPagination((prevPagination) => prevPagination + 1);
    setIsFetching(false);
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

  const filterAndSetPosts = (selectedSite: string) => {
    const filteredPosts = filterTrimOrderPosts(globalFeed, selectedSite);
    setSelectedOptionPosts(filteredPosts);
  };

  const checkForSiteOptions = (selectedSite: string) => {
    setSite(selectedSite);
    if (selectedSite === "") {
      setSelectedOptionPosts(globalFeed);
    } else {
      filterAndSetPosts(selectedSite);
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
    filterAndSetPosts(site);
  }, [globalFeed]);

  useEffect(() => {
    if (!isFetching) return;

    fetchFeed();
  }, [isFetching]);

  return (
    <>
      <SiteFilter>
        <FilterHeading>Filter build sites:</FilterHeading>
        <select
          value={site}
          onChange={(e) => checkForSiteOptions(e.target.value)}
        >
          <option value="">All Sites</option>
          <option value="11 Beach Street">11 Beach Street</option>
          <option value="NIB">NIB</option>
          <option value="7 Rose St">7 Rose St</option>
        </select>
      </SiteFilter>
      <div>
        {!error ? (
          <>
            {selectedOptionPosts.map((post) => (
              <Post key={post._id} post={post} />
            ))}
            {noMorePosts && <div>No more posts to load</div>}
            {loading && <div>Searching for posts...</div>}
          </>
        ) : (
          <div>There has been an error loading the feed, please refresh</div>
        )}
      </div>
    </>
  );
};

export default Feed;
