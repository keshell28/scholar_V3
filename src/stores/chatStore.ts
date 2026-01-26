import { create } from 'zustand';
import { Message, User } from '../types';

export interface Conversation {
  id: string;
  participant: User;
  lastMessage?: Message;
  unreadCount: number;
  updatedAt: Date;
}

interface ChatState {
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  activeConversationId: string | null;
  sendMessage: (receiverId: string, content: string) => void;
  markAsRead: (conversationId: string) => void;
  setActiveConversation: (conversationId: string | null) => void;
  initializeMockData: () => void;
}

// Mock data generator
const generateMockUser = (id: string, name: string, university: string): User => ({
  id,
  name,
  email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
  university,
  fieldOfStudy: 'Computer Science',
  country: 'Zimbabwe',
  city: 'Harare',
  bio: `Student at ${university}`,
  profileImage: `https://i.pravatar.cc/150?u=${id}`,
  connectionType: 'friendship',
  interests: ['Technology', 'Innovation'],
  yearsOfStudy: 2,
});

const generateMockMessage = (
  id: string,
  senderId: string,
  receiverId: string,
  content: string,
  createdAt: Date,
  read: boolean = false
): Message => ({
  id,
  senderId,
  receiverId,
  content,
  read,
  createdAt,
});

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  messages: {},
  activeConversationId: null,

  initializeMockData: () => {
    const currentUserId = 'current-user';
    
    const mockUsers = [
      generateMockUser('user-1', 'Tafadzwa Moyo', 'University of Cape Town'),
      generateMockUser('user-2', 'Nyasha Chikwamba', 'University of Witwatersrand'),
      generateMockUser('user-3', 'Rumbidzai Ndlovu', 'Harvard University'),
      generateMockUser('user-4', 'Tinashe Mukasa', 'Oxford University'),
      generateMockUser('user-5', 'Chenai Mapfumo', 'MIT'),
      generateMockUser('user-6', 'Simbarashe Mpofu', 'Tsinghua University'),
      generateMockUser('user-7', 'Tariro Sibanda', 'University of Manchester'),
      generateMockUser('user-8', 'Rudo Gumbo', 'Stanford University'),
      generateMockUser('user-9', 'Kundai Mlambo', 'University of Toronto'),
      generateMockUser('user-10', 'Takudzwa Ncube', 'Cambridge University'),
      generateMockUser('user-11', 'Chiedza Makonese', 'Yale University'),
      generateMockUser('user-12', 'Panashe Dube', 'Peking University'),
      generateMockUser('user-13', 'Tanaka Mutasa', 'University of Melbourne'),
      generateMockUser('user-14', 'Fungai Chirwa', 'National University of Singapore'),
      generateMockUser('user-15', 'Kudakwashe Banda', 'ETH Zurich'),
    ];

    // Create mock conversations and messages
    const mockConversations: Conversation[] = [];
    const mockMessages: Record<string, Message[]> = {};

    mockUsers.forEach((user, index) => {
      const conversationId = `conv-${user.id}`;
      const now = new Date();
      const hoursAgo = index * 2;

      // Generate varied conversation messages
      const messageVariations = [
        [
          "Hey! I saw you are also at UCT. Would love to connect!",
          "Hi! Yes, definitely! What are you studying?",
          "Computer Science! You too right? Maybe we could study together sometime.",
          "That sounds great! I'm also doing CS. Let's plan something.",
          "Perfect! Are you free this Friday afternoon?",
          "Friday works! What time were you thinking?",
          "How about 3pm at the library? We can grab coffee after.",
          "Sounds like a plan! I'll bring my data structures notes.",
          "Great! I'm struggling with algorithms, maybe you can help.",
          "Sure thing! I did well in that course. Happy to share my notes.",
          "You're a lifesaver! See you Friday 🙌",
          "Looking forward to it! 😊"
        ],
        [
          "Thanks for accepting my connection. How are you finding life in South Africa?",
          "It has been amazing! The people are welcoming. How about you at Wits?",
          "Great here too! We should meet up if you are ever in Johannesburg.",
          "I'd love that! I'm planning a trip there next month.",
          "Perfect timing! There's a Zim students meetup happening then.",
          "Oh really? That sounds fun! When is it?",
          "Last Saturday of the month. Usually at Melville.",
          "Nice! I love that area. Lots of good restaurants.",
          "Exactly! We always grab food after. You should definitely come.",
          "I will! Can you add me to the group chat?",
          "Sure, I'll send you the link. Everyone is really friendly.",
          "Thanks! Can't wait to meet everyone."
        ],
        [
          "Hi! I noticed you are interested in scholarships. I found some great opportunities!",
          "Oh really! Please share! I am actively looking.",
          "I will send you the links. There is a Fulbright deadline coming up next month.",
          "Thank you so much! This is really helpful.",
          "No problem! Let me know if you need help with the application.",
          "Actually, yes! I'm not sure how to approach the personal statement.",
          "I can help with that! I got a Chevening last year.",
          "Wow, congrats! Any tips on making it stand out?",
          "Focus on your unique story and how it connects to your goals.",
          "That makes sense. Should I mention my community work back home?",
          "Absolutely! That shows leadership and commitment.",
          "Great! Would you be willing to review my draft?",
          "Of course! Send it over whenever you're ready.",
          "Thank you! I'll send it by next week. Really appreciate this! 🙏"
        ],
        [
          "Hello! Are you part of the Zimbabwean students community?",
          "Yes, I am! Great group of people.",
          "We are organizing a braai this weekend. You should come!",
          "That sounds fun! Where and when?",
          "Saturday at 2pm, at the park near campus.",
          "What should I bring?",
          "Just bring yourself! But if you want, you can bring drinks or snacks.",
          "I'll bring some mazoe! Haven't had it in ages.",
          "Oh perfect! Everyone will love that! 😄",
          "Are many people coming?",
          "About 20-30 usually. Mix of undergrads and postgrads.",
          "Awesome! I'm new here so excited to meet everyone.",
          "You'll love it! We play music, eat good food, and just vibe.",
          "Can't wait! See you Saturday!"
        ],
        [
          "Hey there! Want to grab coffee sometime?",
          "Sure! I would love that. When works for you?",
          "How about this Saturday at 2pm? There is a nice cafe near campus.",
          "Perfect! See you then 😊",
          "Great! It's called The Daily Grind. Best cappuccinos!",
          "I've heard of it! Never been though.",
          "You'll love it. They also have amazing pastries.",
          "Now I'm excited! I need a good study spot anyway.",
          "Same! It's usually quiet enough to get work done.",
          "Do they have wifi?",
          "Yes, and plenty of outlets. Perfect for long study sessions.",
          "Perfect! I'll bring my laptop then.",
          "See you Saturday! ☕"
        ],
        [
          "I heard you're in China too! How are you finding it?",
          "It's been an incredible experience! The culture is fascinating.",
          "I know right! Have you tried the local food scene?",
          "Yes! The dumplings are amazing. We should explore together.",
          "Definitely! There's a great place near the university I want to show you.",
          "I'm always down for good food! When are you free?",
          "How about Wednesday evening?",
          "Wednesday works! What kind of food is it?",
          "It's a hotpot place. Super authentic and not touristy.",
          "Oh I love hotpot! Is it spicy?",
          "They have different levels. You can choose non-spicy if you want.",
          "Nah, I can handle the heat! Let's go medium spicy 🌶️",
          "Haha brave! I'll make a reservation for 7pm?",
          "Perfect! Send me the location.",
          "Will do! It's going to be great!"
        ],
        [
          "Are you attending the international students mixer next week?",
          "I wasn't planning to, but should I?",
          "Yes! It's a great networking opportunity and they have amazing food.",
          "You've convinced me! I'll be there.",
          "Great! It starts at 6pm in the student center.",
          "Should I dress formally?",
          "Smart casual is fine. Nothing too formal.",
          "Okay good! What usually happens at these events?",
          "Introductions, some games, networking sessions, then food and mingling.",
          "Sounds fun! Do you know many people going?",
          "Yeah, a bunch of us from the African students association.",
          "Oh perfect! I wanted to join that group anyway.",
          "You should! We meet every other week. Really supportive community.",
          "That's exactly what I need. Thanks for the info!",
          "Anytime! See you at the mixer! 🎉"
        ],
        [
          "Hey! I saw your post about machine learning. Very insightful!",
          "Thanks! Are you also interested in ML?",
          "Yes! I'm working on a project right now. Maybe we could collaborate?",
          "I'd love that! Let's set up a time to discuss.",
          "Great! How about a video call this week?",
          "Thursday evening works for me. Around 7pm?",
          "Perfect! What's your project about?",
          "It's a recommendation system using collaborative filtering.",
          "Interesting! I've been working on neural networks for image classification.",
          "Oh that's cool! What dataset are you using?",
          "CIFAR-10 to start, then moving to custom data.",
          "Nice! I'd love to learn more about CNNs.",
          "I can show you my code! It's all on GitHub.",
          "That would be awesome! Send me the link.",
          "Will do! Looking forward to our call on Thursday!",
          "Me too! Talk soon! 💻"
        ],
        [
          "How's the weather treating you in Toronto?",
          "It's freezing! I'm still adjusting to the winter.",
          "Haha, I remember my first winter abroad. It gets easier!",
          "I hope so! Any survival tips?",
          "Invest in a good coat and thermal layers. And hot chocolate helps! 😄",
          "I bought a coat but it's still so cold!",
          "You might need a Canada Goose level coat. They're pricey but worth it.",
          "Everyone keeps telling me that! Maybe I should save up.",
          "Also get good boots! Waterproof and insulated.",
          "Good point. I keep slipping on ice with my current shoes.",
          "Yeah, proper winter boots are essential. Check out The Bay for sales.",
          "Thanks! I'll go this weekend. How long does winter last here?",
          "Till about March/April. But you get used to it, I promise!",
          "I'll take your word for it! At least the snow is pretty ❄️"
        ],
        [
          "I heard Cambridge is beautiful this time of year!",
          "It really is! The architecture here is stunning.",
          "I'm planning to visit the UK next semester. Any must-see places?",
          "Definitely check out the colleges and go punting on the river!",
          "Thanks for the tips! Can't wait to visit.",
          "How long will you be in the UK?",
          "About a week. Want to see London and Cambridge mainly.",
          "A week is perfect! You should also visit Oxford if you have time.",
          "Good idea! Is it easy to get between cities?",
          "Yes, trains are super convenient. About an hour between each.",
          "Perfect! Any recommendations for accommodation?",
          "Airbnbs are good value. Or student hostels if you want to meet people.",
          "I might do hostels then. More social!",
          "Smart choice! Let me know when you're coming, we can meet up!",
          "Definitely! I'll keep you posted. Thanks for all the help! 🙏"
        ],
        [
          "Are you going home for the holidays?",
          "Yes! I can't wait to see family. You?",
          "Same here! I miss home-cooked sadza.",
          "Me too! And my mom's peanut butter stew.",
          "Now I'm hungry! 😂",
          "When's your flight?",
          "December 20th. Yours?",
          "Same week! December 18th.",
          "Nice! Are you flying direct?",
          "No, I have a layover in Johannesburg. You?",
          "Same route! Maybe we're on the same flight.",
          "That would be cool! What airline?",
          "Emirates. You?",
          "Different airline, but close dates. Safe travels!",
          "You too! Enjoy the holidays! 🇿🇼"
        ],
        [
          "I saw you're also studying engineering. What's your specialization?",
          "I'm in mechanical engineering. You?",
          "Electrical! We should form a study group with other Zim students.",
          "Great idea! I know a few others who would be interested.",
          "Perfect! I'll create a WhatsApp group.",
          "How many people are you thinking?",
          "Maybe 5-6? Enough to share knowledge but not too big.",
          "Good number. I can add Tinashe and Rudo.",
          "Great! I'll add Chipo and maybe Kudzi.",
          "When should we have our first meeting?",
          "How about next Tuesday? We can meet at the engineering building.",
          "Tuesday works! What time?",
          "6pm? After most classes end.",
          "Perfect! Room 301 is usually free then.",
          "I'll book it. See you Tuesday! 📚"
        ],
        [
          "How did your exams go?",
          "Better than expected! How about yours?",
          "Still have two more next week. Stressed!",
          "You've got this! Let me know if you need study materials.",
          "Thanks! I really appreciate it.",
          "What subjects are left?",
          "Microeconomics and Statistics. The tough ones!",
          "Oh I just took those last semester! I can send you my notes.",
          "Really? That would be amazing!",
          "Yeah, I also have some practice exams with solutions.",
          "You're a legend! When can you send them?",
          "I'll email them tonight. What's your email?",
          "It's in my profile. Thanks so much!",
          "No problem! We all help each other out. Good luck!",
          "Thanks! I'll let you know how it goes! 🤞"
        ],
        [
          "Have you found a good place to get African food near campus?",
          "Yes! There's a spot about 15 minutes away. Amazing jollof!",
          "Really? Can you share the location?",
          "I'll send you the address. We should go together sometime!",
          "Definitely! I've been craving proper African food.",
          "Same! The dining hall food is getting old.",
          "Tell me about it! I miss variety.",
          "This place has everything - jollof, plantains, suya, all of it!",
          "Stop, you're making me too hungry! 😅",
          "Haha sorry! When are you free to go?",
          "I'm free this weekend. Saturday lunch?",
          "Saturday works! I'll pick you up around 12?",
          "Perfect! Can't wait to have real food!",
          "Same! It's going to be so good! 🍛"
        ],
        [
          "Congrats on your internship! That's awesome!",
          "Thank you! I'm really excited about it.",
          "You deserve it! When do you start?",
          "Next month. It's going to be intense but I'm ready.",
          "You'll do great! Keep me updated on how it goes.",
          "Thanks for the support! It's with a tech company in the city.",
          "Oh wow! What will you be working on?",
          "Software development, mainly backend systems.",
          "That's perfect for your major! Paid?",
          "Yes, thankfully! The stipend is pretty good too.",
          "That's amazing! You can finally stop eating ramen every day 😂",
          "Haha exactly! First paycheck is going to groceries!",
          "You've earned it! Let's celebrate when you start!",
          "Definitely! I'll treat us to that restaurant you mentioned.",
          "Deal! So proud of you! 🎉"
        ]
      ];

      const conversationMessages = messageVariations[index % messageVariations.length];
      const messages: Message[] = [];

      conversationMessages.forEach((content, msgIndex) => {
        const isUserMessage = msgIndex % 2 === 1;
        const messageTime = new Date(now.getTime() - (hoursAgo + (conversationMessages.length - msgIndex)) * 60 * 60 * 1000);
        
        messages.push(generateMockMessage(
          `msg-${conversationId}-${msgIndex + 1}`,
          isUserMessage ? currentUserId : user.id,
          isUserMessage ? user.id : currentUserId,
          content,
          messageTime,
          msgIndex < conversationMessages.length - 1 || index < 5
        ));
      });

      mockMessages[conversationId] = messages;

      mockConversations.push({
        id: conversationId,
        participant: user,
        lastMessage: messages[messages.length - 1],
        unreadCount: index > 4 ? Math.floor(Math.random() * 3) : 0,
        updatedAt: messages[messages.length - 1].createdAt,
      });
    });

    // Sort by most recent
    mockConversations.sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    );

    set({ conversations: mockConversations, messages: mockMessages });
  },

  sendMessage: (receiverId, content) => {
    const currentUserId = 'current-user';
    const conversationId = `conv-user-${receiverId}`;
    const messageId = `msg-${Date.now()}`;
    const now = new Date();

    const newMessage: Message = {
      id: messageId,
      senderId: currentUserId,
      receiverId,
      content,
      read: false,
      createdAt: now,
    };

    set((state) => {
      const existingMessages = state.messages[conversationId] || [];
      const updatedMessages = [...existingMessages, newMessage];

      const updatedConversations = state.conversations.map(c =>
        c.id === conversationId
          ? { ...c, lastMessage: newMessage, updatedAt: now }
          : c
      );

      // Sort conversations by most recent
      updatedConversations.sort((a, b) => 
        b.updatedAt.getTime() - a.updatedAt.getTime()
      );

      return {
        messages: {
          ...state.messages,
          [conversationId]: updatedMessages,
        },
        conversations: updatedConversations,
      };
    });
  },

  markAsRead: (conversationId) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
      messages: {
        ...state.messages,
        [conversationId]: state.messages[conversationId]?.map(msg => ({
          ...msg,
          read: true,
        })) || [],
      },
    }));
  },

  setActiveConversation: (conversationId) => {
    set({ activeConversationId: conversationId });
    if (conversationId) {
      get().markAsRead(conversationId);
    }
  },
}));
