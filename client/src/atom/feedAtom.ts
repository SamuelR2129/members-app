import { atom } from "recoil";
import { PostState } from "../types";

export const feedState = atom({
  key: "feedState",
  default: [] as PostState[],
});
