# ☀️ Aplicación de Radiación Solar

Aplicación móvil desarrollada en React Native con Expo que visualiza estadísticas de índices de radiación solar a lo largo del día con un diseño moderno estilo widget inspirado en aplicaciones iOS.

## 📱 Características

- **Widget principal dinámico**: Tarjeta grande que muestra el nivel actual con colores que cambian según la intensidad de radiación
- **Sistema de niveles inteligente**: 5 niveles de radiación con colores distintivos (Bajo, Moderado, Alto, Muy Alto, Extremo)
- **Visualización en tiempo real**: Muestra la radiación solar actual basada en la hora del día
- **Gráfico limpio**: Gráfico de línea minimalista con la evolución de radiación durante 24 horas
- **Estadísticas compactas**: Mini widgets con valores máximo y promedio del día
- **Diseño iOS moderno**: Interfaz clara con tarjetas tipo widget, sombras sutiles y tipografía San Francisco
- **Barra de referencia**: Escala visual de colores para identificar niveles de radiación
- **Datos simulados**: Utiliza un modelo gaussiano para simular patrones realistas de radiación solar

## 🚀 Cómo ejecutar la aplicación

### Requisitos previos

- Node.js instalado (versión 14 o superior)
- Expo Go instalado en tu dispositivo móvil (disponible en App Store y Google Play)

### Instalación

1. Navega al directorio del proyecto:
```bash
cd solar-radiation-app
```

2. Las dependencias ya están instaladas, pero si necesitas reinstalarlas:
```bash
npm install
```

### Ejecución en Expo Go

1. Inicia el servidor de desarrollo:
```bash
npm start
```

2. Esto abrirá Expo DevTools en tu navegador y mostrará un código QR

3. Abre la aplicación **Expo Go** en tu dispositivo móvil

4. Escanea el código QR:
   - **iOS**: Usa la cámara nativa del iPhone
   - **Android**: Usa el escáner QR dentro de la app Expo Go

5. La aplicación se cargará automáticamente en tu dispositivo

### Comandos alternativos

```bash
# Iniciar en modo Android
npm run android

# Iniciar en modo iOS (solo en macOS)
npm run ios

# Iniciar en modo web
npm run web
```

## 📊 Sobre los datos

La aplicación genera datos simulados de radiación solar que siguen un patrón gaussiano realista:

- **Rango de valores**: 0 a 1000 W/m² (Watts por metro cuadrado)
- **Horario de radiación**: De 6:00 AM a 8:00 PM
- **Pico máximo**: Alrededor del mediodía (12:00 PM)
- **Variación aleatoria**: ±10% para simular condiciones atmosféricas

## 🛠️ Tecnologías utilizadas

- **React Native**: Framework para desarrollo móvil multiplataforma
- **Expo**: Plataforma para desarrollo y despliegue rápido
- **react-native-chart-kit**: Biblioteca para gráficos
- **react-native-svg**: Soporte para gráficos vectoriales

## 🎨 Diseño y Estilo

**Inspiración**: Diseño moderno tipo widget similar a aplicaciones de Bjorn Jenssen

**Características visuales**:
- **Fondo claro**: Color base #f8fafc para una apariencia limpia
- **Widget principal**: Tarjeta grande con fondo dinámico que cambia de color según el nivel de radiación
- **Mini widgets**: Dos tarjetas compactas con estadísticas del día
- **Gráfico minimalista**: Fondo blanco con línea naranja y puntos destacados
- **Barra de niveles**: Escala horizontal de colores (verde → amarillo → naranja → rojo → púrpura)
- **Tipografía**: Números grandes y bold, labels en mayúsculas con letter-spacing
- **Sombras sutiles**: Elevación suave para profundidad sin sobrecargar

## 📊 Niveles de Radiación

| Nivel | Rango (W/m²) | Color | Descripción |
|-------|--------------|-------|-------------|
| Bajo | 0-200 | Verde (#10b981) | Protección mínima requerida |
| Moderado | 200-400 | Amarillo (#f59e0b) | Protección recomendada |
| Alto | 400-600 | Naranja (#f97316) | Protección necesaria |
| Muy Alto | 600-800 | Rojo (#ef4444) | Protección extra necesaria |
| Extremo | 800+ | Púrpura (#a855f7) | Evite exposición al sol |

## 📂 Backend Simulado (JSON)

La aplicación utiliza un archivo JSON local (`data/solarData.json`) que simula una respuesta de backend/API. Este archivo contiene:

### Estructura del JSON:

```json
{
  "location": {
    "city": "Quito",
    "country": "Ecuador",
    "latitude": -0.1807,
    "longitude": -78.4678,
    "timezone": "America/Guayaquil"
  },
  "days": [
    {
      "date": "2024-11-08",
      "hourlyData": [
        {
          "hour": 0-23,
          "radiation": 0-1000,
          "cloudCover": 0-100,
          "temperature": -10 a 40
        }
      ],
      "summary": {
        "maxRadiation": número,
        "minRadiation": número,
        "avgRadiation": número,
        "uvIndex": 0-11
      }
    }
  ],
  "forecast": {
    "nextDays": []
  },
  "recommendations": {}
}
```

### Datos incluidos:

- **3 días de datos históricos** con lecturas por hora (24 lecturas/día)
- **Ubicación**: Quito, Ecuador
- **Condiciones climáticas**: Soleado, Nublado, Parcialmente nublado
- **Métricas por hora**: Radiación, cobertura de nubes, temperatura
- **Resumen del día**: Máximo, mínimo, promedio, índice UV
- **Pronóstico**: 2 días adicionales con proyecciones
- **Recomendaciones**: Consejos de protección solar por nivel

### Ventajas de usar JSON local:

1. **Desarrollo sin conexión**: No requiere API externa ni internet
2. **Datos consistentes**: Siempre muestra los mismos valores para testing
3. **Rápido**: Sin latencia de red
4. **Fácil de modificar**: Puedes editar el JSON para probar diferentes escenarios
5. **Migración sencilla**: Fácil cambiar a una API real en producción

### Cómo usar datos reales:

Para conectar con una API real, reemplaza el import del JSON por un fetch:

```javascript
// En lugar de:
import solarDataJson from './data/solarData.json';

// Usa:
const response = await fetch('https://api.ejemplo.com/solar-data');
const solarDataJson = await response.json();
```

APIs recomendadas para datos solares:
- **OpenWeatherMap** (UV Index API)
- **Solar Radiation Database** (NREL)
- **Weather API** (weatherapi.com)

## 📱 Optimización de Pantalla

La aplicación ha sido optimizada para visualizarse correctamente en dispositivos móviles modernos, incluyendo:
- **iPhone 15 Pro Max**: Espaciados y tamaños ajustados para pantalla completa
- **Diseño responsive**: Se adapta automáticamente al tamaño de pantalla
- **ScrollView**: Todo el contenido es desplazable para garantizar accesibilidad
- **Componentes compactos**: Tamaños reducidos para maximizar contenido visible

## 📝 Notas

- Los datos son completamente simulados con fines demostrativos
- El archivo JSON simula una respuesta de backend real
- La aplicación muestra datos del "día actual" (primer día del array)
- Ubicación configurada: Quito, Ecuador
- La aplicación es compatible con iOS y Android a través de Expo Go
- Diseñada para ser fácilmente migrable a una API real
- Optimizada para pantallas grandes (probado en iPhone 15 Pro Max)
