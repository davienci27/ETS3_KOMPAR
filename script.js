const sysValue = document.getElementById("sysValue");
const diaValue = document.getElementById("diaValue");
const mapValue = document.getElementById("mapValue");
const bpmValue = document.getElementById("bpmValue");
const adcValue = document.getElementById("adcValue");
const pressureValue = document.getElementById("pressureValue");
const statusBox = document.getElementById("statusBox");
const logList = document.getElementById("logList");
const modePatient = document.getElementById("modePatient");
const samplingSpeed = document.getElementById("samplingSpeed");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");
const resetBtn = document.getElementById("resetBtn");
const manualBtn = document.getElementById("manualBtn");
const adcInput = document.getElementById("adcInput");
const manualResult = document.getElementById("manualResult");
const canvas = document.getElementById("pressureChart");
const ctx = canvas.getContext("2d");

let timer = null;
let dataPoints = [];
let beatStep = 0;

function randomRange(min, max) {
  return Math.round(min + Math.random() * (max - min));
}

function convertAdcToVoltage(adc) {
  return (adc / 1023) * 3.3;
}

function convertVoltageToPressure(voltage) {
  // Simulasi kalibrasi sederhana:
  // rentang tegangan 0.2V - 3.0V dipetakan ke 0 - 220 mmHg
  const pressure = ((voltage - 0.2) / (3.0 - 0.2)) * 220;
  return Math.max(0, Math.round(pressure));
}

function getTargetByMode(mode) {
  if (mode === "normal") {
    return {
      sys: randomRange(105, 119),
      dia: randomRange(68, 79),
      bpm: randomRange(65, 82)
    };
  }

  if (mode === "pre") {
    return {
      sys: randomRange(120, 139),
      dia: randomRange(80, 89),
      bpm: randomRange(75, 92)
    };
  }

  return {
    sys: randomRange(140, 165),
    dia: randomRange(90, 106),
    bpm: randomRange(84, 105)
  };
}

function calculateMAP(sys, dia) {
  return Math.round((sys + (2 * dia)) / 3);
}

function classifyPressure(sys, dia) {
  if (sys < 120 && dia < 80) {
    return {
      label: "Normal",
      text: "Status: Normal. Tekanan darah berada pada rentang aman.",
      className: "normal"
    };
  }

  if (sys < 140 || dia < 90) {
    return {
      label: "Pra-Hipertensi",
      text: "Status: Perlu perhatian. Tekanan darah mulai meningkat.",
      className: "warning"
    };
  }

  return {
    label: "Hipertensi",
    text: "Status: Tinggi. Tekanan darah berada pada rentang hipertensi.",
    className: "high"
  };
}

function simulateSensorSignal(target) {
  // Logic sinyal berdenyut seperti oscillometric blood pressure monitor.
  const pulse = Math.sin(beatStep / 3) * 7;
  const noise = (Math.random() - 0.5) * 4;
  const envelope = Math.sin(beatStep / 18) * 3;
  beatStep += 1;

  const pressure = Math.max(0, Math.round(target.dia + ((target.sys - target.dia) * 0.48) + pulse + envelope + noise));
  const voltage = 0.2 + (pressure / 220) * 2.8;
  const adc = Math.min(1023, Math.max(0, Math.round((voltage / 3.3) * 1023)));

  return { pressure, voltage, adc };
}

function updateUI(target, sensor) {
  const map = calculateMAP(target.sys, target.dia);
  const status = classifyPressure(target.sys, target.dia);

  sysValue.textContent = target.sys;
  diaValue.textContent = target.dia;
  mapValue.textContent = map;
  bpmValue.textContent = target.bpm;
  adcValue.textContent = sensor.adc;
  pressureValue.textContent = sensor.pressure;

  statusBox.textContent = status.text;
  statusBox.className = `status-box ${status.className}`;

  addLog(target, sensor, status);
}

function addLog(target, sensor, status) {
  const time = new Date().toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  if (logList.querySelector(".empty")) {
    logList.innerHTML = "";
  }

  const item = document.createElement("div");
  item.className = "log-item";
  item.innerHTML = `
    <span>${time}</span>
    <strong>${target.sys}/${target.dia} mmHg • ${target.bpm} bpm • ADC ${sensor.adc}</strong>
    <span>${status.label}</span>
  `;

  logList.prepend(item);

  const items = logList.querySelectorAll(".log-item");
  if (items.length > 12) {
    items[items.length - 1].remove();
  }
}

function drawChart() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const padding = 40;
  const w = canvas.width - padding * 2;
  const h = canvas.height - padding * 2;

  ctx.strokeStyle = "#e5e7eb";
  ctx.lineWidth = 1;

  for (let i = 0; i <= 5; i++) {
    const y = padding + (h / 5) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(canvas.width - padding, y);
    ctx.stroke();
  }

  ctx.fillStyle = "#6b7280";
  ctx.font = "14px Arial";
  ctx.fillText("Tekanan Sensor (mmHg)", padding, 24);

  if (dataPoints.length < 2) {
    return;
  }

  ctx.strokeStyle = "#2563eb";
  ctx.lineWidth = 3;
  ctx.beginPath();

  dataPoints.forEach((point, index) => {
    const x = padding + (index / (dataPoints.length - 1)) * w;
    const y = padding + h - (point / 180) * h;

    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  const last = dataPoints[dataPoints.length - 1];
  ctx.fillStyle = "#111827";
  ctx.fillText(`${last} mmHg`, canvas.width - 120, padding + 18);
}

function runSimulation() {
  const target = getTargetByMode(modePatient.value);
  const sensor = simulateSensorSignal(target);

  dataPoints.push(sensor.pressure);
  if (dataPoints.length > 80) {
    dataPoints.shift();
  }

  updateUI(target, sensor);
  drawChart();
}

function startSimulation() {
  stopSimulation();
  runSimulation();
  timer = setInterval(runSimulation, Number(samplingSpeed.value));
}

function stopSimulation() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function resetSimulation() {
  stopSimulation();
  dataPoints = [];
  beatStep = 0;
  sysValue.textContent = "--";
  diaValue.textContent = "--";
  mapValue.textContent = "--";
  bpmValue.textContent = "--";
  adcValue.textContent = "--";
  pressureValue.textContent = "--";
  statusBox.textContent = "Menunggu simulasi...";
  statusBox.className = "status-box";
  logList.innerHTML = `<p class="empty">Belum ada data.</p>`;
  manualResult.textContent = "Hasil manual akan muncul di sini.";
  drawChart();
}

function processManualAdc() {
  const adc = Number(adcInput.value);

  if (Number.isNaN(adc) || adc < 0 || adc > 1023) {
    manualResult.textContent = "Nilai ADC harus berada di antara 0 sampai 1023.";
    return;
  }

  const voltage = convertAdcToVoltage(adc);
  const pressure = convertVoltageToPressure(voltage);

  manualResult.textContent = `ADC ${adc} = ${voltage.toFixed(2)} V = sekitar ${pressure} mmHg`;
}

startBtn.addEventListener("click", startSimulation);
stopBtn.addEventListener("click", stopSimulation);
resetBtn.addEventListener("click", resetSimulation);
manualBtn.addEventListener("click", processManualAdc);
samplingSpeed.addEventListener("change", () => {
  if (timer) {
    startSimulation();
  }
});

drawChart();
