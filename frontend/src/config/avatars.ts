export const AVATARS = [
  { id: 'default', url: '/src/assets/img/logo.jpeg', label: 'Bote' },
  { id: 'leaf', url: '/avatars/avatar_leaf.png', label: 'Hoja' },
  { id: 'earth', url: '/avatars/avatar_earth.png', label: 'Tierra' },
  { id: 'sprout', url: '/avatars/avatar_sprout.png', label: 'Brote' },
  { id: 'water', url: '/avatars/avatar_water.png', label: 'Gota' },
];

export const getAvatarUrl = (avatar: string | undefined): string => {
  if (!avatar) return AVATARS[0].url;
  if (avatar.startsWith('http')) return avatar;
  const found = AVATARS.find(a => a.id === avatar);
  return found ? found.url : AVATARS[0].url;
};
