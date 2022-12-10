// Variáveis do deck
let maoDealer = ['dealer']
let maoPlayer = ['player']
let deck
let cartasFora = [] //serve para guardar todas as cartas que já saíram para posterior comparação
let carta = ''
let somaCartas = 0
let somaPlayer = 0
let somaDealer = 0
const naipes = ['ouros', 'paus', 'copas', 'espadas'];
const valores = ['a', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'j', 'q', 'k'];

//variáveis para o layout
let dealerCounter = document.querySelector('#dealer-counter')
let playerCounter = document.querySelector('#player-counter')
let hitBtn = document.querySelector('#hit')
let standBtn = document.querySelector('#stand')
let endMessage = document.querySelector('.modal-body')
let modal = document.querySelector(".modal")
let dealerHide = document.querySelector('#dealer-hide')
let dealerDeck = document.querySelector('#dealer-deck')

//Código para o jogo e cartas
function sacarCarta(mao) {
    let valor = valores[Math.floor(Math.random() * 13)] //perpassa pelos dois arrays para criar um outro array com valor e naipe
    let naipe = naipes[Math.floor(Math.random() * 4)]
    carta = [valor, naipe]
    if (cartasFora.length === 0) { //tirando a primeira carta, sem verificação se já existe na mesa (retorna um valor undefined por conta do array cartasFora estar vazio)
        mao.push(carta)
        cartasFora.push(carta)
        mostrarCarta(mao, carta)
        return
    } else { //quando já existem cartas na mesa
        for (let i = 0; i < cartasFora.length; i++) {
            if (cartasFora[i].toString() == carta.toString()) { //caso a carta retirada agora já exista na mesa...
                sacarCarta(mao) //chama a função novamente
                return //sai sem executar o resto da função
            }
        }
    }
    mao.push(carta)
    cartasFora.push(carta)
    mostrarCarta(mao, carta) //chama a próxima função, para criar o elemento <img> da carta no HTML
    if (somaPlayer >= 21) {
        hitBtn.disabled = true
        standBtn.disabled = true
        setTimeout(() => {
            sacarCarta
        }, 500, ); //COMO PASSO ESSE MALDITO PARÂMETRO PRA FUNÇÃO?? NADA FUNCIONA!
        setTimeout(() => {
            endGame
        }, 1500);
    }
}

function mostrarCarta(mao, carta) {
    let cardImg = document.createElement('img')
    cardImg.src = "./cards/" + carta[0] + '-' + carta[1] + ".svg"
    cardImg.classList.add('cards')
    cardImg.classList.add('mx-1') //cria um elemento img com o valor e o naipe da carta retirada, concatenado para formar o nome do arquivo .svg
    if (mao[0] == 'dealer') { //gambiarra para saber onde mostrar a carta, no lado do player ou do dealer
        deck = document.querySelector('#dealer-deck')
    } else {
        deck = document.querySelector('#player-deck')
    }
    deck.appendChild(cardImg) //adiciona a carta no elemento selecionado no if anterior
    somar(mao) //chama a próxima função, para mostrar a soma das cartas   
}

function somar(mao) {
    somaCartas = 0
    for (let i = 1; i < mao.length; i++) { //itera o array que forma cada mão para realizar a soma. i = 1 pois o [0] é usado para determinar se o array pertence ao dealer ou ao player
        if (isNaN(mao[i][0])) { //confere se alguma das cartas é valete, rainha, rei ou ás, verificando se o valor é um data type Not a Number
            if (mao[i][0] == 'a') { //se for ás, soma 11 
                somaCartas = somaCartas + 11
            } else { //se for valete, rainha ou rei, 10
                somaCartas = somaCartas + 10
            }
        } else { //se for um número, soma seu valor
            somaCartas = somaCartas + Number(mao[i][0])
        }
    }
    //serve para determinar se o ás vale 1 ou vale 11; se existe ás na mão e a soma das cartas for maior que 21, ele diminui 10 da soma total
    for (let i = 1; i < mao.length; i++) {
        if (somaCartas > 21 && mao[i][0] == 'a') {
            somaCartas = somaCartas - 10
            break //evita que diminua 20 caso encontre dois ás, já que vai sair do loop assim que encontrar o primeiro
        }
    }
    //mostra a soma das cartas no contador, definindo se aparece no player ou no dealer
    if (mao[0] == 'dealer') {
        dealerCounter.innerHTML = somaCartas
        somaDealer = somaCartas //atualiza a variável que será usada para comparação
    } else {
        playerCounter.innerHTML = somaCartas
        somaPlayer = somaCartas
    }
    //desliga o botão hit quando o total do player iguala ou passa de 21
    if (mao[0] == 'player' && somaCartas >= 21) {
        hitBtn.disabled = true
    }
}

function stand() { //é chamado depois do player parar de pedir cartas, o dealer inicia sua rodada e logo após ocorre a comparação para determinar o vencedor
    hitBtn.disabled = true
    standBtn.disabled = true
    dealerHide.parentNode.removeChild(dealerHide) //exclui carta virada pra baixo
    dealerDeck.classList.add('flex-row-reverse') //para as cartas novas surgirem do lado onde estava a virada
    setTimeout(() => { //aqui deveria haver um loop para retirar cartas do dealer enquanto somaDealer <= 17, mas substituí pela função recursiva
        recursiveSacar()
    }, 1000)
}

function recursiveSacar() { //gambiarra master! Como o setTimeout() não estava funcionando com o loop de sacarCartas, substitui o loop por uma função recursiva
    if (somaDealer <= 17) {
        sacarCarta(maoDealer)
        setTimeout(() => {
            recursiveSacar()
        }, 1000);
        return
    } else {
        setTimeout(endGame, 2000)
    }
}

function endGame() { //chama modal do fim do jogo, mostra vencedor e reseta variáveis para a próxima rodada
    modal.classList.add("show")
    modal.style.display = "block"
    if (somaPlayer > 21) {
        endMessage.innerHTML = 'You lose!'
        moneyInitial = money
    } else if (somaDealer > 21) {
        endMessage.innerHTML = 'You win!'
        moneyInitial = money + (bet * 2)
    } else if (somaPlayer == somaDealer) {
        endMessage.innerHTML = 'Tie!'
        moneyInitial = money + bet
    } else if (somaPlayer > somaDealer) {
        endMessage.innerHTML = 'You win'
        moneyInitial = money + (bet * 2)
    } else if (somaDealer > somaPlayer) {
        endMessage.innerHTML = 'You lose!'
        moneyInitial = money
    }
}

//Código das apostas
const betBox = document.querySelector(".bet-box-value")
let wallet = document.querySelector("#wallet")
const betForm = document.querySelector("#bet-form")
let bet = 0 //valor da aposta, vai na bet box
let moneyInitial = 500
let money
wallet.innerHTML = moneyInitial

function setBet() {
    bet = Number(betForm.value)
    betBox.innerHTML = bet.toLocaleString("pt-br", { minimumFractionDigits: 2 })
    if (bet < 1 || bet > 500) {
        alert('Insira um valor entre 1 e 500.')
        bet = 0
        betBox.innerHTML = 0
    }
    money = moneyInitial - bet
    if (money < 0) {
        alert("Você não tem dinheiro suficiente para essa aposta.")
        money = moneyInitial + bet
        bet = 0
        betBox.innerHTML = 0
    }
    money = moneyInitial - bet
    wallet.innerHTML = money
}

//Código do layout
const initial = document.querySelector("#initial-round")
const startBtn = document.querySelector("#btn-start")
const betRound = document.querySelector("#bet-round")
const playBtn = document.querySelector("#play-btn")
const playRound = document.querySelector("#play-round")

startBtn.addEventListener("click", function () { //some a primeira tela e mostra a segunda
    setTimeout(() => initial.classList.add("hidden"), 300);
    setTimeout(() => betRound.classList.remove('hidden', 'hide'), 1500)
    setTimeout(() => initial.style.display = "none", 1500)
});

//

playBtn.addEventListener("click", function () { //some a segunda tela, mostra a segunda e chama as cartas iniciais
    if (bet == 0) { //avisa caso o player não tenha feito nenhuma aposta
        alert('O jogo não é de graça, aposte!')
        return
    }
    setTimeout(() => betRound.classList.add("hidden"), 300);
    setTimeout(() => playRound.classList.remove('hidden'), 1500)
    setTimeout(() => playRound.classList.remove('hide'), 1500)
    setTimeout(() => betRound.style.display = "none", 1500)
    document.querySelector('#bet-box-value-play').innerHTML = bet.toLocaleString("pt-br", { minimumFractionDigits: 2 })
    sacarCarta(maoDealer)
    sacarCarta(maoPlayer)
    sacarCarta(maoPlayer)
});

//Reset function

function reset() {
    modal.classList.remove("show")
    modal.style.display = "none"
    setTimeout(() => playRound.classList.add('hidden'), 1500)
    setTimeout(() => playRound.classList.add('hide'), 1500)
    setTimeout(() => betRound.classList.remove('hidden'), 1500)
    setTimeout(() => betRound.style.display = "block", 1500)
    betBox.innerHTML = 0 //reseta variáveis mudadas na rodada anterior
    bet = 0
    wallet.innerHTML = moneyInitial //essa foi modificada na função endGame, o valor do moneyInitial considera os ganhos e perdas anteriores
    cartasFora = []
    maoDealer = ['dealer']
    maoPlayer = ['player']
    somaPlayer = 0
    somaDealer = 0
    hitBtn.disabled = false //reabilita os botões
    standBtn.disabled = false
    document.querySelector('#dealer-deck').innerHTML = '' //exclui imagens das cartas dos decks
    document.querySelector('#player-deck').innerHTML = ''
    dealerDeck.appendChild(dealerHide) //retorna a carta virada
    dealerDeck.classList.remove('flex-row-reverse') 
}