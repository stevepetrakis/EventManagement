import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import styles from '../../styles/AddEvent.module.css';

export default function AddEvent() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [image, setImage] = useState('');
  const [state, setState] = useState('upcoming');
  const [price, setPrice] = useState('');
  const [team1, setTeam1] = useState('');
  const [team2, setTeam2] = useState('');
  const [gameType, setGameType] = useState('');
  const [category, setCategory] = useState('');
  const [isPopular, setIsPopular] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [userType, setUserType] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [creatorId, setCreatorId] = useState(''); 
  
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const getCreatorId = async (userId: string): Promise<string | null> => {
    try {
      const response = await fetch(`http://localhost:5000/auth/creator-id/${userId}`);
      if (response.ok) {
        const data = await response.json();
        return data.creator_id;
      } else {
        throw new Error('Creator not found');
      }
    } catch (error) {
      console.error('Error fetching creator ID:', error);
      setError('You must be a creator to create events');
      return null;
    }
  };

  const getNextEventId = async () => {
    try {
      const response = await fetch('http://localhost:5000/events/count');
      if (response.ok) {
        const data = await response.json();
        const nextId = data.count + 1;
        return 'E' + nextId.toString().padStart(3, '0');
      } else {
        throw new Error('Failed to get event count');
      }
    } catch (error) {
      console.error('Error getting next event ID:', error);
      return 'E' + Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    }
  };

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user') || sessionStorage.getItem('user');
      const userTypeData = localStorage.getItem('userType') || sessionStorage.getItem('userType');
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setUsername(user.username || 'Visitor');
          if (user.user_id) {
            getCreatorId(user.user_id).then((creator_id) => {
              if (creator_id) {
                setCreatorId(creator_id);
              }
            });
          }
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

  const isLoggedIn = isClient && typeof window !== 'undefined' && 
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!creatorId) {
      setError('You must be a creator to create events');
      return;
    }

    if (!team1 || !team2) {
      setError('Please select both teams');
      return;
    }

    if (team1 === team2) {
      setError('Please select different teams');
      return;
    }

    try {
      const eventId = await getNextEventId();

      const startDateTime = date && time ? `${date} ${time}:00` : null;
      const endDateTime = endDate && endTime ? `${endDate} ${endTime}:00` : null;

      const eventResponse = await fetch('http://localhost:5000/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event_id: eventId,
          title,
          game_type: gameType,
          category,
          status: state, 
          is_popular: isPopular,
          viewers: 0,
          image,
          price: parseFloat(price) || 0,
          description,
          start_datetime: startDateTime,
          end_datetime: endDateTime,
          creator_id: creatorId, 
          team1_id: team1,
          team2_id: team2
        }),
      });

      if (eventResponse.ok) {
        setSuccess('Event created successfully!');
        
        setTitle('');
        setDescription('');
        setDate('');
        setTime('');
        setEndDate('');
        setEndTime('');
        setImage('');
        setTeam1('');
        setTeam2('');
        setState('upcoming');
        setPrice('');
        setGameType('');
        setCategory('');
        setIsPopular(false);
        
        setTimeout(() => {
          router.push('/events');
        }, 2000);
      } else {
        const data = await eventResponse.json();
        setError(data.message || 'Failed to create event');
      }
    } catch (err) {
      setError('Error connecting to the server. Please try again.');
      console.error(err);
    }
  };

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
      <h1 className={styles.title}>Create Event</h1>
      
      {error && <p className={styles.error}>{error}</p>}
      {success && <p className={styles.success}>{success}</p>}
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <h3 style={{marginBottom: '10px'}}>Event details</h3>
        
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Event Title*</label>
            <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className={styles.input} placeholder="e.g., FIFA eWorld Cup 2026"/>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="gameType">Game Type*</label>
            <input id="gameType" type="text" value={gameType} onChange={(e) => setGameType(e.target.value)} required className={styles.input} placeholder="e.g., DOTA 2, FIFA eWorld Cup"/>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="category">Category*</label>
            <input id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} required className={styles.input} placeholder="e.g., Best of 2 (Bo2), Group A"/>
          </div>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="description">Description*</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} required className={styles.textarea} rows={4}/>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="date">Start Date*</label>
            <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required className={styles.input}/>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="time">Start Time*</label>
            <input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required className={styles.input}/>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="endDate">End Date (Optional)</label>
            <input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className={styles.input}/>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="endTime">End Time (Optional)</label>
            <input id="endTime" type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className={styles.input}/>
          </div>
        </div>
        
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="image">Image URL*</label>
            <input id="image" type="text" value={image} onChange={(e) => setImage(e.target.value)} className={styles.input} placeholder="e.g., foto_for_figma/fifa_25.png"/>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="state">Status*</label>
            <select id="state" value={state} onChange={(e) => setState(e.target.value)} className={styles.select}>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="finished">Finished</option>
            </select>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="price">Price</label>
            <input id="price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className={styles.input} placeholder="0.00"/>
          </div>
        </div>

        <h3 style={{marginBottom: '10px'}}>Teams details</h3>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="team1">Team1*</label>
            <select id="team1" value={team1} onChange={(e) => setTeam1(e.target.value)} className={styles.select}>
              <option value="T001">SE PALMEIRAS</option>
              <option value="T002">FC PORTO</option>
              <option value="T003">Team Spirit</option>
              <option value="T004">Gaimin Gladiators</option>
              <option value="T005">NinjaKilla_212</option>
              <option value="T006">Rewind</option>
              <option value="T007">Atlanta</option>
              <option value="T008">OpTic Texas</option>
              <option value="T009">Navi</option>
              <option value="T010">Liquid</option>
              <option value="T011">T1</option>
              <option value="T012">G2 Esports</option>
              <option value="T013">Lucas Blakeley</option>
              <option value="T014">Jarno Opmeer</option>
              <option value="T015">Fnatic</option>
              <option value="T016">Paper Rex</option>
              <option value="T017">Bugha & Mero</option>
              <option value="T018">Malibuca & ThomasHD</option>
              <option value="T019">4 Merical Vibes</option>
              <option value="T020">Twisted Minds</option>
              <option value="T021">Team Vitality</option>
              <option value="T022">Gen.G Mobil Racing</option>
              <option value="T023">Dallas Fuel</option>
              <option value="T024">Seoul Dynasty</option>
              <option value="T025">San Francisco Shock</option>
              <option value="T026">FaZe Clan</option>
              <option value="T027">NAVI</option>
              <option value="T028">17 Gaming</option>
              <option value="T029">Danawa e-sports</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="team2">Team2*</label>
            <select id="team2" value={team2} onChange={(e) => setTeam2(e.target.value)} className={styles.select}>
              <option value="T001">SE PALMEIRAS</option>
              <option value="T002">FC PORTO</option>
              <option value="T003">Team Spirit</option>
              <option value="T004">Gaimin Gladiators</option>
              <option value="T005">NinjaKilla_212</option>
              <option value="T006">Rewind</option>
              <option value="T007">Atlanta</option>
              <option value="T008">OpTic Texas</option>
              <option value="T009">Navi</option>
              <option value="T010">Liquid</option>
              <option value="T011">T1</option>
              <option value="T012">G2 Esports</option>
              <option value="T013">Lucas Blakeley</option>
              <option value="T014">Jarno Opmeer</option>
              <option value="T015">Fnatic</option>
              <option value="T016">Paper Rex</option>
              <option value="T017">Bugha & Mero</option>
              <option value="T018">Malibuca & ThomasHD</option>
              <option value="T019">4 Merical Vibes</option>
              <option value="T020">Twisted Minds</option>
              <option value="T021">Team Vitality</option>
              <option value="T022">Gen.G Mobil Racing</option>
              <option value="T023">Dallas Fuel</option>
              <option value="T024">Seoul Dynasty</option>
              <option value="T025">San Francisco Shock</option>
              <option value="T026">FaZe Clan</option>
              <option value="T027">NAVI</option>
              <option value="T028">17 Gaming</option>
              <option value="T029">Danawa e-sports</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label style={{opacity: 0}}>Add Team</label>
            <button type="button" className={styles.addTeamButton}>
              + Add Team
            </button>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button type="button" className={styles.cancelButton} onClick={() => router.push('/events')}>Cancel</button>
          <button type="submit" className={styles.submitButton}>Create Event</button>
        </div>
      </form>
    </div>
  );
}