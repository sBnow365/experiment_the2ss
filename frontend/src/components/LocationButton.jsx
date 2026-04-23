import { useState } from "react";

function LocationButton({ setLocation }) {

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lon: position.coords.longitude
        };

        setLocation(coords);
      },
      (error) => {
        console.error(error);
        alert("Location permission denied");
      }
    );
  };

  return (
    <button onClick={getLocation}>
      Use My Location
    </button>
  );
}

export default LocationButton;