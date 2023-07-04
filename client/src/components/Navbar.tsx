import { useState } from "react";
import AddPostForm from "./AddPostForm";
import tw from "tailwind-styled-components";
import { NavLink as Link } from "react-router-dom";

const NavUl = tw.ul`
  flex 
  flex-wrap
  list-none 
  font-bold
  p-0
`;

const NavIl = tw.li`
  p-2
`;

const Navbar = () => {
  const isManager = false;
  const [showForm, setShowForm] = useState(false);

  const managerLinks = <ul></ul>;

  const tradieLinks = (
    <NavUl>
      <NavIl>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? "Hide Post Form" : "Make a Post"}
        </button>
      </NavIl>
      <NavIl>
        <Link to="/" className="no-underline">
          Feed
        </Link>
      </NavIl>
      <NavIl>
        <Link to="/tables" className="no-underline">
          Tables
        </Link>
      </NavIl>
      <NavIl>
        <Link to="/contractors" className="no-underline">
          Contractors
        </Link>
      </NavIl>
      <NavIl>
        <Link to="/" className="no-underline">
          Logout
        </Link>
      </NavIl>
    </NavUl>
  );

  return (
    <div className="">
      {isManager ? managerLinks : tradieLinks}
      {showForm && <AddPostForm />}
    </div>
  );
};

export default Navbar;
