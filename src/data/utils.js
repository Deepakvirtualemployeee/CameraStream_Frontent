import statesData from "./states.json";

// Convert bearing angle to compass direction
export function bearingToDirection(bearing) {
    const directions = [
        "N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE",
        "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"
    ];
    const index = Math.round(bearing / 22.5) % 16;
    return directions[index];
}

// Haversine formula (miles)
export function haversineDistance(lat1, lon1, lat2, lon2) {
    const R = 3958.8; // Earth radius in miles
    const toRad = (deg) => (deg * Math.PI) / 180;

    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

// Bearing between two coords
export function calculateBearing(lat1, lon1, lat2, lon2) {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const toDeg = (rad) => (rad * 180) / Math.PI;

    const dLon = toRad(lon2 - lon1);
    lat1 = toRad(lat1);
    lat2 = toRad(lat2);

    const y = Math.sin(dLon) * Math.cos(lat2);
    const x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);

    const brng = Math.atan2(y, x);
    return (toDeg(brng) + 360) % 360;
}

// Format like "6046.5mi WSW of Bethel, AK"
export function formatLocation(lat, lon, cityLat, cityLon, cityName, stateCode) {
    const distance = haversineDistance(lat, lon, cityLat, cityLon).toFixed(1);
    const bearing = calculateBearing(cityLat, cityLon, lat, lon);
    const direction = bearingToDirection(bearing);

    return `${distance}mi ${direction} of ${cityName}, ${stateCode}`;
}

// Find nearest location from states.json
export const fetchLocationFromLatLng = async (lat, lng) => {
    try {
      let nearestCity = null;
      let minDistance = Infinity;
  
      statesData.geoLocationList.forEach((loc) => {
        const distance = haversineDistance(
          parseFloat(lat),
          parseFloat(lng),
          loc.Lat,
          loc.Lon
        );
  
        if (distance < minDistance) {
          minDistance = distance;
          nearestCity = loc;
        }
      });
  
      if (nearestCity) {
        return formatLocation(
          parseFloat(lat),
          parseFloat(lng),
          nearestCity.Lat,
          nearestCity.Lon,
          nearestCity.City,
          nearestCity.State
        );
      } else {
        return `Lat:${lat}, Lng:${lng}`;
      }
    } catch (err) {
      console.error("Location calc error:", err);
      return `Lat:${lat}, Lng:${lng}`;
    }
  };