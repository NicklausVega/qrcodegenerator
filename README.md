![](https://cdn.mrgamer.xyz/QRCodeGenerator.png)
# 🎯 QR Generator - Modern QR Code Platform

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/shadcn%2Fui-Components-000?style=for-the-badge&logo=shadcnui&logoColor=white" alt="shadcn/ui" />
</div>

<br />

<div align="center">
  <h3>🚀 The world's most advanced open-source QR code platform</h3>
  <p>Create stunning, trackable QR codes with enterprise-grade analytics and beautiful design</p>
</div>

---

## ✨ Features

### 🎨 **Advanced Design Studio**
- **Real-time Preview** - See changes instantly as you customize
- **Custom Gradients** - Create beautiful gradient QR codes
- **Logo Integration** - Add your brand logo seamlessly
- **Multiple Formats** - Export in PNG, SVG, PDF, EPS up to 8K resolution
- **AI-Powered Optimization (Soon)** - Machine learning for maximum scannability

### 📊 **Enterprise Analytics (WIP)**
- **Real-time Tracking** - Monitor every scan with detailed metrics
- **Location Data** - Geographic insights for your campaigns
- **Device Analytics** - Track by browser, device type, and OS
- **Conversion Optimization** - AI-powered recommendations
- **Custom Events** - Track specific user actions

### 🏢 **Team Collaboration (WIP)**
- **Role-based Permissions** - Control access across your organization
- **Brand Guidelines** - Maintain consistency across campaigns
- **Approval Workflows** - Review process for enterprise teams
- **Enterprise SSO** - Single sign-on integration
- **Audit Logs** - Complete activity tracking

### 🔐 **Enterprise Security**
- **SOC 2 Type II Compliance** - Enterprise-grade security standards
- **End-to-end Encryption** - Your data stays secure
- **GDPR Compliant** - Privacy-first approach
- **Self-hostable** - Full control over your infrastructure
- **99.9% Uptime SLA** - Reliable service you can trust

---

## 🛠 Tech Stack

### **Frontend**
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component library
- **Lucide Icons** - Beautiful icon system

### **Backend & Database**
- **Supabase** - Backend-as-a-Service
- **PostgreSQL** - Robust relational database
- **Row Level Security** - Fine-grained access control
- **Real-time Subscriptions** - Live data updates

### **QR Code Generation**
- **qrcode** - QR code generation library
- **Server-side Rendering** - Optimal performance
- **Custom Styling** - Advanced customization options

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm
- Supabase account (free tier available)

### 1. Clone the Repository

```bash
git clone https://github.com/NicklausVega/qr-generator.git
cd qr-generator
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup

Run the Supabase migrations:

```bash
npx supabase start
npx supabase db push
```

### 5. Start Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
qr-generator/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── analytics/          # Analytics dashboard
│   │   ├── auth/              # Authentication pages
│   │   ├── customize/         # QR code design studio
│   │   ├── dashboard/         # Main dashboard
│   │   └── qr/               # QR code redirect handler
│   ├── components/            # React components
│   │   ├── analytics/         # Analytics components
│   │   ├── auth/             # Authentication components
│   │   ├── dashboard/        # Dashboard components
│   │   ├── qr/              # QR code components
│   │   └── ui/              # shadcn/ui components
│   ├── hooks/                # Custom React hooks
│   ├── lib/                  # Utility libraries
│   │   ├── supabase/         # Supabase client configuration
│   │   └── utils.ts          # Utility functions
│   └── middleware.ts         # Next.js middleware
├── supabase/                 # Supabase configuration
│   ├── migrations/           # Database migrations
│   └── config.toml          # Supabase settings
└── public/                  # Static assets
```

---

## 🎯 Usage

### Creating QR Codes

1. **Sign up** for an account or log in
2. **Navigate** to the Dashboard
3. **Click** "Create QR Code"
4. **Enter** your destination URL and customize settings
5. **Download** your QR code in your preferred format

### Customizing Design

1. **Visit** the Design Studio at `/customize`
2. **Adjust** colors, gradients, and patterns
3. **Upload** your logo for branding
4. **Preview** changes in real-time
5. **Export** when satisfied with the design

### Tracking Analytics

1. **Access** the Analytics tab in your dashboard
2. **View** real-time scan data and metrics
3. **Analyze** geographic and device data
4. **Export** reports for presentations

---

## 🏗 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks

# Database
npm run db:push      # Push schema changes
npm run db:reset     # Reset database
npm run db:seed      # Seed with sample data

# Supabase
npm run supabase:start    # Start local Supabase
npm run supabase:stop     # Stop local Supabase
npm run supabase:status   # Check status
```

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `NEXT_PUBLIC_APP_URL` | Your app's public URL | ✅ |

---

## 🚀 Deployment

### Vercel (Recommended)

1. **Fork** this repository
2. **Connect** your GitHub account to Vercel
3. **Import** the project
4. **Add** environment variables
5. **Deploy** 🎉

### Self-Hosting

```bash
# Build the application
npm run build

# Start the production server
npm run start
```


---

## 🤝 Contributing

We love contributions! Please read our [Contributing Guide](./CONTRIBUTING.md) to get started.

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Code Style

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type safety
- **Conventional Commits** - Commit message format

---

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

---

## 🌟 Support

- 💬 **Community**: [GitHub Discussions](https://github.com/NicklausVega/qr-generator/discussions)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/NicklausVega/qr-generator/issues)
- 💡 **Feature Requests**: [GitHub Issues](https://github.com/NicklausVega/qr-generator/issues)

---

## 🎉 Acknowledgments

- [Next.js](https://nextjs.org/) - The React framework for production
- [Supabase](https://supabase.com/) - The open source Firebase alternative
- [shadcn/ui](https://ui.shadcn.com/) - Beautifully designed components
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful & consistent icon toolkit

---

<div align="center">
  <p>Made with ❤️ by Nicklaus Vega + Open Source Community</p>
  <p>⭐ Star us on GitHub if you love this project!</p>
</div>
