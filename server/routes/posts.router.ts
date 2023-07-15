import express, { Request, Response } from "express";
import { PostFromDB, PostType } from "../types";
import posts from "../interfaces/post.interface";
import { deleteFileFromS3, uploadFileS3 } from "../aws/s3";
import multer from "multer";
import mapPost from "../utilities/mapPost";
import removeWasteDataFromNewPost from "../utilities/removeWasteDataFromNewPost";
import { isPostsFromDBValid } from "../utilities/typeGaurds/isPostsFromDBValid";
import { isUpdatedPostValid } from "./postTypeGaurds";
import { ObjectId } from "mongodb";
const multerStorage = multer.memoryStorage();
const uploadMiddleware = multer({ storage: multerStorage });

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

    const mappedPosts = await mapPost(postsFromDB);

    res.status(200).send(mappedPosts);
  } catch (err: any) {
    console.error(`System error getting feed - ${err}`);
    res.status(500).send(`System error getting feed`);
  }
});

postsRouter.post(
  "/makepost",
  uploadMiddleware.single("images"),
  async (req: Request, res: Response) => {
    try {
      const randomImageName = req.file ? Date() : undefined;
      if (req.file && randomImageName) {
        await uploadFileS3(req.file, randomImageName);
      }

      const { name, hours, costs, report, buildSite }: PostType = req.body;

      const newPost = await posts.create({
        name: name,
        hours: hours,
        costs: costs,
        report: report,
        buildSite: buildSite,
        imageName: randomImageName,
      });

      if (!newPost) {
        throw new Error(
          "Mongoose did not return a new post after it was created"
        );
      }

      const trimmedPostData = removeWasteDataFromNewPost(newPost);

      const mappedPosts = await mapPost([trimmedPostData]);

      if (mappedPosts) {
        return res.status(201).send({
          valid: true,
          result: "Post made successfully",
          data: mappedPosts,
        });
      }

      return res.status(500).send({
        valid: false,
        result: "Post was not successfull, Please try again",
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
  const imageName = req.body.imageName as string;

  try {
    if (imageName.length > 0) {
      deleteFileFromS3(imageName);
    }

    await posts.findByIdAndDelete({ _id: req.params._id });

    res
      .status(204)
      .send({ status: true, result: "Successfully deleted your post" });
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});
