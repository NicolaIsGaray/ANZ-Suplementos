// <|COOKIES|>
document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('cookie-banner');
    const acceptButton = document.getElementById('accept-cookies');

    // Mostrar el banner si el usuario no aceptó cookies
    if (!localStorage.getItem('cookies-accepted')) {
        setTimeout(() => {
            banner.style.bottom = '0'; // Mueve el banner hacia arriba con la animación
        }, 100); // Retardo para que la transición sea visible
    }

    // Ocultar el banner y guardar el consentimiento
    acceptButton.addEventListener('click', () => {
        localStorage.setItem('cookies-accepted', 'true');
        banner.style.bottom = '-200px';
        setTimeout(() => {
            banner.remove();
        }, 900);
    });
});
// </|COOKIES|>

//<|ROLES|>
//Verificacion de Rol
const getAdm = document.querySelector(".adm");
const getUserOpt = document.querySelector(".guess-log");

const userOptions = document.querySelector(".user-options");

window.onload = () => {
  getAdm.style.display = "none";
  userOptions.style.display = "none";
};

async function obtenerRolUsuario() {
  const token = localStorage.getItem("token"); // Obtener el token almacenado en localStorage

  try {
    // Hacer la solicitud para obtener el rol
    const response = await axios.get("/usuario/verificar-rol", {
      headers: {
        Authorization: `Bearer ${token}`, // Enviar el token en los headers
      },
    });

    console.log("Respuesta del servidor:", response.data); // Imprimir toda la respuesta para depuración

    const isAdmin = response.data.isAdmin; // Suponiendo que el backend te está enviando isAdmin como true/false

    window.onload = () => {
      getUserOpt.style.display = "none";
    };

    if (isAdmin) {
      getAdm.style.display = "flex";
      getUserOpt.style.display = "none";
      userOptions.style.display = "flex";
    } else {
      getAdm.remove();
      getUserOpt.style.display = "none";
      userOptions.style.display = "flex";
    }

    async function userResponse() {
      const response = await axios.get("/usuario/me", {
        headers: {
          Authorization: `Bearer ${token}`, // Enviar el token en los headers
        },
      });
      return response.data;
    }

    const usuarioDisplay = await userResponse();
    const usernameDisplay = document.querySelector(".user-button");

    usernameDisplay.innerHTML = `Hola, ${usuarioDisplay.username} <img
                    src="../media/icons/circle-user-solid.svg"
                    alt=""
                    style="width: 24px; height: 24px"
                />`;
  } catch (error) {
    console.log(error);
  }
}

//LogOut
const getLogOut = document.querySelector(".logout");

getLogOut.addEventListener("click", (e) => {
  e.preventDefault();
  logOutEvent();
});

const logOut = async () => {
  try {
    const response = await axios.post("/usuario/logOut");
  } catch (error) {
    console.log(error.message);
  }
};

function logOutEvent() {
  logOut();
  localStorage.removeItem("token");
  window.location.href = "../index.html";
}

//Botón de Admin
const admBtn = document.getElementById("mg-sect");
admBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "./admin-section/manage.html";
});

// Llamada para verificar el rol y ejecutar la acción
obtenerRolUsuario();
//</|ROLES|>

// <|Toggle Sidebar|>
const sidebar = document.querySelector(".mb-sidebar");
const openBtn = document.querySelector(".open-sidebar");

openBtn.addEventListener("click", (e) => {
    e.preventDefault();
    sidebar.classList.toggle("sidebar-open");
});
// </|Toggle Sidebar|>

//<|CONTACTO|>
const getSociales = async () => {
    try {
        const response = await axios.get('/pagina/contactos');
        const contacto = response.data; // Almacena la URL de Instagram obtenida
        
        contacto.forEach(contactos => {
            const whatsapp = document.getElementById("wa-cont");

            const facebookIcon = document.getElementById('facebook');
            const instagramIcon = document.getElementById('instagram');
            const twitterIcon = document.getElementById('twitter');
            const youtubeIcon = document.getElementById('youtube');

            whatsapp.href = `https://wa.me/${contactos.telefono}`;

            facebookIcon.href = contactos.facebook;
            instagramIcon.href = contactos.instagram;
            twitterIcon.href = contactos.twitter;
            youtubeIcon.href = contactos.youtube;
        });
    } catch (error) {
        console.error('Error al obtener URL de Youtube:', error.response.data);
    }
}

getSociales();
//</|CONTACTO|>