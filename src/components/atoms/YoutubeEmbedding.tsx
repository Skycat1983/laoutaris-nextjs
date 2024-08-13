const videoAspectRatio = {
  paddingBottom: "56.25%",
};

const YoutubeEmbedding = () => (
  <div className="relative w-full" style={videoAspectRatio}>
    <iframe
      className="absolute top-0 left-0 w-full h-full"
      src="https://www.youtube.com/embed/6ynF2gO-J30?rel=0"
      title="YouTube video player"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  </div>
);

export default YoutubeEmbedding;
