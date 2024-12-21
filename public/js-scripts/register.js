const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getInputValues() {
    const userInput = document.querySelector("#username");
    const emailInput = document.querySelector("#email");
    const contraseñaInput = document.querySelector("#password");

    const userValue = userInput.value;
    const emailValue = emailInput.value;
    const contraseñaValue = contraseñaInput.value;

    if (!emailValue || !regex.test(emailValue)) {
        Swal.fire({
            title: 'Vaya. Eso no debió de suceder.',
            text: 'Ingresa un correo válido.',
            imageUrl: 'https://media.tenor.com/q-zZSTX6jSIAAAAC/mail-download.gif',
            imageWidth: 200,
            imageHeight: 200,
            imageAlt: 'Email',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });

        return null
    }

    if (contraseñaValue === '' || contraseñaValue.length < 8) {
        Swal.fire({
            title: 'Vaya. Eso no debió de suceder.',
            text: 'La contraseña no puede estar vacía o ser inferior a 8 caracteres.',
            icon: 'warning',
            showClass: {
                popup: 'animate__animated animate__fadeInDown'
            },
            hideClass: {
                popup: 'animate__animated animate__fadeOutUp'
            }
        });
        return null
    }

    if (!emailValue && !contraseñaValue) {
        Swal.fire(
            '¿Eh?',
            'Creo que esto está algo vacío...',
            'question'
        );
    }


    return {
        email: emailValue,
        username: userValue,
        contraseña: contraseñaValue
    };
}

const userRegister = async (e) => {
    e.preventDefault();
    const ObjectToSend = getInputValues();

    try {
        await axios.post("/usuario/signUp", ObjectToSend);
        window.location.href = "./login.html";
    } catch (error) {
        console.log(error);
    }
};

const buttonRegister = document.querySelector("#registerUser");
buttonRegister.addEventListener("click", (e) => {
    userRegister(e);
});