import { utcToZonedTime } from 'date-fns-tz';
import { parseISO, format } from 'date-fns';
import { PostState } from '../pages/Feed';

export const pulsePostCardToggle = () => {
  document.querySelector('.pulse')?.classList.toggle('animate-pulse');
};

export const filterTrimOrderPosts = (globalFeed: PostState[], selectedSite: string) => {
  const filteredPosts = globalFeed.filter((post) =>
    post.buildSite.toLowerCase().includes(selectedSite.toLowerCase())
  );

  const removedDuplicatesFromPosts = filteredPosts.filter(
    (post, index, self) => index === self.findIndex((o) => o.id === post.id)
  );

  const newestPostsFirst = removedDuplicatesFromPosts.sort(
    (postA, postB) => new Date(postB.createdAt).getTime() - new Date(postA.createdAt).getTime()
  );

  return newestPostsFirst;
};

export const restructureDateTime = (dateTime: string) => {
  const australiaTime = utcToZonedTime(parseISO(dateTime), 'Australia/Sydney');
  return format(australiaTime, 'EEE HH:mm dd-MM-yy');
};
