// app/routes/spotify.tsx
import { json, LoaderFunction, ActionFunction } from "@remix-run/node";
import { useLoaderData, Form, useActionData } from "@remix-run/react";

type SpotifyTokenResponse = {
  access_token: string;
};

type Artist = {
  name: string;
};

type Track = {
  id: string;
  name: string;
  artists: Artist[];
  duration_ms: number;
  album: {
    release_date: string;
    album_type: string;
    name: string;
    images: { url: string }[];
  };
  external_urls: {
    spotify: string;
  };
};

type PlaylistTrack = {
  track: Track;
};

type LoaderData = {
  accessToken: string;
};

type ActionData = PlaylistTrack[] | { error: string };

export const loader: LoaderFunction = async () => {
  const clientId = "9af521734cb2462f92441df6c7c9dd25";
  const clientSecret = "d2087f4f4daf44ffacf9c1c0d38b3093";

  console.log("clientId", clientId);
  console.log("clientSecret", clientSecret);

  const tokenResponse = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${clientId}:${clientSecret}`
      ).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  const { access_token }: SpotifyTokenResponse = await tokenResponse.json();
  return json<LoaderData>({ accessToken: access_token });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const playlistUrl = formData.get("playlistUrl") as string;
  const accessToken = formData.get("accessToken") as string;

  const playlistId = extractPlaylistId(playlistUrl);
  if (!playlistId) return json<ActionData>({ error: "Invalid playlist URL" });

  try {
    const response = await fetch(
      `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    const data = await response.json();
    return json<ActionData>(data.items || []);
  } catch (error) {
    return json<ActionData>({ error: "Error fetching playlist tracks" });
  }
};

function extractPlaylistId(url: string) {
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/);
  return match ? match[1] : null;
}

export default function SpotifyPlaylistTracks() {
  const { accessToken } = useLoaderData<LoaderData>();
  const actionData = useActionData<ActionData>();

  return (
    <div>
      <h2>Spotify Playlist Tracks</h2>
      <Form method="post">
        <input
          type="text"
          name="playlistUrl"
          placeholder="Enter Spotify playlist URL"
        />
        <input type="hidden" name="accessToken" value={accessToken} />
        <button type="submit">Submit</button>
      </Form>

      {Array.isArray(actionData) && actionData.length > 0 ? (
        <ul>
          {actionData.map((item) => (
            <li key={item.track.id}>
              <p>{item.track.name} </p> by{" "}
              {item.track.artists.map((artist) => artist.name).join(", ")}
              <ul>
                <li>Duration: {item.track.duration_ms} ms</li>
                <li>Release Date: {item.track.album.release_date}</li>
                {item.track.album.album_type !== "single" && (
                  <li>Album: {item.track.album.name}</li>
                )}
                <li>
                  <a href={item.track.external_urls.spotify}>
                    Listen on Spotify
                  </a>
                </li>
              </ul>
              <img
                src={item.track.album.images[0]?.url}
                alt={item.track.name}
              />
            </li>
          ))}
        </ul>
      ) : (
        <p>Enter a playlist URL and click Submit to see tracks.</p>
      )}
      {actionData && !Array.isArray(actionData) && <p>{actionData.error}</p>}
    </div>
  );
}
