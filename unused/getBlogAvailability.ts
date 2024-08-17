import { BlogModel } from "@/lib/server/models";

/*
 * This function retrieves all blog entries from the database and calculates their availability by year and month.
 * It creates an object where each key is a year and its value is another object.
 * The nested object has keys for each month (0-11, following JavaScript's Date object convention) and values representing the count of blog entries for that month.
 * The result is an object that provides a quick lookup for the number of blog entries available for each month of each year.
 */

interface Availability {
  [year: number]: Record<number, number>;
}

export const getBlogAvailability = async () => {
  const blogEntries = await BlogModel.find();

  const availability: Availability = {};

  blogEntries.forEach((entry) => {
    const date = new Date(entry.displayDate);
    const year = date.getFullYear();
    const month = date.getMonth();

    if (!availability[year]) {
      availability[year] = {};
    }

    if (!availability[year][month]) {
      availability[year][month] = 0;
    }

    availability[year][month]++;
  });

  return availability;
};
