import { useQuery } from '@tanstack/react-query';
import {
  searchSpotify,
  getNewReleases,
  getFeaturedPlaylists,
  getCategories,
  getRecommendations,
  getPlaylist,
  getArtist,
  getAlbum,
  getTrack,
} from '@/lib/spotify';

export function useSpotifySearch(query: string, enabled = true) {
  return useQuery({
    queryKey: ['spotify-search', query],
    queryFn: () => searchSpotify(query),
    enabled: enabled && query.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useNewReleases() {
  return useQuery({
    queryKey: ['spotify-new-releases'],
    queryFn: getNewReleases,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useFeaturedPlaylists() {
  return useQuery({
    queryKey: ['spotify-featured-playlists'],
    queryFn: getFeaturedPlaylists,
    staleTime: 1000 * 60 * 30,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['spotify-categories'],
    queryFn: getCategories,
    staleTime: 1000 * 60 * 60, // 1 hour
  });
}

export function useRecommendations(seedGenres = 'pop,rock,hip-hop') {
  return useQuery({
    queryKey: ['spotify-recommendations', seedGenres],
    queryFn: () => getRecommendations(seedGenres),
    staleTime: 1000 * 60 * 15, // 15 minutes
  });
}

export function usePlaylist(id: string | undefined) {
  return useQuery({
    queryKey: ['spotify-playlist', id],
    queryFn: () => getPlaylist(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
}

export function useArtist(id: string | undefined) {
  return useQuery({
    queryKey: ['spotify-artist', id],
    queryFn: () => getArtist(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}

export function useAlbum(id: string | undefined) {
  return useQuery({
    queryKey: ['spotify-album', id],
    queryFn: () => getAlbum(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}

export function useTrack(id: string | undefined) {
  return useQuery({
    queryKey: ['spotify-track', id],
    queryFn: () => getTrack(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
}
