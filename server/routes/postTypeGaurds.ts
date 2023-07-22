import { PostFromDB, PostType } from "../types";

export const isUpdatedPostValid = (
  unknownData: unknown
): unknownData is PostFromDB => {
  const data = unknownData as PostFromDB;
  return (
    data !== undefined &&
    data._id !== undefined &&
    data.buildSite !== undefined &&
    data.name !== undefined &&
    data.report !== undefined
  );
};
