import { CONFIG } from 'src/config-global';
import { StickerBuilderView } from 'src/sections/sticker-builder/view';

export default function Page() {
    return (
        <>
            <title>{`Sticker Builder - ${CONFIG.appName}`}</title>
            <StickerBuilderView />
        </>
    );
}
