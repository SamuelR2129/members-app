import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { feedState } from '../atom/feedAtom';
import { createPortal } from 'react-dom';
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
import { PostState } from '../pages/Feed';
import { z } from 'zod';

type FormProps = {
  show: boolean;
  onClose: () => void;
};

type AddPostModalData = {
  name: string;
  hours: string;
  costs: string;
  report: string;
  buildSite: string;
  images: FileList;
};

type PostData = {
  name: string;
  hours: string;
  costs: string;
  report: string;
  buildSite: string;
  imageNames?: string[];
  imageUrls?: string[];
};

const NewPostSchema = z.object({
  id: z.string(),
  postId: z.string(),
  name: z.string(),
  report: z.string(),
  createdAt: z.string(),
  buildSite: z.string(),
  imageNames: z.string().array().optional(),
  imageUrls: z.string().array().optional()
});

const AddPostResponse = z.object({
  newPost: NewPostSchema,
  imageUploadUrls: z.string().array().optional()
});

type AddPostResponse = z.infer<typeof AddPostResponse>;

const isAddPostResponseValid = (unknownData: unknown): unknownData is PostState => {
  const result = AddPostResponse.safeParse(unknownData);
  if (result.success) return true;
  console.error(result.error.message);
  return false;
};

export const getImageNamesFromFormData = (images: FileList): string[] => {
  return [...images].map((image) => {
    return image.name.replace(/ /g, '_');
  });
};

const uploadImagesToS3 = async (url: string, image: File) => {
  const response = await axios.put(url, image);

  if (response.status !== 200) {
    throw new Error(`Error in uploading image with presigned s3 url - ${response.status} `);
  }
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
  const [loading, setLoading] = useState(false);

  const onSubmit: SubmitHandler<AddPostModalData> = async (data) => {
    setLoading(true);

    try {
      const postData: PostData = {
        name: data.name,
        hours: data.hours.toString(),
        costs: data.costs.toString(),
        report: data.report,
        buildSite: data.buildSite
      };

      if (data.images.length > 0) postData.imageNames = getImageNamesFromFormData(data.images);

      const response = await axios.post<AddPostResponse>(
        `${process.env.REACT_APP_API_GATEWAY_PROD}savePost`,
        JSON.stringify(postData)
      );

      if (!isAddPostResponseValid(response.data)) {
        alert('There has been an error submitting your post');
        setLoading(false);
        return;
      }

      if (response.data.imageUploadUrls) {
        response.data.imageUploadUrls.map((url, index) => {
          uploadImagesToS3(url, data.images[index]);
        });
      }

      setGlobalFeed([response.data.newPost, ...globalFeed]);

      //resets the form values
      reset();

      setLoading(false);

      alert('Post was successful!');

      props.onClose();
    } catch (err) {
      console.error('System Error Submitting Post: ', err);
      setLoading(false);
      alert('There has been an error submitting your post');
      setSubmitting(false);
    }
  };

  return createPortal(
    <ModalWrapper onClick={() => props.onClose()} className={`${loading ? 'animate-pulse' : ''}`}>
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
