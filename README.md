
# SpinRate

SpinRate is a modern web platform for music enthusiasts to rate and review new and popular songs, albums, and artists. The platform is built with **Remix**, **Tailwind CSS**, **TypeScript**, and **PostgreSQL**, and it utilizes Spotify's API to fetch the latest music releases daily.

## Features

-   **User Profiles**: Create, edit, and view profiles, including personal reviews and favorite tracks.
-   **Music Reviews**: Rate and review songs, albums, and artists with an easy-to-use interface.
-   **Favorites**: Mark your favorite songs and albums to easily access them later.
-   **Automated Updates**: Data from Spotify's API is automatically updated daily via a cron job.
-   **Scalable Hosting**: Hosted on DigitalOcean using App Platform and PostgreSQL database.

## Technologies Used

-   **Frontend**: Remix, React, Tailwind CSS
-   **Backend**: Node.js, Prisma
-   **Database**: PostgreSQL
-   **Content Management**: Sanity
-   **Automation**: cron-job.org for daily data updates
-   **Hosting**: DigitalOcean App Platform

## Installation

1.  Clone the repository:
    
    bash
    
    Kopiera kod
    
    `git clone https://github.com/your-username/spinrate.git
    cd spinrate` 
    
2.  Install dependencies:
    
    bash
    
    Kopiera kod
    
   

     `npm install` 
    
3.  Set up the `.env` file with your environment variables (see below).
    
4.  Run the development server:
    
    bash
    
    Kopiera kod
    
    `npm run dev` 
    
5.  Access the app at `http://localhost:3000`.
    

## Environment Variables

Create a `.env` file in the root directory with the following keys:

env

Kopiera kod

`DATABASE_URL="postgresql://<your-database-credentials>"
SPOTIFY_CLIENT_ID="<your-spotify-client-id>"
SPOTIFY_CLIENT_SECRET="<your-spotify-client-secret>"
PRISMA_ACCELERATE=1

AUTH_USERNAME="your-admin-username"
AUTH_PASSWORD="your-admin-password"` 

## Scripts

The project includes the following NPM scripts:

-   `npm run dev`: Starts the development server.
-   `npm run build`: Builds the app for production.
-   `npm run start`: Runs the production server.
-   `npm run lint`: Lints the codebase using ESLint.
-   `npm run typecheck`: Checks TypeScript types.

