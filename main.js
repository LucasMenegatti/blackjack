/* Declaração de Variáveis */
let soma_dealer = 0;
let soma_player = 0;
let primeira_carta_PC;
let segunda_carta_PC;
let deal_enabled = true;
let hit_enabled = false;
let stay_enabled = false;
let end = false;
let reiniciar_enabled = false;
let aces_pc = 0;
let aces_player = 0;
let prox_carta;

const div_cartas_PC = document.getElementById("div_cartas_PC");
const div_cartas_player = document.getElementById("div_cartas_player");
const info_jogador = document.getElementById("info_jogador");
const info_PC = document.getElementById("info_PC");
const info_geral = document.getElementById("info_geral")

/* Construtor para o Objeto Carta */
class Carta {
    constructor(img_url, valor) {
        this.img = img_url;
        this.valor = valor;
    }
}

/* Função que cria um Deck de Cartas */
function create_deck() {
    const deck = [];
    const naipes=["clubs", "diamonds", "hearts", "spades"];
    const figures=["ace", "jack", "queen", "king"];
    for(var i = 0; i < 4; i++) {
        for(var j = 2; j < 11; j++){
            deck.push(new Carta(`./imagens/deck/${j}_of_${naipes[i]}.png`,j));
        }
        for(var j = 0; j < 4; j++){
            if(figures[j]=="ace"){
                deck.push(new Carta(`./imagens/deck/${figures[j]}_of_${naipes[i]}2.png`,11));
            } else {
                deck.push(new Carta(`./imagens/deck/${figures[j]}_of_${naipes[i]}2.png`,10));
            }
        }
    }
    return deck;
}

/* Função que retira uma carta aleatória do deck e a retorna */
function draw_card() {
    return deck.splice(Math.floor(Math.random()*deck.length-1),1);
}

function escreve_soma(condicao) {
    switch(condicao) {
        case 'mostrar':
            info_PC.innerHTML = 'Soma: '+soma_dealer;
            info_jogador.innerHTML = 'Soma: '+soma_player;
            break;
        default:
            info_PC.innerHTML = 'Soma: ??????';
            info_jogador.innerHTML = 'Soma: '+soma_player;
            break;
    }
}

function escreve_info(texto) {
    info_geral.innerHTML = '<h2>'+texto+'</h2>';
}

/* Verificando o clique em cada botão */
const buttons = document.querySelectorAll('.botao');
buttons.forEach((button) => {
    button.addEventListener('click', () => {
        button_press(button.value);
    })
})

button_press = function(option){
    switch (option) {
        case 'Deal':
            if(deal_enabled){
                /* ========== TURNO DO DEALER ========== */
                /* Pesca a primeira carta para o Dealer */
                let carta = draw_card();
                if(carta[0].valor == 11) aces_pc++;
                soma_dealer += carta[0].valor;
                primeira_carta_PC = carta[0].img;
                /* Pesca a Segunda Carta para o Dealer */
                let carta2 = draw_card();
                if(carta2[0].valor == 11) aces_pc++;
                segunda_carta_PC = carta2[0].img;
                if(aces_pc == 2){
                    aces_pc--;
                    soma_dealer += carta2[0].valor-10;
                } else {
                    soma_dealer += carta2[0].valor;
                }
                /* ========== TURNO DO JOGADOR ========== */
                /* Pesca a primeira carta para o jogador */
                let carta3 = draw_card();
                if(carta3[0].valor == 11) aces_player++;
                soma_player += carta3[0].valor;
                /* Pesca a segunda carta para o jogador */
                let carta4 = draw_card();
                if(carta4[0].valor == 11) aces_player++;
                if(aces_player == 2){
                    aces_player--;
                    soma_player += carta4[0].valor-10;
                } else {
                    soma_player += carta4[0].valor;
                }
                /* Imprimindo os elementos html */
                div_cartas_PC.innerHTML = '<img class="carta" src="./imagens/deck/card_back.png" /><img class="carta" src="'+carta2[0].img+'" />';
                div_cartas_player.innerHTML = '<img class="carta" src="'+carta3[0].img+'" /><img class="carta" src="'+carta4[0].img+'" />';
                /* Verifica se o jogador tem um 'Blackjack' (sum = 21) */
                if(soma_player==21){
                    escreve_soma()
                    escreve_info('Blackjack!!!')
                    hit_enabled = false;
                    document.getElementById('botao-hit').classList.add("botao-inativo");
                    document.getElementById('botao-hit').classList.remove("botao-ativo");
                } else {
                    escreve_soma();
                    hit_enabled = true;
                    document.getElementById('botao-hit').classList.add("botao-ativo");
                    document.getElementById('botao-hit').classList.remove("botao-inativo");
                }
                /* Setup dos Botões */
                deal_enabled = false;
                document.getElementById('botao-deal').classList.add("botao-inativo");
                document.getElementById('botao-deal').classList.remove("botao-ativo");
                stay_enabled = true;
                document.getElementById('botao-stay').classList.add("botao-ativo");
                document.getElementById('botao-stay').classList.remove("botao-inativo");
            }
            break;
        case 'Hit':
            if(hit_enabled){
                if(soma_player<=21){
                    prox_carta = draw_card();
                    /* Lógica quando receber um Ás */
                    if(prox_carta[0].valor == 11) aces_player++;
                    soma_player += prox_carta[0].valor;
                    var mydiv = div_cartas_player;
                    var newcontent = document.createElement('div');
                    newcontent.innerHTML = '<img class="carta" src="'+prox_carta[0].img+'" />';
                    while (newcontent.firstChild) {
                        mydiv.appendChild(newcontent.firstChild);
                    }
                    escreve_soma();
                    if(soma_player>21){
                        if(aces_player>0){
                            aces_player--;
                            soma_player -= 10;
                            escreve_soma();
                        } else {
                            escreve_soma('mostrar');
                            escreve_info('Busted!!!');
                            stay_enabled = false;
                            document.getElementById('botao-stay').classList.add("botao-inativo");
                            document.getElementById('botao-stay').classList.remove("botao-ativo");
                            hit_enabled = false;
                            document.getElementById('botao-hit').classList.add("botao-inativo");
                            document.getElementById('botao-hit').classList.remove("botao-ativo");
                            reiniciar_enabled = true;
                            document.getElementById('botao-reiniciar').classList.add("botao-ativo");
                            document.getElementById('botao-reiniciar').classList.remove("botao-inativo");
                            div_cartas_PC.innerHTML = '<img class="carta" src="'+primeira_carta_PC+'" /><img class="carta" src="'+segunda_carta_PC+'" />';
                        }
                    }
                }
            }
            break;
        case 'Stay':
            hit_enabled = false;
            document.getElementById('botao-hit').classList.add("botao-inativo");
            document.getElementById('botao-hit').classList.remove("botao-ativo");
            if(stay_enabled){
                div_cartas_PC.innerHTML = '<img class="carta" src="'+primeira_carta_PC+'" /><img class="carta" src="'+segunda_carta_PC+'" />';
                while(!end) {
                    if(soma_dealer>21) {
                        if(aces_pc>0){
                            aces_pc--;
                            soma_dealer -= 10;
                            escreve_soma('mostrar');
                        } else {
                            escreve_soma('mostrar');
                            escreve_info('Você VENCEU!!!');
                            end = true;
                            stay_enabled = false;
                            document.getElementById('botao-stay').classList.add("botao-inativo");
                            document.getElementById('botao-stay').classList.remove("botao-ativo");
                            reiniciar_enabled = true;
                            document.getElementById('botao-reiniciar').classList.add("botao-ativo");
                            document.getElementById('botao-reiniciar').classList.remove("botao-inativo");
                        }
                    } else if(soma_dealer==21 && soma_player==21){
                        escreve_soma('mostrar');
                        escreve_info('Empate!!!');
                        stay_enabled = false;
                        document.getElementById('botao-stay').classList.add("botao-inativo");
                        document.getElementById('botao-stay').classList.remove("botao-ativo");
                        reiniciar_enabled = true;
                        document.getElementById('botao-reiniciar').classList.add("botao-ativo");
                        document.getElementById('botao-reiniciar').classList.remove("botao-inativo");
                        end = true;
                        break;
                    } else if(soma_player<soma_dealer){
                        escreve_soma('mostrar');
                        escreve_info('Você PERDEU!!!');
                        stay_enabled = false;
                        document.getElementById('botao-stay').classList.add("botao-inativo");
                        document.getElementById('botao-stay').classList.remove("botao-ativo");
                        reiniciar_enabled = true;
                        document.getElementById('botao-reiniciar').classList.add("botao-ativo");
                        document.getElementById('botao-reiniciar').classList.remove("botao-inativo");
                        end = true;
                        break;
                    } else if(soma_player>=soma_dealer) {
                        prox_carta = draw_card();
                        soma_dealer += prox_carta[0].valor;
                        /* Lógica quando receber um Ás */
                        if(prox_carta[0].valor == 11) aces_pc++;
                        var mydiv = div_cartas_PC;
                        var newcontent = document.createElement('div');
                        newcontent.innerHTML = '<img class="carta" src="'+prox_carta[0].img+'" />';
                        while (newcontent.firstChild) {
                            mydiv.appendChild(newcontent.firstChild);
                        }
                        escreve_soma('mostrar');
                    }
                }
            }
            break;
        case 'Reiniciar':
            if(reiniciar_enabled) {
                window.location.reload();
            }
    }
}

/* Construindo um deck de cartas */
const deck = create_deck();

/* Exibindo uma mensagem na barra de informações gerais */
escreve_info('Boa sorte! :)');