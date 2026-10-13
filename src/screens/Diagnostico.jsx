import React, {useCallback, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from '../api/axios';

const preguntasAdhd = [
  {codigo: 'item_1', dominio: 'Inatención', pregunta: 'Tiene dificultades para prestar atención a detalles o comete errores por descuido.'},
  {codigo: 'item_2', dominio: 'Hiperactividad e impulsividad', pregunta: 'Mueve con frecuencia las manos o los pies, o se retuerce en el asiento.'},
  {codigo: 'item_3', dominio: 'Inatención', pregunta: 'Tiene dificultades para mantener la atención en tareas o actividades.'},
  {codigo: 'item_4', dominio: 'Hiperactividad e impulsividad', pregunta: 'Se levanta de su asiento cuando debería permanecer sentado.'},
  {codigo: 'item_5', dominio: 'Inatención', pregunta: 'Parece no escuchar cuando se le habla directamente.'},
  {codigo: 'item_6', dominio: 'Hiperactividad e impulsividad', pregunta: 'Corre o trepa en situaciones donde no corresponde.'},
  {codigo: 'item_7', dominio: 'Inatención', pregunta: 'Tiene dificultades para seguir instrucciones o terminar actividades escolares.'},
  {codigo: 'item_8', dominio: 'Hiperactividad e impulsividad', pregunta: 'Tiene dificultades para jugar o realizar actividades tranquilamente.'},
  {codigo: 'item_9', dominio: 'Inatención', pregunta: 'Tiene dificultades para organizar tareas y actividades.'},
  {codigo: 'item_10', dominio: 'Hiperactividad e impulsividad', pregunta: 'Actúa como si estuviera impulsado por un motor o no pudiera detenerse.'},
  {codigo: 'item_11', dominio: 'Inatención', pregunta: 'Evita o rechaza tareas que requieren esfuerzo mental sostenido.'},
  {codigo: 'item_12', dominio: 'Hiperactividad e impulsividad', pregunta: 'Habla en exceso.'},
  {codigo: 'item_13', dominio: 'Inatención', pregunta: 'Pierde objetos necesarios para sus actividades.'},
  {codigo: 'item_14', dominio: 'Hiperactividad e impulsividad', pregunta: 'Responde antes de que se termine una pregunta.'},
  {codigo: 'item_15', dominio: 'Inatención', pregunta: 'Se distrae fácilmente por estímulos externos.'},
  {codigo: 'item_16', dominio: 'Hiperactividad e impulsividad', pregunta: 'Tiene dificultades para esperar su turno.'},
  {codigo: 'item_17', dominio: 'Inatención', pregunta: 'Es olvidadizo en actividades cotidianas o escolares.'},
  {codigo: 'item_18', dominio: 'Hiperactividad e impulsividad', pregunta: 'Interrumpe o se entromete en actividades o conversaciones de otras personas.'},
];

const opcionesEscala = [
  {valor: 0, etiqueta: 'Nunca o raramente'},
  {valor: 1, etiqueta: 'Algunas veces'},
  {valor: 2, etiqueta: 'Frecuentemente'},
  {valor: 3, etiqueta: 'Muy frecuentemente'},
];

const crearRespuestasVacias = () =>
  preguntasAdhd.reduce((acumulado, pregunta) => {
    acumulado[pregunta.codigo] = null;
    return acumulado;
  }, {});

const lista = data => Array.isArray(data) ? data : data?.data || [];

const nombrePaciente = paciente =>
  `${paciente.nombres || ''} ${paciente.apellidos || ''}`.trim() ||
  `Paciente ${paciente.id}`;

const Diagnostico = ({navigation}) => {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteId, setPacienteId] = useState('');
  const [respuestas, setRespuestas] = useState(crearRespuestasVacias);
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const focus = useIsFocused();

  const cargarPacientes = useCallback(async () => {
    setCargando(true);

    try {
      const respuesta = await axios.get('pacientes');
      setPacientes(lista(respuesta.data));
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message ||
          'No se pudieron cargar los pacientes.',
      );
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    if (focus) {
      cargarPacientes();
    }
  }, [focus, cargarPacientes]);

  const pacienteSeleccionado = pacientes.find(
    paciente => String(paciente.id) === pacienteId,
  );

  const completarRespuesta = (campo, valor) => {
    setRespuestas(actual => ({...actual, [campo]: valor}));
  };

  const guardar = async () => {
    if (!pacienteId) {
      Alert.alert('Paciente requerido', 'Selecciona el paciente a evaluar.');
      return;
    }

    const preguntasSinResponder = preguntasAdhd.filter(
      pregunta => respuestas[pregunta.codigo] === null,
    );

    if (preguntasSinResponder.length > 0) {
      Alert.alert(
        'Encuesta incompleta',
        `Faltan ${preguntasSinResponder.length} de las 18 preguntas por responder.`,
      );
      return;
    }

    setGuardando(true);

    try {
      await axios.post('diagnosticos/adhd', {
        paciente_id: Number(pacienteId),
        respuestas,
      });

      Alert.alert(
        'Tamizaje guardado',
        'Las 18 respuestas y el resultado fueron registrados correctamente.',
        [{text: 'Aceptar', onPress: () => navigation.goBack()}],
      );
    } catch (error) {
      Alert.alert(
        'No se pudo guardar',
        error.response?.data?.message ||
          'Revisa los datos e inténtalo nuevamente.',
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          accessibilityLabel="Volver">
          <MaterialIcons name="arrow-back" size={28} color="#093eeb" />
        </TouchableOpacity>

        <Text style={styles.title}>Tamizaje TDAH</Text>
        <View style={styles.headerSpace} />
      </View>

      {cargando ? (
        <ActivityIndicator style={styles.loader} size="large" color="#093eeb" />
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}>
          <Text style={styles.intro}>
            Cuestionario de observación docente. Responde según el comportamiento
            observado durante los últimos seis meses.
          </Text>

          <Text style={styles.warning}>
            Es un tamizaje y no reemplaza una evaluación clínica profesional.
          </Text>

          <Text style={styles.label}>Paciente</Text>

          <TouchableOpacity
            style={styles.select}
            onPress={() => setSelectorVisible(true)}>
            <View style={styles.selectText}>
              <Text
                style={
                  pacienteSeleccionado ? styles.selectValue : styles.placeholder
                }>
                {pacienteSeleccionado
                  ? nombrePaciente(pacienteSeleccionado)
                  : 'Selecciona un paciente'}
              </Text>

              {pacienteSeleccionado && (
                <Text style={styles.selectId}>
                  ID: {pacienteSeleccionado.id}
                </Text>
              )}
            </View>

            <MaterialIcons
              name="keyboard-arrow-down"
              size={26}
              color="#093eeb"
            />
          </TouchableOpacity>

          <Text style={styles.scaleTitle}>Escala de respuesta</Text>

          <View style={styles.scaleLegend}>
            {opcionesEscala.map(opcion => (
              <View key={opcion.valor} style={styles.scaleLegendItem}>
                <Text style={styles.scaleLegendNumber}>{opcion.valor}</Text>
                <Text style={styles.scaleLegendText}>{opcion.etiqueta}</Text>
              </View>
            ))}
          </View>

          {preguntasAdhd.map((pregunta, indice) => (
            <View key={pregunta.codigo} style={styles.questionCard}>
              <Text style={styles.questionDomain}>{pregunta.dominio}</Text>

              <Text style={styles.questionTitle}>
                {indice + 1}. Pregunta
              </Text>

              <Text style={styles.questionDescription}>
                {pregunta.pregunta}
              </Text>

              <View style={styles.options}>
                {opcionesEscala.map(opcion => (
                  <TouchableOpacity
                    key={opcion.valor}
                    style={[
                      styles.option,
                      respuestas[pregunta.codigo] === opcion.valor &&
                        styles.optionSelected,
                    ]}
                    onPress={() =>
                      completarRespuesta(pregunta.codigo, opcion.valor)
                    }
                    accessibilityLabel={`Pregunta ${indice + 1}: ${opcion.etiqueta}`}>
                    <Text
                      style={[
                        styles.optionText,
                        respuestas[pregunta.codigo] === opcion.valor &&
                          styles.optionTextSelected,
                      ]}>
                      {opcion.valor}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}

          <TouchableOpacity
            style={[styles.save, guardando && styles.saveDisabled]}
            onPress={guardar}
            disabled={guardando}>
            <Text style={styles.saveText}>
              {guardando ? 'Procesando...' : 'Guardar tamizaje'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      <Modal
        visible={selectorVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectorVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.selectorModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Selecciona un paciente</Text>

              <TouchableOpacity onPress={() => setSelectorVisible(false)}>
                <MaterialIcons name="close" size={24} color="#555" />
              </TouchableOpacity>
            </View>

            <FlatList
              data={pacientes}
              keyExtractor={item => String(item.id)}
              ListEmptyComponent={
                <Text style={styles.empty}>No hay pacientes registrados.</Text>
              }
              renderItem={({item}) => (
                <TouchableOpacity
                  style={styles.patientOption}
                  onPress={() => {
                    setPacienteId(String(item.id));
                    setSelectorVisible(false);
                  }}>
                  <View style={styles.patientIcon}>
                    <MaterialIcons name="person" size={21} color="#246B88" />
                  </View>

                  <View style={styles.patientText}>
                    <Text style={styles.patientName}>{nombrePaciente(item)}</Text>
                    <Text style={styles.patientId}>
                      ID: {item.id}
                      {item.documento ? ` · Documento: ${item.documento}` : ''}
                    </Text>
                  </View>

                  {String(item.id) === pacienteId && (
                    <MaterialIcons
                      name="check-circle"
                      size={22}
                      color="#16827D"
                    />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f5f5',
    padding: 18,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#093eeb',
  },
  headerSpace: {
    width: 28,
  },
  loader: {
    marginTop: 35,
  },
  content: {
    paddingVertical: 18,
    paddingBottom: 35,
  },
  intro: {
    color: '#58636e',
    lineHeight: 20,
    marginBottom: 10,
  },
  warning: {
    color: '#9a5b00',
    backgroundColor: '#fff4d8',
    padding: 12,
    borderRadius: 8,
    lineHeight: 19,
    marginBottom: 20,
  },
  label: {
    fontWeight: '700',
    color: '#444',
    marginBottom: 7,
  },
  select: {
    minHeight: 55,
    borderWidth: 1,
    borderColor: '#c7c8cc',
    borderRadius: 9,
    paddingHorizontal: 13,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  selectText: {
    flex: 1,
  },
  selectValue: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
  },
  placeholder: {
    fontSize: 16,
    color: '#8a8a8a',
  },
  selectId: {
    fontSize: 12,
    color: '#68717b',
    marginTop: 3,
  },
  scaleTitle: {
    color: '#444',
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  scaleLegend: {
    backgroundColor: '#edf4ff',
    borderRadius: 9,
    padding: 10,
    marginBottom: 4,
  },
  scaleLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 2,
  },
  scaleLegendNumber: {
    color: '#fff',
    backgroundColor: '#093eeb',
    width: 21,
    height: 21,
    borderRadius: 11,
    textAlign: 'center',
    fontWeight: '700',
    marginRight: 8,
  },
  scaleLegendText: {
    color: '#465566',
    fontSize: 13,
  },
  questionCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginTop: 12,
    elevation: 1,
  },
  questionDomain: {
    color: '#16827D',
    fontWeight: '700',
    fontSize: 12,
    textTransform: 'uppercase',
  },
  questionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#173B5B',
    marginTop: 5,
  },
  questionDescription: {
    color: '#59636b',
    marginTop: 4,
    lineHeight: 20,
  },
  options: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  option: {
    width: 52,
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b8c1c9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: '#093eeb',
    borderColor: '#093eeb',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#425466',
  },
  optionTextSelected: {
    color: '#fff',
  },
  save: {
    backgroundColor: '#093eeb',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 25,
  },
  saveDisabled: {
    opacity: 0.65,
  },
  saveText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.45)',
    justifyContent: 'center',
    padding: 18,
  },
  selectorModal: {
    backgroundColor: '#fff',
    borderRadius: 14,
    maxHeight: '72%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#093eeb',
  },
  patientOption: {
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: '#edf0f2',
    flexDirection: 'row',
    alignItems: 'center',
  },
  patientIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientText: {
    flex: 1,
    marginLeft: 11,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  patientId: {
    fontSize: 12,
    color: '#68717b',
    marginTop: 3,
  },
  empty: {
    textAlign: 'center',
    margin: 24,
    color: '#777',
  },
});

export default Diagnostico;