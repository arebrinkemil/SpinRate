import { useLoaderData, Form, Link } from "@remix-run/react";
import {
  LoaderFunctionArgs,
  ActionFunctionArgs,
  redirect,
} from "@remix-run/node";
import AverageRating from "~/components/AverageRating";
import { loadReviewData } from "~/utils/reviewLoader";
import {
  handleRatingAction,
  handleReviewAction,
  handleCommentAction,
} from "~/utils/reviewAction";
import { notFound } from "~/http/bad-request";
import RatingForm from "~/components/RatingForm";
import ReviewForm from "~/components/ReviewForm";
import CornerMarkings from "~/components/CornerMarkings";
import ReviewDisplay from "~/components/ReviewDisplay";
import { truncateText } from "~/utils/truncate";
import MobileRatingReviewBar from "~/components/MobileRatingReviewBar";
import FavoriteButton from "~/components/FavoriteButton";
import {
  hasFavorite,
  addFavorite,
  removeFavorite,
} from "~/utils/favoriteLogic";
import { getAuthFromRequest } from "~/auth/auth";

export async function loader({ request, params }: LoaderFunctionArgs) {
  const targetId = String(params.id);
  const targetType = "ALBUM";

  if (!targetId) throw notFound();

  const userId = await getAuthFromRequest(request);

  const isFavorited = userId
    ? await hasFavorite(targetId, userId, "album")
    : false;

  const data = await loadReviewData(request, targetId, targetType);

  return { ...data, isFavorited };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const targetId = String(params.id);
  const targetType = "ALBUM";
  const intent = formData.get("intent");
  const reviewId = String(formData.get("reviewId"));
  const userId = await getAuthFromRequest(request);

  if (!targetId) return new Response("Invalid action", { status: 400 });

  if (intent === "rate") {
    await handleRatingAction(targetId, targetType, formData, request);
    return redirect(`/album/${targetId}`);
  } else if (intent === "review") {
    await handleReviewAction(targetId, targetType, formData, request);
    return redirect(`/album/${targetId}`);
  } else if (intent === "comment") {
    if (!reviewId) return new Response("Invalid action", { status: 400 });
    await handleCommentAction(reviewId, formData, request);
    return redirect(`/album/${targetId}`);
  } else if (intent === "favorite") {
    if (userId) {
      await addFavorite(targetId, userId, targetType.toLowerCase() as "album");
    } else {
      return new Response("User not authenticated", { status: 401 });
    }
    return redirect(`/album/${targetId}`);
  } else if (intent === "unfavorite") {
    if (userId) {
      await removeFavorite(
        targetId,
        userId,
        targetType.toLowerCase() as "album"
      );
    } else {
      return new Response("User not authenticated", { status: 401 });
    }
    return redirect(`/album/${targetId}`);
  }

  return new Response("Invalid action", { status: 400 });
}

function formatDuration(durationMs: number): string {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default function Album() {
  const {
    targetData,
    hasRated,
    unverifiedAverage,
    verifiedAverage,
    reviews,
    verified,
    isFavorited,
  } = useLoaderData<typeof loader>();

  return (
    <div>
      <h1 className="mx-4 text-3xl">Album</h1>

      <div className="m-4 flex flex-col justify-between md:m-8">
        <div className="hidden flex-row gap-4 md:flex">
          <div className="w-96 shrink">
            <CornerMarkings mediaType="ALBUM" className="" hoverEffect={true}>
              <img
                className="aspect-square object-cover"
                src={targetData.imageUrl ?? ""}
                alt={targetData.name}
              />
            </CornerMarkings>
          </div>

          <div className="flex basis-3/4 flex-row justify-between">
            <div className="flex flex-col">
              <h2>{targetData.name ?? "Artist Name not found"}</h2>
              <Link to={`/artist/${targetData.artistId}`}>
                <h3>{targetData.artist.name ?? "Artist Name not found"}</h3>
              </Link>
              <p>
                Release Date:{" "}
                {targetData.releaseDate
                  ? new Date(targetData.releaseDate).toISOString().split("T")[0]
                  : "Release Date not found"}
              </p>
              <FavoriteButton
                targetId={targetData.id}
                targetType="ALBUM"
                isFavorite={!!isFavorited}
                verified={verified}
              />
            </div>
            <div className="flex flex-row gap-4 items-center w-1/4 justify-end">
              <div className="flex flex-col h-full">
                <AverageRating
                  type="VERIFIED"
                  averageRating={verifiedAverage}
                />
                <h6>VERIFIED </h6>
              </div>
              <div className="flex flex-col h-full">
                <AverageRating
                  type="PUBLIC"
                  averageRating={unverifiedAverage}
                />
                <h6>PUBLIC </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden md:block">
          <h1 className="mx-4 text-3xl">Songs</h1>

          <CornerMarkings mediaType="SONG" className="mx-4" hoverEffect={false}>
            {targetData.songs.map((song: any) => (
              <Link to={`/song/${song.id}`} key={song.id}>
                <li className="hover:bg-lightsilver dark:bg-darkgray  mx-4 flex flex-row items-center justify-between px-2 py-2">
                  <p>{song.name}</p>
                  <div className="flex gap-4">
                    <p>{formatDuration(song.duration)}</p>
                  </div>
                </li>
              </Link>
            ))}
          </CornerMarkings>
        </div>

        <div className="flex flex-col md:hidden">
          <div className="flex w-full gap-4">
            <div className="shrink basis-2/5">
              <CornerMarkings mediaType="ALBUM" className="" hoverEffect={true}>
                <img
                  className="aspect-square object-cover"
                  src={targetData.imageUrl ?? ""}
                  alt={targetData.name}
                />
              </CornerMarkings>
            </div>

            <div className="flex basis-3/5 flex-row justify-between">
              <div className="flex flex-col">
                <h2>{targetData.name ?? "Artist Name not found"}</h2>
                <Link to={`/artist/${targetData.artistId}`}>
                  <h3>{targetData.artist.name ?? "Artist Name not found"}</h3>
                </Link>

                <p>
                  Release Date:{" "}
                  {targetData.releaseDate
                    ? new Date(targetData.releaseDate)
                        .toISOString()
                        .split("T")[0]
                    : "Release Date not found"}
                </p>
                <FavoriteButton
                  targetId={targetData.id}
                  targetType="ALBUM"
                  isFavorite={!!isFavorited}
                  verified={verified}
                />
              </div>
            </div>
          </div>
          <div className="flex w-full flex-row h-64">
            <div className="flex flex-col h-full w-full items-center">
              <AverageRating type="VERIFIED" averageRating={verifiedAverage} />
              <h6>VERIFIED </h6>
            </div>
            <div className="flex flex-col h-full w-full items-center">
              <AverageRating type="PUBLIC" averageRating={unverifiedAverage} />
              <h6>PUBLIC </h6>
            </div>
          </div>
          <h1 className="mx-4 text-3xl">Songs</h1>
          <CornerMarkings mediaType="SONG" className="" hoverEffect={false}>
            {targetData.songs.map((song: any) => (
              <Link to={`/song/${song.id}`} key={song.id}>
                <li className="hover:bg-lightsilver dark:bg-darkgray   flex flex-row items-center justify-between px-2 py-2">
                  <p>{song.name}</p>
                  <div className="flex gap-4">
                    <p>{formatDuration(song.duration)}</p>
                  </div>
                </li>
              </Link>
            ))}
          </CornerMarkings>
        </div>

        <div className="flex w-full flex-col gap-4 md:flex-row">
          <div className="basis-1/2 ">
            <div className=" mb-8 hidden w-full basis-1/2 justify-center md:flex">
              <RatingForm
                targetId={targetData.id}
                targetType="ALBUM"
                hasRated={hasRated}
              />
            </div>
          </div>
          <div className="basis-1/2">
            <div className="flex w-full flex-col justify-center md:mx-4">
              <div className="hidden flex-col md:flex">
                <h3 className="text-platinum mb-10 md:text-black dark:text-silver">
                  Leave a review
                </h3>

                {verified ? (
                  <ReviewForm targetId={targetData.id} targetType="ALBUM" />
                ) : (
                  <p>
                    Please <Link to="/login">login</Link> to leave a review.
                  </p>
                )}

                <h2>Reviews</h2>
              </div>
              <ul className="mb-12 flex basis-1/2 flex-col md:mb-0">
                <h3 className="text-xl underline">Reviews</h3>
                {reviews.map((review) => (
                  <ReviewDisplay key={review.id} review={review} />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
      <MobileRatingReviewBar
        targetId={targetData.id}
        targetType="ALBUM"
        hasRated={hasRated}
        verified={verified}
      />
    </div>
  );
}
