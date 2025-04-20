// import React, { useState, useEffect } from "react";
// import { View, StyleSheet, Dimensions } from "react-native";
// import { useIsFocused, useRoute } from "@react-navigation/native";
// import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
// import * as Location from "expo-location";
// import { flashMessage } from "../lottie/flashMessage";

// const Map = ({ markers = [], missingBank }) => {
//   const route = useRoute();
//   const focused = useIsFocused();

//   const [data, setData] = useState([]);
//   const [location, setLocation] = useState(null);
//   const [nearbyPins, setNearbyPins] = useState([]);

//   useEffect(() => {
//     setData(markers);

//     async function getLocation() {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         flashMessage("Permission to access location was denied", "danger");
//         return;
//       }
//       const loc = await Location.getCurrentPositionAsync({});
//       const { latitude, longitude } = loc.coords;
//       setLocation({
//         latitude,
//         longitude,
//         latitudeDelta: 0.03,
//         longitudeDelta: 0.04,
//       });

//       // generate N “nearby” markers
//       const numMarkers = 5;
//       const spread = 0.005; // ~500m
// 	  const pins = [
// 		{
// 		  name: "State Bank of India",
// 		  address: "Main Road, Rajpur, Uttarakhand",
// 		  latitude: latitude + 0.002,
// 		  longitude: longitude + 0.002,
// 		},
// 		{
// 		  name: "Punjab National Bank",
// 		  address: "Chowk Bazar, Pithoragarh",
// 		  latitude: latitude - 0.001,
// 		  longitude: longitude + 0.001,
// 		},
// 		{
// 		  name: "HDFC Bank",
// 		  address: "Near Bus Stand, Dharchula",
// 		  latitude: latitude + 0.0015,
// 		  longitude: longitude - 0.0015,
// 		},
// 		{
// 		  name: "Bank of Baroda",
// 		  address: "Naya Bazar, Didihat",
// 		  latitude: latitude - 0.002,
// 		  longitude: longitude - 0.002,
// 		},
// 		{
// 		  name: "Axis Bank",
// 		  address: "Subhash Nagar, Champawat",
// 		  latitude: latitude + 0.001,
// 		  longitude: longitude + 0.002,
// 		},
// 	  ];
// 	  setNearbyPins(pins);	  
//     }

//     getLocation();

//     return () => {
//       setData([]);
//       setLocation(null);
//       setNearbyPins([]);
//     };
//   }, [focused, markers]);


//   return (
//     <View style={{
//       flex: route.name === "Find" ? 3 : 4,
//       backgroundColor: "#fff",
//       alignItems: "center",
//       justifyContent: "center",
//     }}>
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         style={styles.map}
//         region={location}
//         showsUserLocation
//         showsMyLocationButton
//         followsUserLocation
//         showsCompass
//         scrollEnabled
//         zoomEnabled
//         pitchEnabled
//         rotateEnabled
//         showsTraffic
//       >
//         {/* Multiple nearby hard‑coded markers around user */}
// 		{nearbyPins.map((pin, i) => (
// 		<Marker
// 			key={`pin-${i}`}
// 			coordinate={{
// 			latitude: pin.latitude,
// 			longitude: pin.longitude,
// 			}}
// 			title={pin.name}
// 			description={pin.address}
// 			pinColor="blue"
// 		/>
// 		))}

//         {/* Your existing data markers */}
//         {!missingBank && data.length > 0 && data.map((item, i) => (
//           <Marker
//             key={`data-${i}`}
//             title={item.name}
//             coordinate={{
//               latitude: item.geometry.location.lat,
//               longitude: item.geometry.location.lng,
//             }}
//             pinColor={item.opening_hours?.open_now ? "green" : "red"}
//           />
//         ))}

//         {/* If you still want a missing‑bank at the exact user location */}
//         {missingBank && (
//           <Marker
//             title="Unknown Location"
//             coordinate={{
//               latitude: location.latitude,
//               longitude: location.longitude,
//             }}
//             pinColor="orange"
//           />
//         )}
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   map: {
//     width: Dimensions.get("window").width,
//     flex: 1,
//   },
//   loader: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });

// export default Map;

// import React, { useState, useEffect } from "react";
// import { View, StyleSheet, Dimensions } from "react-native";
// import { useIsFocused, useRoute } from "@react-navigation/native";
// import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
// import * as Location from "expo-location";
// import { flashMessage } from "../lottie/flashMessage";

// const GEOAPIFY_API_KEY = "13978f2f87174de799a4f2e250394747";

// const Map = ({ missingBank }) => {
//   const route = useRoute();
//   const focused = useIsFocused();
//   const [location, setLocation] = useState(null);
//   const [markers, setMarkers] = useState([]);

//   useEffect(() => {
//     async function getLocationAndPlaces() {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         flashMessage("Permission to access location was denied", "danger");
//         return;
//       }

//       const loc = await Location.getCurrentPositionAsync({});
//       const { latitude, longitude } = loc.coords;

//       const region = {
//         latitude,
//         longitude,
//         latitudeDelta: 0.03,
//         longitudeDelta: 0.04,
//       };

//       setLocation(region);

//       // Geoapify API URL for different categories
//       const categories = [
//         { name: "bank", color: "blue" },
//         { name: "atm", color: "green" },
//         { name: "post", color: "red" },
//         { name: "csc", color: "purple" },
//         { name: "bank_mitra", color: "orange" },
//       ];

//       try {
//         let allMarkers = [];
//         for (const category of categories) {
//           const url = `https://api.geoapify.com/v2/places?categories=service.financial.${category.name}&filter=circle:${longitude},${latitude},2000&limit=20&apiKey=${GEOAPIFY_API_KEY}`;
//           const response = await fetch(url);
//           const json = await response.json();

//           // Check if 'features' exists and is an array
//           if (!json.features || !Array.isArray(json.features)) {
//             console.warn(`No valid 'features' array for category: ${category.name}`);
//             continue; // Skip this category if data is invalid
//           }

//           const categoryMarkers = json.features.map((place) => ({
//             id: place.properties.place_id,
//             name: place.properties.name || `Unnamed ${category.name}`,
//             address: place.properties.formatted || "No address",
//             latitude: place.geometry.coordinates[1],
//             longitude: place.geometry.coordinates[0],
//             color: category.color,  // Add the color for the marker
//           }));

//           allMarkers = [...allMarkers, ...categoryMarkers];
//         }

//         setMarkers(allMarkers);
//       } catch (err) {
//         console.error("Failed to fetch places", err);
//         flashMessage("Failed to fetch places", "danger");
//       }
//     }

//     getLocationAndPlaces();

//     return () => {
//       setLocation(null);
//       setMarkers([]);
//     };
//   }, [focused]);

//   return (
//     <View
//       style={{
//         flex: route.name === "Find" ? 3 : 4,
//         backgroundColor: "#fff",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         style={styles.map}
//         region={location}
//         showsUserLocation
//         showsMyLocationButton
//         followsUserLocation
//         showsCompass
//         scrollEnabled
//         zoomEnabled
//         pitchEnabled
//         rotateEnabled
//         showsTraffic
//       >
//         {markers.map((place) => (
//           <Marker
//             key={place.id}
//             coordinate={{ latitude: place.latitude, longitude: place.longitude }}
//             title={place.name}
//             description={place.address}
//             pinColor={place.color}  // Apply the color for each category
//           />
//         ))}

//         {missingBank && location && (
//           <Marker
//             title="Unknown Location"
//             coordinate={{
//               latitude: location.latitude,
//               longitude: location.longitude,
//             }}
//             pinColor="orange"
//           />
//         )}
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   map: {
//     width: Dimensions.get("window").width,
//     flex: 1,
//   },
// });

// export default Map;

// part 4

// import React, { useState, useEffect } from "react";
// import { View, StyleSheet, Dimensions } from "react-native";
// import { useIsFocused, useRoute } from "@react-navigation/native";
// import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
// import * as Location from "expo-location";
// import { flashMessage } from "../lottie/flashMessage";

// const GEOAPIFY_API_KEY = "13978f2f87174de799a4f2e250394747";

// const Map = ({ missingBank }) => {
//   const route = useRoute();
//   const focused = useIsFocused();
//   const [location, setLocation] = useState(null);
//   const [markers, setMarkers] = useState([]);

//   useEffect(() => {
//     async function getLocationAndPlaces() {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         flashMessage("Permission to access location was denied", "danger");
//         return;
//       }

//       const loc = await Location.getCurrentPositionAsync({});
//       const { latitude, longitude } = loc.coords;

//       const region = {
//         latitude,
//         longitude,
//         latitudeDelta: 0.03,
//         longitudeDelta: 0.04,
//       };

//       setLocation(region);

//       // Geoapify API URL for different categories
//       const categories = [
//         { name: "service.financial.bank", color: "blue" },  // Correct API call for banks
//         { name: "service.financial.atm", color: "green" },  // Correct API call for ATMs
//         { name: "service.post.office", color: "red" },      // Correct API call for post offices
//         { name: "office.government.public_service", color: "purple" },  // Use public service for CSCs
//         { name: "service.financial.bank_mitra", color: "orange" },  // Use financial for bank mitra
//       ];

//       try {
//         let allMarkers = [];
//         for (const category of categories) {
//           const url = `https://api.geoapify.com/v2/places?categories=${category.name}&filter=circle:${longitude},${latitude},2000&limit=20&apiKey=${GEOAPIFY_API_KEY}`;
//           const response = await fetch(url);
//           const json = await response.json();

//           // Check if 'features' exists and is an array
//           if (!json.features || !Array.isArray(json.features)) {
//             console.warn(`No valid 'features' array for category: ${category.name}`);
//             continue; // Skip this category if data is invalid
//           }

//           const categoryMarkers = json.features.map((place) => ({
//             id: place.properties.place_id,
//             name: place.properties.name || `Unnamed ${category.name}`,
//             address: place.properties.formatted || "No address",
//             latitude: place.geometry.coordinates[1],
//             longitude: place.geometry.coordinates[0],
//             color: category.color,  // Add the color for the marker
//           }));

//           allMarkers = [...allMarkers, ...categoryMarkers];
//         }

//         setMarkers(allMarkers);
//       } catch (err) {
//         console.error("Failed to fetch places", err);
//         flashMessage("Failed to fetch places", "danger");
//       }
//     }

//     getLocationAndPlaces();

//     return () => {
//       setLocation(null);
//       setMarkers([]);
//     };
//   }, [focused]);

//   return (
//     <View
//       style={{
//         flex: route.name === "Find" ? 3 : 4,
//         backgroundColor: "#fff",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <MapView
//         provider={PROVIDER_GOOGLE}
//         style={styles.map}
//         region={location}
//         showsUserLocation
//         showsMyLocationButton
//         followsUserLocation
//         showsCompass
//         scrollEnabled
//         zoomEnabled
//         pitchEnabled
//         rotateEnabled
//         showsTraffic
//       >
//         {markers.map((place) => (
//           <Marker
//             key={place.id}
//             coordinate={{ latitude: place.latitude, longitude: place.longitude }}
//             title={place.name}
//             description={place.address}
//             pinColor={place.color}  // Apply the color for each category
//           />
//         ))}

//         {missingBank && location && (
//           <Marker
//             title="Unknown Location"
//             coordinate={{
//               latitude: location.latitude,
//               longitude: location.longitude,
//             }}
//             pinColor="orange"
//           />
//         )}
//       </MapView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   map: {
//     width: Dimensions.get("window").width,
//     flex: 1,
//   },
// });

// export default Map;

import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
} from "react-native";
import { useIsFocused, useRoute } from "@react-navigation/native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";
import { flashMessage } from "../lottie/flashMessage";

const GEOAPIFY_API_KEY = "13978f2f87174de799a4f2e250394747";

const Map = ({ missingBank }) => {
  const route = useRoute();
  const focused = useIsFocused();
  const [location, setLocation] = useState(null);
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    async function getLocationAndPlaces() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        flashMessage("Permission to access location was denied", "danger");
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = loc.coords;

      const region = {
        latitude,
        longitude,
        latitudeDelta: 0.03,
        longitudeDelta: 0.04,
      };

      setLocation(region);

      const categories = [
        { name: "service.financial.bank", color: "blue" },
        { name: "service.financial.atm", color: "green" },
        { name: "service.post.office", color: "red" },
        { name: "office.government.public_service", color: "purple" },
        { name: "service.financial.bank_mitra", color: "orange" },
      ];

      try {
        let allMarkers = [];
        for (const category of categories) {
          const url = `https://api.geoapify.com/v2/places?categories=${category.name}&filter=circle:${longitude},${latitude},2000&limit=20&apiKey=${GEOAPIFY_API_KEY}`;
          const response = await fetch(url);
          const json = await response.json();

          if (!json.features || !Array.isArray(json.features)) {
            console.warn(`No valid 'features' array for category: ${category.name}`);
            continue;
          }

          const categoryMarkers = json.features.map((place) => ({
            id: place.properties.place_id,
            name: place.properties.name || `Unnamed ${category.name}`,
            address: place.properties.formatted || "No address",
            latitude: place.geometry.coordinates[1],
            longitude: place.geometry.coordinates[0],
            color: category.color,
          }));

          allMarkers = [...allMarkers, ...categoryMarkers];
        }

        setMarkers(allMarkers);
      } catch (err) {
        console.error("Failed to fetch places", err);
        flashMessage("Failed to fetch places", "danger");
      }
    }

    getLocationAndPlaces();

    return () => {
      setLocation(null);
      setMarkers([]);
    };
  }, [focused]);

  return (
    <View
      style={{
        flex: route.name === "Find" ? 3 : 4,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={location}
        showsUserLocation
        showsMyLocationButton
        followsUserLocation
        showsCompass
        scrollEnabled
        zoomEnabled
        pitchEnabled
        rotateEnabled
        showsTraffic
      >
        {markers.map((place) => (
          <Marker
            key={place.id}
            coordinate={{ latitude: place.latitude, longitude: place.longitude }}
            title={place.name}
            description={place.address}
            pinColor={place.color}
          />
        ))}

        {missingBank && location && (
          <Marker
            title="Unknown Location"
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            pinColor="orange"
          />
        )}
      </MapView>

      {/* Floating Color Legend */}
      <View style={styles.floatingLegend}>
        <LegendItem color="blue" label="Bank" />
        <LegendItem color="green" label="ATM" />
        <LegendItem color="red" label="Post Office" />
        <LegendItem color="purple" label="CSC" />
        <LegendItem color="orange" label="Bank Mitra" />
      </View>
    </View>
  );
};

// Legend Item component
const LegendItem = ({ color, label }) => (
  <View style={styles.legendItem}>
    <View style={[styles.colorBox, { backgroundColor: color }]} />
    <Text style={styles.legendLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  map: {
    width: Dimensions.get("window").width,
    flex: 1,
  },
  floatingLegend: {
    position: "absolute",
	top: 20,            // ✅ Position from top
	left: 20,           // ✅ Position from left
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 10,
    padding: 10,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  colorBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: "#333",
  },
});

export default Map;
