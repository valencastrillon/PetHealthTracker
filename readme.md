<div align="center">

<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 32 32" fill="none">
  <defs>
    <linearGradient id="pethealth-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="100%" stop-color="#0d9488" />
    </linearGradient>
  </defs>
  <rect width="32" height="32" rx="8" fill="url(#pethealth-grad)" />
  <g transform="translate(8, 8) scale(0.6667)">
    <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" fill="#ffffff" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
  </g>
</svg>

# PetHealthTracker

**La plataforma integral para el seguimiento de la salud, nutrición e historial clínico de tus mascotas.**<br/>
Registra perfiles, controla vacunas, planifica dietas y recibe recordatorios desde un solo lugar.

[Demo en vivo](https://pethealth-tracker.netlify.app) &nbsp;·&nbsp; [Repositorio](https://github.com/valencastrillon/PetHealthTracker) &nbsp;·&nbsp; [Reportar un issue](https://github.com/valencastrillon/PetHealthTracker/issues)

<p>
  <img src="https://img.shields.io/badge/React-18+-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-Bundler-646CFF?style=flat-square&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Supabase-Backend_&_Auth-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-Styles-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Netlify-Deployed-00C7B7?style=flat-square&logo=netlify&logoColor=white" alt="Netlify" />
  <img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="License MIT" />
</p>

</div>

---

## ¿Qué es PetHealthTracker?

**PetHealthTracker** es una aplicación web full-stack compuesta por tres módulos principales trabajando juntos:

1. **Perfiles e Historial Clínico:** Un espacio centralizado donde registras a cada mascota (especie, raza, edad, peso) junto con sus consultas veterinarias, vacunas, diagnósticos y tratamientos.
2. **Gestión de Nutrición:** Planificación y control de alimentación personalizada, raciones y hábitos dietéticos por mascota.
3. **Recordatorios Inteligentes:** Agenda de próximas citas médicas, desparasitaciones y medicación para mantener al día el cuidado preventivo.

Cada mascota tiene su propio expediente digital. Toda su información médica y nutricional está a un clic de distancia.

## Inicio rápido

Sigue esta lista rápida para probar la plataforma en vivo sin instalar nada localmente:

1. Abre la aplicación web desplegada en **[pethealth-tracker.netlify.app](https://pethealth-tracker.netlify.app)**.
2. Haz clic en **Iniciar sesión** (`/login`) e ingresa con la cuenta de demostración:
   ```text
   Correo:     demo@pethealth.app
   Contraseña: DemoPetHealth2026!
   ```
3. Al ingresar, llegarás al **Dashboard** (`/dashboard`), donde podrás crear mascotas, explorar registros médicos, asignar planes de nutrición y configurar recordatorios.

## Guía para usuarios

| Quieres... | Haz esto |
| :--- | :--- |
| **Explorar la plataforma** | Visita la landing page (`/`) para conocer beneficios, servicios y preguntas frecuentes |
| **Probar sin crear cuenta** | Inicia sesión en `/login` con `demo@pethealth.app` |
| **Registrar una cuenta nueva** | Crea tu usuario en `/register` con correo y contraseña |
| **Agregar una mascota** | Abre **Mascotas** en el menú lateral y haz clic en **Agregar mascota** |
| **Registrar una vacuna o consulta** | Ve a **Salud** (`/health`), crea un registro clínico y consulta su detalle |
| **Planificar la alimentación** | Entra a **Nutrición** (`/nutrition`) y gestiona la dieta de cada mascota |
| **Programar alertas** | Revisa **Recordatorios** (`/reminders`) para agendar citas o dosis |

## Arquitectura

```text
valencastrillon/PetHealthTracker
├── web/                            # Aplicación principal Frontend (React + Vite)
│   ├── public/                     # Recursos estáticos, íconos y logo
│   ├── src/
│   │   ├── Components/             # Componentes reutilizables de interfaz
│   │   │   ├── Beneficios/         # Tarjetas e íconos de beneficios
│   │   │   ├── CallToAction/       # Secciones de llamado a la acción
│   │   │   ├── landing/            # Header, Banner, FAQ, Footer, InfoSection, ServicesSection
│   │   │   ├── pets/               # PetCard, PetForm, PetList, Modal
│   │   │   ├── Testimonios/        # Carrusel y tarjetas de testimonios
│   │   │   ├── InputForm.jsx       # Campos de formulario estandarizados
│   │   │   ├── Logo.jsx            # Identidad visual de PetHealthTracker
│   │   │   ├── QuickActions.jsx    # Accesos directos del panel principal
│   │   │   ├── SideBar.jsx         # Barra de navegación lateral
│   │   │   └── ToggleSwitch.jsx    # Controles de estado
│   │   ├── context/                # Estado global y contexto de autenticación (Supabase Auth)
│   │   ├── hooks/                  # Custom hooks para gestión de datos y sesión
│   │   ├── pages/                  # Vistas y rutas de la aplicación
│   │   │   ├── LandingPage.jsx     # Página pública de inicio
│   │   │   ├── Login.jsx           # Inicio de sesión
│   │   │   ├── Register.jsx        # Registro de usuarios
│   │   │   ├── MainPage.jsx        # Layout contenedor con SideBar
│   │   │   ├── Dashboard.jsx       # Panel principal de resumen
│   │   │   ├── PetsSection.jsx     # Gestión de mascotas
│   │   │   ├── PetProfilePage.jsx  # Perfil individual de mascota
│   │   │   ├── HealthPage.jsx      # Historial médico
│   │   │   ├── HealthRecordDetailPage.jsx # Detalle de registro clínico
│   │   │   ├── NutritionPage.jsx   # Seguimiento nutricional
│   │   │   ├── Reminders.jsx       # Recordatorios y alertas
│   │   │   └── SettingsPage.jsx    # Configuración de cuenta
│   │   ├── utils/                  # Cliente de Supabase, servicios de API y utilidades
│   │   ├── App.jsx                 # Enrutamiento principal y protección de rutas
│   │   └── main.jsx                # Punto de entrada de React
│   ├── .env.example                # Plantilla de variables de entorno
│   ├── package.json                # Dependencias y scripts
│   └── vite.config.js              # Configuración de Vite
└── server/                         # Estructura de referencia del backend legado
    └── .env.example                # Variables de entorno de referencia
```

* **Frontend:** React, Vite, React Router DOM, Tailwind CSS.
* **Backend & Base de Datos:** Supabase (PostgreSQL, Row Level Security y API REST).
* **Autenticación:** Supabase Auth (sesiones persistentes y rutas protegidas).
* **Despliegue:** Netlify (CI/CD conectado a la rama `develop`, directorio base `web`).

## Desarrollo local

Sigue estos pasos para correr el proyecto en tu equipo:

```bash
git clone https://github.com/valencastrillon/PetHealthTracker.git
cd PetHealthTracker/web
npm install
```

1. **Configura tus variables de entorno:** crea un archivo `web/.env` basado en `web/.env.example`:
   ```env
   VITE_SUPABASE_URL=tu_url_de_proyecto_supabase
   VITE_SUPABASE_ANON_KEY=tu_clave_publica_anon_de_supabase
   ```
2. **Inicia el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
3. Abre `http://localhost:5173` en tu navegador.

| Comando | Descripción |
| :--- | :--- |
| `npm run dev` | Levanta el entorno local de desarrollo con HMR |
| `npm run build` | Compila la aplicación para producción en `web/dist` |
| `npm run preview` | Previsualiza localmente la build de producción |
| `npm run lint` | Ejecuta ESLint para validar el código |

## Contribuir

* **Reportar errores o sugerencias:** Abre un [Issue](https://github.com/valencastrillon/PetHealthTracker/issues) describiendo el problema o mejora.
* **Enviar cambios:** Haz un *fork*, crea una rama (`git checkout -b feat/mi-mejora`), verifica que `npm run lint && npm run build` pasen sin errores y abre un **Pull Request** hacia `develop`.

## Licencia

El código fuente se distribuye bajo la licencia **MIT**.