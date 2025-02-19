import { Skeleton } from "@/components/shadcn/skeleton";
import {
  FrontendComment,
  FrontendCommentWithAuthor,
} from "@/lib/data/types/commentTypes";
import { formatDateImproved } from "@/lib/utils/formatDate";
import React from "react";
import DeleteIcon from "@/components/elements/icons/DeleteIcon";
import EditIcon from "@/components/elements/icons/EditIcon";

type Props = {
  comment: FrontendCommentWithAuthor;
};

export const CommentCard = ({ comment }: Props) => {
  const paragraphs = comment.text.replace(/\r\n/g, "\n").split(/\n\n+/);

  return (
    <div className="group relative bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-gray-600">
          <EditIcon />
        </button>
        <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400 hover:text-red-600">
          <DeleteIcon />
        </button>
      </div>
      <div className="space-y-4 ">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-gray-600 font-medium">
              {typeof comment.author !== "string"
                ? comment.author.username[0].toUpperCase()
                : "A"}
            </span>
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {typeof comment.author !== "string"
                ? comment.author.username
                : "Anonymous"}
            </h3>
            <p className="text-sm text-gray-500">
              {formatDateImproved(comment.displayDate.toString())}
            </p>
          </div>
        </div>
        <div className="prose prose-sm max-w-none">
          {paragraphs.map((paragraph, index) => (
            <p key={index} className="text-gray-700 leading-relaxed">
              {paragraph.trim()}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export const CommentCardSkeleton = () => {
  return (
    <Skeleton className="w-full max-w-2xl mx-auto mt-8 p-8 rounded-tl-lg rounded-tr-lg rounded-bl-lg shadow" />
  );
};

// CommentCardV3 has nice hover effect, turning the icon gray to black.

//! old versions
// export const CommentCardV2 = ({ comment }: Props) => {
//   const paragraphs = comment.text.replace(/\r\n/g, "\n").split(/\n\n+/);

//   return (
//     <div className="bg-white border-l-4 border-blue-500 shadow-sm">
//       <div className="p-6 space-y-4">
//         <div className="flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
//               <span className="text-blue-600 font-medium">
//                 {typeof comment.author !== "string"
//                   ? comment.author.username[0].toUpperCase()
//                   : "A"}
//               </span>
//             </div>
//             <div>
//               <h3 className="font-medium">
//                 {typeof comment.author !== "string"
//                   ? comment.author.username
//                   : "Anonymous"}
//               </h3>
//               <p className="text-sm text-gray-500">
//                 {formatDateImproved(comment.displayDate.toString())}
//               </p>
//             </div>
//           </div>
//           <div className="flex gap-1">
//             <button className="p-1.5 hover:bg-gray-50 rounded-lg">
//               <EditIcon />
//             </button>
//             <button className="p-1.5 hover:bg-gray-50 rounded-lg">
//               <DeleteIcon />
//             </button>
//           </div>
//         </div>
//         <div className="pl-13">
//           {paragraphs.map((paragraph, index) => (
//             <p
//               key={index}
//               className="text-gray-700 leading-relaxed mb-4 last:mb-0"
//             >
//               {paragraph.trim()}
//             </p>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export const CommentCardV3 = ({ comment }: Props) => {
//   const paragraphs = comment.text.replace(/\r\n/g, "\n").split(/\n\n+/);

//   return (
//     <div className="border-b border-gray-100 py-6">
//       <div className="space-y-4">
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <span className="font-medium text-gray-900">
//               {typeof comment.author !== "string"
//                 ? comment.author.username
//                 : "Anonymous"}
//             </span>
//             <span className="text-gray-300">•</span>
//             <span className="text-sm text-gray-500">
//               {formatDateImproved(comment.displayDate.toString())}
//             </span>
//           </div>
//           <div className="flex gap-2">
//             <button className="text-gray-400 hover:text-gray-600 transition-colors">
//               <EditIcon />
//             </button>
//             <button className="text-gray-400 hover:text-gray-600 transition-colors">
//               <DeleteIcon />
//             </button>
//           </div>
//         </div>
//         <div className="pl-0">
//           {paragraphs.map((paragraph, index) => (
//             <p key={index} className="text-gray-700 leading-7 mb-3 last:mb-0">
//               {paragraph.trim()}
//             </p>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export const CommentCardV4 = ({ comment }: Props) => {
//   const paragraphs = comment.text.replace(/\r\n/g, "\n").split(/\n\n+/);

//   return (
//     <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl shadow-sm p-1">
//       <div className="bg-white rounded-lg p-5 space-y-4">
//         <div className="flex justify-between items-start">
//           <div className="flex items-start gap-3">
//             <div className="bg-gradient-to-br from-blue-500 to-blue-600 h-8 w-8 rounded-full flex items-center justify-center text-white font-medium">
//               {typeof comment.author !== "string"
//                 ? comment.author.username[0].toUpperCase()
//                 : "A"}
//             </div>
//             <div>
//               <h3 className="font-medium text-gray-900">
//                 {typeof comment.author !== "string"
//                   ? comment.author.username
//                   : "Anonymous"}
//               </h3>
//               <p className="text-xs text-gray-500">
//                 {formatDateImproved(comment.displayDate.toString())}
//               </p>
//             </div>
//           </div>
//           <div className="flex -space-x-1">
//             <button className="relative p-1.5 hover:bg-gray-50 rounded-full z-10">
//               <EditIcon />
//             </button>
//             <button className="relative p-1.5 hover:bg-gray-50 rounded-full">
//               <DeleteIcon />
//             </button>
//           </div>
//         </div>
//         <div className="prose prose-sm max-w-none pl-11">
//           {paragraphs.map((paragraph, index) => (
//             <p key={index} className="text-gray-600 leading-relaxed">
//               {paragraph.trim()}
//             </p>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export const CommentCardV5 = ({ comment }: Props) => {
//   const paragraphs = comment.text.replace(/\r\n/g, "\n").split(/\n\n+/);

//   return (
//     <div className="flex gap-4 py-4 border-b border-gray-100">
//       <div className="flex-1">
//         <div className="mb-2">
//           <span className="font-medium text-gray-900">
//             {typeof comment.author !== "string"
//               ? comment.author.username
//               : "Anonymous"}
//           </span>
//           <span className="mx-2 text-gray-300">•</span>
//           <span className="text-sm text-gray-500">
//             {formatDateImproved(comment.displayDate.toString())}
//           </span>
//         </div>
//         <div className="space-y-2">
//           {paragraphs.map((paragraph, index) => (
//             <p key={index} className="text-gray-700 leading-relaxed">
//               {paragraph.trim()}
//             </p>
//           ))}
//         </div>
//       </div>
//       <div className="flex flex-col gap-2">
//         <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
//           <EditIcon />
//         </button>
//         <button className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
//           <DeleteIcon />
//         </button>
//       </div>
//     </div>
//   );
// };

// export const CommentCardV6 = ({ comment }: Props) => {
//   const paragraphs = comment.text.replace(/\r\n/g, "\n").split(/\n\n+/);

//   return (
//     <div className="bg-white rounded-xl shadow-sm overflow-hidden">
//       <div className="p-6">
//         <div className="flex items-center gap-3 mb-4">
//           <div className="h-10 w-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-medium">
//             {typeof comment.author !== "string"
//               ? comment.author.username[0].toUpperCase()
//               : "A"}
//           </div>
//           <div>
//             <h3 className="font-medium text-gray-900">
//               {typeof comment.author !== "string"
//                 ? comment.author.username
//                 : "Anonymous"}
//             </h3>
//             <p className="text-sm text-gray-500">
//               {formatDateImproved(comment.displayDate.toString())}
//             </p>
//           </div>
//         </div>
//         <div className="space-y-3">
//           {paragraphs.map((paragraph, index) => (
//             <p key={index} className="text-gray-700 leading-relaxed">
//               {paragraph.trim()}
//             </p>
//           ))}
//         </div>
//       </div>
//       <div className="px-6 py-3 bg-gray-50 flex justify-end gap-2">
//         <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 hover:bg-white rounded-md transition-colors">
//           <EditIcon />
//           <span>Edit</span>
//         </button>
//         <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-white rounded-md transition-colors">
//           <DeleteIcon />
//           <span>Delete</span>
//         </button>
//       </div>
//     </div>
//   );
// };
