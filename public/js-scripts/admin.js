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

//<|ROLES|>
//Verificacion de Rol
const getAdm = document.querySelector(".adm");
const getUserOpt = document.querySelector(".guess-log");
const getGuessOpt = document.querySelector(".guess-content");

const userOptions = document.querySelector(".user-options");
const mbUserLogged = document.querySelector(".user-logged-content");

window.onload = () => {
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
            getUserOpt.style.display = "none"
            getGuessOpt.style.display = "none";
            userOptions.style.display = "flex";
            mbUserLogged.style.display = "flex";

        } else {
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

const usernameDisplay = document.querySelector(".user-button");
const logOutButton = document.querySelector(".logout");
const profileButton = document.querySelector(".profile");

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

function logOutEvent() {
    logOut();
    localStorage.removeItem("token");
    window.location.href = "../../index.html";
}

// Llamada para verificar el rol y ejecutar la acción
obtenerRolUsuario();
//</|ROLES|>

//<|VERIFICACIÓN|>
async function verificarAccesoAdmin() {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "../user-section/login.html"; // Redirigir a la página de login
        return;
    }

    try {
        const response = await axios.get("/usuario/admin-only", {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log(response.data.message); // Mensaje de éxito
    } catch (error) {
        console.error("Acceso denegado:", error.response?.data?.message || error.message);
        window.location.href = "/"; // Redirigir a otra página
    }
}

verificarAccesoAdmin();
//</|VERIFICACIÓN|>

//<|GESTIÓN DE PRODUCTOS|>
//FILTRAR PRODUCTOS
const filterButton = document.getElementById("filter");
const filterContainer = document.querySelector(".filter-container");

filterButton.addEventListener("click", (e) => {
    e.preventDefault();

    filterContainer.classList.toggle("filter-container-visible");
});

// FILTRAR PRODUCTOS CON CHECKBOXES

const cargarFiltradoCategorias = async () => {
    try {
        const respuesta = await axios.get('/producto/categorias'); // Ruta para obtener categorías
        const categorias = respuesta.data;

        const contenedorCategorias = document.querySelector('.filter-container');
        contenedorCategorias.innerHTML = ''; // Limpiar contenido previo

        categorias.forEach(categoria => {
            const label = document.createElement('label');
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.value = categoria.nombreCategoria;
            checkbox.classList.add('categoria-checkbox');

            label.textContent = categoria.nombreCategoria;
            label.prepend(checkbox);

            contenedorCategorias.appendChild(label);
        });

        // Escuchar cambios en los checkboxes
        const checkboxes = document.querySelectorAll('.categoria-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', filtrarProductos);
        });
    } catch (error) {
        console.error('Error al cargar categorías:', error);
    }
};

const filtrarProductos = async () => {
    try {
        // Obtener checkboxes de categorías seleccionadas
        const checkboxes = document.querySelectorAll('.categoria-checkbox');
        const categoriasSeleccionadas = Array.from(checkboxes)
            .filter(checkbox => checkbox.checked) // Filtrar solo los marcados
            .map(checkbox => checkbox.value);

        // Construir la URL dependiendo de si hay categorías seleccionadas
        const url = categoriasSeleccionadas.length > 0
            ? `/producto/selectedCat?categorias=${categoriasSeleccionadas.join(',')}`
            : '/producto/productos'; // Si no hay categorías seleccionadas, traer todos los productos

        // Hacer la solicitud al backend
        const respuesta = await axios.get(url);
        const productos = respuesta.data;

        // Limpiar contenedor y renderizar productos
        const divProducts = document.querySelector(".products-subcontainer");
        divProducts.innerHTML = ''; // Limpiar productos previos
        productos.forEach(producto => {
            renderProduct(producto);
        });
    } catch (error) {
        console.error('Error al filtrar productos:', error);
    }
};

// Función para cargar todos los productos al inicio
const cargarProductosIniciales = async () => {
    try {
        const respuesta = await axios.get('/producto/productos'); // URL para obtener todos los productos
        const productos = respuesta.data;

        // Renderizar todos los productos
        const divProducts = document.querySelector(".products-subcontainer");
        divProducts.innerHTML = ''; // Limpiar productos previos
        productos.forEach(producto => {
            renderProduct(producto);
        });
    } catch (error) {
        console.error('Error al cargar productos iniciales:', error);
    }
};

// Agregar eventos a las checkboxes
const inicializarEventosCheckboxes = () => {
    const checkboxes = document.querySelectorAll('.categoria-checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', filtrarProductos);
    });
};

// Inicialización al cargar la página
window.onload = async () => {
    await cargarProductosIniciales(); // Cargar todos los productos al inicio
    inicializarEventosCheckboxes(); // Agregar eventos a las checkboxes
};


// Renderizar productos al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    cargarFiltradoCategorias();
    getProductos(); // Traer todos los productos inicialmente
});


//SEPARAR Y MOSTRAR ID EN BARRA DE NAVEGACIÓN
const query = window.location.search.split("=");
const idProducto = query[1]

const redirect = (id, url) => {
    window.location.href = `${url}?product=${id}`;
}

// Función para obtener productos por categoría
const getProductos = async () => {
    try {
        // Llamada al backend para obtener productos filtrados
        const response = await axios.get(`/producto/productos`);
        const productos = response.data;

    } catch (error) {
        console.error("Error al obtener productos:", error);
    }
};

const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`/producto/eliminar-producto/${id}`);
    } catch (error) {
        console.log(error.message);
    }
}

// Función para renderizar un producto
const renderProduct = (producto) => {
    const divProducts = document.querySelector(".products-subcontainer");

    // DIVS
    const divItem = document.createElement("div");
    divItem.classList.add("product-box");
    
    const divVisual = document.createElement("div");
    divVisual.classList.add("visual");

    const divIdentifiers = document.createElement("div");
    divIdentifiers.classList.add("identifiers");

    const divIdContent = document.createElement("div");
    divIdContent.classList.add("id-content");

    const divProductOptions = document.createElement("div");
    divProductOptions.classList.add("product-options");

    const divTitleDeco = document.createElement("div");
    divTitleDeco.classList.add("title-deco");

    const divStockPrice = document.createElement("div");
    divStockPrice.classList.add("stock-price");

    const divStock = document.createElement("div");
    divStock.classList.add("stock");

    const divPrice = document.createElement("div");
    divPrice.classList.add("price");

    //VISUAL DIV
    const productImg = document.createElement("img");
    const divImg = document.createElement("div");
    productImg.classList.add("item-img");
    divImg.classList.add("item-img-div");
    productImg.setAttribute("src", producto.imgPortada || "../../media/default.png");
    divImg.appendChild(productImg);
    divVisual.appendChild(divImg);
    divVisual.appendChild(divIdentifiers);

    //IDENTIFIERS DIV
    const productName = document.createElement("h3");
    productName.classList.add("product-name");
    productName.textContent = producto.nombre || "Producto sin nombre";

    divTitleDeco.innerHTML = "&nbsp;"

    divIdentifiers.appendChild(divIdContent);
    divIdentifiers.appendChild(productName);
    divIdentifiers.appendChild(divTitleDeco);

    //ID CONTENT DIV
    const idContentId = document.createElement("p");
    idContentId.textContent = `ID: (${producto._id})`;

    const buttonEditProduct = document.createElement("button");
    buttonEditProduct.id = "edit-product";
    buttonEditProduct.innerHTML = `<i class="fa-regular fa-pen-to-square"></i>`;
    buttonEditProduct.addEventListener("click", () => {
        redirect(producto._id, "./edit-product.html");
    });

    const buttonDeleteProduct = document.createElement("button");
    buttonDeleteProduct.id = "delete-product";
    buttonDeleteProduct.innerHTML = `<i class="fa-regular fa-trash-can"></i>`;
    buttonDeleteProduct.addEventListener("click", () => {
        Swal.fire({
            title: "¿Estás seguro de borrar el siguiente producto?",
            text: `${producto.nombre}`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Confirmar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProduct(producto._id).then(() => {
                    Swal.fire("¡Eliminado!", "Producto eliminado con éxito.", "success");
                    // Actualizar el DOM
                    divItem.remove(); // Elimina el producto del DOM
                }).catch(error => {
                    Swal.fire("Error", "No se pudo eliminar el producto.", "error");
                });
            }
        });
    });
    

    divProductOptions.appendChild(buttonEditProduct);
    divProductOptions.appendChild(buttonDeleteProduct);

    divIdContent.appendChild(idContentId);
    divIdContent.appendChild(divProductOptions);

    //STOCK PRICE DIV
    const stockTitle = document.createElement("p");
    const stockAmount = document.createElement("span");
    stockTitle.textContent = "Stock";
    stockAmount.textContent = producto.stock || 0;

    divStock.appendChild(stockTitle);
    divStock.appendChild(stockAmount);

    const priceTitle = document.createElement("p");
    const priceAmount = document.createElement("span");
    priceTitle.textContent = "Precio";
    priceAmount.textContent = `$${producto.precio || 0}`;

    divPrice.appendChild(priceTitle);
    divPrice.appendChild(priceAmount);

    divStockPrice.appendChild(divStock);
    divStockPrice.appendChild(divPrice);

    //PRODUCT BOX DIV
    divItem.appendChild(divVisual);
    divItem.appendChild(divStockPrice);

    divProducts.appendChild(divItem);
};

// Iniciar la obtención de productos cuando se carga la página
document.addEventListener("DOMContentLoaded", getProductos);


//AGREGAR PRODUCTO
const addProductPage = document.getElementById('add-product');

const goToAdd = async () => {
    window.location.href = './add-product.html';
}

addProductPage.addEventListener('click', (e) => {
    goToAdd(e);
});

//</|GESTIÓN DE PRODUCTOS|>

// <|CATEGORÍAS|>
//AGREGAR CATEGORÍA
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
    } else {
        const CategoryToSend = {
            nombreCategoria
        };
    
        try {
            await axios.post("/producto/categoria", CategoryToSend)
        } catch (error) {
            console.log(error.response.data);
        }
    }
}

const categoryAdd = document.querySelector("#addCategoryBtn");
categoryAdd.addEventListener("click", (e) => {
    categoryRegister(e);
    location.reload();
});

//ELIMINAR CATEGORÍA
async function obtenerCategorias() {
    try {
        const response = await axios.get('/producto/categorias'); // URL de la API que devuelve las categorías
        const categorias = response.data; // Almacena las categorías obtenidas
        return categorias; // Devuelve las categorías obtenidas
    } catch (error) {
        console.error('Error al obtener categorías:', error);
    }
}

async function cargarCategorias() {
    const categorias = await obtenerCategorias();
    
    const selectContainer = document.getElementById("delCtgr");
    const excludeCategory = ["Suplementos", "Vasos", "Ofertas"]

    categorias.forEach(categoria => {
        // Verifica si la categoría es la que quieres evitar renderizar
        if (excludeCategory.includes(categoria.nombreCategoria)) {
            return; // Salta esta categoría
        }
    
        // Renderiza la categoría normalmente
        const catOption = document.createElement("option");
        catOption.value = categoria.nombreCategoria;
        catOption.text = categoria.nombreCategoria;
        selectContainer.appendChild(catOption);
    });
    
    
}

cargarCategorias();

async function eliminarCategoria() {
    const selectedCategory = document.getElementById("delCtgr").value;

    try {
        await axios.delete(`/producto/eliminar-categoria/${selectedCategory}`);
        alert("Categoría eliminada con éxito.");
        location.reload();
    } catch (error) {
        console.error("Error al eliminar la categoría:", error.response.data);
    }

}

const deleteCategoriaBtn = document.getElementById("delCategoryBtn");

deleteCategoriaBtn.addEventListener("click", (e) => {
    e.preventDefault();
    eliminarCategoria();
});
// </|CATEGORÍAS|>

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