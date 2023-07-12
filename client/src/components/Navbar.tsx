import { useState } from "react";
import AddPostForm from "./AddPostForm";
import tw from "tailwind-styled-components";
import { NavLink as Link } from "react-router-dom";

const NavContainer = tw.div`
  flex 
  flex-col 
  sm:flex-row 
  items-center 
  justify-between
`;

const NavList = tw.ul`
  flex 
  flex-col 
  sm:flex-row 
  space-y-2 
  sm:space-y-0 
  sm:space-x-4 
  list-none
  items-center 
`;

const NavItem = tw.li`
  inline-block
`;

const NavLink = tw(Link)`
  no-underline
`;

const Navbar = () => {
  return (
    <NavContainer>
      <NavList>
        <NavItem></NavItem>
        <NavItem>
          <NavLink to="/">Feed</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/tables">Tables</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/contractors">Contractors</NavLink>
        </NavItem>
        <NavItem>
          <NavLink to="/">Logout</NavLink>
        </NavItem>
      </NavList>
    </NavContainer>
  );
};

export default Navbar;
