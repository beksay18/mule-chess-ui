import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FiberNewIcon from '@mui/icons-material/FiberNew';
import AlarmOnIcon from '@mui/icons-material/AlarmOn';
import DoneIcon from '@mui/icons-material/Done';
import DoDisturbIcon from '@mui/icons-material/DoDisturb';

import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import {getCurrentUser} from "../../../api";

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {

  const user = getCurrentUser();

  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
          {user ? `Hi, ${user.person.firstName} ${user.person.lastName} 👋` : 'Hi, Unknown User 👋'}
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="New Orders"
            percent={2.6}
            total={714000}
            icon={<FiberNewIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Ready To Ship Orders"
            percent={-0.1}
            total={1352831}
            color="secondary"
            icon={<AlarmOnIcon />}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Shipped orders"
            percent={2.8}
            total={1723315}
            color="success"
            icon={<DoneIcon/>}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <AnalyticsWidgetSummary
            title="Cancelled Orders"
            percent={3.6}
            total={234}
            color="error"
            icon={<DoDisturbIcon />}
          />
        </Grid>

      </Grid>
    </DashboardContent>
  );
}
