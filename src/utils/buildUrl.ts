export const buildUrl = (segments: string[]) => {
  const base = process.env.BASEURL;
  return `${base}/${segments.join("/")}`;
};
