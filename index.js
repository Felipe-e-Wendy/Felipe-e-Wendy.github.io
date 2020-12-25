const tel = document.getElementById('wpp') // Seletor do campo de telefone
tel.addEventListener('keypress', (e) => mascaraTelefone(e.target.value))
tel.addEventListener('keyup', (e) => mascaraTelefone(e.target.value))
tel.addEventListener('keydown', (e) => mascaraTelefone(e.target.value))
tel.addEventListener('change', (e) => mascaraTelefone(e.target.value))

const mascaraTelefone = (valor) => {
    valor = valor.replace(/\D/g, "")
    valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2")
    valor = valor.replace(/(\d)(\d{4})$/, "$1-$2")
    tel.value = valor
}


const msg = document.getElementById('msg') // Seletor do campo de mensagem
msg.addEventListener('keydown', (e) => limite_textarea(e.target.value))
msg.addEventListener('change', (e) => limite_textarea(e.target.value))
msg.addEventListener('keyup', (e) => limite_textarea(e.target.value))
msg.addEventListener('keypress', (e) => limite_textarea(e.target.value))

const limite_textarea = (valor) => {
    quant = 140;
    total = valor.length
    resto = quant - total
    document.getElementById('cont').textContent = resto
}


const valuePrice4 = document.getElementById('valuePrice5') // Seletor do campo de mensagem
valuePrice4.addEventListener('keydown', (e) => check_other_value(e.target.value))
valuePrice4.addEventListener('change', (e) => check_other_value(e.target.value))
valuePrice4.addEventListener('keyup', (e) => check_other_value(e.target.value))
valuePrice4.addEventListener('keypress', (e) => check_other_value(e.target.value))


const check_other_value = (valor) => {
    document.getElementById('price5').checked = true
    valor = valor.replace("R$ ", "")
    valor = valor.replace(/\D/g, "")
    valor = valor.replace(/(\d)(\d{5})$/, "$2")
    valuePrice4.value = "R$ " + valor

}

const sendForm = document.getElementById('sendForm');
sendForm.addEventListener('click', (e) => send_form(e.target.value))

const priceTable = {
    "1": 80,
    "2": 140,
    "3": 220,
    "4": 340,
}

document.getElementById("minPrice").textContent = priceTable["1"];

for (const key in priceTable) {
    if (Object.hasOwnProperty.call(priceTable, key)) {
        const value = priceTable[key]
        const label = document.getElementById('labelPrice' + key);
        label.textContent = "R$ " + value

    }
}



const parse_request = () => {
    const myForm = document.getElementById("myForm");
    let data = JSON.parse(JSON.stringify(Object.fromEntries(new FormData(myForm))))

    if (data["price"] != 5) {
        data["price"] = priceTable[data["price"]]
    } else {
        const value = document.getElementById("valuePrice5")
        data["price"] = Number(value.value.replace("R$ ", ""))
    }

    data["wpp"] = data["wpp"].replace(/\D/g, "");

    data["token"] = userToken 
    return data
}


const send_form = (value) => {
    const spinnerForm =  document.getElementById("spinnerForm")
    spinnerForm.style.visibility = "visible"
    const data = parse_request()
    console.log(data)
    fetch('https://felipe-e-wendy.herokuapp.com/data/', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json'
        }
    }).then((response) => {
        if (response.ok) {
            spinnerForm.style.visibility = "hidden"
            return response.json();
        }
        
        return Promise.reject(response);
    }).then((data) => {
        console.log(data);
    }).catch((error) => {
        console.warn('Something went wrong.', error);
        console.log(error)
        alert("Ocorreu um erro, contate o Felipe (fmarkson@gmail.com) e informe-o")
    });

}


var captcha = false
var userToken = -1

const can_submit = () => { document.getElementById('sendForm').disabled = !(true & captcha)}
const cannot_submit = () => { document.getElementById('sendForm').disabled = true }

const buttonArea = document.getElementById("buttonArea");
buttonArea.addEventListener('mouseover', (e) => validate_data())

function check_captcha (token){
    captcha = true
    can_submit()
    userToken = token
}

const validate_data = () => {
    const data = parse_request()
    const name = document.getElementById('nome');
    const wpp = document.getElementById('wpp');
    if (data["name"]) {
        name.className = name.className.replace(" is-invalid", "")
        can_submit()
    } else {
        name.className = name.className + " is-invalid"
        cannot_submit()
        return
    }

    if (data["wpp"] > 9999999999) {
        wpp.className = wpp.className.replace(" is-invalid", "")
        can_submit()
    } else {
        wpp.className = wpp.className + " is-invalid"
        cannot_submit()
        return
    }
}