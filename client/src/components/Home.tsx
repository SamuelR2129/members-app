import Feed from "./Feed";
import Navbar from "./Navbar";

const Home = () => {
  return (
    <>
      <article className="">
        <header>
          <h1>Eac-Rowan Builds</h1>
        </header>
      </article>

      <section className="">
        <Navbar />
        <Feed />
      </section>
    </>
  );
};

export default Home;
