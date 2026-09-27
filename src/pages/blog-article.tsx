import { CONFIG } from 'src/config-global';

import Footer from '../sections/home/footer';
import Header from '../sections/home/header';
import BlogArticle from '../sections/home/company/blog/blog-article';

export default function Page() {
    return (
        <>
            <title>{`Article - ${CONFIG.appName}`}</title>
            <Header />
            <BlogArticle />
            <Footer />
        </>
    );
}
