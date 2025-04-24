import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
import axios from 'axios';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class SongRecommendationService {
  private readonly logger = new Logger(SongRecommendationService.name);
  
  // Mapeo de condiciones climáticas a estados emocionales
  private readonly weatherToEmotionMap = {
    // Sunny conditions = Happy, Energetic, Joyful
    'Sunny': 'happy',
    'Clear': 'relaxed',
    
    // Cloudy conditions = Nostalgic, Reflective, Thoughtful
    'Partly cloudy': 'nostalgic',
    'Cloudy': 'contemplative',
    'Overcast': 'melancholic',
    'Mist': 'mysterious',
    'Fog': 'dreamy',
    
    // Rainy conditions = Calm, Introspective, Cozy
    'Patchy rain possible': 'hopeful',
    'Patchy light drizzle': 'tranquil',
    'Light drizzle': 'peaceful',
    'Patchy light rain': 'introspective',
    'Light rain': 'calm',
    'Moderate rain at times': 'reflective',
    'Moderate rain': 'soothing',
    'Heavy rain at times': 'dramatic',
    'Heavy rain': 'intense',
    'Light freezing rain': 'ethereal',
    
    // Stormy conditions = Intense, Powerful, Dramatic
    'Thundery outbreaks possible': 'powerful',
    'Patchy light rain with thunder': 'energetic',
    'Moderate or heavy rain with thunder': 'intense',
    'Patchy light snow with thunder': 'dramatic',
    'Moderate or heavy snow with thunder': 'epic',
    
    // Snowy conditions = Serene, Peaceful, Magical
    'Patchy snow possible': 'serene', 
    'Patchy sleet possible': 'gentle',
    'Patchy freezing drizzle possible': 'delicate',
    'Blowing snow': 'magical',
    'Blizzard': 'majestic',
    'Light snow': 'peaceful',
    'Patchy moderate snow': 'whimsical',
    'Moderate snow': 'tranquil',
    'Patchy heavy snow': 'ethereal',
    'Heavy snow': 'serene',
    
    // Fallback
    'default': 'balanced'
  };
  
  // Mapeo de emociones a géneros musicales
  private readonly emotionToGenreMap = {
    // Energetic, Upbeat emotions
    'happy': ['pop', 'dance', 'disco', 'funk', 'tropical'],
    'energetic': ['dance', 'edm', 'rock', 'latin', 'hip-hop'],
    'powerful': ['rock', 'metal', 'electronic', 'hard-rock', 'dubstep'],
    'epic': ['metal', 'orchestral', 'cinematic', 'rock', 'electronic'],
    
    // Calm, Relaxed emotions
    'relaxed': ['acoustic', 'indie', 'folk', 'chill', 'singer-songwriter'],
    'peaceful': ['ambient', 'acoustic', 'piano', 'classical', 'chill'],
    'calm': ['jazz', 'piano', 'acoustic', 'ambient', 'chill'],
    'tranquil': ['classical', 'piano', 'ambient', 'acoustic', 'meditation'],
    'serene': ['classical', 'ambient', 'piano', 'acoustic', 'new-age'],
    
    // Thoughtful, Introspective emotions
    'nostalgic': ['indie', 'folk', 'jazz', 'soul', 'blues'],
    'contemplative': ['indie', 'folk', 'ambient', 'chill', 'instrumental'],
    'reflective': ['indie-folk', 'singer-songwriter', 'ambient', 'piano', 'jazz'],
    'introspective': ['acoustic', 'indie', 'singer-songwriter', 'ambient', 'piano'],
    
    // Melancholic, Sad emotions
    'melancholic': ['indie', 'sad', 'singer-songwriter', 'ambient', 'classical'],
    'dramatic': ['soundtrack', 'classical', 'orchestral', 'cinematic', 'opera'],
    'intense': ['metal', 'rock', 'electronic', 'classical', 'cinematic'],
    
    // Atmospheric, Dreamy emotions
    'dreamy': ['ambient', 'dream-pop', 'indie', 'chill', 'synth-pop'],
    'mysterious': ['ambient', 'electronic', 'experimental', 'cinematic', 'trip-hop'],
    'ethereal': ['ambient', 'classical', 'cinematic', 'post-rock', 'soundtrack'],
    'magical': ['classical', 'soundtrack', 'cinematic', 'new-age', 'ambient'],
    
    // Hopeful, Light emotions
    'hopeful': ['indie-pop', 'folk-pop', 'acoustic', 'gospel', 'inspirational'],
    'gentle': ['folk', 'acoustic', 'singer-songwriter', 'classical', 'ambient'],
    'delicate': ['piano', 'classical', 'ambient', 'acoustic', 'instrumental'],
    'whimsical': ['indie-pop', 'french', 'acoustic', 'folk', 'jazz'],
    
    // Majestic, Grand emotions
    'majestic': ['classical', 'orchestral', 'cinematic', 'soundtrack', 'epic'],
    'soothing': ['jazz', 'r-n-b', 'soul', 'blues', 'chill'],
    
    // Balanced fallback
    'balanced': ['pop', 'rock', 'indie', 'r-n-b', 'alternative']
  };

  // Original map for fallback
  private readonly conditionToGenreMap = {
    // Sunny conditions
    'Sunny': ['pop', 'hip-hop', 'summer'],
    'Clear': ['pop', 'indie', 'acoustic'],
    
    // Cloudy conditions
    'Partly cloudy': ['indie', 'pop', 'alternative'],
    'Cloudy': ['indie', 'chill', 'rock'],
    'Overcast': ['indie', 'alternative', 'ambient'],
    'Mist': ['chill', 'ambient', 'piano'],
    'Fog': ['piano', 'ambient', 'chill'],
    
    // Rainy conditions
    'Patchy rain possible': ['acoustic', 'indie', 'chill'],
    'Patchy light drizzle': ['indie', 'acoustic', 'chill'],
    'Light drizzle': ['chill', 'indie'],
    'Patchy light rain': ['indie', 'chill', 'acoustic'],
    'Light rain': ['jazz', 'piano', 'classical'],
    'Moderate rain at times': ['chill'],
    'Moderate rain': ['jazz', 'blues', 'r-n-b'],
    'Heavy rain at times': ['blues', 'soul', 'jazz'],
    'Heavy rain': ['blues', 'soul', 'jazz'],
    'Light freezing rain': ['piano', 'ambient', 'classical'],
    
    // Stormy conditions
    'Thundery outbreaks possible': ['rock', 'metal', 'electronic'],
    'Patchy light rain with thunder': ['rock', 'alternative', 'grunge'],
    'Moderate or heavy rain with thunder': ['rock', 'metal', 'electronic'],
    'Patchy light snow with thunder': ['classical', 'electronic'],
    'Moderate or heavy snow with thunder': ['metal', 'classical', 'electronic'],
    
    // Snowy conditions
    'Patchy snow possible': ['folk', 'acoustic', 'indie'], 
    'Patchy sleet possible': ['folk', 'indie', 'chill'],
    'Patchy freezing drizzle possible': ['piano', 'ambient', 'classical'],
    'Blowing snow': ['classical', 'ambient'],
    'Blizzard': ['ambient', 'classical'],
    'Light snow': ['indie', 'acoustic', 'piano'],
    'Patchy moderate snow': ['folk', 'acoustic', 'piano'],
    'Moderate snow': ['classical', 'piano', 'ambient'],
    'Patchy heavy snow': ['ambient', 'classical'],
    'Heavy snow': ['classical', 'ambient'],
    
    // Fallback
    'default': ['pop', 'indie', 'rock', 'r-n-b']
  };

  private spotifyToken: string = null;
  private tokenExpiryTime: number = 0;
  
  private readonly spotifyClientId = process.env.SPOTIFY_CLIENT_ID || '';
  private readonly spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';
  private readonly spotifyApiBase = 'https://api.spotify.com/v1';
  
  // Method to get a fresh Spotify access token
  private async getSpotifyToken(): Promise<string> {
    // Check if we have a valid token
    if (this.spotifyToken && Date.now() < this.tokenExpiryTime) {
      return this.spotifyToken;
    }
    
    try {
      this.logger.log('Requesting new Spotify access token');
      // Make a request to Spotify's token endpoint
      const response = await axios({
        method: 'post',
        url: 'https://accounts.spotify.com/api/token',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + Buffer.from(
            this.spotifyClientId + ':' + this.spotifyClientSecret
          ).toString('base64')
        },
        data: 'grant_type=client_credentials'
      });
      
      // Save the token and its expiry time
      this.spotifyToken = response.data.access_token;
      // Convert expiry time from seconds to milliseconds and subtract a 60-second buffer
      this.tokenExpiryTime = Date.now() + (response.data.expires_in - 60) * 1000;
      
      this.logger.log('Successfully obtained Spotify access token');
      return this.spotifyToken;
    } catch (error) {
      this.logger.error(`Error getting Spotify token: ${error.message}`, error.stack);
      if (error.response) {
        this.logger.error(`Spotify token error response: ${JSON.stringify(error.response.data)}`);
      }
      throw new HttpException(
        'Failed to authenticate with Spotify',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  // Main method for getting song recommendations based on weather condition
  async getRecommendationsByCondition(condition: string) {
    try {
      this.logger.log(`Getting music recommendations for weather condition: ${condition}`);
      
      // Get emotional state based on weather condition
      const emotion = this.weatherToEmotionMap[condition] || this.weatherToEmotionMap['default'];
      
      // Get genre seeds for the emotional state
      const genreSeeds = this.emotionToGenreMap[emotion] || this.emotionToGenreMap['balanced'];
      
      // Elegir un género aleatorio de la lista
      const randomGenre = genreSeeds[Math.floor(Math.random() * genreSeeds.length)];
      this.logger.log(`Weather: ${condition} → Emotion: ${emotion} → Selected genre: ${randomGenre}`);
      
      // Buscar canciones por el género seleccionado
      const tracks = await this.searchTopTracksByGenre(randomGenre);
      
      // Map tracks to the format we want to return
      const recommendedSongs = tracks.map(track => ({
        title: track.name,
        artist: track.artists.map(artist => artist.name).join(', '),
        album: track.album?.name || 'Unknown Album',
        previewUrl: track.preview_url,
        spotifyUrl: track.external_urls?.spotify || null,
        imageUrl: track.album?.images[0]?.url || null
      }));
      
      // Return recommendation with context
      return {
        weatherCondition: condition,
        emotionalState: emotion,
        recommendedGenre: randomGenre,
        recommendedSongs: recommendedSongs,
        message: `Based on the "${condition}" weather (${emotion} mood), we recommend ${randomGenre} music.`
      };
    } catch (error) {
      // If Spotify fails, use a fallback method
      this.logger.error(`Error in Spotify recommendation, using fallback: ${error.message}`);
      return this.getFallbackRecommendations(condition);
    }
  }
  
  // Buscar canciones populares por género - este es el enfoque principal
  private async searchTopTracksByGenre(genre: string): Promise<any[]> {
    try {
      const token = await this.getSpotifyToken();
      
      this.logger.log(`Searching for top tracks with genre: ${genre}`);
      
      // Intentar búsqueda con el término de género más cualificadores de ánimo
      const response = await axios({
        method: 'get',
        url: `${this.spotifyApiBase}/search`,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          q: `genre:${genre}`,
          type: 'track',
          market: 'US',
          limit: 5
        }
      });
      
      if (response.data?.tracks?.items?.length > 0) {
        this.logger.log(`Found ${response.data.tracks.items.length} tracks for genre: ${genre}`);
        return response.data.tracks.items;
      }
      
      // Si no encontramos tracks con ese género, probar con recomendaciones
      return await this.getRecommendationsForSeed(genre);
      
    } catch (error) {
      this.logger.error(`Error searching tracks by genre: ${error.message}`);
      if (error.response) {
        this.logger.error(`Search error response: ${JSON.stringify(error.response.data || "")}`);
      }
      
      // Si falla la búsqueda, intentar con playlists destacadas
      return this.getFeaturedPlaylistTracks();
    }
  }
  
  // Obtener recomendaciones por un género semilla
  private async getRecommendationsForSeed(genre: string): Promise<any[]> {
    try {
      const token = await this.getSpotifyToken();
      
      this.logger.log(`Getting recommendations for seed genre: ${genre}`);
      
      // Intentar obtener recomendaciones usando el género como semilla
      const response = await axios({
        method: 'get',
        url: `${this.spotifyApiBase}/recommendations`,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          seed_genres: genre,
          market: 'US',
          limit: 5,
          min_popularity: 50
        }
      });
      
      if (response.data?.tracks?.length > 0) {
        this.logger.log(`Found ${response.data.tracks.length} recommendations for genre: ${genre}`);
        return response.data.tracks;
      }
      
      this.logger.warn(`No recommendations found for genre: ${genre}, trying with featured playlists`);
      return this.getFeaturedPlaylistTracks();
      
    } catch (error) {
      this.logger.error(`Error getting recommendations: ${error.message}`);
      if (error.response) {
        this.logger.error(`Recommendations error response: ${JSON.stringify(error.response.data || "")}`);
      }
      
      // Si falla, intentar con playlists destacadas
      return this.getFeaturedPlaylistTracks();
    }
  }
  
  // Obtener canciones de playlists destacadas
  private async getFeaturedPlaylistTracks(): Promise<any[]> {
    try {
      const token = await this.getSpotifyToken();
      
      this.logger.log('Getting tracks from featured playlists');
      
      // Obtener playlists destacadas
      const response = await axios({
        method: 'get',
        url: `${this.spotifyApiBase}/browse/featured-playlists`,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          limit: 1,
          country: 'US'
        }
      });
      
      if (!response.data?.playlists?.items?.length) {
        throw new Error('No featured playlists found');
      }
      
      const playlistId = response.data.playlists.items[0].id;
      this.logger.log(`Using playlist: ${response.data.playlists.items[0].name} (${playlistId})`);
      
      // Obtener las canciones de la playlist
      const tracksResponse = await axios({
        method: 'get',
        url: `${this.spotifyApiBase}/playlists/${playlistId}/tracks`,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        params: {
          limit: 5,
          market: 'US'
        }
      });
      
      if (tracksResponse.data?.items?.length > 0) {
        return tracksResponse.data.items.map(item => item.track).filter(track => track != null);
      }
      
      throw new Error('No tracks found in the featured playlist');
      
    } catch (error) {
      this.logger.error(`Error getting featured playlist tracks: ${error.message}`);
      
      // Si todo falla, usar las canciones locales
      throw error;
    }
  }
  
  // Fallback method in case Spotify API fails
  private getFallbackRecommendations(condition: string) {
    // Get emotional state based on weather condition
    const emotion = this.weatherToEmotionMap[condition] || this.weatherToEmotionMap['default'];
    
    // Get genres for the emotion
    const genres = this.emotionToGenreMap[emotion] || this.emotionToGenreMap['balanced'];
    
    // Elegir un género aleatorio
    const randomGenre = genres[Math.floor(Math.random() * genres.length)];
    
    const fallbackSongs = {
      'pop': [
        { title: 'Shape of You', artist: 'Ed Sheeran', album: '÷' },
        { title: 'Blinding Lights', artist: 'The Weeknd', album: 'After Hours' },
        { title: 'Dance Monkey', artist: 'Tones and I', album: 'The Kids Are Coming' }
      ],
      'rock': [
        { title: 'Bohemian Rhapsody', artist: 'Queen', album: 'A Night at the Opera' },
        { title: 'Sweet Child O\' Mine', artist: 'Guns N\' Roses', album: 'Appetite for Destruction' },
        { title: 'Back In Black', artist: 'AC/DC', album: 'Back in Black' }
      ],
      'indie': [
        { title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We\'re Dreaming' },
        { title: 'Somebody Else', artist: 'The 1975', album: 'I Like It When You Sleep...' },
        { title: 'Do I Wanna Know?', artist: 'Arctic Monkeys', album: 'AM' }
      ],
      'jazz': [
        { title: 'Take Five', artist: 'Dave Brubeck', album: 'Time Out' },
        { title: 'So What', artist: 'Miles Davis', album: 'Kind of Blue' },
        { title: 'My Favorite Things', artist: 'John Coltrane', album: 'My Favorite Things' }
      ],
      'classical': [
        { title: 'Canon in D', artist: 'Johann Pachelbel', album: 'Classical Masterpieces' },
        { title: 'Clair de Lune', artist: 'Claude Debussy', album: 'Suite Bergamasque' },
        { title: 'Four Seasons: Winter', artist: 'Antonio Vivaldi', album: 'The Four Seasons' }
      ],
      'alternative': [
        { title: 'Smells Like Teen Spirit', artist: 'Nirvana', album: 'Nevermind' },
        { title: 'Black Hole Sun', artist: 'Soundgarden', album: 'Superunknown' },
        { title: 'Creep', artist: 'Radiohead', album: 'Pablo Honey' }
      ],
      'chill': [
        { title: 'Sunset Lover', artist: 'Petit Biscuit', album: 'Petit Biscuit' },
        { title: 'Another Day in Paradise', artist: 'Quinn XCII', album: 'The Story of Us' },
        { title: 'Good Days', artist: 'SZA', album: 'Good Days' }
      ],
      'electronic': [
        { title: 'Strobe', artist: 'deadmau5', album: 'For Lack of a Better Name' },
        { title: 'Opus', artist: 'Eric Prydz', album: 'Opus' },
        { title: 'Scary Monsters and Nice Sprites', artist: 'Skrillex', album: 'Scary Monsters and Nice Sprites' }
      ],
      'hip-hop': [
        { title: 'Sicko Mode', artist: 'Travis Scott', album: 'Astroworld' },
        { title: 'God\'s Plan', artist: 'Drake', album: 'Scorpion' },
        { title: 'HUMBLE.', artist: 'Kendrick Lamar', album: 'DAMN.' }
      ],
      'ambient': [
        { title: 'Ambient 1: Music for Airports', artist: 'Brian Eno', album: 'Ambient 1: Music for Airports' },
        { title: 'Avril 14th', artist: 'Aphex Twin', album: 'Drukqs' },
        { title: 'Structures from Silence', artist: 'Steve Roach', album: 'Structures from Silence' }
      ],
      'acoustic': [
        { title: 'Fast Car', artist: 'Tracy Chapman', album: 'Tracy Chapman' },
        { title: 'Hallelujah', artist: 'Jeff Buckley', album: 'Grace' },
        { title: 'Fire and Rain', artist: 'James Taylor', album: 'Sweet Baby James' }
      ],
      'piano': [
        { title: 'Nuvole Bianche', artist: 'Ludovico Einaudi', album: 'Una Mattina' },
        { title: 'River Flows in You', artist: 'Yiruma', album: 'First Love' },
        { title: 'Comptine d\'un autre été', artist: 'Yann Tiersen', album: 'Amélie' }
      ],
      'metal': [
        { title: 'Master of Puppets', artist: 'Metallica', album: 'Master of Puppets' },
        { title: 'Paranoid', artist: 'Black Sabbath', album: 'Paranoid' },
        { title: 'Fear of the Dark', artist: 'Iron Maiden', album: 'Fear of the Dark' }
      ],
      'dance': [
        { title: 'One More Time', artist: 'Daft Punk', album: 'Discovery' },
        { title: 'Don\'t You Worry Child', artist: 'Swedish House Mafia', album: 'Until Now' },
        { title: 'Titanium', artist: 'David Guetta ft. Sia', album: 'Nothing but the Beat' }
      ],
      'folk': [
        { title: 'Blowin\' in the Wind', artist: 'Bob Dylan', album: 'The Freewheelin\' Bob Dylan' },
        { title: 'Landslide', artist: 'Fleetwood Mac', album: 'Fleetwood Mac' },
        { title: 'Big Yellow Taxi', artist: 'Joni Mitchell', album: 'Ladies of the Canyon' }
      ],
      'soundtrack': [
        { title: 'Time', artist: 'Hans Zimmer', album: 'Inception' },
        { title: 'Duel of the Fates', artist: 'John Williams', album: 'Star Wars: The Phantom Menace' },
        { title: 'He\'s a Pirate', artist: 'Klaus Badelt', album: 'Pirates of the Caribbean' }
      ],
      'cinematic': [
        { title: 'Now We Are Free', artist: 'Hans Zimmer & Lisa Gerrard', album: 'Gladiator' },
        { title: 'The Avengers', artist: 'Alan Silvestri', album: 'The Avengers' },
        { title: 'Main Theme from Jurassic Park', artist: 'John Williams', album: 'Jurassic Park' }
      ]
    };
    
    // Choose a genre that has fallback songs
    let selectedGenre = randomGenre;
    for (const genre of genres) {
      if (fallbackSongs[genre]) {
        selectedGenre = genre;
        break;
      }
    }
    
    // Use fallback songs for that genre or default to error messages
    const songs = fallbackSongs[selectedGenre] || [
      { title: 'Unable to connect to Spotify', artist: 'Various Artists', album: 'Error Collection' },
      { title: 'Check your Spotify credentials', artist: 'Various Artists', album: 'Error Collection' },
      { title: 'Using local recommendations', artist: 'Various Artists', album: 'Error Collection' }
    ];
    
    this.logger.log(`Using fallback songs for genre: ${selectedGenre}`);
    
    return {
      weatherCondition: condition,
      emotionalState: emotion,
      recommendedGenre: selectedGenre,
      recommendedSongs: songs,
      message: `Based on the "${condition}" weather (${emotion} mood), we recommend ${selectedGenre} music.`
    };
  }
} 