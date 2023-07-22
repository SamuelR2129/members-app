import { atom } from "recoil";
import { PostState } from "../types";
import { EditFormValues } from "../components/Post";

export const feedState = atom({
  key: "feedState",
  default: [] as PostState[],
});
