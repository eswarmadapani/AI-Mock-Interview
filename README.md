# 🚀 AI Mock Interview Platform

An AI-powered platform for creating and conducting mock interviews with real-time feedback and analytics.

## 🌟 Features

- **🔐 Secure Authentication** - Powered by Clerk
- **📊 Interactive Dashboard** - Modern, responsive design
- **🎯 Mock Interviews** - Create and conduct practice interviews
- **📈 Progress Tracking** - Monitor your interview performance
- **🤖 AI-Powered Feedback** - Get intelligent insights and recommendations
- **📱 Responsive Design** - Works on all devices

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 15.4.5
- **UI Library:** React 19.1.0
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **Components:** Radix UI

### Backend & Services
- **Authentication:** Clerk
- **Database:** (Coming Soon)
- **API:** Next.js API Routes
- **Deployment:** Vercel (Planned)

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/eswarmadapani/AI-Mock-Interview.git
   cd AI-Mock-Interview
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env.local file
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
   CLERK_SECRET_KEY=your_secret_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ai-mock/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   └── layout.js          # Root layout
├── components/            # Reusable components
│   └── ui/               # UI components
├── lib/                  # Utility functions
├── public/               # Static assets
├── scripts/              # Development scripts
└── DEVELOPMENT_LOG.md    # Progress tracking
```

## 🎯 Development Workflow

### Daily Development Process

1. **Start your day**
   ```bash
   git pull origin master
   npm run dev
   ```

2. **Work on features**
   - Follow the project phases in `DEVELOPMENT_LOG.md`
   - Keep commits small and focused

3. **End of day commit**
   ```bash
   # Manual commit
   git add .
   git commit -m "📅 YYYY-MM-DD: [Feature Name]
   
   🎯 Feature: Description
   📝 Changes:
   - Change 1
   - Change 2
   
   🔧 Tech: Technologies used"
   git push origin master
   
   # Or use the automated script
   ./scripts/daily-commit.sh "Feature Name" "Description"
   ```

### Project Phases

- ✅ **Phase 1: Foundation** - Authentication, Dashboard, Navigation
- 🔄 **Phase 2: Question Management** - Question creation, categories, search
- ⏳ **Phase 3: Interview System** - Mock interviews, sessions, analytics
- ⏳ **Phase 4: User Experience** - Profiles, progress tracking, insights
- ⏳ **Phase 5: Advanced Features** - AI generation, voice recognition

## 📊 Progress Tracking

Check `DEVELOPMENT_LOG.md` for:
- Daily progress updates
- Feature completion status
- Technical notes and decisions
- Weekly goals and milestones

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Clerk](https://clerk.com/) - Authentication
- [Lucide React](https://lucide.dev/) - Icons

## 📞 Contact

- **Developer:** Eswar Madapani
- **GitHub:** [@eswarmadapani](https://github.com/eswarmadapani)
- **Repository:** [AI-Mock-Interview](https://github.com/eswarmadapani/AI-Mock-Interview.git)

---

⭐ **Star this repository if you find it helpful!**
