# Public Feedback Board (PFB)

A modern, open-source public feedback tool that allows users to submit suggestions, vote on ideas, and track project roadmaps. Built with Next.js, Supabase, and Tailwind CSS.

The project is designed to be open in iframe. So it is separate from your project and uses a separate database. 

Here is an example usage:

```
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import React, { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Feedback({ 
    className = "w-1/2", 
    buttontext = "Правете заявки тук",
    variant = "default" }: { className?: string, buttontext?: string, variant?: "default" | "outline" }) {
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);

  return (
    <>

        <Button className={className} size="sm" variant={variant} onClick={() => setFeedbackDialogOpen(true)}>
            {buttontext}
        <ArrowRight className="h-4 w-4 ml-2" />
        </Button>



      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh] p-0">
          <iframe
            src="https://v0-feedback-voting-system.vercel.app/?project=merim.org"
            className="w-full h-full border-0 rounded-md"
            title="Feedback System"
          />
        </DialogContent>
      </Dialog>
      </>

    );

};
```

## Features

- **Suggestion Submission**: Users can submit ideas with titles, descriptions, and optional contact information
- **Voting System**: Community voting on suggestions to prioritize features
- **Roadmap View**: Visual roadmap showing planned, in-progress, and completed features
- **Multi-Project Support**: Support for multiple projects with unique slugs
- **Multi-Language**: Built-in support for Bulgarian and English
- **Dark/Light Theme**: Automatic theme switching with system preference detection
- **Responsive Design**: Mobile-first design that works on all devices
- **Real-time Updates**: Live updates using Supabase real-time subscriptions

## Anonymous User System

Public Feedback Board operates on a fully anonymous basis - no user registration or authentication is required. This allows users to participate freely without creating accounts or sharing personal information.

### How Anonymous Voting Works

- **No Login Required**: Users can immediately start voting on suggestions without any signup process
- **Local User Identification**: Each user is assigned a unique anonymous identifier stored in browser localStorage
- **Vote Tracking**: The system remembers which suggestions a user has voted on across browser sessions
- **Privacy-First**: No personal data is collected or stored - only anonymous identifiers and voting preferences

### User Identification and Cookies

The application uses browser localStorage (not traditional cookies) to maintain user identity:

- **Voter ID Generation**: When a user first votes, a random voter ID is generated: `voter_${randomString}`
- **Persistent Identity**: The voter ID is stored locally and persists across browser sessions
- **Cross-Project Identity**: The same voter ID works across all projects - your voting history follows you
- **View Your ID**: Users can view their anonymous voter ID in the settings menu
- **No Data Collection**: Only the anonymous ID is stored; no email, IP address, or other personal data

### Project Slugs and Multi-Project Support

Projects are organized using URL-based slugs for easy access and management:

- **URL Structure**: Access projects via `?project=slug` (e.g., `?project=myapp` or `?project=demo`)
- **Isolated Data**: Each project maintains its own suggestions, votes, and roadmap
- **Shared User Identity**: Users maintain the same anonymous identity across all projects
- **Admin Control**: Project administrators can create and manage multiple feedback boards
- **Easy Sharing**: Simple URLs make it easy to share project-specific feedback forms

This design allows organizations to run multiple feedback campaigns while maintaining user continuity and privacy.

## Administration and Project Management

All administrative tasks for Public Feedback Board are performed directly through the Supabase Dashboard. This approach provides a user-friendly interface for managing projects, content, and data without requiring custom admin panels.

### Creating and Managing Projects

- **Add New Projects**: Insert records into the `projects` table with unique slugs, names, and descriptions
- **Project Configuration**: Set project-specific settings and metadata through the Supabase table editor
- **Multi-Project Setup**: Easily create separate feedback boards for different products or initiatives

### Managing Suggestions and Votes

- **Edit Suggestions**: Modify suggestion titles, descriptions, and contact information directly in the database
- **Moderate Content**: Remove inappropriate or duplicate suggestions through the Supabase interface
- **Vote Management**: View, edit, or remove votes if needed for moderation purposes
- **Bulk Operations**: Perform bulk edits or deletions using Supabase's query tools

### Roadmap Management

- **Create Roadmap Items**: Add new features, improvements, and milestones to the `roadmap_items` table
- **Update Status**: Change roadmap item status (Planned, To Do, In Progress, Done) through the dashboard
- **Reorder Items**: Adjust the priority and order of roadmap items
- **Track Progress**: Monitor development progress and update completion status

### Database Administration

- **SQL Queries**: Run custom queries for analytics, reporting, or complex operations
- **Data Export**: Export suggestion data, vote statistics, and roadmap information
- **Backup and Restore**: Manage database backups through Supabase's built-in tools
- **Real-time Monitoring**: View live data changes and user activity through Supabase's real-time features

### Access Control

- **Supabase Authentication**: Use Supabase's built-in authentication and authorization
- **Row Level Security**: Configure RLS policies to control data access permissions
- **API Keys**: Manage service role keys for administrative operations

This dashboard-based approach simplifies administration while providing powerful tools for managing feedback at scale. Administrators can focus on content management rather than building custom admin interfaces.

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd PFB
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Set up the database:
   Run the SQL scripts in the `scripts/` directory in order:
   ```bash
   # These scripts set up the database schema and insert demo data
   # Run them in your Supabase SQL editor or via psql
   ```

## Usage

1. Start the development server:
   ```bash
   pnpm dev
   ```

2. Open [http://localhost:3000](http://localhost:3000) in your browser

3. Access different projects by adding `?project=slug` to the URL (e.g., `?project=demo`)

## Project Structure

```
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (suggestions)
│   └── roadmap/           # Roadmap page
├── components/            # React components
│   ├── ui/               # Reusable UI components (Radix UI)
│   └── ...               # Feature-specific components
├── hooks/                # Custom React hooks
├── lib/                  # Utility libraries
│   ├── supabase/         # Supabase client configuration
│   └── translations.ts   # Multi-language support
├── scripts/              # Database setup scripts
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## Database Schema

The application uses Supabase with the following main tables:
- `projects`: Project information
- `suggestions`: User-submitted suggestions
- `votes`: User votes on suggestions
- `roadmap_items`: Roadmap entries with status tracking

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For questions or support, please open an issue on GitHub.

## Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fgregordimi%2FPFB&products=%5B%7B%22type%22%3A%22integration%22%2C%22integrationSlug%22%3A%22supabase%22%2C%22productSlug%22%3A%22supabase%22%2C%22protocol%22%3A%22storage%22%7D%5D)

Here is the set of environment variables. Not sure if they would be automatically created:

```
SUPABASE_POSTGRES_URL=
SUPABASE_POSTGRES_USER=
SUPABASE_POSTGRES_HOST=
SUPABASE_JWT_SECRET=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_POSTGRES_PRISMA_URL=
SUPABASE_POSTGRES_PASSWORD=
SUPABASE_POSTGRES_DATABASE=
SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_POSTGRES_URL_NON_POOLING=
```

## WARNING

Use at your own risk
