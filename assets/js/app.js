/* assets/js/app.js */
import { QuestionsDB } from './questions.js';

// Estado de la aplicación
const AppState = {
  currentRol: null,
  isAuthorized: false,
  userData: {
    nombre: "",
    cedula: "",
    celular: "",
    correo: "",
    programa: "",
    habeasData: false
  },
  questions: [],
  currentQuestionIndex: 0,
  answers: {},
  comments: ""
};

// Vinculación de funciones al objeto Window para acceso directo desde HTML
window.seleccionarEstamento = seleccionarEstamento;
window.iniciarEncuestaActiva = iniciarEncuestaActiva;
window.responderPregunta = responderPregunta;
window.navegarPregunta = navegarPregunta;
window.finalizarYEnviarEncuesta = finalizarYEnviarEncuesta;
window.reiniciarPortal = reiniciarPortal;
window.abrirModalHabeas = abrirModalHabeas;
window.cerrarModalHabeas = cerrarModalHabeas;
window.volverALanding = volverALanding;
window.volverARegistro = volverARegistro;
window.volverAEncuestaDesdeComentarios = volverAEncuestaDesdeComentarios;
window.accederAlDashboard = accederAlDashboard;


// Inicialización de eventos al cargar el DOM
document.addEventListener("DOMContentLoaded", () => {
  setupFormEventListeners();
  setupKeyboardNavigation();
  // Inicializa base de datos de simulación local si no existe
  if (!localStorage.getItem("encuestas_guardadas")) {
    localStorage.setItem("encuestas_guardadas", JSON.stringify([]));
  }
});

// Configuración de listeners de inputs para validar Habeas Data en tiempo real
function setupFormEventListeners() {
  const inputs = ["user-name", "user-id", "user-phone", "user-email", "user-program"];
  inputs.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("input", validarFormularioHabeasData);
  });

  const checkbox = document.getElementById("user-habeas");
  if (checkbox) checkbox.addEventListener("change", validarFormularioHabeasData);
}

// Validación Habeas Data en tiempo real
function validarFormularioHabeasData() {
  const nombre = document.getElementById("user-name").value;
  const cedula = document.getElementById("user-id").value;
  const celular = document.getElementById("user-phone").value;
  const correo = document.getElementById("user-email").value;
  const programa = document.getElementById("user-program").value;
  const habeasData = document.getElementById("user-habeas").checked;

  AppState.userData = { nombre, cedula, celular, correo, programa, habeasData };

  // Validar si la identificación ya votó en cualquier estamento de forma proactiva
  const encuestasGuardadas = JSON.parse(localStorage.getItem("encuestas_guardadas")) || [];
  const cedulaIngresada = cedula.trim();
  const yaParticipo = cedulaIngresada.length >= 6 && encuestasGuardadas.some(
    enc => enc.datos_personales.documento_identidad.trim() === cedulaIngresada
  );

  const errorMsgEl = document.getElementById("register-error-msg");
  if (errorMsgEl) {
    if (yaParticipo) {
      errorMsgEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Esta identificación ya tiene una encuesta registrada en el sistema. Para garantizar la transparencia, solo se permite una encuesta por persona.`;
      errorMsgEl.classList.remove("hidden");
    } else {
      errorMsgEl.classList.add("hidden");
    }
  }

  // Validaciones RegEx
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^3\d{9}$/; // Celulares en Colombia (10 dígitos empezando con 3)

  const isValid = nombre.trim().length > 4 &&
                  cedula.trim().length >= 6 &&
                  !yaParticipo &&
                  phoneRegex.test(celular) &&
                  emailRegex.test(correo) &&
                  programa !== "" &&
                  habeasData === true;

  const submitButton = document.getElementById("btn-iniciar-encuesta");
  if (submitButton) {
    if (isValid) {
      submitButton.removeAttribute("disabled");
      AppState.isAuthorized = true;
    } else {
      submitButton.setAttribute("disabled", "true");
      AppState.isAuthorized = false;
    }
  }
}

// Manejo de pantallas (SPA Router)
function navegarA(pantallaId) {
  if (pantallaId === "section-survey" && !AppState.isAuthorized) {
    alert("Acceso denegado. Debe completar sus datos personales y aceptar la política de Habeas Data.");
    navegarA("section-register");
    return;
  }

  document.querySelectorAll(".app-section").forEach(sec => {
    sec.classList.add("hidden");
  });
  
  const target = document.getElementById(pantallaId);
  if (target) {
    target.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

// Paso 1: Selección de Rol
function seleccionarEstamento(rol) {
  AppState.currentRol = rol;
  AppState.questions = QuestionsDB[rol].questions;
  AppState.currentQuestionIndex = 0;
  AppState.answers = {};
  AppState.comments = "";
  
  // Limpiar inputs del formulario
  document.getElementById("form-habeas-data").reset();
  validarFormularioHabeasData();

  navegarA("section-register");
}

// Paso 2: Iniciar la encuesta activa tras validar Habeas Data
function iniciarEncuestaActiva() {
  if (!AppState.isAuthorized) return;

  // Validar si la identificación ya votó en cualquier estamento
  const encuestasGuardadas = JSON.parse(localStorage.getItem("encuestas_guardadas")) || [];
  const cedulaIngresada = AppState.userData.cedula.trim();

  const yaParticipo = encuestasGuardadas.some(
    enc => enc.datos_personales.documento_identidad.trim() === cedulaIngresada
  );

  if (yaParticipo) {
    const errorMsgEl = document.getElementById("register-error-msg");
    if (errorMsgEl) {
      errorMsgEl.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Esta identificación ya tiene una encuesta registrada en el sistema. Para garantizar la transparencia, solo se permite una encuesta por persona.`;
      errorMsgEl.classList.remove("hidden");
    }
    return;
  }

  navegarA("section-survey");
  renderizarPreguntaActual();
}

// Renderizado de la Pregunta Activa (Motor Conversacional)
function renderizarPreguntaActual() {
  if (AppState.questions.length === 0) return;

  const q = AppState.questions[AppState.currentQuestionIndex];
  
  // Actualizar textos
  document.getElementById("survey-factor-title").innerText = `Factor ${q.factor || 'Evaluación'}`;
  document.getElementById("survey-question-text").innerText = q.texto;

  // Actualizar barra de progreso
  const total = AppState.questions.length;
  const actual = AppState.currentQuestionIndex + 1;
  const porcentaje = Math.round(((actual - 1) / total) * 100);
  
  document.getElementById("survey-progress-bar").style.width = `${porcentaje}%`;
  document.getElementById("survey-progress-text").innerText = `Pregunta ${actual} de ${total} (${porcentaje}%)`;

  // Limpiar estilos Likert y resaltar si ya tiene respuesta previa
  document.querySelectorAll(".likert-option").forEach(opt => {
    opt.classList.remove("selected");
  });

  const respuestaPrevia = AppState.answers[q.id];
  if (respuestaPrevia) {
    document.querySelector(`.likert-option:nth-child(${respuestaPrevia})`).classList.add("selected");
  }

  // Deshabilitar botón 'Anterior' en la primera pregunta
  const btnPrevia = document.getElementById("btn-previa");
  if (btnPrevia) {
    if (AppState.currentQuestionIndex === 0) {
      btnPrevia.setAttribute("disabled", "true");
    } else {
      btnPrevia.removeAttribute("disabled");
    }
  }

  // Modificar botón 'Siguiente' si es la última pregunta
  const btnSiguiente = document.getElementById("btn-siguiente");
  if (btnSiguiente) {
    if (AppState.currentQuestionIndex === total - 1) {
      btnSiguiente.innerHTML = `Finalizar <i class="fa-solid fa-circle-check"></i>`;
    } else {
      btnSiguiente.innerHTML = `Siguiente <i class="fa-solid fa-chevron-right"></i>`;
    }
  }
}

// Acción de responder con la escala Likert (1 al 5)
function responderPregunta(calificacion) {
  const q = AppState.questions[AppState.currentQuestionIndex];
  AppState.answers[q.id] = calificacion;

  // Resaltar visualmente la opción seleccionada
  document.querySelectorAll(".likert-option").forEach((opt, idx) => {
    if (idx + 1 === calificacion) {
      opt.classList.add("selected");
    } else {
      opt.classList.remove("selected");
    }
  });

  // Micro-animación y avance automático
  setTimeout(() => {
    const total = AppState.questions.length;
    if (AppState.currentQuestionIndex < total - 1) {
      AppState.currentQuestionIndex++;
      renderizarPreguntaActual();
    } else {
      // Si es la última pregunta, avanzar a la pantalla de comentarios cualitativos
      navegarA("section-comments");
    }
  }, 250);
}

// Navegación manual mediante botones Anterior/Siguiente
function navegarPregunta(direccion) {
  const total = AppState.questions.length;
  const nuevoIndice = AppState.currentQuestionIndex + direccion;

  if (nuevoIndice >= 0 && nuevoIndice < total) {
    AppState.currentQuestionIndex = nuevoIndice;
    renderizarPreguntaActual();
  } else if (nuevoIndice === total) {
    // Si hace click en Siguiente en la última pregunta
    navegarA("section-comments");
  }
}

// Atajos de teclado para la experiencia conversacional fluida
function setupKeyboardNavigation() {
  document.addEventListener("keydown", (e) => {
    // Solo responde si la sección de la encuesta está visible
    const surveySection = document.getElementById("section-survey");
    if (surveySection && !surveySection.classList.contains("hidden")) {
      // Calificaciones 1 a 5
      if (e.key >= "1" && e.key <= "5") {
        responderPregunta(parseInt(e.key));
      }
      // Navegación con flechas
      if (e.key === "ArrowLeft") {
        navegarPregunta(-1);
      }
      if (e.key === "ArrowRight") {
        navegarPregunta(1);
      }
    }
  });
}

// Finalización y Envío de datos de la encuesta
function finalizarYEnviarEncuesta() {
  // Capturar comentarios
  AppState.comments = document.getElementById("survey-comments").value;

  // Estructurar el JSON final
  const registroEncuesta = {
    id: generarUUID(),
    metadata: {
      fecha_creacion: new Date().toISOString(),
      estamento: AppState.currentRol,
      programa_academico: AppState.userData.programa,
      version_acuerdo: "CESU 01-2025"
    },
    datos_personales: {
      nombre_completo: AppState.userData.nombre,
      documento_identidad: AppState.userData.cedula,
      telefono_celular: AppState.userData.celular,
      correo_electronico: AppState.userData.correo,
      politica_habeas_data_aceptada: true,
      fecha_aceptacion: new Date().toISOString()
    },
    respuestas: AppState.answers,
    comentarios_adicionales: AppState.comments
  };

  // Guardar en localStorage (Simulación Serverless)
  try {
    const encuestasGuardadas = JSON.parse(localStorage.getItem("encuestas_guardadas")) || [];
    encuestasGuardadas.push(registroEncuesta);
    localStorage.setItem("encuestas_guardadas", JSON.stringify(encuestasGuardadas));
    
    // Aquí se conectaría la API real (Supabase / Firebase Webhook):
    // fetch('https://tu-api-supabase.supabase.co/rest/v1/respuestas', { method: 'POST', body: JSON.stringify(registroEncuesta), ... });
    
    navegarA("section-thanks");
  } catch (error) {
    console.error("Error al guardar la encuesta:", error);
    alert("Hubo un error al guardar tus respuestas. Por favor intenta de nuevo.");
  }
}

// Modales de Habeas Data
function abrirModalHabeas(e) {
  if (e) e.preventDefault();
  document.getElementById("modal-habeas").classList.remove("hidden");
}

function cerrarModalHabeas() {
  document.getElementById("modal-habeas").classList.add("hidden");
}

// Navegación trasera
function volverALanding() {
  navegarA("section-landing");
}

function volverARegistro() {
  navegarA("section-register");
}

function volverAEncuestaDesdeComentarios() {
  navegarA("section-survey");
  renderizarPreguntaActual();
}

function reiniciarPortal() {
  AppState.currentRol = null;
  AppState.isAuthorized = false;
  AppState.userData = { nombre: "", cedula: "", celular: "", correo: "", programa: "", habeasData: false };
  AppState.questions = [];
  AppState.currentQuestionIndex = 0;
  AppState.answers = {};
  AppState.comments = "";
  
  document.getElementById("survey-comments").value = "";
  navegarA("section-landing");
}

// Generador de IDs únicos para los registros
function generarUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Función de redirección segura al Dashboard desde la Landing Card
function accederAlDashboard() {
  const clave = prompt("Ingrese la clave de acceso de administrador:");
  if (clave === null) return; // Cancelado por el usuario
  
  const claveNormalizada = clave.trim();
  if (claveNormalizada === "ETO206" || claveNormalizada === "ETO2026") {
    sessionStorage.setItem("dashboard_authorized", "true");
    window.location.href = "dashboard.html";
  } else {
    alert("Clave incorrecta. Acceso denegado.");
  }
}

