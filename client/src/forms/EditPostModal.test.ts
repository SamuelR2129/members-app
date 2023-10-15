import { EditedPostState, injectEditedPostIntoFeed } from './EditPostModal';

describe('injectEditedPostIntoFeed', () => {
  const globalFeed = [
    { postId: '1', buildSite: 'siteA', createdAt: '2023-07-13' },
    { postId: '2', buildSite: 'siteB', createdAt: '2023-07-12' },
    { postId: '3', buildSite: 'siteA', createdAt: '2023-07-14' },
    { postId: '4', buildSite: 'siteC', createdAt: '2023-07-11' },
    { postId: '5', buildSite: 'siteA', createdAt: '2023-07-10' }
  ] as EditedPostState[];

  it('should inject the edited post into the global feed', () => {
    const editedPost = {
      postId: '3',
      buildSite: 'edited',
      createdAt: '2023-07-14'
    } as EditedPostState;
    const expectedFeed = [
      { postId: '1', buildSite: 'siteA', createdAt: '2023-07-13' },
      { postId: '2', buildSite: 'siteB', createdAt: '2023-07-12' },
      { postId: '3', buildSite: 'edited', createdAt: '2023-07-14' },
      { postId: '4', buildSite: 'siteC', createdAt: '2023-07-11' },
      { postId: '5', buildSite: 'siteA', createdAt: '2023-07-10' }
    ] as EditedPostState[];

    const result = injectEditedPostIntoFeed(editedPost, globalFeed);

    expect(result).toEqual(expectedFeed);
  });
});
