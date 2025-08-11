import React from "react";
import { sectionPadding, containerStyle, headingStyle } from "../theme";

export default function FashionShowVideo() {
  const youtubeEmbedId = "nOCNygftDPk"; // Extracted from your Shorts URL

  return (
    <section className={`${sectionPadding} ${containerStyle} text-center`}>
      <h2 className={`${headingStyle} mb-6`}>Experience Our Latest Fashion Show</h2>
      <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-xl shadow-lg">
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-xl"
          src={`https://www.youtube.com/embed/${youtubeEmbedId}?autoplay=1&mute=1&loop=1&playlist=${youtubeEmbedId}`}
          title="Fashion Show Video"
          frameBorder="0"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
    </section>
  );
}
