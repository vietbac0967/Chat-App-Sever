export const validateEmail = (email) => {
  let re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
};
export const validatePhoneNumber = (phone) => {
  let re = /^0\d{9}$/;
  return re.test(phone);
};

export const validatePassword = (password) => {
  let re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(\W|_)).{5,}$/;
  return re.test(password);
};


export const validateField = (field) => {
  if (!field || field.trim() === "") {
    return false;
  }
  return true;
};
