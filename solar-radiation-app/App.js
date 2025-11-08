import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, Modal } from 'react-native';
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
  const [currentTime, setCurrentTime] = useState(new Date());
  const [menuVisible, setMenuVisible] = useState(false);

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

  // Actualizar hora cada minuto
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Actualizar cada minuto

    return () => clearInterval(timer);
  }, []);

  // Función para obtener la hora de Ecuador
  const getEcuadorTime = () => {
    const now = new Date();
    // Ecuador está en UTC-5 (ECT - Ecuador Time)
    const ecuadorTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/Guayaquil' }));
    return ecuadorTime;
  };

  useEffect(() => {
    // Cargar datos desde el archivo JSON
    const ecuadorTime = getEcuadorTime();
    const currentHour = ecuadorTime.getHours();

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
  const ecuadorTime = getEcuadorTime();

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header minimalista con menú */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.locationText}>📍 {locationInfo.city}</Text>
            <Text style={styles.dateText}>{ecuadorTime.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' })}</Text>
          </View>
          <TouchableOpacity onPress={() => setMenuVisible(true)} style={styles.menuButton}>
            <Text style={styles.menuIcon}>☰</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.conditionText}>{locationInfo.condition} · UV: {locationInfo.uvIndex}</Text>
      </View>

      {/* Modal del menú */}
      <Modal
        visible={menuVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <Text style={styles.menuTitle}>Configuración</Text>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>📍 Cambiar ubicación</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>🔔 Notificaciones</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuItemText}>ℹ️ Acerca de</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItemClose}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.menuItemCloseText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

        {/* Widget principal - Tarjeta de valor actual estilo iOS */}
        <View style={[styles.mainWidget, { backgroundColor: currentLevel.backgroundColor }]}>
          <Text style={[styles.levelLabel, { color: currentLevel.color }]}>{currentLevel.label}</Text>
          <View style={styles.valueContainer}>
            <Text style={[styles.mainValue, { color: currentLevel.color }]}>{stats.current}</Text>
            <Text style={[styles.mainUnit, { color: currentLevel.color }]}>W/m²</Text>
          </View>
          <View style={styles.timeContainer}>
            <Text style={[styles.timeIcon, { color: currentLevel.color }]}>🕐</Text>
            <Text style={[styles.timeText, { color: currentLevel.color }]}>
              {ecuadorTime.toLocaleTimeString('es-ES', {
                hour: '2-digit',
                minute: '2-digit',
                timeZone: 'America/Guayaquil'
              })}
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
              width={screenWidth - 66}
              height={140}
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
          <View style={styles.levelBarContainer}>
            <View style={[styles.levelSegment, { backgroundColor: '#10b981', flex: 1 }]}>
              <Text style={styles.levelSegmentText}>Bajo</Text>
            </View>
            <View style={[styles.levelSegment, { backgroundColor: '#f59e0b', flex: 1 }]}>
              <Text style={styles.levelSegmentText}>Mod</Text>
            </View>
            <View style={[styles.levelSegment, { backgroundColor: '#f97316', flex: 1 }]}>
              <Text style={styles.levelSegmentText}>Alto</Text>
            </View>
            <View style={[styles.levelSegment, { backgroundColor: '#ef4444', flex: 1 }]}>
              <Text style={styles.levelSegmentText}>M.Alto</Text>
            </View>
            <View style={[styles.levelSegment, { backgroundColor: '#a855f7', flex: 1 }]}>
              <Text style={styles.levelSegmentText}>Ext</Text>
            </View>
          </View>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 20,
    backgroundColor: '#f8fafc',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  menuButton: {
    padding: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuIcon: {
    fontSize: 20,
    color: '#64748b',
  },
  locationText: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 12,
    color: '#94a3b8',
    textTransform: 'capitalize',
  },
  conditionText: {
    fontSize: 12,
    color: '#64748b',
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  menuContainer: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  menuTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 20,
    textAlign: 'center',
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  menuItemText: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '500',
  },
  menuItemClose: {
    marginTop: 12,
    paddingVertical: 16,
    backgroundColor: '#1e40af',
    borderRadius: 12,
    alignItems: 'center',
  },
  menuItemCloseText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  mainWidget: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  levelLabel: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  mainValue: {
    fontSize: 50,
    fontWeight: '800',
    letterSpacing: -2,
  },
  mainUnit: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 5,
    opacity: 0.7,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  timeIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  timeText: {
    fontSize: 13,
    fontWeight: '600',
    opacity: 0.7,
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 8,
    gap: 10,
  },
  miniWidget: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  miniLabel: {
    fontSize: 10,
    color: '#64748b',
    fontWeight: '500',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  miniValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 1,
  },
  miniUnit: {
    fontSize: 10,
    color: '#94a3b8',
    fontWeight: '500',
  },
  chartWidget: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  chartLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chart: {
    borderRadius: 14,
    marginLeft: -12,
  },
  levelBar: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 10,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  levelBarContainer: {
    flexDirection: 'row',
    height: 36,
    borderRadius: 8,
    overflow: 'hidden',
  },
  levelSegment: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  levelSegmentText: {
    color: '#ffffff',
    fontSize: 8,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.2,
  },
});
