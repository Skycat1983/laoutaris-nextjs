"use client";

import React, { useState } from "react";

const ArtistProfile = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <h1 className="px-4 py-6 text-2xl font-bold">About the artist</h1>

      <div className="relative">
        <div
          className={`space-y-4 text-base text-gray-800 px-4 ${
            isExpanded ? "" : "line-clamp-4"
          }`}
        >
          <p>
            Joseph Laoutaris was a passionate and eccentric artist who dedicated
            his life to painting in isolation. Critically acclaimed in the
            1950s, he was invited by Victor Musgrave to exhibit at Gallery One,
            while Lillian Browse offered him a one-man show at the prestigious
            Rowland, Browse and Delbanco Gallery in London.
          </p>
          <p>
            Further invitations followed, most notably from Bryan Robertson
            during his tenure as director of the Whitechapel Gallery. However,
            deeply uncomfortable in the company of others and rejecting emerging
            artistic trends, Joseph shunned all opportunities to promote his
            work. Instead, he chose to live as a hermit, tirelessly working from
            within his London apartment.
          </p>
          <p>
            Joseph cared not for fame, money, or approval. Instead, he focused
            on refining his technique, alone and in secret, supported by his
            wife, who tragically took her own life 17 years ago. Joseph
            Laoutaris passed away in 2022, leaving behind a legacy defined by
            his unwavering dedication to his art.
          </p>
        </div>
        {!isExpanded && (
          // <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-full pointer-events-none"></div>
        )}
      </div>
      <div className="w-full flex justify-center p-4 ">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="p-2 mt-2 text-black hover:underline subheading w-full border"
        >
          {isExpanded ? "Read Less" : "Read More"}
        </button>
      </div>
    </>
  );
};

export default ArtistProfile;

// const ArtistProfile = () => {
//   return (
//     <div>
//       <p>
//         Joseph Laoutaris was a passionate and eccentric artist who dedicated his
//         life to painting in isolation. Critically acclaimed in the 1950s, he was
//         invited by Victor Musgrave to exhibit at Gallery One, while Lillian
//         Browse offered him a one-man show at the prestigious Rowland, Browse and
//         Delbanco Gallery in London.
//       </p>
//       <p>
//         Further invitations followed, most notably from Bryan Robertson during
//         his tenure as director of the Whitechapel Gallery. However, deeply
//         uncomfortable in the company of others and rejecting emerging artistic
//         trends, Joseph shunned all opportunities to promote his work. Instead,
//         he chose to live as a hermit, tirelessly working from within his London
//         apartment.
//       </p>
//       <p>
//         Joseph cared not for fame, money, or approval. Instead, he focused on
//         refining his technique, alone and in secret, supported by his wife, who
//         tragically took her own life 17 years ago. Joseph Laoutaris passed away
//         in 2022, leaving behind a legacy defined by his unwavering dedication to
//         his art.
//       </p>
//     </div>
//   );
// };

// export default ArtistProfile;
