import { getFilesFromS3 } from "../aws/s3";
import {
  PostType,
  PostWithImageUrl,
  PostWithImageName,
  PostFromDB,
} from "../types";

const makePostWithImage = async (
  post: PostFromDB
): Promise<PostWithImageUrl> => {
  try {
    const { _id, name, report, buildSite, imageName, createdAt } =
      post as PostWithImageName;
    const imageUrl = await getFilesFromS3(imageName);

    if (!imageUrl) {
      throw new Error("imageUrl from s3 is undefined/null");
    }

    const newPostWithImage = {
      _id: _id,
      name: name,
      report: report,
      buildSite: buildSite,
      createdAt: createdAt,
      imageName: imageName,
      imageUrl: imageUrl,
    };
    return newPostWithImage;
  } catch (err) {
    throw err;
  }
};

export default makePostWithImage;
