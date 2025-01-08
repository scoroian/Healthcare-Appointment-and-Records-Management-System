# Healthcare-Appointment-and-Records-Management-System

Este repositorio contiene la **API Final Practice: "Healthcare Appointment and Records Management System"**, diseñada para la gestión de citas y expedientes médicos. Abarca funcionalidades de registro y autenticación de usuarios, administración de citas, manejo de expedientes médicos, control de acceso según roles, registros de auditoría y manejo de notificaciones (ficticias) ante eventos relevantes.

## Requisitos

- **Lenguaje**: Node.js.
- **Dependencias**: Express.js.
- **Base de Datos**: MySQL.
- **Herramientas adicionales**: 
  - Postman (o similar) para probar la API.

## Estructura del Proyecto

A continuación, un ejemplo de estructura si se utiliza **Node.js con Express**:



├── src

│   ├── controllers

│   │   ├── auth.controller.js

│   │   ├── user.controller.js

│   │   ├── appointment.controller.js

│   │   ├── medicalRecord.controller.js

│   │   └── ...

│   ├── models

│   │   ├── user.model.js

│   │   ├── appointment.model.js

│   │   ├── medicalRecord.model.js

│   │   └── ...

│   ├── routes

│   │   ├── auth.routes.js

│   │   ├── user.routes.js

│   │   ├── appointment.routes.js

│   │   ├── medicalRecord.routes.js

│   │   └── ...

│   ├── middlewares

│   │   ├── auth.middleware.js

│   │   ├── role.middleware.js

│   │   └── ...

│   ├── utils

│   │   ├── notifications.js

│   │   └── ...

│   └── app.js

├── test

│   └── ...

├── package.json

├── README.md

└── ...


## Configuración e Instalación

1. **Clonar el repositorio**  
   ```bash
   git clone https://github.com/scoroian/Healthcare-Appointment-and-Records-Management-System

2. **Instalar dependencias**
   ```bash
   cd healthcare-api
   npm install

3. **Configurar variables de entorno**
   ```bash
    PORT=3000
    DB_HOST=localhost
    DB_USER=tu_usuario
    DB_PASS=tu_password
    DB_NAME=healthcare_db
    JWT_SECRET=secret_key

