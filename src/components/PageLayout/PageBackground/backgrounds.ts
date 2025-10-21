import background1 from '../../../resources/backgrounds/background_1.jpg';
import background2 from '../../../resources/backgrounds/background_2.jpg';
import background3 from '../../../resources/backgrounds/background_3.jpg';
import background4 from '../../../resources/backgrounds/background_4.jpg';
import background5 from '../../../resources/backgrounds/background_5.jpg';
import background6 from '../../../resources/backgrounds/background_6.jpg';

const createBackgroundUrl = (imageLoc: string) => {
    return imageLoc;
};
export const BACKGROUNDS = {
    BACKGROUND_1: createBackgroundUrl(background1),
    BACKGROUND_2: createBackgroundUrl(background2),
    BACKGROUND_3: createBackgroundUrl(background3),
    BACKGROUND_4: createBackgroundUrl(background4),
    BACKGROUND_5: createBackgroundUrl(background5),
    BACKGROUND_6: createBackgroundUrl(background6),
};
