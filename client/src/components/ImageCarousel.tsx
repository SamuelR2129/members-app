import { useState } from 'react';
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';

type ImageCarouselProps = {
  imageUrlArray: (string | undefined)[];
};

const ImageCarousel = ({ imageUrlArray }: ImageCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const prevSlide = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? imageUrlArray.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const nextSlide = () => {
    const isLastSlide = currentIndex === imageUrlArray.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentIndex(slideIndex);
  };

  return (
    <div className="max-w-[1400px] h-[780px] w-full m-auto py-16 px-4 relative group">
      <div
        style={{ backgroundImage: `url(${imageUrlArray[currentIndex]})` }}
        className="w-full h-full rounded-2xl bg-center bg-cover duration-500"></div>
      <div>
        <BsChevronCompactLeft
          onClick={prevSlide}
          size={30}
          className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
        />
      </div>
      <div>
        <BsChevronCompactRight
          onClick={nextSlide}
          size={30}
          className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer"
        />
      </div>
      <div className="flex top-4 justify-center py-2">
        {imageUrlArray.map((_, index: number) => (
          <div key={index} onClick={() => goToSlide(index)} className="text-2xl cursor-pointer">
            <RxDotFilled />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageCarousel;
