type YoutubeEmbeddingProps = {
  videoId: string;
};

const videoAspectRatio = {
  paddingBottom: "56.25%",
};

const YoutubeEmbedding = ({ videoId }: YoutubeEmbeddingProps) => {
  if (!videoId) {
    console.log("Missing videoId in YoutubeEmbedding component");
    return null;
  }

  return (
    <div className="relative w-full" style={videoAspectRatio}>
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}?rel=0`}
        title="YouTube video player"
        allow="autoplay"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
};

export default YoutubeEmbedding;
