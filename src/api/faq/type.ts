export type Faq = {
    id: number;
    question: string;
    answer: string;
};

export type FaqTitle = {
    id: number;
    title: string;
    faqs: Faq[];
};

export type FaqTitleRequest = {
    title: string;
};

export type FaqRequest = {
    question: string;
    answer: string;
};