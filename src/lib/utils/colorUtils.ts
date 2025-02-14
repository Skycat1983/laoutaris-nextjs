export const getYearColor = (year: number): string => {
  const yearColors: Record<number, string> = {
    2014: "bg-orange-400",
    2015: "bg-indigo-500",
    2016: "bg-green-700",
    2017: "bg-yellow-500",
    2018: "bg-green-500",
    2019: "bg-coral-500",
    2020: "bg-pink-500",
    2021: "bg-purple-500",
    2022: "bg-blue-400",
    2023: "bg-black",
  };

  return yearColors[year] || "bg-gray-500";
};
