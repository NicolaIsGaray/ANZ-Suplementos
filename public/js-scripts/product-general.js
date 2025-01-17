//<|ROLES|>
//Verificacion de Rol
const getAdm = document.querySelector(".adm");
const getUserOpt = document.querySelector(".guess-log");
const getGuessOpt = document.querySelector(".guess-content");

const userOptions = document.querySelector(".user-options");
const mbUserLogged = document.querySelector(".user-logged-content");

window.onload = () => {
    getAdm.style.display = "none";
    userOptions.style.display = "none";
    mbUserLogged.style.display = "none";
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
            mbUserLogged.style.display = "flex";

        } else {
            getAdm.innerHTML = ' ';
            getUserOpt.style.display = "none"
            getGuessOpt.style.display = "none";
            userOptions.style.display = "flex";
            mbUserLogged.style.display = "flex";
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
        const mbUserName = document.getElementById("mb-username");

        usernameDisplay.innerHTML = `${usuarioDisplay.username} <i class="fa-solid fa-circle-user"></i>`;

        mbUserName.innerHTML = `${usuarioDisplay.username}`;

    } catch (error) {
        console.log(error);
    }
}

//LogOut
const logOut = async () => {
    try {
      const response = await axios.post("/usuario/logOut")
    } catch (error) {
      console.log(error.message);
    }
}

function logOutEvent() {
    logOut();
    localStorage.removeItem("token");
    window.location.href = "./index.html";
}

//Botón de Admin
const admBtn = document.getElementById('mg-sect');
admBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = '../admin-section/manage.html';
});

// Llamada para verificar el rol y ejecutar la acción
obtenerRolUsuario();
//</|ROLES|>

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

//SEPARAR Y MOSTRAR ID EN BARRA DE NAVEGACIÓN
const query = window.location.search.split("=");
const idProducto = query[1]

const redirect = (id, url) => {
    window.location.href = `${url}?product=${id}`;
}

// Función para obtener la categoría desde la URL
const getCategoriaFromURL = () => {
    const params = new URLSearchParams(window.location.search);
    return params.get('section'); // Devuelve la sección, ej: "suplementos"
};

// Función para obtener productos por categoría
const getProductosPorCategoria = async () => {
    const categoria = getCategoriaFromURL(); // Obtener la categoría de la URL

    if (!categoria) {
        console.error("No se proporcionó una sección en la URL.");
        return;
    }

    try {
        // Llamada al backend para obtener productos filtrados
        const response = await axios.get(`/producto/productos`);
        const productos = response.data;

        // Limpiar el contenedor antes de renderizar
        const divProducts = document.querySelector(".products-card");
        divProducts.innerHTML = "";

        // Renderizar cada producto
        productos.forEach(producto => {
            renderProduct(producto);
        });

    } catch (error) {
        console.error("Error al obtener productos por categoría:", error);
    }
};

// Función para renderizar un producto
const renderProduct = (producto) => {
    const divProducts = document.querySelector(".products-card");

    // Crear elementos del producto
    const divItem = document.createElement("div");
    divItem.classList.add("item-main", "seccion");

    const divItemContent = document.createElement("div");
    divItemContent.classList.add("item-content");

    const productImg = document.createElement("img");
    const divImg = document.createElement("div");
    divImg.classList.add("item-img-div");
    productImg.classList.add("item-img");
    let imgVerify = producto.imgPortada ? producto.imgPortada : "../../media/default.png";
    productImg.setAttribute("src", imgVerify);
    divImg.appendChild(productImg);

    const productName = document.createElement("span");
    productName.id = "name-product";
    let nameVerify = producto.nombre ? producto.nombre : "Null"
    productName.textContent = nameVerify;

    const productPrice = document.createElement("span");
    productPrice.id = "price";
    let priceVerify = producto.precio ? producto.precio : "Null"
    productPrice.textContent = `$${priceVerify}`;

    const buyButton = document.createElement("button");
    buyButton.classList.add("buy-button");
    buyButton.innerHTML = `COMPRAR <i class="fa-solid fa-basket-shopping" style="color: #FFD43B;"></i>`;

    // Evento para redirigir al detalle del producto
    buyButton.addEventListener("click", () => {
        redirect(producto._id, `./product.html`);
    });
    
    const categoriaCheck = getCategoriaFromURL();

    const sectionName = document.getElementById("section-name");

    if (categoriaCheck === producto.categoria) {
        if (producto.categoria === "Vasos") {
            sectionName.textContent = "Vasos y Shakers"
        } else {
            sectionName.textContent = producto.categoria;
        }
        // Agregar elementos al contenedor principal del producto
        divItem.appendChild(divImg);
        divItemContent.appendChild(productName);
        divItemContent.appendChild(productPrice);
        divItemContent.appendChild(buyButton);
        divItem.appendChild(divItemContent);
        // Agregar el producto al contenedor de productos
        divProducts.appendChild(divItem);
    }
};

// Iniciar la obtención de productos cuando se carga la página
document.addEventListener("DOMContentLoaded", getProductosPorCategoria);

//<|CONTACTO|>
const getSociales = async () => {
    try {
        const response = await axios.get('/pagina/contactos');
        const contacto = response.data;
        
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