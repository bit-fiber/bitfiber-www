const API_CONFIG = {
  baseURL: "https://webbackend.praction.in/web/v1",
  // baseURL: "https://dev.web.praction.in/web/v1",
  // appURL: "https://app.praction.in/api/v1",
  // razorpayKey: "rzp_live_AD0WAOWLi0iD0o",
  // gmapKey: "AIzaSyAQmj3N3-T2k7d8yUg0H1CxwEWLE01ZsLc",
  headers: (isAuthRequired = false) => {
    const token = localStorage.getItem("authToken");

    if (isAuthRequired && token) {
      return {
        Authorization: `Bearer ${token}`,
      };
    }

    return {
      "Content-Type": "application/json",
      "Strict-Auth-Key": "kwV3T4gEjFfxCQfS0wQA064CeXSkuhZc8a9XM6mCZxpsPmoaW6",
    };
  },
};
