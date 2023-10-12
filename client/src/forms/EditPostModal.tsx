import { FormEvent, useState } from 'react';
import { PostState } from '../types';
import { useRecoilState } from 'recoil';
import { feedState } from '../atom/feedAtom';
import axios from 'axios';
import {
  ModalWrapper,
  ModalContent,
  ModalCloseButton,
  ModalForm,
  ModalLabel,
  ModalSelect,
  ModalTextarea,
  ModalSubmitButton
} from '../styles/editFormModal';
import ReactDOM from 'react-dom';
import { z } from 'zod';
import { pulsePostCardToggle } from '../components/utils';

type SetEditedValues = {
  report: string;
  buildSite: string;
};

type EditPostModal = {
  show: boolean;
  post: PostState;
  close: () => void;
};

export const injectEditedPostIntoFeed = (editedPost: EditedPostState, globalFeed: PostState[]) => {
  return globalFeed.map((post) => (post.id !== editedPost.id ? post : editedPost));
};

const PostStateSchema = z.object({
  id: z.string(),
  buildSite: z.string(),
  createdAt: z.string(),
  name: z.string(),
  report: z.string(),
  imageNames: z.string().array().optional()
});

export type EditedPostState = z.infer<typeof PostStateSchema>;

const isEditedPostValid = (unknownData: unknown): unknownData is EditedPostState => {
  const result = PostStateSchema.safeParse(unknownData);
  if (result.success === true) {
    return true;
  }
  console.error(result.error.message);
  return false;
};

export const EditPostModal = ({ show, post, close }: EditPostModal) => {
  const [globalFeed, setGlobalFeed] = useRecoilState(feedState);
  const [editedValues, setEditedValues] = useState<SetEditedValues>(post);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    pulsePostCardToggle();

    if (!editedValues || !editedValues.buildSite || !editedValues.report) {
      console.error(
        `Missing editedValues - buildSite: ${editedValues?.buildSite} report: ${editedValues?.report}`
      );
      alert(`There was a problem updating your post, please fill out build site and the report.`);
      pulsePostCardToggle();
      return;
    }

    const data = {
      report: editedValues.report,
      buildSite: editedValues.buildSite
    };

    const response = await axios.post<EditedPostState>(
      `${process.env.REACT_APP_SERVER_URL}updatePost/${post.id}`,
      data
    );

    if (!isEditedPostValid(response.data)) {
      alert(`There was a problem updating your post`);
      pulsePostCardToggle();
      return;
    }

    const feedWithEditedPost = injectEditedPostIntoFeed(response.data, globalFeed);

    setGlobalFeed(feedWithEditedPost);
    alert('Post was edited!');
    pulsePostCardToggle();
    close();
  };

  return ReactDOM.createPortal(
    <>
      {show ? (
        <ModalWrapper onClick={() => close()} className="pulse">
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalForm onSubmit={handleFormSubmit}>
              <ModalLabel>
                <p>Choose a site:</p>
                <ModalSelect
                  name="buildSite"
                  onChange={(e) =>
                    setEditedValues({
                      ...editedValues,
                      buildSite: e.target.value
                    })
                  }
                  value={editedValues.buildSite || ''}
                  required>
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
                      report: e.target.value
                    });
                  }}
                  value={editedValues.report || ''}
                  rows={5}
                  cols={60}
                  required
                />
              </ModalLabel>
              <div className="flex justify-between">
                <ModalSubmitButton type="submit">Submit</ModalSubmitButton>
                <ModalCloseButton onClick={() => close()}>Close</ModalCloseButton>
              </div>
            </ModalForm>
          </ModalContent>
        </ModalWrapper>
      ) : null}
    </>,
    document.getElementById('root')!
  );
};
