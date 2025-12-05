import type { VercelRequest, VercelResponse } from '@vercel/node';

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: 'grant_type=client_credentials',
  });

  const data = await response.json();
  return data.access_token;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { id, include } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Artist ID is required' });
  }

  try {
    const token = await getAccessToken();
    const market = 'US';
    
    // Fetch artist details
    const artistResponse = await fetch(
      `https://api.spotify.com/v1/artists/${id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (!artistResponse.ok) {
      const error = await artistResponse.text();
      return res.status(artistResponse.status).json({ error: 'Spotify API error', details: error });
    }

    const artist = await artistResponse.json();

    // Optionally fetch top tracks and albums
    if (include === 'full') {
      const [topTracksRes, albumsRes] = await Promise.all([
        fetch(`https://api.spotify.com/v1/artists/${id}/top-tracks?market=${market}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`https://api.spotify.com/v1/artists/${id}/albums?market=${market}&limit=20&include_groups=album,single`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const topTracks = await topTracksRes.json();
      const albums = await albumsRes.json();

      return res.status(200).json({
        ...artist,
        topTracks: topTracks.tracks || [],
        albums: albums.items || [],
      });
    }

    return res.status(200).json(artist);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
