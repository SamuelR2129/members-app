import tw from 'tailwind-styled-components';

export const SiteFilter = tw.div`
  p-4 bg-gray-200 rounded-lg mb-5
`;

export const FilterHeading = tw.div`
  text-lg font-semibold mb-2  font-sans 
`;

export const FilterSelect = tw.select`
  block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm mb-2
`;
