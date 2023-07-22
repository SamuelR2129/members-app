import { FormEvent, useEffect, useRef, useState } from "react";
import { EditedPost, PostState } from "../types";
import { useRecoilState } from "recoil";
import { feedState } from "../atom/feedAtom";
import axios from "axios";
import { injectEditedPostIntoFeed } from "./utils";
import { useNavigate } from "react-router-dom";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import {
  ModalWrapper,
  ModalContent,
  ModalCloseButton,
  ModalForm,
  ModalLabel,
  ModalSelect,
  ModalTextarea,
  ModalSubmitButton,
} from "../styles/editFormModal";
import ReactDOM from "react-dom";

const isEditedPostValid = (unknownData: unknown): unknownData is EditedPost => {
  const data = unknownData as EditedPost;
  return (
    data !== undefined &&
    data.data !== undefined &&
    data.data.data._id !== undefined &&
    data.data.data.buildSite !== undefined &&
    data.data.data.createdAt !== undefined &&
    data.data.data.name !== undefined &&
    data.data.data.report !== undefined &&
    data.data.data.imageNames !== undefined &&
    data.data.data.imageUrls !== undefined
  );
};

type SetEditedValues = {
  report: string;
  buildSite: string;
};

type EditPostModal = {
  show: boolean;
  post: PostState;
  close: () => void;
};

export const EditPostModal = ({ show, post, close }: EditPostModal) => {
  const [globalFeed, setGlobalFeed] = useRecoilState(feedState);
  const [editedValues, setEditedValues] = useState<SetEditedValues>(post);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editedValues || !editedValues.buildSite || !editedValues.report) {
      console.error(
        `Missing editedValues - buildSite: ${editedValues?.buildSite} report: ${editedValues?.report}`
      );
      alert(`There was a problem updating your post`);
      return;
    }

    const data = {
      report: editedValues.report,
      buildSite: editedValues.buildSite,
    };

    const response = await axios.post<unknown>(
      `${process.env.REACT_APP_SERVER_URL}/posts/update/${post._id}`,
      data
    );

    if (!isEditedPostValid(response)) {
      console.error(response);
      alert(`There was a problem updating your post`);
      return;
    }

    const feedWithEditedPost = injectEditedPostIntoFeed(
      response.data.data,
      globalFeed
    );

    setGlobalFeed(feedWithEditedPost);
    alert("Post was edited!");
    close();
  };

  return ReactDOM.createPortal(
    <>
      {show ? (
        <ModalWrapper onClick={() => close()}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalCloseButton onClick={() => close()}>close</ModalCloseButton>
            <ModalForm onSubmit={handleFormSubmit}>
              <ModalLabel>
                <p>Choose a site:</p>
                <ModalSelect
                  name="buildSite"
                  onChange={(e) =>
                    setEditedValues({
                      ...editedValues,
                      buildSite: e.target.value,
                    })
                  }
                  value={editedValues.buildSite || ""}
                  required
                >
                  <option value="">--Please choose an option--</option>
                  <option value="7 Rose Street">7 Rose Street</option>
                  <option value="NIB">NIB</option>
                  <option value="11 Beach Street">11 Beach Street</option>
                </ModalSelect>
              </ModalLabel>
              <ModalLabel>
                <p>Report:</p>
                <ModalTextarea
                  name="report"
                  onChange={(e) => {
                    console.log(e.target);
                    setEditedValues({
                      ...editedValues,
                      report: e.target.value,
                    });
                  }}
                  value={editedValues.report || ""}
                  rows={5}
                  cols={60}
                  required
                />
              </ModalLabel>
              <ModalSubmitButton type="submit">Submit</ModalSubmitButton>
            </ModalForm>
          </ModalContent>
        </ModalWrapper>
      ) : null}
    </>,
    document.getElementById("root")!
  );
};
