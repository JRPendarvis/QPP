/**
 * Prisma Configuration
 * 
 * This replaces the deprecated package.json#prisma property.
 * See: https://pris.ly/prisma-config
 */

export default {
  seed: {
    command: 'tsx prisma/seed.ts',
  },
};
