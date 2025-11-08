import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useState, useEffect } from 'react';
import solarDataJson from './data/solarData.json';

export default function App() {
  const [solarData, setSolarData] = useState({
    labels: [],
    datasets: [{ data: [] }]
  });
  const [stats, setStats] = useState({
    max: 0,
    min: 0,
    average: 0,
    current: 0
  });
  const [currentLevel, setCurrentLevel] = useState({
    label: 'Bajo',
    color: '#10b981',
    backgroundColor: '#d1fae5',
    description: 'Protección mínima requerida'
  });
  const [locationInfo, setLocationInfo] = useState({
    city: '',
    condition: '',
    uvIndex: 0
  });

  // Función para determinar el nivel de radiación
  const getRadiationLevel = (value) => {
    if (value === 0) {
      return {
        label: 'Sin radiación',
        color: '#6b7280',
        backgroundColor: '#f3f4f6',
        description: 'No hay radiación solar'
      };
    } else if (value < 200) {
      return {
        label: 'Bajo',
        color: '#10b981',
        backgroundColor: '#d1fae5',
        description: 'Protección mínima requerida'
      };
    } else if (value < 400) {
      return {
        label: 'Moderado',
        color: '#f59e0b',
        backgroundColor: '#fef3c7',
        description: 'Protección recomendada'
      };
    } else if (value < 600) {
      return {
        label: 'Alto',
        color: '#f97316',
        backgroundColor: '#ffedd5',
        description: 'Protección necesaria'
      };
    } else if (value < 800) {
      return {
        label: 'Muy Alto',
        color: '#ef4444',
        backgroundColor: '#fee2e2',
        description: 'Protección extra necesaria'
      };
    } else {
      return {
        label: 'Extremo',
        color: '#a855f7',
        backgroundColor: '#f3e8ff',
        description: 'Evite exposición al sol'
      };
    }
  };

  useEffect(() => {
    // Cargar datos desde el archivo JSON
    const currentHour = new Date().getHours();

    // Usar el primer día del array (día actual)
    const todayData = solarDataJson.days[0];

    // Extraer valores de radiación por hora
    const radiationValues = todayData.hourlyData.map(item => item.radiation);

    // Obtener el valor actual según la hora
    const currentValue = todayData.hourlyData[currentHour].radiation;

    // Establecer estadísticas desde el JSON
    setStats({
      max: todayData.summary.maxRadiation,
      min: todayData.summary.minRadiation,
      average: todayData.summary.avgRadiation,
      current: currentValue
    });

    // Establecer información de ubicación
    setLocationInfo({
      city: solarDataJson.location.city,
      condition: todayData.weatherCondition,
      uvIndex: todayData.summary.uvIndex
    });

    // Establecer el nivel actual
    setCurrentLevel(getRadiationLevel(currentValue));

    // Preparar datos para el gráfico (mostrar cada 2 horas para mejor visualización)
    const chartLabels = todayData.hourlyData
      .filter((_, i) => i % 2 === 0)
      .map(item => `${item.hour}h`);

    const chartData = todayData.hourlyData
      .filter((_, i) => i % 2 === 0)
      .map(item => item.radiation);

    setSolarData({
      labels: chartLabels,
      datasets: [{
        data: chartData,
        color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
        strokeWidth: 3
      }]
    });
  }, []);

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <StatusBar style="dark" />

        {/* Header minimalista */}
        <View style={styles.header}>
          <Text style={styles.locationText}>📍 {locationInfo.city}</Text>
          <Text style={styles.dateText}>{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</Text>
          <Text style={styles.conditionText}>{locationInfo.condition} · UV Index: {locationInfo.uvIndex}</Text>
        </View>

        {/* Widget principal - Tarjeta de valor actual estilo iOS */}
        <View style={[styles.mainWidget, { backgroundColor: currentLevel.backgroundColor }]}>
          <Text style={[styles.levelLabel, { color: currentLevel.color }]}>{currentLevel.label}</Text>
          <View style={styles.valueContainer}>
            <Text style={[styles.mainValue, { color: currentLevel.color }]}>{stats.current}</Text>
            <Text style={[styles.mainUnit, { color: currentLevel.color }]}>W/m²</Text>
          </View>
          <Text style={[styles.levelDescription, { color: currentLevel.color }]}>{currentLevel.description}</Text>
          <View style={styles.timeContainer}>
            <Text style={[styles.timeIcon, { color: currentLevel.color }]}>🕐</Text>
            <Text style={[styles.timeText, { color: currentLevel.color }]}>
              {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
            </Text>
          </View>
        </View>

        {/* Mini tarjetas de estadísticas estilo widget */}
        <View style={styles.statsGrid}>
          <View style={styles.miniWidget}>
            <Text style={styles.miniLabel}>Máximo hoy</Text>
            <Text style={styles.miniValue}>{stats.max}</Text>
            <Text style={styles.miniUnit}>W/m²</Text>
          </View>
          <View style={styles.miniWidget}>
            <Text style={styles.miniLabel}>Promedio</Text>
            <Text style={styles.miniValue}>{stats.average}</Text>
            <Text style={styles.miniUnit}>W/m²</Text>
          </View>
        </View>

        {/* Gráfico con diseño limpio */}
        <View style={styles.chartWidget}>
          <Text style={styles.chartLabel}>Previsión del día</Text>
          {solarData.datasets[0].data.length > 0 && (
            <LineChart
              data={solarData}
              width={screenWidth - 60}
              height={200}
              chartConfig={{
                backgroundColor: '#ffffff',
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(245, 158, 11, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '3',
                  strokeWidth: '2',
                  stroke: '#f59e0b'
                },
                propsForBackgroundLines: {
                  strokeDasharray: '',
                  stroke: 'rgba(229, 231, 235, 1)',
                  strokeWidth: 1
                }
              }}
              bezier
              style={styles.chart}
              fromZero={true}
              withShadow={false}
              withInnerLines={true}
              withOuterLines={false}
            />
          )}
        </View>

        {/* Barra de niveles de referencia */}
        <View style={styles.levelBar}>
          <Text style={styles.levelBarTitle}>Niveles de radiación</Text>
          <View style={styles.levelBarContainer}>
            <View style={[styles.levelSegment, { backgroundColor: '#10b981', flex: 1 }]}>
              <Text style={styles.levelSegmentText}>Bajo</Text>
            </View>
            <View style={[styles.levelSegment, { backgroundColor: '#f59e0b', flex: 1 }]}>
              <Text style={styles.levelSegmentText}>Moderado</Text>
            </View>
            <View style={[styles.levelSegment, { backgroundColor: '#f97316', flex: 1 }]}>
              <Text style={styles.levelSegmentText}>Alto</Text>
            </View>
            <View style={[styles.levelSegment, { backgroundColor: '#ef4444', flex: 1 }]}>
              <Text style={styles.levelSegmentText}>Muy Alto</Text>
            </View>
            <View style={[styles.levelSegment, { backgroundColor: '#a855f7', flex: 1 }]}>
              <Text style={styles.levelSegmentText}>Extremo</Text>
            </View>
          </View>
        </View>

        {/* Recomendaciones */}
        <View style={styles.recommendationBox}>
          <Text style={styles.recommendationTitle}>💡 Recomendación</Text>
          <Text style={styles.recommendationText}>
            {currentLevel.description}
          </Text>
        </View>

        {/* Footer discreto */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Última actualización: {new Date(solarDataJson.lastUpdated).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </Text>
          <Text style={styles.footerText}>Datos simulados · {solarDataJson.location.city}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingBottom: 30,
  },
  header: {
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 30,
    backgroundColor: '#f8fafc',
  },
  locationText: {
    fontSize: 14,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 15,
    color: '#94a3b8',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  conditionText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '500',
  },
  mainWidget: {
    marginHorizontal: 30,
    marginTop: 20,
    padding: 30,
    borderRadius: 28,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  levelLabel: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 12,
  },
  mainValue: {
    fontSize: 72,
    fontWeight: '800',
    letterSpacing: -2,
  },
  mainUnit: {
    fontSize: 22,
    fontWeight: '600',
    marginLeft: 8,
    opacity: 0.7,
  },
  levelDescription: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 15,
    opacity: 0.8,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
  },
  timeIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '600',
    opacity: 0.7,
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: 30,
    marginTop: 15,
    gap: 15,
  },
  miniWidget: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  miniLabel: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  miniValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 2,
  },
  miniUnit: {
    fontSize: 11,
    color: '#94a3b8',
    fontWeight: '500',
  },
  chartWidget: {
    marginHorizontal: 30,
    marginTop: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 15,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chart: {
    borderRadius: 16,
    marginLeft: -15,
  },
  levelBar: {
    marginHorizontal: 30,
    marginTop: 20,
    padding: 20,
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  levelBarTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  levelBarContainer: {
    flexDirection: 'row',
    height: 50,
    borderRadius: 12,
    overflow: 'hidden',
  },
  levelSegment: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  levelSegmentText: {
    color: '#ffffff',
    fontSize: 10,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },
  recommendationBox: {
    marginHorizontal: 30,
    marginTop: 20,
    padding: 20,
    backgroundColor: '#eff6ff',
    borderRadius: 18,
    borderLeftWidth: 4,
    borderLeftColor: '#3b82f6',
  },
  recommendationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e40af',
    marginBottom: 8,
  },
  recommendationText: {
    fontSize: 13,
    color: '#1e40af',
    lineHeight: 20,
  },
  footer: {
    marginTop: 25,
    marginBottom: 10,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: '#94a3b8',
    fontStyle: 'italic',
    marginBottom: 3,
  },
});
