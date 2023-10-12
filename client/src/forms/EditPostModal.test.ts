import { EditedPostState, injectEditedPostIntoFeed } from './EditPostModal';

describe('injectEditedPostIntoFeed', () => {
  const globalFeed = [
    { id: '1', buildSite: 'siteA', createdAt: '2023-07-13' },
    { id: '2', buildSite: 'siteB', createdAt: '2023-07-12' },
    { id: '3', buildSite: 'siteA', createdAt: '2023-07-14' },
    { id: '4', buildSite: 'siteC', createdAt: '2023-07-11' },
    { id: '5', buildSite: 'siteA', createdAt: '2023-07-10' }
  ] as EditedPostState[];

  it('should inject the edited post into the global feed', () => {
    const editedPost = {
      id: '3',
      buildSite: 'edited',
      createdAt: '2023-07-14'
    } as EditedPostState;
    const expectedFeed = [
      { id: '1', buildSite: 'siteA', createdAt: '2023-07-13' },
      { id: '2', buildSite: 'siteB', createdAt: '2023-07-12' },
      { id: '3', buildSite: 'edited', createdAt: '2023-07-14' },
      { id: '4', buildSite: 'siteC', createdAt: '2023-07-11' },
      { id: '5', buildSite: 'siteA', createdAt: '2023-07-10' }
    ] as EditedPostState[];

    const result = injectEditedPostIntoFeed(editedPost, globalFeed);

    expect(result).toEqual(expectedFeed);
  });
});
