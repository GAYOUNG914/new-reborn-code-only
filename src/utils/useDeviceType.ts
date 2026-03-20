import { useState, useEffect } from 'react';

const useDeviceType = () => {
  const [deviceType, setDeviceType] = useState<'' | 'mobile' | 'tablet' | 'pc'>('');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      
      if (width <= 767) {
        setDeviceType('mobile');
      } else if (width <= 768) {
        setDeviceType('tablet');
      } else {
        setDeviceType('pc');
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return deviceType;
};

export default useDeviceType;
