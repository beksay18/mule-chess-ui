import { CONFIG } from 'src/config-global';
import { StickerBuilderView } from 'src/sections/sticker-builder/view';

export default function Page() {
    return (
        <>
            <title>{`CG Sticker House Builder - ${CONFIG.appName}`}</title>
            <StickerBuilderView />
        </>
    );
}
