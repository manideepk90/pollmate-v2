const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
};

const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
};

const removeLocalStorage = (key: string) => {
  localStorage.removeItem(key);
};

const clearLocalStorage = () => {
  localStorage.clear();
};

export {
  setLocalStorage,
  getLocalStorage,
  removeLocalStorage,
  clearLocalStorage,
};
