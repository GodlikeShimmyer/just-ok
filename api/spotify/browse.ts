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

  const { endpoint } = req.query;

  if (!endpoint) {
    return res.status(400).json({ error: 'Endpoint parameter is required' });
  }

  try {
    const token = await getAccessToken();
    
    let url = '';
    const market = 'US';
    
    switch (endpoint) {
      case 'new-releases':
        url = `https://api.spotify.com/v1/browse/new-releases?country=${market}&limit=20`;
        break;
      case 'featured-playlists':
        url = `https://api.spotify.com/v1/browse/featured-playlists?country=${market}&limit=20`;
        break;
      case 'categories':
        url = `https://api.spotify.com/v1/browse/categories?country=${market}&limit=50`;
        break;
      case 'recommendations':
        const seedGenres = req.query.seed_genres || 'pop,rock,hip-hop';
        url = `https://api.spotify.com/v1/recommendations?seed_genres=${seedGenres}&limit=20&market=${market}`;
        break;
      default:
        return res.status(400).json({ error: 'Invalid endpoint' });
    }

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      return res.status(response.status).json({ error: 'Spotify API error', details: error });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}
