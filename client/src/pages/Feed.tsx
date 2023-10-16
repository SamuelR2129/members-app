import { useEffect, useState } from 'react';
import Post from '../components/Post';
import { feedState } from '../atom/feedAtom';
import { useRecoilState } from 'recoil';
import { filterTrimOrderPosts } from '../components/utils';
import { FilterHeading, FilterSelect, SiteFilter } from '../styles/feed';
import axios from 'axios';
import { z } from 'zod';

const PostStateSchema = z.object({
  id: z.string(),
  postId: z.string(),
  name: z.string(),
  report: z.string(),
  createdAt: z.string(),
  buildSite: z.string(),
  imageNames: z.string().array().optional(),
  imageUrls: z.string().array().optional()
});

const FeedSchema = z.object({
  LastEvaluatedKey: z.object({ id: z.string(), createdAt: z.string() }).optional(),
  posts: PostStateSchema.array()
});

const FeedResponseSchema = z.object({ data: FeedSchema });

export type PostState = z.infer<typeof PostStateSchema>;
export type Feed = z.infer<typeof FeedSchema>;

const isFetchingFeedResponseValid = (unknownData: unknown): unknownData is PostState => {
  const result = FeedResponseSchema.safeParse(unknownData);
  if (result.success) {
    return true;
  }
  return false;
};

const Feed = (): JSX.Element => {
  const [globalFeed, setGlobalFeed] = useRecoilState<PostState[]>(feedState);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [site, setSite] = useState<string>('');
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [noMorePosts, setNoMorePosts] = useState<boolean>(false);
  const [selectedOptionPosts, setSelectedOptionPosts] = useState<PostState[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [lastEvaluatedKey, setLastEvaluatedKey] = useState<string | undefined>();

  const fetchFeed = async () => {
    const getUrl =
      `${process.env.REACT_APP_API_GATEWAY_PROD}getPosts?limit=5` +
      (lastEvaluatedKey ? `&LastEvaluatedKey=${lastEvaluatedKey}` : '');

    const response = await axios<Feed>(getUrl);

    if (!response.data.LastEvaluatedKey?.createdAt) {
      setNoMorePosts(true);
      setIsFetching(false);
      setLoading(false);
      if (!response.data.posts) return;
    }

    if (!isFetchingFeedResponseValid(response)) {
      console.error('An error occurred while fetching the feed:', response);
      setError(true);
    }

    setLastEvaluatedKey(response.data.LastEvaluatedKey?.createdAt);
    setGlobalFeed((prevFeed) => [...prevFeed, ...response.data.posts]);
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
    if (selectedSite === '') {
      setSelectedOptionPosts(globalFeed);
    } else {
      filterAndSetPosts(selectedSite);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
        <FilterSelect value={site} onChange={(e) => checkForSiteOptions(e.target.value)}>
          <option value="">All Sites</option>
          <option value="11 Beach Street">11 Beach Street</option>
          <option value="NIB">NIB</option>
          <option value="7 Rose St">7 Rose St</option>
        </FilterSelect>
      </SiteFilter>
      <div>
        {!error ? (
          <>
            {selectedOptionPosts.map((post) => (
              <Post key={post.postId} post={post} />
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
