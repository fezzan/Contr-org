import { useCallback, useState } from 'react';

const useToggle = (defaultValue) => {
  const [value, setValue] = useState(defaultValue);

  const toggleValue = useCallback(() => {
    setValue((currentValue) => !currentValue);
  }, []);

  return [value, toggleValue];
};
export default useToggle;
