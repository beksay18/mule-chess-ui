import LegalPage, { LegalSection } from './legal-page';

const SECTIONS: LegalSection[] = [
    {
        title: 'Agreement to terms',
        paragraphs: [
            'By accessing cgstickerhouse.com or placing an order with Complete Graphics Sticker House, you agree to these Terms of Service. If you do not agree, please do not use our website or services.',
        ],
    },
    {
        title: 'Our services',
        paragraphs: [
            'We provide an online platform to design and order custom printed stickers. All products are made to order based on the specifications and artwork you submit.',
            'We reserve the right to refuse or cancel orders that violate these terms, contain prohibited content, or cannot be produced with reasonable quality.',
        ],
    },
    {
        title: 'Orders & payment',
        paragraphs: [
            'When you place an order, you agree to provide accurate information and to pay all charges at checkout, including product price, shipping, and applicable taxes.',
            'Order confirmation does not guarantee acceptance. We may contact you if there is an issue with your artwork, specifications, or payment.',
            'Prices and availability are subject to change. Any pricing errors may result in order cancellation with a full refund.',
        ],
    },
    {
        title: 'Custom products',
        paragraphs: [
            'Every sticker order is custom-made. Because of this, we cannot accept returns for change of mind, wrong size selection, or preference changes once production has started.',
            'Please review your design, dimensions, quantity, and material choices carefully before submitting your order.',
            'For quality issues, reprints, and refunds, see our Returns page or contact support@cgstickerhouse.com within 30 days of delivery.',
        ],
    },
    {
        title: 'Your artwork & content',
        paragraphs: [
            'You are responsible for ensuring your uploaded artwork does not infringe on any copyright, trademark, or other intellectual property rights.',
            'You grant us a limited license to use, reproduce, and print your submitted files solely to fulfill your order.',
            'We may refuse content that is unlawful, offensive, or violates third-party rights.',
        ],
    },
    {
        title: 'Shipping',
        paragraphs: [
            'We ship via USPS and UPS. Delivery estimates are not guaranteed and may vary based on carrier performance and destination.',
            'Risk of loss passes to you upon delivery to the carrier. Please inspect your order upon arrival and report issues promptly.',
        ],
    },
    {
        title: 'Limitation of liability',
        paragraphs: [
            'To the fullest extent permitted by law, Complete Graphics Sticker House is not liable for indirect, incidental, or consequential damages arising from your use of our services or products.',
            'Our total liability for any claim related to an order is limited to the amount you paid for that order.',
        ],
    },
    {
        title: 'Changes & contact',
        paragraphs: [
            'We may update these Terms of Service from time to time. Continued use of the site after changes constitutes acceptance of the updated terms.',
            'Questions about these terms? Email us at support@cgstickerhouse.com.',
        ],
    },
];

export default function Terms() {
    return (
        <LegalPage
            headline="Terms of"
            chip="service"
            subtitle="The rules and conditions for using Complete Graphics Sticker House and ordering custom stickers."
            sections={SECTIONS}
        />
    );
}
