# P2S Extruder Failure — Troubleshooting Log

**Printer:** Bambu Lab P2S
**Nozzle:** 0.4mm HS01
**Issue:** Extruder cannot extrude properly — fails early in print, progressively worsening
**Started:** After successful prints of 2x infinity cubes + 1 scraper. First failure at ~40% on 4x phone stands job.

---

## Error Codes

| Code | Value | Meaning |
|------|-------|---------|
| HMS | 0700-2200-0002-0009 | Failed to extrude AMS Slot 3 filament; clog or filament too thin causing slip |
| HMS | 0300-0900-0002-0003 | Extruder abnormal; clog or filament too thin causing slip (external spool test) |
| HMS (stale) | 0500-0600-0002-0070 | Undocumented (extruder module, fatal) — persisted from initial failure |
| mc_print_error_code | 32790 (0x8016) | Undocumented (AMS attempt) |
| mc_print_error_code | 32794 (0x801A) | Undocumented (external spool attempt) |
| print_error | 117473302 (0x07002216) | Undocumented |
| ext_tool.low_prec | true | Undocumented — possibly eddy sensor precision state |

---

## Troubleshooting History

### Pre-monitoring

| # | Action | Result |
|---|--------|--------|
| 1 | Multiple cold pulls | No improvement |
| 2 | Hot push filament through nozzle | No improvement |
| 3 | Nozzle replacement (new 0.4mm HS01) | No improvement |
| 3a | Extruder disassembly + inspection (x2) | No visible issue found |
| 3b | Extruder sensor test (manual filament insert, screen updates) | Sensor detects filament — passed per Bambu support |
| 3c | Bambu support contacted | Sent new gear assembly |

### Monitored session (MQTT telemetry)

| # | Action | Result |
|---|--------|--------|
| 4 | Benchy print (cream PLA, AMS slot 3) | Failed at layer 1 (22% inc. calibration). HMS 0700-2200-0002-0009 fired. Printer auto-paused after ~1 min of extrusion. |
| 5 | Benchy print — **external spool** (bypassing AMS) | Failed at layer 2, 24%. HMS **0300-0900-0002-0003** (extruder abnormal, filament slip). Slightly further than AMS attempt but same fundamental failure. |
| 6 | **Factory reset + full recalibration** | Completed successfully. `ext_tool.low_prec: true` still persists. |
| 7 | Benchy print — AMS1 black PLA (post-reset) | Failed before layer 1. HMS 0700-2000-0002-0003. Reset did not help. |
| 8 | Benchy print — AMS2 red PLA | Failed before layer 1. HMS 0700-2000-0002-0003. Different filament, same failure. |
| 9 | **Installed new gear assembly from Bambu** (bearing was undersized in original) | **BENCHY COMPLETED SUCCESSFULLY.** Printed to 100%, layers 0-192, no errors. |

### Observations from telemetry at failure

- Nozzle was at 220C (correct for PLA)
- Bed at 55C (correct)
- Cooling fan at 0 (not overcooling)
- Heatbreak fan at 14-15 (normal)
- AMS tray_now: 255 (no tray registered as loaded)
- Extruder state: 0x80001 (error flag)
- ext_tool.low_prec: true (even at idle)

---

## Ruled Out

- [x] Nozzle clog — new nozzle installed, still fails
- [x] Simple hotend clog — cold pulls + hot push done, no improvement
- [x] AMS filament feed issue — fails with external spool too (test #5)
- [x] Extruder gears / visible mechanical issue — extruder disassembled and inspected twice
- [x] Filament quality — fails on multiple spools/slots (black, cream, red PLA)
- [x] Firmware/calibration state — factory reset + recalibration did not help

---

## Root Cause

**Undersized bearing in the extruder gear assembly.** The factory-installed bearing was too small, causing the extruder gears to slip on filament. Bambu support sent a replacement gear assembly with a correctly sized bearing. After installation, the printer immediately printed a Benchy successfully.

The `ext_tool.low_prec: true` flag and all HMS error codes were symptoms of insufficient grip on the filament, not a sensor or firmware issue.

## Lessons Learned

1. **MQTT telemetry is invaluable for diagnosis** — the error codes, timing, and state data made it possible to systematically rule out causes and build a case for support.
2. **`ext_tool.low_prec: true` surviving factory reset** was the key clue pointing to hardware rather than firmware.
3. **Bypass AMS early** — testing with an external spool quickly ruled out the AMS as a factor.
4. **Don't trust visual inspection alone** — the undersized bearing wasn't obvious during two extruder disassemblies.
