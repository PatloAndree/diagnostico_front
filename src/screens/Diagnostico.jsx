import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from '../api/axios';

const preguntasPorDefecto = [
  {codigo: 'animo', pregunta: '¿Cómo calificarías tu estado de ánimo hoy?'},
  {codigo: 'sueno', pregunta: '¿Qué tan reparador fue tu sueño reciente?'},
  {codigo: 'energia', pregunta: '¿Cómo está tu nivel de energía hoy?'},
  {codigo: 'concentracion', pregunta: '¿Qué tan fácil te resulta concentrarte?'},
];

const lista = data => Array.isArray(data) ? data : data?.data || [];
const nombrePaciente = paciente => `${paciente.nombres || ''} ${paciente.apellidos || ''}`.trim() || `Paciente ${paciente.id}`;

const Diagnostico = ({navigation}) => {
  const [pacientes, setPacientes] = useState([]);
  const [pacienteId, setPacienteId] = useState('');
  const [formulario, setFormulario] = useState({instruccion: '', preguntas: preguntasPorDefecto});
  const [respuestas, setRespuestas] = useState({animo: null, sueno: null, energia: null, concentracion: null});
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const focus = useIsFocused();

  const cargarInformacion = useCallback(async () => {
    setCargando(true);
    try {
      const [respuestaPacientes, respuestaFormulario] = await Promise.all([
        axios.get('pacientes'),
        axios.get('diagnosticos/minimo/formulario'),
      ]);
      setPacientes(lista(respuestaPacientes.data));
      if (Array.isArray(respuestaFormulario.data?.preguntas)) {
        setFormulario({
          instruccion: respuestaFormulario.data.instruccion || '',
          preguntas: respuestaFormulario.data.preguntas,
        });
      }
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'No se pudo cargar la información del diagnóstico.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { if (focus) cargarInformacion(); }, [focus, cargarInformacion]);

  const pacienteSeleccionado = pacientes.find(paciente => String(paciente.id) === pacienteId);
  const completarRespuesta = (campo, valor) => setRespuestas(actual => ({...actual, [campo]: valor}));

  const guardar = async () => {
    if (!pacienteId) {
      Alert.alert('Paciente requerido', 'Selecciona el paciente a evaluar.');
      return;
    }
    if (Object.values(respuestas).some(valor => valor === null)) {
      Alert.alert('Encuesta incompleta', 'Responde las cuatro preguntas antes de guardar.');
      return;
    }

    setGuardando(true);
    try {
      await axios.post('diagnosticos/minimo', {paciente_id: Number(pacienteId), respuestas});
      Alert.alert('Diagnóstico guardado', 'La encuesta se registró correctamente.', [
        {text: 'Aceptar', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      Alert.alert('No se pudo guardar', error.response?.data?.message || 'Revisa los datos e inténtalo nuevamente.');
    } finally {
      setGuardando(false);
    }
  };

  return <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Volver"><MaterialIcons name="arrow-back" size={28} color="#093eeb" /></TouchableOpacity>
      <Text style={styles.title}>Diagnóstico</Text>
      <View style={styles.headerSpace} />
    </View>

    {cargando ? <ActivityIndicator style={styles.loader} size="large" color="#093eeb" /> : <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Text style={styles.intro}>{formulario.instruccion || 'Completa la encuesta y guarda las respuestas para el paciente seleccionado.'}</Text>
      <Text style={styles.label}>Paciente</Text>
      <TouchableOpacity style={styles.select} onPress={() => setSelectorVisible(true)}>
        <View style={styles.selectText}><Text style={pacienteSeleccionado ? styles.selectValue : styles.placeholder}>{pacienteSeleccionado ? nombrePaciente(pacienteSeleccionado) : 'Selecciona un paciente'}</Text>{pacienteSeleccionado && <Text style={styles.selectId}>ID: {pacienteSeleccionado.id}</Text>}</View>
        <MaterialIcons name="keyboard-arrow-down" size={26} color="#093eeb" />
      </TouchableOpacity>

      <Text style={styles.scaleHint}>Escala: 1 = muy bajo / difícil · 5 = muy alto / fácil</Text>
      {formulario.preguntas.map(pregunta => <View key={pregunta.codigo} style={styles.questionCard}>
        <Text style={styles.questionTitle}>{pregunta.codigo.charAt(0).toUpperCase() + pregunta.codigo.slice(1)}</Text>
        <Text style={styles.questionDescription}>{pregunta.pregunta}</Text>
        <View style={styles.options}>{[1, 2, 3, 4, 5].map(valor => <TouchableOpacity key={valor} style={[styles.option, respuestas[pregunta.codigo] === valor && styles.optionSelected]} onPress={() => completarRespuesta(pregunta.codigo, valor)} accessibilityLabel={`${pregunta.codigo}: ${valor}`}><Text style={[styles.optionText, respuestas[pregunta.codigo] === valor && styles.optionTextSelected]}>{valor}</Text></TouchableOpacity>)}</View>
      </View>)}
      <TouchableOpacity style={[styles.save, guardando && styles.saveDisabled]} onPress={guardar} disabled={guardando}><Text style={styles.saveText}>{guardando ? 'Guardando...' : 'Guardar diagnóstico'}</Text></TouchableOpacity>
    </ScrollView>}

    <Modal visible={selectorVisible} animationType="fade" transparent onRequestClose={() => setSelectorVisible(false)}>
      <View style={styles.overlay}><View style={styles.selectorModal}>
        <View style={styles.modalHeader}><Text style={styles.modalTitle}>Selecciona un paciente</Text><TouchableOpacity onPress={() => setSelectorVisible(false)}><MaterialIcons name="close" size={24} color="#555" /></TouchableOpacity></View>
        <FlatList data={pacientes} keyExtractor={item => String(item.id)} ListEmptyComponent={<Text style={styles.empty}>No hay pacientes registrados.</Text>}
          renderItem={({item}) => <TouchableOpacity style={styles.patientOption} onPress={() => { setPacienteId(String(item.id)); setSelectorVisible(false); }}><View style={styles.patientIcon}><MaterialIcons name="person" size={21} color="#246B88" /></View><View style={styles.patientText}><Text style={styles.patientName}>{nombrePaciente(item)}</Text><Text style={styles.patientId}>ID: {item.id}{item.documento ? ` · Documento: ${item.documento}` : ''}</Text></View>{String(item.id) === pacienteId && <MaterialIcons name="check-circle" size={22} color="#16827D" />}</TouchableOpacity>}
        />
      </View></View>
    </Modal>
  </View>;
};

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#f6f5f5',padding:18}, header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:14,borderBottomWidth:1,borderColor:'#ddd'}, title:{fontSize:22,fontWeight:'700',color:'#093eeb'}, headerSpace:{width:28}, loader:{marginTop:35}, content:{paddingVertical:18,paddingBottom:35}, intro:{color:'#58636e',lineHeight:20,marginBottom:20}, label:{fontWeight:'700',color:'#444',marginBottom:7}, select:{minHeight:55,borderWidth:1,borderColor:'#c7c8cc',borderRadius:9,paddingHorizontal:13,backgroundColor:'#fff',flexDirection:'row',alignItems:'center',justifyContent:'space-between'}, selectText:{flex:1}, selectValue:{fontSize:16,color:'#222',fontWeight:'600'}, placeholder:{fontSize:16,color:'#8a8a8a'}, selectId:{fontSize:12,color:'#68717b',marginTop:3}, scaleHint:{color:'#68717b',fontSize:12,marginTop:17,marginBottom:8}, questionCard:{backgroundColor:'#fff',borderRadius:10,padding:15,marginTop:10,elevation:1}, questionTitle:{fontSize:17,fontWeight:'700',color:'#173B5B'}, questionDescription:{color:'#59636b',marginTop:4,lineHeight:19}, options:{flexDirection:'row',justifyContent:'space-between',marginTop:14}, option:{width:43,height:43,borderRadius:22,borderWidth:1,borderColor:'#b8c1c9',alignItems:'center',justifyContent:'center'}, optionSelected:{backgroundColor:'#093eeb',borderColor:'#093eeb'}, optionText:{fontSize:16,fontWeight:'700',color:'#425466'}, optionTextSelected:{color:'#fff'}, save:{backgroundColor:'#093eeb',padding:15,borderRadius:8,alignItems:'center',marginTop:25}, saveDisabled:{opacity:.65}, saveText:{color:'#fff',fontWeight:'700',fontSize:16}, overlay:{flex:1,backgroundColor:'rgba(0,0,0,.45)',justifyContent:'center',padding:18}, selectorModal:{backgroundColor:'#fff',borderRadius:14,maxHeight:'72%',padding:20}, modalHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8}, modalTitle:{fontSize:20,fontWeight:'700',color:'#093eeb'}, patientOption:{paddingVertical:13,borderBottomWidth:1,borderBottomColor:'#edf0f2',flexDirection:'row',alignItems:'center'}, patientIcon:{width:40,height:40,borderRadius:20,backgroundColor:'#e8f4f6',alignItems:'center',justifyContent:'center'}, patientText:{flex:1,marginLeft:11}, patientName:{fontSize:16,fontWeight:'700',color:'#333'}, patientId:{fontSize:12,color:'#68717b',marginTop:3}, empty:{textAlign:'center',margin:24,color:'#777'},
});

export default Diagnostico;
