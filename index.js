const url_api = 'https://felipe-e-wendy.herokuapp.com/'  // 'http://localhost:8000/'
const url_api_endpoint_msg = url_api + "msg"

const priceTable = {
    "1": 80,
    "2": 140,
    "3": 220,
    "4": 340,
}

const print_error = (error) => {
    const spinnerForm = document.getElementById("spinnerForm")
    spinnerForm.style.visibility = "hidden"
    console.warn('Something went wrong.', error);
    console.log(error)
    alert("Ocorreu um erro, contate o Felipe (fmarkson@gmail.com) e informe-o")
}

const validate = {
    name: {
        validated: false,
        validator: function (data) {
            if (data.length > 0) {
                this.validated = true
                console.log("Nome Validado")
            } else {
                this.validated = false
            }
        }
    },
    wpp: {
        validated: false,
        validator: function (data) {
            if (data.length == "(99) 99999-9999".length) {
                this.validated = true
                console.log("WhatsApp Validado")
            } else {
                this.validated = false
            }
        }
    },
    msg: {
        validated: false,
        validator: function (data) {
            this.validated = true
            console.log("Mensagem Validada")
        }
    },
    price: {
        validated: false,
        validator: function (data) {
            if (data >= 1) {
                this.validated = true
                console.log("Preço Validado")
            } else {
                this.validated = false
            }
        }
    },
    token: {
        validated: false,
        validator: function (data) {
            if (data) {
                this.validated = true
                console.log("Token Validado")

            } else {
                this.validated = false
            }
        }
    },
    api: {
        validated: false,
        validator: function () {
            fetch(url_api, {
                method: 'GET'
            }).then((response) => {
                if (response.ok) {
                    this.validated = true;
                    return response.json()
                } else {
                    this.validated = false;
                }

                return Promise.reject(response);
            }).then((data) => {
                console.log(data)
            }).catch(print_error)
        }
    },

    can_submit: function () {
        for (const key in this) {
            if (key != "api" && key != "can_submit") {
                const element = this[key]
                if (!element.validated) {

                    show_invalid_field(key)

                    return false
                } else {

                    remove_invalid_field(key)


                }
            }

        } return true

    }


}

const mask_wpp = (valor) => {
    valor = valor.replace(/\D/g, "")
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2")
    valor = valor.replace(/(\d)(\d{4})$/, "$1-$2")
    wpp.value = valor
}

const update_char_left = (valor) => {
    quant = 140;
    total = valor.length
    resto = quant - total
    document.getElementById('cont').textContent = resto
}

const create_alert = (element) => {

    if (!document.getElementById(element.id + "-alert")) {
        let divPai = element.parentNode
        let alert = document.createElement("div")
        alert.id = element.id + "-alert"
        alert.className = "alert alert-danger"
        alert.textContent = "Você é um robô?"
        divPai.insertBefore(alert, element);
    }


}

const remove_alert = (element) => {
    if (document.getElementById(element.id + "-alert")) {
        let divPai = element.parentNode
        divPai.removeChild(document.getElementById(element.id + "-alert"));
    }

}

const check_other_value = (valor) => {
    document.getElementById('price5').checked = true
    valor = valor.replace("R$ ", "")
    valor = valor.replace(/\D/g, "")
    valor = valor.replace(/(\d)(\d{5})$/, "$2")
    valuePrice4.value = "R$ " + valor

}

const get_request = () => {
    const myForm = document.getElementById("myForm");
    let data = JSON.parse(JSON.stringify(Object.fromEntries(new FormData(myForm))))

    const req = {
        name: "",
        wpp: "-1",
        price: 0,
        msg: "",
        token: "",
    }

    req.name = data["name"]
    req.msg = data["msg"]
    req.token = data["g-recaptcha-response"]

    if (data["price"] != 5) {
        req.price = priceTable[data["price"]]
    } else {
        const value = document.getElementById("price")
        req.price = Number(value.value.replace("R$ ", ""))
    }

    req.wpp = data["wpp"]

    return req
}

const show_invalid_field = (id) => {
    const elemnt = document.getElementById(id);
    if (id != "token") {
        console.log(id)
        elemnt.className = elemnt.className + " is-invalid"
    } else {
        create_alert(elemnt)
    }

}

const remove_invalid_field = (id) => {
    const elemnt = document.getElementById(id);
    if (id != "token") {
        elemnt.className = elemnt.className.replace(" is-invalid", "")
    } else {
        remove_alert(elemnt)
    }


}

const show_spinner = () => {
    const spinnerForm = document.getElementById("spinnerForm")
    spinnerForm.style.visibility = "visible"
}

const hide_spinner = () => {
    const spinnerForm = document.getElementById("spinnerForm")
    spinnerForm.style.visibility = "hidden"
}

const send_form = async (req) => {
    const data = get_request()
    console.log(data)
    return fetch(url_api_endpoint_msg, {
        method: 'POST',
        body: JSON.stringify(req),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((response) => {
        if (response.ok) {
            return response.json();
        }
        return Promise.reject(response);
    })

}

const submit = async (e) => {
    const req = get_request()
    for (const key in req) {
        validate[key].validator(req[key])
    }
    console.log(req)
    if (validate.can_submit()) {
        show_spinner()
        await send_form(req).then((response) => {
            hide_spinner()
            return response
        }).catch(print_error)
    }

}


validate.api.validator()

document.getElementById("minPrice").textContent = priceTable["1"];

for (const key in priceTable) {
    const value = priceTable[key]
    const label = document.getElementById('labelPrice' + key);
    label.textContent = "R$ " + value
}

const wpp = document.getElementById('wpp')
wpp.addEventListener('keypress', (e) => {
    mask_wpp(e.target.value);
})
wpp.addEventListener('keyup', (e) => {
    mask_wpp(e.target.value);
})
wpp.addEventListener('keydown', (e) => {
    mask_wpp(e.target.value);
})
wpp.addEventListener('change', (e) => {
    mask_wpp(e.target.value);
})



const msg = document.getElementById('msg')
msg.addEventListener('keydown', (e) => update_char_left(e.target.value))
msg.addEventListener('change', (e) => update_char_left(e.target.value))
msg.addEventListener('keyup', (e) => update_char_left(e.target.value))
msg.addEventListener('keypress', (e) => update_char_left(e.target.value))

const valuePrice4 = document.getElementById('price')
valuePrice4.addEventListener('keydown', (e) => check_other_value(e.target.value))
valuePrice4.addEventListener('change', (e) => check_other_value(e.target.value))
valuePrice4.addEventListener('keyup', (e) => check_other_value(e.target.value))
valuePrice4.addEventListener('keypress', (e) => check_other_value(e.target.value))

const sendForm = document.getElementById('sendForm');
sendForm.addEventListener('click', submit)
