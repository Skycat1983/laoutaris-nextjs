import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ArtistProfile from "@/components/atoms/ArtistProfile";
import HorizontalDivider from "@/components/atoms/HorizontalDivider";
import SubscribeForm from "@/components/ui/forms/SubscribeForm";
import ServerPagination from "@/components/ui/serverPagination/ServerPagination";
import { IFrontendUser } from "@/lib/client/types/userTypes";
import { UserModel } from "@/lib/server/models";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

interface ArtworkPaginationLink {
  id: string;
  imageData: {
    secure_url: string;
    pixelHeight: number;
    pixelWidth: number;
  };
}

export default async function CollectionLayout({
  params,

  children,
}: {
  children: React.ReactNode;
  params: { collectionSlug: string };
}) {
  // await dbConnect();
  // console.log("collectionSlug", params.collectionSlug);
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !session.user.email) {
    redirect("http://localhost:3000");
  }

  // if (!!session && session.user && session.user.email) {
  const user = (await UserModel.findOne({ email: session.user.email })
    .populate("favourites")
    .lean()) as IFrontendUser;

  if (!user || !user.favourites) {
    redirect("http://localhost:3000");
  }

  const convertToPaginationLink = (artwork: any): ArtworkPaginationLink => {
    return {
      id: artwork.id,
      imageData: {
        secure_url: artwork.image.secure_url,
        pixelHeight: artwork.image.pixelHeight,
        pixelWidth: artwork.image.pixelWidth,
      },
    };
  };

  const artworkLinks = user.favourites.map((artwork) =>
    convertToPaginationLink(artwork)
  );

  console.log("user :>> ", user);
  // } else {
  //   redirect("http://localhost:3000");
  // }

  //   const artworkLinks = user.favourites;

  return (
    <section className="">
      {children}
      <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <h1 className="px-4 py-6 text-2xl font-bold">
        More from this collection
      </h1>
      {artworkLinks && (
        <ServerPagination
          artworkLinks={artworkLinks}
          collectionSlug={params.collectionSlug}
        />
      )}
      <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <h1 className="px-4 py-6 text-2xl font-bold">About this collection</h1>
      <p className="px-4 text-primary">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Est quo eius
        ipsa exercitationem deleniti eligendi sint nisi consequatur quaerat ut.
        Nesciunt quaerat aliquam nobis alias libero repellendus ducimus. Ea
        dolores aliquam soluta dolorem voluptatibus quasi impedit minus, beatae
        quaerat id dignissimos veritatis, nemo laborum, vel molestiae et fuga
        libero ab?
      </p>
      <div className="px-4 py-8">
        <HorizontalDivider />
      </div>
      <div className="bg-slate-800/10 w-full">
        <ArtistProfile />
      </div>
      <div className="px-4 py-4">
        <HorizontalDivider />
      </div>
      <div className="px-4">
        <h1 className=" py-6 text-2xl font-bold">Subscribe for updates</h1>
        <SubscribeForm />
      </div>
      <div className="px-4 py-4">
        <HorizontalDivider />
      </div>
    </section>
  );
}
