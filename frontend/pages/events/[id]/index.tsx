import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../../../styles/Home.module.css';

interface Team {
  team_id: string;
  name: string;
  country: string;
  game_playing: string;
  rank?: number;
  team_size?: number;
  year_of_foundation?: number;
}

interface Content {
  content_id: string;
  event_id: string;
  content_creator_id: string;
  title: string;
  type: 'image' | 'video' | 'highlight';
  url?: string;
  description?: string;
  scheduled_viewing_time?: string;
  created_at: string;
  is_approved: boolean;
  creator_username?: string;
  stats?: {
    views: number;
    shares: number;
    likes: number;
    last_updated: string;
  };
}

interface Player {
  player_id: string;
  first_name: string;
  last_name: string;
  nickname?: string;
  age?: number;
  current_team_id?: string;
  team_name?: string;
}

interface EventStats {
  views: number;
  shares: number;
  last_updated: string;
}

interface ChatMessage {
  message_id: string;
  user_id: string;
  username: string;
  message: string;
  created_at: string;
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
  creator_username?: string;  
  stats?: EventStats;
  players?: Player[];
  chat_messages?: ChatMessage[];
  content?: Content[];
}

export default function ViewEvent() {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('');
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const router = useRouter();
  const { id } = router.query;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

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
      if (id) {
        fetchEvent(id as string);
      }
    }, [id]);

    useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [event?.chat_messages]);
  
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

    const fetchEvent = async (eventId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/events/${eventId}`);
      if (!response.ok) {
        throw new Error('Event not found');
      }
      const eventData = await response.json();
      setEvent(eventData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch event');
    } finally {
      setLoading(false);
    }
  };
  
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
  
   const formatViews = (views: number) => {
    if (!views) return '0';
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  const getStatusBadge = (status: string) => {
    const baseClass = styles.statusBadge;
    switch (status.toLowerCase()) {
      case 'live':
        return `${baseClass} ${styles.statusLive}`;
      case 'upcoming':
        return `${baseClass} ${styles.statusUpcoming}`;
      case 'finished':
        return `${baseClass} ${styles.statusFinished}`;
      default:
        return baseClass;
    }
  };

  const getTeamPlayers = (teamId: string) => {
    if (!event?.players) return [];
    return event.players.filter(player => player.current_team_id === teamId);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const formatMessageTime = (dateTimeString: string) => {
    try {
      const date = new Date(dateTimeString);
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return '';
    }
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


  const formatContentViews = (views: number) => {
    if (!views) return '0';
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}k`;
    }
    return views.toString();
  };

  const getContentTypeEmoji = (type: string) => {
    switch (type) {
      case 'video': return '🎥';
      case 'image': return '📸';
      case 'highlight': return '⭐';
      default: return '📄';
    }
  };

  const teams = event?.teams || [];
  const players = event?.players || [];
  const chatMessages = event?.chat_messages || [];
  const stats = event?.stats || { views: 0, shares: 0, last_updated: '' };
  const startDateTime = formatDateTime(event?.start_datetime || '');

  return (
    <div className={styles.container}>
      <nav className={styles.topNav}>
        <div className={styles.navContent}>
          <img src="/photos/controller.png" alt="Controller" className={styles.navController} />
          <h1>eSports</h1>
          <div className={styles.navLinks}>
            <a href="#">HOME</a>
            <a href="#" className={styles.homeLink}>Browse</a>
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
      <div className={styles.eventContent}>
        <div className={styles.leftSidebar}>
          <h3 className={styles.sidebarTitle}>Teams & Players</h3>
          {teams.map((team) => {
            const teamPlayers = getTeamPlayers(team.team_id);
            return (
              <div key={team.team_id} className={styles.teamSection}>
                <div className={styles.teamHeader}>
                  <div>
                    <div className={styles.teamName}>{team.name}</div>
                    <div className={styles.teamCountry}>{team.country}</div>
                  </div>
                  <div className={styles.teamRank}>#{team.rank || 'N/A'}</div>
                </div>
                <div className={styles.playersList}>
                  {teamPlayers.map((player) => (
                    <div key={player.player_id} className={styles.playerItem}>
                      <div>
                        <div className={styles.playerName}>
                          {player.first_name} {player.last_name}
                        </div>
                        <div className={styles.playerNickname}>"{player.nickname || 'No nickname'}"</div>
                      </div>
                      <div className={styles.playerAge}>{player.age || 'N/A'}y</div>
                    </div>
                  ))}
                  {teamPlayers.length === 0 && (
                    <div className={styles.noData}>No players listed</div>
                  )}
                </div>
              </div>
            );
          })}
          {teams.length === 0 && (
            <div className={styles.noData}>No teams assigned</div>
          )}
        </div>

        <div className={styles.centerContent}>
          <div className={styles.imageContainer}>
            <img  src={`/${event?.image || 'placeholder.jpg'}`} alt={event?.title || 'Event'} className={styles.eventImage}
              onError={(e) => {e.currentTarget.src = '/photos/default-event.jpg';}}/>
              <div className={styles.imageControls}>
                <span className={styles.controlEmoji}>🔊</span>
                <span className={styles.controlEmoji}>⚙️</span>
                <span className={styles.controlEmoji}>⛶</span>
              </div>
          </div>
          <div className={styles.eventHeader}>
            <h1 className={styles.eventTitle}>{event?.title || 'Event Title'}</h1>
            <p className={styles.eventSubtitle}>{event?.game_type || 'Game Type'}</p>
            
            <div className={styles.eventMeta}>
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Status</span>
                <span className={getStatusBadge(event?.status || 'upcoming')}>{event?.status || 'upcoming'}</span>
              </div>
              
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Category</span>
                <span className={styles.metaValue}>{event?.category || 'Category'}</span>
              </div>
              
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Date</span>
                <span className={styles.metaValue}>{startDateTime.date}</span>
              </div>
              
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Time</span>
                <span className={styles.metaValue}>{startDateTime.time}</span>
              </div>
              
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Price</span>
                <span className={(event?.price || 0) > 0 ? styles.priceTag : styles.freeTag}>
                  {(event?.price || 0) > 0 ? `$${event?.price}` : 'FREE'}
                </span>
              </div>
              
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Viewers</span>
                <span className={styles.metaValue}>{formatViewers(event?.viewers || 0)}</span>
              </div>
            </div>
          </div>

          <div className={styles.eventDescription}>
            <h3 className={styles.descriptionTitle}>Event Description</h3>
            <p className={styles.descriptionText}>{event?.description || 'No description available'}</p>
          </div>

          <div className={styles.eventStats}>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{formatViews(stats.views)}</div>
              <div className={styles.statLabel}>Total Views</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{stats.shares}</div>
              <div className={styles.statLabel}>Shares</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statNumber}>{teams.length}</div>
              <div className={styles.statLabel}>Teams</div>
            </div>
          </div>
        </div>

        <div className={styles.rightSidebar}>
          <div className={styles.chatHeader}>Live Chat</div>
          
          <div className={styles.chatMessages} ref={chatMessagesRef}>
            {chatMessages.map((message) => (
              <div key={message.message_id} className={styles.chatMessage}>
                <div className={styles.chatUsername}>{message.username}</div>
                <div className={styles.chatText}>{message.message}</div>
                <div className={styles.chatTime}>{formatMessageTime(message.created_at)}</div>
              </div>
            ))}
            {chatMessages.length === 0 && (
              <div className={styles.noData}>No messages yet</div>
            )}
          </div>
          
          <div className={styles.chatInput}>
            <form onSubmit={handleSendMessage}>
              <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder={isLoggedIn ? "Type a message..." : "Login to chat"} className={styles.chatInputField} disabled={!isLoggedIn}/>
              <button type="submit" className={styles.chatSendButton} disabled={!isLoggedIn}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}