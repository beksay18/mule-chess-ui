import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { AnalyticsWidgetSummary } from '../analytics-widget-summary';
import {getCurrentUser} from "../../../api";
import {useEffect, useState} from "react";
import {getOrderStatusCount, OrderStatusCount} from "../../../api/order";
import {Box} from "@mui/material";

// ----------------------------------------------------------------------

export function OverviewAnalyticsView() {
  const user = getCurrentUser();
  const [statusCounts, setStatusCounts] = useState<OrderStatusCount[]>([]);

  useEffect(() => {
    getOrderStatusCount().then(setStatusCounts);
  }, []);

  const getColorForStatus = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'info';
      case 'IN_PROGRESS':
        return 'secondary';
      case 'READY_TO_SHIP':
        return 'warning';
      case 'SHIPPED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'primary';
    }
  };

  const statusOrder = ['NEW', 'IN_PROGRESS', 'READY_TO_SHIP', 'SHIPPED', 'CANCELLED'];

  const sortedStatusCounts = [...statusCounts].sort(
      (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  );


  return (
    <DashboardContent maxWidth="xl">
      <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
          {user ? `Hi, ${user.person.firstName} ${user.person.lastName} 👋` : 'Hi, Unknown User 👋'}
      </Typography>

      <Box
          display="grid"
          gap={3}
          gridTemplateColumns={{
            xs: '1fr',
            sm: '1fr 1fr',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(5, 1fr)',
          }}
      >
        {sortedStatusCounts.map((stat) => (
            <Box key={stat.status}>
              <AnalyticsWidgetSummary
                  title={stat.status.replace(/_/g, ' ')}
                  total={stat.count}
                  color={getColorForStatus(stat.status)}
              />
            </Box>
        ))}
      </Box>
    </DashboardContent>
  );
}
