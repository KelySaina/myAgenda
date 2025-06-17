# MyAgenda - Personal Event Manager

A beautiful, production-ready React web application for managing personal events and schedules, built with Supabase integration for authentication, real-time updates, and data persistence.

## 🚀 Features

- **Secure Authentication**: Email/password authentication with Supabase Auth
- **Event Management**: Create, read, update, and delete personal events
- **Real-time Updates**: Instant synchronization across browser sessions
- **Email Notifications**: Event creation confirmations and reminders
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Form Validation**: Comprehensive client-side validation
- **Search & Filter**: Find events quickly with search functionality

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth, Database, Realtime)
- **Icons**: Lucide React
- **Email**: EmailJS (optional)

## 📦 Setup Instructions

### 1. Clone and Install

```bash
npm install
```

### 2. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. In your Supabase dashboard, go to Settings → API
3. Copy your project URL and anon key
4. Run the SQL migration from `supabase/migrations/create_events_table.sql` in your Supabase SQL editor

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# EmailJS Configuration (optional)
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

### 4. Run Development Server

```bash
npm run dev
```

## 📧 Email Notifications Setup (Optional)

1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Create a service and template
3. Add your credentials to the `.env` file
4. Email notifications will be sent for event creation

## 🗄️ Database Schema

The app uses a single `events` table with the following structure:

```sql
events (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users,
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  created_at timestamptz,
  updated_at timestamptz
)
```

Row Level Security (RLS) is enabled to ensure users can only access their own events.

## 🚀 Deployment

### Frontend (Vercel/Netlify)

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to your preferred hosting service

3. Set environment variables in your hosting platform

### Backend

Supabase is already hosted - no additional deployment needed!

## 🎨 Design Features

- **Apple-level Design Aesthetics**: Clean, sophisticated, and user-friendly
- **Responsive Grid System**: Adapts beautifully to all screen sizes
- **Micro-interactions**: Smooth hover states and transitions
- **Color System**: Comprehensive color palette with proper contrast ratios
- **Typography**: Readable fonts with proper hierarchy
- **8px Spacing System**: Consistent visual alignment

## 🔧 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx
│   ├── EventList.tsx
│   ├── EventForm.tsx
│   ├── EventCard.tsx
│   └── LoadingSpinner.tsx
├── pages/              # Page-level components
│   ├── Login.tsx
│   ├── Register.tsx
│   └── Dashboard.tsx
├── services/           # External service integrations
│   ├── supabase.ts
│   └── emailService.ts
├── hooks/              # Custom React hooks
│   ├── useAuth.tsx
│   └── useEvents.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── App.tsx
└── main.tsx
```

## 🛡️ Security Features

- Row Level Security (RLS) on all database tables
- JWT-based authentication with Supabase
- Secure environment variable handling
- Client-side form validation with server-side backup
- CSRF protection through Supabase's built-in security

## 📱 Browser Support

- Chrome 80+
- Firefox 74+
- Safari 13+
- Edge 80+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for errors
2. Verify your Supabase configuration
3. Ensure environment variables are set correctly
4. Check network connectivity

For additional help, please refer to the [Supabase documentation](https://supabase.com/docs) or create an issue in this repository.