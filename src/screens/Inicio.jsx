import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressabl,
  BackHandler,Alert,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import { useIsFocused, useRoute } from "@react-navigation/native"; 
import {InicioS} from '../../shared/Estilos';
import Feather from 'react-native-vector-icons/Feather';
import Fontisto from 'react-native-vector-icons/Fontisto';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Divider, Badge, Modal, ProgressBar} from 'react-native-paper';
// import BannerSlider from '../Components/Slider';
// import axios from '../api/axios';

const Inicio = ({navigation}) => {

  const [visible, setVisible] = useState(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
  const focus = useIsFocused();
  const route = useRoute();

  const [proyectos, setProyectos] = useState([]);

  const [completados, setCompletados] = useState(0);
  const [enProceso, setEnProceso] = useState(0);
  const [enRevision, setEnRevision] = useState(0);
  const [descartados, setDescartados] = useState(0);
  
  const {
    nombreUsuario = 'Invitado',
    id_usuario = null,
    correo = '',
    nombreCompleto = 'Usuario de demostracion',
    rolUsuario = 'Invitado',
  } = route.params ?? {};

  /* Consulta con Axios desactivada temporalmente para la presentacion.
  const listarProyectos = async () => {
    await axios({
      method: 'get',
      url: 'listadoProyectos',
      data: null,
    })
      .then(async function (d) {
        let datos = d.data;
        // Inicializar contadores
        let completados = 0;
        let enProceso = 0;
        let enRevision = 0;
        let descartados = 0;
  
        // Recorrer los datos y contar por estado
        datos.forEach((proyecto) => {
          switch (proyecto.estado) {
            case 1:
              completados += 1;
              break;
            case 2:
              enProceso += 1;
              break;
            case 3:
              enRevision += 1;
              break;
            case 4:
              descartados += 1;
              break;
            default:
              break;
          }
        });
        // Actualizar los estados de React
        setCompletados(completados);
        setEnProceso(enProceso);
        setEnRevision(enRevision);
        setDescartados(descartados);
  
        setProyectos(datos); // Si quieres almacenar los proyectos también
      })
      .catch(function (error) {
        console.log(error);
        console.log('no entro');
      });
  };

  */

  const salirApp = () => {
    setVisible(false);
    Alert.alert("Espera !", "¿ Desea cerrar su sesión ?", [
      {
        text: "Cancelar",
        onPress: () => null,
        style: "cancel",
      },
      {
        text: "Salir",
        onPress: () => {
          navigation.navigate("Login");
        },
      },
    ]);
    return true;
  };

  useEffect(
    () => {
      if (!focus) return;
      const subscription = BackHandler.addEventListener("hardwareBackPress", salirApp);
      // listarProyectos();
      return () => subscription.remove();
    },
    [focus],
  );

  return (
    <View style={InicioS.container}>

      <View style={InicioS.container_head}>
        <View style={InicioS.container_head_div}>
          <View style={InicioS.container_menu_options_head}>
            <TouchableOpacity onPress={showModal}>
              <MaterialIcons name="menu" size={38} color={'#454545'} />
            </TouchableOpacity>
          </View>
          <View >
            <Image
              source={require('../../assets/tdh.jpg')}
              style={InicioS.size_image}
            />
          </View>
        </View>
      </View>

      <View style={InicioS.container_name_user}>
        <View style={InicioS.container_name_user_div}>
          <Text style={InicioS.text_color_general}>
            Hola, <Text style={InicioS.text_title_head}>{nombreUsuario} ☺️</Text>
          </Text>
        </View>
      </View>

      {/* Contenedor general del cuerpo de inicio */}
      <View style={InicioS.container_body}>
        <View style={InicioS.container_div}>
          <View style={InicioS.div_opciones}>
            <TouchableOpacity
              style={InicioS.div_opciones_campo}
              onPress={() => navigation.navigate('Cotizar')}>
              <Feather name="folder-plus" size={27} color={'#FF9103'} />
              <Text style={InicioS.text_color_general}>Cotizar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={InicioS.div_opciones_campo}
              onPress={() => navigation.navigate('Listado')}>
              {/* <Badge
                style={{
                  position: 'absolute',
                  left: 63,
                  bottom: 50,
                  backgroundColor: 'green',
                }}>
                2
              </Badge> */}
              <Feather name="clipboard" size={27} color={'#FF9103'} />
              <Text style={InicioS.text_color_general}>Listado</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={InicioS.div_opciones_campo}
              onPress={() => navigation.navigate('Reportes')}>
              <Fontisto name="bar-chart" size={27} color={'#FF9103'} />
              <Text style={InicioS.text_color_general}>Reportes</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={InicioS.div_opciones_campo}
              onPress={() => navigation.navigate('Historial')}>
              <MaterialIcons name="work-history" size={27} color={'#FF9103'} />
              <Text style={InicioS.text_color_general}>Historial</Text>
            </TouchableOpacity>
          </View>
        </View>
          
        <View style={InicioS.container_titles}>
          <View style={InicioS.container_div_menu_title}>
            <Text style={InicioS.text_title_head}>Panel</Text>
          </View>
        </View>

        {/* CONTENDOR DE INDICADORES DE APLICATIVO */}
        <View style={InicioS.container_div_menu}>
          <View style={InicioS.container_div_menu_category}>
            <View style={InicioS.container_div_menu_category_option}>
              <Text style={InicioS.text_color_general}>Completados</Text>
              <MaterialCommunityIcons
                name="archive-check"
                size={50}
                color={'#65B741'}
              />
              <View style={InicioS.container_div_menu_category_option_div}>
                <Text style={InicioS.text_color_general_indicator}>{completados}</Text>
              </View>
            </View>
            <View style={InicioS.container_div_menu_category_option}>
              <Text style={InicioS.text_color_general}>En proceso</Text>
              <MaterialCommunityIcons
                name="archive-sync"
                size={50}
                color={'#0F67B1'}
              />
              <View style={InicioS.container_div_menu_category_option_div}>
                <Text style={InicioS.text_color_general_indicator}>{enProceso}</Text>
              </View>
            </View>
            <View style={InicioS.container_div_menu_category_option}>
              <Text style={InicioS.text_color_general}>En revisión</Text>
              <MaterialCommunityIcons
                name="archive-clock"
                size={50}
                color={'#FFC436'}
              />
              <View style={InicioS.container_div_menu_category_option_div}>
                <Text style={InicioS.text_color_general_indicator}>{enRevision}</Text>
              </View>
            </View>
            <View style={InicioS.container_div_menu_category_option}>
              <Text style={InicioS.text_color_general}>Descartados</Text>
              <MaterialCommunityIcons
                name="archive-remove"
                size={50}
                color={'#FF6969'}
              />
              <View style={InicioS.container_div_menu_category_option_div}>
                <Text style={InicioS.text_color_general_indicator}>{descartados}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={InicioS.container_titles}>
          <View style={InicioS.container_div_menu_title}>
            <Text style={InicioS.text_title_head}>Proyectos </Text>
          </View>
        </View>

        {/* CONTENEDORES DEL MENU PRINCIPAL */}

        <View style={InicioS.container_div_menu_banner}>
          {/* <BannerSlider/> */}
          <Text style={InicioS.text_color_general}>Proximamente mas proyectos</Text>
        </View>

        <View style={{alignSelf:'center', marginTop:30}}>
          <Text style={InicioS.text_color_general}>
            www.Johanlcconstructora.com
          </Text>
        </View>


      </View>


      <Modal
        visible={visible}
        onDismiss={hideModal}
        contentContainerStyle={InicioS.menu_modal_container}
        >
          <View style={InicioS.menu_modal_container_option}>
            <Text style={InicioS.text_color_general} >Menu</Text>
          </View>
          <TouchableOpacity style={InicioS.menu_modal_container_option1}
          onPress={() => {
            setVisible(false);
            navigation.push("Perfil",{nombre:nombreCompleto,usuarioId:id_usuario,email:correo,rol:rolUsuario})
          } }
          >
          
          <Text style={InicioS.text_color_general}>Mi perfil</Text>
          </TouchableOpacity>
          <Divider/>
          <TouchableOpacity style={InicioS.menu_modal_container_option1} 
           onPress={() => 
            {
              setVisible(false);
              navigation.push("Login")
            }

           }
          >
          {/* <MaterialIcons name="exit-to-app" size={25} color={'#ffff'} /> */}
          <Text style={InicioS.text_color_general_modal_exit} >Salir</Text>
          </TouchableOpacity>
          
      </Modal>


    </View>
  );
};

export default Inicio;
