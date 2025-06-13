import { CONFIG } from 'src/config-global';

import Header from "../sections/home/header";
import {BlogView} from "../sections/home/company/blog/view";

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Blog - ${CONFIG.appName}`}</title>
      <Header/>
      <BlogView />
    </>
  );
}
