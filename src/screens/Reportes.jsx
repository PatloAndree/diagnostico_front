import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
  ToastAndroid,
  Dimensions,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from '../Api/axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ReportesS} from '../../Shared/Estilos';
import {Snackbar, Modal, Divider, Badge, ProgressBar} from 'react-native-paper';

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const Reportes = ({navigation}) => {
  const [proyectos, setProyectos] = useState([]);

  const chartConfig = {
    backgroundGradientFrom: '#373A40',
    backgroundGradientFromOpacity: 1,
    backgroundGradientTo: '#16325B',
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) => `rgba(144, 144, 144, 0.5)`,
    labelColor: (opacity = 1) => `#F5F5F5`,
    strokeWidth: 1, // optional, default 3
    barPercentage: 0.5,
    stroke: '#ffa726',
    // useShadowColorFromDataset: false,
    fillShadowGradient: '#F5F7F8',
    fillShadowGradientOpacity: 1,
    formatYLabel: yValue => `${parseInt(yValue, 10)}`,
  };

  const [visible, setVisible] = useState(false);
  const [visibleShow, setVisibleShow] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const [busqueda, setBusqueda] = useState('Estado');
  const [busquedaId, setBusquedaId] = useState(0);

  const [visibleTiempo, setVisibleTiempo] = useState(false);
  const showModalTiempo = () => setVisibleTiempo(true);
  const hideModalTiempo = () => setVisibleTiempo(false);
  const [tiempoText, setTiempoText] = useState('Rango');
  const [tiempoGlobal, setTiempoGlobal] = useState(0);

  const onToggleSnackBar = () => setVisibleShow(!visibleShow);
  const onDismissSnackBar = () => setVisibleShow(false);

  const fnListarProyectos = async () => {
    await axios({
      method: 'get',
      url: 'listadoProyectos',
      data: null,
    })
      .then(async function (d) {
        let datos = d.data;
        // Filtrar por estado seleccionado si hay un estado
        if (busquedaId) {
          datos = datos.filter(proyecto => proyecto.estado === busquedaId);
        }
        // Filtro por rango de días (rango de tiempo es obligatorio)
        const todayDate = new Date(); // Fecha actual
        const fechaLimite = new Date(todayDate); // Copia de la fecha actual
        fechaLimite.setDate(fechaLimite.getDate() - tiempoGlobal); // Restar los días del filtro

        datos = datos.filter(proyecto => {
          const fechaProyecto = new Date(proyecto.created_at); // Asegúrate de que el campo de fecha exista
          return fechaProyecto >= fechaLimite; // Filtra los proyectos dentro del rango de días
        });
        // Actualizar la lista de proyectos filtrada
        setProyectos(datos);
      })
      .catch(function (error) {
        console.log(error);
        console.log('no entro');
      });
  };

  const fnfnBusquedaEstado = texto => {
    if (texto === 1) {
      setBusqueda('Completado');
      setVisible(false);
      setBusquedaId(1);
    }
    if (texto === 2) {
      setBusqueda('En proceso');
      setVisible(false);
      setBusquedaId(2);
    }
    if (texto === 3) {
      setBusqueda('Revisión');
      setVisible(false);
      setBusquedaId(3);
    }
    if (texto === 4) {
      setBusqueda('Descartado');
      setVisible(false);
      setBusquedaId(4);
    }
  };

  const tiempoRango = texto => {
    setVisibleTiempo(false);
    setTiempoGlobal(texto);
    setTiempoText(texto + ' ' + 'dias');
  };

  useEffect(() => {}, []);

  const filteredData = proyectos.filter(item => item.estado === busquedaId);

  const processData = data => {
    // Agrupar datos por fecha completa (día, mes, año)
    const groupedData = data.reduce((acc, item) => {
      const {created_at} = item;
      const date = new Date(created_at);
      const isoDate = date.toISOString().split('T')[0]; // Obtener la fecha en formato ISO (aaaa-mm-dd)

      if (!acc[isoDate]) {
        acc[isoDate] = 1; // Solo uno por estado ya que estamos filtrando por estado
      } else {
        acc[isoDate] += 1;
      }
      return acc;
    }, {});

    // Ordenar las fechas en forma ascendente
    const sortedDates = Object.keys(groupedData).sort(
      (a, b) => new Date(a) - new Date(b),
    );

    // Convertir las fechas a formato día/mes/año después de ordenar
    const labels = sortedDates.map(date => {
      const parsedDate = new Date(date);
      const day = parsedDate.getDate().toString(); // Día con dos dígitos
      const month = (parsedDate.getMonth() + 1).toString(); // Mes con dos dígitos
      const year = parsedDate.getFullYear().toString().slice(-2);
      return `${day}/${month}/${year}`; // Formato día/mes/año
    });

    const dataset = {
      data: sortedDates.map(date => groupedData[date]), // Mantener los datos correspondientes
    };

    return {labels, datasets: [dataset]};
  };

  const {labels, datasets} = processData(filteredData);

  return (
    <View style={ReportesS.container}>
      <View style={ReportesS.container_head}>
        <TouchableOpacity
          onPress={showModal}
          style={ReportesS.container_head_search}>
          <Text style={ReportesS.color_buttons}>{busqueda}</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={25}
            color={'#61677A'}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={showModalTiempo}
          style={ReportesS.container_head_time}>
          <Text style={ReportesS.color_buttons}>{tiempoText}</Text>
          <MaterialIcons
            name="keyboard-arrow-down"
            size={25}
            color={'#61677A'}
          />
        </TouchableOpacity>

        <View style={ReportesS.container_head_options}>
          <TouchableOpacity onPress={() => fnListarProyectos()}>
            <MaterialIcons name="search" size={30} color={'#FF9E14'} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={ReportesS.container_body}>
        {/* <ScrollView> */}
        {proyectos != '' && proyectos != null ? (
          <View>
            <View style={{flexDirection: 'row'}}>
              <Badge
                style={{
                  // position: 'absolute',
                  // left: 63,
                  bottom: 10,
                  backgroundColor: '#26355D',
                }}>
                CANTIDAD DE PROYECTOS
              </Badge>
            </View>
            <BarChart
              data={{
                labels,
                datasets,
              }}
              width={350}
              height={300}
              fromZero={true}
              style={{borderRadius: 5}}
              yAxisLabel="N° "
              xAxisLabel=""
              chartConfig={chartConfig}
              verticalLabelRotation={50}
              // fromZero={true}
            />

            <View style={{marginBottom: 20}}></View>

            <View style={{flexDirection: 'row', justifyContent: 'center'}}>
              <Badge
                style={{
                  // position: 'absolute',
                  // left: 63,
                  // bottom: 50,
                  backgroundColor: '#26355D',
                }}>
                FECHA - DIAS
              </Badge>
            </View>
          </View>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <Text style={ReportesS.text_bolder}>
              Selecciona estado y rango de fecha
            </Text>
            <MaterialIcons
              name="insert-chart-outlined"
              size={20}
              color={'#FF9103'}
            />
          </View>
        )}

        <Divider />

        {/* </ScrollView> */}
      </View>

      <Modal visible={visible} onDismiss={hideModal}>
        <View style={ReportesS.menu_modal_container}>
          <TouchableOpacity
            style={ReportesS.menu_modal_container_option}
            onPress={() => fnfnBusquedaEstado(1)}>
            <Text style={ReportesS.text_description}>Completados</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ReportesS.menu_modal_container_option}
            onPress={() => fnfnBusquedaEstado(2)}>
            <Text style={ReportesS.text_description}>En proceso</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ReportesS.menu_modal_container_option}
            onPress={() => fnfnBusquedaEstado(3)}>
            <Text style={ReportesS.text_description}>En revisión</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ReportesS.menu_modal_container_option1}
            onPress={() => fnfnBusquedaEstado(4)}>
            <Text style={ReportesS.text_description}>Descartados</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal visible={visibleTiempo} onDismiss={hideModalTiempo}>
        <View style={ReportesS.menu_modal_container}>
          <TouchableOpacity
            style={ReportesS.menu_modal_container_option}
            onPress={() => tiempoRango(7)}>
            <Text style={ReportesS.text_description}>7 dias</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ReportesS.menu_modal_container_option}
            onPress={() => tiempoRango(15)}>
            <Text style={ReportesS.text_description}>15 dias</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={ReportesS.menu_modal_container_option}
            onPress={() => tiempoRango(30)}>
            <Text style={ReportesS.text_description}>30 dias</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Snackbar
        visible={visibleShow}
        onDismiss={onDismissSnackBar}
        duration={1000}
        action={{
          label: 'Undo',
          onPress: () => {
            // Do something
          },
        }}>
        Hey there! I'm a Snackbar.
      </Snackbar>
    </View>
  );
};

export default Reportes;
