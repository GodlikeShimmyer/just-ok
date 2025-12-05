import { Track, Artist, Album, Playlist } from '@/types/music';

const API_BASE = '/api/spotify';

// Transform Spotify track to our Track type
export function transformSpotifyTrack(spotifyTrack: any): Track {
  return {
    id: spotifyTrack.id,
    title: spotifyTrack.name,
    artist: spotifyTrack.artists?.map((a: any) => a.name).join(', ') || 'Unknown Artist',
    artistId: spotifyTrack.artists?.[0]?.id,
    album: spotifyTrack.album?.name || 'Unknown Album',
    albumId: spotifyTrack.album?.id,
    duration: Math.floor((spotifyTrack.duration_ms || 0) / 1000),
    coverUrl: spotifyTrack.album?.images?.[0]?.url || '/placeholder.svg',
    audioUrl: spotifyTrack.preview_url || undefined,
    isLiked: false,
  };
}

// Transform Spotify artist to our Artist type
export function transformSpotifyArtist(spotifyArtist: any): Artist {
  return {
    id: spotifyArtist.id,
    name: spotifyArtist.name,
    imageUrl: spotifyArtist.images?.[0]?.url || '/placeholder.svg',
    monthlyListeners: spotifyArtist.followers?.total || 0,
    isVerified: spotifyArtist.followers?.total > 100000,
    genres: spotifyArtist.genres || [],
    topTracks: [],
    albums: [],
  };
}

// Transform Spotify album to our Album type
export function transformSpotifyAlbum(spotifyAlbum: any): Album {
  return {
    id: spotifyAlbum.id,
    name: spotifyAlbum.name,
    artist: spotifyAlbum.artists?.map((a: any) => a.name).join(', ') || 'Unknown Artist',
    artistId: spotifyAlbum.artists?.[0]?.id || '',
    coverUrl: spotifyAlbum.images?.[0]?.url || '/placeholder.svg',
    releaseYear: parseInt(spotifyAlbum.release_date?.split('-')[0]) || 2024,
    tracks: spotifyAlbum.tracks?.items?.map(transformSpotifyTrack) || [],
    totalDuration: 0,
  };
}

// Transform Spotify playlist to our Playlist type
export function transformSpotifyPlaylist(spotifyPlaylist: any): Playlist {
  const tracks = spotifyPlaylist.tracks?.items?.map((item: any) => 
    item.track ? transformSpotifyTrack(item.track) : null
  ).filter(Boolean) || [];

  return {
    id: spotifyPlaylist.id,
    name: spotifyPlaylist.name,
    description: spotifyPlaylist.description || '',
    coverUrl: spotifyPlaylist.images?.[0]?.url || '/placeholder.svg',
    owner: spotifyPlaylist.owner?.display_name || 'Spotify',
    tracks,
    isPublic: spotifyPlaylist.public ?? true,
    createdAt: new Date(),
    totalDuration: tracks.reduce((acc: number, t: Track) => acc + t.duration, 0),
    likesCount: spotifyPlaylist.followers?.total || 0,
  };
}

// API functions
export async function searchSpotify(query: string, type = 'track,artist,album,playlist', limit = 20) {
  const params = new URLSearchParams({ q: query, type, limit: String(limit) });
  const response = await fetch(`${API_BASE}/search?${params}`);
  
  if (!response.ok) {
    throw new Error('Search failed');
  }
  
  const data = await response.json();
  
  return {
    tracks: data.tracks?.items?.map(transformSpotifyTrack) || [],
    artists: data.artists?.items?.map(transformSpotifyArtist) || [],
    albums: data.albums?.items?.map(transformSpotifyAlbum) || [],
    playlists: data.playlists?.items?.map(transformSpotifyPlaylist) || [],
  };
}

export async function getNewReleases() {
  const response = await fetch(`${API_BASE}/browse?endpoint=new-releases`);
  if (!response.ok) throw new Error('Failed to fetch new releases');
  const data = await response.json();
  return data.albums?.items?.map(transformSpotifyAlbum) || [];
}

export async function getFeaturedPlaylists() {
  const response = await fetch(`${API_BASE}/browse?endpoint=featured-playlists`);
  if (!response.ok) throw new Error('Failed to fetch featured playlists');
  const data = await response.json();
  return data.playlists?.items?.map(transformSpotifyPlaylist) || [];
}

export async function getCategories() {
  const response = await fetch(`${API_BASE}/browse?endpoint=categories`);
  if (!response.ok) throw new Error('Failed to fetch categories');
  const data = await response.json();
  return data.categories?.items || [];
}

export async function getRecommendations(seedGenres = 'pop,rock,hip-hop') {
  const response = await fetch(`${API_BASE}/browse?endpoint=recommendations&seed_genres=${seedGenres}`);
  if (!response.ok) throw new Error('Failed to fetch recommendations');
  const data = await response.json();
  return data.tracks?.map(transformSpotifyTrack) || [];
}

export async function getPlaylist(id: string) {
  const response = await fetch(`${API_BASE}/playlist/${id}`);
  if (!response.ok) throw new Error('Failed to fetch playlist');
  const data = await response.json();
  return transformSpotifyPlaylist(data);
}

export async function getArtist(id: string, includeFull = true) {
  const response = await fetch(`${API_BASE}/artist/${id}?include=${includeFull ? 'full' : ''}`);
  if (!response.ok) throw new Error('Failed to fetch artist');
  const data = await response.json();
  
  const artist = transformSpotifyArtist(data);
  if (includeFull) {
    artist.topTracks = data.topTracks?.map(transformSpotifyTrack) || [];
    artist.albums = data.albums?.map(transformSpotifyAlbum) || [];
  }
  return artist;
}

export async function getAlbum(id: string) {
  const response = await fetch(`${API_BASE}/album/${id}`);
  if (!response.ok) throw new Error('Failed to fetch album');
  const data = await response.json();
  
  const album = transformSpotifyAlbum(data);
  // Album tracks from Spotify don't include full album info, so we need to add it
  album.tracks = data.tracks?.items?.map((track: any) => ({
    ...transformSpotifyTrack({ ...track, album: data }),
  })) || [];
  album.totalDuration = album.tracks.reduce((acc, t) => acc + t.duration, 0);
  return album;
}

export async function getTrack(id: string) {
  const response = await fetch(`${API_BASE}/track/${id}`);
  if (!response.ok) throw new Error('Failed to fetch track');
  const data = await response.json();
  return transformSpotifyTrack(data);
}
