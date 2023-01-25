import { FormEvent, useReducer, useState } from "react";

const formReducer = (state: any, event: any) => {
  if (event.reset) {
    return {
      name: "",
      hours: 0,
      costs: "",
      report: "",
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

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setFormData({
      reset: true,
    });
    alert("You have submitted the form.");
  };

  const handleChange = (event: any) => {
    setFormData({
      name: event.target.name,
      value: event.target.value,
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
        </fieldset>
        <button type="submit" disabled={submitting}>
          Submit
        </button>
      </form>
    </div>
  );
};

export default AddPostForm;
