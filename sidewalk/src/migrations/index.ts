import * as migration_20251229_105041 from './20251229_105041';
import * as migration_20260209_234905 from './20260209_234905';

export const migrations = [
  {
    up: migration_20251229_105041.up,
    down: migration_20251229_105041.down,
    name: '20251229_105041',
  },
  {
    up: migration_20260209_234905.up,
    down: migration_20260209_234905.down,
    name: '20260209_234905'
  },
];
