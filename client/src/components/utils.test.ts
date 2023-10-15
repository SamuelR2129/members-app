import { PostState } from '../pages/Feed';
import { filterTrimOrderPosts } from './utils';

describe('filterTrimOrderPosts', () => {
  const globalFeed = [
    { postId: '1', buildSite: 'siteA', createdAt: '2023-07-13' },
    { postId: '2', buildSite: 'siteB', createdAt: '2023-07-12' },
    { postId: '3', buildSite: 'siteA', createdAt: '2023-07-14' },
    { postId: '4', buildSite: 'siteC', createdAt: '2023-07-11' },
    { postId: '5', buildSite: 'siteA', createdAt: '2023-07-10' },
    { postId: '1', buildSite: 'siteA', createdAt: '2023-07-13' }
  ] as PostState[];

  it('should filter, remove duplicates, and order posts correctly', () => {
    const selectedSite = 'siteA';
    const expectedPosts = [
      { postId: '3', buildSite: 'siteA', createdAt: '2023-07-14' },
      { postId: '1', buildSite: 'siteA', createdAt: '2023-07-13' },
      { postId: '5', buildSite: 'siteA', createdAt: '2023-07-10' }
    ] as PostState[];

    const result = filterTrimOrderPosts(globalFeed, selectedSite);

    expect(result).toEqual(expectedPosts);
  });

  it('should return an empty array if no matching posts found', () => {
    const selectedSite = 'siteD';
    const result = filterTrimOrderPosts(globalFeed, selectedSite);

    expect(result).toEqual([]);
  });

  it('should handle empty globalFeed array', () => {
    const selectedSite = 'siteA';
    const result = filterTrimOrderPosts([], selectedSite);

    expect(result).toEqual([]);
  });

  it('should handle case-insensitive matching', () => {
    const selectedSite = 'SiteA';
    const expectedPosts = [
      { postId: '3', buildSite: 'siteA', createdAt: '2023-07-14' },
      { postId: '1', buildSite: 'siteA', createdAt: '2023-07-13' },
      { postId: '5', buildSite: 'siteA', createdAt: '2023-07-10' }
    ] as PostState[];

    const result = filterTrimOrderPosts(globalFeed, selectedSite);

    expect(result).toEqual(expectedPosts);
  });

  it('should handle multiple posts with the same createdAt value', () => {
    const selectedSite = 'siteA';
    const globalFeedWithDuplicates = [
      { postId: '1', buildSite: 'siteA', createdAt: '2023-07-13' },
      { postId: '2', buildSite: 'siteB', createdAt: '2023-07-13' },
      { postId: '3', buildSite: 'siteA', createdAt: '2023-07-13' },
      { postId: '4', buildSite: 'siteC', createdAt: '2023-07-13' },
      { postId: '5', buildSite: 'siteA', createdAt: '2023-07-13' }
    ] as PostState[];
    const expectedPosts = [
      { postId: '1', buildSite: 'siteA', createdAt: '2023-07-13' },
      { postId: '3', buildSite: 'siteA', createdAt: '2023-07-13' },
      { postId: '5', buildSite: 'siteA', createdAt: '2023-07-13' }
    ] as PostState[];

    const result = filterTrimOrderPosts(globalFeedWithDuplicates, selectedSite);

    expect(result).toEqual(expectedPosts);
  });
});
