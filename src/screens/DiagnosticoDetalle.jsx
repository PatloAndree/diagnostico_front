import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from '../api/axios';

const nombrePaciente = diagnostico => `${diagnostico?.paciente?.nombres || ''} ${diagnostico?.paciente?.apellidos || ''}`.trim() || `Paciente ID ${diagnostico?.paciente_id || ''}`;
const fecha = valor => valor ? new Date(valor).toLocaleString('es-PE', {dateStyle: 'medium', timeStyle: 'short'}) : 'Sin fecha';
const DiagnosticoDetalle = ({navigation, route}) => {
  const {diagnosticoId} = route.params;
  const [diagnostico, setDiagnostico] = useState(null);
  const [cargando, setCargando] = useState(true);
  const focus = useIsFocused();

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const {data} = await axios.get(`diagnosticos/${diagnosticoId}`);
      setDiagnostico(data.data || data);
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'No se pudo cargar el detalle del diagnóstico.');
    } finally {
      setCargando(false);
    }
  }, [diagnosticoId]);

  useEffect(() => { if (focus) cargar(); }, [focus, cargar]);

  return <View style={styles.container}>
    <View style={styles.header}><TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Volver"><MaterialIcons name="arrow-back" size={28} color="#093eeb" /></TouchableOpacity><Text style={styles.title}>Detalle</Text><View style={styles.headerSpace} /></View>
    {cargando ? <ActivityIndicator style={styles.loader} size="large" color="#093eeb" /> : !diagnostico ? <Text style={styles.empty}>No se encontró el diagnóstico.</Text> : <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.summary}><Text style={styles.patient}>{nombrePaciente(diagnostico)}</Text><Text style={styles.date}>{fecha(diagnostico.fecha || diagnostico.created_at)}</Text><View style={styles.status}><Text style={styles.statusText}>{diagnostico.estado || 'completado'}</Text></View></View>
      <Text style={styles.sectionTitle}>Conclusión</Text><View style={styles.box}><Text style={styles.boxText}>{diagnostico.conclusion || 'Sin conclusión registrada.'}</Text>{diagnostico.observaciones ? <Text style={styles.observations}>{diagnostico.observaciones}</Text> : null}</View>
      <Text style={styles.sectionTitle}>Resultados del test</Text>
      {(diagnostico.tests || []).map(test => <View key={test.id} style={styles.testCard}><Text style={styles.testName}>{test.nombre || test.test?.nombre || 'Test'}</Text><View style={styles.scores}><Text style={styles.score}>Puntaje: {test.puntaje_total ?? '-'}/{test.puntaje_maximo ?? '-'}</Text><Text style={styles.score}>Porcentaje: {test.porcentaje == null ? '-' : `${Number(test.porcentaje).toFixed(0)}%`}</Text></View>{(test.detalles || []).map(detalle => <View key={detalle.id} style={styles.detailRow}><View><Text style={styles.detailConcept}>{detalle.concepto}</Text><Text style={styles.detailAnswer}>Respuesta: {detalle.respuesta}</Text></View><Text style={styles.detailScore}>{detalle.puntaje}/{detalle.puntaje_maximo}</Text></View>)}</View>)}
      {!(diagnostico.tests || []).length && <Text style={styles.empty}>Este diagnóstico no tiene tests registrados.</Text>}
    </ScrollView>}
  </View>;
};

const styles = StyleSheet.create({container:{flex:1,backgroundColor:'#f6f5f5',padding:18},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:14,borderBottomWidth:1,borderColor:'#ddd'},title:{fontSize:22,fontWeight:'700',color:'#093eeb'},headerSpace:{width:28},loader:{marginTop:35},content:{paddingVertical:18,paddingBottom:35},summary:{backgroundColor:'#173B5B',padding:18,borderRadius:13},patient:{fontSize:20,fontWeight:'700',color:'#fff'},date:{fontSize:13,color:'#dbe8f2',marginTop:5},status:{alignSelf:'flex-start',backgroundColor:'#e4f5f3',borderRadius:12,paddingHorizontal:10,paddingVertical:4,marginTop:13},statusText:{color:'#16827D',fontSize:12,fontWeight:'700',textTransform:'capitalize'},sectionTitle:{fontSize:17,fontWeight:'800',color:'#173B5B',marginTop:23,marginBottom:9},box:{backgroundColor:'#fff',padding:15,borderRadius:10,elevation:1},boxText:{color:'#3f4c56',lineHeight:21},observations:{color:'#68717b',lineHeight:20,marginTop:10,fontStyle:'italic'},testCard:{backgroundColor:'#fff',padding:15,borderRadius:10,marginBottom:11,elevation:1},testName:{fontSize:16,fontWeight:'700',color:'#263746'},scores:{flexDirection:'row',justifyContent:'space-between',marginTop:8,paddingBottom:10,borderBottomWidth:1,borderColor:'#e5e9ed'},score:{fontSize:12,color:'#52606d',fontWeight:'600'},detailRow:{paddingVertical:11,borderBottomWidth:1,borderColor:'#edf0f2',flexDirection:'row',justifyContent:'space-between',alignItems:'center'},detailConcept:{color:'#263746',fontWeight:'700',textTransform:'capitalize'},detailAnswer:{color:'#68717b',fontSize:13,marginTop:3},detailScore:{color:'#16827D',fontWeight:'700'},empty:{textAlign:'center',margin:24,color:'#777'},});

export default DiagnosticoDetalle;
