import { ContentModel } from "@/app/model/content";

export const getSectionItem = async (slug: string) => {
  // const { slug } = req.params;

  try {
    const content = await ContentModel.findOne({ slug: slug }).lean(); // `.lean()` for faster execution since we might re-query

    if (!content) {
      return null;
      // return res.status(404).json({ message: "Item not found" });
    }

    switch (content.contentType) {
      case "Collection":
        const populatedContent = await ContentModel.findOne({
          slug: slug,
        }).populate("artworks");
        return populatedContent;
      //   return res.status(200).json(populatedContent);
      case "Article":
        const populatedArticle = await ContentModel.findOne({
          slug: slug,
        });
        //! .populate("author");
        // ? issue with user model not created yet
        return populatedArticle;
      //   return res.status(200).json(populatedArticle);
      default:
        return content;
      //   return res.status(200).json(content);
    }
  } catch (error) {
    console.error("Error fetching content: ", error);
    //   res.status(500).json({ message: error.message });
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
