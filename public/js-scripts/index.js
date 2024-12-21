// <|SLIDESHOWS|>
let slideIndex = 0;
let slides = document.getElementsByClassName("slidesDiv");
const totalSlides = slides.length;

function showSlides() {
  for (let i = 0; i < slides.length; i++) {
    slides[i].style.transform = `translateX(${100 * (i - slideIndex)}%)`;
  }
}

// Cambiar al siguiente o anterior slide
function plusSlides(n) {
  slideIndex = (slideIndex + n + totalSlides) % totalSlides;
  showSlides();
}

// Configurar el slider inicial
showSlides();
setInterval(() => plusSlides(1), 5000); // Cambiar slide automáticamente cada 2 segundos
// </|SLIDESHOWS|>



//<|ROLES|>
//Verificacion de Rol
const getAdm = document.querySelector(".adm");
const getUserOpt = document.querySelector(".user-navs");

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
        console.log(error.response.data);
        
    }
}

//Botón de Admin
const admBtn = document.getElementById('mg-sect');
admBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = './sections/admin-section/manage.html';
});

// Llamada para verificar el rol y ejecutar la acción
obtenerRolUsuario();
//</|ROLES|>


//<|PRODUCTOS|>
//Obtener Categorias
async function obtenerCategorias() {
    try {
        const response = await axios.get('/producto/categorias');
        const categorias = response.data; // Almacena las categorías obtenidas
        return categorias;
    } catch (error) {
        console.error('Error al obtener categorías:', error);
    }
}

async function trySeccion() {
    const seccion = await obtenerCategorias();
    window.location.href = `./categorias/seccion.html?seccion=${seccion.nombreCategoria}`
}

const redirect = (id, url) => {
    window.location.href = `${url}?product=${id}`;
}

const renderProduct = (Productos) => {
    const ulProducts = document.querySelector(".products-main")
    const categoryUl1 = document.querySelector("#ofertas");
    const categoryUl2 = document.querySelector("#vasos");
    const categoryUl3 = document.querySelector("#suplementos");

    const liItem = document.createElement("li");
    const productName = document.createElement("span");
    const productPrice = document.createElement("span");
    const productImg = document.createElement("img");
    const buyButton = document.createElement("button");

    const divItemContent = document.createElement("div");

    divItemContent.classList.add("item-content");
    productImg.classList.add("item-img");
    buyButton.classList.add("buy-button");
    liItem.classList.add("item-main");

    buyButton.innerHTML = `Comprar <i class="fa-solid fa-basket-shopping" style="color: #FFD43B;"></i>`;

    let priceVerify = Productos.precio ? Productos.precio : "Null"
    productPrice.textContent = `Precio: $${priceVerify}`;

    let nameVerify = Productos.nombre ? Productos.nombre : "Null"
    productName.textContent = nameVerify;

    let imgVerify = Productos.imgPortada ? Productos.imgPortada : "./media/default.png";
    productImg.setAttribute("src", imgVerify);

    if (Productos.categoria === 'Aminoacidos') {
        categoryUl1.append(liItem);
    }

    if (Productos.categoria === 'Vasos y Shakers') {
        categoryUl2.append(liItem);
    }

    if (Productos.categoria === 'Suplemento') {
        categoryUl3.append(liItem);
    }

    liItem.appendChild(productImg);
    divItemContent.appendChild(productName);
    divItemContent.appendChild(productPrice);
    liItem.appendChild(buyButton);
    liItem.appendChild(divItemContent)

    buyButton.addEventListener("click", () => {
        redirect(Productos._id,`./sections/product-section/product.html`)
    })
}

//OBTENER PRODUCTOS (MODELO BACKEND)

const getProductos = async () => {
    try {
        const response = await axios.get(`/producto/productos`);
        response.data.map((Productos) => {
            renderProduct(Productos)
        })
    } catch (error) {
        console.log(error);
        
    }
}

getProductos();
//</|PRODUCTOS|>

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