import { PostType } from "../types";

export const isUpdatedPostValid = (
  unknownData: unknown
): unknownData is PostType => {
  const data = unknownData as PostType;
  return (
    data !== undefined &&
    data._id !== undefined &&
    data.buildSite !== undefined &&
    data.name !== undefined &&
    data.report !== undefined
  );
};
