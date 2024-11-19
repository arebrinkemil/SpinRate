import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import {
  useLoaderData,
  useFetcher,
  Form,
  useActionData,
  Link,
} from "@remix-run/react";
import { requireAuthCookie } from "~/auth/auth";
import AverageRating from "../../components/AverageRating";
import {
  findOrCreateArtist,
  findOrCreateAlbum,
  findOrCreateSong,
  getCollectedSongs,
  getArtistSongs,
  getArtists,
} from "./queries";
import { getAverageRating } from "~/utils/ratingLogic";
import { truncateText } from "~/utils/truncate";
import CornerMarkings from "~/components/CornerMarkings";
import { useEffect, useState } from "react";
import { Button } from "@nextui-org/react";

type LoaderData = {
  accessToken: string;
  playlistTracks: any[];
  collectedSongs: any[];
  getArtistsData: any[];
  artistSongs: { [key: string]: any[] };
  ratings: { [key: string]: number | null };
  hasMore: boolean;
};

async function getAccessToken() {
  //Ids have been renewed and the old ones are no longer valid ;)
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

async function fetchPlaylistTracks(playlistId: string, accessToken: string) {
  const response = await fetch(
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );
  const data = await response.json();
  return data.items;
}

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireAuthCookie(request);
  const accessToken = await getAccessToken();

  const playlistId = "4Dp9GntziqpMwIs1oAoMUC";

  let playlistTracks = [];
  if (playlistId) {
    playlistTracks = await fetchPlaylistTracks(playlistId, accessToken);
  }

  const url = new URL(request.url);
  const offset = parseInt(url.searchParams.get("offset") || "0", 10);
  const limit = 10;

  const collectedSongs = await getCollectedSongs();
  const getArtistsData = await getArtists(offset, limit);

  const artistSongs: { [key: string]: any[] } = {};
  const ratings: { [key: string]: number | null } = {};

  await Promise.all(
    getArtistsData.map(async (artist) => {
      const songs = await getArtistSongs(artist.id);
      artistSongs[artist.id] = songs;

      await Promise.all(
        songs.map(async (song) => {
          const averageRating = await getAverageRating(song.id, "SONG");
          ratings[song.id] = averageRating.verifiedAverage;
        })
      );
    })
  );

  return json<LoaderData>({
    accessToken,
    playlistTracks,
    collectedSongs,
    getArtistsData,
    artistSongs,
    ratings,
    hasMore: getArtistsData.length === limit,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const accessToken = formData.get("accessToken") as string;
  const playlistId = formData.get("playlistId") as string;
  const addAlbum = formData.get("addFromAlbum") as string;

  const playlistTracks = await fetchPlaylistTracks(playlistId, accessToken);

  for (const item of playlistTracks) {
    const track = item.track;
    const artistSpotifyId = track.artists.map((artist: any) => artist.id);

    const artistIds = [];
    for (const id of artistSpotifyId) {
      const artist = await findOrCreateArtist(id, accessToken);
      artistIds.push(artist.id);
    }

    const albumName = track.album.name;
    const artistName = track.artists[0].name;

    if (track.album.album_type !== "single" && addAlbum) {
      const album = await findOrCreateAlbum(
        albumName,
        artistIds[0],
        accessToken,
        track.album.release_date,
        track.album.album_type,
        track.album.external_urls.spotify,
        track.album.id,
        track.album.images[0].url
      );

      await findOrCreateSong(
        track.id,
        track.name,
        artistIds[0],
        album.id,
        track.duration_ms,
        track.album.release_date,
        track.external_urls.spotify,
        track.album.images[0].url,
        artistName
      );
    } else {
      await findOrCreateSong(
        track.id,
        track.name,
        artistIds[0],
        "single",
        track.duration_ms,
        track.album.release_date,
        track.external_urls.spotify,
        track.album.images[0].url,
        artistName
      );
    }
  }

  return json({ success: true });
};

function formatDuration(durationMs: number): string {
  const minutes = Math.floor(durationMs / 60000);
  const seconds = Math.floor((durationMs % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

export default function SpotifyPlaylistTracks() {
  const {
    accessToken,
    playlistTracks,
    collectedSongs,
    getArtistsData,
    artistSongs: initialArtistSongs,
    ratings,
    hasMore,
  } = useLoaderData<LoaderData>();

  const fetcher = useFetcher();
  const [artists, setArtists] = useState(getArtistsData);
  const [artistSongs, setArtistSongs] = useState(initialArtistSongs);
  const [loading, setLoading] = useState(false);

  const loadMore = () => {
    setLoading(true);
    const offset = artists.length;
    fetcher.load(`/admin?offset=${offset}&limit=10`);
  };

  useEffect(() => {
    if (fetcher.data) {
      setArtists((prev) => [
        ...prev,
        ...(fetcher.data as LoaderData).getArtistsData,
      ]);
      setArtistSongs((prev) => ({
        ...prev,
        ...(fetcher.data as LoaderData).artistSongs,
      }));
      setLoading(false);
    }
  }, [fetcher.data]);

  return (
    <div className="px-10">
      <h1 className="text-2xl">Add songs to database</h1>
      <Form method="post">
        <div className="flex flex-col">
          <div className="flex flex-row">
            <label htmlFor="playlistId">Enter Spotify Playlist ID:</label>
            <input type="text" name="playlistId" id="playlistId" required />
          </div>
          <label>
            <input type="checkbox" name="addFromAlbum" value="true" /> Add all
            songs from related albums
          </label>
          <input type="hidden" name="accessToken" value={accessToken} />
          <input
            type="hidden"
            name="playlistTracks"
            value={JSON.stringify(playlistTracks)}
          />
          <CornerMarkings mediaType="DEFAULT" hoverEffect={false} className="">
            <Button radius="none" className="p-2" type="submit">
              PROCESS PLAYLIST
            </Button>
          </CornerMarkings>
        </div>
      </Form>

      <div>
        <h3>Artists</h3>
        <div className="grid gap-4">
          {artists.map((artist: any) => (
            <div key={artist.id} className="hidden flex-row gap-4 md:flex">
              <div className="w-96 shrink">
                <CornerMarkings
                  mediaType="ARTIST"
                  className=""
                  hoverEffect={true}
                >
                  <img
                    className="aspect-square object-cover"
                    src={artist.imageUrl ?? ""}
                    alt={artist.name}
                  />
                </CornerMarkings>
              </div>
              <div className="flex basis-3/4 flex-col">
                <h2>{artist.name ?? "Artist Name not found"}</h2>
                <Link to={`/artist/${artist.id}`}>
                  <h3>{artist.name ?? "Artist Name not found"}</h3>
                </Link>
                <div>
                  <h4 className="mt-4 text-lg">Songs</h4>
                  <ul>
                    {artistSongs[artist.id]?.map((song: any) => (
                      <Link to={`/song/${song.id}`} key={song.id}>
                        <li className="hover:bg-lightsilver dark:bg-darkgray  my-2 flex flex-row items-center justify-between px-2 py-2">
                          <p>{truncateText(song.name, 20)}</p>
                          <p>{formatDuration(song.duration)}</p>
                        </li>
                      </Link>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
        {hasMore && (
          <div className="mt-4 text-center">
            <button
              onClick={loadMore}
              disabled={loading}
              className="rounded bg-blue-500 px-4 py-2 text-white"
            >
              {loading ? "Loading..." : "Load More"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
