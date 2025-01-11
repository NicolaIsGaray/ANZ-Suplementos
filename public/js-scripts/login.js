function getInputValues() {
    const emailInput = document.querySelector("#email");
    const passInput = document.querySelector("#password");
  
    const emailValue = emailInput.value;
    const passValue = passInput.value;
  
    return {
      email: emailValue,
      contraseña: passValue
    }
  }
  
  const redirect = () => {
    window.location.href = "../../index.html";
  }
  
  const logInUser = async (e) => {
      e.preventDefault();
      const objectToSend = getInputValues();
      try {
          const response = await axios.post("/usuario/logIn", objectToSend);
          if (response.status === 200) {
              redirect(); // Si la respuesta es exitosa, redirigir
  
              // Obtener el token de la respuesta del backend
              const token = response.data.token;
  
           // Verificar si el token existe y guardarlo en localStorage
              if (token) {
              localStorage.setItem("token", token);  // Guardar el token en localStorage
              console.log("Token guardado en localStorage");
          } else {
              alert("Error: No se recibió un token");
          }
          }
      } catch (error) {
          console.log("Error al iniciar sesión:", error);
          if (error.response && error.response.status === 401) {
              Swal.fire({
                  title: 'Error',
                  text: 'Credenciales no válidas. Verifica tu usuario y contraseña.',
                  icon: 'error',
                  customClass: {
                      title: "swalTitle"
                  }
              });
          } else {
              // Si hay otro tipo de error, redirigir a la página de login
              // window.location.href = "./login.html";
              console.log(error.response.data);
              
          }
      }
  };
  
  const logInButton = document.querySelector("#logIn");
  logInButton.addEventListener("click", (e) => logInUser(e));