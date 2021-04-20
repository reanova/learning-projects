export const PIANO_KEY_COUNT = 88;

export const SCALES = {
  Major: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1],
  Minor: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0],
  Chromatic: [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
};

export const COLORS = Array(12)
  .fill()
  .map((_x, index) => `hsla(${(360 / 13) * index}, 100%, 50%, 0.5)`);

export const KEYS = [
  'C',
  'C#/Db',
  'D',
  'D#/Eb',
  'E',
  'F',
  'F#/Gb',
  'G',
  'G#/Ab',
  'A',
  'A#/Bb',
  'B'
];
