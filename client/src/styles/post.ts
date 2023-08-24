import tw from 'tailwind-styled-components';

export const Button = tw.button`
  mr-2 px-4 py-2 text-white rounded hover:bg-opacity-75
`;

// EditButton has a blue background color
export const EditButton = tw(Button)`
  bg-blue-500 hover:bg-blue-600
`;

// DeleteButton has a red background color
export const DeleteButton = tw(Button)`
  bg-red-500 hover:bg-red-600
`;

// Now use the styled components in your Post component
export const PostWrapper = tw.div`
  flex flex-col justify-between items-start p-4 border border-gray-300 rounded-lg
  font-sans

  @media (max-width: 767px) {
    // Styles for mobile
    p-2
    overflow-hidden
  }
`;

export const PostName = tw.div`
  text-xl font-bold mb-2
`;

export const PostBuildSite = tw.div`
  text-base mb-2 text-gray-700
`;

export const PostTimeCreated = tw.div`
   mb-2 text-gray-700 text-sm
`;

export const PostReport = tw.div`
  text-lg text-gray-900 mb-7
  @media (max-width: 767px) {
    // Styles for mobile
    text-md 
  }
`;

export const PostImage = tw.img`
  w-300 h-300 mb-4
  @media (max-width: 767px) {
    // Styles for mobile
    w-full
  }
`;
