import { useEffect, useState } from 'react';

const useIsScrolled = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY !== 0);
    };

    const handleLoad = () => {
      setIsScrolled(window.scrollY !== 0);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('load', handleLoad);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  return isScrolled;
};

export default useIsScrolled;
