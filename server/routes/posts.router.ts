import express, { Request, Response } from "express";
import { PostType } from "../types";
import posts from "../interfaces/post.interface";

export const postsRouter = express.Router();

// get posts

postsRouter.get("/", async (req: Request, res: Response) => {
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

postsRouter.post("/", async (req: Request, res: Response) => {
  try {
    const newPost: PostType = req.body;

    const createPostResult = await posts.create(newPost);

    return res.status(201).send("Successfully created your post");
  } catch (err: any) {
    return res.status(500).send(err.message);
  }
});

// update post

postsRouter.put("/:_id", async (req: Request, res: Response) => {
  const postUpdate: PostType = req.body;
  try {
    await posts.findByIdAndUpdate(req.params._id, postUpdate);

    res.status(201).send("Successfully updated your post");
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});

// delete post

postsRouter.delete("/:_id", async (req: Request, res: Response) => {
  try {
    await posts.findByIdAndDelete({ _id: req.params._id });

    res.sendStatus(204).send("Successfully deleted your post");
  } catch (err: any) {
    res.status(500).send(err.message);
  }
});
