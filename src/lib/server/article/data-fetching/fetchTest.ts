import { headers } from "next/headers";

//   const url = `http://localhost:3000/api/test`;
//   const response = await fetch(url, {
//     method: "GET",
//     headers: headers(),
//   });

export const fetchTest = async () => {
  const response = {
    success: true,
    data: [
      {
        _id: "664893f0823f45cf9d3495af",
        title: "Early Years",
        subtitle: "First Encounters with Art",
        imageUrl:
          "https://res.cloudinary.com/dzncmfirr/image/upload/v1713361077/artwork/mv4jqdtm2dki3cdkxmwe.jpg",
        slug: "early-years",
      },
      {
        _id: "66489a63ab497e6f2ecca058",
        title: "Meeting Beryl",
        subtitle: "Legacy of Love and Loss",
        imageUrl:
          "https://res.cloudinary.com/dzncmfirr/image/upload/v1713982689/artwork/xexbkermnflwwz3ubdtm.jpg",
        slug: "meeting-beryl",
      },
      {
        _id: "6648af1cab497e6f2ecca092",
        title: "Later Years",
        subtitle: "Resignation and Disappointment",
        imageUrl:
          "https://res.cloudinary.com/dzncmfirr/image/upload/v1713358358/artwork/lfvalatlv33x5sghnbky.jpg",
        slug: "later-years",
      },
      {
        _id: "66c4c8de721b32fdcc34e28e",
        title: "Ethos",
        subtitle: "Old-Fashioned in a New World",
        imageUrl:
          "https://res.cloudinary.com/dzncmfirr/image/upload/v1713361219/artwork/sp1r7xxdcphbno8f8b8n.jpg",
        slug: "ethos",
      },
      {
        _id: "66584dfe2768ac3db7c249d2",
        title: "Obituary",
        subtitle: "Joseph Laoutaris: 1935 - 2022",
        imageUrl:
          "https://res.cloudinary.com/dzncmfirr/image/upload/v1713360414/artwork/fvcsx991quwdwnqdb2va.jpg",
        slug: "obituary",
      },
    ],
    statusCode: 200,
  };
  return response;
};
