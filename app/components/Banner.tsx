import { Link } from "@remix-run/react";

import { motion } from "framer-motion";
import CornerMarkings from "./CornerMarkings";
import { Button } from "@nextui-org/react";

export default function Banner({ data }: { data: any }) {
  return (
    <div className="w-full h-[70vh] flex flex-col justify-center items-center dark:bg-black text-black dark:text-white text-center">
      <div className="w-full flex flex-col xl:flex-row justify-center">
        <h1 className="text-6xl md:text-8xl font-bold uppercase hover:text-blue">
          Rate,
        </h1>
        <h1 className="text-6xl md:text-8xl font-bold uppercase hover:text-orange">
          Review,
        </h1>
        <h1 className="text-6xl md:text-8xl font-bold uppercase hover:text-hallon">
          Discover.
        </h1>
      </div>

      <p className="text-lg md:text-2xl mt-4 mx-2">
        The home for music ratings and reviews.
      </p>

      <div className="grid grid-cols-2 gap-4 my-8 text-lg md:text-xl">
        <div>
          <span className="font-bold block text-blue">Songs</span>
          {data.songs}
        </div>
        <div>
          <span className="font-bold block text-hallon">Albums</span>
          {data.albums}
        </div>
        <div>
          <span className="font-bold block text-orange">Artists</span>
          {data.artists}
        </div>
        <div>
          <span className="font-bold block">Reviews</span>
          {data.reviews}
        </div>
      </div>

      <div className="mt-8">
        <Link to="/signup">
          <Button
            radius="none"
            className="text-lg font-semibold bg-transparent rounded-none"
          >
            SIGN UP
          </Button>
        </Link>
      </div>
    </div>
  );
}

{
  /* {data.mainImage &&
            data.mainImage.asset &&
            data.mainImage.asset.url ? (
              <CornerMarkings
                mediaType="ALBUM"
                className="h-full aspect-square basis-1/4"
              >
                <img
                  src={data.mainImage.asset.url}
                  alt={data.header}
                  className="h-full w-full aspect-square"
                />
              </CornerMarkings>
            ) : (
              <div className="h-1/4 w-1/4 bg-gray-500"></div>
            )} */
}
