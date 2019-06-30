# Victory Road

#### Developer Notes
To get the application running in development:
1. In `firebase.json` ensure `const production=process.env.NODE_ENV==="production";` results in `true`
2. Ensure your `.env` file is correct (the values do not need to be string quoted). See `.env.example` 
3. Remember to `npm install` before running `npm start`