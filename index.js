const url_api = 'https://felipe-e-wendy.herokuapp.com/'  // 'http://localhost:8000/'
const endpoint_msg = "msg"

const prices = {
    "geladeira": 3500,
    "maqLavar": 2500,
    "tv": 2000,
    "fogao": 1500,
}

const getFormObj = () => {
    const formObj = {
        "name": "",
        "wpp": "",
        "price": "",
        "msg": "",
        "g-recaptcha-response": "",
    }

    for (const key in formObj) {
        if (Object.hasOwnProperty.call(formObj, key)) {
            const value = document.getElementById(key).value
            formObj[key] = value

        }
    }

    formObj["token"] = formObj["g-recaptcha-response"]
    delete formObj["g-recaptcha-response"]
    return formObj
}

const print_error = (error) => {
    console.warn('Something went wrong.', error);
    console.log(error)
    alert("Ocorreu um erro, contate o Felipe (fmarkson@gmail.com) e informe-o")
}

const active_api = async () => {
    await fetch(url_api, {
        method: 'GET'
    }).then((response) => {
        if (response.ok) {
            pagarBtn.disabled = false
            return response.json()
        } else {
            alert("Servidor fora do ar, contate o Felipe (fmarkson@gmail.com) e informe-o")
        }
        return Promise.reject(response);
    }).then((data) => {
        console.log(data)
    }).catch(print_error)
}

const sendPOST = async ({ data, endpoint }) => {
    const response = await fetch(url_api + endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json'
        }
    })
    if (response.ok) {
        return response.json()
    }
    return await Promise.reject(response)
}

const calcPerc = (valor) => {
    for (const key in prices) {
        if (Object.hasOwnProperty.call(prices, key)) {
            const price = prices[key];
            const perc = document.getElementById(key)
            perc.textContent = Math.min(Math.round(100 * valor / price), 100) + "%"

        }
    }
}

const resetForm = () => {
    myForm.reset()
    calcPerc(price.value)
}

function enviarForm() {
    const obj = getFormObj()
    sendPOST({ "data": obj, "endpoint": endpoint_msg })
        .then(({ url_pagamento }) => {
            resetForm()
            grecaptcha.reset()
            window.open(url_pagamento)

        })
}

myForm.addEventListener("submit", event =>{
    event.preventDefault()
    grecaptcha.execute()
})

price.addEventListener("input", ({ target }) => { calcPerc(target.value) })


wpp.addEventListener("input", ({ target }) => {
    target.value = target.value.replace(/\D/g, "")
    target.value = target.value.replace(/^(\d{2})(\d)/g, "($1) $2")
    target.value = target.value.replace(/(\d)(\d{4})$/, "$1-$2")
})

msg.addEventListener("input", ({ target }) => {
    numberChar.textContent = 140 - target.value.length
})

calcPerc(price.value)
active_api()