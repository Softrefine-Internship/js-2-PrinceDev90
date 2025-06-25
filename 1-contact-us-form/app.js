const formTrigger = {
  fname: document.querySelector("#fname"),
  lname: document.querySelector("#lname"),
  company: document.querySelector("#company"),
  email: document.querySelector("#email"),
  phone_code: document.querySelector("#phone_code"),
  phoneNumber: document.querySelector("#phoneNumber"),
  message: document.querySelector("#message"),
  isChecked: document.querySelector("#isChecked"),
  formData: document.querySelector("#formData"),
};

document.addEventListener("DOMContentLoaded", function () {
  setPhoneCodeOption();
  loadDataFromLocalStorage();
});

function loadDataFromLocalStorage() {
  const existingData =
    JSON.parse(localStorage.getItem("contactSubmissions")) || [];
  existingData.forEach((entry) => {
    appendDataToTable(entry);
  });
}

formTrigger.phoneNumber.addEventListener("input", function () {
  this.value = this.value.replace(/[^\d]/g, "");
});

formTrigger.phone_code.addEventListener("change", () => {
  const selected = formTrigger.phone_code.selectedOptions[0];
  const countryCode = selected.dataset.countryCode;
  document.getElementById(
    "flagImage"
  ).src = `https://flagcdn.com/w1280/${countryCode}.png`;
});

async function setPhoneCodeOption() {
  const res = await fetch("./Country.json");
  const data = await res.json();

  formTrigger.phone_code.innerHTML = "";

  data.forEach(({ dial_code, code }) => {
    const option = document.createElement("option");
    option.value = dial_code;
    option.textContent = `${dial_code}-${code}`;
    option.dataset.countryCode = code.toLowerCase(); // Save ISO code
    formTrigger.phone_code.appendChild(option);
  });

  // Set initial flag
  const firstCode = data[0].code.toLowerCase();
  document.getElementById(
    "flagImage"
  ).src = `https://flagcdn.com/w40/${firstCode}.png`;
}

// handle form validation on change
formTrigger.formData.addEventListener("submit", function (e) {
  e.preventDefault();

  const validationResults = validateForm(formTrigger);

  if (validationResults.isValid) {
    saveDataToLocalStorage(validationResults.data);
    appendDataToTable(validationResults.data);

    formTrigger.formData.reset(); // Clear the form fields

    // Optional: clear flag to default (first country)
    const firstCode = formTrigger.phone_code.options[0].dataset.countryCode;
    document.getElementById(
      "flagImage"
    ).src = `https://flagcdn.com/w40/${firstCode}.png`;
  } else {
    console.error("Form errors:", validationResults.errors);
  }
});

function validateForm(form) {
  const errors = {};

  const formData = {
    fname: form.fname.value.trim(),
    lname: form.lname.value.trim(),
    company: form.company.value.trim(),
    email: form.email.value.trim(),
    phone_code: form.phone_code.value,
    phoneNumber: form.phoneNumber.value.trim(),
    message: form.message.value.trim(),
    isChecked: form.isChecked.checked,
  };

  // First name
  if (!formData.fname) {
    errors.fname = "First name is required";
    setError(form.fname, errors.fname);
  } else {
    clearError(form.fname);
  }

  // Last name
  if (!formData.lname) {
    errors.lname = "Last name is required";
    setError(form.lname, errors.lname);
  } else {
    clearError(form.lname);
  }

  // Company
  if (!formData.company) {
    errors.company = "Company is required";
    setError(form.company, errors.company);
  } else {
    clearError(form.company);
  }

  // Email
  if (!formData.email) {
    errors.email = "Email is required";
    setError(form.email, errors.email);
  } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
    errors.email = "Invalid email format";
    setError(form.email, errors.email);
  } else {
    clearError(form.email);
  }

  // Phone number
  if (!formData.phoneNumber) {
    errors.phoneNumber = "Phone number is required";
    setError(form.phoneNumber, errors.phoneNumber);
  } else if (!/^\d{7,15}$/.test(formData.phoneNumber)) {
    errors.phoneNumber = "Phone number must be between 7 and 15 digits";
    setError(form.phoneNumber, errors.phoneNumber);
  } else {
    clearError(form.phoneNumber);
  }

  // Message
  if (!formData.message) {
    errors.message = "Message is required";
    setError(form.message, errors.message);
  } else {
    clearError(form.message);
  }

  // Checkbox
  if (!formData.isChecked) {
    alert("You must agree to the privacy policy.");
    errors.isChecked = "Unchecked";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    data: formData,
  };
}

function setError(input, message) {
  const wrapper = input.closest(".phoneContainer") || input.closest("div"); // Try phoneContainer first
  const small = wrapper?.querySelector("small");
  if (small) {
    small.textContent = message;
    input.style.borderColor = "red";
  }
}

function clearError(input) {
  const wrapper = input.closest(".phoneContainer") || input.closest("div");
  const small = wrapper?.querySelector("small");
  if (small) {
    small.textContent = "";
    input.style.borderColor = "";
  }
}

function appendDataToTable(data) {
  const tableBody = document.querySelector("#submittedDataTable tbody");

  const row = document.createElement("tr");

  row.innerHTML = `
    <td>${data.fname}</td>
    <td>${data.lname}</td>
    <td>${data.company}</td>
    <td>${data.email}</td>
    <td>${data.phone_code} ${data.phoneNumber}</td>
    <td>${data.message}</td>
    <td>${data.isChecked ? "Yes" : "No"}</td>
  `;

  tableBody.appendChild(row);
}

function saveDataToLocalStorage(entry) {
  let existingData =
    JSON.parse(localStorage.getItem("contactSubmissions")) || [];
  existingData.push(entry);
  localStorage.setItem("contactSubmissions", JSON.stringify(existingData));
}
