import { atom } from "recoil";
import { PostState } from "../types";
import { EditFormValues } from "../components/Posts";

export const feedState = atom({
  key: "feedState",
  default: [] as PostState[],
});

export const updatePostState = atom({
  key: "updatePostState",
  default: { _id: "", report: "", buildSite: "" } as EditFormValues,
});
