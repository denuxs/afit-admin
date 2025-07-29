## AFIT Admin

SPA para crear Rutinas de Gimnasio. (**En desarrollo**)

- El API esta en Django 5 [github.com/denuxs/gym_api](https://github.com/denuxs/gym_api)
- Usuario: admin / contraseña: endurance

- Angular 18 y proximamente actualizando a Angular 20

### Librerias

- Tailwind 3
- Angular PWA
- Primeng
- Firebase

### Funcionalidades

- Autenticación JWT
- CRUD de usuarios
- CRUD de catálogos
- CRUD de ejercicios
- CRUD de rutinas
- CRUD de medidas
- Subida de Imágenes a S3
- Notificaciones Push
- Traducción 118n

### Instalar y ejecutar app

```
npm install
ng server
```

### Cambios

- Autenticación con Firebase, rama firebase_auth

### Despliegue

- En desarollo se usa el hosting de PythonanyWhere y Frontend en Netflify
- En producción se usa un servidor Free Tier con AWS EC2 y S3, configuración de dominio y SSL con Namecheap

### TO DO

- Mejoras en Tailwind UI/UX o actualizar a Material Design
- Mejoras Responsive Design
- Agregar Unit Tests
- Completar traducciones
- Completar notificaciones push
