import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Plus, TrendingUp, BadgeCheck } from 'lucide-react';
import { Community } from '../types';

// Mock data
const mockCommunities: Community[] = [
  {
    id: '1',
    name: '🇨🇳 Zim Students in China',
    description: 'Connect with fellow Zimbabwean students studying across China',
    category: 'country',
    members: 1250,
    image: 'https://ui-avatars.com/api/?name=China+Community&size=200',
    posts: [],
    adminId: '1',
    createdAt: new Date(),
    isVerified: true,
    verificationStatus: 'approved',
  },
  {
    id: '2',
    name: '🇺🇸 Zim Students in USA',
    description: 'For Zimbabweans studying in the United States',
    category: 'country',
    members: 890,
    image: 'https://ui-avatars.com/api/?name=USA+Community&size=200',
    posts: [],
    adminId: '1',
    createdAt: new Date(),
    isVerified: true,
    verificationStatus: 'approved',
  },
  {
    id: '3',
    name: '👩‍⚕️ Nursing & Medicine Students',
    description: 'Medical students supporting each other',
    category: 'field',
    members: 560,
    image: 'https://ui-avatars.com/api/?name=Medicine&size=200',
    posts: [],
    adminId: '1',
    createdAt: new Date(),
    isVerified: false,
    verificationStatus: 'pending',
  },
  {
    id: '4',
    name: '💻 IT & Engineering',
    description: 'Tech students sharing resources and opportunities',
    category: 'field',
    members: 2100,
    image: 'https://ui-avatars.com/api/?name=Tech&size=200',
    posts: [],
    adminId: '1',
    createdAt: new Date(),
    isVerified: true,
    verificationStatus: 'approved',
  },
  {
    id: '5',
    name: '🍲 Zim Recipes Abroad',
    description: 'Share and find traditional recipes and ingredients',
    category: 'culture',
    members: 1800,
    image: 'https://ui-avatars.com/api/?name=Recipes&size=200',
    posts: [],
    adminId: '1',
    createdAt: new Date(),
    isVerified: false,
    verificationStatus: 'none',
  },
];

export default function Communities() {
  const navigate = useNavigate();
  const [communities] = useState(mockCommunities);
  const [filter, setFilter] = useState<'all' | 'country' | 'field' | 'culture'>('all');

  const filteredCommunities = filter === 'all' 
    ? communities 
    : communities.filter(c => c.category === filter);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-4 sm:py-6 md:py-8 px-3 sm:px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2">
              Communities
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
              Join groups and connect with students like you
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/communities/create')}
            className="btn-primary flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            Create Community
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
          <FilterButton
            active={filter === 'all'}
            onClick={() => setFilter('all')}
            label="All Communities"
          />
          <FilterButton
            active={filter === 'country'}
            onClick={() => setFilter('country')}
            label="By Country"
          />
          <FilterButton
            active={filter === 'field'}
            onClick={() => setFilter('field')}
            label="By Field of Study"
          />
          <FilterButton
            active={filter === 'culture'}
            onClick={() => setFilter('culture')}
            label="Culture & Lifestyle"
          />
        </div>

        {/* Communities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredCommunities.map((community) => (
            <Link
              key={community.id}
              to={`/communities/${community.id}`}
              className="card hover:shadow-xl transition-shadow"
            >
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={community.image}
                  alt={community.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                      {community.name}
                    </h3>
                    {community.isVerified && (
                      <BadgeCheck className="h-5 w-5 text-blue-500 flex-shrink-0" title="Verified Community" />
                    )}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Users className="h-4 w-4 mr-1" />
                    {community.members.toLocaleString()} members
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {community.description}
              </p>
              
              <div className="flex items-center text-sm text-[var(--color-primary-500)]">
                <TrendingUp className="h-4 w-4 mr-1" />
                Active community
              </div>
            </Link>
          ))}
        </div>

        {filteredCommunities.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No communities found in this category
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

function FilterButton({ active, onClick, label }: FilterButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors ${
        active
          ? 'bg-[var(--color-primary-500)] text-white'
          : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      {label}
    </button>
  );
}
