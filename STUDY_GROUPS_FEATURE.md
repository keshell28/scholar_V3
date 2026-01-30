# Study Groups Feature

## Overview
Added a comprehensive Study Groups feature to the chat system that allows students to create and join subject-specific study sessions.

## Features Implemented

### 1. Study Group Types
- **StudyGroup** interface with all necessary fields:
  - Name, subject, description
  - Creator ID and members list
  - Max members limit
  - Schedule and location information
  - Online/offline mode
  - Tags for easy discovery
  - Next session date tracking

### 2. User Interface

#### Chat Page Updates
- **Tab System**: Toggle between "Chats" and "Study Groups"
- **Study Groups List**: 
  - Browse all available study groups
  - See member count, location type (online/offline), and next session
  - Filter by name, subject, or tags
  - Visual indicators for joined/full groups

#### Create Study Group
- Modal form with fields:
  - Group name and subject
  - Description
  - Maximum members (2-20)
  - Schedule
  - Online/offline toggle
  - Physical location (if offline)
  - Tags for categorization

#### Study Group Details
- Beautiful detail view showing:
  - Full group information
  - Schedule and location details
  - Member count and availability
  - List of current members
  - Join/Leave functionality
  - Next session countdown

### 3. Mock Data
Pre-populated with 5 diverse study groups:
1. **Advanced Calculus Study Group** - Mathematics
2. **Data Structures & Algorithms** - Computer Science  
3. **Organic Chemistry Masters** - Chemistry
4. **Economics Study Circle** - Economics
5. **African History & Politics** - History

### 4. State Management
Enhanced `chatStore.ts` with:
- `studyGroups` state
- `createStudyGroup()` - Create new study groups
- `joinStudyGroup()` - Join existing groups
- `leaveStudyGroup()` - Leave groups

## How to Use

### For Students:
1. Navigate to the Chat page
2. Click the "Study Groups" tab
3. Browse available groups or search by subject/tags
4. Click on a group to view details
5. Click "Join Group" to become a member
6. Create your own group using the "Create Study Group" button

### Creating a Group:
1. Click "Create Study Group" button
2. Fill in required fields (name, subject, description)
3. Set maximum members (default: 6)
4. Add schedule and location
5. Toggle online/offline mode
6. Add relevant tags
7. Click "Create Group"

## Technical Details

### New Types (`types/index.ts`)
```typescript
interface StudyGroup {
  id: string;
  name: string;
  subject: string;
  description: string;
  creatorId: string;
  members: User[];
  maxMembers: number;
  schedule?: string;
  location?: string;
  isOnline: boolean;
  createdAt: Date;
  nextSession?: Date;
  tags: string[];
}

interface StudySession {
  id: string;
  groupId: string;
  title: string;
  date: Date;
  duration: number;
  location?: string;
  isOnline: boolean;
  attendees: string[];
  notes?: string;
}
```

### Key Components
- Study group list with filtering
- Create group modal
- Study group detail view
- Member management
- Responsive design for mobile and desktop

## Benefits

1. **Academic Support**: Students can find peers studying the same subjects
2. **Structured Learning**: Scheduled sessions help maintain consistency
3. **Flexible Options**: Both online and in-person study groups
4. **Discovery**: Tags and search make it easy to find relevant groups
5. **Community Building**: Connect with fellow students beyond 1-on-1 chats

## Future Enhancements

Potential additions:
- Study session scheduling within groups
- Group chat functionality
- Resource sharing (notes, documents)
- Session attendance tracking
- Calendar integration
- Notifications for upcoming sessions
- Rating/review system for groups
- Group announcements
- Private vs. public groups
- Invitation system

## Testing

Visit: **http://localhost:5174**

1. Login to the app
2. Go to Chat page
3. Switch to "Study Groups" tab
4. Explore existing groups
5. Create a new study group
6. Join and leave groups
