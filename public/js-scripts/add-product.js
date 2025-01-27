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

    const isAdmin = response.data.isAdmin; // Suponiendo que el backend te está enviando isAdmin como true/false

    window.onload = () => {
      getUserOpt.style.display = "none";
    };

    if (isAdmin) {
      getUserOpt.style.display = "none";
      userOptions.style.display = "flex";
    } else {
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

function getInputValues() {
    const productNameValue = document.querySelector("#productName").value;
    const productDescValue = quill.root.innerHTML;
    const productStockValue = document.querySelector("#stock").value.replace(/\./g, '');
    const productPriceValue = parseFloat(document.querySelector("#price").value.replace(/\./g, ''));
    const productDiscountValue = parseFloat(document.querySelector("#discount").value) || 0;
    const productWeightValue = document.querySelector("#weights").value || 0;

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

    // Calcular precio final
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

    return {
        nombre: productNameValue,
        descripcion: productDescValue,
        stock: parseInt(productStockValue, 10),
        precio: parseFloat(precioFinal), // Enviar el precio final calculado
        oferta: {
            enOferta: offerChecked,
            descuento: offerChecked ? productDiscountValue : 0
        },
        peso: `${productWeightValue}gr`,
        color: combinedColors,
        sabores: combinedFlavours,
        marca: combinedBrands,
        tamaño: combinedSizes,
        categoria: productCategoryValue,
        subcategoria: productSubCategoryValue,
        imgPortada: productImgValue
    };
}

const componentRegister = async (e) => {
    e.preventDefault();
    const { color, sabores, marca, tamaño} = getInputValues();

    const ComponentToSend = {
        color,
        sabores,
        marca,
        tamaño
    }

    try {
        await axios.post("/producto/componente/agregar-componente", ComponentToSend)
    } catch (error) {
        console.log(error.response.data);
    }
}


const productRegister = async (e) => {
    e.preventDefault();
    const {nombre, descripcion, stock, precio, imgPortada, categoria, subcategoria, oferta, peso, color, sabores, marca, tamaño} = getInputValues();
    const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;

    if (!nombre || !descripcion || !stock || !precio || !categoria || !subcategoria) {
        Swal.fire({
            icon: "error",
            title: "¡Alto!",
            text: "Porfavor, completa los campos necesarios."
          });

          console.log(subcategoria);
          
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

    const producto = {
        nombre,
        descripcion,
        stock,
        precio,
        oferta,
        peso,
        color,
        sabores,
        tamaño,
        marca,
        categoria,
        subcategoria,
        imgPortada
    };

    try {
        await axios.post("/producto/agregar/producto", producto)
        location.reload();
    } catch (error) {
        console.log(error.response.data);
        
    }
}

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

const productAdd = document.querySelector("#addProduct");
productAdd.addEventListener("click", (e) => {
    productRegister(e);
    componentRegister(e);
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