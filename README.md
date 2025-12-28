# Story Website


You can access a demo version of the project [here](https://story-4ii2.onrender.com/).

## User Features

- **Sign Up**: Users can create an account using their name, email, and password. Authentication is required to access protected features.
- **Profile Management**: Users can create and maintain a profile containing a brief "About" section, enabling author identity and personalization.
- **Edit Profile**: Users can update their name and "About" section with proper authorization checks.
- **Post Stories**: Authenticated users can publish stories by providing a title, description, and story content, with ownership tied to the author.
- **View Stories**: Users can read stories published by themselves and other authors on the platform.
- **Rate Stories**: Users can rate stories written by other authors. Ratings contribute to the story’s average rating and total rating count, which are derived from user-submitted feedback.
- **Explore Authors**: Users can browse and view profiles of other authors, enabling discovery of content and creators.

## Story Features

- **Title**: Each story contains a title representing its content.
- **Description**: A concise summary describing the story.
- **Story Content**: The main body of the story authored by the user.
- **Average Rating**: Dynamically calculated based on ratings submitted by different users.
- **Number of Ratings**: Displays the total count of ratings associated with a story.
- **Edit Stories**: Authors can edit stories they have posted.

## Review Features

- **Rating**: Users can submit a numeric rating between 0 and 5 for stories they have read.
- **Review Comment**: Users can provide textual feedback alongside ratings.
- **Edit Reviews**: Users can update their reviews.
- **Delete Reviews**: Users can remove their reviews, with changes reflected in the story’s rating metrics.

## Constraints & Business Rules

- **Authentication Enforcement**: Only authenticated users can post stories, submit ratings, and write reviews.
- **Ownership Restrictions**: Users cannot rate or review their own stories, ensuring unbiased feedback.
- **Single Rating per Story**: Each user is restricted to one rating per story, preventing duplicate or conflicting ratings.
- **Data Consistency**: Rating and review operations are validated to maintain accurate averages and counts across stories.


## Tech Stack

- **Runtime**: [Node.js](https://nodejs.org/)
- **Web Framework**: [Express.js](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) (ODM: Mongoose)
- **Templating Engine**: [Pug](https://pugjs.org/)
- **Authentication**: `express-session`, `bcrypt` for password hashing

## Setup & Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local server or Atlas connection string)

### Configuration

1.  Clone the repository and navigate to the project directory:
    ```bash
    git clone <repository-url>
    cd Story-Website
    ```

2.  Create a `.env` file in the root directory by copying the example:
    ```bash
    cp ".env copy" .env
    ```

3.  Open `.env` and configure your environment variables:
    ```env
    PORT=3000
    SECRET_KEY=your_super_secret_key_here
    DATABASE_URL=mongodb://localhost:27017/story_db
    CLEAR_DATABASE_ON_START=false
    LOAD_DATABASE_ON_START=false
    ADMIN_USERNAME=your_admin_username_here
    ADMIN_PASSWORD=your_admin_password_here
    ```

### Build and Run

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Start the application:
    - **Production mode**:
      ```bash
      npm start
      ```
    - **Development mode** (with nodemon):
      ```bash
      npm run DevStart
      ```

3.  Access the application at `http://localhost:3000` (or your configured port).

## API Endpoints & Routes

The application uses Server-Side Rendering (SSR) with Pug, but also exposes specific utility APIs.

### Web Interface Routes

#### User (`/user`)
- **GET** `/user/signup` - Render signup page.
- **POST** `/user/signup` - Handle account creation.
- **GET** `/user/login` - Render login page.
- **POST** `/user/login` - Handle authentication.
- **GET** `/user/signout` - Destroy session and logout.
- **GET** `/user/edit` - Render profile edit page.
- **POST** `/user/edit` - Handle profile updates.
- **GET** `/user/aboutme` - View current user's profile.
- **GET** `/user/reviews` - View reviews posted by the current user.

#### Story (`/story`)
- **GET** `/story` - List all stories.
- **GET** `/story/create` - Render story creation page.
- **POST** `/story/create` - Submit a new story.
- **GET** `/story/:id` - View a specific story.
- **GET** `/story/:id/edit` - Render story edit page (Owner only).
- **POST** `/story/:id/edit` - Update a story (Owner only).

#### Review (`/review`)
- **POST** `/review/story/:id/create` - Submit a review for a story.
- **POST** `/review/:reviewId/story/:storyId/edit` - Update or delete (via body flag) a review.

### Utility API (`/api`)

These endpoints return JSON responses and allow for database management.

- **POST** `/api/clear`
    - **Description**: Clears the entire database.
    - **Payload**: `{ "adminUsername": "...", "adminPassword": "..." }`
- **POST** `/api/load`
    - **Description**: Loads sample data into the database.
    - **Payload**: `{ "adminUsername": "...", "adminPassword": "..." }`
- **POST** `/api/reset`
    - **Description**: Clears and then reloads the database.
    - **Payload**: `{ "adminUsername": "...", "adminPassword": "..." }`