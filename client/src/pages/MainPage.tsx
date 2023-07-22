import tw from "tailwind-styled-components";
import Feed from "../components/Feed";
import { useState } from "react";
import AddPostModal from "../components/AddPostModal";
import { EditPostModal } from "../components/EditPostModal";

const FormButton = tw.button`
  px-4 
  py-2 
  bg-blue-300 
  rounded
  text-xl
`;

const MainPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container overflow-x-hidden">
      <article className="">
        <header>
          <h1 className="">Eac-Rowan Builds</h1>
        </header>
      </article>

      <section className="">
        <h3>What is happening on site:</h3>
        <FormButton onClick={() => setShowForm(true)}> Make a Post</FormButton>
        <AddPostModal onClose={() => setShowForm(false)} show={showForm} />
        <Feed />
      </section>
    </div>
  );
};

export default MainPage;
