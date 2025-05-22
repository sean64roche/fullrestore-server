import express from 'express';
import sequelize from '../config/database';
import playerRoutes from '../routes/playerRoutes';
import playerAliasRoutes from '../routes/playerAliasRoutes';
import tournamentRoutes from '../routes/tournamentRoutes';
import formatRoutes from '../routes/formatRoutes';
import roundRoutes from '../routes/roundRoutes';
import roundByeRoutes from '../routes/roundByeRoutes';
import pairingRoutes from '../routes/pairingRoutes';
import entrantPlayerRoutes from '../routes/entrantPlayerRoutes';
import replayRoutes from '../routes/replayRoutes';
import { authenticateToken } from '../config/auth.js';
import { initAssociations } from "../associations/initAssociations";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(authenticateToken);

// Routes
app.use('/api/players', playerRoutes)
  .use('/api/playerAliases', playerAliasRoutes)
  .use('/api/tournaments', tournamentRoutes)
  .use('/api/formats', formatRoutes)
  .use('/api/entrantPlayers', entrantPlayerRoutes)
  .use('/api/rounds', roundRoutes)
  .use('/api/roundByes', roundByeRoutes)
  .use('/api/pairings', pairingRoutes)
  .use('/api/replays', replayRoutes);

async function initDatabase() {
  try {
    initAssociations();
    await sequelize.authenticate();
    console.log('Database connection established successfully.');
    
    // Uncomment if you want to sync models (careful in production)
    await sequelize.sync({ alter: true });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initDatabase();
});

export default app;