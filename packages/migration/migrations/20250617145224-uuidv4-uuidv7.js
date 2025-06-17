'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface) {
    await queryInterface.sequelize.query(
        `CREATE EXTENSION IF NOT EXISTS pg_uuidv7 WITH SCHEMA public;`
    );
    await queryInterface.sequelize.query(
        `COMMENT ON EXTENSION pg_uuidv7 IS 'pg_uuidv7: 
            create UUIDv7 values in postgres';`
    );
    await queryInterface.sequelize.query(
        `alter table public.captain
          alter column id set default uuid_generate_v7();`
    );
    await queryInterface.sequelize.query(
        `alter table public.entrant_player
                alter column id set default uuid_generate_v7();`
    );
    await queryInterface.sequelize.query(
        `alter table public.entrant_team
                alter column id set default uuid_generate_v7();`
    );
    await queryInterface.sequelize.query(
        `alter table public.pairing
                alter column id set default uuid_generate_v7();`
    );
    await queryInterface.sequelize.query(
        `alter table public.player
                alter column id set default uuid_generate_v7();`
    );
    await queryInterface.sequelize.query(
        `alter table public.round
                alter column id set default uuid_generate_v7();`
    );
    await queryInterface.sequelize.query(
        `alter table public.team
                alter column id set default uuid_generate_v7();`
    );
  },

  async down (queryInterface) {
    await queryInterface.sequelize.query(
        `alter table public.captain
          alter column id set default uuid_generate_v4();`
    );
    await queryInterface.sequelize.query(
        `alter table public.entrant_player
                alter column id set default uuid_generate_v4();`
    );
    await queryInterface.sequelize.query(
        `alter table public.entrant_team
                alter column id set default uuid_generate_v4();`
    );
    await queryInterface.sequelize.query(
        `alter table public.pairing
                alter column id set default uuid_generate_v4();`
    );
    await queryInterface.sequelize.query(
        `alter table public.player
                alter column id set default uuid_generate_v4();`
    );
    await queryInterface.sequelize.query(
        `alter table public.round
                alter column id set default uuid_generate_v4();`
    );
    await queryInterface.sequelize.query(
        `alter table public.team
                alter column id set default uuid_generate_v4();`
    );
  }
};
