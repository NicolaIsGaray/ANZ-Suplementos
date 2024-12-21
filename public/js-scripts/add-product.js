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
        window.history.back();
    } catch (error) {
        console.log(error.response.data);
        
    }
}

const productAdd = document.querySelector("#addProduct");
productAdd.addEventListener("click", (e) => {
    productRegister(e);
})

const backButton = document.getElementById('backButton');

backButton.addEventListener("mouseover", () => {
    backButton.value = '¿Regresar?';
})

backButton.addEventListener("mouseout", () => {
    backButton.value = 'Regresar';
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