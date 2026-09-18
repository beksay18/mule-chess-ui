import LegalPage, { LegalSection } from './legal-page';

const SECTIONS: LegalSection[] = [
    {
        title: 'Overview',
        paragraphs: [
            'Complete Graphics Sticker House operates cgstickerhouse.com and provides custom sticker design and printing services. This Privacy Policy explains how we collect, use, and protect your information when you use our website and place orders.',
        ],
    },
    {
        title: 'Information we collect',
        paragraphs: [
            'Account information such as your name, email address, and password when you create an account.',
            'Order information including shipping address, billing details, order history, and artwork files you upload for printing.',
            'Communication data when you contact us via email, contact forms, or support requests.',
            'Technical data such as IP address, browser type, device information, and pages visited — collected through cookies and similar technologies to improve our site.',
        ],
    },
    {
        title: 'How we use your information',
        paragraphs: [
            'To process and fulfill your sticker orders, including printing, shipping, and customer support.',
            'To manage your account and provide order status updates.',
            'To improve our website, products, and ordering experience.',
            'To send transactional emails related to your orders. We do not sell your personal information to third parties.',
        ],
    },
    {
        title: 'Sharing your information',
        paragraphs: [
            'We share information with service providers who help us operate our business — such as payment processors, shipping carriers (USPS, UPS), and hosting providers — only as needed to fulfill your order.',
            'We may disclose information if required by law or to protect the rights, safety, and security of our customers and business.',
        ],
    },
    {
        title: 'Artwork & uploaded files',
        paragraphs: [
            'When you upload designs for printing, we store those files to produce your order. You retain ownership of your artwork. By uploading, you confirm you have the right to use and print the content.',
            'We do not use your custom artwork for marketing or promotional purposes without your permission.',
        ],
    },
    {
        title: 'Data security & retention',
        paragraphs: [
            'We use reasonable technical and organizational measures to protect your information. No method of transmission over the internet is 100% secure.',
            'We retain order and account information as long as needed to provide services, comply with legal obligations, and resolve disputes.',
        ],
    },
    {
        title: 'Your choices',
        paragraphs: [
            'You may update your account information from your profile settings.',
            'You may request access to or deletion of your personal data by contacting us at support@cgstickerhouse.com. We will respond within a reasonable timeframe.',
            'You can disable cookies in your browser settings, though some site features may not work properly.',
        ],
    },
    {
        title: 'Contact us',
        paragraphs: [
            'If you have questions about this Privacy Policy, contact us at support@cgstickerhouse.com.',
        ],
    },
];

export default function Privacy() {
    return (
        <LegalPage
            headline="Privacy"
            chip="policy"
            subtitle="How Complete Graphics Sticker House collects, uses, and protects your information."
            sections={SECTIONS}
        />
    );
}
