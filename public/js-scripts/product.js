//<|ROLES|>
//Verificacion de Rol
const getAdm = document.querySelector(".adm");
const getUserOpt = document.querySelector(".guess-log");
const getGuessOpt = document.querySelector(".guess-content");

const userOptions = document.querySelector(".user-options");

window.onload = () => {
    getAdm.style.display = "none";
    userOptions.style.display = "none";
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
            getAdm.style.display = "flex";
            getUserOpt.style.display = "none"
            getGuessOpt.style.display = "none";
            userOptions.style.display = "flex";

        } else {
            getAdm.innerHTML = ' ';
            getUserOpt.style.display = "none"
            getGuessOpt.style.display = "none";
            userOptions.style.display = "flex";
        }

        async function userResponse() {
            const response = await axios.get("/usuario/me", {
                headers: {
                    Authorization: `Bearer ${token}` // Enviar el token en los headers
                }
            })
            return response.data;
        }

        const usuarioDisplay = await userResponse();
        const usernameDisplay = document.querySelector(".user-button");
        const sideUsername = document.getElementById("username");

        usernameDisplay.innerHTML = `${usuarioDisplay.username} <i class="fa-solid fa-circle-user"></i>`;
        sideUsername.innerHTML = `${usuarioDisplay.username}`;

    } catch (error) {
        console.log(error);
    }
}

const usernameDisplay = document.querySelector(".user-button");
const logOutButton = document.getElementById("logout");
const profileButton = document.getElementById("profile");

usernameDisplay.addEventListener("click", (e) => {
    e.preventDefault();

    logOutButton.classList.toggle("logout-anim");
    profileButton.classList.toggle("profile-anim");
});

//LogOut
const logOut = async () => {
    try {
      const response = await axios.post("/usuario/logOut")
    } catch (error) {
      console.log(error.message);
    }
}

logOutButton.addEventListener("click", (e) => {
    e.preventDefault();
    logOut();
    localStorage.removeItem("token");
    window.location.href = "./index.html";
})

//Botón de Admin
const admBtn = document.getElementById('mg-sect');
admBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = './sections/admin-section/manage.html';
});

// Llamada para verificar el rol y ejecutar la acción
obtenerRolUsuario();
//</|ROLES|>

//VER MÁS INFO
function verMas() {
    Swal.fire({
        title: "Aqui va una ficha tecnica o eso",
        text: "Pronto",
        icon: "question"
      });
}

// SEPARAR Y MOSTRAR ID EN BARRA DE NAVEGACIÓN
const query = window.location.search.split("=");
const idProduct = query[1];

const redirect = async (id, url) => {
    window.location.href = `${url}?product=${id}`;
    console.log(id);
    
}

function renderProduct(Productos) {
    const titleContent = document.querySelector("title");

    const divProductAbout = document.querySelector(".product-about");
    const divProductContainer = document.querySelector(".product-container");
    const divProductImg = document.querySelector(".product-img");
    const divPriceOptions = document.querySelector(".product-price-options");
    const divPurchaseButtons = document.querySelector(".purchase-buttons");
    const divProductNameDesc = document.querySelector(".name-desc");

    const productName = document.querySelector(".product-name");
    const productDetails = document.querySelector(".more-details");
    const confirmBuy = document.querySelector(".inBuyButton");
    const productDesc = document.querySelector("#description-p");
    const productPrice = document.querySelector(".product-price");
    const stockCheck = document.querySelector(".stock-available");

    const isStock = document.createElement("span");
    const productDescName = document.createElement("span");
    const productImg = document.createElement("img");

    let nameVerify = Productos.nombre ? Productos.nombre : error;
    titleContent.textContent = nameVerify;
    productName.textContent = nameVerify;
    productDescName.textContent = nameVerify;

    let descVerify = Productos.descripcion ? Productos.descripcion : error;
    productDesc.textContent = descVerify;

    let imgVerify = Productos.imgPortada ? Productos.imgPortada : ("../media/icons/default.png");
    productImg.setAttribute("src", imgVerify);

    let priceVerify = Productos.precio ? Productos.precio : error;
    let precioFormateado = new Intl.NumberFormat('es-ES').format(priceVerify);
    productPrice.textContent = '$ ' + precioFormateado;

    let stockVerify = Productos.stock ? Productos.stock : error;
    if (!stockVerify) {
        isStock.textContent = 'N/A'
    } else {
        isStock.textContent = 'Restantes: ' + stockVerify;
    }

    divProductImg.append(productImg);
    divProductNameDesc.append(productDescName);
    divProductNameDesc.append(productDesc);
    stockCheck.append(isStock);
}


const getProduct = async () => {
  try {
    const response = await axios.get(`/producto/selected/${idProduct}`);
      console.log(response);
      // Envolver el objeto en un array si no es un array
    const products = Array.isArray(response.data) ? response.data : [response.data];

    // Ahora puedo usar map
    products.map((Productos) => {
      renderProduct(Productos);
    });

  } catch (error) {
      console.log(error);
  }
}

getProduct()

// <|Toggle User Sidebar|>
const userSidebar = document.querySelector(".mb-user-sidebar");
const toggleUserSidebarBtn = document.querySelector(".userBtn");

toggleUserSidebarBtn.addEventListener("click", (e) => {
    e.preventDefault();
    userSidebar.classList.toggle("mb-user-sidebar-open");
});
// </|Toggle User Sidebar|>


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