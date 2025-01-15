import { redirect } from "next/navigation";

export const redirectToDefault = async (
  fetchData: () => Promise<{ link_to: string }[]>,
  fallbackMessage: string
) => {
  const data = await fetchData();

  if (!data || data.length === 0) {
    throw new Error(fallbackMessage);
  }

  const redirectUrl = data[0].link_to;
  redirect(redirectUrl);
};
