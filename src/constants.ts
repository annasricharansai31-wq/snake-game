import { Track } from './types';

export const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'SynthGen Alpha',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    thumbnail: 'https://picsum.photos/seed/neon1/200/200',
  },
  {
    id: '2',
    title: 'Cyber Pulse',
    artist: 'BitWave AI',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    thumbnail: 'https://picsum.photos/seed/neon2/200/200',
  },
  {
    id: '3',
    title: 'Digital Rain',
    artist: 'Neural Beats',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3',
    thumbnail: 'https://picsum.photos/seed/neon3/200/200',
  },
];

export const GRID_SIZE = 20;
export const INITIAL_SPEED = 150;
export const SPEED_INCREMENT = 2;
export const MIN_SPEED = 60;
