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

//Botón de Admin
const admBtn = document.getElementById('mg-sect');
admBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = './manage.html';
});

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

//<|PRODUCTO|>
//Formatear el texto del precio
const inputFieldPrice = document.getElementById('price');

inputFieldPrice.addEventListener('input', (event) => {
    let value = event.target.value;

    // Elimina cualquier carácter no numérico (excepto el punto decimal)
    value = value.replace(/\D/g, '');

    // Formatea el número con puntos cada mil
    value = new Intl.NumberFormat('es-ES').format(value);

    // Asigna el valor formateado de nuevo al input
    event.target.value = value;
});

const inputFieldStock = document.getElementById('stock');

inputFieldStock.addEventListener('input', (event) => {
    let value = event.target.value;

    // Elimina cualquier carácter no numérico (excepto el punto decimal)
    value = value.replace(/\D/g, '');

    // Formatea el número con puntos cada mil
    value = new Intl.NumberFormat('es-ES').format(value);

    // Asigna el valor formateado de nuevo al input
    event.target.value = value;
});

//Obtener Categorias
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
    
    const selectContainer = document.querySelector("#category");

    categorias.forEach(categoria => {
        const catOption = document.createElement("option");
        catOption.value = categoria.nombreCategoria;
        catOption.text = categoria.nombreCategoria;

    selectContainer.appendChild(catOption);
    });
    
}

cargarCategorias();

function getInputValues() {
    const productNameInput = document.querySelector("#productName");
    const productDescInput = document.querySelector("#productDesc");
    const productStockInput = document.querySelector("#stock");
    const productPriceInput = document.querySelector("#price");
    const productImgInput = document.querySelector("#image");
    const productCategoryInput = document.querySelector("#category");

    const productNameValue = productNameInput.value;
    const productDescValue = productDescInput.value;
    const productStockValue = productStockInput.value.replace(/\./g, '');
    const productPriceValue = productPriceInput.value.replace(/\./g, '');
    const productImgValue = productImgInput.value;
    const productCategoryValue = productCategoryInput.value;

    // Solo devuelve campos que tienen un valor
    const dataToUpdate = {};
    if (productNameValue) dataToUpdate.nombre = productNameValue;
    if (productDescValue) dataToUpdate.descripcion = productDescValue;
    if (productStockValue) dataToUpdate.stock = parseInt(productStockValue, 10);
    if (productPriceValue) dataToUpdate.precio = parseFloat(productPriceValue);
    if (productImgValue) dataToUpdate.imgPortada = productImgValue;
    if (productCategoryValue) dataToUpdate.categoria = productCategoryValue;

    return dataToUpdate;
}

const productModify = async (e) => {
    e.preventDefault();

    // Obtener el ID del producto desde la URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('product');

    if (!productId) {
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se encontró el ID del producto en la URL."
        });
        return;
    }

    const dataToUpdate = getInputValues();
    if (Object.keys(dataToUpdate).length === 0) {
        Swal.fire({
            icon: "error",
            title: "¡Ups!",
            text: "No has modificado ningún campo."
        });
        return;
    }

    console.log("Datos a enviar:", dataToUpdate);

    try {
        // Enviar solo los datos modificados al backend
        const response = await axios.put(`/producto/editar-producto/${productId}`, dataToUpdate);
        Swal.fire({
            icon: "success",
            title: "Producto modificado",
            text: "El producto se actualizó correctamente."
        });
        console.log(response.data);
        location.reload(); // Opcional: actualiza dinámicamente el DOM en lugar de recargar.
    } catch (error) {
        console.error("Error al modificar el producto:", error.response?.data || error.message);
        Swal.fire({
            icon: "error",
            title: "Error",
            text: "No se pudo modificar el producto."
        });
    }
};


const productEdit = document.querySelector("#editProduct");
productEdit.addEventListener("click", (e) => {
    productModify(e);
    goBack(e);
});



const goBack = async (e) => {
    e.preventDefault();
    try {
        window.history.back();
    } catch (error) {
        console.log(error);
        
    }
}

backButton.addEventListener('click', (e) =>{
    goBack(e);
    window.onload = function() {
        location.reload();
    };
})

// SEPARAR Y MOSTRAR ID EN BARRA DE NAVEGACIÓN
const query = window.location.search.split("=");
const idProduct = query[1];

const redirect = async (id, url) => {
    window.location.href = `${url}?product=${id}`;
    console.log(id);
    
}

function renderProduct(Productos) {

    const productName  = document.getElementById("productName");
    let nameVerify = Productos.nombre ? Productos.nombre : error;
    productName.value = nameVerify;

    const productDesc  = document.getElementById("editor-textarea");
    let descVerify = Productos.descripcion ? Productos.descripcion : error;
    productDesc.innerHTML = quill.clipboard.dangerouslyPasteHTML(descVerify);

    const currentImg = document.getElementById("current-img");
    const currentImgUrl = document.getElementById("image");
    let imgVerify = Productos.imgPortada ? Productos.imgPortada : ("../../media/default.png");
    currentImg.setAttribute("src", imgVerify);
    currentImgUrl.value = imgVerify;

    const productPrice  = document.getElementById("price");
    let priceVerify = Productos.precio ? Productos.precio : error;
    let precioFormateado = new Intl.NumberFormat('es-ES').format(priceVerify);
    productPrice.value = precioFormateado;

    const isStock  = document.getElementById("stock");
    let stockVerify = Productos.stock ? Productos.stock : error;
    if (!stockVerify) {
        isStock.value = 'N/A'
    } else {
        isStock.value = stockVerify;
    }

    const category = document.getElementById("category");
    let catVerify = Productos.categoria ? Productos.categoria : error;
    category.value = catVerify;

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
//</|PRODUCTO|>