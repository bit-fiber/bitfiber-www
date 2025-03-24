//coverage map
function initMap() {
  const centerLocation = { lat: 28.527978, lng: 77.289787 };

  const map = new google.maps.Map(document.querySelector("#coverage-map"), {
    zoom: 13,
    center: centerLocation,
  });

  async function fetchServiceAreas() {
    try {
      const response = await fetch(`${API_CONFIG.baseURL}/servicearea`, {
        method: "GET",
        headers: API_CONFIG.headers(false),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.data || [];
    } catch (error) {
      console.error("Error fetching the API:", error);
    }
  }

  fetchServiceAreas().then((serviceAreas) => {
    map.data.addGeoJson(serviceAreas[0]);

    map.data.setStyle(function (feature) {
      return {
        fillColor: "green",
        strokeColor: "green",
      };
    });
  });
}

// Global Scope
window.initMap = initMap;
