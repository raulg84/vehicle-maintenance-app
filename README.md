# Plataforma web de monitorización preventiva de vehículos multimotor — Frontend

## Descripción

Aplicación web desarrollada con Angular para la gestión y monitorización preventiva de vehículos multimotor.

La aplicación permite a los usuarios registrar varios vehículos, gestionar mantenimientos y visualizar el estado preventivo mediante un dashboard basado en reglas configurables.

Este proyecto forma parte del Trabajo Final de Máster (TFM):

**Máster Universitario en Desarrollo de Sitios y Aplicaciones Web – UOC**

## Tecnologías utilizadas

- Angular
- TypeScript
- Angular Router
- Angular Guards
- Reactive Forms
- HTML5
- CSS3
- RxJS
- Netlify

## Funcionalidades principales

### Usuarios

- Registro
- Inicio de sesión

### Vehículos

- Alta de vehículos
- Edición
- Eliminación
- Gestión de varios vehículos

### Mantenimientos

- Registro de mantenimientos
- Edición
- Historial
- Actualización de kilometraje

### Dashboard

- Estado preventivo:
    - Correcto
    - Próximo mantenimiento
    - Mantenimiento vencido

### Administración

- Gestión de reglas de mantenimiento

## Arquitectura

La aplicación sigue una arquitectura basada en componentes y servicios:

    src/
    ├── components/
    ├── pages/
    ├── services/
    ├── guards/
    ├── interceptors/
    ├── models/
    ├── shared/

## Variables de entorno

- Desarrollo:

    apiUrl: 'http://localhost:8000/api'

- Producción:

    apiUrl: 'http://localhost:8000/api'

## Instalación

Clonar repositorio: 

    git clone https://github.com/raulg84/vehicle-maintenance-app.git

Instalar dependencias: 

    npm install

Ejecutar aplicación: 

    ng serve

Abrir: 

    http://localhost:4200

## Despliegue
Aplicación desplegada mediante:

- Netlify (Frontend)
- Railway (Backend)

URL pública: 

    https://vehicle-maintenance-app.netlify.app
