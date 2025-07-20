'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.sequelize.query(`
      DROP MATERIALIZED VIEW IF EXISTS round_entrant_wins;
    `);
    await queryInterface.sequelize.query(
        `CREATE MATERIALIZED VIEW IF NOT EXISTS round_entrant_wins AS
    SELECT 
      er.entrant_player_id,
      p.ps_user,
      er.round_id,
      r.round,
      t.slug AS tournament_slug,
      t.name AS tournament_name,
      CASE
        WHEN pr.winner_id = er.entrant_player_id THEN TRUE
        WHEN pr.winner_id IS NULL THEN NULL::boolean
        ELSE FALSE
      END AS win,
      CASE
        WHEN rb.entrant_player_id IS NOT NULL THEN TRUE
        ELSE FALSE
      END AS bye
    FROM round_entrant er  
    JOIN entrant_player ep ON er.entrant_player_id = ep.id
    JOIN player p ON ep.player_id = p.id
    JOIN round r ON er.round_id = r.id
    JOIN tournament t ON r.tournament_slug = t.slug
    LEFT JOIN pairing pr
      ON ( (pr.entrant1_id = er.entrant_player_id OR pr.entrant2_id = er.entrant_player_id)
        AND pr.round_id = er.round_id )
    LEFT JOIN round_bye rb
    ON rb.entrant_player_id = er.entrant_player_id AND rb.round_id = er.round_id;`
    );
    await queryInterface.sequelize.query(
        `CREATE INDEX idx_round_entrant_win ON round_entrant_wins (entrant_player_id, round_id);`
    );
  },

  async down (queryInterface) {
    await Promise.all([
      queryInterface.sequelize.query(
          `DROP INDEX IF EXISTS idx_round_entrant;`
      ),
      queryInterface.sequelize.query(
          `DROP MATERIALIZED VIEW IF EXISTS round_entrant_wins;`
      )
    ])
  }
};
