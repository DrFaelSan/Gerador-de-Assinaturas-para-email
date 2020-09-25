var template;
var dismiss;

window.onload = function() {
    template = generateTemplate("#t2");
}

function numberToReal(numero) {
    var numero = numero.toFixed(2).split('.');
    numero[0] = "R$ " + numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
}

function mascara(o, f) {
    v_obj = o
    v_fun = f
    setTimeout("execmascara()", 1)
}

function execmascara() {
    v_obj.value = v_fun(v_obj.value)
}

function leech(v) {
    v = v.replace(/o/gi, "0")
    v = v.replace(/i/gi, "1")
    v = v.replace(/z/gi, "2")
    v = v.replace(/e/gi, "3")
    v = v.replace(/a/gi, "4")
    v = v.replace(/s/gi, "5")
    v = v.replace(/t/gi, "7")
    return v
}

function soNumeros(v) {
    return v.replace(/\D/g, "")
}

function telefone(v) {
    v = v.replace(/\D/g, "") //Remove tudo o que não é dígito
    v = v.replace(/^(\d\d)(\d)/g, "($1) $2") //Coloca parênteses em volta dos dois primeiros dígitos
    v = v.replace(/(\d{5})(\d)/, "$1-$2") //Coloca hífen entre o quarto e o quinto dígitos
    return v
}

function cpf(v) {
    v = v.replace(/\D/g, "") //Remove tudo o que não é dígito
    v = v.replace(/(\d{3})(\d)/, "$1.$2") //Coloca um ponto entre o terceiro e o quarto dígitos
    v = v.replace(/(\d{3})(\d)/, "$1.$2") //Coloca um ponto entre o terceiro e o quarto dígitos
        //de novo (para o segundo bloco de números)
    v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2") //Coloca um hífen entre o terceiro e o quarto dígitos
    return v
}

function cep(v) {
    v = v.replace(/D/g, "") //Remove tudo o que não é dígito
    v = v.replace(/^(\d{5})(\d)/, "$1-$2") //Esse é tão fácil que não merece explicações
    return v
}

function soNumeros(v) {
    return v.replace(/\D/g, "")
}

function mdata(v) {
    v = v.replace(/\D/g, "");
    v = v.replace(/(\d{2})(\d)/, "$1/$2");
    v = v.replace(/(\d{2})(\d)/, "$1/$2");

    v = v.replace(/(\d{2})(\d{2})$/, "$1$2");
    return v;
}

function mcc(v) {
    v = v.replace(/\D/g, "");
    v = v.replace(/^(\d{4})(\d)/g, "$1 $2");
    v = v.replace(/^(\d{4})\s(\d{4})(\d)/g, "$1 $2 $3");
    v = v.replace(/^(\d{4})\s(\d{4})\s(\d{4})(\d)/g, "$1 $2 $3 $4");
    return v;
}

function gerar() {
    var dados = {
        nome: nome.value || "[Digite Nome]",
        cargo: cargo.value || "[Digite Cargo]",
        // email: email.value || "[Digite Email]",
        tel: tel.value || "[Digite o Ramal]",
        cel: cel.value || "[Digite o Celular]",
    };

    var assinatura = document.getElementById('assinatura');
    assinatura.innerHTML = template.apply(dados);

    console.log(assinatura)
    console.log(dados.cel)
    if (dados.cel === "[Digite o Celular]") {
        var celularJaEra = document.getElementById('celX');
        if (celularJaEra !== null && celularJaEra !== undefined) {
            celularJaEra.style.display = 'none';
            console.log('Você não digitou o celular!')
        } else {
            console.log('.')
        }
    }

    createSelection(assinatura);

    try {
        var successful = document.execCommand('copy');
        var msg = successful ? 'successful' : 'unsuccessful';
        var alerta = document.getElementById('alertdiv')
        alerta.innerHTML = ('Assinatura <b>copiada</b> com sucesso!');
        alerta.classList.add("alert-success");
        alerta.removeAttribute("hidden");
    } catch (err) {
        alerta.innerHTML = ('Aperte <code>CTRL+C</code> para copiar');
        alerta.classList.add("alert-info");
        alerta.removeAttribute("hidden");
    }

    try {
        let CorpoAssinatura = $('#assinaturaEmail').html();
        $(".assinaturaCode").text(CorpoAssinatura);

        let botaoCopiar = document.getElementById("btnCopy");
        botaoCopiar.classList.remove("hidden");
        botaoCopiar.attributes.removeNamedItem("hidden")

    } catch (err) {
        console.log("Deu Ruim");
    }

    if (dismiss) clearTimeout(dismiss);
    dismiss = setTimeout(function() {
        alerta.setAttribute("hidden","");
    }, 1500);

    // let assinatura = $('#assinaturaEmail').html();
    // $(".assinaturaCode").text(assinatura);
    // e.preventDefault();

}

function createSelection(element) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.setStartBefore(element.firstChild);
    range.setEndAfter(element.lastChild);
    selection.removeAllRanges();
    selection.addRange(range);
}


var compileTemplate = function(html) {
    var re = /{{([^}]*(?:}[^}]+)*}*)}}/g,
        reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g,
        code = 'var r=[];\n',
        cursor = 0,
        match;

    var add = function(line, js) {
        js ? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') : (code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
        return add;
    }
    while (match = re.exec(html)) {
        add(html.slice(cursor, match.index))(match[1], true);
        cursor = match.index + match[0].length;
    }
    add(html.substr(cursor, html.length - cursor));
    code += 'return r.join("");';

    var template = new Function(code.replace(/[\r\t\n]/g, ''));
    return template;
}

function generateTemplate(selector) {
    var el = document.querySelector(selector);
    if (el.type.toLowerCase() == "template/html") {
        return compileTemplate(el.innerHTML);
    } else throw Error("Type of '" + selector + "' is not a template/html");
}