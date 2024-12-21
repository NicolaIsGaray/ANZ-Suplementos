//<|ROLES|>
//Verificacion de Rol
const getAdm = document.querySelector(".adm");
const getUserOpt = document.querySelector(".user-navs")

window.onload = () => {
    getAdm.style.display = "none";
}

async function obtenerRolUsuario() {
    const token = localStorage.getItem("token"); // Obtener el token almacenado en localStorage

    try {
        // Hacer la solicitud para obtener el rol
        const response = await axios.get('/usuario/verificar-rol', {
            headers: {
                Authorization: `Bearer ${token}` // Enviar el token en los headers
            }
        });

        console.log('Respuesta del servidor:', response.data); // Imprimir toda la respuesta para depuración

        const isAdmin = response.data.isAdmin; // Suponiendo que el backend te está enviando isAdmin como true/false

        window.onload = () => {
            getUserOpt.style.display = "none";  
        } 
        
        if (isAdmin) {
            getAdm.style.display = "flex"; // Mostrar los botones para admin
            getUserOpt.innerHTML = ' '
        } else {
            getAdm.innerHTML = ' '; // Ocultar botones de admin si es cliente
            getUserOpt.innerHTML = ' '
        }

    } catch (error) {
    }
}

//Botón de Admin
const admBtn = document.getElementById('mg-sect');
admBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = './manage.html';
});

// Llamada para verificar el rol y ejecutar la acción
obtenerRolUsuario();
//</|ROLES|>

async function verificarAccesoAdmin() {
    const token = localStorage.getItem("token");

    if (!token) {
        alert("No tienes acceso. Por favor, inicia sesión.");
        window.location.href = "../user/login.html"; // Redirigir a la página de login
        return;
    }

    try {
        const response = await axios.get("/usuario/admin-only", {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(response.data.message); // Mensaje de éxito
    } catch (error) {
        console.error("Acceso denegado:", error.response?.data?.message || error.message);
        alert("Acceso denegado. No tienes permisos para ver esta página.");
        window.location.href = "/"; // Redirigir a otra página
    }
}

verificarAccesoAdmin();

const divProductOpt = document.querySelector(".product-options");
const divSectionOpt = document.querySelector(".section-options");
const divContactOpt = document.querySelector(".contact-options");

const liProductOpt = document.querySelector("#product-option");
const liSectionOpt = document.querySelector("#section-option");
const liContactOpt = document.querySelector("#contact-option");

document.addEventListener("click", (event) => {
    if (event.target.classList.contains("optionS")) {
        if (event.target.id === 'product-option') {
            divSectionOpt.style.display = "none";
            divContactOpt.style.display = "none";
            divProductOpt.style.display = "flex";

            liSectionOpt.classList.remove("selected-option");
            liContactOpt.classList.remove("selected-option");
            liProductOpt.classList.toggle("selected-option");
        }
        if (event.target.id === 'section-option') {
            divProductOpt.style.display = "none";
            divContactOpt.style.display = "none";
            divSectionOpt.style.display = "flex";

            liProductOpt.classList.remove("selected-option");
            liContactOpt.classList.remove("selected-option");
            liSectionOpt.classList.toggle("selected-option");
        }
        if (event.target.id === 'contact-option') {
            divSectionOpt.style.display = "none";
            divProductOpt.style.display = "none";
            divContactOpt.style.display = "flex";

            liSectionOpt.classList.remove("selected-option");
            liProductOpt.classList.remove("selected-option");
            liContactOpt.classList.toggle("selected-option");
        }
    }
});

const addProductPage = document.getElementById('addProductPage');

const goToAdd = async () => {
    window.location.href = './add-product.html';
}

addProductPage.addEventListener('click', (e) => {
    goToAdd(e);
});

// <|REDES SOCIALES Y CONTACTO TELEFÓNICO|>
const formularioContacto = document.getElementById("contact-form");
//CONTACTO TELEFÓNICO
const telefonoInput = document.getElementById("number-contact");

const editarTelefono = async () => {
    const telefonoInfo = telefonoInput.value;

    try {
        const response = await axios.post('/pagina/contacto-telefono', { telefonoInfo });
        alert("Información actualizada con éxito.");
        location.reload();
    } catch (error) {
        console.error("Error al enviar la solicitud:", error.response.data);
    }
}
//CONTACTO INSTAGRAM
const instagramInput = document.getElementById("ig-contact");

const editarInstagram = async () => {
    const instagramInfo = instagramInput.value;

    try {
        const response = await axios.post('/pagina/contacto-instagram', { instagramInfo });
        alert("Información actualizada con éxito.");
    } catch (error) {
        console.error("Error al enviar la solicitud:", error.response.data);
    }
}
//CONTACTO TWITTER
const twitterInput = document.getElementById("x-contact");

const editarTwitter = async () => {
    const twitterInfo = twitterInput.value;

    try {
        const response = await axios.post('/pagina/contacto-twitter', { twitterInfo });
        alert("Información actualizada con éxito.");
    } catch (error) {
        console.error("Error al enviar la solicitud:", error.response.data);
    }
}
//CONTACTO FACEBOOK
const facebookInput = document.getElementById("fb-contact");

const editarFacebook = async () => {
    const facebookInfo = facebookInput.value;

    try {
        const response = await axios.post('/pagina/contacto-facebook', { facebookInfo });
        alert("Información actualizada con éxito.");
    } catch (error) {
        console.error("Error al enviar la solicitud:", error.response.data);
    }
}
//CONTACTO YOUTUBE
const youtubeInput = document.getElementById("yt-contact");

const editarYoutube = async () => {
    const youtubeInfo = youtubeInput.value;

    try {
        const response = await axios.post('/pagina/contacto-youtube', { youtubeInfo });
        alert("Información actualizada con éxito.");
    } catch (error) {
        console.error("Error al enviar la solicitud:", error.response.data);
    }
}
// </|REDES SOCIALES Y CONTACTO TELEFÓNICO|>

function getCategoryInput() {
    const addInput = document.getElementById("newCtgr");

    const addValue = addInput.value;

    if (addValue.length <= 1) {
        console.log("Error, no puede ser menor a 1.");
    }

    return {
        nombreCategoria: addValue
    }
}

const categoryRegister = async (e) => {
    e.preventDefault();
    const {nombreCategoria} = getCategoryInput();

    if (!nombreCategoria) {
        Swal.fire({
            icon: "error",
            title: "¡Hey!",
            text: "El nombre no puede estar vacio."
          });
        return;
    }

    const CategoryToSend = {
        nombreCategoria
    };

    try {
        await axios.post("/producto/categoria", CategoryToSend)
        window.history.back();
    } catch (error) {
        console.log(error.response.data);
    }
}

const categoryAdd = document.querySelector("#addCategoryBtn");
categoryAdd.addEventListener("click", (e) => {
    categoryRegister(e);
});

//<|CONTACTO|>
const getSociales = async () => {
    try {
        const response = await axios.get('/pagina/contactos');
        const contacto = response.data; // Almacena la URL de Instagram obtenida
        
        contacto.forEach(contactos => {
            const facebookIcon = document.getElementById('facebook');
            const instagramIcon = document.getElementById('instagram');
            const twitterIcon = document.getElementById('twitter');
            const youtubeIcon = document.getElementById('youtube');

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