// app/routes/spotify.tsx
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";
import {
  findOrCreateArtist,
  findOrCreateAlbum,
  findOrCreateSong,
  getCollectedSongs,
  getArtistSongs,
  getArtists,
} from "./queries";

type LoaderData = {
  accessToken: string;
  playlistTracks: any[];
  collectedSongs: any[];
  getArtistsData: any[];
  artistSongs: { [key: string]: any[] };
};

async function getAccessToken() {
  const clientId = "9af521734cb2462f92441df6c7c9dd25";
  const clientSecret = "d2087f4f4daf44ffacf9c1c0d38b3093";

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
export const loader: LoaderFunction = async () => {
  const accessToken = await getAccessToken();
  const playlistId = "5uxoGDLtXIygC6pphI9Qsn";
  const playlistTracks = await fetchPlaylistTracks(playlistId, accessToken);
  const collectedSongs = await getCollectedSongs();
  const getArtistsData = await getArtists();

  const artistSongs: { [key: string]: any[] } = {};
  for (const artist of getArtistsData) {
    artistSongs[artist.id] = await getArtistSongs(artist.id);
  }

  return json<LoaderData>({
    accessToken,
    playlistTracks,
    collectedSongs,
    getArtistsData,
    artistSongs,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const accessToken = formData.get("accessToken") as string;
  const playlistTracks = JSON.parse(formData.get("playlistTracks") as string);

  for (const item of playlistTracks) {
    const track = item.track;
    const artistNames = track.artists.map((artist: any) => artist.name);

    const artistIds = [];
    for (const name of artistNames) {
      const artist = await findOrCreateArtist(name);
      artistIds.push(artist.id);
    }

    const albumName = track.album.name;
    if (track.album.album_type !== "single") {
      const album = await findOrCreateAlbum(
        albumName,
        artistIds[0],
        accessToken,
        track.album.release_date,
        track.album.album_type,
        track.album.external_urls.spotify,
        track.album.id
      );
      await findOrCreateSong(
        track.name,
        artistIds[0],
        album.id,
        track.duration_ms,
        track.album.release_date,
        track.external_urls.spotify,
        track.album.images[0].url
      );
    } else {
      await findOrCreateSong(
        track.name,
        artistIds[0],
        null,
        track.duration_ms,
        track.album.release_date,
        track.external_urls.spotify,
        track.album.images[0].url
      );
    }
  }

  return json({ success: true });
};

export default function SpotifyPlaylistTracks() {
  const {
    accessToken,
    playlistTracks,
    collectedSongs,
    getArtistsData,
    artistSongs,
  } = useLoaderData<LoaderData>();
  const actionData = useActionData<{ success: boolean }>();

  return (
    <div>
      <h2>Spotify Playlist Tracks</h2>
      <Form method="post">
        <input type="hidden" name="accessToken" value={accessToken} />
        <input
          type="hidden"
          name="playlistTracks"
          value={JSON.stringify(playlistTracks)}
        />
        <button type="submit">Process Playlist</button>
      </Form>
      {actionData?.success && (
        <p>Playlist processed and saved to the database!</p>
      )}

      <div>
        <h3>Artists</h3>
        <ul className="grid grid-cols-3 gap-4">
          {getArtistsData.map((artist: any) => (
            <li className="bg-slate-600" key={artist.id}>
              <h1 className="text-2xl text-white">{artist.name}</h1>
              <ul className="grid grid-cols-2 gap-2">
                {artistSongs[artist.id].map((song: any) => (
                  <li
                    className="flex flex-row items-center gap-5 bg-slate-800 p-2 text-white"
                    key={song.id}
                  >
                    {song.name} by {song.artist}
                    <img
                      className="w-10 h-10 "
                      src={song.imageUrl}
                      alt={song.name}
                    />
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
