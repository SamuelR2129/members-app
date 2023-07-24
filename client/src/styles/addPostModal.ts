import tw from "tailwind-styled-components";

export const ModalWrapper = tw.div`
  fixed
  top-0
  left-0
  w-full
  h-full
  flex
  items-center
  justify-center
  bg-gray-800
  bg-opacity-75
  overflow-y-scroll 
  overflow-scroll 
  touch:overflow-auto
`;

export const ModalContent = tw.div`
  bg-white
  p-8
  rounded
  w-96
`;

export const ModalHeaderFooter = tw.div`
  mb-4
`;

export const ModalBody = tw.div`
  mb-4
`;

export const ModalLabel = tw.label`
  block
  mb-2
`;

export const ModalSelect = tw.select`
  w-full
  p-2
  border
  border-gray-300
  rounded
`;

export const ModalInput = tw.input`
  w-[94%]
  p-2
  border
  border-gray-300
  rounded
  appearance-none
`;

export const ModalTextarea = tw.textarea`
  w-[94%]
  p-2
  border
  border-gray-300
  rounded
  resize-none
`;

export const ModalSubmitButton = tw.button`
  mr-2
  px-4
  py-2
  bg-blue-500
  text-white
  rounded
  hover:bg-blue-600
`;

export const ModalCloseButton = tw.button`
  px-4
  py-2
  bg-red-500
  text-white
  rounded
  hover:bg-red-600
  float-right
`;
