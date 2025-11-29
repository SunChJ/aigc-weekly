import * as migration_20251129_022910 from './20251129_022910';

export const migrations = [
  {
    up: migration_20251129_022910.up,
    down: migration_20251129_022910.down,
    name: '20251129_022910'
  },
];
