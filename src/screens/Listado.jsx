import React, {useCallback, useEffect, useState} from 'react';
import {ActivityIndicator, Alert, FlatList, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native';
import {useIsFocused} from '@react-navigation/native';
import axios from '../api/axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const vacio = {institucion_id: '', nombres: '', apellidos: '', documento: '', fecha_nacimiento: ''};
const lista = data => Array.isArray(data) ? data : data?.data || [];

const Listado = ({navigation}) => {
  const [pacientes, setPacientes] = useState([]);
  const [instituciones, setInstituciones] = useState([]);
  const [formulario, setFormulario] = useState(vacio);
  const [editando, setEditando] = useState(null);
  const [visible, setVisible] = useState(false);
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [cargando, setCargando] = useState(false);
  const focus = useIsFocused();

  const cargar = useCallback(async () => {
    setCargando(true);
    try {
      const [respuestaPacientes, respuestaInstituciones] = await Promise.all([
        axios.get('pacientes'), axios.get('instituciones'),
      ]);
      setPacientes(lista(respuestaPacientes.data));
      setInstituciones(lista(respuestaInstituciones.data));
    } catch (error) {
      Alert.alert('Error', error.response?.data?.message || 'No se pudo cargar la información.');
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => { if (focus) cargar(); }, [focus, cargar]);

  const abrirFormulario = paciente => {
    setEditando(paciente?.id || null);
    setFormulario(paciente ? {
      institucion_id: String(paciente.institucion_id || paciente.institucion?.id || ''),
      nombres: paciente.nombres || '', apellidos: paciente.apellidos || '',
      documento: paciente.documento || '', fecha_nacimiento: paciente.fecha_nacimiento || '',
    } : vacio);
    setVisible(true);
  };

  const cambiar = (campo, valor) => setFormulario(actual => ({...actual, [campo]: valor}));
  const institucionSeleccionada = instituciones.find(i => String(i.id) === String(formulario.institucion_id));

  const guardar = async () => {
    if (Object.values(formulario).some(valor => !String(valor).trim())) {
      Alert.alert('Campos requeridos', 'Completa todos los datos del paciente.');
      return;
    }
    setCargando(true);
    try {
      const datos = {...formulario, institucion_id: Number(formulario.institucion_id)};
      if (editando) await axios.put(`pacientes/${editando}`, datos);
      else await axios.post('pacientes', datos);
      setVisible(false);
      await cargar();
    } catch (error) {
      Alert.alert('No se pudo guardar', error.response?.data?.message || 'Revisa los datos ingresados.');
    } finally {
      setCargando(false);
    }
  };

  const eliminar = paciente => Alert.alert(
    'Eliminar paciente', `¿Eliminar a ${paciente.nombres} ${paciente.apellidos}?`,
    [{text: 'Cancelar', style: 'cancel'}, {text: 'Eliminar', style: 'destructive', onPress: async () => {
      try { await axios.delete(`pacientes/${paciente.id}`); await cargar(); }
      catch (error) { Alert.alert('No se pudo eliminar', error.response?.data?.message || 'Inténtalo nuevamente.'); }
    }}],
  );

  const Campo = ({titulo, campo, placeholder, keyboardType}) => <View style={styles.field}>
    <Text style={styles.label}>{titulo}</Text>
    <TextInput value={formulario[campo]} placeholder={placeholder} keyboardType={keyboardType}
      style={styles.input} onChangeText={valor => cambiar(campo, valor)} />
  </View>;

  return <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}><MaterialIcons name="arrow-back" size={28} color="#093eeb" /></TouchableOpacity>
      <Text style={styles.title}>Pacientes</Text>
      <TouchableOpacity onPress={() => abrirFormulario()}><MaterialIcons name="person-add" size={29} color="#093eeb" /></TouchableOpacity>
    </View>
    <Text style={styles.count}>{pacientes.length} paciente{pacientes.length === 1 ? '' : 's'}</Text>
    {cargando && !visible ? <ActivityIndicator size="large" color="#093eeb" /> : <FlatList
      data={pacientes} keyExtractor={item => String(item.id)} refreshing={cargando} onRefresh={cargar}
      contentContainerStyle={styles.list} ListEmptyComponent={<Text style={styles.empty}>Aún no hay pacientes registrados.</Text>}
      renderItem={({item}) => <View style={styles.card}>
        <View style={styles.cardText}><Text style={styles.name}>{item.nombres} {item.apellidos}</Text><Text>Documento: {item.documento}</Text><Text>Fecha nacimiento: {item.fecha_nacimiento}</Text><Text>Institución: {item.institucion?.nombre || item.institucion_nombre || `ID ${item.institucion_id}`}</Text></View>
        <View><TouchableOpacity onPress={() => abrirFormulario(item)}><MaterialIcons name="edit" size={25} color="#093eeb" /></TouchableOpacity><TouchableOpacity style={styles.delete} onPress={() => eliminar(item)}><MaterialIcons name="delete-outline" size={25} color="#d32f2f" /></TouchableOpacity></View>
      </View>}
    />}

    <Modal visible={visible} animationType="slide" transparent onRequestClose={() => setVisible(false)}>
      <View style={styles.overlay}><View style={styles.modal}>
        <View style={styles.modalHeader}><Text style={styles.modalTitle}>{editando ? 'Editar paciente' : 'Nuevo paciente'}</Text><TouchableOpacity onPress={() => setVisible(false)}><MaterialIcons name="close" size={24} color="#555" /></TouchableOpacity></View>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.form}>
          <View style={styles.field}><Text style={styles.label}>Institución</Text>
            <TouchableOpacity style={styles.select} onPress={() => setSelectorVisible(true)}>
              <View style={styles.selectText}><Text style={institucionSeleccionada ? styles.selectValue : styles.placeholder}>{institucionSeleccionada ? institucionSeleccionada.nombre : 'Selecciona una institución'}</Text>{institucionSeleccionada && <Text style={styles.selectId}>ID: {institucionSeleccionada.id}</Text>}</View>
              <MaterialIcons name="keyboard-arrow-down" size={25} color="#093eeb" />
            </TouchableOpacity>
          </View>
          <Campo titulo="Nombres" campo="nombres" placeholder="Nombres del escolar" />
          <Campo titulo="Apellidos" campo="apellidos" placeholder="Apellidos del escolar" />
          <Campo titulo="Documento" campo="documento" placeholder="Documento" keyboardType="numeric" />
          <Campo titulo="Fecha de nacimiento" campo="fecha_nacimiento" placeholder="AAAA-MM-DD" />
          <TouchableOpacity style={styles.save} onPress={guardar} disabled={cargando}><Text style={styles.saveText}>{cargando ? 'Guardando...' : 'Guardar paciente'}</Text></TouchableOpacity>
        </ScrollView>
      </View></View>
    </Modal>

    <Modal visible={selectorVisible} animationType="fade" transparent onRequestClose={() => setSelectorVisible(false)}>
      <View style={styles.overlay}><View style={styles.selectorModal}>
        <View style={styles.modalHeader}><Text style={styles.modalTitle}>Selecciona institución</Text><TouchableOpacity onPress={() => setSelectorVisible(false)}><MaterialIcons name="close" size={24} color="#555" /></TouchableOpacity></View>
        <FlatList data={instituciones} keyExtractor={item => String(item.id)} ListEmptyComponent={<Text style={styles.empty}>No hay instituciones. Registra una primero.</Text>}
          renderItem={({item}) => <TouchableOpacity style={styles.institutionOption} onPress={() => { cambiar('institucion_id', String(item.id)); setSelectorVisible(false); }}><View style={styles.institutionIcon}><MaterialIcons name="school" size={20} color="#246B88" /></View><View style={styles.optionText}><Text style={styles.optionName}>{item.nombre}</Text><Text style={styles.optionId}>ID: {item.id} · {item.estado ? 'Activa' : 'Inactiva'}</Text></View>{String(item.id) === String(formulario.institucion_id) && <MaterialIcons name="check-circle" size={22} color="#16827D" />}</TouchableOpacity>}
        />
      </View></View>
    </Modal>
  </View>;
};

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#f6f5f5',padding:18}, header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:14,borderBottomWidth:1,borderColor:'#ddd'}, title:{fontSize:22,fontWeight:'700',color:'#093eeb'}, count:{marginVertical:14,color:'#555',fontWeight:'600'}, list:{paddingBottom:20}, card:{backgroundColor:'#fff',padding:15,marginBottom:10,borderRadius:8,flexDirection:'row',justifyContent:'space-between',elevation:2}, cardText:{flex:1}, name:{fontSize:17,fontWeight:'700',color:'#333',marginBottom:5}, delete:{marginTop:13}, empty:{textAlign:'center',margin:24,color:'#777'}, overlay:{flex:1,backgroundColor:'rgba(0,0,0,.45)',justifyContent:'center',padding:18}, modal:{backgroundColor:'#fff',borderRadius:14,maxHeight:'88%',padding:20}, selectorModal:{backgroundColor:'#fff',borderRadius:14,maxHeight:'72%',padding:20}, modalHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:8}, modalTitle:{fontSize:20,fontWeight:'700',color:'#093eeb'}, form:{paddingBottom:4}, field:{marginTop:13}, label:{fontWeight:'700',color:'#444',marginBottom:6}, input:{borderWidth:1,borderColor:'#c7c8cc',borderRadius:7,paddingHorizontal:12,height:46}, select:{minHeight:52,borderWidth:1,borderColor:'#c7c8cc',borderRadius:7,paddingHorizontal:12,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}, selectText:{flex:1}, selectValue:{fontSize:15,color:'#222',fontWeight:'600'}, placeholder:{fontSize:15,color:'#8a8a8a'}, selectId:{fontSize:12,color:'#666',marginTop:2}, save:{backgroundColor:'#093eeb',padding:14,borderRadius:7,alignItems:'center',marginTop:25}, saveText:{color:'#fff',fontWeight:'700',fontSize:15}, institutionOption:{paddingVertical:13,borderBottomWidth:1,borderBottomColor:'#edf0f2',flexDirection:'row',alignItems:'center'}, institutionIcon:{width:39,height:39,borderRadius:12,backgroundColor:'#e8f4f6',alignItems:'center',justifyContent:'center'}, optionText:{flex:1,marginLeft:11}, optionName:{fontSize:15,fontWeight:'700',color:'#333'}, optionId:{fontSize:12,color:'#68717b',marginTop:3},
});

export default Listado;
