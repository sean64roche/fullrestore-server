import express from 'express';
import sequelize from '../config/database';
import playerRoutes from '../routes/playerRoutes';
import tournamentRoutes from '../routes/tournamentRoutes';
import formatRoutes from '../routes/formatRoutes';
import roundRoutes from '../routes/roundRoutes';
import pairingRoutes from '../routes/pairingRoutes';
import entrantPlayerRoutes from '../routes/entrantPlayerRoutes';
import replayRoutes from '../routes/replayRoutes';

// Import other route files as needed

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/players', playerRoutes)
  .use('/api/tournaments', tournamentRoutes)
  .use('/api/formats', formatRoutes)
  .use('/api/entrantPlayers', entrantPlayerRoutes)
  .use('/api/rounds', roundRoutes)
  .use('/api/pairings', pairingRoutes)
  .use('/api/replays', replayRoutes);

// Add other route middleware

// Database connection
async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Uncomment if you want to sync models (careful in production)
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeDatabase();
});

export default app;