// Import the function to be tested

import { getImageNamesFromFormData } from './AddPostModal';

// Test case for the getImageNamesFromFormData function
describe('getImageNamesFromFormData', () => {
  it('should replace spaces with underscores in image names', () => {
    // Input FileList with spaces in image names
    const inputImages = [{ name: 'Image 1.jpg' }, { name: 'Image 2.png' }] as unknown as FileList;

    // Expected output with spaces replaced by underscores
    const expectedOutput = ['Image_1.jpg', 'Image_2.png'];

    // Call the function with the input
    const result = getImageNamesFromFormData(inputImages);

    // Expect the result to match the expected output
    expect(result).toEqual(expectedOutput);
  });
});
