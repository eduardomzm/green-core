import { getAvatarUrl } from '../../config/avatars';

interface Props {
  avatar?: string;
  className?: string;
  alt?: string;
}

export default function UserAvatar({ avatar, className = "w-full h-full object-cover", alt = "Avatar" }: Props) {
  return (
    <img 
      src={getAvatarUrl(avatar)} 
      alt={alt} 
      className={className}
    />
  );
}
