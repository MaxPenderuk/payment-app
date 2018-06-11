import axios from 'axios';

export function getCountryByCoords(lat, lng) {
  return new Promise((resolve, reject) => {
    const mapsApiLink = 'https://maps.googleapis.com/maps/api/geocode/json';
    const apiKey = 'AIzaSyC7C4Km0VtBEzDxkUTnZNmZL6H0Ae0pu-c';

    axios.get(`${mapsApiLink}?latlng=${lat},${lng}&key=${apiKey}`).then(res => {
      const { data } = res;
      const components = data.results[0].address_components;
      const country = components.find(obj => {
          return obj.types.includes('country');
      });

      if (country && country.long_name) {
        resolve(country);
      }
    }).catch(error => reject(error));
  });
}

export function getPaymentMethodsByCountryCode(countryCode) {
  return new Promise((resolve, reject) => {
    const apiURL = 'https://api.paymentwall.com/api/payment-systems';
    const apiKey = '067606e06b4f354ecedb7e2e42e6e5fa';

    axios.get(`${apiURL}/?key=${apiKey}&country_code=${countryCode}`).then(res => {
      if (res && res.data) {
        resolve(res.data);
      }
    }).catch(error => reject(error));
  });
}

export function createPayment(data) {
  return new Promise((resolve, reject) => {
    if (Number(data.cvv) !== 123) {
      resolve({
        status: 1
      });
    } else {
      reject({
        status: 0
      });
    }
  });
}
