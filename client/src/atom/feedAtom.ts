import { atom } from 'recoil';
import { PostState } from '../pages/Feed';

export const feedState = atom({
  key: 'feedState',
  default: [] as PostState[]
});
