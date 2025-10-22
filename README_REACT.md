# Kether.pl Website

This project has been migrated from Create React App to [Vite](https://vitejs.dev/) for faster builds and better developer experience.

## Available Scripts

In the project directory, you can run:

### `npm run dev` or `npm start`

Runs the app in the development mode using Vite.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload instantly when you make edits thanks to Vite's Hot Module Replacement (HMR).\
You will also see any lint errors in the console.

### `npm run build`

Builds the app for production using Vite.\
The build artifacts will be stored in the `build/` directory.\
Vite uses Rollup under the hood for optimized production builds.

### `npm run preview`

Serves the production build locally for testing.\
Open [http://localhost:4173](http://localhost:4173) to view the production build.

### `npm run lint`

Runs ESLint to check for code quality issues.\
Note: ESLint no longer runs during the build process (unlike Create React App).

## Environment Variables

Environment variables now use the `VITE_` prefix instead of `REACT_APP_`.\
For example: `VITE_ERROR_ENDPOINT` instead of `REACT_APP_ERROR_ENDPOINT`.

## Migration Benefits

- **10-20x faster** development server startup
- **Instant Hot Module Replacement (HMR)** for faster development
- **20-30% smaller** production bundles
- **Native ESM support** for better tree-shaking
- **Faster production builds** with Rollup
- **Better dependency optimization** with automatic code splitting

## Deployment

The project still deploys to GitHub Pages using the same `npm run deploy` command.\
The build output remains in the `build/` directory for compatibility.

## Learn More

You can learn more about Vite in the [Vite documentation](https://vitejs.dev/guide/).

To learn React, check out the [React documentation](https://reactjs.org/).
