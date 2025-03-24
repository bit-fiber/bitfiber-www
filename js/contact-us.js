jQuery(document).ready(function () {
  let customerVerificationData = null;

  jQuery("#contact-form").on("submit", async function (e) {
    //Don't foget to change the id form
    e.preventDefault();

    let customerData = {
      name: jQuery("#name").val(),
      email: jQuery("#email").val(),
      mobile: jQuery("#mobile").val(),
      pincode: Number(jQuery("#pincode").val()),
    };

    try {
      let response = await fetch(`${API_CONFIG.baseURL}/customer/intrest`, {
        method: "POST",
        headers: API_CONFIG.headers(false),
        body: JSON.stringify(customerData),
      });

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        throw new Error("Invalid response from the server");
      }

      if (!response.ok) {
        console.log("API returned an error:", data);
        throw new Error(data.errors[0]?.message || "An unknown error occurred");
      }

      if (data.status === "success") {
        const { mobile, email } = customerData;
        customerVerificationData = { mobile, email };

        showOtpModal(customerData);

        jQuery("#contact-form")[0].reset();
      }
    } catch (error) {
      console.error("Error:", error.message);
      swal({
        title: "Oops...",
        text: error.message,
        icon: "error",
        timer: 3000,
      });
    }
  });

  const otpModal = new bootstrap.Modal(jQuery("#otp-modal"));

  const showOtpModal = (customerData) => {
    if (otpModal) {
      const modalHeading = document.querySelector("#otpModalTitle");

      const lastThreeDigits = customerData.mobile.slice(-3);

      const [username, domain] = customerData.email.split("@");

      const lastThreeChars = username.slice(-3);

      modalHeading.innerHTML = `We sent you a 6-digit verification code to xxxx-xxx-${lastThreeDigits} and xxxxx${lastThreeChars}${domain}`;

      otpModal.show();
    }
  };

  jQuery("#verify-otp").on("click", function (e) {
    e.preventDefault();
    let otpInput = jQuery("#otp-input").val().trim();

    if (otpInput.length !== 6 || isNaN(otpInput)) {
      swal({
        title: "Oops...",
        text: "Please enter a valid 6-digit OTP",
        icon: "error",
        timer: 3000,
      });
      return;
    }

    let otp = Number(otpInput);

    const verificationDetails = {
      ...customerVerificationData,
      otp,
    };

    verifyOtp(verificationDetails);
  });

  async function verifyOtp(customerVerificationDetails) {
    try {
      let response = await fetch(`${API_CONFIG.baseURL}/customer/intrest/otp`, {
        method: "POST",
        headers: API_CONFIG.headers(false),
        body: JSON.stringify(customerVerificationDetails),
      });

      const responseText = await response.text();

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (error) {
        console.error("Failed to parse JSON:", error);
        throw new Error("Invalid response from the server");
      }

      if (!response.ok) {
        console.log("API returned an error:", data);
        throw new Error(data.errors[0]?.message || "An unknown error occurred");
      }

      if (data.status === "success") {
        otpModal.hide();
        swal({
          title: "Thank You!",
          text: "Your request has been submitted successfully. We will contact to you soon.",
          icon: "success",
          timer: 3000,
        }).then(function () {
          jQuery("#verify-details-form")[0].reset();
        });
      }
    } catch (error) {
      console.error("Error:", error.message);
      swal({
        title: "Oops...",
        text: error.message,
        icon: "error",
        timer: 3000,
      });
    }
  }
});
