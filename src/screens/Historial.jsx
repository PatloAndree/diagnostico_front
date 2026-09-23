import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from '../Api/axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {HistorialS} from '../../Shared/Estilos';
import {Button, Modal, Divider, List, ProgressBar} from 'react-native-paper';
import {useIsFocused, useRoute} from '@react-navigation/native';

const Historial = ({navigation}) => {
  const [proyectos, setProyectos] = useState([]);

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [busqueda, setBusqueda] = useState('Estado');

  const [estadoGlobal, setEstadoGlobal] = useState(0);
  const [tiempoGlobal, setTiempoGlobal] = useState(0);

  const [visibleTiempo, setVisibleTiempo] = useState(false);
  const showModalTiempo = () => setVisibleTiempo(true);
  const hideModalTiempo = () => setVisibleTiempo(false);
  const [tiempoText, setTiempoText] = useState('Rango');

  const focus = useIsFocused();

  const fnfnBusquedaEstado = (texto, diasFiltro) => {
    console.log(diasFiltro);
    if (texto === 1) {
      setEstadoGlobal(1);
      setBusqueda('Completado');
    } else if (texto === 2) {
      setEstadoGlobal(2);
      setBusqueda('En proceso');
    } else if (texto === 3) {
      setEstadoGlobal(3);
      setBusqueda('En revisión');
    } else if (texto === 4) {
      setEstadoGlobal(4);
      setBusqueda('Descartados');
    }
    setVisible(false);
  };

  const fnBuscarProyecto = () => {
    ToastAndroid.showWithGravity(
      'Buscando proyectos....',
      ToastAndroid.LONG,
      ToastAndroid.BOTTOM,
    );
  };

  const filtrarPorTiempo = dias => {
    setTiempoText(dias + ' ' + 'dias');
    setTiempoGlobal(dias);
    setVisibleTiempo(false);
  };

  const fnListarProyectos = async () => {
    await axios({
      method: 'get',
      url: 'listadoProyectos',
      data: null,
    })
      .then(async function (d) {
        let datos = d.data;
        if (estadoGlobal) {
          datos = datos.filter(proyecto => proyecto.estado === estadoGlobal);
        }
        const todayDate = new Date(); 
        const fechaLimite = new Date(todayDate); 
        fechaLimite.setDate(fechaLimite.getDate() - tiempoGlobal); 
        datos = datos.filter(proyecto => {
          const fechaProyecto = new Date(proyecto.created_at); 
          return fechaProyecto >= fechaLimite; 
        });
        setProyectos(datos);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  useEffect(() => {
    if (focus == true) {
      if (estadoGlobal && tiempoGlobal != 0) {
        fnListarProyectos();
      }
    }
  }, [focus]);

  return (
    <View style={HistorialS.container}>
      <View style={HistorialS.container_head}>
        <TouchableOpacity
          onPress={showModal}
          style={HistorialS.container_head_search}>
          <Text style={HistorialS.color_buttons}>{busqueda}</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={25}
            color={'#61677A'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={showModalTiempo}
          style={HistorialS.container_head_time}>
          <Text style={HistorialS.color_buttons}>{tiempoText}</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={25}
            color={'#61677A'}
          />
        </TouchableOpacity>

        <View style={HistorialS.container_head_options}>
          <TouchableOpacity onPress={() => fnListarProyectos()}>
            <MaterialIcons name="search" size={30} color={'#FF9E14'} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={HistorialS.container_body}>
        {proyectos != '' && proyectos != null ? (
          <ScrollView>
            <List.AccordionGroup>
              {proyectos.map((proyecto, index) => (
                <List.Accordion
                  key={index}
                  title={proyecto.nombre}
                  id={index.toString()}
                  rippleColor={'rgba(243, 102, 5, 0.10)'}
                  style={{
                    backgroundColor: '#F7F7F8',
                    marginBottom: 5,
                    borderRadius: 3,
                    borderWidth: 0.4,
                    borderColor: '#C7C8CC',
                  }}>
                  <View style={HistorialS.accordion}>
                    <View style={HistorialS.accordion_div}>
                      <View style={HistorialS.accordion_group_left}>
                        <Text style={HistorialS.text_description}>Nombre:</Text>
                        <Text style={HistorialS.text_description}>
                          Duración:
                        </Text>
                        <Text style={HistorialS.text_description}>Costo:</Text>

                        <Text style={HistorialS.text_description}>
                          {proyecto.estado != 3
                            ? `Avance (${proyecto.porcentaje}%) :`
                            : `Error : `}
                        </Text>

                        <Text style={HistorialS.text_description}>
                          {proyecto.estado != 3
                            ? `Fecha inicio :`
                            : `Coeficiente : `}
                        </Text>
                        {proyecto.estado != 3 ? (
                          <Text style={HistorialS.text_description}>
                            Fecha final:
                          </Text>
                        ) : (
                          ``
                        )}
                        <Text style={HistorialS.text_description}>Estado:</Text>
                      </View>
                      <View style={HistorialS.accordion_group_right}>
                        <Text style={HistorialS.text_bolder}>
                          {proyecto.nombre}
                        </Text>
                        <Text style={HistorialS.text_bolder}>
                          {proyecto.tiempo} meses
                        </Text>
                        <Text style={HistorialS.text_bolder}>
                          S/. {proyecto.costo} Soles
                        </Text>

                        {proyecto.estado != 3 ? (
                          <ProgressBar
                            progress={proyecto.porcentaje * 0.01}
                            color={'#12DC4B'}
                            style={{
                              backgroundColor: '#C1F2B0',
                              height: 15,
                              borderRadius: 10,
                            }}
                          />
                        ) : (
                          <Text style={HistorialS.text_bolder}>
                            {' '}
                            {proyecto.error} %
                          </Text>
                        )}

                        <Text style={HistorialS.text_bolder}>
                          {proyecto.estado != 3
                            ? `${proyecto.fecha_inicio}`
                            : `${proyecto.coeficiente} %`}
                        </Text>
                        {proyecto.estado != 3 ? (
                          <Text style={HistorialS.text_bolder}>
                            {proyecto.fecha_fin}
                          </Text>
                        ) : (
                          ``
                        )}

                        <Text style={HistorialS.text_bolder}>
                          {proyecto.estado == 1 ? (
                            <Text
                              style={[
                                HistorialS.text_bolder,
                                {color: '#387F39'},
                              ]}>
                              Completado
                            </Text>
                          ) : proyecto.estado == 2 ? (
                            <Text
                              style={[
                                HistorialS.text_bolder,
                                {color: '#0F67B1'},
                              ]}>
                              En Proceso
                            </Text>
                          ) : proyecto.estado == 3 ? (
                            <Text
                              style={[
                                HistorialS.text_bolder,
                                {color: '#F57D1F'},
                              ]}>
                              En Revisión
                            </Text>
                          ) : (
                            <Text
                              style={[
                                HistorialS.text_bolder,
                                {color: '#FF4C4C'},
                              ]}>
                              Descartado
                            </Text>
                          )}
                        </Text>
                      </View>
                    </View>
                    <View style={HistorialS.accordion_footer}>
                      <TouchableOpacity
                        style={HistorialS.accordion_footer_button}
                        onPress={() =>
                          navigation.push('ListadoDetalle', {
                            proyectoId: proyecto.id,
                            proyectoNombre: proyecto.nombre,
                            proyectoT: proyecto.tiempo,
                            proyectoTE: proyecto.tiempoestimado,
                            proyectoCosto: proyecto.costo,
                            proyectoAvance: proyecto.porcentaje,
                            proyectoEstado: proyecto.estado,
                            proyectoError: proyecto.errorabsmedio,
                            proyectoCoeficiente: proyecto.coeficientedeter,
                            proyectoCrossC: proyecto.crossc,
                            proyectoCrossT: proyecto.crosst,
                            proyectoInicio: proyecto.fecha_inicio,
                            proyectoFin: proyecto.fecha_fin,
                            proyectoMateriales: proyecto.materiales,
                            proyectoEquipos: proyecto.equipos,
                            proyectoManodeobra: proyecto.manodeobra,
                          })
                        }>
                        <Text style={HistorialS.text_description}>Ver más</Text>
                        <MaterialIcons
                          name="keyboard-arrow-right"
                          size={23}
                          color={'#FF9103'}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </List.Accordion>
              ))}
            </List.AccordionGroup>
          </ScrollView>
        ) : (
          <Text style={HistorialS.text_bolder}>
            Selecciona estado y rango de fecha
            <MaterialIcons name="punch-clock" size={17} color={'#FF9103'} />
          </Text>
        )}
      </View>

      <Modal visible={visible} onDismiss={hideModal}>
        <View style={HistorialS.menu_modal_container}>
          <TouchableOpacity
            style={HistorialS.menu_modal_container_option}
            onPress={() => fnfnBusquedaEstado(1)}>
            <Text style={HistorialS.text_description}>Completados</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={HistorialS.menu_modal_container_option}
            onPress={() => fnfnBusquedaEstado(2)}>
            <Text style={HistorialS.text_description}>En proceso</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={HistorialS.menu_modal_container_option}
            onPress={() => fnfnBusquedaEstado(3)}>
            <Text style={HistorialS.text_description}>En revisión</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={HistorialS.menu_modal_container_option1}
            onPress={() => fnfnBusquedaEstado(4)}>
            <Text style={HistorialS.text_description}>Descartados</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={visibleTiempo} onDismiss={hideModalTiempo}>
        <View style={HistorialS.menu_modal_container}>
          <TouchableOpacity
            style={HistorialS.menu_modal_container_option}
            onPress={() => filtrarPorTiempo(7)}>
            <Text style={HistorialS.text_description}>7 dias</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={HistorialS.menu_modal_container_option}
            onPress={() => filtrarPorTiempo(15)}>
            <Text style={HistorialS.text_description}>15 dias</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={HistorialS.menu_modal_container_option}
            onPress={() => filtrarPorTiempo(30)}>
            <Text style={HistorialS.text_description}>30 dias</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Historial;
