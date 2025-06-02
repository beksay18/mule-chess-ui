import React, {useState} from 'react';
import {
    Box,
    Button,
    TextField,
    Typography,
    Container,
    Paper,
    CircularProgress,
} from '@mui/material';
import {ContactsRequest, createContacts} from "../../../api/contacts";
import ContactUsTitle from "./contact-us-title";

export default function ContactFormSection() {
    const [form, setForm] = useState<ContactsRequest>({
        name: '',
        email: '',
        orderNumber: '',
        message: '',
        file: undefined,
    });

    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            setForm({...form, file: e.target.files[0]});
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            await createContacts(form);
            setSuccess(true);
            setForm({
                name: '',
                email: '',
                orderNumber: '',
                message: '',
                file: undefined,
            });
        } catch (err: any) {
            console.error(err);
            setError(err?.response?.data?.message || 'Something went wrong.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <ContactUsTitle/>
            <Container maxWidth="sm">
                <Box sx={{p: 4,}}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <TextField
                            fullWidth
                            label="Order Number (Optional)"
                            name="orderNumber"
                            value={form.orderNumber}
                            onChange={handleChange}
                            margin="normal"
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Message"
                            name="message"
                            value={form.message}
                            onChange={handleChange}
                            margin="normal"
                            required
                        />
                        <Button variant="outlined" component="label" sx={{mt: 2}}>
                            Upload File (Optional)
                            <input
                                type="file"
                                hidden
                                onChange={handleFileChange}
                            />
                        </Button>

                        {form.file && (
                            <Typography variant="body2" sx={{mt: 1}}>
                                Selected file: {form.file.name}
                            </Typography>
                        )}

                        <Box mt={3}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={submitting}
                            >
                                {submitting ? <CircularProgress size={24}/> : 'Submit'}
                            </Button>
                        </Box>

                        {success && (
                            <Typography color="success.main" sx={{mt: 2}}>
                                Your message has been sent successfully!
                            </Typography>
                        )}
                        {error && (
                            <Typography color="error" sx={{mt: 2}}>
                                {error}
                            </Typography>
                        )}
                    </form>
                </Box>
            </Container>
        </>
    );
}
