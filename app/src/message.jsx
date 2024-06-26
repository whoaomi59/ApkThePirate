import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import tw from "twrnc";
import { Header } from "react-native/Libraries/NewAppScreen";
import Navbar from "@/components/navigation/navbar";

const apiUrl = "https://smsanonymos.000webhostapp.com/serve.php/messages";

export default function Messague() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [response, setResponse] = useState(null);

  const Link = ({ url, children }) => {
    return (
      <TouchableOpacity onPress={() => Linking.openURL(url)}>
        <Text>{children}</Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const fetchMessages = () => {
      axios
        .get(apiUrl)
        .then((response) => {
          setMessages(response.data);
        })
        .catch((error) => {
          console.error("Error al obtener los mensajes:", error);
        });
    };

    fetchMessages();
    const intervalId = setInterval(fetchMessages, 7000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (response) {
      setInput(response + "  " + ":" + "  ");
    }
  }, [response]);

  const handleChange = (text) => {
    setInput(text);
  };

  const handleImagePicker = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri); // Establecer la URI de la imagen seleccionada
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("text", input);
    formData.append("user_id", 2); // No es necesario convertir a entero
    // Agregar la imagen solo si está seleccionada
    if (image) {
      let localUri = image;
      let filename = localUri.split("/").pop();

      // Inferir el tipo de archivo
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      formData.append("img", { uri: localUri, name: filename, type });
    }

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setMessages([...messages, response.data]);
      setInput("");
      setImage(null);
      Alert.alert("Éxito", "Mensaje enviado");
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
      Alert.alert("Error", "Error al enviar el mensaje");
    }
  };

  const Validate = ({ data }) => {
    if (data.user_id == 2) {
      return (
        <View style={tw`flex-row items-start mb-4 bg-blue-400 p-2 rounded-2xl`}>
          <Image
            source={{ uri: data.img }}
            style={tw`w-10 h-10 rounded-full mr-3`}
          />
          <View>
            <Text style={tw`text-sm font-semibold text-blue-900`}>
              {data.name}
            </Text>
            {data.imgmensage ? (
              <Image
                source={{
                  uri:
                    "https://smsanonymos.000webhostapp.com/" + data.imgmensage,
                }}
                style={tw`w-36 h-36 rounded mt-2`}
              />
            ) : (
              <Text style={tw`mt-1`}>{data.text}</Text>
            )}
            <Text style={tw`text-xs text-blue-900 mt-1`}>{data.timestamp}</Text>
          </View>
        </View>
      );
    } else {
      return (
        <View style={tw`flex-row items-start mb-4 bg-blue-200 p-2 rounded-2xl`}>
          <Image
            source={{ uri: data.img }}
            style={tw`w-10 h-10 rounded-full mr-3`}
          />
          <View>
            <Text style={tw`text-sm font-semibold text-blue-900`}>
              {data.name}
            </Text>
            {data.imgmensage ? (
              <View>
                <Image
                  source={{
                    uri:
                      "https://smsanonymos.000webhostapp.com/" +
                      data.imgmensage,
                  }}
                  style={tw`w-36 h-36 rounded mt-2`}
                />
                <Link
                  url={`https://smsanonymos.000webhostapp.com/${data.imgmensage}`}
                >
                  Descargar
                </Link>
              </View>
            ) : (
              <Text style={tw`mt-1`}>{data.text}</Text>
            )}
            <TouchableOpacity
              onPress={() => setResponse(data.text)}
              style={tw`mt-2`}
            >
              <Text style={tw`text-blue-900`}>Responder</Text>
            </TouchableOpacity>
            <Text style={tw`text-xs text-blue-600 mt-1`}>{data.timestamp}</Text>
          </View>
        </View>
      );
    }
  };

  return (
    <View style={tw`flex-1`}>
      <Navbar />
      <FlatList
        data={messages}
        renderItem={({ item }) => <Validate data={item} />}
        keyExtractor={(item, index) => index.toString()}
      />
      <View style={tw`flex-row items-center mt-4`}>
        <TextInput
          style={tw`border border-gray-300 p-2 flex-1 rounded`}
          value={input}
          onChangeText={handleChange}
          placeholder="Escribe tu mensaje"
        />
        <Button title="Enviar" onPress={handleSubmit} />
      </View>
      <View style={tw`flex-row items-center mt-4`}>
        <TouchableOpacity
          onPress={handleImagePicker}
          style={tw`border border-gray-300 p-2 rounded mr-2`}
        >
          <Text style={tw`text-blue-400`}>Seleccionar imagen</Text>
        </TouchableOpacity>
        {image && (
          <Image source={{ uri: image }} style={tw`w-36 h-36 rounded mr-2`} />
        )}
      </View>
    </View>
  );
}
