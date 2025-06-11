import React from 'react';
import {
    Accordion, AccordionDetails, AccordionSummary,
    Box, Card, CardContent,
    Container, Divider, IconButton, Stack, Typography,
} from '@mui/material';
import ReturnsTitle from "./returns-title";
import AddIcon from "@mui/icons-material/Add";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export default function Returns() {

    return (
        <>
            <ReturnsTitle/>
            <Container maxWidth="sm">
                returns
            </Container>
        </>
    );
}
