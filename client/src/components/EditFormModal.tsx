import { FormEvent, useEffect, useRef } from "react";
import { EditedPost } from "../types";
import { useRecoilState } from "recoil";
import { feedState, updatePostState } from "../atom/feedAtom";
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

const isEditedPostValid = (unknownData: unknown): unknownData is EditedPost => {
  const data = unknownData as EditedPost;
  return (
    data !== undefined &&
    data.status === 201 &&
    data.data !== undefined &&
    data.data.data._id !== undefined &&
    data.data.data.buildSite !== undefined &&
    data.data.data.createdAt !== undefined &&
    data.data.data.name !== undefined &&
    data.data.data.report !== undefined
  );
};

export const EditFormModal = () => {
  const [globalFeed, setGlobalFeed] = useRecoilState(feedState);
  const [formValues, setFormValues] = useRecoilState(updatePostState);
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = {
      report: formValues.report,
      buildSite: formValues.buildSite,
    };

    const response = await axios.post<unknown>(
      `${process.env.REACT_APP_SERVER_URL}/posts/update/${formValues._id}`,
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
  };

  //stops scrolling of the page behind the modal
  useEffect(() => {
    const observerRefValue = modalRef.current;
    if (observerRefValue) {
      disableBodyScroll(observerRefValue);
    }
    return () => {
      if (observerRefValue) {
        enableBodyScroll(observerRefValue);
      }
    };
  }, []);

  return (
    <ModalWrapper ref={modalRef} onClick={() => navigate("/")}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalCloseButton onClick={() => navigate("/")}>close</ModalCloseButton>
        <ModalForm onSubmit={handleFormSubmit}>
          <ModalLabel>
            <p>Choose a site:</p>
            <ModalSelect
              name="buildSite"
              onChange={(e) =>
                setFormValues({ ...formValues, buildSite: e.target.value })
              }
              value={formValues.buildSite || ""}
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
              onChange={(e) =>
                setFormValues({ ...formValues, report: e.target.value })
              }
              value={formValues.report || ""}
              rows={5}
              cols={60}
              required
            />
          </ModalLabel>
          <ModalSubmitButton type="submit">Submit</ModalSubmitButton>
        </ModalForm>
      </ModalContent>
    </ModalWrapper>
  );
};
