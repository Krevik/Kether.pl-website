import { MapEntry } from './InstalledSVMaps';
import { TRANSLATION_PLACEHOLDER } from './constants';

/**
 * Raw maps data - will be processed in the component
 */
export const RAW_INSTALLED_MAPS: MapEntry[] = [
    // Workshop maps
    {
        id: 1,
        mapName: '2 Evil Eyes',
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=381419931',
    },
    {
        id: 2,
        mapName: 'Whispers of Winter',
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=1643520526',
    },
    {
        id: 41,
        mapName: 'Ceda Fever',
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=2786082058',
    },
    {
        id: 42,
        mapName: 'Gas Fever',
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=381439453',
    },
    {
        id: 43,
        mapName: 'Outline',
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=1749424232',
    },
    {
        id: 44,
        mapName: 'Drop Dead Gorges',
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=205465933',
    },
    {
        id: 45,
        mapName: 'Prague',
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/workshop/filedetails/?id=3128058513',
    },
    {
        id: 46,
        mapName: 'Day Break (v4)',
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=180925247',
    },
    {
        id: 47,
        mapName: 'Urban Flight',
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=121086524',
    },
    {
        id: 48,
        mapName: 'Diescraper Redux',
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=121116980',
    },
    {
        id: 49,
        mapName: 'Blood Proof',
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=121157156',
    },
    {
        id: 50,
        mapName: 'Left 4 Mario',
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=210014615',
    },
    {
        id: 51,
        mapName: "We Don't Go To Ravenholm (Workshop)",
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=143565981',
    },
    {
        id: 52,
        mapName: 'Welcome to Hell (Workshop)',
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/sharedfiles/filedetails/?id=381848620',
    },
    // SirPlease maps (all campaigns from sirplease.vercel.app, excluding Urban Flight)
    {
        id: 40,
        mapName: TRANSLATION_PLACEHOLDER, // Placeholder that will be replaced in component
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/allmaps.zip',
    },
    {
        id: 3,
        mapName: 'Back To School',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/BackToSchool.zip',
    },
    {
        id: 4,
        mapName: 'Blood Tracks',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/BloodTracks.zip',
    },
    {
        id: 5,
        mapName: 'Carried Off',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/CarriedOff.zip',
    },
    {
        id: 6,
        mapName: 'City 17',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/City17.zip',
    },
    {
        id: 7,
        mapName: 'Cold Front',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/ColdFront.zip',
    },
    {
        id: 8,
        mapName: 'Crash Course Rerouted',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/CrashCourseRerouted.zip',
    },
    {
        id: 9,
        mapName: 'Dark Carnival Remix',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/DarkCarnivalRemix.zip',
    },
    {
        id: 10,
        mapName: 'Dark Wood',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/DarkWood.zip',
    },
    {
        id: 12,
        mapName: 'Dead Before Dawn DC',
        source: 'Workshop',
        downloadUrl: 'https://steamcommunity.com/workshop/filedetails/?id=121786282',
    },
    {
        id: 13,
        mapName: 'Dead Center Rebirth',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/DeadCenterRebirth.zip',
    },
    {
        id: 14,
        mapName: 'Dead Center Reconstructed',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/DeadCenterReconstructed.zip',
    },
    {
        id: 15,
        mapName: 'Death Aboard 2',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/DeathAboard2.zip',
    },
    {
        id: 16,
        mapName: 'Death Sentence Redux',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/DeathSentenceRedux.zip',
    },
    {
        id: 17,
        mapName: 'Detour Ahead',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/DetourAhead.zip',
    },
    {
        id: 18,
        mapName: 'Diescraper Redux',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/DiescraperRedux.zip',
    },
    {
        id: 19,
        mapName: 'Fatal Freight',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/FatalFreight.zip',
    },
    {
        id: 20,
        mapName: 'Hard Rain Downpour',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/HardRainDownpour.zip',
    },
    {
        id: 21,
        mapName: 'Haunted Forest',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/HauntedForest.zip',
    },
    {
        id: 22,
        mapName: 'Heaven Can Wait 2',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/HeavenCanWait2.zip',
    },
    {
        id: 23,
        mapName: 'Highway To Hell',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/HighwayToHell.zip',
    },
    {
        id: 24,
        mapName: 'I Hate Mountains 2',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/IHateMountains2.zip',
    },
    {
        id: 25,
        mapName: 'Military Industrial Complex 2',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/MilitaryIndustrialComplex2.zip',
    },
    {
        id: 26,
        mapName: 'No Echo',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/NoEcho.zip',
    },
    {
        id: 27,
        mapName: 'No Mercy Rehab',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/NoMercyRehab.zip',
    },
    {
        id: 28,
        mapName: 'Open Road',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/OpenRoad.zip',
    },
    {
        id: 29,
        mapName: 'Parish Overgrowth',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/ParishOvergrowth.zip',
    },
    {
        id: 30,
        mapName: 'Redemption 2',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/Redemption2.zip',
    },
    {
        id: 31,
        mapName: 'Suicide Blitz 2',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/SuicideBlitz2.zip',
    },
    {
        id: 32,
        mapName: 'The Bloody Moors',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/TheBloodyMoors.zip',
    },
    {
        id: 33,
        mapName: 'Tour Of Terror',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/TourOfTerror.zip',
    },
    {
        id: 34,
        mapName: 'Trip Day',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/Tripday.zip',
    },
    {
        id: 35,
        mapName: 'Undead Zone',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/UndeadZone.zip',
    },
    {
        id: 36,
        mapName: 'Warcelona',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/Warcelona.zip',
    },
    {
        id: 37,
        mapName: "We Don't Go To Ravenholm",
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/WeDontGoToRavenholm.zip',
    },
    {
        id: 38,
        mapName: 'Welcome To Hell',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/WelcomeToHell.zip',
    },
    {
        id: 39,
        mapName: 'Yama',
        source: 'SirPlease',
        downloadUrl: 'https://sirplease.vercel.app/downloads/maps/Yama.zip',
    },
];

