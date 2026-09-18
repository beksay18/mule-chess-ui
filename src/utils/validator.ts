export const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const stripPhoneDigits = (value: string) => value.replace(/\D/g, '');

export const formatUsPhoneNumber = (value: string) => {
    const digits = stripPhoneDigits(value).slice(0, 10);

    if (digits.length === 0) return '';
    if (digits.length <= 3) return `(${digits}`;
    if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

export const isValidUsPhoneNumber = (value: string) =>
    stripPhoneDigits(value).length === 10;