import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CloseRounded from '@mui/icons-material/CloseRounded';
import LinkRounded from '@mui/icons-material/LinkRounded';
import PlaceOutlined from '@mui/icons-material/PlaceOutlined';
import { getStatusColor } from '../../constants/status';
import { APPLICATION_STATUSES } from '../../types/application';
import type { ApplicationInput, ApplicationStatus, JobApplication } from '../../types/application';
import { fromDateInputValue, toDateInputValue, todayInputValue } from '../../utils/date';

interface ApplicationFormProps {
  open: boolean;
  /** When provided the dialog edits this application; otherwise it creates a new one. */
  application?: JobApplication;
  onClose: () => void;
  onSubmit: (input: ApplicationInput) => void;
}

interface FormValues {
  companyName: string;
  jobTitle: string;
  status: ApplicationStatus;
  jobUrl: string;
  location: string;
  appliedDate: string;
  notes: string;
}

type FormErrors = Partial<Record<keyof FormValues, string>>;

const toFormValues = (application?: JobApplication): FormValues => ({
  companyName: application?.companyName ?? '',
  jobTitle: application?.jobTitle ?? '',
  status: application?.status ?? 'Applied',
  jobUrl: application?.jobUrl ?? '',
  location: application?.location ?? '',
  appliedDate: application ? toDateInputValue(application.appliedDate) : todayInputValue(),
  notes: application?.notes ?? '',
});

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.companyName.trim()) errors.companyName = 'Company name is required';
  if (!values.jobTitle.trim()) errors.jobTitle = 'Job title is required';
  if (!values.appliedDate) errors.appliedDate = 'Applied date is required';
  else if (values.appliedDate > todayInputValue()) errors.appliedDate = 'Applied date can’t be in the future';
  if (values.jobUrl.trim()) {
    try {
      const url = new URL(values.jobUrl.trim());
      if (!['http:', 'https:'].includes(url.protocol)) errors.jobUrl = 'Use an http(s) link';
    } catch {
      errors.jobUrl = 'Enter a valid URL, e.g. https://company.com/jobs/123';
    }
  }
  if (values.notes.length > 1000) errors.notes = 'Notes must be 1000 characters or fewer';
  return errors;
}

/**
 * Add / edit dialog. The parent remounts it (via `key`) each time it opens,
 * so initial values are read once from `application`.
 */
export default function ApplicationForm({ open, application, onClose, onSubmit }: ApplicationFormProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isEdit = Boolean(application);

  const [values, setValues] = useState<FormValues>(() => toFormValues(application));
  const [submitted, setSubmitted] = useState(false);
  const errors = submitted ? validate(values) : {};

  const handleChange = (field: keyof FormValues) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setValues((prev) => ({ ...prev, [field]: event.target.value }));

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (Object.keys(validate(values)).length > 0) return;

    onSubmit({
      companyName: values.companyName.trim(),
      jobTitle: values.jobTitle.trim(),
      status: values.status,
      jobUrl: values.jobUrl.trim() || undefined,
      location: values.location.trim() || undefined,
      appliedDate: fromDateInputValue(values.appliedDate),
      notes: values.notes.trim() || undefined,
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      aria-labelledby="application-form-title"
    >
      <Box component="form" noValidate onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', minHeight: 0, flex: 1 }}>
        <DialogTitle id="application-form-title" sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, pr: 2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="span" sx={{ display: 'block' }}>
              {isEdit ? 'Edit application' : 'Add application'}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.25 }}>
              {isEdit ? 'Update the details for this role.' : 'Track a new role you’ve applied for.'}
            </Typography>
          </Box>
          <IconButton aria-label="Close" onClick={onClose} size="small" sx={{ mt: -0.25 }}>
            <CloseRounded fontSize="small" />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ pt: '12px !important' }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Company name"
                required
                fullWidth
                autoFocus
                value={values.companyName}
                onChange={handleChange('companyName')}
                error={Boolean(errors.companyName)}
                helperText={errors.companyName}
                placeholder="e.g. Google"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Job title"
                required
                fullWidth
                value={values.jobTitle}
                onChange={handleChange('jobTitle')}
                error={Boolean(errors.jobTitle)}
                helperText={errors.jobTitle}
                placeholder="e.g. Frontend Developer"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField select label="Status" fullWidth value={values.status} onChange={handleChange('status')}>
                {APPLICATION_STATUSES.map((status) => (
                  <MenuItem key={status} value={status}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box
                        component="span"
                        sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getStatusColor(status, theme.palette.mode) }}
                      />
                      {status}
                    </Box>
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Applied date"
                type="date"
                required
                fullWidth
                value={values.appliedDate}
                onChange={handleChange('appliedDate')}
                error={Boolean(errors.appliedDate)}
                helperText={errors.appliedDate}
                slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: todayInputValue() } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Location"
                fullWidth
                value={values.location}
                onChange={handleChange('location')}
                placeholder="e.g. Bengaluru or Remote"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <PlaceOutlined fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Job URL"
                type="url"
                fullWidth
                value={values.jobUrl}
                onChange={handleChange('jobUrl')}
                error={Boolean(errors.jobUrl)}
                helperText={errors.jobUrl}
                placeholder="https://"
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <LinkRounded fontSize="small" />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                label="Notes"
                fullWidth
                multiline
                minRows={3}
                maxRows={8}
                value={values.notes}
                onChange={handleChange('notes')}
                error={Boolean(errors.notes)}
                helperText={errors.notes ?? `${values.notes.length}/1000 · Interview prep, contacts, salary range…`}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ borderTop: 1, borderColor: 'divider', mt: fullScreen ? 'auto' : 0 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            {isEdit ? 'Save changes' : 'Add Application'}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
