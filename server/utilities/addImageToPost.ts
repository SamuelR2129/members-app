import { getFilesFromS3 } from "../aws/s3";
import { PostFromDB, PostWithImageUrl } from "../types";

const addImageToPost = async (
  trimmedPostData: PostFromDB
): Promise<PostWithImageUrl> => {
  const { _id, name, report, buildSite, imageNames, createdAt } =
    trimmedPostData;

  const imageUrlArray =
    typeof imageNames === "undefined"
      ? []
      : await Promise.all(
          imageNames.map(async (imageNames) => {
            return await getFilesFromS3(imageNames);
          })
        );

  return {
    _id: _id,
    name: name,
    report: report,
    buildSite: buildSite,
    createdAt: createdAt,
    imageNames: imageNames || [],
    imageUrls: imageUrlArray,
  };
};

export default addImageToPost;
