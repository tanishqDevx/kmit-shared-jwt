let sharedJWT: string | null = null;
let jwtExpiry = 0;

export const getJWT = () => {
  if (sharedJWT && Date.now() < jwtExpiry) return sharedJWT;
  return null;
};

export const setJWT = (token: string) => {
  sharedJWT = token;
  jwtExpiry = Date.now() + 23 * 60 * 60 * 1000; // 23 hours
};
