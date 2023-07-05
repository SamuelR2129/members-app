import React, { FormEvent, SetStateAction } from "react";
import { EditFormValues } from "./Posts";
import { AddPostResponseData } from "../types/posts";
import { useRecoilState } from "recoil";
import { feedState } from "../atom/feedAtom";

type EditFormModalProps = {
  handleModalClose: () => void;
  formValues: EditFormValues;
  setFormValues: React.Dispatch<SetStateAction<EditFormValues>>;
  setShowModal: React.Dispatch<SetStateAction<boolean>>;
};

export const EditFormModal = ({
  handleModalClose,
  formValues,
  setFormValues,
  setShowModal,
}: EditFormModalProps) => {
  const [feed, setFeed] = useRecoilState(feedState);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData();

    data.set("report", formValues.report);
    data.set("buildSite", formValues.buildSite);

    const formPostResponse = await fetch(
      `${process.env.REACT_APP_SERVER_URL}/posts/update/${formValues._id}`,
      {
        method: "POST",
        mode: "cors",
        body: data,
      }
    );

    const responseData: AddPostResponseData = await formPostResponse.json();
    console.log(responseData);

    if (!responseData || responseData.status !== 201) {
      throw new Error(
        `Response from formPost is not valid or undefined - ${responseData}`
      );
    }

    const newFeedPost = responseData.data[0];

    setFeed([newFeedPost, ...feed]);
    alert("Post was edited!");
    setShowModal(false);
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <span className="close" onClick={handleModalClose}>
          &times;
        </span>
        <form onSubmit={handleFormSubmit}>
          {/* form fields */}

          <label>
            <p>Choose a site:</p>
            <select
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
            </select>
          </label>
          <label>
            <p>Report:</p>
            <textarea
              name="report"
              onChange={(e) =>
                setFormValues({ ...formValues, report: e.target.value })
              }
              value={formValues.report || ""}
              rows={5}
              cols={60}
              required
              className="w-[97%]"
            />
          </label>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};
