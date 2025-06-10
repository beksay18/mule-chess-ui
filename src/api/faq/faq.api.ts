import { axios } from "../http";
import { ENDPOINTS } from "../constant";
import { FaqTitle, Faq, FaqRequest, FaqTitleRequest } from "./type";

export const createFaqTitle = (payload: FaqTitleRequest): Promise<void> =>
    axios.post(ENDPOINTS.FAQ.CREATE_TITLE, payload).then(() => {});

export const updateFaqTitle = (id: number, payload: FaqTitleRequest): Promise<void> =>
    axios.put(ENDPOINTS.FAQ.UPDATE_TITLE(id), payload).then(() => {});

export const getAllFaqs = (): Promise<FaqTitle[]> =>
    axios
        .getWithRetries<FaqTitle[]>(ENDPOINTS.FAQ.GET_ALL)
        .then(({ data }) => data);

export const getFaqTitleById = (id: number): Promise<FaqTitle> =>
    axios.getWithRetries<FaqTitle>(ENDPOINTS.FAQ.GET_TITLE_BY_ID(id)).then(({ data }) => data);

export const getFaqById = (id: number): Promise<Faq> =>
    axios.getWithRetries<Faq>(ENDPOINTS.FAQ.GET_FAQ_BY_ID(id)).then(({ data }) => data);

export const createFaqUnderTitle = (titleId: number, payload: FaqRequest): Promise<void> =>
    axios.post(ENDPOINTS.FAQ.CREATE_FAQ_UNDER_TITLE(titleId), payload).then(() => {});

export const updateFaqUnderTitle = (titleId: number, payload: FaqRequest): Promise<void> =>
    axios.put(ENDPOINTS.FAQ.UPDATE_FAQ_UNDER_TITLE(titleId), payload).then(() => {});

export const deleteFaq = (faqId: number): Promise<void> =>
    axios.deleteWithRetries<void>(ENDPOINTS.FAQ.DELETE_FAQ(faqId)).then(() => {});

export const deleteFaqTitle = (titleId: number): Promise<void> =>
    axios.deleteWithRetries<void>(ENDPOINTS.FAQ.DELETE_TITLE(titleId)).then(() => {});
