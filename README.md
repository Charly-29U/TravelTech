# TravelTech – Plataforma Global de Optimización de Itinerarios Corporativos

TravelTech es una solución SaaS profesional diseñada para optimizar los viajes corporativos internacionales. Utiliza datos geográficos reales y heurísticas de optimización sofisticadas para minimizar costos y tiempos de viaje.

## 🚀 Características Principales
- **Motor de Optimización Global:** Heurística del "Vecino más Cercano" con puntuación basada en estrategias (Costo vs Tiempo).
- **Inteligencia Geoespacial:** Fórmula Haversine para el cálculo preciso de distancias entre coordenadas globales.
- **Gestión de Zonas Horarias:** Ajuste automático de la hora de llegada basado en los desfases UTC.
- **Selección en Cascada Avanzada:** Selección de país y ciudad tanto para el origen como para cada destino del viaje.
- **Planificación Flexible:** Permite definir fecha de salida, fecha de regreso, días de estancia por ciudad y número de pasajeros.
- **Múltiples Medios de Transporte:** Soporte para Avión, Bus, Tren y Helicóptero.
- **Stack Tecnológico Moderno:** Spring Boot 3, Java 17, Angular 21+ y PostgreSQL.
- **Interfaz Premium:** Panel de control en modo oscuro con visualización de cronología y estética glassmorphism.

## 🛠 Arquitectura
- **Backend:** Arquitectura Limpia Modular (Spring Boot).
- **Seguridad:** Autenticación JWT sin estado.
- **Base de Datos:** PostgreSQL con soporte JSONB para el almacenamiento flexible de segmentos.
- **DevOps:** Entorno totalmente contenerizado con Docker.

## 🚦 Inicio Rápido

### 1. Requisitos
- Docker & Docker Compose
- Node.js 18+ (para desarrollo frontend)
- Java 17+ (para desarrollo backend)

### 2. Ejecutar con Docker
```bash
docker-compose up --build
```
El sistema inicializará automáticamente la base de datos con centros globales de transporte.

### 3. Endpoints de la API
- `POST /api/v1/auth/register` - Registro de usuario
- `POST /api/v1/auth/login` - Autenticación JWT
- `GET /api/v1/cities` - Lista de ciudades disponibles
- `POST /api/v1/itineraries` - Optimizar y crear un viaje
- `GET /api/v1/itineraries` - Listar los viajes del usuario

## 🌍 Países Soportados
Colombia, Estados Unidos, Francia, Jamaica, Japón, España, Brasil, Italia, Canadá y Australia.

---
Diseñado y desarrollado por el equipo de ingeniería de **TravelTech**.
