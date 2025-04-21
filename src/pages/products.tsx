import { CONFIG } from 'src/config-global';

import { ProductTypesView } from 'src/sections/productTypes/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <title>{`Products - ${CONFIG.appName}`}</title>

      <ProductTypesView />
    </>
  );
}
