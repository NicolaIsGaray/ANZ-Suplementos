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

//Obtener Colores
async function obtenerColores() {
    try {
        const response = await axios.get('/producto/component/color');
        const colores = response.data;
        return colores;
    } catch (error) {
        console.error('Error al obtener colores:', error);
    }
}

async function cargarColores() {
    const colores = await obtenerColores();
    
    const selectContainer = document.querySelectorAll(".color-list");

    selectContainer.forEach(container => {
        colores.forEach(color => {
            if (color.color) {        
                color.color.forEach(parte => {
                    const colorDiv = document.createElement("div");
                    const colorInput = document.createElement("input");
                    const colorLabel = document.createElement("label");
    
                    colorDiv.classList.add("color");
                    colorInput.setAttribute("type", "checkbox");
                    colorInput.setAttribute("id", parte.trim());
                    colorInput.setAttribute("value", parte.trim());
                    colorLabel.setAttribute("for", parte.trim());
                    colorLabel.textContent = parte.trim();
    
                    colorDiv.appendChild(colorInput);
                    colorDiv.appendChild(colorLabel);
                    container.appendChild(colorDiv);
                });
            } else {
                return;
            }
        });
    });
}

cargarColores();

//Obtener Sabores
async function obtenerSabores() {
    try {
        const response = await axios.get('/producto/component/sabores');
        const sabores = response.data;
        return sabores;
    } catch (error) {
        console.error('Error al obtener sabores:', error);
    }
}

async function cargarSabores() {
    const sabores = await obtenerSabores();
    
    const selectContainer = document.querySelectorAll(".flavour-list");

    selectContainer.forEach(container => {
        sabores.forEach(sabor => {
            if (sabor.sabores) {            
                sabor.sabores.forEach(parte => {
                    const saborDiv = document.createElement("div");
                    const saborInput = document.createElement("input");
                    const saborLabel = document.createElement("label");
                
                    saborDiv.classList.add("flavour");
                    saborInput.setAttribute("type", "checkbox");
                    saborInput.setAttribute("id", parte.trim());
                    saborLabel.setAttribute("for", parte.trim());
                    saborLabel.textContent = parte.trim();
        
                    saborDiv.appendChild(saborInput);
                    saborDiv.appendChild(saborLabel);
                    container.appendChild(saborDiv);
                });
            } else {
                return;
            }
        });
    });
}

cargarSabores();

//Obtener Tamaños
async function obtenerTamaños() {
    try {
        const response = await axios.get('/producto/component/sizes');
        const tamaños = response.data;
        return tamaños;
    } catch (error) {
        console.error('Error al obtener los tamaños:', error);
    }
}

async function cargarTamaños() {
    const tamaños = await obtenerTamaños();
    
    const selectContainer = document.querySelectorAll(".size-list");

    selectContainer.forEach(container => {
        tamaños.forEach(tamaño => {
            if (tamaño.tamaño) {            
                tamaño.tamaño.forEach(parte => {
                    const tamañoDiv = document.createElement("div");
                    const tamañoInput = document.createElement("input");
                    const tamañoLabel = document.createElement("label");
                    
                    tamañoDiv.classList.add("size");
                    tamañoInput.setAttribute("type", "checkbox");
                    tamañoInput.setAttribute("id", parte.trim());
                    tamañoLabel.setAttribute("for", parte.trim());
                    tamañoLabel.textContent = parte.trim();
            
                    tamañoDiv.appendChild(tamañoInput);
                    tamañoDiv.appendChild(tamañoLabel);
                    container.appendChild(tamañoDiv);
                });
            } else {
                return;
            }
        });
    });
}

cargarTamaños();

//Obtener Marcas
async function obtenerMarcas() {
    try {
        const response = await axios.get('/producto/component/marcas');
        const marcas = response.data;
        return marcas;
    } catch (error) {
        console.error('Error al obtener las marcas:', error);
    }
}

async function cargarMarcas() {
    const marcas = await obtenerMarcas();
    
    const selectContainer = document.querySelectorAll(".brand-list");

    selectContainer.forEach(container => {
        marcas.forEach(marca => {
            if (marca.marca) {            
                marca.marca.forEach(parte => {
                    const marcaDiv = document.createElement("div");
                    const marcaInput = document.createElement("input");
                    const marcaLabel = document.createElement("label");
                    
                    marcaDiv.classList.add("brand");
                    marcaInput.setAttribute("type", "checkbox");
                    marcaInput.setAttribute("id", parte.trim());
                    marcaLabel.setAttribute("for", parte.trim());
                    marcaLabel.textContent = parte.trim();
            
                    marcaDiv.appendChild(marcaInput);
                    marcaDiv.appendChild(marcaLabel);
                    container.appendChild(marcaDiv);
                })
            } else {
                return;
            }
        });
    });
}

cargarMarcas();

//<|OFERTA CHECK|>
const checkboxOffer = document.getElementById("hot");
const showDiscountInput = document.getElementById("discounter");
const labelOffer = document.getElementById("offer-input");
checkboxOffer.addEventListener("change", () => {
    if (checkboxOffer.checked) {
        showDiscountInput.style.display = "flex";
        labelOffer.textContent = "Descuento (%)";
    } else {
        showDiscountInput.style.display = "none";
        labelOffer.textContent = "¿Tiene descuento?";
    }
});

//<|COLOR CHECK|>
const checkboxColors = document.querySelectorAll("#new-color-check"); // Cambiado a clase
const showColorInputs = document.querySelectorAll(".addForColor");

checkboxColors.forEach((checkbox, index) => {
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            showColorInputs[index].style.display = "flex"; // Muestra el correspondiente
        } else {
            showColorInputs[index].style.display = "none"; // Oculta el correspondiente
        }
    });
});

//<|SABORES CHECK|>
const checkboxFlavours = document.querySelectorAll("#new-flavour-check");
const showFlavourInputs = document.querySelectorAll(".addForFlavour");

checkboxFlavours.forEach((checkbox, index) => {
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            showFlavourInputs[index].style.display = "flex"; // Muestra el correspondiente
        } else {
            showFlavourInputs[index].style.display = "none"; // Oculta el correspondiente
        }
    });
});

//<|TAMAÑO CHECK|>
const checkboxSizes = document.querySelectorAll("#new-size-check");
const showSizeInputs = document.querySelectorAll(".addForSize");

checkboxSizes.forEach((checkbox, index) => {
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            showSizeInputs[index].style.display = "flex"; // Muestra el correspondiente
        } else {
            showSizeInputs[index].style.display = "none"; // Oculta el correspondiente
        }
    });
});

//<|MARCA CHECK|>
const checkboxBrands = document.querySelectorAll("#new-brand-check");
const showBrandInputs = document.querySelectorAll(".addForBrand");

checkboxBrands.forEach((checkbox, index) => {
    checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
            showBrandInputs[index].style.display = "flex"; // Muestra el correspondiente
        } else {
            showBrandInputs[index].style.display = "none"; // Oculta el correspondiente
        }
    });
});

//Obtener Categorias
async function obtenerCategorias() {
    try {
        const response = await axios.get('/producto/categorias');
        const categorias = response.data;
        return categorias;
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

//Obtener SubCategorias
async function obtenerSubCategorias() {
    try {
        const response = await axios.get('/producto/subcategorias');
        const subcategorias = response.data;
        return subcategorias;
    } catch (error) {
        console.error('Error al obtener subcategorías:', error);
    }
}

async function cargarSubCategorias() {
    const subcategorias = await obtenerSubCategorias();
    
    const selectContainer = document.querySelectorAll(".subcategory");
    selectContainer.forEach(container => {
        subcategorias.forEach(subcategoria => {
            subcategoria.nombreSubCategoria.forEach(parte => {
                const catOption = document.createElement("option");
                catOption.value = parte.trim();
                catOption.text = parte.trim();
        
                container.appendChild(catOption);
            });
        });
    });
}

cargarSubCategorias();
  
//<|PREVISUALIZACION DE IMAGEN|>
const imageInput = document.getElementById("image");
const imagePreview = document.getElementById("image-preview");

imageInput.addEventListener("input", () => {
    const imageUrl = imageInput.value;

    if (imageUrl.trim() !== "") {
        imagePreview.src = imageUrl;
    } else {
        imagePreview.src = "";
    }
})

//<|DETECTAR TIPO DE PRODUCTO|>
const detectSuplementos = document.getElementById('category');
const suplementosSection = document.querySelector('.suplements-form');
const shakersSection = document.querySelector('.shakers-form');

detectSuplementos.addEventListener('change', (event) => {
    const selectedValue = event.target.value;
    if (selectedValue === "Suplementos") {
        suplementosSection.style.display = "flex";
        shakersSection.style.display = "none";
    } else if (selectedValue === "Vasos") {
        shakersSection.style.display = "flex";
        suplementosSection.style.display = "none";
    }
});

function getInputValues() {
    const productNameValue = document.querySelector("#productName").value;
    const productDescValue = quill.root.innerHTML;
    const productStockValue = document.querySelector("#stock").value.replace(/\./g, '');
    const productPriceValue = parseFloat(document.querySelector("#price").value.replace(/\./g, ''));
    const productDiscountValue = parseFloat(document.querySelector("#discount").value) || 0;
    const productWeightValue = parseFloat(document.querySelector("#weights").value) || 0;

    const productColorValue = [...document.querySelectorAll(".color input:checked")].map(input => input.id);
    const productFlavourValue = [...document.querySelectorAll(".flavour input:checked")].map(input => input.id);
    const productSizeValue = [...document.querySelectorAll(".size input:checked")].map(input => input.id);
    const productBrandValue = [...document.querySelectorAll(".brand input:checked")].map(input => input.id);

    const productImgValue = document.querySelector("#image").value;
    const productCategoryValue = document.querySelector("#category").value;
    const productSubCategorySelector = document.querySelectorAll(".subcategory");
    
    const productSubCategoryValue = Array.from(productSubCategorySelector)
        .map(subCategory => subCategory.value)
        .filter(value => value !== "")[0]; // Filtrar valores vacíos

    const newColorValue = document.getElementById("new-color").value;
    const newFlavourValue = document.getElementById("new-flavour").value;
    const newSizeValue = document.getElementById("new-size").value;
    const newBrandValue = document.getElementById("new-brand").value;

    const offerChecked = document.getElementById("hot").checked;

    // Calcular precio final (esto es opcional, si se envía precio final por otro lado no es necesario)
    let precioFinal = productPriceValue;
    if (offerChecked && productDiscountValue) {
        const descuento = productPriceValue * (productDiscountValue / 100);
        precioFinal = productPriceValue - descuento;
    }

    // Combinar valores existentes y nuevos en un array
    const combinedColors = [...productColorValue, ...(newColorValue ? [newColorValue] : [])];
    const combinedFlavours = [...productFlavourValue, ...(newFlavourValue ? [newFlavourValue] : [])];
    const combinedSizes = [...productSizeValue, ...(newSizeValue ? [newSizeValue] : [])];
    const combinedBrands = [...productBrandValue, ...(newBrandValue ? [newBrandValue] : [])];

    // Solo devuelve campos que tienen un valor
    const dataToUpdate = {};
    if (productNameValue) dataToUpdate.nombre = productNameValue;
    if (productDescValue) dataToUpdate.descripcion = productDescValue;
    if (productStockValue) dataToUpdate.stock = parseInt(productStockValue, 10);
    if (productPriceValue) dataToUpdate.precio = parseFloat(productPriceValue);

    // Asegurarte de enviar enOferta y descuento siempre
    dataToUpdate.oferta = {
        enOferta: offerChecked,
        descuento: offerChecked ? productDiscountValue : 0 // Si no está en oferta, el descuento es 0
    };

    if (productWeightValue) dataToUpdate.peso = productWeightValue;
    if (combinedColors.length > 0) dataToUpdate.color = combinedColors;
    if (combinedFlavours.length > 0) dataToUpdate.sabores = combinedFlavours;
    if (combinedBrands.length > 0) dataToUpdate.marca = combinedBrands;
    if (combinedSizes.length > 0) dataToUpdate.tamaño = combinedSizes;
    if (productImgValue) dataToUpdate.imgPortada = productImgValue;
    if (productCategoryValue) dataToUpdate.categoria = productCategoryValue;
    if (productSubCategoryValue) dataToUpdate.subcategoria = productSubCategoryValue;

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
        location.reload();
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

    const productName = document.getElementById("productName");
    productName.value = Productos.nombre || "Error";

    const productDesc = document.getElementById("editor-textarea");
    const description = Productos.descripcion || "Error";
    quill.clipboard.dangerouslyPasteHTML(description);

    const currentImg = document.getElementById("image-preview");
    const currentImgUrl = document.getElementById("image");
    currentImg.setAttribute("src", Productos.imgPortada || "../../media/default.png");
    currentImgUrl.value = Productos.imgPortada || "";

    const isStock = document.getElementById("stock");
    isStock.value = Productos.stock || 0;

    const productPrice = document.getElementById("price");
    const price = Productos.precio || 0;
    productPrice.value = new Intl.NumberFormat('es-ES').format(price);

    const inOffer = document.getElementById("hot");
    const discountValue = document.getElementById("discount");

    if (Productos.oferta.enOferta) {
        inOffer.checked = true;
        showDiscountInput.style.display = "flex";
        labelOffer.textContent = "Descuento (%)";
        labelOffer.style.backgroundColor = "rgb(255, 193, 7)";
        labelOffer.style.color = "rgb(33, 37, 41)";
        discountValue.value = Productos.oferta.descuento || 0;
    } else {
        inOffer.checked = false;
        discountValue.value = null;
        showDiscountInput.style.display = "none";
    }

    // Evento para actualizar al cambiar el checkbox
    inOffer.addEventListener("change", () => {
        if (inOffer.checked) {
            // Si se marca, se habilita el descuento
            showDiscountInput.style.display = "flex";
            labelOffer.textContent = "Descuento (%)";
            labelOffer.style.backgroundColor = "rgb(255, 193, 7)";
            labelOffer.style.color = "rgb(33, 37, 41)";
            discountValue.value = Productos.oferta.descuento || 0;
        } else {
            // Si se desmarca, se elimina el descuento
            discountValue.value = null;
            showDiscountInput.style.display = "none";
            labelOffer.textContent = "¿Tiene descuento?";
            labelOffer.style.backgroundColor = "";
            labelOffer.style.color = "";
        }
    });

    const category = document.getElementById("category");
    category.value = Productos.categoria || "Error";
    if (Productos.categoria === "Suplementos") {
        suplementosSection.style.display = "flex";
        shakersSection.style.display = "none";
    } else if (Productos.categoria === "Vasos") {
        shakersSection.style.display = "flex";
        suplementosSection.style.display = "none";
    }

    const subcategories = document.querySelectorAll(".subcategory");
    subcategories.forEach(sub => {
        sub.value = Productos.subcategoria || "Error";
    });

    const productWeight = document.getElementById("weights");
    productWeight.value = Productos.peso || null;

    // Renderizar checkboxes de colores
    if (Productos.color) {
        Productos.color.forEach(color => {
            const colorCheckbox = document.querySelector(`.color input[id="${color}"]`);
            if (colorCheckbox) {
                colorCheckbox.checked = true;
            }
        });
    }

    // Renderizar checkboxes de sabores
    if (Productos.sabores) {
        Productos.sabores.forEach(flavour => {
            const flavourCheckbox = document.querySelector(`.flavour input[id="${flavour}"]`);
            if (flavourCheckbox) {
                flavourCheckbox.checked = true;
            }
        });
    }

    // Renderizar checkboxes de tamaños
    if (Productos.tamaño) {
        Productos.tamaño.forEach(size => {
            const sizeCheckbox = document.querySelector(`.size input[id="${size}"]`);
            if (sizeCheckbox) {
                sizeCheckbox.checked = true;
            }
        });
    }

    // Renderizar checkboxes de marcas
    if (Productos.marca) {
        Productos.marca.forEach(brand => {
            const brandCheckbox = document.querySelector(`.brand input[id="${brand}"]`);
            if (brandCheckbox) {
                brandCheckbox.checked = true;
            }
        });
    }
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