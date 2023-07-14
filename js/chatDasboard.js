const numRender = 50;
const memoria = 100;
var chastArr = [];

var colDocument = 'danone';

function renderMensajes() {
    let ultimosChats = [];

    if (chastArr.length - 1 < numRender) {
        ultimosChats = chastArr;
    } else {
        ultimosChats = chastArr.slice(chastArr.length - numRender)

    }
    ultimosChats.forEach((doc) => {
        let html = "";
        const espacio = '<div class="espacio-20"></div>';
        html = `
           <div class="message-box">
                        <img src="./img/usuario-verificado.png" alt="profile image">
                        <div class="message-content">
                            <div class="message-header">
                                <div class="name">${doc.data().nombre}</div>
                            </div>
                            <p class="message-line">
                                ${doc.data().mensaje}
                            </p>
                            <div class="messages-btn">
                                <button class="btn btn-outline-danger" onclick="denegar('${doc.id}')">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>          
    `;
        $("#list-filter").append(html);

    });

}


function mostrarChatsFiltrados() {
    db.collection('col-sala')
        .doc(colDocument)
        .collection('col-mensajes2')
        .orderBy('fecha').where("status", "==", "aprobado")
        .onSnapshot((querySnapshot) => {
            $('#list-filter').html('');

            chastArr = [];
            var chatTemp = [];
            querySnapshot.forEach((doc) => {
                if (doc) chatTemp.push(doc);

            });
            if (chatTemp.length - 1 < memoria) {
                chastArr = chatTemp;
            } else {
                chastArr = chatTemp.slice(chatTemp.length - memoria);
            }
            renderMensajes();
        });

}
mostrarChatsFiltrados();




function mostrarChats() {
    db.collection("col-sala")
        .doc(colDocument)
        .collection("col-mensajes2")
        .orderBy("fecha")
        .where("status", "==", "pendiente")
        .limit(25)
        .onSnapshot((querySnapshot) => {
            $("#list-message").html("");
            querySnapshot.forEach((doc) => {
                let html = "";
                const espacio = '<div class="espacio-20"></div>';
                html = `
                  <div class="message-box">
                        <img src="./img/perfil.png" alt="profile image">
                        <div class="message-content">
                            <div class="message-header">
                                <div class="name">${doc.data().nombre}</div>
                            </div>
                            <p class="message-line">
                                ${doc.data().mensaje}
                            </p>
                            <div class="messages-btn">
                                <button class="btn btn-outline-primary" onclick="aprobar('${doc.id}')">
                                    Aprobar
                                </button>
                                <button class="btn btn-outline-danger" onclick="denegar('${doc.id}')">
                                    Denegar
                                </button>
                            </div>

                        </div>
                    </div>         
    `;
                $("#list-message").append(html);
            });
        });
}
mostrarChats();

function aprobar(id) {
    var fecha = moment().tz('Europe/Paris').valueOf();

    // Set the "capital" field of the city 'DC'
    return db
        .collection("col-sala")
        .doc(colDocument)
        .collection("col-mensajes2")
        .doc(id)
        .update({
            status: "aprobado",
            fecha: fecha,
        })
        .then(function() {
            // $("#aprobado-scroll").animate({
            //     scrollTop: $("#aprobado-scroll").get(0).scrollHeight,
            // },
            //     1500
            // );
        })
        .catch(function(error) {});
}

function denegar(id) {
    var fecha = moment().tz('Europe/Paris').valueOf();

    // Set the "capital" field of the city 'DC'
    return db
        .collection("col-sala")
        .doc(colDocument)
        .collection("col-mensajes2")
        .doc(id)
        .update({
            status: "denegado",
            fecha: fecha,
        })
        .then(function() {})
        .catch(function(error) {});
}

function eliminarMensaje(id) {
    Swal.fire({
        title: "¿Está seguro de eliminar este mensaje?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, ¡bórralo!",
        cancelButtonText: "Cancelar",
    }).then((result) => {
        if (result.isConfirmed) {
            db.collection("col-sala")
                .doc(colDocument)
                .collection("col-mensajes2")
                .doc(id)
                .delete()
                .then(function() {})
                .catch(function(error) {});
        }
    });
}

function mostrarUsuarios() {
    db.collection("col-sala")
        .doc(colDocument)
        .collection("col-usuarios")
        .onSnapshot(function(querySnapshot) {
            document.getElementById("totalUsuarios").innerHTML =
                querySnapshot.docs.length;
        });
}

// mostrarUsuarios();


const registrarMensaje = () => {

    const chat = document.querySelector('#mensaje').value;
    const fecha = moment().tz('Europe/Paris').valueOf();

    if (chat == "") {
        let timerInterval
        Swal.fire({
            title: 'Alerta',
            html: 'No puedes mandar un mensaje vacío',
            timer: 2000,
            timerProgressBar: true,
            showConfirmButton: false,
            willOpen: () => {
                Swal.showLoading()
                timerInterval = setInterval(() => {
                    const content = Swal.getContent()
                    if (content) {
                        const b = content.querySelector('b')
                        if (b) {
                            b.textContent = Swal.getTimerLeft()
                        }
                    }
                }, 100)
            },
            onClose: () => {
                clearInterval(timerInterval)
            }
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {

            }
        })
        return null;
    }

    db.collection('col-sala')
        .doc(colDocument)
        .collection('col-mensajes').add({
            mensaje: chat,
            email: 'admin@silanes.com',
            fecha: fecha,
            status: 'aprobado',
            day: 1,
        })
        .then((docRef) => {
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                    toast.addEventListener('mouseenter', Swal.stopTimer)
                    toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
            });

            Toast.fire({
                icon: 'success',
                title: 'Mensaje envíado'
            });

            document.querySelector('#mensaje').value = "";

        })
        .catch((error) => {

        });
}