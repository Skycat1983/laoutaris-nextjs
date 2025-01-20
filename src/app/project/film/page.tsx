export default function Film() {
  const videoAspectRatio = {
    paddingBottom: "56.25%",
  };
  return (
    <main className="flex  flex-col items-start justify-between px-24">
      {/* <div className="w-screen absolute left-0 h-[80%] xl:h-[520px] z-negative"></div> */}

      <section className="relative my-10">
        <div className="grid grid-cols-2 lg:grid-cols-3 items-center h-full">
          <div className="col-span-3 xl:col-span-2">
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
          </div>
          <div className="col-span-3 xl:col-span-1 z-1 mx-10 my-8 xl:my-4">
            <div className="ml-10 border-l border-black border-l-4">
              <h1 className="text-black z-1 font-archivo bold text-3xl text-left ml-8">
                The life, ethos & regrets of Joseph Laoutaris
              </h1>
            </div>
            <div className="ml-10">
              <h3 className="font-archivo text-xl text-left mx-10 text-gray-600 my-10">
                A short film about my grandfather
              </h3>
            </div>
            <div className="ml-10">
              <h3 className="font-archivo text-xl text-left mx-10 text-gray-800 my-10">
                By Heron Laoutaris
              </h3>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 grid-rows-2 w-full py-0 gap-5"></div>
      </section>
      <article className="prose-xl text-left p-24 bg-white">
        <h1 className="m-2 leading-8 prose-lg py-2">
          Please excuse the poor quality picture. As you can probably tell,
          I&apos;m not a film maker. Consequently I had no access to decent
          equipment. This was all filmed on an iPhone 5 and, as such, i&apos;d
          not recommend watching in full screen mode as the poor resolution
          becomes more jarring.
        </h1>
      </article>
    </main>
  );
}
