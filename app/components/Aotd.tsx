import { Link } from "@remix-run/react";
import { useRef } from "react";

import { motion, useInView } from "framer-motion";

import CornerMarkings from "./CornerMarkings";

export default function Aotd({ data }: { data: any }) {
  const textColor =
    data.textColor === "black" ? "text-black dark:text-silver" : "text-white";
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const words = ["ALBUM", "OF", "THE", "DAY!"];

  return (
    <>
      <div className="block sm:hidden col-span-2 row-span-2 max-h-full bg-black dark:bg-silver text-white py-4">
        <Link to={data.links.url ?? "#"} className="pointer">
          <div className="grid grid-cols-1 grid-rows-auto h-full max-h-full w-full items-stretch px-4 gap-4">
            <div className="row-span-1">
              <CornerMarkings mediaType="ALBUM" className="w-full h-full">
                <img
                  src={data.mainImage.asset.url}
                  alt={data.header}
                  className="w-full h-full object-cover rounded-md"
                />
              </CornerMarkings>
            </div>

            <div className="row-span-1 flex flex-col justify-end">
              <h2 className="text-2xl dark:text-black">{data.header}</h2>
              <p className="text-sm dark:text-black">{data.bodyText}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {data.links.map((link: any) => (
                  <p key={link.text} className="hover:underline text-sm">
                    {link.text}
                  </p>
                ))}
              </div>
            </div>

            <div className="row-span-1 flex flex-col justify-center">
              {words.map((word, index) => (
                <motion.h1
                  key={word}
                  className="text-hallon w-full text-right text-5xl leading-none"
                  initial={{ x: "100%" }}
                  animate={isInView ? { x: "100%" } : { x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.2,
                    ease: "easeInOut",
                  }}
                >
                  {word}
                </motion.h1>
              ))}
            </div>
          </div>
        </Link>
      </div>

      <div className="hidden sm:block xl:hidden col-span-2 row-span-2 max-h-full bg-black dark:bg-silver content-center w-full text-white lg:col-span-4 lg:row-span-4 py-4">
        <Link to={data.links.url ?? "#"} className="pointer">
          <div className="grid grid-cols-4 grid-rows-auto h-full max-h-full w-full items-stretch px-8 gap-4 max-w-[900px] mx-auto">
            <div className="col-span-4 row-span-1">
              <CornerMarkings mediaType="ALBUM" className="w-full h-full">
                <img
                  src={data.mainImage.asset.url}
                  alt={data.header}
                  className="w-full h-full object-cover"
                />
              </CornerMarkings>
            </div>

            <div className="col-span-2 row-span-1 flex flex-col justify-end px-4">
              <h2 className="text-3xl dark:text-black">{data.header}</h2>
              <p className="text-md dark:text-black">{data.bodyText}</p>
              <div className="flex flex-row gap-4 mt-2">
                {data.links.map((link: any) => (
                  <p key={link.text} className="hover:underline text-sm">
                    {link.text}
                  </p>
                ))}
              </div>
            </div>

            <div className="col-span-2 row-span-1 flex flex-col justify-center">
              {words.map((word, index) => (
                <motion.h1
                  key={word}
                  className="text-hallon w-full text-right text-6xl leading-none"
                  initial={{ x: "100%" }}
                  animate={isInView ? { x: "100%" } : { x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.2,
                    ease: "easeInOut",
                  }}
                >
                  {word}
                </motion.h1>
              ))}
            </div>
          </div>
        </Link>
      </div>

      <div className="hidden xl:block col-span-2 row-span-2 max-h-full bg-black dark:bg-silver text-white lg:col-span-4 lg:row-span-4 2xl:col-span-6 2xl:row-span-6 py-4">
        <Link to={data.links.url ?? "#"} className="pointer">
          <div className="grid grid-cols-4 grid-rows-1 h-full max-h-full w-full items-stretch px-8">
            <div className="col-span-1 row-span-1">
              <CornerMarkings mediaType="ALBUM" className="w-full h-full">
                <img
                  src={data.mainImage.asset.url}
                  alt={data.header}
                  className="w-full h-full object-cover"
                />
              </CornerMarkings>
            </div>

            <div className="col-span-2 row-span-1 flex flex-col justify-end px-4">
              <h2 className="text-4xl dark:text-black">{data.header}</h2>
              <p className="text-lg dark:text-black">{data.bodyText}</p>
              <div className="flex flex-row gap-4">
                {data.links.map((link: any) => (
                  <p key={link.text} className="hover:underline">
                    {link.text}
                  </p>
                ))}
              </div>
            </div>

            <div className="col-span-1 row-span-1 flex flex-col justify-center">
              {words.map((word, index) => (
                <motion.h1
                  key={word}
                  className="text-hallon w-full text-right text-8xl leading-none"
                  initial={{ x: "100%" }}
                  animate={isInView ? { x: "100%" } : { x: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.2,
                    ease: "easeInOut",
                  }}
                >
                  {word}
                </motion.h1>
              ))}
            </div>
          </div>
        </Link>
      </div>
    </>
  );
}
