const numRender = 50;
const memoria = 100;
var chastArr = [];

let scroll = 0;

const button = document.querySelector('#emoji');
const button2 = document.querySelector('#emoji2');

const tooltip = document.querySelector('.tooltip');
const smgV = document.getElementById("msg-escritorio");
const smgM = document.getElementById("msg-movil");

var seHizoScroll = false;
var esMiMensaje = true;

var colDocument = 'test';

Popper.createPopper(button, tooltip);
Popper.createPopper(button2, tooltip);

function toggle() {
    tooltip.classList.toggle('shown');

}

const scrollBottom = () => {
    const scrollClass = document.getElementsByClassName('scrollable-area');

    for (var i = 0; i < scrollClass.length; i++) {
        const element = document.getElementsByClassName('scrollable-area')[i];
        element.scrollTop = element.scrollHeight;
    }
}

document.getElementsByClassName('scrollable-area')[0].addEventListener(
    'scroll',
    function () {
        let scrollTop = document.getElementsByClassName('scrollable-area')[0].scrollTop;
        const scrollHeight = document.getElementsByClassName('scrollable-area')[0].scrollHeight; // added
        const offsetHeight = document.getElementsByClassName('scrollable-area')[0].offsetHeight;
        // var clientHeight = document.getElementById('box').clientHeight;
        const contentHeight = scrollHeight - offsetHeight; // added


        if (contentHeight > scrollTop + 93) // modified
        {
            seHizoScroll = true;
        } else {
            seHizoScroll = false;
        }

    },
    false
)

document.querySelector('emoji-picker')
    .addEventListener('emoji-click', event => {
        smgV.value = smgV.value + event.detail.unicode;
        smgM.value = smgM.value + event.detail.unicode;
    });

const enviarMensajeWeb = () => {
    const validacion = $(".tooltip").hasClass("shown");
    if (validacion) {
        toggle();
    }
    document.getElementById("msg-escritorio").value = "";
    document.getElementById("msg-movil").value = "";
}

if (screen.width > 768) {
    $(document).ready(function () {
        $("body").keyup(function (e) {
            if (e.keyCode == 13) {
                $("#btn-msg-web").trigger("click");
            }
        });
    });
} else {
    $(document).ready(function () {
        $("body").keyup(function (e) {
            if (e.keyCode == 13) {
                $("#btn-msg-movil").trigger("click");
            }
        });
    });
}


function renderMensajes() {
    let ultimosChats = [];

    if (chastArr.length - 1 < numRender) {
        ultimosChats = chastArr;
    } else {
        ultimosChats = chastArr.slice(chastArr.length - numRender)

    }
    ultimosChats.forEach((doc) => {
        var html = "";

        if (doc.nombre === 'Olga Caridad') {
            html = `<div class="chat-line__message" data-a-target="chat-line-message" data-test-selector="chat-line-message" tabindex="0">
                <div class="tw-relative">
                    <div class="tw-relative">
                        <div class="">
                            <div class="chat-line__no-background tw-inline">
                                <div class="tw-inline-block"><i class="fas fa-user-shield userChatAdmin" ></i>
                                    <span class="chat-line__username" role="button" tabindex="0"><span><span class="chat-author__display-name" data-a-target="chat-message-username userChatAdmin"
                                              data-a-user="danieluribedg" data-test-selector="message-username"><strong>${doc.nombre}</strong></span></span>
                                    </span>
                                </div><span aria-hidden="true" data-test-selector="chat-message-separator">:
                                </span><span class="text-fragment"
                                  data-a-target="chat-message-text"><span class="msg userColorChatAdmin fondoChatAdmin">${doc.mensaje.replace("#ca9e67", "#ffffff")}</span></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>`;
        } else {
            html = `
                  <div class="chat-line__message" data-a-target="chat-line-message" data-test-selector="chat-line-message" tabindex="0">
                      <div class="tw-relative">
                          <div class="tw-relative">
                              <div class="">
                                  <div class="chat-line__no-background tw-inline">
                                      <div class="tw-inline-block"><i class="far fa-user mr-1 userChat"></i>
                                          <span class="chat-line__username" role="button" tabindex="0"><span><span class="chat-author__display-name userChat" data-a-target="chat-message-username"
                                                    data-a-user="danieluribedg" data-test-selector="message-username">${doc.nombre}</span></span>
                                          </span>
                                      </div><span aria-hidden="true" data-test-selector="chat-message-separator">:
                                      </span><span class="text-fragment"
                                        data-a-target="chat-message-text"><span class="msg userColorChat" >${doc.mensaje}</span></span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
      `;
        }


        $('#list-message').append(html);
        $('#list-message2').append(html);
    });


    if (seHizoScroll) {
        notification.show('Hay nuevos mensajes', 'success')
    } else {
        scrollBottom();
    }

}




function mostrarChats() {
    db.collection('col-sala')
        .doc(colDocument)
        .collection('col-mensajes').orderBy('fecha').where("status", "==", "aprobado")
        .onSnapshot((querySnapshot) => {
            $('#list-message').html('');
            $('#list-message2').html('');

            chastArr = [];
            var chatTemp = [];
            querySnapshot.forEach((doc) => {
                if (doc) chatTemp.push(doc.data());

            });
            if (chatTemp.length - 1 < memoria) {
                chastArr = chatTemp;
            } else {
                chastArr = chatTemp.slice(chatTemp.length - memoria);
            }
            renderMensajes();
            const position = $(".scrollable-area").scrollTop();
            const posicionFinal = parseInt(position.toFixed(0)) + 281;

            const top = $('.scrollable-area').get(0).scrollHeight;

            if (scroll + 2400 < top || posicionFinal + 2400 < top) {
                notification.show('Hay nuevos mensajes', 'success');
            }
        });





}
mostrarChats();




// registrar chats
function urlify(text) {
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function (url) {
        return '<a target="_blank" href="' + url + '" style="color:#ca9e67;text-decoration: underline !important;">' + url + '</a>';
    })
}


function registrarChats(name, email) {
    var separa = name.split(" ", 2);
    var nombreUsuarioSinEspacio = separa[0] + ' ' + separa[1];
    var nombreValidado = nombreUsuarioSinEspacio.replace("undefined", "");

    var mensaje = document.getElementById("msg-escritorio").value;
    var chat = urlify(mensaje);
    var fecha = new Date();

    if (mensaje == "") {
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

    let status = "pendiente";

    const message = {
        nombre: name,
        email: email,
        mensaje: chat,
        fecha: fecha,
        status: status,
        day: 1,
    }

    return new Promise((resolve, reject) => {
        db.collection('col-sala')
            .doc(colDocument)
            .collection('col-mensajes')
            .add(message)
            .then(function (docRef) {
                const validacion = $(".tooltip").hasClass("shown");
                if (validacion) {
                    toggle();
                }
                document.getElementById("msg-escritorio").value = "";
                resolve(message)
            })
            .catch(function (error) {
                reject(error)
            })
    });

}


function registrarChatsM(name, email) {
    var separa = name.split(" ", 2);
    var nombreUsuarioSinEspacio = separa[0] + ' ' + separa[1];
    var nombreValidado = nombreUsuarioSinEspacio.replace("undefined", "");

    var mensaje = document.getElementById("msg-movil").value;
    var chat = urlify(mensaje);

    var fecha = new Date();

    if (mensaje == "") {
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

    let status = "pendiente";

    const message = {
        nombre: name,
        email: email,
        mensaje: chat,
        fecha: fecha,
        status: status,
        day: 1,

    }

    return new Promise((resolve, reject) => {
        db.collection('col-sala')
            .doc(colDocument)
            .collection('col-mensajes')
            .add(message)
            .then(function (docRef) {
                const validacion = $(".tooltip").hasClass("shown");
                if (validacion) {
                    toggle();
                }
                document.getElementById("msg-escritorio").value = "";
                resolve(message)
            })
            .catch(function (error) {
                reject(error)
            })
    });

}

$(".scrollable-area").scroll(function (event) {
    var scrollTop = $(".scrollable-area").scrollTop();
    scroll = parseInt(scrollTop.toFixed(0)) + 281;
});

/* Notificaciones */
var notification = new Notif({
    topPos: 10,
    classNames: 'success danger',
    autoClose: false,
    autoCloseTimeout: 3000
});


//notification.show('Hay nuevos mensajes', 'danger');



$(".scrollable-area").scroll(function (event) {
    var scrollTop = $(".scrollable-area").scrollTop();
    scroll = parseInt(scrollTop.toFixed(0)) + 281;
});


//var l = document.getElementById("number");
function muestraReloj() {
    var fechaHora = new Date();
    var horas = fechaHora.getHours();
    var minutos = fechaHora.getMinutes();
    var segundos = fechaHora.getSeconds();

    if (horas < 10) {
        horas = '0' + horas;
    }
    if (minutos < 10) {
        minutos = '0' + minutos;
    }
    if (segundos < 10) {
        segundos = '0' + segundos;
    }

}



function Notif(option) {
    var el = this;

    el.self = $('.toast-message');
    el.close = this.self.find('.close');
    el.message = el.self.find('.message');
    el.top = option.topPos;
    el.classNames = option.classNames;
    el.autoClose = (typeof option.autoClose === "boolean") ? option.autoClose : false;
    el.autoCloseTimeout = (option.autoClose && typeof option.autoCloseTimeout === "number") ? option.autoCloseTimeout : 3000;


    // Methods
    el.reset = function () {
        el.message.empty();
        el.self.removeClass(el.classNames);
    }
    el.show = function (msg, type) {
        $(".toast-message").removeClass("ocultar");
        el.reset();
        el.message.text(msg);
        el.self.addClass(type);

        if (el.autoClose) {
            setTimeout(function () {
                el.hide();
            }, el.autoCloseTimeout);
        }
    }
    el.hide = function () {
        el.reset();
        $(".toast-message").addClass("ocultar");

    };

    el.close.on('click', this.hide);
}


const mostrarUltimoChat = () => {
    $('.scrollable-area').animate({
        scrollTop: $('.scrollable-area').get(0).scrollHeight
    }, 1500);
    $(".toast-message").addClass("ocultar");


}
const validarTab = () => {
    if (screen.width > 1024) {
        cambiarTabP(2);
    } else {
        cambiarTab(3);
    }
}





$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();

});