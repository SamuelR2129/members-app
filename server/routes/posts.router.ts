import express, { Request, Response } from "express";
import { PostFromDB, PostType } from "../types";
import posts from "../interfaces/post.interface";
import { deleteFileFromS3, uploadFileS3 } from "../aws/s3";
import multer from "multer";
import { isPostsFromDBValid } from "../utilities/typeGaurds/isPostsFromDBValid";
import { isUpdatedPostValid } from "./postTypeGaurds";
import addImageToPost from "../utilities/addImageToPost";
import mapPosts from "../utilities/mapFeedPosts";
import removeSensitiveData from "../utilities/removeSensitiveData";

const storage = multer.memoryStorage();

const upload = multer({ storage: storage });

const isPostCreateValid = (unknown: unknown): unknown is PostFromDB => {
  const dbPost = unknown as PostFromDB;
  return (
    dbPost !== undefined &&
    dbPost._id !== undefined &&
    dbPost.buildSite !== undefined &&
    dbPost.createdAt !== undefined &&
    dbPost.imageNames !== undefined &&
    dbPost.name !== undefined &&
    dbPost.report !== undefined
  );
};

type PageOptions = {
  page: number;
  limit: number;
};

export const postsRouter = express.Router();

// get posts

postsRouter.get("/feed", async (req: Request, res: Response) => {
  let pageOptions: PageOptions;
  if (
    typeof req.query.page === "string" &&
    typeof req.query.limit === "string"
  ) {
    pageOptions = {
      page: parseInt(req.query.page, 10) || 0,
      limit: parseInt(req.query.limit, 10) || 10,
    };
  } else {
    throw new Error("Missing page or limit in feed query");
  }

  try {
    const postsFromDB = await posts
      .find()
      .sort({ createdAt: -1 })
      .skip(pageOptions.page * pageOptions.limit)
      .limit(pageOptions.limit)
      .exec();

    if (postsFromDB.length === 0) {
      return res.status(204).send([]);
    }

    if (!isPostsFromDBValid(postsFromDB)) {
      throw new Error("Getting posts from DB there is a undefined/null value");
    }

    const mappedPosts = await mapPosts(postsFromDB);

    res.status(200).send(mappedPosts);
  } catch (err: any) {
    console.error(`System error getting feed - ${err}`);
    res.status(500).send(`System error getting feed`);
  }
});

postsRouter.post(
  "/makepost",
  upload.array("images"),
  async (req: Request, res: Response) => {
    try {
      const files = req.files as Express.Multer.File[];
      console.log("START", files);
      const imageNames = await Promise.all(
        files.map(async (file) => {
          return await uploadFileS3(file, file.originalname);
        })
      );

      const { name, hours, costs, report, buildSite }: PostType = req.body;

      const newPost = await posts.create({
        name: name,
        hours: hours,
        costs: costs,
        report: report,
        buildSite: buildSite,
        imageNames: imageNames.length > 0 ? imageNames : undefined,
      });

      if (!isPostCreateValid(newPost)) {
        throw new Error(
          "Mongoose did not return a new post after it was created"
        );
      }

      const trimmedPostData = removeSensitiveData(newPost);

      const postWithImageInfo = await addImageToPost(trimmedPostData);

      console.log("END", postWithImageInfo);

      return res.status(201).send({
        valid: true,
        result: "Post made successfully",
        data: postWithImageInfo,
      });
    } catch (err: any) {
      console.error(`System error making post - ${err}`);
      return res.status(500).send({
        valid: false,
        result: "Post was not successfull, Please try again",
      });
    }
  }
);

// update post

postsRouter.post("/update/:_id", async (req: Request, res: Response) => {
  const { report, buildSite }: PostType = req.body;

  try {
    const oldPost = await posts.findById(req.params._id);

    const updatedPost = {
      _id: oldPost?._id,
      name: oldPost?.name,
      hours: oldPost?.hours,
      costs: oldPost?.costs,
      report: report,
      buildSite: buildSite,
      createdAt: oldPost?.createdAt,
    };

    const updatedPostFromDB = await posts.findByIdAndUpdate(
      updatedPost._id,
      updatedPost,
      { new: true }
    );

    if (!isUpdatedPostValid(updatedPostFromDB)) {
      throw new Error("Unable to find post to update in mongodb");
    }

    res.status(201).send({
      status: true,
      result: "Successfully updated your post",
      data: updatedPostFromDB,
    });
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

// delete post

postsRouter.post("/delete/:_id", async (req: Request, res: Response) => {
  const imageNames = req.body.imageNames as string;

  try {
    if (imageNames.length > 0) {
      deleteFileFromS3(imageNames);
    }

    await posts.findByIdAndDelete({ _id: req.params._id });

    res
      .status(204)
      .send({ status: true, result: "Successfully deleted your post" });
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});
