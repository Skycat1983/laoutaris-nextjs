import { ContentModel } from "@/app/models/content/baseContent";

export const getSectionContent = async (section: string) => {
  console.log("getting section content for", section);
  try {
    const content = await ContentModel.find({ section: section });
    return content;
  } catch (error) {
    console.log("error :>> ", error);
  }
};

// export const getSectionContent = async (req, res) => {
//     const { section } = req.params;
//     console.log("getting section content for", section);
//     try {
//       const content = await BaseModel.find({ section: section });
//       console.log("content in getSectionContent :>> ", content);
//       res.status(200).json(content);
//     } catch (error) {
//       res.status(404).json({ message: error.message });
//     }
//   };
