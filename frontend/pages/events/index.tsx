import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../../styles/Events.module.css';

interface Team {
  team_id: string;
  name: string;
  country: string;
  game_playing: string;
  rank?: number;
  team_size?: number;
}

interface Event {
  event_id: string;
  title: string;
  start_datetime: string; 
  end_datetime?: string;  
  image: string;
  game_type: string;     
  teams: Team[];
  category: string;
  status: string;         
  description?: string;  
  price: number;
  viewers?: number;
  is_popular?: boolean;
}

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedLive, setExpandedLive] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('');
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:5000/events');
        
        if (response.ok) {
          const data = await response.json();
          setEvents(data);
        } else {
          setError('Failed to fetch events');
        }
      } catch (err) {
        setError('Error connecting to the server');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      const userTypeData = localStorage.getItem('userType') || sessionStorage.getItem('userType');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUsername(user.username || 'Visitor');
        } catch (e) {
          setUsername('Visitor');
        }
      } else {
        setUsername('Visitor');
      }
      setUserType(userTypeData || '');
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isLoggedIn = typeof window !== 'undefined' && 
    (localStorage.getItem('user') || sessionStorage.getItem('user'));

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user');
      sessionStorage.removeItem('user');
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('userType');
      sessionStorage.removeItem('userType');
    }
    router.push('http://localhost:3000/login');
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownOpen(!profileDropdownOpen);
  };

  const formatDateTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return {
        date: date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        time: date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true
        })
      };
    } catch (error) {
      return { date: 'TBD', time: '' };
    }
  };

  const formatViewers = (viewers: number) => {
    if (!viewers) return '0 viewers';
    return `${(viewers).toFixed(1)}k viewers`;
  };

  const formatTeamNames = (teams: Team[], separator: string = ' VS ') => {
    if (!teams || teams.length === 0) return 'No teams assigned';
    const teamNames = teams
      .filter(team => team && team.name)
      .map(team => team.name);
    
    if (teamNames.length === 0) return 'No teams assigned';
    
    return teamNames.join(separator);
  };

  const toggleHeart = (e: React.MouseEvent) => {
    e.preventDefault();
    const img = e.target as HTMLImageElement;
    if (img.src.includes('no_heart.png')) {
      img.src = '/photos/yes_heart.png';
    } else {
      img.src = '/photos/no_heart.png';
    }
  };

  const scrollLeft = () => {
    const container = document.getElementById('scrollableContainer');
    if (container) {
      container.scrollBy({ left: -250, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    const container = document.getElementById('scrollableContainer');
    if (container) {
      container.scrollBy({ left: 250, behavior: 'smooth' });
    }
  };

  const toggleShowMore = () => {
    setExpandedLive(!expandedLive);
  };

  const liveEvents = events.filter(event => event.status === 'live');
  const upcomingEvents = events.filter(event => event.status === 'upcoming');
  const popularEvents = events.filter(event => event.is_popular || event.status === 'finished');

  const visibleLiveEvents = liveEvents.slice(0, 4);
  const extraLiveEvents = liveEvents.slice(4);

  if (loading) {
    return <div className={styles.loading}>Loading events...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <nav className={styles.topNav}>
        <div className={styles.navContent}>
          <img src="/photos/controller.png" alt="Controller" className={styles.navController} />
          <h1>eSports</h1>
          <div className={styles.navLinks}>
            <a href="#" className={styles.homeLink}>HOME</a>
            <a href="#">Browse</a>
          </div>
          <img src="/photos/filters.png" alt="Filters" className={styles.navFilters} />
          <div className={styles.navSearch}>
            <input type="text" placeholder="Search..." />
          </div>
          <div className={styles.navIcons}>
            <img src="/photos/heart.png" alt="Heart" className={styles.navIcon} />
            <img src="/photos/envelope1.png" alt="Notifications" className={styles.navIcon} />
            <div className={styles.profileContainer} ref={dropdownRef}>
              <img src="/photos/profile.png" alt="Profile" className={styles.navIcon} onClick={toggleProfileDropdown}/>
              {profileDropdownOpen && (
                <div className={styles.profileDropdown}>
                  <div className={styles.dropdownHeader}>
                    <img src="/photos/profile.png" alt="Profile" className={styles.dropdownProfilePic} />
                    <span>{username}</span>
                  </div>
                  <div className={styles.dropdownItem}>⭐ Subscriptions</div>
                  <div className={styles.dropdownItem}>💼 Wallet</div>
                  <div className={styles.dropdownItem}>📊 Your activity</div>
                  {userType === 'creator' && (
                    <div className={styles.dropdownItem}>📋 Dashboard</div>
                  )}
                  <hr className={styles.dropdownDivider} />
                  <div className={styles.dropdownItem}>🌐 Language</div>
                  <div className={styles.dropdownItem}>
                    🌓 Dark theme
                    <label className={styles.switch}>
                      <input type="checkbox" id="themeToggle" />
                      <span className={styles.slider}></span>
                    </label>
                  </div>
                  <div className={styles.dropdownItem}>❓ Help</div>
                  <div className={styles.dropdownItem}>⚙️ Settings</div>
                  <hr className={styles.dropdownDivider} />
                  <div className={styles.dropdownItem} onClick={handleLogout}>🚪 Log out</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className={styles.liveEsportTitle}>
        Live on eSports
      </div>
      
      <div className={styles.liveEvents}>
        {visibleLiveEvents.map((event) => {
          const { date, time } = formatDateTime(event.start_datetime);
          return (
            <Link href={`/events/${event.event_id}`} key={event.event_id} className={styles.liveBox}>
              <div className={styles.liveImage}>
                <div className={styles.liveLabel}>LIVE</div>
                <div className={styles.viewersLabel}>
                  {formatViewers(event.viewers ?? 0)}
                </div>
                <img src={event.image || '/placeholder.jpg'} alt="Live Game" />
                <img src="/photos/no_heart.png" alt="Heart Icon" className={styles.heartIcon} onClick={toggleHeart} />
              </div>
              <div className={styles.liveInfo}>
                <h2>{event.title}</h2>
                <p>{event.game_type}</p>
                <p>{event.category}</p>
                <p>{formatTeamNames(event.teams, ' VS ')}</p>
                <div className={styles.watchLive}>
                  <span>📺</span>
                  <span>Watch Live</span>
                  <div className={styles.watchIcons}>
                    <img src={event.price > 0 ? "/photos/money.png" : "/photos/no_money.jpg"} alt="Price Icon"/>
                    <img src="/photos/settings.png" alt="Settings Icon" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <div className={`${styles.extraLiveEvents} ${expandedLive ? styles.expanded : ''}`}>
        {extraLiveEvents.map((event) => {
          const { date, time } = formatDateTime(event.start_datetime);
          return (
            <Link href={`/events/${event.event_id}`} key={event.event_id} className={styles.liveBox}>
              <div className={styles.liveImage}>
                <div className={styles.liveLabel}>LIVE</div>
                <div className={styles.viewersLabel}>
                  {formatViewers(event.viewers ?? 0)}
                </div>
                <img src={event.image || '/placeholder.jpg'} alt="Live Game" />
                <img src="/photos/no_heart.png" alt="Heart Icon" className={styles.heartIcon} onClick={toggleHeart}/>
              </div>
              <div className={styles.liveInfo}>
                <h2>{event.title}</h2>
                <p>{event.game_type}</p>
                <p>{event.category}</p>
                <p>{formatTeamNames(event.teams, ' VS ')}</p>
                <div className={styles.watchLive}>
                  <span>📺</span>
                  <span>Watch Live</span>
                  <div className={styles.watchIcons}>
                    <img src={event.price > 0 ? "/photos/money.png" : "/photos/no_money.jpg"} alt="Price Icon"/>
                    <img src="/photos/settings.png" alt="Settings Icon" />
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {extraLiveEvents.length > 0 && (
        <div className={styles.showMoreSection} onClick={toggleShowMore}>
          <div className={styles.line}></div>
          <div className={styles.showMore}>
            <span>{expandedLive ? 'Show less' : 'Show more'}</span>
            <img src={expandedLive ? "/photos/show_less_arrow.png" : "/photos/show_more_arrow.png"} alt="Arrow Icon"/>
          </div>
          <div className={styles.line}></div>
        </div>
      )}

      <div className={styles.liveTitle}>
        Upcoming Events
      </div>
      
      <div className={styles.scrollWrapper}>
        <button className={styles.scrollBtn} onClick={scrollLeft}>&#10094;</button>
        <div className={styles.upcomingContainer} id="scrollableContainer">
          {upcomingEvents.map((event) => {
            const { date, time } = formatDateTime(event.start_datetime);
            return (
              <Link href={`/events/${event.event_id}`} key={event.event_id} className={styles.upcomingBox}>
                <div className={styles.upcomingImage}>
                  <img src={event.image || '/placeholder.jpg'} alt={event.title} />
                  <img src="/photos/no_heart.png" alt="Heart Icon" className={styles.heartIcon} onClick={toggleHeart}/>
                </div>
                <div className={styles.upcomingInfo}>
                  <h2>{event.title}</h2>
                  <p>{event.game_type}</p>
                  <p>{event.category}</p>
                  <p>{formatTeamNames(event.teams, ' VS ')}</p>
                  <div className={styles.watchLive}>
                    <span>📅</span>
                    <span>{date}</span>
                  </div>
                  <div className={styles.watchLive}>
                    <span>⏲️</span>
                    <span>Starts at {time}</span>
                  </div>
                  <div className={styles.watchLive}>
                    <span>⏳</span>
                    <span>Set Reminder</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
        <button className={styles.scrollBtn} onClick={scrollRight}>&#10095;</button>
      </div>

      <div className={styles.showMoreSection}>
        <div className={styles.fullLine}></div>
      </div>

      <div className={styles.liveTitle}>
        Popular Events
      </div>
      
      <div className={styles.popularEvents}>
        {popularEvents.slice(0, 3).map((event) => {
          const { date, time } = formatDateTime(event.start_datetime);
          return (
            <Link href={`/events/${event.event_id}`} key={event.event_id} className={styles.eventBox}>
              <div className={styles.eventImage}>
                {event.status === 'live' && (
                  <>
                    <div className={styles.liveLabel}>LIVE</div>
                    <div className={styles.viewersLabel}>
                      {formatViewers(event.viewers ?? 0)}
                    </div>
                  </>
                )}
                <img src={event.image || '/placeholder.jpg'} alt={event.title} />
                <img src="/photos/no_heart.png" alt="Heart Icon" className={styles.heartIcon} onClick={toggleHeart}/>
              </div>
              <div className={styles.eventInfo}>
                <h2>{event.title}</h2>
                <p>{event.game_type}</p>
                <p>{event.category}</p>
                <div className={styles.teamInfo}>
                  <span className={styles.teamTrophy}>🏆</span>
                  <span>{formatTeamNames(event.teams, ' VS ')}</span>
                </div>
                {event.status === 'finished' && (
                  <div className={styles.dateInfo}>
                    <span>📅</span>
                    <span>{date} (Ended)</span>
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      {isLoggedIn && userType === 'creator' && (
        <button className={styles.addButton} onClick={() => router.push('/events/add')} style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 1000 }}>
          Add New Event
        </button>
      )}
    </div>
  );
}