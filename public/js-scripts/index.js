// <|COOKIES|>
document.addEventListener("DOMContentLoaded", () => {
  const banner = document.getElementById("cookie-banner");
  const acceptButton = document.getElementById("accept-cookies");

  // Mostrar el banner si el usuario no aceptó cookies
  if (!localStorage.getItem("cookies-accepted")) {
    setTimeout(() => {
      banner.style.bottom = "0"; // Mueve el banner hacia arriba con la animación
    }, 100); // Retardo para que la transición sea visible
  }

  // Ocultar el banner y guardar el consentimiento
  acceptButton.addEventListener("click", () => {
    localStorage.setItem("cookies-accepted", "true");
    banner.style.bottom = "-200px";
    setTimeout(() => {
      banner.remove();
    }, 900);
  });
});
// </|COOKIES|>

// <|OCULTAR SWIPER BULLETS|>
const swiperContainer = document.querySelectorAll("swiper-container");
swiperContainer.forEach((shown) => {
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
                    src="./media/icons/circle-user-solid.svg"
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
  window.location.href = "./index.html";
}

//Botón de Admin
const admBtn = document.getElementById("mg-sect");
admBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "./sections/admin-section/manage.html";
});

// Llamada para verificar el rol y ejecutar la acción
obtenerRolUsuario();
//</|ROLES|>

//<|PRODUCTOS|>
//Obtener Categorias
async function obtenerCategorias() {
  try {
    const response = await axios.get("/producto/categorias");
    const categorias = response.data; // Almacena las categorías obtenidas
    return categorias;
  } catch (error) {
    console.error("Error al obtener categorías:", error);
  }
}

const redirect = (id, url) => {
  window.location.href = `${url}?product=${id}`;
};

const renderProduct = (Productos) => {
  const category1 = document.querySelector("#Ofertas");
  const category2 = document.querySelector("#Vasos");
  const category3 = document.querySelector("#Suplementos");

  const liItem = document.createElement("li");
  const swiperSlider = document.createElement("swiper-slide");
  const productName = document.createElement("span");
  const productPriceDiv = document.createElement("div");
  const productBasePrice = document.createElement("span");
  const productImg = document.createElement("img");
  const buyButton = document.createElement("button");

  const divImg = document.createElement("div");
  const divItemContent = document.createElement("div");

  divItemContent.classList.add("item-content");
  divImg.classList.add("item-img-div");
  productImg.classList.add("item-img");
  buyButton.classList.add("buy-button");
  liItem.classList.add("item-main");
  productPriceDiv.classList.add("product-price");

  productName.id = "name-product";
  productBasePrice.id = "price";

  buyButton.innerHTML = `COMPRAR <i class="fa-solid fa-basket-shopping" style="color: #FFD43B;"></i>`;

  let priceVerify = Productos.precio ? Productos.precio : "Null";

  priceVerify = new Intl.NumberFormat("es-ES").format(priceVerify);

  productBasePrice.textContent = `$${priceVerify}`;

  if (Productos.oferta.enOferta) {
    const comparitionDiv = document.createElement("div");
    comparitionDiv.classList.add("comparition-div");

    const discountSpan = document.createElement("strong");
    discountSpan.id = "discount-amount";
    discountSpan.textContent = `-${Productos.oferta.descuento}% OFF`;
    productPriceDiv.appendChild(discountSpan);

    const productDiscountPrice = document.createElement("span");
    priceVerify =
      Productos.precio - (Productos.precio * Productos.oferta.descuento) / 100;
    priceVerify = new Intl.NumberFormat("es-ES").format(priceVerify);
    productDiscountPrice.id = "price-discount";
    productDiscountPrice.textContent = `$${priceVerify}`;

    productBasePrice.style.textDecoration = "line-through";
    productBasePrice.style.opacity = "0.4";
    productBasePrice.style.fontSize = "14px";

    comparitionDiv.appendChild(productDiscountPrice);
    comparitionDiv.appendChild(productBasePrice);
    productPriceDiv.appendChild(comparitionDiv);
  } else {
    productBasePrice.textContent = `$${priceVerify}`;
    productPriceDiv.appendChild(productBasePrice);
  }

  let nameVerify = Productos.nombre ? Productos.nombre : "Null";
  productName.textContent = nameVerify;

  let imgVerify = Productos.imgPortada
    ? Productos.imgPortada
    : "./media/default.png";
  productImg.setAttribute("src", imgVerify);

  if (Productos.categoria.includes("Vasos")) {
    category2.append(swiperSlider);
    if (Productos.categoria.includes("Ofertas")) {
      category1.appendChild(swiperSlider);
    }
  }

  if (Productos.categoria.includes("Suplementos")) {
    category3.append(swiperSlider);
    if (Productos.categoria.includes("Ofertas")) {
      category1.append(swiperSlider);
    }
  }

  // Agregar un pequeño retraso para cada producto
  setTimeout(() => {
    liItem.classList.add("fade-in");
  }, 100); // Aumentar el retraso en 100ms para cada producto

  divImg.appendChild(productImg);
  swiperSlider.appendChild(liItem);
  liItem.appendChild(divImg);
  divItemContent.appendChild(productName);
  divItemContent.appendChild(productPriceDiv);
  divItemContent.appendChild(buyButton);
  liItem.appendChild(divItemContent);

  buyButton.addEventListener("click", () => {
    redirect(Productos._id, `./sections/product-section/product.html`);
  });
};

//OBTENER PRODUCTOS (MODELO BACKEND)

const getProductos = async () => {
  try {
    const response = await axios.get(`/producto/productos`);
    response.data.map((Productos) => {
      renderProduct(Productos);
    });
  } catch (error) {
    console.log(error);
  }
};

getProductos();
//</|PRODUCTOS|>

//<|CONTACTO|>
const getSociales = async () => {
  try {
    const response = await axios.get("/pagina/contactos");
    const contacto = response.data;

    contacto.forEach((contactos) => {
      const whatsapp = document.getElementById("wa-cont");

      const facebookIcon = document.getElementById("facebook");
      const instagramIcon = document.getElementById("instagram");
      const twitterIcon = document.getElementById("twitter");
      const youtubeIcon = document.getElementById("youtube");

      whatsapp.href = `https://wa.me/${contactos.telefono}`;

      facebookIcon.href = contactos.facebook;
      instagramIcon.href = contactos.instagram;
      twitterIcon.href = contactos.twitter;
      youtubeIcon.href = contactos.youtube;
    });
  } catch (error) {
    console.error("Error al obtener URL de Youtube:", error.response.data);
  }
};

getSociales();
//</|CONTACTO|>
