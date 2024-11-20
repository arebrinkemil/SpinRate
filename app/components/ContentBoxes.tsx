import React from "react";
import { Album, Song, Artist } from "@prisma/client";
import AverageRating from "./AverageRating";
import CornerMarkings from "./CornerMarkings";
import { Link } from "@remix-run/react";
import { truncateText } from "~/utils/truncate";
import { json } from "stream/consumers";

interface AlbumBoxProps {
  album: Album & {
    verifiedAverage: number;
    unverifiedAverage: number;
    artist: { name: string };
  };
}

interface SongBoxProps {
  song: Song & {
    verifiedAverage: number;
    unverifiedAverage: number;
    artist: { name: string };
  };
}

interface ArtistBoxProps {
  artist: Artist & { verifiedAverage: number; unverifiedAverage: number };
}

export function AlbumBox({
  album,
  className,
}: AlbumBoxProps & { className?: string }) {
  if (!album || !album.name) {
    return null;
  }

  return (
    <Link to={`/album/${album.id}`} key={album.id} className={className}>
      <CornerMarkings
        mediaType="ALBUM"
        className="aspect-square"
        hoverEffect={true}
      >
        <li className="bg-lightsilver dark:bg-darkgray flex h-full w-full flex-col p-2 pr-0 lg:p-4">
          <div className="flex h-4/6 w-full flex-row">
            <img
              src={album.imageUrl ?? ""}
              alt={album.name}
              className="h-full w-4/6 object-cover"
            />
            <div className="flex h-full w-2/6 flex-row items-center justify-center">
              <AverageRating
                type="VERIFIED"
                className=" text-white"
                averageRating={album.verifiedAverage}
              />
              <AverageRating
                type="PUBLIC"
                className=" text-white"
                averageRating={album.unverifiedAverage}
              />
            </div>
          </div>
          <div className="hidden lg:block">
            {album.name.length > 15 ? (
              <h2 className="group relative mr-4 overflow-hidden whitespace-nowrap text-xl 2xl:text-3xl text-black dark:text-silver">
                <span className="group-hover:animate-marquee block">
                  {album.name}
                </span>
              </h2>
            ) : (
              <h2 className="mr-4 text-xl text-black dark:text-silver">
                {album.name}
              </h2>
            )}

            {album.artist?.name && album.artist.name.length > 15 ? (
              <p className="group relative  mr-4 overflow-hidden whitespace-nowrap text-base text-black dark:text-silver md:text-lg">
                <span className="group-hover:animate-marquee block">
                  {album.artist.name}
                </span>
              </p>
            ) : (
              <p className="mr-4 text-base text-black dark:text-silver md:text-lg">
                {album.artist?.name}
              </p>
            )}
          </div>
          <div className="block lg:hidden">
            <h2 className="text-base leading-none md:text-lg">
              {truncateText(album.name, 24)}
            </h2>
            <p className="text-base leading-none text-black dark:text-silver md:text-lg">
              {truncateText(album.artist?.name ?? "", 12)}
            </p>
          </div>
        </li>
      </CornerMarkings>
    </Link>
  );
}

export function SongBox({ song }: SongBoxProps) {
  if (!song || !song.name) {
    return null;
  }
  return (
    <Link to={`/song/${song.id}`} key={song.id}>
      <CornerMarkings
        mediaType="SONG"
        className="aspect-square"
        hoverEffect={true}
      >
        <li className="bg-lightsilver dark:bg-darkgray  flex h-full w-full flex-col p-2 pr-0 lg:p-4">
          <div className="flex h-4/6 w-full flex-row">
            <img
              src={song.imageUrl ?? ""}
              alt={song.name}
              className="h-full w-4/6 object-cover"
            />
            <div className="flex h-full w-2/6 flex-row items-center justify-center">
              <AverageRating
                type="VERIFIED"
                className=" text-white"
                averageRating={song.verifiedAverage}
              />
              <AverageRating
                type="PUBLIC"
                className=" text-white"
                averageRating={song.unverifiedAverage}
              />
            </div>
          </div>
          <div className="hidden lg:block">
            {song.name.length > 15 ? (
              <h2 className="group relative mr-4 overflow-hidden whitespace-nowrap text-base text-black dark:text-silver md:text-lg">
                <span className="group-hover:animate-marquee block">
                  {song.name}
                </span>
              </h2>
            ) : (
              <h2 className="mr-4 text-base md:text-lg">{song.name}</h2>
            )}

            {song.artist?.name && song.artist.name.length > 15 ? (
              <p className="group relative mr-4 overflow-hidden whitespace-nowrap text-base text-black dark:text-silver md:text-lg">
                <span className="group-hover:animate-marquee block">
                  {song.artist.name}
                </span>
              </p>
            ) : (
              <p className="mr-4 text-base text-black dark:text-silver md:text-lg">
                {song.artist?.name}
              </p>
            )}
          </div>
          <div className="block lg:hidden">
            <h2 className="text-base leading-none md:text-lg">
              {truncateText(song.name, 20)}
            </h2>
            <p className="text-base leading-none text-black dark:text-silver md:text-lg">
              {truncateText(song.artist?.name ?? "", 12)}
            </p>
          </div>
        </li>
      </CornerMarkings>
    </Link>
  );
}

export function ArtistBox({ artist }: ArtistBoxProps) {
  if (!artist || !artist.name) {
    return null;
  }
  return (
    <Link to={`/artist/${artist.id}`} key={artist.id}>
      <CornerMarkings
        mediaType="ARTIST"
        className="aspect-square"
        hoverEffect={true}
      >
        <li className="bg-lightsilver dark:bg-darkgray  flex h-full w-full flex-col p-2 pr-0 lg:p-4">
          <div className="flex h-4/6 w-full flex-row">
            <img
              src={artist.imageUrl ?? ""}
              alt={artist.name}
              className="h-full w-4/6 object-cover"
            />
            <div className="flex h-full w-2/6 flex-row items-center justify-center">
              <AverageRating
                type="VERIFIED"
                className=" text-white"
                averageRating={artist.verifiedAverage}
              />
              <AverageRating
                type="PUBLIC"
                className=" text-white"
                averageRating={artist.unverifiedAverage}
              />
            </div>
          </div>

          <div className="hidden lg:block">
            {artist.name && artist.name.length > 15 ? (
              <h2 className="group relative mr-4 overflow-hidden whitespace-nowrap text-xl text-black dark:text-silver">
                <span className="group-hover:animate-marquee block">
                  {artist.name}
                </span>
              </h2>
            ) : (
              <h2 className="mr-4 text-xl text-black dark:text-silver">
                {artist.name}
              </h2>
            )}
          </div>
          <div className="block lg:hidden">
            <h2 className="text-xl text-black dark:text-silver">
              {artist.name}
            </h2>
          </div>
        </li>
      </CornerMarkings>
    </Link>
  );
}

export function HighlightBox({
  item,
  mediaType,
}: {
  item: any;
  mediaType: string;
}) {
  if (!item) {
    return null;
  }

  return (
    <div className="col-span-2 row-span-1 bg-black lg:col-span-3 lg:row-span-1 2xl:col-span-4 2xl:row-span-2">
      <div className="flex h-full flex-col p-4">
        <h1 className=" font-bold text-white">{item.header}</h1>
        <p className="text-white lg:max-2xl:hidden">{item.bodyText}</p>
        <div className="hidden h-full flex-col justify-center 2xl:flex">
          <div className="flex flex-row space-x-4">
            {item.highlightIDs.map((highlight: any) => (
              <Link
                key={highlight.id}
                to={`/${highlight.mediaType.toLowerCase()}/${highlight.id}`}
              >
                {highlight.imageUrl && (
                  <img
                    src={highlight.imageUrl}
                    alt={highlight.name}
                    className="aspect-square"
                  />
                )}
                <p className="font-bold text-white">{highlight.name}</p>
                {highlight.artist ? (
                  <p className="text-white">{highlight.artist.name}</p>
                ) : (
                  <p className="text-white">{highlight.artistName}</p>
                )}
              </Link>
            ))}
          </div>
        </div>
        <div className="hidden flex-row space-x-4 lg:flex 2xl:hidden">
          {item.highlightIDs.map((highlight: any) => (
            <Link
              key={highlight.id}
              to={`/${highlight.mediaType.toLowerCase()}/${highlight.id}`}
              className="relative aspect-square"
            >
              {highlight.imageUrl && (
                <img
                  src={highlight.imageUrl}
                  alt={highlight.name}
                  className="h-full w-full object-cover"
                />
              )}
              <div className="bg-silver absolute bottom-0 w-full">
                <p className="font-bold text-black ">{highlight.name}</p>
                <p className="text-black ">
                  {highlight.artist
                    ? highlight.artist.name
                    : highlight.artistName}
                </p>
              </div>
            </Link>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4 lg:hidden">
          {item.highlightIDs.map((highlight: any) => (
            <Link
              key={highlight.id}
              to={`/${highlight.mediaType.toLowerCase()}/${highlight.id}`}
              className="relative aspect-square"
            >
              {highlight.imageUrl && (
                <img
                  src={highlight.imageUrl}
                  alt={highlight.name}
                  className="h-full w-full object-cover"
                />
              )}
              <div className="bg-silver absolute bottom-0 w-full p-2">
                <p className="font-bold text-black ">{highlight.name}</p>
                <p className="text-black ">
                  {highlight.artist
                    ? highlight.artist.name
                    : highlight.artistName}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function RatingBox({
  rating,
  type,
}: {
  rating: any;
  type: "ALBUM" | "SONG" | "ARTIST";
}) {
  if (!rating || !rating.data) {
    return null;
  }
  const item = rating.data;
  return (
    <Link to={`/${type.toLowerCase()}/${item.id}`} key={item.id}>
      <CornerMarkings
        mediaType={rating.type}
        className="aspect-square"
        hoverEffect={true}
      >
        <li className="bg-lightsilver dark:bg-darkgray  flex h-full w-full flex-col p-2 pr-0 lg:p-4">
          <div className="flex h-4/6 w-full flex-row">
            <img
              src={item.imageUrl ?? ""}
              alt={item.name}
              className="h-full w-4/6 object-cover"
            />
            <div className="flex h-full w-2/6 flex-col items-center justify-center">
              <AverageRating
                type="VERIFIED"
                className="text-white"
                averageRating={rating.ratingValue}
              />
            </div>
          </div>
          <div className="hidden lg:block">
            {item.name.length > 15 ? (
              <h2 className="group relative mr-4 overflow-hidden whitespace-nowrap text-xl text-black dark:text-silver">
                <span className="group-hover:animate-marquee block">
                  {item.name}
                </span>
              </h2>
            ) : (
              <h2 className="mr-4 text-xl text-black dark:text-silver">
                {item.name}
              </h2>
            )}
            {item.artist?.name && item.artist.name.length > 15 ? (
              <p className="group relative mr-4 overflow-hidden whitespace-nowrap text-base text-black dark:text-silver md:text-lg">
                <span className="group-hover:animate-marquee block">
                  {item.artist.name}
                </span>
              </p>
            ) : item.artist?.name ? (
              <p className="mr-4 text-base text-black dark:text-silver md:text-lg">
                {item.artist.name}
              </p>
            ) : null}
          </div>
          <div className="block lg:hidden">
            <h2 className="text-base leading-none md:text-lg">
              {truncateText(item.name, 24)}
            </h2>
            {item.artist?.name && (
              <p className="text-base leading-none text-black dark:text-silver md:text-lg">
                {truncateText(item.artist.name, 12)}
              </p>
            )}
          </div>
        </li>
      </CornerMarkings>
    </Link>
  );
}

export function ReviewBox({
  review,
  type,
}: {
  review: any;
  type: "ALBUM" | "SONG" | "ARTIST";
}) {
  const item = review.data;

  if (!item) {
    return null;
  }
  return (
    <Link
      to={`/${type.toLowerCase()}/${item.id}`}
      key={item.id}
      className="col-span-2 row-span-2"
    >
      <CornerMarkings
        mediaType={review.type}
        className="aspect-square"
        hoverEffect={true}
      >
        <li className="bg-lightsilver dark:bg-darkgray  flex h-full w-full flex-col p-2 pr-0 lg:p-4">
          <div className="flex h-4/6 w-full flex-row">
            <img
              src={item.imageUrl ?? ""}
              alt={item.name}
              className="h-full w-4/6 object-cover"
            />
          </div>
          <div className="hidden lg:block">
            {item.name.length > 15 ? (
              <h2 className="group relative mr-4 overflow-hidden whitespace-nowrap text-xl text-black dark:text-silver">
                <span className="group-hover:animate-marquee block">
                  {item.name}
                </span>
              </h2>
            ) : (
              <h2 className="mr-4 text-xl text-black dark:text-silver">
                {item.name}
              </h2>
            )}
            {item.artist?.name && item.artist.name.length > 15 ? (
              <p className="group relative mr-4 overflow-hidden whitespace-nowrap text-base text-black dark:text-silver md:text-lg">
                <span className="group-hover:animate-marquee block">
                  {item.artist.name}
                </span>
              </p>
            ) : item.artist?.name ? (
              <p className="mr-4 text-base text-black dark:text-silver md:text-lg">
                {item.artist.name}
              </p>
            ) : null}
          </div>
          <div className="block lg:hidden">
            <h2 className="text-base leading-none md:text-lg">
              {truncateText(item.name, 24)}
            </h2>
            {item.artist?.name && (
              <p className="text-base leading-none text-black dark:text-silver md:text-lg">
                {truncateText(item.artist.name, 12)}
              </p>
            )}
          </div>
          <div className="flex h-full flex-col">
            <h3 className="text-black dark:text-silver">Review</h3>
            <p className=" text-black dark:text-silver">
              {truncateText(review.reviewValue, 50)}
            </p>
          </div>
        </li>
      </CornerMarkings>
    </Link>
  );
}

interface FavoriteBoxProps {
  item: any;
  type: "ALBUM" | "SONG" | "ARTIST";
}

export function FavoriteBox({ item, type }: FavoriteBoxProps) {
  if (!item) {
    return null;
  }

  const mediaItem = item[type.toLowerCase()];

  if (!mediaItem) {
    return null;
  }

  return (
    <Link
      to={`/${type.toLowerCase()}/${mediaItem.id}`}
      key={mediaItem.id}
      className="col-span-1 row-span-1"
    >
      <CornerMarkings
        mediaType={type}
        className="aspect-square"
        hoverEffect={true}
      >
        <li className="bg-lightsilver dark:bg-darkgray  flex h-full w-full flex-col p-2 pr-0 lg:p-4">
          <div className="flex h-4/6 w-full flex-row">
            <img
              src={mediaItem.imageUrl ?? ""}
              alt={mediaItem.name}
              className="h-full w-4/6 object-cover"
            />
          </div>
          <div className="hidden lg:block">
            {mediaItem.name.length > 15 ? (
              <h2 className="group relative mr-4 overflow-hidden whitespace-nowrap text-xl text-black dark:text-silver">
                <span className="group-hover:animate-marquee block">
                  {mediaItem.name}
                </span>
              </h2>
            ) : (
              <h2 className="mr-4 text-xl text-black dark:text-silver">
                {mediaItem.name}
              </h2>
            )}
            {mediaItem.artist?.name && mediaItem.artist.name.length > 15 ? (
              <p className="group relative mr-4 overflow-hidden whitespace-nowrap text-base text-black dark:text-silver md:text-lg">
                <span className="group-hover:animate-marquee block">
                  {mediaItem.artist.name}
                </span>
              </p>
            ) : mediaItem.artist?.name ? (
              <p className="mr-4 text-base text-black dark:text-silver md:text-lg">
                {mediaItem.artist.name}
              </p>
            ) : null}
          </div>
          <div className="block lg:hidden">
            <h2 className="text-base leading-none md:text-lg">
              {truncateText(mediaItem.name, 24)}
            </h2>
            {mediaItem.artist?.name && (
              <p className="text-base leading-none text-black dark:text-silver md:text-lg">
                {truncateText(mediaItem.artist.name, 12)}
              </p>
            )}
          </div>
        </li>
      </CornerMarkings>
    </Link>
  );
}
