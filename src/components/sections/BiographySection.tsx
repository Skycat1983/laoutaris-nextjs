import ButtonDivider from "../atoms/ButtonDivider";
import HorizontalDivider from "../atoms/HorizontalDivider";
import SectionHeading from "../atoms/SectionHeading";
import BiographyCard from "../cards/biographyCard/BiographyCard";

const BiographySection = () => {
  const biographyEntries = [
    {
      title: "Early Years",
      subheading: "Life in Cairo; the roots of his passion",
      to: "/biography/early-years",
      url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713361077/artwork/mv4jqdtm2dki3cdkxmwe.jpg",
    },
    {
      title: "Meeting Beryl",
      subheading: "Artistic Support: A Partnership of Principles",
      to: "/biography/meeting-beryl",
      url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1714031333/artwork/ew7dr3stgdh03j4t0bma.jpg",
    },
    {
      title: "Ethos & Technique",
      subheading: "Old-Fashioned in a New World",
      to: "/biography/ethos-technique",

      url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713361256/artwork/tdg3bdta3qafjwvavqie.jpg",
    },

    {
      title: "Later Years",
      subheading: "A Legacy of Love",
      to: "/biography/later-years",
      url: "https://res.cloudinary.com/dzncmfirr/image/upload/v1713360313/artwork/e27oevvokbriq3dio1al.jpg",
    },
  ];

  return (
    <>
      <SectionHeading
        heading="Biography:"
        subheading="Read my grandfather's story"
      />
      <HorizontalDivider />

      <section className="grid grid-cols-4 grid-rows-2 w-full py-8 gap-5">
        {biographyEntries.map((artwork, index) => (
          <div key={index} className="relative row-span-1 col-span-1 h-64">
            <BiographyCard entry={artwork} key={index} />
          </div>
        ))}
      </section>
      <ButtonDivider label="Read more" link="/biography" />
    </>
  );
};

export default BiographySection;
