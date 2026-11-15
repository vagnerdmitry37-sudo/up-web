export const apiUrl = (path: string): URL => {
  const baseUrl = process.env.API_URL;
  if (!baseUrl) {
    throw new Error("API_URL is not set. Add it to .env.local.");
  }
  return new URL(path, baseUrl);
};
