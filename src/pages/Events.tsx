import { useState } from 'react';
import { useEventStore } from '../stores/eventStore';
import { useAuthStore } from '../stores/authStore';
import { Link } from 'react-router-dom';
import { Event } from '../types';

export default function Events() {
  const { events, rsvpEvent, cancelRsvp } = useEventStore();
  const { user } = useAuthStore();
  const [filter, setFilter] = useState<'all' | 'attending' | 'interested'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === 'all' || event.category === categoryFilter;

    const matchesFilter =
      filter === 'all' ||
      (filter === 'attending' && event.attendees.includes(user?.id || '')) ||
      (filter === 'interested' && event.interested.includes(user?.id || ''));

    return matchesSearch && matchesCategory && matchesFilter;
  });

  const upcomingEvents = filteredEvents.filter(
    (event) => new Date(event.date) >= new Date()
  );
  const pastEvents = filteredEvents.filter(
    (event) => new Date(event.date) < new Date()
  );

  const handleRSVP = (eventId: string, status: 'attending' | 'interested') => {
    if (user) {
      rsvpEvent(eventId, user.id, status);
    }
  };

  const handleCancelRSVP = (eventId: string) => {
    if (user) {
      cancelRsvp(eventId, user.id);
    }
  };

  const isAttending = (event: Event) => event.attendees.includes(user?.id || '');
  const isInterested = (event: Event) => event.interested.includes(user?.id || '');

  const categories = [
    { value: 'all', label: 'All Events' },
    { value: 'meetup', label: 'Meetups' },
    { value: 'party', label: 'Parties' },
    { value: 'cultural', label: 'Cultural' },
    { value: 'academic', label: 'Academic' },
    { value: 'sports', label: 'Sports' },
    { value: 'workshop', label: 'Workshops' },
  ];

  const EventCard = ({ event }: { event: Event }) => {
    const eventDate = new Date(event.date);
    const isPast = eventDate < new Date();

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
        <div className="relative h-48">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2">
            <span className="bg-green-600 text-white px-3 py-1 rounded-full text-xs font-medium">
              {event.category}
            </span>
          </div>
          {isPast && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white text-lg font-semibold">Past Event</span>
            </div>
          )}
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {event.title}
              </h3>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400 mb-2">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                {eventDate.toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                })}
                <span className="mx-2">•</span>
                {event.time}
              </div>
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clipRule="evenodd"
                  />
                </svg>
                {event.location}
                {event.isOnline && (
                  <span className="ml-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded text-xs">
                    Online
                  </span>
                )}
              </div>
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
            {event.description}
          </p>

          <div className="flex items-center mb-4">
            <img
              src={event.organizerImage}
              alt={event.organizerName}
              className="w-8 h-8 rounded-full mr-2"
            />
            <div className="text-sm">
              <p className="text-gray-900 dark:text-white font-medium">
                {event.organizerName}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">Organizer</p>
            </div>
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
              <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span className="font-medium">{event.attendees.length}</span> attending
              <span className="mx-2">•</span>
              <span className="font-medium">{event.interested.length}</span> interested
            </div>
            {event.maxAttendees && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                Max: {event.maxAttendees}
              </span>
            )}
          </div>

          {!isPast && (
            <div className="flex gap-2">
              {isAttending(event) ? (
                <button
                  onClick={() => handleCancelRSVP(event.id)}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                >
                  ✓ Attending
                </button>
              ) : (
                <button
                  onClick={() => handleRSVP(event.id, 'attending')}
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors"
                >
                  Attend
                </button>
              )}

              {!isAttending(event) &&
                (isInterested(event) ? (
                  <button
                    onClick={() => handleCancelRSVP(event.id)}
                    className="flex-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-4 py-2 rounded-lg font-medium hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors"
                  >
                    ⭐ Interested
                  </button>
                ) : (
                  <button
                    onClick={() => handleRSVP(event.id, 'interested')}
                    className="flex-1 border-2 border-green-600 text-green-600 dark:text-green-400 px-4 py-2 rounded-lg font-medium hover:bg-green-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Interested
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-[#007AFF] via-[#5856D6] to-[#AF52DE] text-white py-20 overflow-hidden">
        {/* Subtle Background Shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent"></div>
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-black/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-[1.2rem] bg-white/15 backdrop-blur-2xl flex items-center justify-center shadow-2xl border border-white/20">
              <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-6xl font-bold tracking-tight" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif' }}>Events</h1>
              <p className="text-white/80 text-lg mt-2 font-medium">Connect and celebrate together</p>
            </div>
          </div>
          <p className="text-2xl text-white/90 max-w-3xl mb-8 leading-relaxed font-light">
            Discover meetups, parties, and cultural celebrations happening around you
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-3 bg-white/15 backdrop-blur-xl px-5 py-3 rounded-full border border-white/20">
              <div className="w-2 h-2 bg-[#30D158] rounded-full"></div>
              <span className="font-semibold">{upcomingEvents.length} Upcoming</span>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur-xl px-5 py-3 rounded-full border border-white/20">
              <span className="font-semibold">Free to Join</span>
            </div>
            <Link
              to="/events/create"
              className="bg-white text-[#007AFF] hover:bg-white/90 px-6 py-3 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              Create Event
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Actions */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <Link
            to="/events/create"
            className="bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Create Event
          </Link>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500"
          />

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategoryFilter(cat.value)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  categoryFilter === cat.value
                    ? 'bg-green-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              All Events
            </button>
            <button
              onClick={() => setFilter('attending')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'attending'
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              My Events
            </button>
            <button
              onClick={() => setFilter('interested')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'interested'
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
            >
              Interested
            </button>
          </div>
        </div>

        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Past Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        )}

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No events found. Try adjusting your filters or create a new event!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
