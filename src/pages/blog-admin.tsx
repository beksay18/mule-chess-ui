import { CONFIG } from 'src/config-global';

import { BlogAdminView } from '../sections/blog/view';

export default function Page() {
    return (
        <>
            <title>{`Blog - ${CONFIG.appName}`}</title>
            <BlogAdminView />
        </>
    );
}
