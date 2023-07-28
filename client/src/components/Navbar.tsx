import { NavContainer, NavItem, NavList, NavLink } from '../styles/navbar';

const Navbar = () => {
  return (
    <NavContainer>
      <NavList>
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
