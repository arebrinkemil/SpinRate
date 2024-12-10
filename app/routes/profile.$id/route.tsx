import { Form, useLoaderData } from "@remix-run/react";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json, type ActionFunctionArgs, redirect } from "@remix-run/node";
import { requireAuthCookie } from "~/auth/auth";
import { getUserData, getUserRatings, updateUserData } from "./queries";
import { getUserReviews } from "~/utils/reviewLogic";
import type { Account, Favorite } from "@prisma/client";
import type { Album, Song, Artist, Review } from "@prisma/client";
import CornerMarkings from "~/components/CornerMarkings";
import { RatingBox, ReviewBox, FavoriteBox } from "~/components/ContentBoxes";
import { useDisclosure } from "@nextui-org/react";
import { getFavorites } from "~/utils/favoriteLogic";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";

type RatingData =
  | {
      kind: "rating";
      type: "ALBUM";
      data: Album;
      ratingValue: number;
      id: string;
    }
  | {
      kind: "rating";
      type: "SONG";
      data: Song;
      ratingValue: number;
      id: string;
    }
  | {
      kind: "rating";
      type: "ARTIST";
      data: Artist;
      ratingValue: number;
      id: string;
    };

type ReviewData =
  | {
      kind: "review";
      type: "ALBUM";
      data: Album;
      reviewValue: string;
      id: string;
    }
  | {
      kind: "review";
      type: "SONG";
      data: Song;
      reviewValue: string;
      id: string;
    }
  | {
      kind: "review";
      type: "ARTIST";
      data: Artist;
      reviewValue: string;
      id: string;
    };

function shuffleArray<T>(array: T[] = []): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export async function loader({ request, params }: LoaderFunctionArgs) {
  const accountId = await requireAuthCookie(request);
  const userId = String(params.id);

  if (!params.id) throw new Response("User not found", { status: 404 });

  const user = await getUserData(userId);
  if (!user) throw new Response("User not found", { status: 404 });

  const ratings = await getUserRatings(userId);
  const reviews = await getUserReviews(userId);
  const favorites = await getFavorites(userId);

  const combinedData = shuffleArray([...ratings, ...reviews]);

  const isOwner = accountId === userId;

  return { user, isOwner, combinedData, favorites };
}

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const userId = String(params.id);

  const newUserData = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    firstName: formData.get("firstName") as string,
    lastName: formData.get("lastName") as string,
    description: formData.get("description") as string,
    profileImageUrl: formData.get("profileImageUrl") as string,
  };

  await updateUserData(userId, newUserData);

  return redirect(`/profile/${userId}`);
}

export default function Profile() {
  const { user, isOwner, combinedData, favorites } = useLoaderData<{
    user: Account;
    isOwner: boolean;
    combinedData: (RatingData | ReviewData)[];
    favorites: any[];
  }>();

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div className="m-4 flex flex-col gap-10 md:m-10">
      <CornerMarkings
        mediaType="DEFAULT"
        hoverEffect={false}
        className=" hidden flex-row justify-between md:flex "
      >
        <div className="flex flex-col">
          <h1>USERNAME: {user.username}</h1>
          <h2>MAIL: {user.email}</h2>
          <p>
            FIRSTNAME: {user.firstName} <br /> LASTNAME: {user.lastName}
          </p>
          <p>DESCRIPTION: {user.description}</p>
          {isOwner && (
            <>
              <Button
                onPress={onOpen}
                className=" bg-blue w-full rounded-none md:w-1/4"
              >
                Edit Profile
              </Button>
              <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                className="bg-lightsilver dark:bg-darkgray  rounded-none"
                radius="none"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Edit Profile
                      </ModalHeader>
                      <ModalBody>
                        <Form method="post" className="flex flex-col gap-4">
                          <Input
                            label="Username"
                            name="username"
                            defaultValue={user.username}
                            variant="bordered"
                            radius="none"
                          />
                          <Input
                            label="Email"
                            name="email"
                            defaultValue={user.email}
                            variant="bordered"
                            radius="none"
                          />
                          <Input
                            label="First Name"
                            name="firstName"
                            defaultValue={user.firstName ?? ""}
                            variant="bordered"
                            radius="none"
                          />
                          <Input
                            label="Last Name"
                            name="lastName"
                            defaultValue={user.lastName ?? ""}
                            variant="bordered"
                            radius="none"
                          />
                          <Input
                            label="Description"
                            name="description"
                            defaultValue={user.description ?? ""}
                            variant="bordered"
                            radius="none"
                          />
                          <Input
                            label="Profile Image URL"
                            name="profileImageUrl"
                            defaultValue={user.profileImageUrl ?? ""}
                            variant="bordered"
                            radius="none"
                          />
                          <Button
                            className="bg-hallon text-white"
                            radius="none"
                            onPress={onClose}
                          >
                            Close
                          </Button>
                          <Button
                            className="bg-blue text-white"
                            radius="none"
                            type="submit"
                          >
                            Save Changes
                          </Button>
                        </Form>
                      </ModalBody>
                      <ModalFooter />
                    </>
                  )}
                </ModalContent>
              </Modal>
            </>
          )}
        </div>
        {user.profileImageUrl && (
          <img
            className="w-1/3"
            src={user.profileImageUrl}
            alt={user.username}
          />
        )}
      </CornerMarkings>

      <div className=" flex flex-row justify-between md:hidden ">
        <div className="flex flex-col">
          <CornerMarkings
            className="mb-2 flex flex-col"
            hoverEffect={false}
            mediaType="DEFAULT"
          >
            <div className="flex flex-row">
              {user.profileImageUrl && (
                <img
                  className="w-1/3"
                  src={user.profileImageUrl}
                  alt={user.username}
                />
              )}
              <div className="px-2">
                <h4>{user.username}</h4>
                <h5>{user.email}</h5>
                <p>
                  {user.firstName} {user.lastName}
                </p>
              </div>
            </div>
            <p>{user.description}</p>
          </CornerMarkings>
          {isOwner && (
            <>
              <Button
                onPress={onOpen}
                className=" bg-blue w-full rounded-none md:w-1/4"
              >
                Edit Profile
              </Button>
              <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                placement="top-center"
                className="bg-lightsilver dark:bg-darkgray  rounded-none"
                radius="none"
              >
                <ModalContent>
                  {(onClose) => (
                    <>
                      <ModalHeader className="flex flex-col gap-1">
                        Edit Profile
                      </ModalHeader>
                      <ModalBody>
                        <Form method="post" className="flex flex-col gap-4">
                          <Input
                            label="Username"
                            name="username"
                            defaultValue={user.username}
                            variant="bordered"
                            radius="none"
                          />
                          <Input
                            label="Email"
                            name="email"
                            defaultValue={user.email}
                            variant="bordered"
                            radius="none"
                          />
                          <Input
                            label="First Name"
                            name="firstName"
                            defaultValue={user.firstName ?? ""}
                            variant="bordered"
                            radius="none"
                          />
                          <Input
                            label="Last Name"
                            name="lastName"
                            defaultValue={user.lastName ?? ""}
                            variant="bordered"
                            radius="none"
                          />
                          <Input
                            label="Description"
                            name="description"
                            defaultValue={user.description ?? ""}
                            variant="bordered"
                            radius="none"
                          />
                          <Input
                            label="Profile Image URL"
                            name="profileImageUrl"
                            defaultValue={user.profileImageUrl ?? ""}
                            variant="bordered"
                            radius="none"
                          />

                          <Button
                            className="bg-hallon text-white"
                            radius="none"
                            onPress={onClose}
                          >
                            Close
                          </Button>
                          <Button
                            className="bg-blue text-white"
                            radius="none"
                            type="submit"
                          >
                            Save Changes
                          </Button>
                        </Form>
                      </ModalBody>
                      <ModalFooter />
                    </>
                  )}
                </ModalContent>
              </Modal>
            </>
          )}
        </div>
      </div>

      {(isOwner && <h1 className="text-3xl">Your favorites</h1>) || (
        <h1 className="text-3xl">{user.username} favorites</h1>
      )}

      <div className="grid grid-flow-row-dense grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-4 2xl:grid-cols-6">
        {favorites.slice(0, 5).map((item) => {
          const uniqueKey = `${item.id}`;

          if (item.type === "song") {
            return <FavoriteBox key={uniqueKey} item={item} type={item.type} />;
          }

          if (item.type === "album") {
            return <FavoriteBox key={uniqueKey} item={item} type={item.type} />;
          }

          if (item.type === "artist") {
            return <FavoriteBox key={uniqueKey} item={item} type={item.type} />;
          }

          return null;
        })}
      </div>

      {(isOwner && <h1 className="text-3xl">Your Ratings and Reviews</h1>) || (
        <h1 className="text-3xl">Ratings and Reviews</h1>
      )}

      <div className="grid grid-flow-row-dense grid-cols-2 gap-2 md:grid-cols-2 lg:grid-cols-4 lg:gap-4 2xl:grid-cols-6">
        {combinedData.map((item) => {
          const uniqueKey = `${item.kind}-${item.data.id}`;

          if (item.kind === "rating") {
            return <RatingBox key={uniqueKey} rating={item} type={item.type} />;
          }

          if (item.kind === "review") {
            return <ReviewBox key={uniqueKey} review={item} type={item.type} />;
          }

          return null;
        })}
      </div>
    </div>
  );
}
