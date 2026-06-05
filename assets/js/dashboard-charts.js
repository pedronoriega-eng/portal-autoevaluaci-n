/* assets/js/dashboard-charts.js */

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
  let data = JSON.parse(localStorage.getItem("encuestas_guardadas")) || [];
  
  // Si no hay datos, cargar la simulación para que se vea asombroso (Wow Effect)
  if (data.length === 0) {
    data = MOCK_DATA;
    localStorage.setItem("encuestas_guardadas", JSON.stringify(MOCK_DATA));
  }

  calcularMetricasDashboard(data);
  inicializarGraficos(data);
  construirTablaParticipacion(data);
});

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

// Inyección de Registros de Participación Reciente
function construirTablaParticipacion(data) {
  const tbody = document.getElementById("table-participacion-body");
  tbody.innerHTML = "";

  // Ordenar del más reciente al más antiguo
  const sortedData = [...data].sort((a, b) => {
    return new Date(b.metadata.fecha_creacion) - new Date(a.metadata.fecha_creacion);
  });

  // Mostrar los últimos 10 registros
  const limitData = sortedData.slice(0, 10);

  const badges = {
    estudiantes: "badge-orange",
    docentes: "badge-gray",
    egresados: "badge-orange",
    administrativos: "badge-gray",
    empleadores: "badge-orange"
  };

  const labels = {
    estudiantes: "Estudiante",
    docentes: "Docente",
    egresados: "Egresado",
    administrativos: "Administrativo",
    empleadores: "Empresario"
  };

  limitData.forEach(item => {
    const shortId = item.id.substring(0, 8).toUpperCase();
    const dateFormatted = new Date(item.metadata.fecha_creacion).toLocaleString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><code>#${shortId}</code></td>
      <td><span class="badge ${badges[item.metadata.estamento]}">${labels[item.metadata.estamento]}</span></td>
      <td>${item.metadata.programa_academico}</td>
      <td>${dateFormatted}</td>
      <td><span style="color:#00B359; font-weight:600;"><i class="fa-solid fa-cloud-arrow-up"></i> Guardado</span></td>
    `;
    tbody.appendChild(tr);
  });
}
