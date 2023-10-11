import { PostState } from '../pages/Feed';
import { filterTrimOrderPosts, injectEditedPostIntoFeed } from './utils';

describe('filterTrimOrderPosts', () => {
  const globalFeed = [
    { id: '1', buildSite: 'siteA', createdAt: '2023-07-13' },
    { id: '2', buildSite: 'siteB', createdAt: '2023-07-12' },
    { id: '3', buildSite: 'siteA', createdAt: '2023-07-14' },
    { id: '4', buildSite: 'siteC', createdAt: '2023-07-11' },
    { id: '5', buildSite: 'siteA', createdAt: '2023-07-10' },
    { id: '1', buildSite: 'siteA', createdAt: '2023-07-13' }
  ] as PostState[];

  it('should filter, remove duplicates, and order posts correctly', () => {
    const selectedSite = 'siteA';
    const expectedPosts = [
      { id: '3', buildSite: 'siteA', createdAt: '2023-07-14' },
      { id: '1', buildSite: 'siteA', createdAt: '2023-07-13' },
      { id: '5', buildSite: 'siteA', createdAt: '2023-07-10' }
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
      { id: '3', buildSite: 'siteA', createdAt: '2023-07-14' },
      { id: '1', buildSite: 'siteA', createdAt: '2023-07-13' },
      { id: '5', buildSite: 'siteA', createdAt: '2023-07-10' }
    ] as PostState[];

    const result = filterTrimOrderPosts(globalFeed, selectedSite);

    expect(result).toEqual(expectedPosts);
  });

  it('should handle multiple posts with the same createdAt value', () => {
    const selectedSite = 'siteA';
    const globalFeedWithDuplicates = [
      { id: '1', buildSite: 'siteA', createdAt: '2023-07-13' },
      { id: '2', buildSite: 'siteB', createdAt: '2023-07-13' },
      { id: '3', buildSite: 'siteA', createdAt: '2023-07-13' },
      { id: '4', buildSite: 'siteC', createdAt: '2023-07-13' },
      { id: '5', buildSite: 'siteA', createdAt: '2023-07-13' }
    ] as PostState[];
    const expectedPosts = [
      { id: '1', buildSite: 'siteA', createdAt: '2023-07-13' },
      { id: '3', buildSite: 'siteA', createdAt: '2023-07-13' },
      { id: '5', buildSite: 'siteA', createdAt: '2023-07-13' }
    ] as PostState[];

    const result = filterTrimOrderPosts(globalFeedWithDuplicates, selectedSite);

    expect(result).toEqual(expectedPosts);
  });
});

describe('injectEditedPostIntoFeed', () => {
  const globalFeed = [
    { id: '1', buildSite: 'siteA', createdAt: '2023-07-13' },
    { id: '2', buildSite: 'siteB', createdAt: '2023-07-12' },
    { id: '3', buildSite: 'siteA', createdAt: '2023-07-14' },
    { id: '4', buildSite: 'siteC', createdAt: '2023-07-11' },
    { id: '5', buildSite: 'siteA', createdAt: '2023-07-10' }
  ] as PostState[];

  it('should inject the edited post into the global feed', () => {
    const editedPost = {
      id: '3',
      buildSite: 'edited',
      createdAt: '2023-07-14'
    } as PostState;
    const expectedFeed = [
      { id: '1', buildSite: 'siteA', createdAt: '2023-07-13' },
      { id: '2', buildSite: 'siteB', createdAt: '2023-07-12' },
      { id: '3', buildSite: 'edited', createdAt: '2023-07-14' },
      { id: '4', buildSite: 'siteC', createdAt: '2023-07-11' },
      { id: '5', buildSite: 'siteA', createdAt: '2023-07-10' }
    ] as PostState[];

    const result = injectEditedPostIntoFeed(editedPost, globalFeed);

    expect(result).toEqual(expectedFeed);
  });
});
