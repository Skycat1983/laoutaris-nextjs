import ButtonDivider from "../atoms/ButtonDivider";
import HorizontalDivider from "../atoms/HorizontalDivider";
import SectionHeading from "../atoms/SectionHeading";

const ArtworkSection = () => {
  const artworks = [
    {
      label: "Latest",
      url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713361219/artwork/sp1r7xxdcphbno8f8b8n.jpg",
    },
    {
      label: "Featured",
      url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713982473/artwork/i5vhhp7td38kmzr9mlqu.jpg",
    },
    {
      label: "Popular",
      url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713359591/artwork/x4h3u351cpxrlxo8bkib.jpg",
    },

    {
      label: "Semi-Abstract",
      url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713361367/artwork/oipyhryrov7znzgddacj.jpg",
    },

    {
      label: "Abstract",
      url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713361331/artwork/k3xip7zky2hig2fucx3s.jpg",
    },
    {
      label: "Figurative",
      url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713982410/artwork/i9aejlyxcchyvamyhrvf.jpg",
    },
  ];

  return (
    <>
      <SectionHeading heading="Artwork:" subheading="Browse his life's work" />
      <HorizontalDivider />

      <section className="p-4 grid grid-cols-1 grid-rows-6 sm:grid-cols-2 sm:grid-rows-3 lg:grid-cols-3 lg:grid-rows-2 w-full py-8 gap-5">
        {artworks.map((artwork, index) => (
          <div key={index} className="relative row-span-1 col-span-1 h-64">
            <img
              src={artwork.url}
              alt={artwork.label}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-4xl font-fancy">
                {artwork.label}
              </span>
            </div>
          </div>
        ))}
      </section>
      <ButtonDivider label={"See more"} link="/artwork" />
    </>
  );
};

export default ArtworkSection;
