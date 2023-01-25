import { useState } from "react";
import { Link } from "react-router-dom";
import AddPostForm from "./AddPostForm";

const Navbar = () => {
  const isAuthenticated = false;
  const [showForm, setShowForm] = useState(false);

  const authLinks = (
    <>
      <ul>
        <li>Hello Elliott and Peirce </li>
        <li>
          <a href="#!">
            <i className="fas fa-sign-out-alt"></i>
            <span className="hide-sm">Tables</span>
          </a>
        </li>
        <li>
          <a href="#!">
            <i className="fas fa-sign-out-alt"></i>
            <span className="hide-sm">Contractors</span>
          </a>
        </li>
        <li>
          <a href="#!">
            <i className="fas fa-sign-out-alt"></i>
            <span className="hide-sm">Logout</span>
          </a>
        </li>
      </ul>
    </>
  );

  const tradieLinks = (
    <>
      <ul className="flex">
        <li>
          <button onClick={() => setShowForm(true)}>Make a Post</button>
        </li>
        <li>
          <a href="#!">
            <i className="fas fa-sign-out-alt"></i>
            <span className="hide-sm">Logout</span>
          </a>
        </li>
      </ul>
    </>
  );

  return (
    <div className="">
      <ul>{isAuthenticated ? authLinks : tradieLinks}</ul>
      {showForm && <AddPostForm />}
    </div>
  );
};

export default Navbar;
