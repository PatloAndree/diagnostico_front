import React, {useCallback, useEffect, useState} from 'react';
import {Alert, BackHandler, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {Divider, Modal} from 'react-native-paper';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {InicioS} from '../../shared/Estilos';
import axios from '../api/axios';

const obtenerLista = data => Array.isArray(data) ? data : data?.data || [];

const Inicio = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const [resumen, setResumen] = useState({pacientes: 0, instituciones: 0});
  const focus = useIsFocused();
  const route = useRoute();
  const {nombreUsuario = 'Usuario'} = route.params ?? {};

  const cargarResumen = useCallback(async () => {
    try {
      const [pacientes, instituciones] = await Promise.all([
        axios.get('pacientes'), axios.get('instituciones'),
      ]);
      setResumen({pacientes: obtenerLista(pacientes.data).length, instituciones: obtenerLista(instituciones.data).length});
    } catch (_) {
      // El inicio sigue disponible aunque la API aún no tenga registros.
    }
  }, []);

  const confirmarSalida = () => {
    setVisible(false);
    Alert.alert('Cerrar sesión', '¿Deseas salir de tu cuenta?', [
      {text: 'Cancelar', style: 'cancel'},
      {text: 'Salir', style: 'destructive', onPress: () => navigation.replace('Login')},
    ]);
    return true;
  };

  useEffect(() => {
    if (!focus) return undefined;
    cargarResumen();
    const subscription = BackHandler.addEventListener('hardwareBackPress', confirmarSalida);
    return () => subscription.remove();
  }, [focus, cargarResumen]);

  return <View style={InicioS.dashboard}>
    <View style={InicioS.dashboardHeader}>
      <TouchableOpacity style={InicioS.menuButton} onPress={() => setVisible(true)} accessibilityLabel="Abrir menú">
        <MaterialIcons name="menu" size={27} color="#173B5B" />
      </TouchableOpacity>
      <View style={InicioS.brandBlock}>
        <Text style={InicioS.brand}>Mente Escolar</Text>
        <Text style={InicioS.brandCaption}>Evaluación y seguimiento</Text>
      </View>
      <View style={InicioS.avatar}><Text style={InicioS.avatarText}>{nombreUsuario.charAt(0).toUpperCase()}</Text></View>
    </View>

    <ScrollView contentContainerStyle={InicioS.dashboardContent} showsVerticalScrollIndicator={false}>
      <View style={InicioS.welcomeCard}>
        <View style={InicioS.welcomeIcon}><MaterialCommunityIcons name="brain" size={34} color="#FFFFFF" /></View>
        <Text style={InicioS.welcomeEyebrow}>PANEL DE EVALUACIÓN</Text>
        <Text style={InicioS.welcomeTitle}>Hola, {nombreUsuario}</Text>
        <Text style={InicioS.welcomeText}>Organiza a tus escolares y mantén sus evaluaciones de TDAH al día.</Text>
      </View>

      <Text style={InicioS.sectionTitle}>Accesos rápidos</Text>
      <View style={InicioS.actionGrid}>
        <TouchableOpacity style={[InicioS.actionCard, InicioS.actionPrimary]} onPress={() => navigation.navigate('Listado')}>
          <View style={InicioS.actionIconPrimary}><Feather name="users" size={25} color="#FFFFFF" /></View>
          <Text style={InicioS.actionTitlePrimary}>Pacientes</Text>
          <Text style={InicioS.actionDescriptionPrimary}>Registrar y consultar escolares</Text>
          <MaterialIcons name="arrow-forward" size={22} color="#FFFFFF" style={InicioS.actionArrow} />
        </TouchableOpacity>
        <TouchableOpacity style={InicioS.actionCard} onPress={() => navigation.navigate('Instituciones')}>
          <View style={InicioS.actionIcon}><MaterialCommunityIcons name="school-outline" size={27} color="#246B88" /></View>
          <Text style={InicioS.actionTitle}>Instituciones</Text>
          <Text style={InicioS.actionDescription}>Gestiona centros educativos</Text>
          <MaterialIcons name="arrow-forward" size={22} color="#246B88" style={InicioS.actionArrow} />
        </TouchableOpacity>
      </View>

      <Text style={InicioS.sectionTitle}>Resumen</Text>
      <View style={InicioS.summaryRow}>
        <View style={InicioS.summaryCard}><View style={[InicioS.summaryIcon, {backgroundColor: '#E4F5F3'}]}><Feather name="user" size={21} color="#16827D" /></View><Text style={InicioS.summaryNumber}>{resumen.pacientes}</Text><Text style={InicioS.summaryLabel}>Escolares</Text></View>
        <View style={InicioS.summaryCard}><View style={[InicioS.summaryIcon, {backgroundColor: '#E8F0FE'}]}><MaterialCommunityIcons name="school" size={21} color="#3564B8" /></View><Text style={InicioS.summaryNumber}>{resumen.instituciones}</Text><Text style={InicioS.summaryLabel}>Instituciones</Text></View>
      </View>

      <View style={InicioS.infoCard}><MaterialCommunityIcons name="shield-check-outline" size={25} color="#16827D" /><View style={InicioS.infoText}><Text style={InicioS.infoTitle}>Acompañamiento responsable</Text><Text style={InicioS.infoDescription}>Los resultados orientan la evaluación; no reemplazan el diagnóstico profesional.</Text></View></View>
    </ScrollView>

    <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={InicioS.menuModal}>
      <View style={InicioS.menuModalTitle}><MaterialCommunityIcons name="account-circle-outline" size={25} color="#246B88" /><Text style={InicioS.menuTitleText}>Mi cuenta</Text></View>
      <Divider />
      <TouchableOpacity style={InicioS.menuLogout} onPress={confirmarSalida}><MaterialIcons name="logout" size={22} color="#D9534F" /><Text style={InicioS.menuLogoutText}>Cerrar sesión</Text></TouchableOpacity>
    </Modal>
  </View>;
};

export default Inicio;
