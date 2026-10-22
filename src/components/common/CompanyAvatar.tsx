import { Avatar } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { getInitials } from '../../utils/applications';

interface CompanyAvatarProps {
  name: string;
  size?: number;
}

/** Neutral monogram — deliberately not colour-coded so status colours stay meaningful. */
export default function CompanyAvatar({ name, size = 36 }: CompanyAvatarProps) {
  return (
    <Avatar
      variant="rounded"
      aria-hidden
      sx={(theme) => ({
        width: size,
        height: size,
        fontSize: size * 0.38,
        borderRadius: size > 44 ? 3 : 2,
        color: 'primary.main',
        bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.08 : 0.16),
        border: `1px solid ${alpha(theme.palette.primary.main, 0.16)}`,
      })}
    >
      {getInitials(name)}
    </Avatar>
  );
}