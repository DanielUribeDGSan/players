function registrarRespuesta(email, pregunta) {

    let fecha = new Date();


    if (pregunta == 1) {
        let p1Resp1, p1Resp2, p1Resp3, p1Resp4;
        let respuesta1, respuesta2, respuesta3, respuesta4;

        p1Resp1 = document.getElementById("p1Resp1").checked;
        p1Resp2 = document.getElementById("p1Resp2").checked;
        p1Resp3 = document.getElementById("p1Resp3").checked;
        p1Resp4 = document.getElementById("p1Resp4").checked;

        if (!p1Resp1 && !p1Resp2 && !p1Resp3 && !p1Resp4) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Aún no has seleccionado ninguna respuesta.",
                confirmButtonText: 'Cerrar',
            });
            return null;
        } else if (p1Resp1) {
            respuesta1 = 1;
            respuesta2 = 0;
            respuesta3 = 0;
            respuesta4 = 0;
        } else if (p1Resp2) {
            respuesta1 = 0;
            respuesta2 = 1;
            respuesta3 = 0;
            respuesta4 = 0;
        } else if (p1Resp3) {
            respuesta1 = 0;
            respuesta2 = 0;
            respuesta3 = 1;
            respuesta4 = 0;
        } else if (p1Resp4) {
            respuesta1 = 0;
            respuesta2 = 0;
            respuesta3 = 0;
            respuesta4 = 1;
        }

        const respuesta = {
            email: email,
            fecha: fecha,
            pregunta: pregunta,
            respuesta1: respuesta1,
            respuesta2: respuesta2,
            respuesta3: respuesta3,
            respuesta4: respuesta4,
        };
        SendRespuesta(pregunta, email, respuesta);
    } else if (pregunta == 2) {
        let p2Resp1, p2Resp2, p2Resp3, p2Resp4;
        let respuesta1, respuesta2, respuesta3, respuesta4;

        p2Resp1 = document.getElementById("p2Resp1").checked;
        p2Resp2 = document.getElementById("p2Resp2").checked;
        p2Resp3 = document.getElementById("p2Resp3").checked;
        p2Resp4 = document.getElementById("p2Resp4").checked;

        if (!p2Resp1 && !p2Resp2 && !p2Resp3 && !p2Resp4) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Aún no has seleccionado ninguna respuesta.",
                confirmButtonText: 'Cerrar',
            });
            return null;
        } else if (p2Resp1) {
            respuesta1 = 1;
            respuesta2 = 0;
            respuesta3 = 0;
            respuesta4 = 0;
        } else if (p2Resp2) {
            respuesta1 = 0;
            respuesta2 = 1;
            respuesta3 = 0;
            respuesta4 = 0;
        } else if (p2Resp3) {
            respuesta1 = 0;
            respuesta2 = 0;
            respuesta3 = 1;
            respuesta4 = 0;
        } else if (p2Resp4) {
            respuesta1 = 0;
            respuesta2 = 0;
            respuesta3 = 0;
            respuesta4 = 1;
        }

        const respuesta = {
            email: email,
            fecha: fecha,
            pregunta: pregunta,
            respuesta1: respuesta1,
            respuesta2: respuesta2,
            respuesta3: respuesta3,
            respuesta4: respuesta4,
        };
        SendRespuesta(pregunta, email, respuesta);
    } else if (pregunta == 3) {
        let p3Resp1, p3Resp2, p3Resp3, p3Resp4;
        let respuesta1, respuesta2, respuesta3, respuesta4;

        p3Resp1 = document.getElementById("p3Resp1").checked;
        p3Resp2 = document.getElementById("p3Resp2").checked;
        p3Resp3 = document.getElementById("p3Resp3").checked;
        p3Resp4 = document.getElementById("p3Resp4").checked;

        if (!p3Resp1 && !p3Resp2 && !p3Resp3 && !p3Resp4) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Aún no has seleccionado ninguna respuesta.",
                confirmButtonText: 'Cerrar',
            });
            return null;
        } else if (p3Resp1) {
            respuesta1 = 1;
            respuesta2 = 0;
            respuesta3 = 0;
            respuesta4 = 0;
        } else if (p3Resp2) {
            respuesta1 = 0;
            respuesta2 = 1;
            respuesta3 = 0;
            respuesta4 = 0;
        } else if (p3Resp3) {
            respuesta1 = 0;
            respuesta2 = 0;
            respuesta3 = 1;
            respuesta4 = 0;
        } else if (p3Resp4) {
            respuesta1 = 0;
            respuesta2 = 0;
            respuesta3 = 0;
            respuesta4 = 1;
        }

        const respuesta = {
            email: email,
            fecha: fecha,
            pregunta: pregunta,
            respuesta1: respuesta1,
            respuesta2: respuesta2,
            respuesta3: respuesta3,
            respuesta4: respuesta4,
        };
        SendRespuesta(pregunta, email, respuesta);
    } else if (pregunta == 4) {
        let p4Resp1, p4Resp2, p4Resp3, p4Resp4;
        let respuesta1, respuesta2, respuesta3, respuesta4;

        p4Resp1 = document.getElementById("p4Resp1").checked;
        p4Resp2 = document.getElementById("p4Resp2").checked;
        p4Resp3 = document.getElementById("p4Resp3").checked;
        p4Resp4 = document.getElementById("p4Resp4").checked;

        if (!p4Resp1 && !p4Resp2 && !p4Resp3 && !p4Resp4) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Aún no has seleccionado ninguna respuesta.",
                confirmButtonText: 'Cerrar',
            });
            return null;
        } else if (p4Resp1) {
            respuesta1 = 1;
            respuesta2 = 0;
            respuesta3 = 0;
            respuesta4 = 0;
        } else if (p4Resp2) {
            respuesta1 = 0;
            respuesta2 = 1;
            respuesta3 = 0;
            respuesta4 = 0;
        } else if (p4Resp3) {
            respuesta1 = 0;
            respuesta2 = 0;
            respuesta3 = 1;
            respuesta4 = 0;
        } else if (p4Resp4) {
            respuesta1 = 0;
            respuesta2 = 0;
            respuesta3 = 0;
            respuesta4 = 1;
        }

        const respuesta = {
            email: email,
            fecha: fecha,
            pregunta: pregunta,
            respuesta1: respuesta1,
            respuesta2: respuesta2,
            respuesta3: respuesta3,
            respuesta4: respuesta4,
        };
        SendRespuesta(pregunta, email, respuesta);
    } else if (pregunta == 5) {
        let p5Resp1, p5Resp2, p5Resp3, p5Resp4;
        let respuesta1, respuesta2, respuesta3, respuesta4;

        p5Resp1 = document.getElementById("p5Resp1").checked;
        p5Resp2 = document.getElementById("p5Resp2").checked;
        p5Resp3 = document.getElementById("p5Resp3").checked;
        p5Resp4 = document.getElementById("p5Resp4").checked;

        if (!p5Resp1 && !p5Resp2 && !p5Resp3 && !p5Resp4) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Aún no has seleccionado ninguna respuesta.",
                confirmButtonText: 'Cerrar',
            });
            return null;
        } else if (p5Resp1) {
            respuesta1 = 1;
            respuesta2 = 0;
            respuesta3 = 0;
            respuesta4 = 0;
        } else if (p5Resp2) {
            respuesta1 = 0;
            respuesta2 = 1;
            respuesta3 = 0;
            respuesta4 = 0;
        } else if (p5Resp3) {
            respuesta1 = 0;
            respuesta2 = 0;
            respuesta3 = 1;
            respuesta4 = 0;
        } else if (p5Resp4) {
            respuesta1 = 0;
            respuesta2 = 0;
            respuesta3 = 0;
            respuesta4 = 1;
        }

        const respuesta = {
            email: email,
            fecha: fecha,
            pregunta: pregunta,
            respuesta1: respuesta1,
            respuesta2: respuesta2,
            respuesta3: respuesta3,
            respuesta4: respuesta4,
        };
        SendRespuesta(pregunta, email, respuesta);
    } else if (pregunta == 6) {
        let p6Resp1, p6Resp2, p6Resp3, p6Resp4;
        let respuesta1, respuesta2, respuesta3, respuesta4;

        p6Resp1 = document.getElementById("p6Resp1").checked;
        p6Resp2 = document.getElementById("p6Resp2").checked;
        p6Resp3 = document.getElementById("p6Resp3").checked;
        p6Resp4 = document.getElementById("p6Resp4").checked;

        if (!p6Resp1 && !p6Resp2 && !p6Resp3 && !p6Resp4) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Aún no has seleccionado ninguna respuesta.",
                confirmButtonText: 'Cerrar',
            });
            return null;
        } else if (p6Resp1) {
            respuesta1 = 1;
            respuesta2 = 0;
            respuesta3 = 0;
            respuesta4 = 0;
        } else if (p6Resp2) {
            respuesta1 = 0;
            respuesta2 = 1;
            respuesta3 = 0;
            respuesta4 = 0;
        } else if (p6Resp3) {
            respuesta1 = 0;
            respuesta2 = 0;
            respuesta3 = 1;
            respuesta4 = 0;
        } else if (p6Resp4) {
            respuesta1 = 0;
            respuesta2 = 0;
            respuesta3 = 0;
            respuesta4 = 1;
        }

        const respuesta = {
            email: email,
            fecha: fecha,
            pregunta: pregunta,
            respuesta1: respuesta1,
            respuesta2: respuesta2,
            respuesta3: respuesta3,
            respuesta4: respuesta4,
        };
        SendRespuesta(pregunta, email, respuesta);
    } else if (pregunta == 7) {
        let p7Resp1, p7Resp2, p7Resp3, p7Resp4;
        let respuesta1, respuesta2, respuesta3, respuesta4;

        p7Resp1 = document.getElementById("p7Resp1").checked;
        p7Resp2 = document.getElementById("p7Resp2").checked;
        p7Resp3 = document.getElementById("p7Resp3").checked;
        p7Resp4 = document.getElementById("p7Resp4").checked;

        if (!p7Resp1 && !p7Resp2 && !p7Resp3 && !p7Resp4) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Aún no has seleccionado ninguna respuesta.",
                confirmButtonText: 'Cerrar',
            });
            return null;
        } else if (p7Resp1) {
            respuesta1 = 1;
            respuesta2 = 0;
            respuesta3 = 0;
            respuesta4 = 0;
        } else if (p7Resp2) {
            respuesta1 = 0;
            respuesta2 = 1;
            respuesta3 = 0;
            respuesta4 = 0;
        } else if (p7Resp3) {
            respuesta1 = 0;
            respuesta2 = 0;
            respuesta3 = 1;
            respuesta4 = 0;
        } else if (p7Resp4) {
            respuesta1 = 0;
            respuesta2 = 0;
            respuesta3 = 0;
            respuesta4 = 1;
        }

        const respuesta = {
            email: email,
            fecha: fecha,
            pregunta: pregunta,
            respuesta1: respuesta1,
            respuesta2: respuesta2,
            respuesta3: respuesta3,
            respuesta4: respuesta4,
        };
        SendRespuesta(pregunta, email, respuesta);
    } else if (pregunta == 8) {
        let p8Resp1, p8Resp2, p8Resp3, p8Resp4;
        let respuesta1, respuesta2, respuesta3, respuesta4;

        p8Resp1 = document.getElementById("p8Resp1").checked;
        p8Resp2 = document.getElementById("p8Resp2").checked;
        p8Resp3 = document.getElementById("p8Resp3").checked;
        p8Resp4 = document.getElementById("p8Resp4").checked;

        if (!p8Resp1 && !p8Resp2 && !p8Resp3 && !p8Resp4) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: "Aún no has seleccionado ninguna respuesta.",
                confirmButtonText: 'Cerrar',
            });
            return null;
        } else if (p8Resp1) {
            respuesta1 = 1;
            respuesta2 = 0;
            respuesta3 = 0;
            respuesta4 = 0;
        } else if (p8Resp2) {
            respuesta1 = 0;
            respuesta2 = 1;
            respuesta3 = 0;
            respuesta4 = 0;
        } else if (p8Resp3) {
            respuesta1 = 0;
            respuesta2 = 0;
            respuesta3 = 1;
            respuesta4 = 0;
        } else if (p8Resp4) {
            respuesta1 = 0;
            respuesta2 = 0;
            respuesta3 = 0;
            respuesta4 = 1;
        }

        const respuesta = {
            email: email,
            fecha: fecha,
            pregunta: pregunta,
            respuesta1: respuesta1,
            respuesta2: respuesta2,
            respuesta3: respuesta3,
            respuesta4: respuesta4,
        };
        SendRespuesta(pregunta, email, respuesta);
    }
}

function SendRespuesta(pregunta, email, respuesta) {
    return new Promise((resolve, reject) => {
        db.collection("col-sala")
            .doc("novo")
            .collection("col-respuestas")
            .doc("respuesta" + pregunta + email + "novo")
            .set(respuesta)
            .then(function(docRef) {
                resolve(respuesta);

                const Toast = Swal.mixin({
                    toast: true,
                    position: "top-end",
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    didOpen: (toast) => {
                        toast.addEventListener("mouseenter", Swal.stopTimer);
                        toast.addEventListener("mouseleave", Swal.resumeTimer);
                    },
                });

                Toast.fire({
                    icon: "success",
                    title: "Respuesta enviada",
                });
            })
            .catch(function(error) {
                reject(error);
            });
    });
}