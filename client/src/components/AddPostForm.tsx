import { ChangeEvent, FormEvent, useReducer, useState } from "react";
import { useRecoilState } from "recoil";
import { feedState } from "../atom/feedAtom";
import { AddPostResponseData } from "../types/posts";
import tw from "tailwind-styled-components";
import { CSSTransition } from "react-transition-group";
import { createPortal } from "react-dom";

const Modal = tw.div`
  fixed
  inset-0
  bg-black
  bg-opacity-50
  flex
  items-center
  justify-center
`;

const ModalContent = tw.div`
  w-500
  bg-white
`;

const ModalHeaderFooter = tw.div`
  p-10
`;

const ModalBody = tw.div`
  p-10
  border-t
  border-b
  border-gray-300
`;

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

type FormProps = {
  show: boolean;
  onClose: () => void;
};

const AddPostForm = (props: FormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useReducer(formReducer, {});
  const [inputKey, setInputKey] = useState(Date.now());
  const [feed, setFeed] = useRecoilState(feedState);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();

      data.set("name", formData.name);
      data.set("hours", formData.hours);
      data.set("costs", formData.costs);
      data.set("report", formData.report);
      data.set("buildSite", formData.buildSite);
      if (formData.images) {
        data.set("images", formData.images[0]);
      }

      const formPostResponse = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/posts/makepost`,
        {
          method: "POST",
          mode: "cors",
          body: data,
        }
      );

      const responseData: AddPostResponseData = await formPostResponse.json();

      if (!responseData.data) {
        throw new Error(
          `Response from formPost is not valid or undefined - ${responseData}`
        );
      }

      const newFeedPost = responseData.data[0];

      setFeed([newFeedPost, ...feed]);

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
          <Modal onClick={props.onClose}>
            <ModalContent onClick={(e) => e.stopPropagation()}>
              <ModalHeaderFooter>
                <h2 className="m-0">Make A Post</h2>
              </ModalHeaderFooter>
              {submitting && <div>Submtting Form...</div>}

              <form onSubmit={handleSubmit}>
                <ModalBody>
                  <fieldset disabled={submitting}>
                    <label>
                      <p>Name:</p>
                      <select
                        name="name"
                        onChange={handleChange}
                        value={formData.name || ""}
                        required
                      >
                        <option value="">--Please choose an option--</option>
                        <option value="Elliott">Elliott</option>
                        <option value="Pierce">Pierce</option>
                        <option value="Sam">Sam</option>
                      </select>
                    </label>
                    <label>
                      <p>Choose a site:</p>
                      <select
                        name="buildSite"
                        onChange={handleChange}
                        value={formData.buildSite || ""}
                        required
                      >
                        <option value="">--Please choose an option--</option>
                        <option value="7 Rose Street">7 Rose Street</option>
                        <option value="NIB">NIB</option>
                        <option value="11 Beach Street">11 Beach Street</option>
                      </select>
                    </label>
                    <label>
                      <p>Hours</p>
                      <input
                        type="number"
                        step="0.01"
                        name="hours"
                        value={formData.hours || ""}
                        onChange={handleChange}
                        required
                        placeholder="e.g 8, 8.75"
                      />
                    </label>
                    <label>
                      <p>Costs</p>
                      <input
                        type="number"
                        step="0.01"
                        name="costs"
                        value={formData.costs || ""}
                        onChange={handleChange}
                        required
                        placeholder="e.g 324, 324.25"
                      />
                    </label>
                    <label>
                      <p>Report:</p>
                      <textarea
                        name="report"
                        value={formData.report || ""}
                        onChange={handleChange}
                        rows={5}
                        cols={60}
                        required
                        className="w-[97%]"
                      />
                    </label>
                    <label>
                      <p>Add Image:</p>
                      <input
                        type="file"
                        name="images"
                        className="imageInput"
                        onChange={onImageChange}
                        key={inputKey}
                        multiple
                      />
                    </label>
                  </fieldset>
                </ModalBody>
                <ModalHeaderFooter>
                  <button type="submit" disabled={submitting}>
                    Submit
                  </button>
                  <button onClick={props.onClose}>Close</button>
                </ModalHeaderFooter>
              </form>
            </ModalContent>
          </Modal>
        </CSSTransition>,
        rootElement
      )
    : null;
};

export default AddPostForm;
