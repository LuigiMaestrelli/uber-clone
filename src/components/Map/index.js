import React, { Component } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import GeoCoder from 'react-native-geocoding';

import {
  LocationBox,
  LocationText,
  LocationTimeBox,
  LocationTimeText,
  LocationTimeTextSmall,
  Back
} from './styles';

import Search from '../Search';
import Directions from '../Directions';
import Details from '../Details';
import { getPixelSize } from '../../utils';

import markerImage from '../../assets/marker.png';
import backImage from '../../assets/back.png';

GeoCoder.init('AIzaSyA4ELsCxGkD28UK9EJiYJGpO85IBmrHQEE');

export default class Map extends Component {
  state = {
    region: null,
    destination: null,
    duration: null,
    location: null
  };

  async componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        const response = await GeoCoder.from({ latitude, longitude });

        const address = response.results[0].formatted_address;
        const location = address.substring(0, address.indexOf(','));

        this.setState({
          location,
          region: {
            latitude: latitude,
            longitude: longitude,
            latitudeDelta: 0.0143,
            longitudeDelta: 0.0134
          }
        });
      },
      () => {},
      {
        timeout: 2000,
        enableHighAccuracy: true,
        maximumAge: 1000
      }
    );
  }

  handleLocationSelected = (data, { geometry }) => {
    const {
      location: { lat: latitude, lng: longitude }
    } = geometry;

    this.setState({
      destination: {
        latitude,
        longitude,
        title: data.structured_formatting.main_text
      }
    });
  };

  handleBack = () => {
    this.setState({
      destination: null
    });
  };

  render() {
    const { region, destination, duration, location } = this.state;

    return (
      <View style={styles.view}>
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          loadingEnabled={true}
          ref={el => (this.mapView = el)}
        >
          {destination && (
            <>
              <Directions
                destination={destination}
                origin={region}
                onReady={result => {
                  this.setState({
                    duration: Math.floor(result.duration)
                  });

                  this.mapView.fitToCoordinates(result.coordinates, {
                    edgePadding: {
                      top: getPixelSize(50),
                      bottom: getPixelSize(350),
                      left: getPixelSize(50),
                      right: getPixelSize(50)
                    }
                  });
                }}
              />
              <Marker coordinate={region} anchor={{ x: 0, y: 0 }}>
                <LocationBox>
                  <LocationTimeBox>
                    <LocationTimeText>{duration}</LocationTimeText>
                    <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                  </LocationTimeBox>
                  <LocationText>{location}</LocationText>
                </LocationBox>
              </Marker>
              <Marker
                coordinate={destination}
                anchor={{ x: 0, y: 0 }}
                image={markerImage}
              >
                <LocationBox>
                  <LocationText>{destination.title}</LocationText>
                </LocationBox>
              </Marker>
            </>
          )}
        </MapView>

        {destination ? (
          <>
            <Back onPress={this.handleBack}>
              <Image source={backImage} />
            </Back>
            <Details />
          </>
        ) : (
          <Search onLocationSelected={this.handleLocationSelected} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flex: 1
  },
  map: {
    flex: 1
  }
});
