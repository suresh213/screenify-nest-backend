export const generateUsername = (email: string): string => {
  return email.split('@')[0];
};

export const generateOTP = () => {
  const digits = '0123456789';
  let OTP = '';
  for (let i = 0; i < 4; i += 1) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};