# Nexo Dashboard - Contexto del Proyecto

## Objetivo
Dashboard para AgentesNexo - visualizar leads, campañas y métricas de negocio.

## Base de Datos PostgreSQL
```
Host: v4khhh.easypanel.host
Puerto: 5432
Usuario: demian
Password: Elizabeth1298
Base de datos: ivania
```

### Tabla: leads
```sql
- id: integer (PK)
- name: varchar(255) NOT NULL
- phone: varchar(50)
- whatsapp: varchar(50)
- email: varchar(255)
- city: varchar(100)
- address: text
- website: varchar(500)
- facebook: varchar(500)
- instagram: varchar(500)
- niche: varchar(100) -- 'dental', 'medical', etc.
- status: varchar(50) -- 'Nuevo', 'Contactado', 'Interesado', 'Cliente', 'Perdido'
- priority: varchar(20) -- 'Alta', 'Media', 'Baja'
- source: varchar(100) -- 'web_scraping', 'referral', etc.
- pain_point: text
- notes: text
- next_action: text
- last_contact: timestamp
- created_at: timestamp
- updated_at: timestamp
```

### Tabla: interactions
```sql
- id: integer (PK)
- lead_id: integer (FK -> leads.id)
- type: varchar(50) -- 'whatsapp', 'email', 'call'
- direction: varchar(20) -- 'inbound', 'outbound'
- content: text
- created_at: timestamp
```

## Métricas a mostrar

### KPIs Principales
- Total de leads
- Leads con WhatsApp
- Leads contactados hoy/semana
- Tasa de respuesta
- Leads por status (funnel)
- Leads por ciudad
- Leads por nicho

### Campañas Activas
- VE-DENTAL-CITAS: Clínicas dentales Caracas
- Mostrar: enviados, respondidos, interesados

### Gráficos
- Funnel de conversión
- Leads por día (últimos 30 días)
- Distribución por nicho
- Mapa de calor por ciudad (opcional)

## Diseño

### Estilo iOS 2026 Liquid Glass
- Fondos con blur/glassmorphism
- Bordes suaves y redondeados (border-radius: 20px+)
- Sombras sutiles
- Transparencias elegantes
- Animaciones fluidas

### Colores
- Fondo principal: #FFFFFF (blanco)
- Fondo secundario: #F5F5F7 (gris muy claro Apple)
- Texto principal: #1D1D1F (negro suave Apple)
- Texto secundario: #86868B (gris medio)
- Acento primario: #0071E3 (azul Apple)
- Acento secundario: #34C759 (verde éxito)
- Alerta: #FF3B30 (rojo)

### Tipografía
- SF Pro Display o Inter
- Pesos: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Mobile First
- Responsive design
- Touch-friendly (min 44px touch targets)
- Bottom navigation en mobile
- Cards apilables

## Stack Técnico
- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Prisma ORM (PostgreSQL)
- Recharts o Chart.js para gráficos
- Framer Motion para animaciones
- SWR o React Query para data fetching

## Sin Autenticación (por ahora)
- Solo Demian lo verá
- Agregar auth después
