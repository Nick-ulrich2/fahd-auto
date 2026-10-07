import type { FeatureGroup } from "./types";

/** Ordre d'affichage des équipements, par groupe. Les clés correspondent à « feature.<clé> » dans les traductions. */
export const FEATURE_GROUPS: Record<FeatureGroup, string[]> = {
  comfort: [
    "climateAuto", "climate3zone", "climate4zone", "rearClimate", "heatedSeats", "ventilatedSeats", "electricSeats",
    "memorySeats", "massageSeats", "heatedSteering", "heatedGrips", "keyless", "powerTailgate", "sunroof", "panoramicRoof",
    "ambientLighting", "airSuspension", "electronicSuspension", "ridingModes", "quickshifter", "slipperClutch", "cruise",
    "adaptiveCruise", "adjustableScreen", "rainSensor", "autoLights", "electricMirrors", "thirdRow", "fridge",
    "underseatStorage", "electricStart", "kickStart", "reverseGear",
  ],
  safety: [
    "abs", "cbs", "corneringAbs", "esp", "tractionControl", "wheelieControl", "launchControl", "aeb", "laneAssist", "blindSpot",
    "trafficSign", "parkFront", "parkRear", "rearCamera", "camera360", "parkAssist", "headUp", "nightVision", "isofix",
    "tpms", "hillHold", "hillDescent", "diffLock", "terrainSelect",
  ],
  multimedia: [
    "navigation", "touchscreen", "digitalCockpit", "tftDisplay", "connectivity", "carplay", "androidAuto", "bluetooth",
    "usb", "wirelessCharging", "premiumAudio", "dab", "rearEntertainment",
  ],
  exterior: [
    "ledHeadlights", "matrixLed", "alloyWheels", "roofRails", "tintedWindows", "towbar", "sideSteps", "bedliner",
    "rollCover", "slidingDoor", "partition", "panniers", "crashBars", "handguards", "skidPlate", "centreStand",
    "luggageRack", "spokeWheels", "cargoBox",
  ],
};

export const ALL_FEATURES = new Set(Object.values(FEATURE_GROUPS).flat());

/** Équipements mis en avant dans la description (les plus « vendeurs »), par ordre de priorité. */
export const HIGHLIGHT_FEATURES = [
  "airSuspension", "electronicSuspension", "massageSeats", "panoramicRoof", "sunroof", "camera360", "headUp",
  "nightVision", "matrixLed", "corneringAbs", "quickshifter", "premiumAudio", "ventilatedSeats", "adaptiveCruise",
  "thirdRow", "rearEntertainment", "diffLock", "heatedGrips", "tftDisplay", "panniers", "navigation", "keyless",
  "tractionControl", "towbar", "rearCamera", "cruise", "reverseGear", "cargoBox", "cbs", "electricStart", "luggageRack",
];
