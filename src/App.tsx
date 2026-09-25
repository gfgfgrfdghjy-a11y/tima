import { useState, useRef } from 'react';
import './App.css';

type PageType = 'home' | 'search' | 'favorites' | 'recommendations';

interface Track {
  id: number;
  title: string;
  artist: string;
  category?: string;
  color: string;
  audioUrl: string; // Музыканын шилтемеси (URL)
}

// Баштапкы тректер (Интернеттен алынган акысыз музыкалар)
const initialTracks: Track[] = [
  { 
    id: 1, 
    title: 'Blinding Lights', 
    artist: 'The Weeknd', 
    category: 'Хиты 2024', 
    color: 'linear-gradient(135deg, #8A2BE2, #4A00E0)',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' 
  },
  { 
    id: 2, 
    title: "God's Plan", 
    artist: 'Drake', 
    category: 'Чиллаут', 
    color: 'linear-gradient(135deg, #FF007F, #FF8C00)',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
  },
  { 
    id: 3, 
    title: 'Cruel Summer', 
    artist: 'Taylor Swift', 
    category: 'Тренировка', 
    color: 'linear-gradient(135deg, #00BFFF, #1E90FF)',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
  },
  { 
    id: 4, 
    title: 'Lovely', 
    artist: 'Billie Eilish', 
    category: 'Чиллаут', 
    color: 'linear-gradient(135deg, #00FA9A, #00BFFF)',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3'
  },
  { 
    id: 5, 
    title: 'Starboy', 
    artist: 'The Weeknd', 
    category: 'Хиты 2024', 
    color: 'linear-gradient(135deg, #8A2BE2, #FF007F)',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3'
  },
];

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [favorites, setFavorites] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Музыка ойнотуу үчүн абал
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Тректи ойнотуу функциясы
  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      // Эгер ошол эле трек басылса, ойнотууну токтотуу же улантуу
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      // Жаңы трек басылса
      setCurrentTrack(track);
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.src = track.audioUrl;
        audioRef.current.play();
      }
    }
  };

  const addToFavorites = (track: Track) => {
    if (!favorites.find((t) => t.id === track.id)) {
      setFavorites([...favorites, track]);
    }
  };

  const removeFromFavorites = (trackId: number) => {
    setFavorites(favorites.filter((t) => t.id !== trackId));
  };

  const filteredTracks = initialTracks.filter(t => 
    t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.artist.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- Барактар ---

  const HomePage = () => (
    <div className="hero-card">
      <h1 className="hero-title">Добро пожаловать в VIBEFY</h1>
      <p className="hero-subtitle">Открывай новую музыку каждый день</p>
      <button className="btn-primary" onClick={() => setCurrentPage('search')}>Найти музыку</button>
    </div>
  );

  const TrackList = ({ tracks }: { tracks: Track[] }) => (
    <div className="track-list">
      {tracks.map(track => {
        const isFav = favorites.some(f => f.id === track.id);
        const isCurrent = currentTrack?.id === track.id && isPlaying;
        
        return (
          <div key={track.id} className="track-item">
            <div className="track-icon" style={{ background: track.color }}>🎵</div>
            <div className="track-info">
              <h4>{track.title}</h4>
              <p>{track.artist} • {track.category}</p>
            </div>
            <div className="track-actions">
              <button 
                className={`fav-btn ${isFav ? 'active' : ''}`} 
                onClick={() => isFav ? removeFromFavorites(track.id) : addToFavorites(track)}
              >
                {isFav ? '❤️' : '🤍'}
              </button>
              <button 
                className="play-btn" 
                onClick={() => playTrack(track)}
              >
                {isCurrent ? '⏸' : '▶'}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );

  const SearchPage = () => (
    <div>
      <div className="search-container">
        <div className="search-input-wrapper">
          <input 
            type="text" 
            className="search-input" 
            placeholder="Название песни, исполнитель..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="tags">
          <span className="tag" onClick={() => setSearchQuery('The Weeknd')}>The Weeknd</span>
          <span className="tag" onClick={() => setSearchQuery('Drake')}>Drake</span>
          <span className="tag" onClick={() => setSearchQuery('Taylor Swift')}>Taylor Swift</span>
          <span className="tag" onClick={() => setSearchQuery('Billie Eilish')}>Billie Eilish</span>
        </div>
      </div>
      <TrackList tracks={filteredTracks} />
    </div>
  );

  const FavoritesPage = () => (
    <div>
      <div className="hero-card" style={{ background: 'linear-gradient(135deg, #4A00E0, #8A2BE2)' }}>
        <h1 className="hero-title">Избранное</h1>
        <p className="hero-subtitle">{favorites.length} треков</p>
      </div>
      {favorites.length === 0 ? (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <div style={{ fontSize: '50px', marginBottom: '20px' }}>🤍</div>
          <h3>Здесь пока пусто</h3>
          <p style={{ color: '#a0aec0', marginBottom: '20px' }}>Добавляй любимые треки, и они появятся здесь</p>
          <button className="btn-primary" onClick={() => setCurrentPage('search')}>Найти музыку</button>
        </div>
      ) : (
        <TrackList tracks={favorites} />
      )}
    </div>
  );

  const RecommendationsPage = () => {
    if (favorites.length === 0) {
      return (
        <div style={{ textAlign: 'center', marginTop: '80px' }}>
          <div style={{ fontSize: '60px', marginBottom: '20px' }}>🎵</div>
          <h2>Добавь треки в избранное</h2>
          <p style={{ color: '#a0aec0', margin: '15px 0 30px 0', maxWidth: '400px', marginLeft: 'auto', marginRight: 'auto' }}>
            Чтобы получить персональные рекомендации, добавь несколько любимых треков в избранное
          </p>
          <button className="btn-primary" onClick={() => setCurrentPage('search')}>НАЙТИ МУЗЫКУ</button>
        </div>
      );
    }
    const recommended = initialTracks.filter(t => !favorites.find(f => f.id === t.id)).slice(0, 4);
    return (
      <div>
        <div className="hero-card">
          <h1 className="hero-title">Рекомендации</h1>
          <p className="hero-subtitle">Персональные рекомендации на основе твоих вкусов</p>
        </div>
        <h3 style={{ marginBottom: '20px' }}>Тебе может понравиться</h3>
        <TrackList tracks={recommended} />
      </div>
    );
  };

  return (
    <div className="app-container">
      {/* Аудио элемент (көрүнбөйт, бирок музыка ойнотот) */}
      <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />

      <header className="header">
        <div className="logo" onClick={() => setCurrentPage('home')}>
          <div className="logo-icon"></div>
          VIBEFY
        </div>
        <nav className="nav-links">
          <button className={`nav-btn ${currentPage === 'home' ? 'active' : ''}`} onClick={() => setCurrentPage('home')}>🏠 Главная</button>
          <button className={`nav-btn ${currentPage === 'search' ? 'active' : ''}`} onClick={() => setCurrentPage('search')}>🔍 Поиск</button>
          <button className={`nav-btn ${currentPage === 'favorites' ? 'active' : ''}`} onClick={() => setCurrentPage('favorites')}>❤️ Избранное</button>
          <button className={`nav-btn ${currentPage === 'recommendations' ? 'active' : ''}`} onClick={() => setCurrentPage('recommendations')}>✨ Рекомендации</button>
        </nav>
      </header>

      <main className="main-content">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'search' && <SearchPage />}
        {currentPage === 'favorites' && <FavoritesPage />}
        {currentPage === 'recommendations' && <RecommendationsPage />}
      </main>
    </div>
  );
}

export default App;