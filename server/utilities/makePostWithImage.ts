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
    const { _id, name, hours, costs, report, imageName } =
      post as PostWithImageName;
    const imageUrl = await getFilesFromS3(imageName);

    if (!imageUrl) {
      throw new Error("imageUrl from s3 is undefined/null");
    }

    const newPostWithImage = {
      _id: _id,
      name: name,
      hours: hours,
      costs: costs,
      report: report,
      imageName: imageName,
      imageUrl: imageUrl,
    };
    return newPostWithImage;
  } catch (err) {
    throw err;
  }
};

export default makePostWithImage;
