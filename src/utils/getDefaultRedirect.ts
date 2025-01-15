import { redirect } from "next/navigation";

export const getDefaultRedirect = async (
  getSubNavData: () => Promise<{ link_to: string }[]>,
  fallbackMessage: string
) => {
  const subNavData = await getSubNavData();

  if (!subNavData || subNavData.length === 0) {
    throw new Error(fallbackMessage);
  }

  const redirectUrl = subNavData[0].link_to;
  redirect(redirectUrl);
};
