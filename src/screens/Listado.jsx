import {
  View,
  Text,
  ScrollView,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import axios from '../Api/axios';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ListadoS} from '../../Shared/Estilos';
import {Divider, Badge, List, ProgressBar} from 'react-native-paper';
import {useIsFocused, useRoute} from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const Listado = ({navigation}) => {
  const [proyectos, setProyectos] = useState([]);

  const listarProyectos = async () => {
    await axios({
      method: 'get',
      url: 'listadoProyectosPorId',
      data: null,
    })
      .then(async function (d) {
        let datos = d.data;
        // console.log(datos);
        setProyectos(datos);
      })
      .catch(function (error) {
        console.log(error);
        console.log('no entro');
      });
  };

  const focus = useIsFocused();

  useEffect(() => {
    if (focus == true) {
      listarProyectos();
    }
  }, [focus]);

  return (
    <View style={ListadoS.container}>
      <View style={ListadoS.container_count}>
        <View style={ListadoS.container_count_body}>
          <Text style={ListadoS.container_count_text}>
            {proyectos.length} proyectos
          </Text>
        </View>
      </View>
      <View style={ListadoS.container_body}>
        <ScrollView>
          <List.AccordionGroup>
            {proyectos.map((proyecto, index) => (
              <List.Accordion
                key={index}
                title={
                  <Text>
                    {proyecto.estado == 3 ? (
                      <FontAwesome
                        name="dot-circle-o"
                        size={23}
                        color={'#FFC435'}
                      />
                    ) : (
                      <FontAwesome
                        name="dot-circle-o"
                        size={23}
                        color={'#1567B1'}
                      />
                    )}
                    <Text> {proyecto.nombre}</Text>
                    <Text>
                      {' -  '}
                      {proyecto.tipo === 1
                        ? 'Random'
                        : proyecto.tipo === 2
                        ? 'ETR'
                        : 'Regresión L.'}
                    </Text>
                  </Text>
                }
                id={index.toString()}
                rippleColor={'rgba(243, 102, 5, 0.10)'}
                // titleStyle={{ color: '#686D76' }}
                // descriptionStyle={{ color: '#F3D0D7' }}
                // description='hola'
                style={{
                  backgroundColor: '#F7F7F8',
                  marginBottom: 5,
                  borderRadius: 3,
                  borderWidth: 0.4,
                  borderColor: '#C7C8CC',
                }}>
                <View style={ListadoS.accordion}>
                  <View style={ListadoS.accordion_div}>
                    <View style={ListadoS.accordion_group_left}>
                      <Text style={ListadoS.text_description}>Nombre :</Text>

                      <Text style={ListadoS.text_description}>
                        Duración E :
                      </Text>
                      <Text style={ListadoS.text_description}>Costo E :</Text>

                      <Text style={ListadoS.text_description}>
                        {proyecto.estado != 3
                          ? `Avance (${proyecto.porcentaje}%) :`
                          : `Error (MAE) : `}
                      </Text>

                      <Text style={ListadoS.text_description}>
                        {proyecto.estado != 3
                          ? `Fecha inicio :`
                          : `Coeficiente R2 : `}
                      </Text>
                      {proyecto.estado != 3 ? (
                        <Text style={ListadoS.text_description}>
                          Fecha final:
                        </Text>
                      ) : (
                        ``
                      )}
                      <Text style={ListadoS.text_description}>Estado :</Text>
                    </View>
                    <View style={ListadoS.accordion_group_right}>
                      <Text style={ListadoS.text_bolder}>
                        {proyecto.nombre}
                      </Text>
                      <Text style={ListadoS.text_bolder}>
                        {proyecto.tiempoestimado} meses
                      </Text>
                      <Text style={ListadoS.text_bolder}>
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
                        <Text style={ListadoS.text_bolder}>
                          {' '}
                          {proyecto.errorabsmedio} %
                        </Text>
                      )}

                      <Text style={ListadoS.text_bolder}>
                        {proyecto.estado != 3
                          ? `${proyecto.fecha_inicio}`
                          : `${proyecto.coeficientedeter} %`}
                      </Text>
                      {proyecto.estado != 3 ? (
                        <Text style={ListadoS.text_bolder}>
                          {proyecto.fecha_fin}
                        </Text>
                      ) : (
                        ``
                      )}
                      <Text style={ListadoS.text_bolder}>
                        {proyecto.estado == 1 ? (
                          <Text
                            style={[ListadoS.text_bolder, {color: '#387F39'}]}>
                            Completado
                          </Text>
                        ) : proyecto.estado == 2 ? (
                          <Text
                            style={[ListadoS.text_bolder, {color: '#0F67B1'}]}>
                            En Proceso
                          </Text>
                        ) : proyecto.estado == 3 ? (
                          <Text
                            style={[ListadoS.text_bolder, {color: '#F57D1F'}]}>
                            En Revisión
                          </Text>
                        ) : (
                          <Text
                            style={[ListadoS.text_bolder, {color: '#FF4C4C'}]}>
                            Descartado
                          </Text>
                        )}
                      </Text>
                    </View>
                  </View>
                  <View style={ListadoS.accordion_footer}>
                    <TouchableOpacity
                      style={ListadoS.accordion_footer_button}
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

                          proyectoMaeT: proyecto.errorabsmedioT,
                          proyectoCoefT: proyecto.coefidetermT,

                        })
                      }>
                      <Text style={ListadoS.text_description}>Ver más</Text>
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
      </View>
    </View>
  );
};

export default Listado;
