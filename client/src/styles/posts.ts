import tw from 'tailwind-styled-components';

export const PostWrapper = tw.div`
  m-2
  p-2
  border-2
  border-solid
  border-gray-200
`;

export const DeleteButton = tw.button`
  p-1 
  border-1 
  border-solid 
  bg-red-100
  border-red-500
  hover:bg-red-300
  active:bg-red-500
  active:ring 
  active:ring-red-300
  cursor-pointer
`;
