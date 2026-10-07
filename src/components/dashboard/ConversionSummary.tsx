import { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import ArrowForwardRounded from '@mui/icons-material/ArrowForwardRounded';
import ForumOutlined from '@mui/icons-material/ForumOutlined';
import EmojiEventsOutlined from '@mui/icons-material/EmojiEventsOutlined';
import type { JobApplication } from '../../types/application';
import { getConversionStats } from '../../utils/analytics';
import { ConversionMetric } from '../analytics/ConversionCard';
import SectionCard from '../common/SectionCard';

interface ConversionSummaryProps {
  applications: JobApplication[];
}

export default function ConversionSummary({ applications }: ConversionSummaryProps) {
  const stats = useMemo(() => getConversionStats(applications), [applications]);

  return (
    <SectionCard
      title="Conversion"
      subtitle="From application to offer"
      action={
        <Button component={RouterLink} to="/analytics" size="small" endIcon={<ArrowForwardRounded fontSize="small" />}>
          Insights
        </Button>
      }
    >
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: { xs: 2.5, sm: 3 } }}>
        <ConversionMetric
          title="Interview conversion"
          rate={stats.interviewRate}
          numerator={stats.interviewed}
          denominator={stats.total}
          caption="applications reached interviews"
          icon={ForumOutlined}
        />
        <ConversionMetric
          title="Offer conversion"
          rate={stats.offerRate}
          numerator={stats.offers}
          denominator={stats.interviewed}
          caption="interviewed roles became offers"
          icon={EmojiEventsOutlined}
        />
      </Box>
    </SectionCard>
  );
}
