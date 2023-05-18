import { atom } from "recoil";
import { PostState } from "../types/posts";

export const feedState = atom({
  key: "feedState",
  default: [] as PostState[],
});
