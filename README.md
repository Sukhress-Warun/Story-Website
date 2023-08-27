# Story Website

An Website to post stories and get ratings & reviews from users.

## User 

- **Sign Up**: Users can create accounts by providing their Name, Email, and Password.
- **Profile**: Users can create a profile where they can share a brief "About" section.
- **Post Stories**: Authenticated users can post their own stories, including the Title, Description, and the Story content itself.
- **View Stories**: Users can read stories posted by themselves and other authors on the platform.
- **Rate Stories**: Users can rate stories posted by other authors, contributing to the story's Average rating and Number of ratings.
- **Explore Authors**: Users can explore and view profiles of other authors on the platform.

## Story 

- **Title**: Each story has a title that represents its content.
- **Description**: A short description or summary of the story's content.
- **Story Content**: The main body of the story, where authors can share their creative work.
- **Average Rating**: Stories will have an average rating based on the ratings provided by other users.
- **Number of Ratings**: The total number of ratings given to a story.

## Review 

- **Rating**: Users can provide a numeric rating from 0 to 5 for stories they have read.
- **Review**: Users can write a text comment as a review for stories they have read.

## Constraints

- **Authentication**: User authentication is required for posting stories, rating stories, and accessing personalized features.
- **Rating and Review**: Users can rate and review stories by other authors. However, users cannot rate and review their own stories.
- **One Rating per Story**: Users can give only one rating for each story.

## Technologies Used

- **Backend**: Node.js and Express for server-side logic and routing.
- **Database**: MongoDB for storing user profiles, stories, ratings.
- **Frontend**: Pug for server-side rendering of web pages.