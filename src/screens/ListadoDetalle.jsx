import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from '../Api/axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ListadoDetalleS} from '../../Shared/Estilos';
import {
  Divider,
  TextInput,
  Badge,
  Modal,
  ActivityIndicator,
} from 'react-native-paper';

const ListadoDetalle = ({navigation, route}) => {
  const {
    proyectoId,
    proyectoNombre,
    proyectoT,
    proyectoCosto,
    proyectoAvance,
    proyectoEstado,
    proyectoInicio,
    proyectoFin,
    proyectoError,
    proyectoCoeficiente,
    proyectoCrossC,
    proyectoCrossT,
    proyectoTE,
    proyectoMateriales,
    proyectoEquipos,
    proyectoManodeobra,
    proyectoMaeT,
    proyectoCoefT
  } = route.params;

  const [tiempoProyecto, setTiempo] = useState(proyectoT);
  const [nombreProyecto, setnombreProyecto] = useState(proyectoNombre);
  const [costoProyecto, setCosto] = useState(proyectoCosto);
  const [avance, setAvance] = useState(proyectoAvance);
  // const [estado, setEstado] = useState(proyectoEstado);
  const [error, setError] = useState(proyectoError);
  const [coeficiente, setCoeficiente] = useState(proyectoCoeficiente);
  const [fechaInicio, setFechaInicio] = useState(proyectoInicio);
  const [fechaFin, setFechaFin] = useState(proyectoFin);
  const [visible, setVisible] = useState(false);
  const [busqueda, setBusqueda] = useState(proyectoEstado);

  const [errorT, setErrorT] = useState(proyectoMaeT);
  const [coeficienteT, setCoeficienteT] = useState(proyectoCoefT);


  const [manodeobra, setManodeObra] = useState(proyectoManodeobra);
  const [materiales, setMateriales] = useState(proyectoMateriales);
  const [equipos, setEquipos] = useState(proyectoEquipos);

  const [acceder, setAcceder] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    // setTiempo(proyectoT);
    // console.log(proyectoT);
    console.log(busqueda);
  }, []);

  const fnfnBusquedaEstado = texto => {
    if (texto === 1) {
      setBusqueda(1);
      setVisible(false);
    }
    if (texto === 2) {
      setBusqueda(2);
      setVisible(false);
    }
    if (texto === 3) {
      setBusqueda(3);
      setVisible(false);
    }
    if (texto === 4) {
      setBusqueda(4);
      setVisible(false);
    }
  };

  const fnEditarCotizacion = async () => {
    setAcceder(true);

    if (nombreProyecto != '' && costoProyecto != '') {
      var todayDate = new Date().toISOString().slice(0, 10);

      let registro = JSON.stringify({
        proyectoId: proyectoId,
        nombre: nombreProyecto,
        costo: costoProyecto,
        tiempo: tiempoProyecto,
        fecha_inicio: todayDate,
        fecha_fin: fechaFin,
        estado: busqueda,
        porcentaje: avance,
        manodeobra:manodeobra,
        equipos:equipos,
        materiales:materiales,

      });
      console.log("soy el registro"+registro);
      await axios({
        method: 'post',
        url: 'editarCotizacionProyecto',
        data: registro,
      })
        .then(async function (d) {
          let datos = d.data;
          console.log(datos);

          setTimeout(() => {
            setAcceder(false);

            ToastAndroid.showWithGravity(
              `${datos.message} !! `,
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            );
          }, 3000);
        })
        .catch(function (error) {
          setAcceder(false);

          console.log(error);
          ToastAndroid.showWithGravity(
            'Ocurrio un error, intentelo de nuevo !',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
          console.log('no entro aqui');
        });
    } else {
      setAcceder(false);
      ToastAndroid.showWithGravity(
        'Complete los campos por favor...',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
    }
  };

  return (
    <View style={ListadoDetalleS.container}>
      <View style={ListadoDetalleS.container_head}>
        <Text style={ListadoDetalleS.text_color_general}>Editar Proyecto</Text>
        <Text>
          <MaterialIcons name="badge" size={27} color={'#FF9103'} />
        </Text>
      </View>

      <View style={ListadoDetalleS.container_body}>
        <ScrollView
          showsVerticalScrollIndicator={true}
          style={ListadoDetalleS.container_body_inputs}>
          {/* <View> */}

          <TextInput
            label="Nombre proyecto"
            value={nombreProyecto}
            activeUnderlineColor="#FF9E14"
            style={ListadoDetalleS.container_body_inputs_general}
            // style={{borderRadius:10}}EEEDEB
            onChangeText={text => setnombreProyecto(text)}
          />
          <View style={ListadoDetalleS.container_divider}>
            <View style={ListadoDetalleS.container_divider_innput}>
              <TextInput
                label="Tiempo Previ. (meses)"
                value={tiempoProyecto.toString()}
                activeUnderlineColor="#FF9E14"
                style={ListadoDetalleS.container_body_inputs_general}
                // style={{borderRadius:10}}EEEDEB
                onChangeText={text => setTiempo(text)}
              />
            </View>
            <View style={ListadoDetalleS.container_divider_innput}>
              <TextInput
                label="Tiempo Estim. (meses)"
                value={proyectoTE}
                activeUnderlineColor="#FF9E14"
                style={ListadoDetalleS.container_body_inputs_general}
                disabled="true"
                // style={{borderRadius:10}}EEEDEB
                // onChangeText={text => setTiempo(text)}
              />
            </View>
          </View>

          {proyectoEstado != 3 ? (
            <View style={ListadoDetalleS.container_divider}>
              <View style={ListadoDetalleS.container_divider_innput}>
                <TextInput
                  label="Inicio Año/Mes/Dia"
                  value={fechaInicio}
                  activeUnderlineColor="#FF9E14"
                  style={ListadoDetalleS.container_body_inputs_general}
                  // disabled={true}
                  onChangeText={text => setFechaInicio(text)}
                />
              </View>
              <View style={ListadoDetalleS.container_divider_innput}>
                <TextInput
                  label="Fin  Año/Mes/Dia"
                  value={fechaFin}
                  activeUnderlineColor="#FF9E14"
                  // disabled={true}
                  style={ListadoDetalleS.container_body_inputs_general}
                  // style={{borderRadius:10}}EEEDEB
                  onChangeText={text => setFechaFin(text)}
                />
              </View>
            </View>
          ) : (
            <View style={ListadoDetalleS.container_divider}>
              <View style={ListadoDetalleS.container_divider_innput}>
                <TextInput
                  label="Error (MAE) C"
                  value={error.toString()}
                  activeUnderlineColor="#FF9E14"
                  style={ListadoDetalleS.container_body_inputs_general}
                  disabled={true}
                  keyboardType="numeric"
                  // style={{borderRadius:10}}EEEDEB
                  onChangeText={text => setFechaInicio(text)}
                />
              </View>
              <View style={ListadoDetalleS.container_divider_innput}>
                <TextInput
                  label="Coeficiente (R2) C"
                  value={coeficiente.toString()}
                  activeUnderlineColor="#FF9E14"
                  style={ListadoDetalleS.container_body_inputs_general}
                  disabled={true}
                  // style={{borderRadius:10}}EEEDEB
                  onChangeText={text => setFechaFin(text)}
                />
              </View>
            </View>
          )}
          {proyectoEstado == 3 ? (
            <View style={ListadoDetalleS.container_divider}>
              <View style={ListadoDetalleS.container_divider_innput}>
                <TextInput
                  label="Valid. Cruzada C"
                  value={proyectoCrossC}
                  activeUnderlineColor="#FF9E14"
                  style={ListadoDetalleS.container_body_inputs_general}
                  disabled={true}
                  // style={{borderRadius:10}}EEEDEB
                  onChangeText={text => setFechaInicio(text)}
                />
              </View>
              <View style={ListadoDetalleS.container_divider_innput}>
                <TextInput
                  label="Valid. Cruzada T"
                  value={proyectoCrossT}
                  activeUnderlineColor="#FF9E14"
                  style={ListadoDetalleS.container_body_inputs_general}
                  disabled={true}
                  // style={{borderRadius:10}}EEEDEB
                  onChangeText={text => setFechaFin(text)}
                />
              </View>
            </View>
          ) : (
            ''
          )}

          {proyectoEstado == 3 ? (
            <View style={ListadoDetalleS.container_divider}>
              <View style={ListadoDetalleS.container_divider_innput}>
                <TextInput
                  label="Error (MAE) T"
                  value={proyectoMaeT}
                  activeUnderlineColor="#FF9E14"
                  style={ListadoDetalleS.container_body_inputs_general}
                  disabled={true}
                  // style={{borderRadius:10}}EEEDEB
                  onChangeText={text => setFechaInicio(text)}
                />
              </View>
              <View style={ListadoDetalleS.container_divider_innput}>
                <TextInput
                  label="Coeficiente (R2) T"
                  value={proyectoCoefT}
                  activeUnderlineColor="#FF9E14"
                  style={ListadoDetalleS.container_body_inputs_general}
                  disabled={true}
                  // style={{borderRadius:10}}EEEDEB
                  onChangeText={text => setFechaFin(text)}
                />
              </View>
            </View>
          ) : (
            ''
          )}

          <View style={ListadoDetalleS.container_divider}>
            <View style={ListadoDetalleS.container_divider_innput}>
              <TextInput
                label="Materiales"
                value={materiales}
                activeUnderlineColor="#FF9E14"
                style={ListadoDetalleS.container_body_inputs_general}
                // style={{borderRadius:10}}EEEDEB
                onChangeText={text => setMateriales(text)}
              />
            </View>
            <View style={ListadoDetalleS.container_divider_innput}>
              <TextInput
                label="Equipos T"
                value={equipos}
                activeUnderlineColor="#FF9E14"
                style={ListadoDetalleS.container_body_inputs_general}
                // style={{borderRadius:10}}EEEDEB
                onChangeText={text => setEquipos(text)}
              />
            </View>
          </View>
          <View style={ListadoDetalleS.container_divider}>
            <View style={ListadoDetalleS.container_divider_innput}>
              <TextInput
                label="Costo Proyecto"
                value={costoProyecto}
                activeUnderlineColor="#FF9E14"
                style={ListadoDetalleS.container_body_inputs_general}
                // style={{borderRadius:10}}EEEDEB
                onChangeText={text => setCosto(text)}
              />
            </View>
            <View style={ListadoDetalleS.container_divider_innput}>
              <TextInput
                label="Mano de obra"
                value={manodeobra}
                activeUnderlineColor="#FF9E14"
                style={ListadoDetalleS.container_body_inputs_general}
                // style={{borderRadius:10}}EEEDEB
                onChangeText={text => setManodeObra(text)}
              />
            </View>
          </View>

          {proyectoEstado != 3 ? (
            <TextInput
              label="Avance %"
              value={avance.toString()}
              activeUnderlineColor="#FF9E14"
              style={ListadoDetalleS.container_body_inputs_general}
              // style={{borderRadius:10}}EEEDEB
              onChangeText={text => setAvance(text)}
            />
          ) : (
            ''
          )}
          <TouchableOpacity
            onPress={showModal}
            style={ListadoDetalleS.container_head_search}>
            <Text style={ListadoDetalleS.color_buttons}>
              {busqueda == 1
                ? 'Completado'
                : busqueda == 2
                ? 'En proceso'
                : busqueda == 3
                ? 'En revisión'
                : 'Descartado'}
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={25}
              color={'#61677A'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={ListadoDetalleS.container_btn_save}
            onPress={() => fnEditarCotizacion()}>
            {acceder ? (
              <ActivityIndicator animating={true} color={'white'} />
            ) : (
              <Text style={ListadoDetalleS.container_btn_save_text}>
                Editar
              </Text>
            )}
          </TouchableOpacity>

          <View style={ListadoDetalleS.container_divider_space}>
            <Text></Text>
          </View>
          <View style={ListadoDetalleS.container_divider_space}>
            <Text></Text>
          </View>
          <View style={ListadoDetalleS.container_divider_space}>
            <Text></Text>
          </View>

          {/* </View> */}
        </ScrollView>
      </View>

      <Modal visible={visible} onDismiss={hideModal}>
        <View style={ListadoDetalleS.menu_modal_container}>
          <TouchableOpacity
            style={ListadoDetalleS.menu_modal_container_option}
            onPress={() => fnfnBusquedaEstado(1)}>
            <Text style={ListadoDetalleS.text_description}>Completados</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ListadoDetalleS.menu_modal_container_option}
            onPress={() => fnfnBusquedaEstado(2)}>
            <Text style={ListadoDetalleS.text_description}>En proceso</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ListadoDetalleS.menu_modal_container_option}
            onPress={() => fnfnBusquedaEstado(3)}>
            <Text style={ListadoDetalleS.text_description}>En revisión</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ListadoDetalleS.menu_modal_container_option1}
            onPress={() => fnfnBusquedaEstado(4)}>
            <Text style={ListadoDetalleS.text_description}>Descartados</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default ListadoDetalle;
