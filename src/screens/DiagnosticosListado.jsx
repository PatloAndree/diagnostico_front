import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from '../api/axios';

const lista = data => Array.isArray(data) ? data : data?.data || [];
const nombrePaciente = diagnostico => {
  const paciente = diagnostico.paciente || {};
  return `${paciente.nombres || diagnostico.paciente_nombres || ''} ${paciente.apellidos || diagnostico.paciente_apellidos || ''}`.trim() || `Paciente ID ${diagnostico.paciente_id}`;
};
const fecha = valor => valor ? new Date(valor).toLocaleDateString('es-PE', {year: 'numeric', month: 'short', day: 'numeric'}) : 'Sin fecha';
const porcentaje = valor => valor == null || valor === '' ? '-' : `${Number(valor).toFixed(2)}%`;
const colorPorcentaje = valor => {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return styles.score;
  if (numero > 85) return styles.scoreHigh;
  if (numero >= 65) return styles.scoreMedium;
  return styles.scoreLow;
};

const DiagnosticosListado = ({navigation}) => {
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const focus = useIsFocused();

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const {data} = await axios.get('diagnosticos');
      setDiagnosticos(lista(data));
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'No se pudieron cargar los diagnósticos.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { if (focus) cargar(); }, [focus, cargar]);

  return <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()} accessibilityLabel="Volver"><MaterialIcons name="arrow-back" size={28} color="#093eeb" /></TouchableOpacity>
      <Text style={styles.title}>Diagnósticos</Text>
      <View style={styles.headerSpace} />
    </View>
    <Text style={styles.count}>{diagnosticos.length} diagnóstico{diagnosticos.length === 1 ? '' : 's'} registrado{diagnosticos.length === 1 ? '' : 's'}</Text>
    {cargando && !diagnosticos.length ? <ActivityIndicator style={styles.loader} size="large" color="#093eeb" /> : <FlatList
      data={diagnosticos} keyExtractor={item => String(item.id)} refreshing={cargando} onRefresh={cargar}
      contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.empty}>Aún no hay diagnósticos realizados.</Text>}
      renderItem={({item}) => <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('DiagnosticoDetalle', {diagnosticoId: item.id})}>
        <View style={styles.icon}><MaterialIcons name="assignment" size={24} color="#246B88" /></View>
        <View style={styles.cardText}>
          <Text style={styles.patient}>{nombrePaciente(item)}</Text><Text style={styles.date}>{fecha(item.fecha || item.created_at)}</Text>
          {(item.tests || []).map(test => <View key={test.id} style={styles.result}>
            <Text numberOfLines={1} style={styles.testName}>{test.test?.nombre || test.nombre || 'Test'}</Text>
            <Text style={styles.score}>Puntaje: {test.puntaje_total ?? '-'}/{test.puntaje_maximo ?? '-'}</Text>
            <Text style={[styles.score, colorPorcentaje(test.porcentaje)]}>Porcentaje: {porcentaje(test.porcentaje)}</Text>
          </View>)}
          {!(item.tests || []).length && <Text style={styles.noResults}>Sin resultados generales registrados.</Text>}
        </View>
        <MaterialIcons name="chevron-right" size={27} color="#6b7884" />
      </TouchableOpacity>}
    />}
  </View>;
};

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#f6f5f5',padding:18},header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:14,borderBottomWidth:1,borderColor:'#ddd'},title:{fontSize:22,fontWeight:'700',color:'#093eeb'},headerSpace:{width:28},count:{marginVertical:14,color:'#555',fontWeight:'600'},loader:{marginTop:35},list:{paddingBottom:24},card:{backgroundColor:'#fff',padding:14,marginBottom:11,borderRadius:11,elevation:2,flexDirection:'row',alignItems:'center'},icon:{width:45,height:45,borderRadius:14,backgroundColor:'#e8f4f6',alignItems:'center',justifyContent:'center'},cardText:{flex:1,marginHorizontal:11},patient:{fontSize:16,fontWeight:'700',color:'#263746'},date:{fontSize:12,color:'#68717b',marginTop:3},result:{marginTop:9,paddingTop:8,borderTopWidth:1,borderTopColor:'#edf0f2'},testName:{fontSize:13,color:'#263746',fontWeight:'700'},score:{fontSize:12,color:'#52606d',marginTop:2},scoreHigh:{color:'#dc2626',fontWeight:'700'},scoreMedium:{color:'#d97706',fontWeight:'700'},scoreLow:{color:'#093eeb',fontWeight:'700'},noResults:{fontSize:12,color:'#68717b',fontStyle:'italic',marginTop:8},empty:{textAlign:'center',margin:24,color:'#777'},
});

export default DiagnosticosListado;
