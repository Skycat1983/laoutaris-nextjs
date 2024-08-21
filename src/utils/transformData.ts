import { Document } from "mongoose";

export const replaceMongoIdInArray = <T extends { _id: any }>(
  array: T[]
): (Omit<T, "_id"> & { id: string })[] => {
  return array.map((item) => {
    const { _id, ...rest } = item;
    return {
      id: _id.toString(),
      ...rest,
    };
  });
};

// export const replaceMongoIdInArray = <T extends Document>(
//   array: T[]
// ): (Omit<T, "_id"> & { id: string })[] => {
//   return array.map((item) => {
//     const { _id, ...rest } = item.toObject();
//     return {
//       id: _id.toString(),
//       ...rest,
//     };
//   });
// };
