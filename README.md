# API Rutas Culturales para la Reconciliación

Una API completa desarrollada en NestJS para promover turismo cultural en zonas afectadas por el conflicto armado en Colombia.

## 🌟 Características Principales

- **Rutas Georreferenciadas**: Mapeo de rutas culturales con diferentes niveles de reconciliación
- **Proyectos Comunitarios**: Conexión con talleres de artesanías, música y memoria histórica
- **Testimonios Protegidos**: Sistema de autenticación JWT para acceso a historias sensibles
- **Impacto Social**: Certificados automáticos de contribución a comunidades
- **Códigos QR**: Sistema de descuentos para apoyar economía local
- **Notificaciones SMS**: Alertas en zonas remotas via Twilio
- **Dashboard Analítico**: Reportes de impacto para comunidades

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- PostgreSQL 12+
- Cuenta Twilio (opcional, para SMS)

### Instalación

1. **Clonar el repositorio**
\`\`\`bash
git clone <repository-url>
cd rutas-culturales-api
\`\`\`

2. **Instalar dependencias**
\`\`\`bash
npm install
\`\`\`

3. **Configurar variables de entorno**
\`\`\`bash
cp .env.example .env
# Editar .env con tus configuraciones
\`\`\`

4. **Configurar base de datos**
\`\`\`bash
# Crear base de datos PostgreSQL
createdb rutas_culturales

# Las tablas se crean automáticamente al iniciar la aplicación
\`\`\`

5. **Iniciar la aplicación**
\`\`\`bash
# Desarrollo
npm run start:dev

# Producción
npm run build
npm run start:prod
\`\`\`

## 📚 Documentación API

La documentación interactiva está disponible en:
\`\`\`
http://localhost:3000/api/docs
\`\`\`

## 🛣️ Endpoints Principales

### Autenticación
- `POST /auth/register` - Registro de usuarios
- `POST /auth/login` - Inicio de sesión

### Rutas Culturales
- `GET /rutas` - Listar todas las rutas
- `GET /rutas/{departamento}` - Filtrar por departamento y nivel de reconciliación
- `GET /rutas/populares` - Rutas más visitadas
- `GET /rutas/nearby` - Rutas cercanas a ubicación

### Proyectos Comunitarios
- `GET /proyectos` - Listar proyectos activos
- `GET /proyectos/verificados` - Proyectos verificados
- `GET /proyectos/tipo/{tipo}` - Filtrar por tipo (artesanías, café, música, etc.)

### Testimonios
- `GET /testimonios` - Acceso con autenticación JWT
- `GET /testimonios/publicos` - Testimonios públicos
- `GET /testimonios/destacados` - Testimonios más reproducidos

### Impacto Social
- `GET /impacto/{user_id}` - Aportes del turista a comunidades
- `GET /impacto/certificados/{user_id}` - Certificados de impacto
- `POST /impacto/registrar` - Registrar nueva contribución

### Dashboard Comunidades
- `GET /dashboard/comunidades` - Reportes de ingresos generados
- `GET /dashboard/reportes/ingresos` - Análisis financiero
- `GET /dashboard/metricas/reconciliacion` - Indicadores de paz

### Códigos QR
- `POST /qr/generar` - Generar código para descuentos
- `POST /qr/validar` - Validar código en negocio
- `POST /qr/usar` - Aplicar descuento

### Notificaciones
- `POST /notificaciones/alerta-zona-remota` - SMS en zonas remotas
- `POST /notificaciones/confirmacion-reserva` - Confirmación de reservas

## 🏗️ Arquitectura

\`\`\`
src/
├── auth/           # Autenticación y autorización
├── rutas/          # Gestión de rutas culturales
├── proyectos/      # Proyectos comunitarios
├── testimonios/    # Historias y testimonios
├── impacto/        # Seguimiento de impacto social
├── notificaciones/ # SMS y alertas (Twilio)
├── qr/             # Sistema de códigos QR
└── dashboard/      # Reportes y analytics
\`\`\`

## 🔧 Tecnologías Utilizadas

- **Framework**: NestJS con TypeScript
- **Base de Datos**: PostgreSQL con TypeORM
- **Autenticación**: JWT con Passport
- **Validación**: class-validator
- **Documentación**: Swagger/OpenAPI
- **SMS**: Twilio API
- **QR Codes**: qrcode library
- **Contenedores**: Docker & Docker Compose

## 📊 Ejemplo de Flujo de Usuario

1. **Turista busca rutas en Antioquia**
\`\`\`bash
GET /rutas/Antioquia?nivel=verificado
\`\`\`

2. **Sistema recomienda "Ruta Café y Perdón"**
\`\`\`json
{
  "nombre": "Café y Perdón",
  "descripcion": "Experiencia de reconciliación a través del café",
  "municipio": "Granada",
  "nivelReconciliacion": "verificado",
  "puntosInteres": [
    {
      "nombre": "Taller de mochilas wayúu",
      "tipo": "artesania",
      "descripcion": "Liderado por excombatientes"
    }
  ]
}
\`\`\`

3. **Al reservar, recibe código QR**
\`\`\`bash
POST /qr/generar
{
  "rutaId": "uuid-ruta",
  "departamento": "Antioquia",
  "municipio": "Granada",
  "telefono": "+573001234567"
}
\`\`\`

4. **Registro automático de impacto**
\`\`\`bash
POST /impacto/registrar
{
  "tipo": "taller",
  "monto": 75000,
  "beneficiario": "Cooperativa Café y Paz",
  "familiasImpactadas": 3
}
\`\`\`

## 🌍 Consideraciones PostGIS

La API está preparada para integrar PostGIS para búsquedas geoespaciales avanzadas:

\`\`\`sql
-- Ejemplo de consulta con PostGIS (implementación futura)
SELECT * FROM rutas 
WHERE ST_DWithin(
  ST_Point(longitud, latitud)::geography,
  ST_Point(-75.2167, 5.8167)::geography,
  50000  -- 50km radius
);
\`\`\`

## 🔒 Seguridad

- Autenticación JWT obligatoria para endpoints sensibles
- Validación de permisos para testimonios
- Rate limiting en endpoints públicos
- Sanitización de inputs con class-validator
- Variables de entorno para credenciales

## 🚀 Despliegue

### Con Docker
\`\`\`bash
docker-compose up -d
\`\`\`

### Manual
\`\`\`bash
npm run build
npm run start:prod
\`\`\`

## 📈 Monitoreo y Métricas

El dashboard proporciona métricas clave:
- Familias impactadas por turismo
- Ingresos generados por comunidades
- Nivel de verificación de proyectos
- Uso de códigos QR y descuentos
- Reproducciones de testimonios

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 🆘 Soporte

Para soporte técnico o preguntas:
- Crear un issue en GitHub
- Contactar al equipo de desarrollo
- Revisar la documentación en `/api/docs`

---

**Desarrollado con ❤️ para la reconciliación y paz en Colombia** 🇨🇴
