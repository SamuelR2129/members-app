import Feed from '../components/Feed';
import { useState } from 'react';
import AddPostModal from '../components/AddPostModal';
import { FormButton } from '../styles/mainPage';

const MainPage = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="container overflow-x-hidden">
      <article className="">
        <header>
          <h1 className="max-[850px]:text-5xl text-7xl">Eac-Rowan Builds</h1>
        </header>
      </article>

      <section className="">
        <h3 className="mb-3 mt-0">What is happening on site:</h3>
        <FormButton onClick={() => setShowForm(true)}> Make a post</FormButton>
        {showForm && <AddPostModal onClose={() => setShowForm(false)} show={showForm} />}
        <Feed />
      </section>
    </div>
  );
};

export default MainPage;
