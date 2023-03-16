import express, { Request, Response } from "express";
import { PostType } from "../types";
import posts from "../interfaces/post.interface";
import { uploadFileS3 } from "../s3";
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });

export const postsRouter = express.Router();

// get posts

postsRouter.get("/feed", async (req: Request, res: Response) => {
  try {
    const allPosts: PostType[] = await posts.find();
    res.status(200).send(allPosts);
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

// get post

postsRouter.get("/:_id", async (req: Request, res: Response) => {
  const _id: number = parseInt(req.params._id, 10);

  try {
    const post: PostType | null = await posts.findById(_id);

    if (post) {
      res.status(200).send(post);
    }

    res.status(404).send("item not found");
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

// make post

postsRouter.post(
  "/makepost",
  uploadMiddleware.single("images"),
  async (req: Request, res: Response) => {
    try {
      let newPath = "";
      if (req.file) {
        /*
        const { originalname, path } = req.file;
        const parts = originalname.split(".");
        const ext = parts[parts.length - 1];
        newPath = path + "." + ext;
        fs.renameSync(path, newPath); */

        const result = await uploadFileS3(req.file);
        console.log("s3 result", result);
      }

      const { name, hours, costs, report }: PostType = req.body;

      await posts.create({
        name: name,
        hours: hours,
        costs: costs,
        report: report,
        images: req.file?.path,
      });

      return res
        .status(201)
        .send({ status: true, result: "Post made successfully" });
    } catch (err: any) {
      return res.status(500).send("Post was not successfull, Please try again");
    }
  }
);

// update post

postsRouter.put("/:_id", async (req: Request, res: Response) => {
  const postUpdate: PostType = req.body;
  try {
    await posts.findByIdAndUpdate(req.params._id, postUpdate);

    res
      .status(201)
      .send({ status: true, result: "Successfully updated your post" });
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

// delete post

postsRouter.delete("/:_id", async (req: Request, res: Response) => {
  try {
    await posts.findByIdAndDelete({ _id: req.params._id });

    res
      .sendStatus(204)
      .send({ status: true, result: "Successfully deleted your post" });
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});
