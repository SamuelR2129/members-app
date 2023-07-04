import Feed from "../components/Feed";

const MainFeed = () => {
  return (
    <div className="container overflow-x-hidden">
      <article className="">
        <header>
          <h1 className="">Eac-Rowan Builds</h1>
        </header>
      </article>

      <section className="">
        <Feed />
      </section>
    </div>
  );
};

export default MainFeed;
