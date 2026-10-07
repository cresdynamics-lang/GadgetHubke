#!/usr/bin/env node
/**
 * Acceptance: resolve every Part C key; fail if MISSING / fallback.
 */
import { getAirpodsImage, resolveAirpodsKey } from "../src/lib/airpods/images.ts";

const checks = [];
function check(display, page, key, modelId = "airpods-pro-3") {
  const img = key.startsWith("pair:") || key.includes("/")
    ? (key.startsWith("pair:") ? resolveAirpodsKey(key, page) : getAirpodsImage(modelId, key, page))
    : getAirpodsImage(modelId, key, page);
  const ok = !img.fallback && img.src && !img.src.includes("placeholder");
  checks.push({ display, page, key, pass: ok, src: img.src?.slice(0, 80) });
}

// C1
check("Hero pair", "landing", "pair:landing/hero");
check("Hero static", "landing", "landing/hero");
check("Hero airpods_startframe", "landing", "landing/airpods_startframe");
check("Hero pair", "Pro 3", "pair:pro/welcome/hero");
check("Hero start", "AirPods 5", "airpods5/welcome/hero_airpods_startframe", "airpods-5");
check("Hero store", "AirPods 5", "hero", "airpods-5");
check("Hero start", "Max", "max/welcome/max-loop_startframe", "airpods-max-usbc");
check("Hero store", "Max", "hero", "airpods-max-usbc");

// C2
check("Closer look", "Pro 3", "pro/product-viewer/closer_look_initial");
check("Closer case", "Pro 3", "pro/product-viewer/closer_look_case");
check("Earbuds 5", "AirPods 5", "earbuds", "airpods-5");
check("Gallery 0", "Pro 3", "gallery:0");
check("Colour midnight", "Max", "colour:midnight", "airpods-max-usbc");
check("Case overview", "Pro 3", "case");

// C3 - C11 sample
[
  ["Noise pair", "pair:pro/noise-control/noise_control"],
  ["Noise adaptive", "pro/noise-control/gallery/noise_control_adaptive_audio"],
  ["Sound pair guts", "pro/audio-performance/audio_airpods_pro_guts"],
  ["Hearing test", "pro/hearing-health/hearing_health_hearing_test"],
  ["Hearing aid hl", "pro/highlights/highlights_hearing_aid"],
  ["Controls", "pro/magical/magical_experience_controls"],
  ["Battery case", "pro/battery/case"],
  ["Case pair", "pair:pro/product-viewer/case"],
  ["Fitness pair", "pair:pro/fitness/fitness_hero"],
  ["Highlights ANC", "pro/highlights/highlights_noise_cancellation"],
].forEach(([d, k]) => check(d, "Pro 3", k));

[
  ["Noise hero", "airpods5/stories/noise_hero"],
  ["Audio hero", "airpods5/stories/audio_hero"],
  ["Bento angle", "airpods5/bento-gallery/bento_angle"],
  ["Chip pair", "pair:airpods5/media-card/chip"],
  ["Connect pair", "pair:airpods5/stories/airpods-connect"],
].forEach(([d, k]) => check(d, "AirPods 5", k, "airpods-5"));

[
  ["ANC pair", "pair:max/media-card/anc"],
  ["HiFi", "max/product-stories/hifi-sound/audio_airpod_max"],
  ["Bento blue 1", "max/bento/blue/bento_1_airpod_max_blue"],
  ["Battery USB-C", "max/product-stories/battery-magical/battery_usbc"],
].forEach(([d, k]) => check(d, "Max", k, "airpods-max-usbc"));

[
  ["Consider noise", "landing/consider/card_noise_cancellation"],
  ["Music hero", "landing/music/music_album_hero"],
].forEach(([d, k]) => check(d, "landing", k));

[
  ["Compare Pro", "compare:airpods-pro-compare"],
  ["Compare ANC", "compare:airpods-compare-anc"],
].forEach(([d, k]) => check(d, "compare", k));

const failed = checks.filter((c) => !c.pass);
console.log("\nAcceptance table");
console.log("display | page | key | result");
for (const c of checks) {
  console.log(`${c.pass ? "PASS" : "FAIL"} | ${c.display} | ${c.page} | ${c.key}`);
}
console.log(`\n${checks.length - failed.length}/${checks.length} passed`);
if (failed.length) {
  console.error("\nFailures:");
  for (const f of failed) console.error(f);
  process.exit(1);
}
