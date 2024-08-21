import { Document } from "mongoose";

// export const replaceMongoIdInArray = <T extends { _id: any }>(
//   array: T[]
// ): (Omit<T, "_id"> & { id: string })[] => {
//   return array.map((item) => {
//     const { _id, ...rest } = item;
//     return {
//       id: _id.toString(),
//       ...rest,
//     };
//   });
// };

export const replaceMongoId = <T extends { _id: any }>(
  document: T
): Omit<T, "_id"> & { id: string } => {
  const { _id, ...rest } = document;
  return {
    id: _id.toString(),
    ...rest,
  };
};

// export const replaceMongoId = <T extends { _id: any }>(
//   document: T
// ): Omit<T, "_id"> & { id: string } => {
//   const { _id, ...rest } = document;
//   return {
//     id: _id.toString(),
//     ...rest,
//   };
// };
