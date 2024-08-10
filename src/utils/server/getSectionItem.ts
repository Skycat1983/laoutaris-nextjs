import { ArticleModel, IArticle } from "@/app/models/experimental/article";
import { ContentModel } from "@/app/models/experimental/baseContent";
import {
  CollectionModel,
  ICollection,
} from "@/app/models/experimental/collection";
export const getSectionItem = async (slug: string) => {
  try {
    const content = await ContentModel.findOne({ slug }).lean().exec();

    if (!content) {
      return null;
    }

    switch (content.contentType) {
      case "Collection":
        const populatedCollection = (await CollectionModel.findOne({ slug })
          .populate("artworks")
          .lean()
          .exec()) as ICollection;
        return populatedCollection;

      case "Article":
        const populatedArticle = (await ArticleModel.findOne({ slug })
          .populate("author")
          .lean()
          .exec()) as IArticle;
        return populatedArticle;

      default:
        return content;
    }
  } catch (error) {
    console.error("Error fetching content: ", error);
    return null;
  }
};

// export const getSectionItem = async (req, res) => {
//     const { slug } = req.params;

//     try {
//       const content = await BaseModel.findOne({ slug: slug }).lean(); // `.lean()` for faster execution since we might re-query

//       if (!content) {
//         return res.status(404).json({ message: "Item not found" });
//       }

//       switch (content.contentType) {
//         case "Collection":
//           const populatedContent = await BaseModel.findOne({
//             slug: slug,
//           }).populate("artworks");
//           return res.status(200).json(populatedContent);
//         case "Article":
//           const populatedArticle = await BaseModel.findOne({
//             slug: slug,
//           }).populate("author");
//           return res.status(200).json(populatedArticle);
//         default:
//           return res.status(200).json(content);
//       }
//     } catch (error) {
//       console.error("Error fetching content: ", error);
//       res.status(500).json({ message: error.message });
//     }
//   };
