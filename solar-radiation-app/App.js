import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useState, useEffect } from 'react';

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

  useEffect(() => {
    // Generar datos simulados de radiación solar (W/m²)
    // La radiación solar típica va de 0 a ~1000 W/m²
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const currentHour = new Date().getHours();

    // Simular curva de radiación solar (patrón gaussiano centrado en mediodía)
    const radiationValues = hours.map(hour => {
      if (hour < 6 || hour > 20) return 0; // Sin radiación de noche

      // Curva gaussiana con pico al mediodía (12:00)
      const centerHour = 12;
      const spread = 4;
      const maxRadiation = 1000;

      const exponent = -Math.pow(hour - centerHour, 2) / (2 * Math.pow(spread, 2));
      const radiation = maxRadiation * Math.exp(exponent);

      // Agregar variación aleatoria (±10%)
      const variation = radiation * 0.1 * (Math.random() - 0.5) * 2;
      return Math.max(0, Math.round(radiation + variation));
    });

    // Calcular estadísticas
    const dayValues = radiationValues.filter(v => v > 0);
    const maxValue = Math.max(...dayValues);
    const minValue = Math.min(...dayValues);
    const avgValue = Math.round(dayValues.reduce((a, b) => a + b, 0) / dayValues.length);
    const currentValue = radiationValues[currentHour];

    setStats({
      max: maxValue,
      min: minValue,
      average: avgValue,
      current: currentValue
    });

    // Preparar datos para el gráfico (mostrar cada 2 horas para mejor visualización)
    const chartLabels = hours.filter((_, i) => i % 2 === 0).map(h => `${h}h`);
    const chartData = radiationValues.filter((_, i) => i % 2 === 0);

    setSolarData({
      labels: chartLabels,
      datasets: [{
        data: chartData,
        color: (opacity = 1) => `rgba(255, 165, 0, ${opacity})`, // Color naranja para el sol
        strokeWidth: 3
      }]
    });
  }, []);

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <StatusBar style="light" />

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>☀️ Radiación Solar</Text>
          <Text style={styles.headerSubtitle}>Estadísticas del día</Text>
        </View>

        {/* Tarjeta de valor actual */}
        <View style={styles.currentCard}>
          <Text style={styles.currentLabel}>Radiación Actual</Text>
          <Text style={styles.currentValue}>{stats.current}</Text>
          <Text style={styles.currentUnit}>W/m²</Text>
          <Text style={styles.currentTime}>
            {new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>

        {/* Estadísticas */}
        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Máximo</Text>
            <Text style={styles.statValue}>{stats.max}</Text>
            <Text style={styles.statUnit}>W/m²</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Promedio</Text>
            <Text style={styles.statValue}>{stats.average}</Text>
            <Text style={styles.statUnit}>W/m²</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Mínimo</Text>
            <Text style={styles.statValue}>{stats.min}</Text>
            <Text style={styles.statUnit}>W/m²</Text>
          </View>
        </View>

        {/* Gráfico */}
        <View style={styles.chartContainer}>
          <Text style={styles.chartTitle}>Radiación Solar durante el Día</Text>
          {solarData.datasets[0].data.length > 0 && (
            <LineChart
              data={solarData}
              width={screenWidth - 40}
              height={260}
              chartConfig={{
                backgroundColor: '#1e3a8a',
                backgroundGradientFrom: '#1e40af',
                backgroundGradientTo: '#3b82f6',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: '#fbbf24'
                },
                propsForBackgroundLines: {
                  strokeDasharray: '', // solid lines
                  stroke: 'rgba(255, 255, 255, 0.2)'
                }
              }}
              bezier
              style={styles.chart}
              fromZero={true}
            />
          )}
        </View>

        {/* Información adicional */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>📊 Información</Text>
          <Text style={styles.infoText}>
            • La radiación solar se mide en Watts por metro cuadrado (W/m²)
          </Text>
          <Text style={styles.infoText}>
            • Los valores típicos van de 0 a 1000 W/m² en días soleados
          </Text>
          <Text style={styles.infoText}>
            • El pico de radiación ocurre generalmente al mediodía
          </Text>
          <Text style={styles.infoText}>
            • Estos datos son simulados con fines demostrativos
          </Text>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Actualizado: {new Date().toLocaleDateString('es-ES')}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    paddingBottom: 30,
  },
  header: {
    backgroundColor: '#1e40af',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#bfdbfe',
    textAlign: 'center',
    marginTop: 5,
  },
  currentCard: {
    backgroundColor: '#1e3a8a',
    marginHorizontal: 20,
    marginTop: 20,
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  currentLabel: {
    fontSize: 16,
    color: '#93c5fd',
    marginBottom: 10,
  },
  currentValue: {
    fontSize: 64,
    fontWeight: 'bold',
    color: '#fbbf24',
  },
  currentUnit: {
    fontSize: 20,
    color: '#93c5fd',
    marginTop: -5,
  },
  currentTime: {
    fontSize: 14,
    color: '#60a5fa',
    marginTop: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginTop: 20,
  },
  statBox: {
    backgroundColor: '#1e293b',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 5,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  statUnit: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  chartContainer: {
    marginTop: 25,
    marginHorizontal: 20,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 15,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 16,
    marginVertical: 8,
  },
  infoContainer: {
    backgroundColor: '#1e293b',
    marginHorizontal: 20,
    marginTop: 25,
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#334155',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 13,
    color: '#cbd5e1',
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    marginTop: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#64748b',
  },
});
