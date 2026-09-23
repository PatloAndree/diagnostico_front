import {
  View,
  Text,
  TouchableOpacity,
  Pressable,
  Image,
  ImageBackground,
  ToastAndroid,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from '../Api/axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {PerfilS} from '../../Shared/Estilos';
import {useIsFocused, useRoute} from '@react-navigation/native';
import {
  Divider,
  RadioButton,
  Modal,
  ActivityIndicator,
  TextInput,
} from 'react-native-paper';

const Perfil = ({navigation}) => {
  const route = useRoute();
  const {nombre, usuarioId, email, rol} = route.params;
  const [acceder, setAcceder] = useState(false);
  const [accederNuevo, setAccederNuevo] = useState(false);
  const [nombreUsuario, setnombreUsuario] = useState(nombre);
  const [correo, setCorreo] = useState(email);
  const [idUsuario, setIdUsuario] = useState(usuarioId);
  const [contrasena, setContrasena] = useState('');

  const [nombreUsuarioNuevo, setnombreUsuarioNuevo] = useState('');
  const [correoNuevo, setCorreNuevo] = useState('');
  const [contrasenaNuevo, setContrasenaNuevo] = useState('');
  const [checked, setChecked] = useState(1);

  const [visible, setVisible] = useState(false);
  const [visibleNuevo, setVisibleNuevo] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  const fnfnBusquedaEstado = () => {
    setVisible(false);
  };

  const fnEditarUsuario = async () => {
    setAcceder(true);
    if (nombreUsuario != '' && correo != '') {
      let registro = JSON.stringify({
        userId: idUsuario,
        nombre: nombreUsuario,
        correo: correo,
        password: contrasena,
      });
      console.log(registro);
      await axios({
        method: 'post',
        url: 'editaUsuario', // Asegúrate de que la URL sea la correcta
        data: registro, // Los datos que estás enviando al servidor
      })
        .then(async function (d) {
          let datos = d.data;
          console.log(datos);

          // Verificar si el status de la respuesta es exitoso
          if (datos.status === 1) {
            // Si el status es exitoso, muestra el mensaje del servidor
            setTimeout(() => {
              setAcceder(false);
              ToastAndroid.showWithGravity(
                `${datos.msg} !!`, // Aquí usas el mensaje que envías desde el servidor
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
              );
            }, 3000);
          } else {
            // Si el status no es 1, significa que algo falló
            setAcceder(false);
            ToastAndroid.showWithGravity(
              `Error: ${datos.msg} !!`, // Aquí puedes mostrar el mensaje de error
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            );
          }
        })
        .catch(function (error) {
          setAcceder(false);
          console.log(error);

          // Si hay un error de red u otro tipo de error en la solicitud
          ToastAndroid.showWithGravity(
            'Ocurrió un error, inténtelo de nuevo !',
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

  const fnCrearUsuario = async () => {
    setAccederNuevo(true);
    if (nombreUsuarioNuevo != '' && correoNuevo != '' && contrasenaNuevo != '') {
      let registro = JSON.stringify({
        nombre: nombreUsuarioNuevo,
        correo: correoNuevo,
        password: contrasenaNuevo,
        rol: checked,
      });
      console.log(registro);
      await axios({
        method: 'post',
        url: 'crearUsuario', // Asegúrate de que la URL sea la correcta
        data: registro, // Los datos que estás enviando al servidor
      })
        .then(async function (d) {
          let datos = d.data;
          console.log(datos);
          // Verificar si el status de la respuesta es exitoso
          if (datos.status === 1) {
            // Si el status es exitoso, muestra el mensaje del servidor
            setTimeout(() => {
              setAccederNuevo(false);
              setVisible(false);
              ToastAndroid.showWithGravity(
                `${datos.msg} !!`, // Aquí usas el mensaje que envías desde el servidor
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
              );
              setnombreUsuarioNuevo('');
              setCorreNuevo('');
              setContrasenaNuevo('');
              setChecked(1);
            }, 3000);

          } else {
            // Si el status no es 1, significa que algo falló
            setAccederNuevo(false);
            ToastAndroid.showWithGravity(
              `Error: ${datos.msg} !!`, // Aquí puedes mostrar el mensaje de error
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            );
          }
        })
        .catch(function (error) {
          setAccederNuevo(false);
          console.log(error);

          // Si hay un error de red u otro tipo de error en la solicitud
          ToastAndroid.showWithGravity(
            'Ocurrió un error, inténtelo de nuevo !',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
          console.log('no entro aqui');
        });
    } else {
      setAccederNuevo(false);
      ToastAndroid.showWithGravity(
        'Complete los campos por favor...',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
    }
  };

  useEffect(() => {
    // console.log(email,rol);
  }, []);

  return (
    <View style={PerfilS.container}>
      {rol == 1 ? (
        <View style={PerfilS.container_head}>
          {/* <Image
            source={require('../../Assets/user.jpg')}
            style={PerfilS.size_image}
          /> */}
          <TouchableOpacity
            style={PerfilS.container_head_icon}
            onPress={showModal}>
            <MaterialIcons name="add-box" size={22} color={'#ffff'} />
            <Text style={PerfilS.container_btn_save_text}>Usuario</Text>
          </TouchableOpacity>
        </View>
      ) : (
        ''
      )}

      <View style={PerfilS.container_body}>
        {/* <Pressable style={PerfilS.container_head_icon}>
          <MaterialIcons name="camera-alt" size={22} color={'#ffff'} />
        </Pressable> */}

        <View style={PerfilS.container_body_center}>
          <TextInput
            label="Nombres Completos"
            value={nombreUsuario}
            activeUnderlineColor="#FF9E14"
            style={{
              backgroundColor: '#F7F7F8',
              borderColor: '#C7C8CC',
              borderWidth: 1,
            }}
            onChangeText={text => setnombreUsuario(text)}
          />
          <TextInput
            label="Correo"
            value={correo}
            activeUnderlineColor="#FF9E14"
            style={{
              backgroundColor: '#F7F7F8',
              borderColor: '#C7C8CC',
              borderWidth: 1,
            }}
            onChangeText={text => setCorreo(text)}
          />
          <TextInput
            label="Cambiar contraseña"
            value={contrasena}
            activeUnderlineColor="#FF9E14"
            placeholder=""
            style={{
              backgroundColor: '#F7F7F8',
              borderColor: '#C7C8CC',
              borderWidth: 1,
            }}
            // style={{borderRadius:10}}EEEDEB
            onChangeText={text => setContrasena(text)}
          />

          <TouchableOpacity
            style={PerfilS.container_btn_save}
            onPress={() => fnEditarUsuario()}>
            {acceder ? (
              <ActivityIndicator animating={true} color={'white'} />
            ) : (
              <Text style={PerfilS.container_btn_save_text}>Editar</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Modal visible={visible} onDismiss={hideModal}>
        <View style={PerfilS.menu_modal_container}>
          <Text style={PerfilS.text_description}>Crear nuevo usuario</Text>

          <TextInput
            label="Nombres completos"
            value={nombreUsuarioNuevo}
            activeUnderlineColor="#FF9E14"
            style={{
              backgroundColor: '#F7F7F8',
              borderColor: '#C7C8CC',
              borderWidth: 1,
            }}
            onChangeText={text => setnombreUsuarioNuevo(text)}
          />

          <TextInput
            label="Correo"
            value={correoNuevo}
            activeUnderlineColor="#FF9E14"
            style={{
              backgroundColor: '#F7F7F8',
              borderColor: '#C7C8CC',
              borderWidth: 1,
            }}
            onChangeText={text => setCorreNuevo(text)}
          />
          <TextInput
            label="Contraseña"
            value={contrasenaNuevo}
            activeUnderlineColor="#FF9E14"
            style={{
              backgroundColor: '#F7F7F8',
              borderColor: '#C7C8CC',
              borderWidth: 1,
            }}
            onChangeText={text => setContrasenaNuevo(text)}
          />

          <View style={PerfilS.menu_modal_container_option}>
            <View style={PerfilS.menu_modal_container_option2}>
              <Text>Admin</Text>
              <RadioButton
                value="1"
                color='#FF9E14'
                status={checked === 1 ? 'checked' : 'unchecked'}
                onPress={() => setChecked(1)}
              />
            </View>

            <View style={PerfilS.menu_modal_container_option2}>
              <Text>Usuario</Text>

              <RadioButton
                value="2"
                color='#FF9E14'
                status={checked === 2 ? 'checked' : 'unchecked'}
                onPress={() => setChecked(2)}
              />
            </View>
          </View>

          <TouchableOpacity style={PerfilS.menu_modal_container_option1}
           onPress={() => fnCrearUsuario()}
          >
            {accederNuevo ? (
              <ActivityIndicator animating={true} color={'white'} />
            ) : (
              <Text style={PerfilS.container_btn_save_text}>Guardar</Text>
            )}

          </TouchableOpacity>
        </View>
      </Modal>

    </View>
  );
};

export default Perfil;
