export const buildUrl = (segments: string[]) => {
  const base = process.env.BASEURL;
  return `${base}/${segments.join("/")}`;
};

export const constructUrl = (segments: string[]) => {
  const base = process.env.BASEURL;
  const path = segments.join("/");

  const url = new URL(path, base);
  return url.toString();
};
