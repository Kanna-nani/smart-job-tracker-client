import { useState } from 'react';
import type { ChangeEvent, FormEvent, ReactNode } from 'react';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Switch,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import type { PaletteMode } from '@mui/material';
import LightModeOutlined from '@mui/icons-material/LightModeOutlined';
import DarkModeOutlined from '@mui/icons-material/DarkModeOutlined';
import PageHeader from '../components/common/PageHeader';
import SectionCard from '../components/common/SectionCard';
import { WEEKLY_APPLICATION_GOAL } from '../constants/layout';
import { MOCK_USER } from '../data/mockUser';
import { useApplications } from '../hooks/useApplications';
import { useColorMode } from '../hooks/useColorMode';
import { getInitials } from '../utils/applications';

interface SettingRowProps {
  label: string;
  description: string;
  control: ReactNode;
  htmlFor?: string;
}

function SettingRow({ label, description, control, htmlFor }: SettingRowProps) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, py: 1.5 }}>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="subtitle2" component="label" htmlFor={htmlFor} sx={{ display: 'block' }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      </Box>
      <Box sx={{ flexShrink: 0 }}>{control}</Box>
    </Box>
  );
}

const NOTIFICATION_SETTINGS = [
  { key: 'interviewReminders', label: 'Interview reminders', description: 'Get notified 24 hours and 1 hour before an interview.' },
  { key: 'statusUpdates', label: 'Status changes', description: 'Alert me when an application moves to a new stage.' },
  { key: 'followUps', label: 'Follow-up nudges', description: 'Remind me about applications with no response in 3 weeks.' },
  { key: 'weeklySummary', label: 'Weekly summary email', description: 'A Monday digest of your pipeline and goal progress.' },
] as const;

type NotificationKey = (typeof NOTIFICATION_SETTINGS)[number]['key'];

export default function Settings() {
  const { mode, setMode } = useColorMode();
  const { notify } = useApplications();

  const [profile, setProfile] = useState({
    name: MOCK_USER.name,
    email: MOCK_USER.email,
    role: MOCK_USER.role,
    location: MOCK_USER.location,
  });
  const [weeklyGoal, setWeeklyGoal] = useState(String(WEEKLY_APPLICATION_GOAL));
  const [defaultView, setDefaultView] = useState('table');
  const [notifications, setNotifications] = useState<Record<NotificationKey, boolean>>({
    interviewReminders: true,
    statusUpdates: true,
    followUps: true,
    weeklySummary: false,
  });

  const updateProfile = (field: keyof typeof profile) => (event: ChangeEvent<HTMLInputElement>) =>
    setProfile((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSave = (event: FormEvent) => {
    event.preventDefault();
    notify({ message: 'Settings saved locally — they’ll sync once the backend is connected.' });
  };

  return (
    <Box component="form" onSubmit={handleSave}>
      <PageHeader
        heading="Account & preferences"
        description="Manage your profile, appearance and notification preferences."
      />

      <Box sx={{ display: 'grid', gap: { xs: 2, md: 2.5 }, maxWidth: 960 }}>
        <SectionCard title="Profile" subtitle="This information appears on your workspace.">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Avatar sx={{ width: 56, height: 56, fontSize: 20, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
              {getInitials(profile.name || '?')}
            </Avatar>
            <Box>
              <Typography variant="subtitle1">{profile.name || 'Your name'}</Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {profile.role || 'Target role'}
              </Typography>
            </Box>
          </Box>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Full name" fullWidth value={profile.name} onChange={updateProfile('name')} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Email" type="email" fullWidth value={profile.email} onChange={updateProfile('email')} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Target role" fullWidth value={profile.role} onChange={updateProfile('role')} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Preferred location" fullWidth value={profile.location} onChange={updateProfile('location')} />
            </Grid>
          </Grid>
        </SectionCard>

        <SectionCard title="Preferences" subtitle="Customise how Smart Job Tracker looks and works.">
          <SettingRow
            label="Appearance"
            description="Choose a light or dark interface."
            control={
              <ToggleButtonGroup
                size="small"
                exclusive
                value={mode}
                onChange={(_, value: PaletteMode | null) => value && setMode(value)}
                aria-label="Colour mode"
              >
                <ToggleButton value="light" aria-label="Light mode">
                  <LightModeOutlined fontSize="small" sx={{ mr: { sm: 0.75 } }} />
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    Light
                  </Box>
                </ToggleButton>
                <ToggleButton value="dark" aria-label="Dark mode">
                  <DarkModeOutlined fontSize="small" sx={{ mr: { sm: 0.75 } }} />
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    Dark
                  </Box>
                </ToggleButton>
              </ToggleButtonGroup>
            }
          />
          <Divider />
          <SettingRow
            label="Weekly application goal"
            description="Shown as a progress bar in the sidebar."
            htmlFor="weekly-goal"
            control={
              <TextField
                id="weekly-goal"
                size="small"
                type="number"
                value={weeklyGoal}
                onChange={(event) => setWeeklyGoal(event.target.value)}
                sx={{ width: 120 }}
                slotProps={{
                  htmlInput: { min: 1, max: 50 },
                  input: { endAdornment: <InputAdornment position="end">/ wk</InputAdornment> },
                }}
              />
            }
          />
          <Divider />
          <SettingRow
            label="Default applications view"
            description="How the applications list opens on larger screens."
            htmlFor="default-view"
            control={
              <TextField
                id="default-view"
                select
                size="small"
                value={defaultView}
                onChange={(event) => setDefaultView(event.target.value)}
                sx={{ width: 140 }}
              >
                <MenuItem value="table">Table</MenuItem>
                <MenuItem value="cards">Cards</MenuItem>
              </TextField>
            }
          />
        </SectionCard>

        <SectionCard title="Notifications" subtitle="Decide what you want to hear about.">
          {NOTIFICATION_SETTINGS.map((setting, index) => (
            <Box key={setting.key}>
              {index > 0 && <Divider />}
              <SettingRow
                label={setting.label}
                description={setting.description}
                htmlFor={`notify-${setting.key}`}
                control={
                  <Switch
                    id={`notify-${setting.key}`}
                    checked={notifications[setting.key]}
                    onChange={(event) =>
                      setNotifications((prev) => ({ ...prev, [setting.key]: event.target.checked }))
                    }
                  />
                }
              />
            </Box>
          ))}
        </SectionCard>

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button type="reset" color="inherit" onClick={() => setProfile({ ...MOCK_USER })}>
            Reset
          </Button>
          <Button type="submit" variant="contained">
            Save changes
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
