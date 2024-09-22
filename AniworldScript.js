const PLATFORM = "Aniworld";
const PLUGIN_ID = "aniworld-plugin-unique-id";

function fetchAnimeList() {
  const url = "https://aniworld.to/api/getAnimeList"; // Hypothetische API URL
  const resp = http.GET(url);
  
  const animeList = JSON.parse(resp.body).data; // Verarbeite die JSON-Daten
  
  return animeList.map(anime => ({
    id: new PlatformID(PLATFORM, anime.id, PLUGIN_ID),
    name: anime.title,
    thumbnails: new Thumbnails([new Thumbnail(anime.thumbnail, 200)]),
    url: `https://aniworld.to/anime/${anime.slug}`
  }));
}

function fetchEpisodes(animeId) {
  const url = `https://aniworld.to/api/getEpisodes?animeId=${animeId}`;
  const resp = http.GET(url);
  
  const episodes = JSON.parse(resp.body).data;
  
  return episodes.map(episode => ({
    id: new PlatformID(PLATFORM, episode.id, PLUGIN_ID),
    name: episode.title,
    uploadDate: Date.parse(episode.uploadDate) / 1000,
    url: `https://aniworld.to/watch/${episode.id}`
  }));
}

function fetchVideoDetails(episodeId) {
  const url = `https://aniworld.to/api/getVideo?episodeId=${episodeId}`;
  const resp = http.GET(url);
  
  const videoData = JSON.parse(resp.body);
  
  return new PlatformVideoDetails({
    id: new PlatformID(PLATFORM, videoData.id, PLUGIN_ID),
    name: videoData.title,
    description: videoData.description,
    video: new VideoSourceDescriptor(
      Object.values(videoData.streams).map(stream => new HLSSource({
        name: stream.quality,
        url: stream.url
      }))
    ),
    thumbnails: new Thumbnails([new Thumbnail(videoData.thumbnail, 200)]),
    subtitles: videoData.subtitles.map(sub => ({
      name: sub.language,
      url: sub.url,
      format: "text/vtt"
    }))
  });
}

Object.assign(source, {
  enable() {
    console.log("Aniworld plugin enabled.");
  },

  getHome() {
    return fetchAnimeList();
  },

  getContentDetails(url) {
    const episodeId = extractEpisodeId(url);
    return fetchVideoDetails(episodeId);
  },

  isContentDetailsUrl(url) {
    return url.startsWith("https://aniworld.to/watch/");
  },

  isChannelUrl(url) {
    return url.startsWith("https://aniworld.to/anime/");
  },

  getChannel(url) {
    const animeId = extractAnimeId(url);
    return fetchEpisodes(animeId);
  },

  getChannelCapabilities() {
    return {
      types: [Type.Feed.Videos],
      sorts: [Type.Order.Chronological]
    };
  },

  getChannelContents(url) {
    const animeId = extractAnimeId(url);
    return fetchEpisodes(animeId);
  }
});

function extractEpisodeId(url) {
  return url.split("/").pop(); // Extrahiere die Episode-ID von der URL
}

function extractAnimeId(url) {
  return url.split("/").pop(); // Extrahiere die Anime-ID von der URL
}