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

    console.log(categorias);
    
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
    const productMultiImgInput = document.querySelector("#productImages");
    const productCategoryInput = document.querySelector("#category");

    const productNameValue = productNameInput.value;
    const productDescValue = productDescInput.value;
    const productStockValue = productStockInput.value.replace(/\./g, '');
    const productPriceValue = productPriceInput.value.replace(/\./g, '');
    const productImgValue = productImgInput.value;
    const productCategoryValue = productCategoryInput.value;

    return {
        nombre : productNameValue,
        descripcion: productDescValue,
        stock: parseInt(productStockValue, 10),
        precio: parseFloat(productPriceValue),
        categoria: productCategoryValue,
        imgPortada: productImgValue
    }
}

const productRegister = async (e) => {
    e.preventDefault();
    const {nombre, descripcion, stock, precio, imgPortada, categoria} = getInputValues();
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!nombre || !descripcion || !stock || !precio || !categoria) {
        Swal.fire({
            icon: "error",
            title: "¡Epa!",
            text: "Porfavor, completa los campos necesarios."
          });
        return;
    }

    if (imgPortada && imgPortada.length >= 1){
        if (!urlRegex.test(imgPortada)) {
            swal({
                title: "Por favor, ingresa una URL válida.",
                icon: 'warning'
            });
            return;
        }
    } 

    const ObjectsToSend = {
        nombre,
        descripcion,
        stock,
        precio,
        categoria,
        imgPortada
    };

    console.log(ObjectsToSend)

    try {
        await axios.post("/producto/agregarProducto", ObjectsToSend)
        location.reload();
    } catch (error) {
        console.log(error.response.data);
        
    }
}

const productAdd = document.querySelector("#addProduct");
productAdd.addEventListener("click", (e) => {
    productRegister(e);
})

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