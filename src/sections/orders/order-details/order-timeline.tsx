import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import Typography from '@mui/material/Typography';

const BRAND_BLUE = '#175195';

const FLOW = [
    { status: 'NEW', title: 'Order placed' },
    { status: 'IN_PROGRESS', title: 'In progress' },
    { status: 'READY_TO_SHIP', title: 'Ready to ship' },
    { status: 'SHIPPED', title: 'Shipped' },
];

export type OrderTimelineEvent = {
    status: string;
    occurredAt?: string | null;
    actorName?: string | null;
};

const cardSx = {
    borderRadius: 2.5,
    border: '1px solid',
    borderColor: 'grey.200',
    boxShadow: 'none',
};

function formatWhen(value?: string | null) {
    if (!value) return '';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    });
}

export function OrderTimeline({
    status,
    placedAt,
    placedBy,
    events = [],
}: {
    status: string;
    placedAt?: string;
    placedBy?: string;
    events?: OrderTimelineEvent[];
}) {
    const cancelled = status === 'CANCELLED';
    const steps = cancelled
        ? [
              { status: 'NEW', title: 'Order placed' },
              { status: 'CANCELLED', title: 'Cancelled' },
          ]
        : FLOW;
    const currentIndex = Math.max(
        0,
        steps.findIndex((step) => step.status === status)
    );

    const detailFor = (stepStatus: string) => {
        const recorded = [...events].reverse().find((event) => event.status === stepStatus);
        const when = recorded?.occurredAt || (stepStatus === 'NEW' ? placedAt : undefined);
        const actor = recorded?.actorName || (stepStatus === 'NEW' ? placedBy : undefined);
        return { when, actor: actor?.trim() || undefined };
    };

    const stepperSx = {
        '& .MuiStepIcon-root.Mui-active': { color: cancelled ? '#991b1b' : BRAND_BLUE },
        '& .MuiStepIcon-root.Mui-completed': { color: BRAND_BLUE },
    };

    return (
        <Paper elevation={0} sx={{ ...cardSx, p: { xs: 2, md: 2.5 } }}>
            <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', mb: 2 }}>Timeline</Typography>
            <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                <Stepper activeStep={currentIndex} alternativeLabel sx={stepperSx}>
                    {steps.map((step, index) => (
                        <Step key={step.status}>
                            <StepLabel
                                optional={
                                    <Typography variant="caption" sx={{ display: 'block', minHeight: 32, lineHeight: 1.35 }}>
                                        {index <= currentIndex ? formatWhen(detailFor(step.status).when) : ''}
                                        {index <= currentIndex && detailFor(step.status).actor ? (
                                            <>
                                                <br />
                                                by {detailFor(step.status).actor}
                                            </>
                                        ) : null}
                                    </Typography>
                                }
                            >
                                {step.title}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
            <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                <Stepper activeStep={currentIndex} orientation="vertical" sx={stepperSx}>
                    {steps.map((step, index) => (
                        <Step key={step.status}>
                            <StepLabel
                                optional={
                                    index <= currentIndex &&
                                    (detailFor(step.status).when || detailFor(step.status).actor) ? (
                                        <Typography variant="caption" sx={{ display: 'block' }}>
                                            {formatWhen(detailFor(step.status).when)}
                                            {detailFor(step.status).actor ? (
                                                <>
                                                    {detailFor(step.status).when ? <br /> : null}
                                                    by {detailFor(step.status).actor}
                                                </>
                                            ) : null}
                                        </Typography>
                                    ) : undefined
                                }
                            >
                                {step.title}
                            </StepLabel>
                        </Step>
                    ))}
                </Stepper>
            </Box>
        </Paper>
    );
}
