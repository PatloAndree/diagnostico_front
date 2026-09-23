import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Pressable,
  Image,
  ToastAndroid,
  BackHandler,
  Alert,
} from 'react-native';

import React, {useState, useEffect} from 'react';
import {ActivityIndicator} from 'react-native-paper';
import {LoginS} from '../../shared/Estilos';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import {useIsFocused} from '@react-navigation/native';
// import axios from '../api/axios';

const Login = ({navigation}) => {

  const [miusuario, setUsuario] = useState('JuanCarlos@gmail.com');
  const [password, setPass] = useState('12345678');
  const [isFocused, setIsFocused] = useState(false);
  const [isFocusedPassword, setIsFocusedPassword] = useState(false);
  
  const [acceder, setAcceder] = useState(false);
  const focus = useIsFocused();

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleFocusPassword = () => {
    setIsFocusedPassword(true);
  };

  const handleBlurPassword = () => {
    setIsFocusedPassword(false);
  };

  const fnValidarLogin = () => {
    navigation.navigate('Inicio', {
      nombreUsuario: 'Invitado',
      nombreCompleto: 'Usuario de demostracion',
      id_usuario: null,
      correo: miusuario,
      rolUsuario: 'Invitado',
    });
  };

  /* Login con API desactivado temporalmente para la presentacion.
  const fnValidarLoginConApi = async () => {
    setAcceder(true);
    if (miusuario.trim() == '' && password.trim() == '') {
      ToastAndroid.showWithGravity(
        'Ingresar usuario y contraseña',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      setAcceder(false);
    } else if (miusuario.trim() == '') {
      ToastAndroid.showWithGravity(
        'Ingresar usuario',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      setAcceder(false);
    } else if (password.trim() == '') {
      ToastAndroid.showWithGravity(
        'Ingresar contraseña',
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
      );
      setAcceder(false);
    }
    else {
      let datas = JSON.stringify({
        email: miusuario,
        password: password,
      });
      await axios({
        method: 'post',
        url: 'login',
        data: datas,
      })
      .then(async function (response) {
        if (response && response.data) {
          const datos = response.data;
          // Verifica el estado de la respuesta
          if (datos.status === 0) {
            ToastAndroid.showWithGravity(
              'Error, intentelo de nuevo',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            );
            setAcceder(false);
            console.log('No se pudo iniciar sesión');
          } else if (datos.status === 1) {
            // El login fue exitoso
            console.log(datos);
            setTimeout(() => {
              navigation.push('Inicio', {
                nombreUsuario: datos.user.name ? datos.user.name.split(' ')[0] : "Sin nombre",
                nombreCompleto: datos.user.name,
                id_usuario: datos.user.id,
                correo: datos.user.email,
                rolUsuario: datos.user.rol,
              });
              ToastAndroid.showWithGravity(
                'Bienvenido!',
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
              );
            }, 1000);
            console.log('Inicio de sesión exitoso');
          } else {
            // Maneja otros casos si es necesario
            ToastAndroid.showWithGravity(
              'Error desconocido',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
            );
            setAcceder(false);
            console.log('No se pudo iniciar sesión (Error desconocido)');
          }
        } else {
          ToastAndroid.showWithGravity(
            'Error de conexión!',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
          );
          console.log('No se pudo iniciar sesión (Sin datos)');
        }
      })
      .catch(function (error) {
        console.log(error);
        setAcceder(false);
        ToastAndroid.showWithGravity(
          'Problema de red, intentelo de nuevo...',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
        );
      });
    }
  };

  */

  const [passwordVisibility, setPasswordVisibility] = useState(true);
  const [rightIcon, setRightIcon] = useState('eye');
  const handlePasswordVisibility = () => {
    if (rightIcon === 'eye') {
      setRightIcon('eye-off');
      setPasswordVisibility(!passwordVisibility);
    } else if (rightIcon === 'eye-off') {
      setRightIcon('eye');
      setPasswordVisibility(!passwordVisibility);
    }
  };

  const exitToApp = () => {
    BackHandler.exitApp();  // Exits the app
    return true;  // Required to prevent the default behavior (going back to the previous screen)
  };
  // };

  useEffect(() => {
    if (focus == true) {
      setAcceder(false);
      // setUsuario('');
      // setPass('');
    }
  }, [focus]);

  useEffect(
    () => {
      if (!focus) return;
      const subscription = BackHandler.addEventListener("hardwareBackPress", exitToApp);
      return () => subscription.remove();
    },

    [focus],
  );

  return (
    passwordVisibility,
    rightIcon,
    handlePasswordVisibility,
    (
    <View style={LoginS.container}>
      <View style={LoginS.container_fondo}>
        <Image
          source={require('../../assets/tdh.jpg')}
          resizeMode="cover"
          style={LoginS.imagen_fondo}
        />
        <View style={LoginS.container_div}>
          <View style={LoginS.container_div_head}>
            {/* <Text style={{fontWeight: '800', color: 'white', fontSize: 40}}>
              Cotiza APP
            </Text> */}
            {/* <Image
              source={require('../../Assets/logo.png')}
              style={LoginS.size_image}
            /> */}
            <Text>
                APP DIAGNOSTICO TDH
            </Text>
          </View>

          <View style={LoginS.container_div_body}>
            <View style={LoginS.container_div_inputs}>
              <View
                style={[
                  LoginS.container_div_inputs_campos,
                  {
                    borderColor: isFocused ? '#FFB32E' : '#ffff',
                    borderWidth: 1, 
                    shadowColor: isFocused ? '#FFCD50' : '#000', // Shadow color can be conditional
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: isFocused ? 2 : 0.05, // Shadow opacity can be conditional
                    shadowRadius: 2.84,
                    elevation: isFocused ? 15 : 0, // Elevation can also be conditional

                    },
                ]}>
                <Text>
                  <Feather name="user" size={23} color={'#FF9E14'} />
                </Text>
                <TextInput
                  placeholder="Correo electronico"
                  style={[LoginS.Texto_color_inputs]}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onChangeText={value => {
                    setUsuario(value);
                  }}
                  defaultValue={miusuario}
                  placeholderTextColor="#7D7C7C"></TextInput>
                  <Text>
                    <Feather name="user" size={23} color={'rgba(246,246,246,1)'} />
                  </Text>
              </View>
            </View>
            <View style={LoginS.container_div_inputs}>
              <View
                style={[
                  LoginS.container_div_inputs_campos,
                  {borderColor: isFocusedPassword ? '#FFB32E' : '#ffff',
                    borderWidth: 1, 
                    shadowColor: isFocusedPassword ? '#FFCD50' : '#000', // Shadow color can be conditional
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: isFocusedPassword ? 2 : 0.05, // Shadow opacity can be conditional
                    shadowRadius: 2.84,
                    elevation: isFocusedPassword ? 15 : 0, // Elevation can also be conditional
                  },
                ]}>
                <Feather name="lock" size={23} color={'#FF9E14'} />
                <TextInput
                  placeholder="Contraseña"
                  secureTextEntry={passwordVisibility}
                  style={LoginS.Texto_color_inputs}
                  onFocus={handleFocusPassword}
                  onBlur={handleBlurPassword}
                  onChangeText={value => {
                    setPass(value);
                  }}
                  defaultValue={password}
                  placeholderTextColor="#7D7C7C"></TextInput>
                  <Pressable onPress={handlePasswordVisibility}>
                    <Feather name={rightIcon} size={23} color={'#FF9E14'} />
                  </Pressable>

              </View>
            </View>
          </View>

          <View style={LoginS.container_div_footer}>
            <TouchableOpacity
              style={LoginS.container_div_boton_boton}
              // onPress={() => navigation.navigate('Inicio')}
              onPress={fnValidarLogin}>
              {acceder ? (
                <ActivityIndicator animating={true} color={'white'} />
              ) : (
                <Text style={{color: 'white', fontSize: 17}}>Ingresar</Text>
              )}
            </TouchableOpacity>
            {/* <View style={LoginS.container_div_inputs_campos}>
              </View> */}
          </View>
        </View>
        <View style={LoginS.container_web}>
          {/* <Text style={{color:'#021526', fontWeight:'600'}}>
                Búscanos como:
            </Text> */}
          <Text style={{color: '#ffff', fontSize: 15, fontWeight: '600'}}>
            www.Johanlcconstructora.com
          </Text>
        </View>
      </View>
    </View>
    )
  );
};

export default Login;
