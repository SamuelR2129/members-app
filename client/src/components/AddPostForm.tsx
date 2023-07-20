import { ChangeEvent, FormEvent, useReducer, useState } from "react";
import { useRecoilState } from "recoil";
import { feedState } from "../atom/feedAtom";
import { CSSTransition } from "react-transition-group";
import { createPortal } from "react-dom";
import { PostState } from "../types";
import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeaderFooter,
  ModalInput,
  ModalLabel,
  ModalSelect,
  ModalSubmitButton,
  ModalTextarea,
  ModalWrapper,
} from "../styles/addPostFormModal";
import axios from "axios";

type AddPostResponseData = {
  status: number;
  result: string;
  data: PostState;
};

type FormProps = {
  show: boolean;
  onClose: () => void;
};

type AddPostFormData = {
  name: string;
  hours: number;
  costs: number;
  report: string;
  buildSite: string;
  images: File[] | File;
};

const addPostResponseIsValid = (
  unknownData: unknown
): unknownData is { data: { data: PostState } } => {
  const response = unknownData as { data: { data: PostState } };
  return (
    response !== undefined &&
    response.data !== undefined &&
    response.data.data !== undefined &&
    response.data.data._id !== undefined &&
    response.data.data.buildSite !== undefined &&
    response.data.data.createdAt !== undefined &&
    response.data.data.imageNames !== undefined &&
    response.data.data.imageUrls !== undefined &&
    response.data.data.name !== undefined &&
    response.data.data.report !== undefined
  );
};

const formReducer = (state: any, event: any) => {
  if (event.reset) {
    return {
      name: "",
      hours: 0,
      costs: 0,
      report: "",
      buildSite: "",
      images: "",
    };
  }
  return {
    ...state,
    [event.name]: event.value,
  };
};

const convertToFormData = (formData: AddPostFormData): FormData => {
  const data: AddPostFormData = {
    name: formData.name,
    hours: formData.hours,
    costs: formData.costs,
    report: formData.report,
    buildSite: formData.buildSite,
    images: formData.images || [],
  };

  const formBody = new FormData();

  Object.keys(data).forEach((key) => {
    if (key === "images") {
      // Handle images separately to be found in req.files
      const imageFiles = data[key as keyof typeof data] as File[];
      for (const imageFile of imageFiles) {
        formBody.append("images", imageFile);
      }
    } else {
      // For other form fields
      formBody.append(key, data[key as keyof typeof data] as string);
    }
  });

  return formBody;
};

const AddPostForm = (props: FormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useReducer(formReducer, {});
  const [inputKey, setInputKey] = useState(Date.now());
  const [globalFeed, setGlobalFeed] = useRecoilState(feedState);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const formBody = convertToFormData(formData);

      const response = await axios.post<PostState>(
        `${process.env.REACT_APP_SERVER_URL}/posts/makepost`,
        formBody,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (!addPostResponseIsValid(response)) {
        console.error(response);
        throw new Error(`Response from makepost server is not correct`);
      }

      console.log(response);

      setGlobalFeed([response.data.data, ...globalFeed]);

      // resets the text based inputs
      setFormData({
        reset: true,
      });
      //resets the image input
      setInputKey(Date.now());

      setSubmitting(false);

      alert("Post was successful!");

      props.onClose();
    } catch (err) {
      console.error("System Error Submitting Post: ", err);
      alert("There has been an error submitting your post");
      setFormData({
        reset: true,
      });
      setInputKey(Date.now());
      setSubmitting(false);
    }
  };

  const handleChange = (
    event: ChangeEvent<
      HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      name: event.target.name,
      value: event.target.value,
    });
  };

  const onImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
    setFormData({
      name: event.target.name,
      value: event.target.files,
    });
  };

  const rootElement = document.getElementById("root");

  return rootElement
    ? createPortal(
        <CSSTransition
          in={props.show}
          unmountOnExit
          timeout={{ enter: 0, exit: 300 }}
        >
          <ModalWrapper onClick={() => props.onClose()}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeaderFooter>
                <h2 className="m-0">Make A Post</h2>
              </ModalHeaderFooter>
              {submitting && <div>Submitting Form...</div>}

              <form onSubmit={handleSubmit}>
                <ModalBody>
                  <fieldset disabled={submitting}>
                    <ModalLabel>
                      <p>Name:</p>
                      <ModalSelect
                        name="name"
                        onChange={handleChange}
                        value={formData.name || ""}
                        required
                      >
                        <option value="">--Please choose an option--</option>
                        <option value="Elliott">Elliott</option>
                        <option value="Pierce">Pierce</option>
                        <option value="Sam">Sam</option>
                      </ModalSelect>
                    </ModalLabel>
                    <ModalLabel>
                      <p>Choose a site:</p>
                      <ModalSelect
                        name="buildSite"
                        onChange={handleChange}
                        value={formData.buildSite || ""}
                        required
                      >
                        <option value="">--Please choose an option--</option>
                        <option value="7 Rose Street">7 Rose Street</option>
                        <option value="NIB">NIB</option>
                        <option value="11 Beach Street">11 Beach Street</option>
                      </ModalSelect>
                    </ModalLabel>
                    <ModalLabel>
                      <p>Hours</p>
                      <ModalInput
                        type="number"
                        step="0.01"
                        name="hours"
                        value={formData.hours || ""}
                        onChange={handleChange}
                        required
                        placeholder="e.g 8, 8.75"
                      />
                    </ModalLabel>
                    <ModalLabel>
                      <p>Costs</p>
                      <ModalInput
                        type="number"
                        step="0.01"
                        name="costs"
                        value={formData.costs || ""}
                        onChange={handleChange}
                        required
                        placeholder="e.g 324, 324.25"
                      />
                    </ModalLabel>
                    <ModalLabel>
                      <p>Report:</p>
                      <ModalTextarea
                        name="report"
                        value={formData.report || ""}
                        onChange={handleChange}
                        rows={5}
                        cols={60}
                        required
                      />
                    </ModalLabel>
                    <ModalLabel>
                      <p>Add Image:</p>
                      <input
                        type="file"
                        name="images"
                        className="imageInput"
                        onChange={onImageChange}
                        key={inputKey}
                        multiple
                      />
                    </ModalLabel>
                  </fieldset>
                </ModalBody>
                <ModalHeaderFooter>
                  <ModalSubmitButton type="submit" disabled={submitting}>
                    Submit
                  </ModalSubmitButton>
                  <ModalCloseButton onClick={() => props.onClose()}>
                    Close
                  </ModalCloseButton>
                </ModalHeaderFooter>
              </form>
            </ModalContent>
          </ModalWrapper>
        </CSSTransition>,
        rootElement
      )
    : null;
};

export default AddPostForm;
