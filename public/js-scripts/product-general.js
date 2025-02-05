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

// <|Toggle Filters|>
const getFiltersButton = document.getElementById("mb-filter");
const getFiltersCloser = document.getElementById("close-filter-mb");
const getFiltersMobile = document.querySelector(".product-selection-container");
const admDiv = document.querySelector(".adm");

getFiltersButton.addEventListener("click", (e) => {
  e.preventDefault();
  getFiltersMobile.classList.toggle("product-selection-container-open");
  admDiv.style.position = "fixed";
  admDiv.style.zIndex = "0";
});

getFiltersCloser.addEventListener("click", (e) => {
  e.preventDefault();
  getFiltersMobile.classList.remove("product-selection-container-open");
  admDiv.style.position = "fixed";
  admDiv.style.zIndex = "1";
});
// </|Toggle Filters|>

//SEPARAR Y MOSTRAR ID EN BARRA DE NAVEGACIÓN
const query = window.location.search.split("=");
const idProducto = query[1];

const redirect = (id, url) => {
  window.location.href = `${url}?product=${id}`;
};

// Función para obtener la categoría desde la URL
const getCategoriaFromURL = () => {
  const params = new URLSearchParams(window.location.search);
  return params.get("section"); // Devuelve la sección, ej: "suplementos"
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
    productos.forEach((producto) => {
      renderProduct(producto);
    });
  } catch (error) {
    console.error("Error al obtener productos por categoría:", error);
  }
};

const getProductForFilter = async () => {
  const seccion = getCategoriaFromURL();

  try {
    const response = await fetch(`/producto/filtrado?section=${seccion}`);
    const productos = await response.json();
    return productos;
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return [];
  }
};

// Función para renderizar un producto
const renderProduct = (producto) => {
  const divProducts = document.querySelector(".products-card");

  // Crear elementos del producto
  const divItem = document.createElement("div");
  divItem.classList.add("item-main");

  const divItemContent = document.createElement("div");
  divItemContent.classList.add("item-content");

  const productImg = document.createElement("img");
  const divImg = document.createElement("div");
  divImg.classList.add("item-img-div");
  productImg.classList.add("item-img");
  let imgVerify = producto.imgPortada
    ? producto.imgPortada
    : "../../media/default.png";
  productImg.setAttribute("src", imgVerify);
  divImg.appendChild(productImg);

  const productName = document.createElement("span");
  productName.id = "name-product";
  let nameVerify = producto.nombre ? producto.nombre : "Null";
  productName.textContent = nameVerify;

  const productPriceDiv = document.createElement("div");
  const productBasePrice = document.createElement("span");
  productPriceDiv.classList.add("product-price");
  productBasePrice.id = "price";
  let priceVerify = producto.precio ? producto.precio : "Null";
  productBasePrice.textContent = `$${priceVerify}`;

  if (producto.oferta.enOferta) {
    const comparitionDiv = document.createElement("div");
    comparitionDiv.classList.add("comparition-div");

    const discountSpan = document.createElement("strong");
    discountSpan.id = "discount-amount";
    discountSpan.textContent = `-${producto.oferta.descuento}% OFF`;
    productPriceDiv.appendChild(discountSpan);

    const productDiscountPrice = document.createElement("span");
    priceVerify =
      producto.precio - (producto.precio * producto.oferta.descuento) / 100;
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

  const buyButton = document.createElement("button");
  buyButton.classList.add("buy-button");
  buyButton.innerHTML = `COMPRAR <i class="fa-solid fa-basket-shopping" style="color: #FFD43B;"></i>`;

  // Evento para redirigir al detalle del producto
  buyButton.addEventListener("click", () => {
    redirect(producto._id, `./product.html`);
  });

  const categoriaCheck = getCategoriaFromURL();

  const sectionName = document.querySelectorAll(".section-name");

  sectionName.forEach((section) => {
    // Si estamos en la categoría de Ofertas
    if (categoriaCheck === "Ofertas") {
      // Filtrar productos que no están en oferta
      if (!producto.oferta.enOferta) {
        return; // Saltar productos que no estén en oferta
      }

      // Cambiar el texto de la sección para Ofertas
      section.textContent = `Ofertas Especiales`;

      // Renderizar productos en oferta con efecto fade-in
      setTimeout(() => {
        divItem.classList.add("fade-in");
      }, 100);

      // Agregar elementos al contenedor principal del producto
      divItem.appendChild(divImg);
      divItemContent.appendChild(productName);
      divItemContent.appendChild(productPriceDiv);
      divItemContent.appendChild(buyButton);
      divItem.appendChild(divItemContent);

      divProducts.appendChild(divItem);
    }
    // Si estamos en otra categoría registrada
    else if (producto.categoria.includes(categoriaCheck)) {
      // Cambiar el texto de la sección según la categoría
      if (producto.categoria.includes("Vasos")) {
        section.textContent = `Vasos y Shakers`;
      } else if (producto.categoria.includes("Suplementos")) {
        section.textContent = `Suplementos Deportivos`;
      }

      // Renderizar productos con efecto fade-in
      setTimeout(() => {
        divItem.classList.add("fade-in");
      }, 100);

      // Agregar elementos al contenedor principal del producto
      divItem.appendChild(divImg);
      divItemContent.appendChild(productName);
      divItemContent.appendChild(productPriceDiv);
      divItemContent.appendChild(buyButton);
      divItem.appendChild(divItemContent);

      divProducts.appendChild(divItem);
    }
  });
};

getProductosPorCategoria();

//<-FUNCIÓN DE FILTRADO->
const filter = async () => {
  const productos = await getProductForFilter();
  const categoriaCheck = getCategoriaFromURL();

  const colorCount = {}; // Contenedor de colores y sus cantidades
  const saborCount = {}; // Contenedor de sabores y sus cantidades
  const tamañoCount = {}; // Contenedor de tamaños y sus cantidades
  const marcaCount = {}; // Contenedor de marcas y sus cantidades
  const subcategoriaCount = {}; // Contenedor de subcategorías y sus cantidades
  const pesoCount = {}; // Contenedor de pesos y sus cantidades

  productos.forEach((producto) => {
    let filtros = {};

    // if (
    //   categoriaCheck === "Suplementos" &&
    //   producto.categoria.includes("Suplementos")
    // ) {
    //   filtros = {
    //     subcategoria: producto.subcategoria && producto.subcategoria.length > 0,
    //     color: Array.isArray(producto.color) && producto.color.length > 0,
    //     sabores: Array.isArray(producto.sabores) && producto.sabores.length > 0,
    //     peso: producto.peso && producto.peso.length > 0,
    //     tamaño: Array.isArray(producto.tamaño) && producto.tamaño.length > 0,
    //     marca: Array.isArray(producto.marca) && producto.marca.length > 0,
    //   };
    // } else if (categoriaCheck === "Vasos") {
    //   filtros = {
    //     subcategoria: producto.subcategoria && producto.subcategoria.length > 0,
    //     color: Array.isArray(producto.color) && producto.color.length > 0,
    //     tamaño: Array.isArray(producto.tamaño) && producto.tamaño.length > 0,
    //     marca: Array.isArray(producto.marca) && producto.marca.length > 0,
    //   };
    // } else if (categoriaCheck === "Ofertas") {
    //   console.log("HOLA");
    // }

    if (producto.categoria.includes(categoriaCheck)) {
      if (producto.categoria.includes("Suplementos")) {
        filtros = {
          subcategoria:
            producto.subcategoria && producto.subcategoria.length > 0,
          color: Array.isArray(producto.color) && producto.color.length > 0,
          sabores:
            Array.isArray(producto.sabores) && producto.sabores.length > 0,
          peso: producto.peso && producto.peso.length > 0,
          tamaño: Array.isArray(producto.tamaño) && producto.tamaño.length > 0,
          marca: Array.isArray(producto.marca) && producto.marca.length > 0,
        };
      } else if (producto.categoria.includes("Vasos")) {
        filtros = {
          subcategoria:
            producto.subcategoria && producto.subcategoria.length > 0,
          color: Array.isArray(producto.color) && producto.color.length > 0,
          tamaño: Array.isArray(producto.tamaño) && producto.tamaño.length > 0,
          marca: Array.isArray(producto.marca) && producto.marca.length > 0,
        };
      } else if (producto.categoria.includes("Ofertas")) {
        filtros = {
          subcategoria:
            producto.subcategoria && producto.subcategoria.length > 0,
          color: Array.isArray(producto.color) && producto.color.length > 0,
          sabores:
            Array.isArray(producto.sabores) && producto.sabores.length > 0,
          peso: producto.peso && producto.peso.length > 0,
          tamaño: Array.isArray(producto.tamaño) && producto.tamaño.length > 0,
          marca: Array.isArray(producto.marca) && producto.marca.length > 0,
        };
      }
    }

    // Mostrar u ocultar los filtros dinámicamente según los datos
    document.getElementById("category").style.display = filtros.subcategoria
      ? "flex"
      : "none";
    document.getElementById("color").style.display = filtros.color
      ? "flex"
      : "none";
    document.getElementById("flavour").style.display = filtros.sabores
      ? "flex"
      : "none";
    document.getElementById("weight").style.display = filtros.peso
      ? "flex"
      : "none";
    document.getElementById("size").style.display = filtros.tamaño
      ? "flex"
      : "none";
    document.getElementById("brand").style.display = filtros.marca
      ? "flex"
      : "none";

    // Contabilizar cada filtro según corresponda
    if (filtros.color) {
      producto.color.forEach((color) => {
        colorCount[color] = (colorCount[color] || 0) + 1;
      });
    }
    if (filtros.sabores) {
      producto.sabores.forEach((sabor) => {
        saborCount[sabor] = (saborCount[sabor] || 0) + 1;
      });
    }
    if (filtros.tamaño) {
      producto.tamaño.forEach((tamano) => {
        tamañoCount[tamano] = (tamañoCount[tamano] || 0) + 1;
      });
    }
    if (filtros.marca) {
      producto.marca.forEach((marca) => {
        marcaCount[marca] = (marcaCount[marca] || 0) + 1;
      });
    }
    if (filtros.subcategoria) {
      subcategoriaCount[producto.subcategoria] =
        (subcategoriaCount[producto.subcategoria] || 0) + 1;
    }
    if (filtros.peso) {
      pesoCount[producto.peso] = (pesoCount[producto.peso] || 0) + 1;
    }
  });

  // Mostrar los filtros en sus contenedores correspondientes
  const mostrarFiltro = (id, countObj) => {
    const filterList = document
      .getElementById(id)
      .querySelector(".filter-list");

    Object.keys(countObj).forEach((key) => {
      const divFilter = document.createElement("div");
      const labelEl = document.createElement("label");
      const inputCreate = document.createElement("input");

      divFilter.classList.add("filter-container");

      labelEl.textContent = `${key} (${countObj[key]})`;
      labelEl.setAttribute("for", key);

      inputCreate.setAttribute("type", "checkbox");
      inputCreate.setAttribute("id", key);

      // Asegurar que el atributo data-tipo sea específico al filtro (por ejemplo: colores, tamaños, etc.)
      inputCreate.setAttribute("data-tipo", id);

      // Asegurar que el valor del checkbox siga el formato filtro:valor
      inputCreate.setAttribute("value", `${key}`);

      divFilter.appendChild(inputCreate);
      divFilter.appendChild(labelEl);

      filterList.appendChild(divFilter);
    });
  };

  // Mostrar los colores
  mostrarFiltro("color", colorCount);

  // Mostrar los sabores
  mostrarFiltro("flavour", saborCount);

  // Mostrar los tamaños
  mostrarFiltro("size", tamañoCount);

  // Mostrar las marcas
  mostrarFiltro("brand", marcaCount);

  // Mostrar las subcategorías
  mostrarFiltro("category", subcategoriaCount);

  // Mostrar los pesos
  mostrarFiltro("weight", pesoCount);

  document
    .querySelectorAll('.filter-container input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", (e) => {
        filtrarProductos();
      });
    });
};

filter();

// FILTRAR PRODUCTOS CON CHECKBOXES
const filtrarProductos = async () => {
  try {
    // Obtener checkboxes de categorías y subcategorías seleccionadas
    const checkboxes = document.querySelectorAll(
      ".filter-container input[type=checkbox]"
    );
    const categoriasSeleccionadas = Array.from(checkboxes)
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    // Si las categorías seleccionadas están vacías, se pueden obtener todos los productos
    const urlCategoria =
      categoriasSeleccionadas.length > 0
        ? `/producto/selectedSubCat?subcategorias=${categoriasSeleccionadas.join(
            ","
          )}`
        : "/producto/filtrado";

    const urlColor =
      categoriasSeleccionadas.length > 0
        ? `/producto/filter/color?colores=${categoriasSeleccionadas.join(",")}`
        : "/producto/filtrado";

    const urlSabores =
      categoriasSeleccionadas.length > 0
        ? `/producto/filter/sabor?sabores=${categoriasSeleccionadas.join(",")}`
        : "/producto/filtrado";

    const urlPeso =
      categoriasSeleccionadas.length > 0
        ? `/producto/filter/peso?pesos=${categoriasSeleccionadas.join(",")}`
        : "/producto/filtrado";

    const urlTamaños =
      categoriasSeleccionadas.length > 0
        ? `/producto/filter/tam?size=${categoriasSeleccionadas.join(",")}`
        : "/producto/filtrado";

    const urlMarcas =
      categoriasSeleccionadas.length > 0
        ? `/producto/filter/marca?marcas=${categoriasSeleccionadas.join(",")}`
        : "/producto/filtrado";

    // Hacer las solicitudes al backend en paralelo para obtener productos por categorías y subcategorías
    const [
      respuestaCat,
      respuestaColor,
      respuestaSabor,
      respuestaPeso,
      respuestaTam,
      respuestaMarca,
    ] = await Promise.all([
      axios.get(urlCategoria),
      axios.get(urlColor),
      axios.get(urlSabores),
      axios.get(urlPeso),
      axios.get(urlTamaños),
      axios.get(urlMarcas),
    ]);

    const productosCat = respuestaCat.data;
    const productosColor = respuestaColor.data;
    const productosSabor = respuestaSabor.data;
    const productosPeso = respuestaPeso.data;
    const productosTam = respuestaTam.data;
    const productosMarca = respuestaMarca.data;

    // Combinar productos de categorías y subcategorías
    const productosCombinados = [
      ...productosCat,
      ...productosColor,
      ...productosSabor,
      ...productosPeso,
      ...productosTam,
      ...productosMarca,
    ];

    // Eliminar productos duplicados usando el ID del producto
    const productosUnicos = productosCombinados.filter(
      (producto, index, self) =>
        index ===
        self.findIndex(
          (p) => p.id === producto.id && p.nombre === producto.nombre
        ) // Suponiendo que cada producto tiene un campo 'id' único
    );

    // Limpiar contenedor y renderizar productos
    const divProducts = document.querySelector(".products-card");
    divProducts.innerHTML = ""; // Limpiar productos previos
    productosUnicos.forEach((producto) => {
      renderProduct(producto);
    });
  } catch (error) {
    console.error("Error al filtrar productos:", error);
  }
};

//FUNCIÓN DE FILTRADO PARA SELECCIONES
const filterSelection = () => {
  const selectionNames = document.querySelectorAll(".selection-name");

  selectionNames.forEach((selection) => {
    selection.addEventListener("click", () => {
      const filterList = selection.nextElementSibling;
      const arrow = selection.querySelector(".category-arrow");

      filterList.classList.toggle("opened-filter");
      arrow.classList.toggle("opened-filter-i");
    });
  });
};

filterSelection();

//</-FUNCIÓN DE FILTRADO->

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
