# ☀️ Aplicación de Radiación Solar

Aplicación móvil desarrollada en React Native con Expo que visualiza estadísticas de índices de radiación solar a lo largo del día.

## 📱 Características

- **Visualización en tiempo real**: Muestra la radiación solar actual basada en la hora del día
- **Gráfico interactivo**: Gráfico de línea que muestra la evolución de la radiación solar durante 24 horas
- **Estadísticas completas**: Valores máximo, mínimo y promedio de radiación
- **Interfaz moderna**: Diseño oscuro con gradientes azules y acentos dorados
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

## 📱 Capturas de pantalla

La aplicación incluye:
- Encabezado con título y subtítulo
- Tarjeta destacada con el valor actual de radiación
- Tres tarjetas de estadísticas (máximo, promedio, mínimo)
- Gráfico de línea con curva suavizada
- Sección informativa con datos educativos

## 📝 Notas

- Los datos son completamente simulados con fines demostrativos
- Para datos reales, se podría integrar con APIs como OpenWeatherMap o servicios especializados en datos solares
- La aplicación es compatible con iOS y Android a través de Expo Go
