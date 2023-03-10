import { ChangeEvent, FormEvent, useReducer, useRef, useState } from "react";

type FormDataType = {
  name: string;
  hours: string;
  costs: string;
  report: string;
  image?: File[];
  reset?: boolean;
};

type AddPostResponseData = {
  status: boolean;
  result: string;
};

const formReducer = (state: any, event: any) => {
  if (event.reset) {
    return {
      name: "",
      hours: 0,
      costs: 0,
      report: "",
      images: "",
    };
  }
  return {
    ...state,
    [event.name]: event.value,
  };
};

const AddPostForm = () => {
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useReducer(formReducer, {});
  const [inputKey, setInputKey] = useState(Date.now());

  console.log(formData);
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const data = new FormData();

      data.set("name", formData.name);
      data.set("hours", formData.hours);
      data.set("costs", formData.costs);
      data.set("report", formData.report);
      if (formData.images) {
        data.set("images", formData.images[0]);
      }

      const formPostResponse = await fetch(
        `${process.env.REACT_APP_SERVER_URL}/api/member/posts/makepost`,
        {
          method: "POST",
          mode: "cors",
          body: data,
        }
      );

      const responseData: AddPostResponseData = await formPostResponse.json();

      setFormData({
        reset: true,
      });

      setInputKey(Date.now());

      setSubmitting(false);
      if (!responseData.status) {
        alert(responseData.result);
        return;
      }

      alert(responseData.result);
      return;
    } catch (err) {
      console.log("There has been an error submitting your post", err);
      alert("There has been an error submitting your post");
      setFormData({
        reset: true,
      });
      setSubmitting(false);
    }
  };

  const handleChange = (
    event:
      | ChangeEvent<HTMLSelectElement>
      | ChangeEvent<HTMLInputElement>
      | ChangeEvent<HTMLTextAreaElement>
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

  return (
    <div>
      <h2>Make A Post</h2>
      {submitting && <div>Submtting Form...</div>}
      <form onSubmit={handleSubmit}>
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
        <button type="submit" disabled={submitting}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPostForm;
