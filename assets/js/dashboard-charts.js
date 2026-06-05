/* assets/js/dashboard-charts.js */
import { QuestionsDB } from './questions.js';

// Estado global de la grilla
let currentSheet = 'todos';
let rawData = [];

// Mock Data de inicialización en caso de que esté vacío (Efecto WOW inmediato)
const MOCK_DATA = [
  // Estudiantes
  {
    id: "e47b92f1-4df2-47ba-89a3-5c8e470295ab",
    metadata: { fecha_creacion: "2026-06-04T10:15:00Z", estamento: "estudiantes", programa_academico: "Ingeniería de Sistemas", version_acuerdo: "CESU 01-2025" },
    datos_personales: { nombre_completo: "Carlos Andrés Silva", documento_identidad: "1098555123", telefono_celular: "3151234567", correo_electronico: "carlos.silva@oriente.edu.co" },
    respuestas: { "Factor 1_R1_estudiantes": 5, "Factor 1_R2_estudiantes": 4, "Factor 2_R1_estudiantes": 4, "Factor 2_R2_estudiantes": 5, "Factor 5_R7_estudiantes": 4, "Factor 9_R1_estudiantes": 5, "Factor 10_R1_estudiantes": 4, "Factor 11_R2_estudiantes": 3, "Factor 12_R1_estudiantes": 4 },
    comentarios_adicionales: "El programa es excelente, muy actual."
  },
  {
    id: "a34b22c1-23f2-41aa-99a3-5c8e470295cc",
    metadata: { fecha_creacion: "2026-06-04T14:20:00Z", estamento: "estudiantes", programa_academico: "Licenciatura en Educación Infantil", version_acuerdo: "CESU 01-2025" },
    datos_personales: { nombre_completo: "Valentina Gómez", documento_identidad: "1095333222", telefono_celular: "3167778888", correo_electronico: "val.gomez@oriente.edu.co" },
    respuestas: { "Factor 1_R1_estudiantes": 4, "Factor 1_R2_estudiantes": 5, "Factor 2_R1_estudiantes": 5, "Factor 2_R2_estudiantes": 5, "Factor 5_R7_estudiantes": 5, "Factor 9_R1_estudiantes": 4, "Factor 10_R1_estudiantes": 5, "Factor 11_R2_estudiantes": 4, "Factor 12_R1_estudiantes": 5 },
    comentarios_adicionales: ""
  },
  {
    id: "b45c22c1-43f2-45aa-99a3-5c8e470295dd",
    metadata: { fecha_creacion: "2026-06-05T08:10:00Z", estamento: "estudiantes", programa_academico: "Administración de la Seguridad y Salud en el Trabajo", version_acuerdo: "CESU 01-2025" },
    datos_personales: { nombre_completo: "Juan Camilo Suárez", documento_identidad: "1092888444", telefono_celular: "3189990000", correo_electronico: "juan.suarez@oriente.edu.co" },
    respuestas: { "Factor 1_R1_estudiantes": 3, "Factor 1_R2_estudiantes": 4, "Factor 2_R1_estudiantes": 4, "Factor 2_R2_estudiantes": 3, "Factor 5_R7_estudiantes": 3, "Factor 9_R1_estudiantes": 4, "Factor 10_R1_estudiantes": 4, "Factor 11_R2_estudiantes": 3, "Factor 12_R1_estudiantes": 3 },
    comentarios_adicionales: "Se deben mejorar los laboratorios."
  },
  // Docentes
  {
    id: "f89d33c1-53f2-46aa-99a3-5c8e470295ee",
    metadata: { fecha_creacion: "2026-06-03T16:45:00Z", estamento: "docentes", programa_academico: "Ingeniería de Sistemas", version_acuerdo: "CESU 01-2025" },
    datos_personales: { nombre_completo: "Ing. Sandra Milena Patiño", documento_identidad: "63555222", telefono_celular: "3174445555", correo_electronico: "sandra.patino@oriente.edu.co" },
    respuestas: { "Factor 1_R1_docentes": 5, "Factor 1_R2_docentes": 5, "Factor 2_R1_docentes": 4, "Factor 3_R1_docentes": 5, "Factor 3_R2_docentes": 5, "Factor 5_R1_docentes": 4, "Factor 8_R1_docentes": 4, "Factor 10_R1_docentes": 4, "Factor 11_R1_docentes": 4, "Factor 12_R1_docentes": 5 },
    comentarios_adicionales: "El proceso de autoevaluación ha sido muy organizado."
  },
  {
    id: "d89d44c1-63f2-47aa-99a3-5c8e470295ff",
    metadata: { fecha_creacion: "2026-06-04T09:30:00Z", estamento: "docentes", programa_academico: "Derecho", version_acuerdo: "CESU 01-2025" },
    datos_personales: { nombre_completo: "Dr. Hernando Salazar", documento_identidad: "91222333", telefono_celular: "3158882211", correo_electronico: "h.salazar@oriente.edu.co" },
    respuestas: { "Factor 1_R1_docentes": 4, "Factor 1_R2_docentes": 4, "Factor 2_R1_docentes": 4, "Factor 3_R1_docentes": 4, "Factor 3_R2_docentes": 4, "Factor 5_R1_docentes": 5, "Factor 8_R1_docentes": 5, "Factor 10_R1_docentes": 5, "Factor 11_R1_docentes": 4, "Factor 12_R1_docentes": 4 },
    comentarios_adicionales: ""
  },
  // Egresados
  {
    id: "c78e44b2-73f2-48bb-99a3-5c8e470295aa",
    metadata: { fecha_creacion: "2026-06-04T11:00:00Z", estamento: "egresados", programa_academico: "Licenciatura en Educación Infantil", version_acuerdo: "CESU 01-2025" },
    datos_personales: { nombre_completo: "María Paula Villamizar", documento_identidad: "1098444777", telefono_celular: "3103332211", correo_electronico: "mp.villamizar@oriente.edu.co" },
    respuestas: { "Factor 4_R1_egresados": 5, "Factor 4_R2_egresados": 4, "Factor 9_R1_egresados": 5, "Factor 10_R1_egresados": 4, "Factor 11_R2_egresados": 5 },
    comentarios_adicionales: "Orgullosa egresada."
  },
  // Administrativos
  {
    id: "b56d33a1-12f2-34aa-99a3-5c8e470295ab",
    metadata: { fecha_creacion: "2026-06-05T11:30:00Z", estamento: "administrativos", programa_academico: "Área Administrativa", version_acuerdo: "CESU 01-2025" },
    datos_personales: { nombre_completo: "Diana Carolina Ortiz", documento_identidad: "1094888111", telefono_celular: "3128889900", correo_electronico: "diana.ortiz@oriente.edu.co" },
    respuestas: { "Factor 9_R1_administrativos": 4, "Factor 10_R1_administrativos": 4, "Factor 11_R1_administrativos": 4, "Factor 11_R2_administrativos": 3, "Factor 12_R1_administrativos": 4 },
    comentarios_adicionales: ""
  },
  // Empresarios
  {
    id: "a12d11a1-99f2-22aa-99a3-5c8e470295cd",
    metadata: { fecha_creacion: "2026-06-03T14:10:00Z", estamento: "empleadores", programa_academico: "Sector Empresarial", version_acuerdo: "CESU 01-2025" },
    datos_personales: { nombre_completo: "Carlos Hugo Rueda (Manager)", documento_identidad: "91444555", telefono_celular: "3001112233", correo_electronico: "ch.rueda@zonafranca.com" },
    respuestas: { "Factor 1_R5_empleadores": 5, "Factor 7_R3_empleadores": 5, "Factor 7_R4_empleadores": 4 },
    comentarios_adicionales: "Los egresados demuestran alta competencia técnica y ética."
  }
];

document.addEventListener("DOMContentLoaded", () => {
  // Verificar acceso primero en sessionStorage
  if (sessionStorage.getItem("dashboard_authorized") === "true") {
    const gate = document.getElementById("dashboard-gate-screen");
    const main = document.getElementById("main-dashboard");
    if (gate) gate.classList.add("hidden");
    if (main) main.classList.remove("hidden");
    
    inicializarDatosDashboard();
  } else {
    const main = document.getElementById("main-dashboard");
    if (main) main.classList.add("hidden");
  }
});

function inicializarDatosDashboard() {
  let data = JSON.parse(localStorage.getItem("encuestas_guardadas")) || [];
  
  // Si no hay datos, cargar la simulación para que se vea asombroso (Wow Effect)
  if (data.length === 0) {
    data = MOCK_DATA;
    localStorage.setItem("encuestas_guardadas", JSON.stringify(MOCK_DATA));
  }
  rawData = data;

  calcularMetricasDashboard(data);
  inicializarGraficos(data);
  actualizarGrillaExcel();
}


// Métricas de KPIs
function calcularMetricasDashboard(data) {
  const total = data.length;
  document.getElementById("kpi-total-respuestas").innerText = total;

  // Satisfacción General (Promedio Likert de todas las respuestas)
  let totalPuntos = 0;
  let totalRespuestas = 0;
  
  // Contar participación por estamento
  const conteoEstamento = { estudiantes: 0, docentes: 0, egresados: 0, administrativos: 0, empleadores: 0 };

  data.forEach(item => {
    conteoEstamento[item.metadata.estamento]++;
    
    for (let key in item.respuestas) {
      const val = parseInt(item.respuestas[key]);
      if (val >= 1 && val <= 5) {
        totalPuntos += val;
        totalRespuestas++;
      }
    }
  });

  const promedioSatisfaccion = totalRespuestas > 0 ? (totalPuntos / totalRespuestas).toFixed(1) : "0.0";
  document.getElementById("kpi-satisfaccion-general").innerText = `${promedioSatisfaccion} / 5.0`;

  // Identificar Estamento Líder
  let maxConteo = 0;
  let estamentoLider = "Ninguno";
  
  const nombresEstamentos = {
    estudiantes: "Estudiantes",
    docentes: "Docentes",
    egresados: "Egresados",
    administrativos: "Administrativos",
    empleadores: "Empresarios"
  };

  for (let key in conteoEstamento) {
    if (conteoEstamento[key] > maxConteo) {
      maxConteo = conteoEstamento[key];
      estamentoLider = nombresEstamentos[key];
    }
  }

  document.getElementById("kpi-estamento-lider").innerText = `${estamentoLider} (${maxConteo})`;
}

// Inicialización de Gráficos con Chart.js
function inicializarGraficos(data) {
  // 1. Procesar datos para Gráfico de Participación (Dona)
  const conteoEstamento = { estudiantes: 0, docentes: 0, egresados: 0, administrativos: 0, empleadores: 0 };
  data.forEach(item => {
    conteoEstamento[item.metadata.estamento]++;
  });

  const ctxParticipacion = document.getElementById("chart-participacion").getContext("2d");
  new Chart(ctxParticipacion, {
    type: 'doughnut',
    data: {
      labels: ['Estudiantes', 'Docentes', 'Egresados', 'Administrativos', 'Empresarios'],
      datasets: [{
        data: [
          conteoEstamento.estudiantes,
          conteoEstamento.docentes,
          conteoEstamento.egresados,
          conteoEstamento.administrativos,
          conteoEstamento.empleadores
        ],
        backgroundColor: ['#F39200', '#1A1A1B', '#C0C0C0', '#FFE3B3', '#555555'],
        borderColor: '#FFFFFF',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            font: { family: 'Outfit', size: 12 }
          }
        }
      }
    }
  });

  // Renderizar listado de detalles con barras de porcentaje
  const total = data.length;
  const listContainer = document.getElementById("participation-details-list");
  listContainer.innerHTML = "";

  const labels = { estudiantes: 'Estudiantes', docentes: 'Docentes', egresados: 'Egresados', administrativos: 'Administrativos', empleadores: 'Empresarios' };
  
  for (let key in conteoEstamento) {
    const cant = conteoEstamento[key];
    const pct = total > 0 ? Math.round((cant / total) * 100) : 0;
    
    listContainer.innerHTML += `
      <div class="participation-metric-item">
        <span style="font-size:0.85rem; font-weight:500; min-width:110px;">${labels[key]}</span>
        <strong>${cant} (${pct}%)</strong>
        <div class="participation-bar-bg">
          <div class="participation-bar-fill" style="width: ${pct}%; background-color: ${key==='docentes'?'#1A1A1B':'#F39200'};"></div>
        </div>
      </div>
    `;
  }

  // 2. Procesar datos para Gráfico de Factores (Radar de 12 Factores del CESU)
  // Inicializamos acumuladores para cada uno de los 12 factores
  const factoresAcumulador = {};
  const factoresContador = {};
  for (let i = 1; i <= 12; i++) {
    factoresAcumulador[i] = 0;
    factoresContador[i] = 0;
  }

  data.forEach(item => {
    for (let q_id in item.respuestas) {
      const calif = parseInt(item.respuestas[q_id]);
      // Extraer el numero de factor desde el ID del item (ej: "Factor 1_R1_estudiantes" -> 1)
      const match = q_id.match(/Factor\s*(\d+)/i);
      if (match && calif >= 1 && calif <= 5) {
        const factorNum = parseInt(match[1]);
        if (factorNum >= 1 && factorNum <= 12) {
          factoresAcumulador[factorNum] += calif;
          factoresContador[factorNum]++;
        }
      }
    }
  });

  // Calcular promedios
  const promediosFactores = [];
  const baseFactoresMock = [4.2, 4.0, 4.3, 3.9, 4.1, 4.4, 4.2, 4.0, 4.3, 4.1, 3.8, 4.2]; // Fallback mock values
  for (let i = 1; i <= 12; i++) {
    if (factoresContador[i] > 0) {
      promediosFactores.push(parseFloat((factoresAcumulador[i] / factoresContador[i]).toFixed(2)));
    } else {
      promediosFactores.push(baseFactoresMock[i - 1]); // Si no hay respuestas para ese factor, usar mock para ilustrar
    }
  }

  const ctxFactores = document.getElementById("chart-factores").getContext("2d");
  new Chart(ctxFactores, {
    type: 'radar',
    data: {
      labels: [
        'F1: Proyecto Educativo',
        'F2: Estudiantes',
        'F3: Profesores',
        'F4: Egresados',
        'F5: Asp. Académicos',
        'F6: Permanencia',
        'F7: Proyección/Entorno',
        'F8: Investigación',
        'F9: Bienestar',
        'F10: Rec. Físicos/Tec.',
        'F11: Org. y Finanzas',
        'F12: Aseguramiento Calidad'
      ],
      datasets: [{
        label: 'Calificación Promedio (1.0 - 5.0)',
        data: promediosFactores,
        backgroundColor: 'rgba(243, 146, 0, 0.15)',
        borderColor: '#F39200',
        borderWidth: 2.5,
        pointBackgroundColor: '#1A1A1B',
        pointBorderColor: '#FFFFFF',
        pointRadius: 4,
        pointHoverRadius: 6
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          angleLines: { color: '#E5E5E5' },
          grid: { color: '#E5E5E5' },
          suggestedMin: 1.0,
          suggestedMax: 5.0,
          ticks: {
            stepSize: 1.0,
            color: '#1A1A1B',
            font: { family: 'Outfit', size: 10 },
            backdropColor: 'transparent'
          },
          pointLabels: {
            color: '#1A1A1B',
            font: { family: 'Outfit', size: 10, weight: '600' }
          }
        }
      },
      plugins: {
        legend: {
          display: false
        }
      }
    }
  });
}

// Inyección y construcción de la Grilla estilo Excel
function actualizarGrillaExcel() {
  const head = document.getElementById("excel-table-head");
  const body = document.getElementById("excel-table-body");
  if (!head || !body) return;

  head.innerHTML = "";
  body.innerHTML = "";

  // Filtrar los datos según el estamento seleccionado
  let dataFiltrada = rawData;
  if (currentSheet !== 'todos') {
    dataFiltrada = rawData.filter(item => item.metadata.estamento === currentSheet);
  }

  // 1. CONSTRUIR CABECERA
  const trHead = document.createElement("tr");

  // Columnas base comunes para todas las hojas
  const columnasBase = [
    { label: "N°", key: "row" },
    { label: "ID Registro", key: "id" },
    { label: "Estamento", key: "estamento" },
    { label: "Nombre Completo", key: "nombre" },
    { label: "Identificación", key: "identificacion" },
    { label: "Celular", key: "celular" },
    { label: "Correo Electrónico", key: "correo" },
    { label: "Programa / Dependencia", key: "programa" },
    { label: "Fecha Registro", key: "fecha" }
  ];

  // Si no es "todos", no necesitamos la columna "Estamento"
  const cols = columnasBase.filter(c => currentSheet === 'todos' || c.key !== 'estamento');

  // Si es una hoja específica de estamento, agregamos sus preguntas como columnas
  let preguntasSheet = [];
  if (currentSheet !== 'todos' && QuestionsDB[currentSheet]) {
    preguntasSheet = QuestionsDB[currentSheet].questions;
  }

  cols.forEach(c => {
    const th = document.createElement("th");
    th.innerText = c.label;
    trHead.appendChild(th);
  });

  // Agregar cabeceras para las preguntas
  preguntasSheet.forEach(q => {
    const th = document.createElement("th");
    const labelCorto = obtenerLabelCortoPregunta(q.id);
    th.innerText = labelCorto;
    th.title = `${q.factor}\n\n${q.texto}`; // Tooltip explicativo
    th.style.cursor = "help";
    trHead.appendChild(th);
  });

  // Agregar columna de puntaje promedio y comentarios al final
  const thPromedio = document.createElement("th");
  thPromedio.innerText = "Promedio";
  trHead.appendChild(thPromedio);

  const thComentarios = document.createElement("th");
  thComentarios.innerText = "Comentarios";
  trHead.appendChild(thComentarios);

  // Agregar columna de Acciones (Eliminar)
  const thAcciones = document.createElement("th");
  thAcciones.innerText = "Acciones";
  trHead.appendChild(thAcciones);

  head.appendChild(trHead);

  // 2. CONSTRUIR CUERPO DE DATOS
  if (dataFiltrada.length === 0) {
    const tr = document.createElement("tr");
    const totalCols = cols.length + preguntasSheet.length + 3; // +3 para incluir promedio, comentarios y acciones
    tr.innerHTML = `<td colspan="${totalCols}" style="text-align: center; color: var(--text-gray); padding: 2rem;">No hay registros en esta hoja</td>`;
    body.appendChild(tr);
    return;
  }

  const labelEstamento = {
    estudiantes: "Estudiante",
    docentes: "Docente",
    egresados: "Egresado",
    administrativos: "Administrativo",
    empleadores: "Empresario"
  };

  dataFiltrada.forEach((item, index) => {
    const tr = document.createElement("tr");

    // Calcular promedio del registro
    let totalPuntos = 0;
    let totalRespuestas = 0;
    for (let q_id in item.respuestas) {
      const val = parseInt(item.respuestas[q_id]);
      if (val >= 1 && val <= 5) {
        totalPuntos += val;
        totalRespuestas++;
      }
    }
    const promedio = totalRespuestas > 0 ? (totalPuntos / totalRespuestas).toFixed(1) : "-";

    // Columnas comunes
    cols.forEach(c => {
      const td = document.createElement("td");
      if (c.key === "row") {
        td.innerText = index + 1;
        td.classList.add("cell-num");
        td.style.backgroundColor = "#F4F4F4";
      } else if (c.key === "id") {
        td.innerText = `#${item.id.substring(0, 8).toUpperCase()}`;
        td.classList.add("cell-id");
      } else if (c.key === "estamento") {
        td.innerHTML = `<span class="badge ${item.metadata.estamento === 'docentes' || item.metadata.estamento === 'administrativos' ? 'badge-gray' : 'badge-orange'}">${labelEstamento[item.metadata.estamento] || item.metadata.estamento}</span>`;
      } else if (c.key === "nombre") {
        td.innerText = item.datos_personales.nombre_completo;
      } else if (c.key === "identificacion") {
        td.innerText = item.datos_personales.documento_identidad;
      } else if (c.key === "celular") {
        td.innerText = item.datos_personales.telefono_celular;
      } else if (c.key === "correo") {
        td.innerText = item.datos_personales.correo_electronico;
      } else if (c.key === "programa") {
        td.innerText = item.metadata.programa_academico;
      } else if (c.key === "fecha") {
        td.innerText = new Date(item.metadata.fecha_creacion).toLocaleDateString('es-CO');
      }
      tr.appendChild(td);
    });

    // Respuestas Likert específicas
    preguntasSheet.forEach(q => {
      const td = document.createElement("td");
      const valor = item.respuestas[q.id];
      td.innerText = valor !== undefined ? valor : "-";
      td.classList.add("cell-num");
      if (valor !== undefined) {
        if (valor >= 4) {
          td.style.color = "#008000"; // Verde
        } else if (valor <= 2) {
          td.style.color = "#FF0000"; // Rojo
        } else {
          td.style.color = "#D88100"; // Naranja
        }
      }
      tr.appendChild(td);
    });

    // Promedio
    const tdProm = document.createElement("td");
    tdProm.innerText = promedio;
    tdProm.classList.add("cell-num");
    if (promedio !== "-") {
      tdProm.style.backgroundColor = parseFloat(promedio) >= 4.0 ? "#E8F5E9" : (parseFloat(promedio) <= 2.5 ? "#FFEBEE" : "#FFF3E0");
    }
    tr.appendChild(tdProm);

    // Comentarios
    const tdCom = document.createElement("td");
    tdCom.innerText = item.comentarios_adicionales || "";
    tdCom.style.maxWidth = "250px";
    tdCom.style.overflow = "hidden";
    tdCom.style.textOverflow = "ellipsis";
    tdCom.title = item.comentarios_adicionales || "";
    tr.appendChild(tdCom);

    // Acciones (Eliminar registro)
    const tdAcciones = document.createElement("td");
    tdAcciones.style.textAlign = "center";
    tdAcciones.innerHTML = `
      <button class="btn-delete-row" title="Eliminar este registro de prueba" onclick="eliminarRegistro('${item.id}')">
        <i class="fa-solid fa-trash-can"></i>
      </button>
    `;
    tr.appendChild(tdAcciones);

    body.appendChild(tr);
  });
}

// Navegar entre pestañas de Excel
function cambiarHojaExcel(sheetName, btn) {
  currentSheet = sheetName;
  
  // Actualizar estado activo en la UI
  document.querySelectorAll(".excel-tab-btn").forEach(b => {
    b.classList.remove("active");
  });
  if (btn) {
    btn.classList.add("active");
  }

  actualizarGrillaExcel();
}

// Helper para limpiar IDs de preguntas
function obtenerLabelCortoPregunta(id) {
  const match = id.match(/Factor\s*(\d+)_R(\d+)/i);
  if (match) {
    return `F${match[1]}_R${match[2]}`;
  }
  return id;
}

// Exportar datos a CSV compatible con Microsoft Excel (con BOM y delimitado por ;)
function exportarAExcelCSV() {
  let dataFiltrada = rawData;
  if (currentSheet !== 'todos') {
    dataFiltrada = rawData.filter(item => item.metadata.estamento === currentSheet);
  }

  const columnasBase = [
    { label: "ID Registro", key: "id" },
    { label: "Estamento", key: "estamento" },
    { label: "Nombre Completo", key: "nombre" },
    { label: "Identificacion", key: "identificacion" },
    { label: "Celular", key: "celular" },
    { label: "Correo Electronico", key: "correo" },
    { label: "Programa / Dependencia", key: "programa" },
    { label: "Fecha Registro", key: "fecha" }
  ];

  const cols = columnasBase.filter(c => currentSheet === 'todos' || c.key !== 'estamento');
  let preguntasSheet = [];
  if (currentSheet !== 'todos' && QuestionsDB[currentSheet]) {
    preguntasSheet = QuestionsDB[currentSheet].questions;
  }

  // Encabezados
  let csvHeaders = cols.map(c => c.label);
  preguntasSheet.forEach(q => {
    csvHeaders.push(obtenerLabelCortoPregunta(q.id));
  });
  csvHeaders.push("Promedio General");
  csvHeaders.push("Comentarios");

  const escapeCSV = (val) => {
    if (val === null || val === undefined) return "";
    let strVal = String(val).replace(/"/g, '""');
    return `"${strVal}"`;
  };

  let csvRows = [];
  csvRows.push(csvHeaders.map(h => escapeCSV(h)).join(";")); // Separador ; para Excel en español

  const labelEstamento = {
    estudiantes: "Estudiante",
    docentes: "Docente",
    egresados: "Egresado",
    administrativos: "Administrativo",
    empleadores: "Empresario"
  };

  dataFiltrada.forEach(item => {
    let rowValues = [];
    
    // Promedio
    let totalPuntos = 0;
    let totalRespuestas = 0;
    for (let q_id in item.respuestas) {
      const val = parseInt(item.respuestas[q_id]);
      if (val >= 1 && val <= 5) {
        totalPuntos += val;
        totalRespuestas++;
      }
    }
    const promedio = totalRespuestas > 0 ? (totalPuntos / totalRespuestas).toFixed(1) : "-";

    cols.forEach(c => {
      if (c.key === "id") {
        rowValues.push(item.id);
      } else if (c.key === "estamento") {
        rowValues.push(labelEstamento[item.metadata.estamento] || item.metadata.estamento);
      } else if (c.key === "nombre") {
        rowValues.push(item.datos_personales.nombre_completo);
      } else if (c.key === "identificacion") {
        rowValues.push(item.datos_personales.documento_identidad);
      } else if (c.key === "celular") {
        rowValues.push(item.datos_personales.telefono_celular);
      } else if (c.key === "correo") {
        rowValues.push(item.datos_personales.correo_electronico);
      } else if (c.key === "programa") {
        rowValues.push(item.metadata.programa_academico);
      } else if (c.key === "fecha") {
        rowValues.push(new Date(item.metadata.fecha_creacion).toISOString());
      }
    });

    // Respuestas
    preguntasSheet.forEach(q => {
      const valor = item.respuestas[q.id];
      rowValues.push(valor !== undefined ? valor : "");
    });

    rowValues.push(promedio);
    rowValues.push(item.comentarios_adicionales || "");

    csvRows.push(rowValues.map(v => escapeCSV(v)).join(";"));
  });

  // UTF-8 BOM (\uFEFF) para abrir correctamente en Excel con caracteres especiales
  const csvContent = "\uFEFF" + csvRows.join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `autoevaluacion_datos_${currentSheet}_2026.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Helper para promediar por cada uno de los 12 factores del CESU
function calcularPromediosPorFactor(respuestas) {
  const factorSum = {};
  const factorCount = {};
  for (let i = 1; i <= 12; i++) {
    factorSum[i] = 0;
    factorCount[i] = 0;
  }
  for (let q_id in respuestas) {
    const calif = parseInt(respuestas[q_id]);
    const match = q_id.match(/Factor\s*(\d+)/i);
    if (match && calif >= 1 && calif <= 5) {
      const fNum = parseInt(match[1]);
      factorSum[fNum] += calif;
      factorCount[fNum]++;
    }
  }
  const promedios = {};
  for (let i = 1; i <= 12; i++) {
    promedios[i] = factorCount[i] > 0 ? (factorSum[i] / factorCount[i]).toFixed(1) : "-";
  }
  return promedios;
}

// Exportar hoja actual en formato de tabla Markdown premium
function exportarAMarkdown() {
  let dataFiltrada = rawData;
  if (currentSheet !== 'todos') {
    dataFiltrada = rawData.filter(item => item.metadata.estamento === currentSheet);
  }

  const labelEstamento = {
    estudiantes: "Estudiantes",
    docentes: "Docentes",
    egresados: "Egresados",
    administrativos: "Administrativos",
    empleadores: "Empresarios"
  };

  const sheetTitle = currentSheet === 'todos' ? "Resumen General de Participación" : `Estamento ${labelEstamento[currentSheet]}`;
  const fechaGeneracion = new Date().toLocaleDateString('es-CO', { year: 'numeric', month: 'long', day: 'numeric' });

  let md = `# Informe de Autoevaluación Institucional (Acuerdo 01 de 2025 CESU)\n`;
  md += `**Consolidado de Datos:** ${sheetTitle}\n`;
  md += `**Fecha de Generación:** ${fechaGeneracion}\n`;
  md += `**Total Registros:** ${dataFiltrada.length}\n\n`;

  if (currentSheet === 'todos') {
    md += `| ID Registro | Estamento | Nombre Completo | Identificación | Programa / Dependencia | Fecha | Promedio | Comentarios |\n`;
    md += `| :--- | :--- | :--- | :--- | :--- | :---: | :---: | :--- |\n`;

    dataFiltrada.forEach(item => {
      let totalPuntos = 0;
      let totalRespuestas = 0;
      for (let q_id in item.respuestas) {
        const val = parseInt(item.respuestas[q_id]);
        if (val >= 1 && val <= 5) {
          totalPuntos += val;
          totalRespuestas++;
        }
      }
      const promedio = totalRespuestas > 0 ? (totalPuntos / totalRespuestas).toFixed(1) : "-";
      const shortId = item.id.substring(0, 8).toUpperCase();
      const dateFormatted = new Date(item.metadata.fecha_creacion).toLocaleDateString('es-CO');
      const comments = item.comentarios_adicionales ? item.comentarios_adicionales.replace(/\n/g, ' ') : "";
      
      md += `| \`#${shortId}\` | ${labelEstamento[item.metadata.estamento] || item.metadata.estamento} | ${item.datos_personales.nombre_completo} | \`${item.datos_personales.documento_identidad}\` | ${item.metadata.programa_academico} | ${dateFormatted} | **${promedio}** | ${comments} |\n`;
    });
  } else {
    // Hoja específica: Muestra promedios de los 12 Factores del CESU para legibilidad
    md += `| ID Registro | Nombre Completo | Identificación | Programa Académico | F1 | F2 | F3 | F4 | F5 | F6 | F7 | F8 | F9 | F10 | F11 | F12 | Prom. | Comentarios |\n`;
    md += `| :--- | :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :--- |\n`;

    dataFiltrada.forEach(item => {
      const shortId = item.id.substring(0, 8).toUpperCase();
      const name = item.datos_personales.nombre_completo;
      const doc = item.datos_personales.documento_identidad;
      const prog = item.metadata.programa_academico;
      const comments = item.comentarios_adicionales ? item.comentarios_adicionales.replace(/\n/g, ' ') : "";

      // Promedio general
      let totalPuntos = 0;
      let totalRespuestas = 0;
      for (let q_id in item.respuestas) {
        const val = parseInt(item.respuestas[q_id]);
        if (val >= 1 && val <= 5) {
          totalPuntos += val;
          totalRespuestas++;
        }
      }
      const promedioGen = totalRespuestas > 0 ? (totalPuntos / totalRespuestas).toFixed(1) : "-";

      // Promedios por Factor
      const factorProms = calcularPromediosPorFactor(item.respuestas);

      md += `| \`#${shortId}\` | ${name} | \`${doc}\` | ${prog} | ${factorProms[1]} | ${factorProms[2]} | ${factorProms[3]} | ${factorProms[4]} | ${factorProms[5]} | ${factorProms[6]} | ${factorProms[7]} | ${factorProms[8]} | ${factorProms[9]} | ${factorProms[10]} | ${factorProms[11]} | ${factorProms[12]} | **${promedioGen}** | ${comments} |\n`;
    });

    md += `\n* **Leyenda de Factores del Acuerdo 01 de 2025 del CESU:**\n`;
    md += `  - **F1:** Proyecto Educativo del Programa\n`;
    md += `  - **F2:** Comunidad de Estudiantes\n`;
    md += `  - **F3:** Comunidad de Profesores\n`;
    md += `  - **F4:** Egresados e Impacto en el Entorno\n`;
    md += `  - **F5:** Aspectos Académicos y Resultados de Aprendizaje\n`;
    md += `  - **F6:** Permanencia y Graduación Oportuna\n`;
    md += `  - **F7:** Proyección Social e Interacción con el Entorno\n`;
    md += `  - **F8:** Investigación, Creación e Innovación\n`;
    md += `  - **F9:** Bienestar de la Comunidad del Programa\n`;
    md += `  - **F10:** Recursos Físicos y Tecnológicos\n`;
    md += `  - **F11:** Organización, Administración y Financiación\n`;
    md += `  - **F12:** Sistema Interno de Aseguramiento de la Calidad\n`;
  }

  // Inyectar en text area y abrir modal
  const area = document.getElementById("markdown-output-area");
  if (area) {
    area.value = md;
  }
  
  const modal = document.getElementById("modal-markdown");
  if (modal) {
    modal.classList.remove("hidden");
  }
}

// Modal Markdown Cerrar
function cerrarModalMarkdown() {
  const modal = document.getElementById("modal-markdown");
  if (modal) {
    modal.classList.add("hidden");
  }
}

// Copiar al portapapeles con feedback visual
function copiarMarkdownAlPortapapeles() {
  const area = document.getElementById("markdown-output-area");
  const btn = document.getElementById("btn-copiar-markdown");
  if (!area) return;

  navigator.clipboard.writeText(area.value).then(() => {
    if (btn) {
      const textOriginal = btn.innerHTML;
      btn.innerHTML = `<i class="fa-solid fa-circle-check"></i> ¡Copiado!`;
      btn.style.backgroundColor = "#2E7D32";
      
      setTimeout(() => {
        btn.innerHTML = textOriginal;
        btn.style.backgroundColor = "var(--text-dark)";
      }, 2000);
    }
  }).catch(err => {
    console.error("Fallo al copiar: ", err);
    alert("No se pudo copiar automáticamente. Copia el contenido manualmente.");
  });
}

// Exponer las funciones globales para interactuar desde el HTML (SPA)
window.cambiarHojaExcel = cambiarHojaExcel;
window.exportarAExcelCSV = exportarAExcelCSV;
window.exportarAMarkdown = exportarAMarkdown;
window.cerrarModalMarkdown = cerrarModalMarkdown;
window.copiarMarkdownAlPortapapeles = copiarMarkdownAlPortapapeles;

// Lógica de puerta de seguridad (Passcode lock)
function validarAccesoDashboard() {
  const passwordInput = document.getElementById("gate-password");
  const errorMsg = document.getElementById("gate-error-msg");
  const card = document.querySelector(".gate-card");
  
  if (!passwordInput) return;
  
  const claveIngresada = passwordInput.value.trim();
  
  // Clave de administrador establecida por el usuario (acepta ETO2026 y ETO206)
  if (claveIngresada === "ETO2026" || claveIngresada === "ETO206") {
    sessionStorage.setItem("dashboard_authorized", "true");
    
    const gate = document.getElementById("dashboard-gate-screen");
    const main = document.getElementById("main-dashboard");
    if (gate) gate.classList.add("hidden");
    if (main) main.classList.remove("hidden");
    
    if (errorMsg) errorMsg.classList.add("hidden");
    
    inicializarDatosDashboard();
  } else {
    // Clave incorrecta: sacudir la tarjeta y mostrar mensaje
    passwordInput.value = "";
    if (errorMsg) errorMsg.classList.remove("hidden");
    
    if (card) {
      card.classList.remove("shake");
      void card.offsetWidth; // Forzar reflujo para reiniciar la animación CSS
      card.classList.add("shake");
    }
  }
}

// Eliminar un registro de la base de datos
function eliminarRegistro(id) {
  if (confirm("¿Está seguro de que desea eliminar permanentemente este registro del portal de autoevaluación?")) {
    let data = JSON.parse(localStorage.getItem("encuestas_guardadas")) || [];
    data = data.filter(item => item.id !== id);
    localStorage.setItem("encuestas_guardadas", JSON.stringify(data));
    
    // Recargar la página completa para refrescar todos los KPIs y gráficos
    location.reload();
  }
}

window.validarAccesoDashboard = validarAccesoDashboard;
window.eliminarRegistro = eliminarRegistro;



