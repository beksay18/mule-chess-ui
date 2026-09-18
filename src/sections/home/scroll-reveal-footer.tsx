import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import Footer from './footer';

const SCROLL_THRESHOLD = 48;

export default function ScrollRevealFooter() {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setVisible(window.scrollY > SCROLL_THRESHOLD);
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <Box
            sx={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(20px)',
                transition: 'opacity 0.35s ease, transform 0.35s ease',
                pointerEvents: visible ? 'auto' : 'none',
            }}
        >
            <Footer />
        </Box>
    );
}
