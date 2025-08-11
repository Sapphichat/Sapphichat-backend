import express from 'express';
import config from './src/tools/config.js';
import apiRoutes from './src/routes/index.js';
import { syncDatabase, checkDatabaseStatus, insertDefaultRoles } from './src/tools/syncdb.js';

const app = express();

app.use(express.json());
app.use('/api', apiRoutes);

app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'src/assets' });
});

async function startServer() {
    try {
        console.log('Starting Sapphichat Backend...');
        console.log('Checking database connection...');
        await checkDatabaseStatus();

        const needReset = process.env.SEED_RESET === 'true';

        if (process.env.NODE_ENV === 'development') {
            console.log(`Syncing database (development mode)... reset=${needReset}`);
            await syncDatabase({ alter: !needReset, force: needReset });
        } else {
            await syncDatabase({ force: needReset });
        }

        await insertDefaultRoles();

        app.listen(config.port, () => {
            console.log(`Server running on port ${config.port}`);
            console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`Database: ${config.database.dialect}`);
        });

    } catch (error) {
        console.error('Server startup error:', error.message);
        process.exit(1);
    }
}

startServer();