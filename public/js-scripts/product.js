// <|COOKIES|>
document.addEventListener('DOMContentLoaded', () => {
  const banner = document.getElementById('cookie-banner');
  const acceptButton = document.getElementById('accept-cookies');

  // Mostrar el banner si el usuario no aceptó cookies
  if (!localStorage.getItem('cookies-accepted')) {
      setTimeout(() => {
          banner.style.bottom = '0'; // Mueve el banner hacia arriba con la animación
      }, 100); // Retardo para que la transición sea visible
  }

  // Ocultar el banner y guardar el consentimiento
  acceptButton.addEventListener('click', () => {
      localStorage.setItem('cookies-accepted', 'true');
      banner.style.bottom = '-200px';
      setTimeout(() => {
          banner.remove();
      }, 900);
  });
});
// </|COOKIES|>

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
                    src="../../media/icons/circle-user-solid.svg"
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
  window.location.href = "../../index.html";
}

//Botón de Admin
const admBtn = document.getElementById("mg-sect");
admBtn.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.href = "../admin-section/manage.html";
});

// Llamada para verificar el rol y ejecutar la acción
obtenerRolUsuario();
//</|ROLES|>

// <|Toggle Sidebar|>
const sidebar = document.querySelector(".mb-sidebar");
const openBtn = document.querySelector(".open-sidebar");

openBtn.addEventListener("click", (e) => {
  e.preventDefault();
  sidebar.classList.toggle("sidebar-open");
});
// </|Toggle Sidebar|>

//VER MÁS INFO
function verMas() {
  Swal.fire({
    title: "Aqui va una ficha tecnica o eso",
    text: "Pronto",
    icon: "question",
  });
}

// SEPARAR Y MOSTRAR ID EN BARRA DE NAVEGACIÓN
const query = window.location.search.split("=");
const idProduct = query[1];

const redirect = async (id, url) => {
  window.location.href = `${url}?product=${id}`;
  console.log(id);
};

function renderProduct(Productos) {
  const titleContent = document.querySelector("title");

  const divProductAbout = document.querySelector(".product-about");
  const divProductContainer = document.querySelector(".product-container");
  const divProductImg = document.querySelector(".product-img");
  const divPriceOptions = document.querySelector(".product-price-options");
  const divProductNameDesc = document.querySelector(".name-desc");

  const productName = document.querySelector(".product-name");
  const productDetails = document.querySelector(".more-details");
  const confirmBuy = document.querySelector(".inBuyButton");
  const productDesc = document.querySelector("#description-p");
  const stockCheck = document.querySelector(".stock-available");
  const productPriceDiv = document.querySelector(".product-price");
  const productPrice = document.querySelector("#price");

  const isStock = document.createElement("div");
  const productBasePrice = document.createElement("span");
  const productDescName = document.createElement("h2");
  const productImg = document.createElement("img");

  productBasePrice.id = "price";

  let nameVerify = Productos.nombre ? Productos.nombre : error;
  titleContent.textContent = nameVerify;
  productName.textContent = nameVerify;
  productDescName.textContent = nameVerify;

  let descVerify = Productos.descripcion ? Productos.descripcion : error;
  productDesc.innerHTML = descVerify;

  let imgVerify = Productos.imgPortada
    ? Productos.imgPortada
    : "../media/icons/default.png";
  productImg.setAttribute("src", imgVerify);

  let priceVerify = Productos.precio ? Productos.precio : error;
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

  let stockVerify = Productos.stock ? Productos.stock : 0;
  let amountVerify = document.querySelector(".add-amount");
  if (stockVerify <= 0) {
    isStock.style.color = "red";
    isStock.style.margin = "2vh 0"
    isStock.innerHTML = 
    `<strong style="color:red">NO HAY STOCK</strong>`;

    amountVerify.style.display = "none";

    confirmBuy.style.backgroundColor = "#2f5245";
    confirmBuy.id = "out-stock";
    confirmBuy.disabled = true;
    confirmBuy.value = "Sin stock"
  } else {
    isStock.style.display = "flex";
    isStock.style.flexDirection = "column";
    isStock.style.margin = "2vh 0"
    isStock.innerHTML = 
    `<strong style="color:green">HAY DISPONIBILIDAD DE STOCK</strong>
    <span>(Restante: ${stockVerify} unidades)</span>`;
  }

  divProductImg.append(productImg);
  divProductNameDesc.append(productDescName);
  divProductNameDesc.append(productDesc);
  stockCheck.append(isStock);

  const decreaseButton = document.getElementById("decrease");
  const increaseButton = document.getElementById("increase");

  decreaseButton.addEventListener("click", (e) => {
    e.preventDefault();
    let currentQuantity = parseInt(document.getElementById("amount-buy").value);
    if (currentQuantity > 1) {
      currentQuantity--;
      document.getElementById("amount-buy").value = currentQuantity;
    }
  });

  increaseButton.addEventListener("click", (e) => {
    e.preventDefault();
    let currentQuantity = parseInt(document.getElementById("amount-buy").value);
    if (currentQuantity < Productos.stock) {
      currentQuantity++;
      document.getElementById("amount-buy").value = currentQuantity;
      if (currentQuantity > Productos.stock) {
        currentQuantity = Productos.stock;
      }
    }
  });
}

const getProduct = async () => {
  try {
    const response = await axios.get(`/producto/selected/${idProduct}`);
    console.log(response);
    // Envolver el objeto en un array si no es un array
    const products = Array.isArray(response.data)
      ? response.data
      : [response.data];

    // Ahora puedo usar map
    products.map((Productos) => {
      renderProduct(Productos);
    });
  } catch (error) {
    console.log(error);
  }
};

getProduct();

//<|CONTACTO|>
const getSociales = async () => {
  try {
    const response = await axios.get("/pagina/contactos");
    const contacto = response.data; // Almacena la URL de Instagram obtenida

    contacto.forEach((contactos) => {

      const facebookIcon = document.getElementById("facebook");
      const instagramIcon = document.getElementById("instagram");
      const twitterIcon = document.getElementById("twitter");
      const youtubeIcon = document.getElementById("youtube");

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
