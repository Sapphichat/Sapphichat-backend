// Core modules
import express from 'express';
// import config
import config from './src/tools/config.js';
// import API routes
import apiRoutes from './src/api/routes/index.js';

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Set up API routes
app.use('/api', apiRoutes);

// Expose static HTML page
app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'src/assets' });
});

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}`);
});