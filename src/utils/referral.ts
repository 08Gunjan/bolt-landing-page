const STORAGE_KEY = 'mm.waitlist.position';

export const buildReferralLink = (userId?: string): string => {
  const ref = userId ?? 'demo';
  return `${window.location.origin}/?ref=${ref}`;
};

export const getMockPosition = (): number => {
  let position = localStorage.getItem(STORAGE_KEY);
  if (!position) {
    const randomPosition = Math.floor(Math.random() * (980 - 120 + 1)) + 120;
    position = randomPosition.toString();
    localStorage.setItem(STORAGE_KEY, position);
  }
  return parseInt(position, 10);
};
