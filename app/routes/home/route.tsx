import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link, MetaFunction } from "@remix-run/react";
import { useState } from "react";
import {
  getAlbumData,
  getSongData,
  getArtistData,
  getStatsFromData,
} from "~/utils/queries";
import { getAverageRating } from "~/utils/ratingLogic";
import {
  AlbumBox,
  SongBox,
  ArtistBox,
  HighlightBox,
} from "~/components/ContentBoxes";
import { client } from "~/sanity/client";
import { SanityDocument } from "@sanity/client";
import { Button } from "@nextui-org/react";
import Aotd from "~/components/Aotd";
import Banner from "~/components/Banner";

export const meta: MetaFunction = () => {
  return [{ title: "SPINRATE" }];
};

type LoaderData = {
  statsFromData: {
    songs: number;
    albums: number;
    artists: number;
    reviews: number;
  };
  data: any[];
  sanityData: SanityDocument[];
  bannerData: SanityDocument[];
};

const POSTS_QUERY = `*[_type == "featuredContent"]{
  _id,
  _createdAt,
  songs,
  artists,
  albums
}
`;

const BANNER_QUERY = `*[_type == "banner"]{
  mainImage{
    asset->{
      _id,
      url
    },
    hotspot
  },
  smallImages[]{
    asset->{
      _id,
      url
    }
  },
  header,
  textColor,
  bodyText,
  links[]{
    text,
    url
  }
}
`;

const HIGHLIGHT_QUERY = `*[_type == "highlight"]{
 
  header,
  bodyText,
  highlightIDs[]{
    text,
    id,
    type
  }
}
`;

function shuffleArray<T>(array: T[] = []): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

type HighlightID = {
  text: string;
  url: string | null;
  type: "ALBUM" | "ARTIST" | "SONG";
};

type Highlight = {
  header: string;
  bodyText: string;
  highlightIDs: HighlightID[];
};

export const loader: LoaderFunction = async ({ request }) => {
  console.log("we got the data");

  const sanityData = await client.fetch<SanityDocument[]>(POSTS_QUERY);
  const bannerData = await client.fetch<SanityDocument[]>(BANNER_QUERY);
  const highlightedContent = await client.fetch<Highlight[]>(HIGHLIGHT_QUERY);

  const albumsWithRatings = await Promise.all(
    sanityData
      .flatMap((doc) => doc.albums ?? [])
      .map(async (id) => {
        const album = await getAlbumData(id);
        const { verifiedAverage, unverifiedAverage } = await getAverageRating(
          id,
          "ALBUM"
        );
        return { ...album, verifiedAverage, unverifiedAverage, type: "album" };
      })
  );

  const songsWithRatings = await Promise.all(
    sanityData
      .flatMap((doc) => doc.songs ?? [])
      .map(async (id) => {
        const song = await getSongData(id);
        const { verifiedAverage, unverifiedAverage } = await getAverageRating(
          id,
          "SONG"
        );
        return { ...song, verifiedAverage, unverifiedAverage, type: "song" };
      })
  );

  const artistsWithRatings = await Promise.all(
    sanityData
      .flatMap((doc) => doc.artists ?? [])
      .map(async (id) => {
        const artist = await getArtistData(id);
        const { verifiedAverage, unverifiedAverage } = await getAverageRating(
          id,
          "ARTIST"
        );
        return {
          ...artist,
          verifiedAverage,
          unverifiedAverage,
          type: "artist",
        };
      })
  );

  const highlightsWithDetails = await Promise.all(
    highlightedContent.map(async (highlight) => {
      const detailedHighlights = await Promise.all(
        highlight.highlightIDs.map(async (highlightID) => {
          if (highlightID.type.toUpperCase() === "ALBUM") {
            return highlightID.text
              ? await getAlbumData(highlightID.text)
              : highlightID;
          }
          if (highlightID.type.toUpperCase() === "SONG") {
            return highlightID.text
              ? await getSongData(highlightID.text)
              : highlightID;
          }
          if (highlightID.type.toUpperCase() === "ARTIST") {
            return highlightID.text
              ? await getArtistData(highlightID.text)
              : highlightID;
          }
          return highlightID;
        })
      );

      return { ...highlight, highlightIDs: detailedHighlights };
    })
  );

  const combinedData = shuffleArray([
    ...albumsWithRatings,
    ...songsWithRatings,
    ...artistsWithRatings,
  ]);

  let insertIndex = 6;
  highlightsWithDetails.forEach((highlight) => {
    combinedData.splice(insertIndex, 0, {
      ...highlight,
      verifiedAverage: null,
      unverifiedAverage: null,
      type: "highlight",
      id: highlight.header,
    });
    insertIndex += 12;
  });

  const statsFromData = await getStatsFromData();

  return json<LoaderData>({
    statsFromData,
    data: combinedData,
    sanityData,
    bannerData,
  });
};

export default function Home() {
  const { statsFromData, data, sanityData, bannerData } =
    useLoaderData<LoaderData>();

  const [filter, setFilter] = useState<
    "all" | "album" | "song" | "artist" | "highlight"
  >("all");

  const filteredData = data.filter((item) => {
    if (filter === "all") return true;
    return item.type === filter;
  });

  console.log(filteredData);

  return (
    <div className="w-full overflow-x-clip">
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <Banner data={statsFromData} />
      </div>
      <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw]">
        <Aotd data={bannerData[0]} />
      </div>

      <div className="sticky top-[4rem] z-20 bg-silver dark:bg-black w-screen px-0">
        <div className="flex flex-col-reverse items-center justify-between lg:flex-row pr-8">
          <div className="mb-1 flex space-x-1 lg:mb-4 lg:space-x-4 pl-8 pt-4">
            <Button
              radius="none"
              onClick={() => setFilter("all")}
              className={`px-4 py-2 underline decoration-black dark:decoration-silver decoration-4 ${
                filter === "all" ? "bg-gray-800 text-white" : "bg-gray-200"
              }`}
            >
              <h5>ALL</h5>
            </Button>
            <Button
              radius="none"
              onClick={() => setFilter("album")}
              className={`decoration-hallon px-4 py-2 underline decoration-4 ${
                filter === "album" ? "text-hallon bg-gray-800" : "bg-gray-200"
              }`}
            >
              <h5>ALBUMS</h5>
            </Button>
            <Button
              radius="none"
              onClick={() => setFilter("song")}
              className={`decoration-blue px-4 py-2 underline decoration-4 ${
                filter === "song" ? "text-blue bg-gray-800" : "bg-gray-200"
              }`}
            >
              <h5>SONGS</h5>
            </Button>
            <Button
              radius="none"
              onClick={() => setFilter("artist")}
              className={`decoration-orange px-4 py-2 underline decoration-4 ${
                filter === "artist" ? "text-orange bg-gray-800" : "bg-gray-200"
              }`}
            >
              <h5>ARTISTS</h5>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-flow-row-dense grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-4 2xl:grid-cols-6  md:px-4 lg:px-10">
        {filteredData.map((item) => {
          console.log(item);

          if (item.type === "album") {
            return (
              <AlbumBox
                key={item.id}
                album={item}
                className="col-span-1 row-span-1 lg:col-span-2 lg:row-span-2 xl:col-span-2 xl:row-span-2"
              />
            );
          }
          if (item.type === "song") {
            return <SongBox key={item.id} song={item} />;
          }
          if (item.type === "artist") {
            return <ArtistBox key={item.id} artist={item} />;
          }
          if (item.type === "highlight") {
            return (
              <HighlightBox
                key={item.id}
                item={item}
                mediaType={item.highlightIDs[0].type}
              />
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}
