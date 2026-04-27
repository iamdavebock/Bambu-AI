const mqtt = require('mqtt');
const fs = require('fs');
const path = require('path');

// Load .env if dotenv is available, otherwise rely on environment variables
try { require('dotenv').config(); } catch {}

const host = process.env.PRINTER_HOST;
const serial = process.env.BAMBU_SERIAL;
const token = process.env.BAMBU_TOKEN;
const logFile = process.env.LOG_FILE || path.join(__dirname, 'print_monitor.log');

if (!host || !serial || !token) {
  console.error('Missing required env vars: PRINTER_HOST, BAMBU_SERIAL, BAMBU_TOKEN');
  console.error('Copy .env.example to .env and fill in your printer details.');
  process.exit(1);
}

const client = mqtt.connect('mqtts://' + host + ':8883', {
  username: 'bblp',
  password: token,
  rejectUnauthorized: false,
  connectTimeout: 10000
});

let lastState = '';
let lastPercent = -1;
let lastError = '';
let seenHms = new Set();
let msgCount = 0;

function log(msg) {
  const ts = new Date().toISOString();
  const line = ts + ' | ' + msg;
  console.log(line);
  fs.appendFileSync(logFile, line + '\n');
}

client.on('connect', () => {
  log('MONITOR STARTED');
  client.subscribe('device/' + serial + '/report');
  const pushAll = () => {
    client.publish('device/' + serial + '/request',
      JSON.stringify({ pushing: { sequence_id: '0', command: 'pushall' } }));
  };
  pushAll();
  setInterval(pushAll, 30000);
});

client.on('message', (topic, msg) => {
  msgCount++;
  const data = JSON.parse(msg.toString());
  if (!data.print) return;
  const p = data.print;

  const state = p.gcode_state || '';
  const pct = p.mc_percent || p.percent || 0;
  const layer = p.layer_num || 0;
  const totalLayers = p.total_layer_num || 0;
  const remaining = p.mc_remaining_time || p.remain_time || 0;
  const nozzle = p.nozzle_temper;
  const nozzleTarget = p.nozzle_target_temper;
  const bed = p.bed_temper;
  const bedTarget = p.bed_target_temper;
  const fan = p.cooling_fan_speed;
  const heatbreak = p.heatbreak_fan_speed;
  const failReason = p.fail_reason || '0';
  const printError = p.mc_print_error_code || p.print_error || '0';
  const errCode = p.err || '0';
  const err2 = p.err2 ? p.err2.err_code : '0';
  const file = p.gcode_file || p.subtask_name || '';
  const hms = p.hms || [];
  const spdMag = p.spd_mag;
  const stage = p.mc_print_stage;
  const subStage = p.mc_print_sub_stage;

  // State changes
  if (state && state !== lastState) {
    log('STATE: ' + lastState + ' -> ' + state + (file ? ' [' + file + ']' : ''));
    lastState = state;
  }

  // Progress every 2%
  if (state === 'RUNNING' && pct > 0 && pct !== lastPercent && (pct % 2 === 0 || pct <= 2)) {
    log('PROG: ' + pct + '% L' + layer + '/' + totalLayers + ' ETA ' + remaining +
      'm | N:' + nozzle + '/' + nozzleTarget + ' B:' + bed + '/' + bedTarget +
      ' Fan:' + fan + ' HB:' + heatbreak + ' Spd:' + spdMag + '%');
    lastPercent = pct;
  }

  // Errors
  const errorStr = failReason + '|' + printError + '|' + errCode + '|' + err2;
  if ((failReason !== '0' || String(printError) !== '0' || errCode !== '0' || err2 !== '0') && errorStr !== lastError) {
    log('!! ERROR: fail=' + failReason + ' printErr=' + printError + ' err=' + errCode + ' err2=' + err2);
    log('   State: ' + state + ' ' + pct + '% L' + layer + '/' + totalLayers +
      ' N:' + nozzle + '/' + nozzleTarget + ' B:' + bed + '/' + bedTarget);
    log('   Stage: ' + stage + ' Sub: ' + subStage);
    lastError = errorStr;
    fs.appendFileSync(logFile, new Date().toISOString() + ' | FULL DUMP:\n' + JSON.stringify(p, null, 2) + '\n');
  }

  // HMS — only log NEW codes
  if (hms.length > 0) {
    hms.forEach(h => {
      const key = h.attr + '_' + h.code + '_' + h.ts_unix;
      if (!seenHms.has(key)) {
        seenHms.add(key);
        log('HMS NEW: attr=0x' + h.attr.toString(16) + ' code=0x' + h.code.toString(16) + ' ts=' + h.ts_unix);
      }
    });
  }

  // Heartbeat every 2 min when printing
  if (state === 'RUNNING' && msgCount % 120 === 0) {
    log('BEAT: ' + pct + '% L' + layer + '/' + totalLayers + ' N:' + nozzle + '/' + nozzleTarget + ' B:' + bed + '/' + bedTarget);
  }
});

client.on('error', (err) => log('MQTT ERROR: ' + err.message));
process.on('SIGTERM', () => { log('MONITOR STOPPED'); client.end(); process.exit(0); });
