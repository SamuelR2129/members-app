import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { feedState } from '../atom/feedAtom';
import { createPortal } from 'react-dom';
import { PostState } from '../types';
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
  ModalWrapper
} from '../styles/addPostModal';
import axios from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';

type FormProps = {
  show: boolean;
  onClose: () => void;
};

type AddPostModalData = {
  name: string;
  hours: number;
  costs: number;
  report: string;
  buildSite: string;
  images: File[] | File;
};

const convertToFormData = (data: AddPostModalData) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (key === 'images') {
      // Handle images separately to be found in req.files
      const imageFiles = data[key as keyof typeof data] as File[];
      for (const imageFile of imageFiles) {
        formData.append('images', imageFile);
      }
    } else {
      // For other form fields
      formData.append(key, data[key as keyof typeof data] as string);
    }
  });

  return formData;
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

const AddPostModal = (props: FormProps) => {
  const [submitting, setSubmitting] = useState(false);
  const [globalFeed, setGlobalFeed] = useRecoilState(feedState);
  const {
    register,
    handleSubmit,
    reset,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    formState: { errors }
  } = useForm<AddPostModalData>();

  const onSubmit: SubmitHandler<AddPostModalData> = async (data) => {
    const formData = convertToFormData(data);

    setSubmitting(true);

    try {
      const response = await axios.post<PostState>(
        `${process.env.REACT_APP_SERVER_URL}/posts/makepost`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (!addPostResponseIsValid(response)) {
        console.error(response);
        throw new Error(`Response from makepost server is not correct`);
      }
      // eslint-disable-next-line no-debugger
      debugger;
      setGlobalFeed([response.data.data, ...globalFeed]);

      reset();

      setSubmitting(false);

      alert('Post was successful!');

      props.onClose();
    } catch (err) {
      console.error('System Error Submitting Post: ', err);
      alert('There has been an error submitting your post');
      setSubmitting(false);
    }
  };

  return createPortal(
    <ModalWrapper onClick={() => props.onClose()}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <ModalHeaderFooter>
          <h2 className="m-0">Make a post</h2>
        </ModalHeaderFooter>
        {submitting && <div>Submitting Form...</div>}

        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <ModalBody>
            <fieldset disabled={submitting}>
              <ModalLabel>
                <p>Name:</p>
                <ModalSelect {...register('name', { required: 'You must select a name' })}>
                  <option value="">--Please choose an option--</option>
                  <option value="Elliott">Elliott</option>
                  <option value="Pierce">Pierce</option>
                  <option value="Sam">Sam</option>
                </ModalSelect>
              </ModalLabel>
              <ModalLabel>
                <p>Choose a site:</p>
                <ModalSelect
                  {...register('buildSite', { required: 'You must select a build site' })}>
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
                  {...register('hours', {
                    valueAsNumber: true,
                    required: 'You must add your hours'
                  })}
                  placeholder="e.g 8, 8.75"
                />
              </ModalLabel>
              <ModalLabel>
                <p>Costs</p>
                <ModalInput
                  type="number"
                  step="0.01"
                  {...register('costs', {
                    valueAsNumber: true,
                    required: 'You must add your costs'
                  })}
                  placeholder="e.g 324, 324.25"
                />
              </ModalLabel>
              <ModalLabel>
                <p>Report:</p>
                <ModalTextarea
                  {...register('report', { required: 'Please provide a report of the day' })}
                  rows={5}
                  cols={60}
                />
              </ModalLabel>
              <ModalLabel>
                <p>Add Image:</p>
                <input type="file" {...register('images')} multiple />
              </ModalLabel>
            </fieldset>
          </ModalBody>
          <ModalHeaderFooter>
            <ModalSubmitButton type="submit" disabled={submitting}>
              Submit
            </ModalSubmitButton>
            <ModalCloseButton
              onClick={() => {
                props.onClose();
              }}>
              Close
            </ModalCloseButton>
          </ModalHeaderFooter>
        </form>
      </ModalContent>
    </ModalWrapper>,
    document.getElementById('root')!
  );
};

export default AddPostModal;
