import { NavLink as Link } from 'react-router-dom';
import tw from 'tailwind-styled-components';

export const NavContainer = tw.div`
  flex 
  flex-col 
  sm:flex-row 
  items-center 
  justify-between
`;

export const NavList = tw.ul`
  flex 
  flex-col 
  sm:flex-row 
  space-y-2 
  sm:space-y-0 
  sm:space-x-4 
  list-none
  items-center 
`;

export const NavItem = tw.li`
  inline-block
`;

export const NavLink = tw(Link)`
  no-underline
`;
