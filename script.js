function soma(chamadas,intervaloemminutos,tmasegundos,ns,respostaalvosegundos,ocupacao,retracao){


    intervaloemminutos = document.getElementById("intervaloemminutos").value;
    var niveladorPorHora = 60 / parseInt(intervaloemminutos);
    
    chamadas = document.getElementById("chamadas").value;
    var chamadasPorHora = parseInt(chamadas) * niveladorPorHora;


    tmasegundos = parseInt(document.getElementById("tmasegundos").value);
    var tmaMinutos = parseInt(tmasegundos)/60;
    var intensidadeDoTrafegoEmHora = (parseInt(chamadasPorHora) * tmaMinutos) / 60;
    var erlang = parseInt(intensidadeDoTrafegoEmHora);

    ns = parseInt(document.getElementById("ns").value);
    respostaalvosegundos = document.getElementById("respostaalvosegundos").value;

    ocupacao = document.getElementById("ocupacao").value;
    retracao = parseInt(document.getElementById("retracao").value);

    if (confirm("Você definiu as seguintes condições: Número de chamadas = " + chamadas + ", Intervalo de " + intervaloemminutos + " minutos, Tempo de manuseio de " + tmasegundos + " segundos, Nível de serviço de " + ns + "%, Tempo de resposta aceitavel de " + respostaalvosegundos + " segundos e um Encolhimento de " + retracao + "%?")){

    //Vamos trabalhar a primeira fila da Fórmula Erlang (X)

    var agentesTotais = 0;

    for(var agentesNecessarios = erlang + 1; agentesNecessarios > erlang; agentesNecessarios++){
    var fatorial = agentesNecessarios;
    var resultadoFatorial = fatorial;
        for (var i = 1; i < fatorial; i++) {
            resultadoFatorial *= i;
        }
    var potenciaDaIntensidade = erlang ** agentesNecessarios;
    
    var x = potenciaDaIntensidade / resultadoFatorial * (agentesNecessarios/(agentesNecessarios-erlang));

    // Trabalhe a Soma de uma Série (Y)

    var y = 0;

    const numeroDaPotencia = erlang;

    for(var i = 0; i < agentesNecessarios; i++){
        var potencia = numeroDaPotencia ** i;
        
        if(i===0){
            var resultadoFatoracao = 1;
            var resultadoFInal = potencia / resultadoFatoracao;
            y = resultadoFInal + y;

        }else{
            var numeroFatorial = i;
            var resultadoFatoracao = numeroFatorial;

            for(var ii = 1; ii < i; ii++){
                resultadoFatoracao *= ii;
            }
            var resultadoFInal = potencia / resultadoFatoracao;
            y = resultadoFInal + y;
        }
    }

    //AGORA COLOCANDO O X E Y NA FORMULA ERLANG C (PW) QUE CALCULA A PROBABILIDADE DE UMA CHAMADA ENTRAR EM ESPERA

    var pw = x / (x+y);

    //CALCULANDO O NÍVEL DE SERVIÇO

    var exp = -(agentesNecessarios - erlang) * (respostaalvosegundos/tmasegundos);
    var euler = 2.71828 ** exp;
    var nsInicial = 1 - (pw * euler);
    var metaNs = (ns/100);

    if(nsInicial.toFixed(3) >= metaNs.toFixed(3)){
        
        agentesTotais = agentesNecessarios;
        break;

    }

}
// CALCULANDO A VELOCIDADE MÉDIA DE RESPOSTA
    
    var asa = pw * tmasegundos / (agentesTotais - erlang);

// PERCENTUAL DE CHAMADAS ATENDIDAS IMEDIATAMENTE

    var respostaImediata = (1 - pw) * 100;

// PERCENTUAL DE OCUPAÇÃO MÁXIMA

    var maximaOcupacao = (erlang / agentesTotais) * 100;

// AGENTES NECESSÁRIOS COM ENCOLHIMENTO

    var agentesComEncolhimento = agentesTotais / (1-(retracao/100));

  document.getElementById("resultado").innerHTML = "<div class='sobrepor'>"+ "<h1>Relatório</h1>" +
  "*O número total de agentes necessários para atingir a meta do nível de serviço estimado são de <b>" + agentesTotais.toFixed(0) +" agentes</b><br>"+
  "*O número total de agentes necessários considerando o percentual de retração são de <b>" + agentesComEncolhimento.toFixed(0) +" agentes</b><br>"+
  "*A probabilidade de uma chamada ter que esperar é de <b>" + (pw*100).toFixed(0) + "%</b><br>" +
  "*O nível de serviço calculado nessas condições é de <b>" + (nsInicial*100).toFixed(0) + "%</b><br>" +
  "*A velocidade média de resposta é de <b>" + asa.toFixed(0) + " segundos</b>"+"<br>"+
  "*O percentual de resposta imediata é de <b>" + respostaImediata.toFixed(0) + "%</b>" + "<br>" +
  "*A ocupação máxima é de <b>" + maximaOcupacao.toFixed(0) + "%</b>"+"</div>";
  
  document.getElementById("agentesNecessariosDash").innerHTML = "<p>" + agentesTotais.toFixed(0) + "</p>";
  document.getElementById("agentesComRetracaoDash").innerHTML = "<p>" + agentesComEncolhimento.toFixed(0) + "</p>";
  
  
    }else{
        alert("Refaça a operação")
    }

}