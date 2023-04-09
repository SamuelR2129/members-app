import Feed from "../components/Feed";
import Navbar from "../components/Navbar";

const Home = () => {
  return (
    <div className="container overflow-x-hidden">
      <article className="">
        <header>
          <h1 className="">Eac-Rowan Builds</h1>
        </header>
      </article>

      <section className="">
        <Navbar />
        <Feed />
      </section>
    </div>
  );
};

export default Home;
