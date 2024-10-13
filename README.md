# Travel Article App

Travel Article App is a responsive web application for sharing and exploring travel destinations. Users can create, read, update, and delete travel articles, as well as interact through comments.

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/your-username/travel-article-app.git
   cd travel-article-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```
   VITE_API_BASE_URL=https://your-api-base-url.com
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Tech Stack

- React 18
- TypeScript
- Vite
- Redux Toolkit
- React Router v6
- Axios
- Chart.js
- React Toastify

## Features

1. **Responsive Design**: Fully responsive UI for mobile and desktop devices.

2. **Dashboard**: 
   - Displays analytics such as articles with the most comments.
   - Utilizes Chart.js for data visualization.

3. **Article Management**:
   - CRUD operations for articles.
   - Creative display of articles using cards.

4. **Article Listing**:
   - Lists articles with categories and comments.
   - Utilizes API query parameters for data manipulation.

5. **Profile Page**:
   - Shows destinations the user has commented on.

6. **Category Management**:
   - Superadmin page for managing article categories.

7. **Pagination**:
   - Implements pagination for articles using API pagination features.

8. **State Management**:
   - Uses Redux for effective state management of fetched data.

9. **Authentication**:
   - Login, registration, and logout functionalities.
   - Secure storage of user credentials (excluding passwords) in localStorage.

10. **Error Handling**:
    - Comprehensive error handling and user-friendly error messages.

## API Integration

This project uses the My Dummy Travel API. For detailed API documentation, visit:
[My Dummy Travel API Strapi Documentation](https://documenter.getpostman.com/view/14406239/2sAXxJiajq#2f73c35e-1594-467e-ba97-78458bdd376c)

## Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the project for production
- `npm run lint`: Run ESLint for code linting
- `npm run preview`: Preview the production build locally

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
