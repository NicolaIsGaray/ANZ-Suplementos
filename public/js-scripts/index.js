// <|OCULTAR SWIPER BULLETS|>
const swiperContainer = document.querySelectorAll('swiper-container');
swiperContainer.forEach(shown => {
    shown.pagination = false;
});
// </|OCULTAR SWIPER BULLETS|>

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
    window.location.href = "./index.html";
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

const redirect = (id, url) => {
    window.location.href = `${url}?product=${id}`;
}

const renderProduct = (Productos) => {
    const category1 = document.querySelector("#Ofertas");
    const category2 = document.querySelector("#Vasos");
    const category3 = document.querySelector("#Suplementos");

    const liItem = document.createElement("li");
    const swiperSlider = document.createElement("swiper-slide");
    const productName = document.createElement("span");
    const productPrice = document.createElement("span");
    const productImg = document.createElement("img");
    const buyButton = document.createElement("button");

    const divImg = document.createElement("div");
    const divItemContent = document.createElement("div");

    divItemContent.classList.add("item-content");
    divImg.classList.add("item-img-div");
    productImg.classList.add("item-img");
    buyButton.classList.add("buy-button");
    liItem.classList.add("item-main");

    productName.id = "name-product";
    productPrice.id = "price";

    buyButton.innerHTML = `COMPRAR <i class="fa-solid fa-basket-shopping" style="color: #FFD43B;"></i>`;

    let priceVerify = Productos.precio ? Productos.precio : "Null"
    productPrice.textContent = `$${priceVerify}`;

    let nameVerify = Productos.nombre ? Productos.nombre : "Null"
    productName.textContent = nameVerify;

    let imgVerify = Productos.imgPortada ? Productos.imgPortada : "./media/default.png";
    productImg.setAttribute("src", imgVerify);

    if (Productos.categoria === 'Ofertas') {
        category1.append(swiperSlider);
    }

    if (Productos.categoria === 'Vasos') {
        category2.append(swiperSlider);
    }

    if (Productos.categoria === 'Suplementos') {
        category3.append(swiperSlider);
    }

    divImg.appendChild(productImg);
    swiperSlider.appendChild(liItem);
    liItem.appendChild(divImg);
    divItemContent.appendChild(productName);
    divItemContent.appendChild(productPrice);
    divItemContent.appendChild(buyButton);
    liItem.appendChild(divItemContent);

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