// Generate card items
const symbols = ["fa fa-diamond", "fa fa-paper-plane-o","fa fa-bolt", "fa fa-cube", "fa fa-bicycle", "fa fa-leaf", "fa fa-anchor", "fa fa-bomb", "fa fa-diamond", "fa fa-paper-plane-o",
                  "fa fa-bolt", "fa fa-cube", "fa fa-bicycle", "fa fa-leaf", "fa fa-anchor", "fa fa-bomb"];
const type = ['diamond', 'paper', 'bolt', 'cube', 'bicycle', 'leaf', 'anchor', 'bomb', 'diamond', 'paper', 'bolt', 'cube', 'bicycle', 'leaf', 'anchor', 'bomb']

const ul = document.getElementById('group-id');

symbols.forEach((el, index) => {
  const li = document.createElement('li');
  const iTag = document.createElement('i');
  li.className = "card-item";
  li.setAttribute('type', type[index]);
  iTag.className = el;
  li.appendChild(iTag);
  ul.appendChild(li);
});

// Add click event listener to each card item.
let cardItem = document.getElementsByClassName("card-item");
// Now an array of cards is created
const cardArray = [...cardItem];
// Declare letiable of card group
const cardGroup = document.getElementById("group-id");
// declare a letiable of correct cards
const correctCards = document.getElementsByClassName('correct');
// declare letiable of card is opened
let openedCardStore = [];
// Declare the move, counter and stars letiables
let move = 0;
const counter = document.querySelector('.move-counter');
const stars = document.querySelectorAll(".fa-star");
// Declare letiables for the timer
const timerElement = document.querySelector('.timer');
let myTimer;
let seconds = 0, minutes = 0;
// declare a letiable for the modal's id
const successModal = document.getElementById("successModal");

// Shuffle cards by using Fisher-Yates (aka Knuth) algorithm
/**
 * @description shuffle an array of the cards
 * @param array - an array of cards
 * @return shuffled array
 */
function shuffle(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
 * @description play the game but the cards will randomly be shuffled first then initialize
 * the timer, the move counter and the star rating. Finally, remove all the cards' class
 */
function restartGame() {
    const shuffledCard = shuffle(cardArray);
    cardGroup.innerHTML = "";

    shuffledCard.forEach(function(item){
        cardGroup.appendChild(item);
    });

    // Reset timer
    clearInterval(myTimer);
    timerElement.innerHTML = "0 mins 0 secs";

    // Reset move counter
    move = 0;
    counter.innerHTML = "0";

    // Reset star rating
    for(let i=0; i < stars.length; i++){
        stars[i].classList.remove("fa-star-o");
        stars[i].classList.add("fa-star");
    };

    // Remove all the cards' class
    for(let index = 0; index < cardArray.length; index++){
        cardArray[index].classList.remove("show", "correct", "stop-clicking", "open-flip", "close-flip");
    };

    // For an issue when a player click a card then press restart button
    openedCardStore = [];
}

/**
 * @description this function is used to temporaryly prevent user from selecting more than two
 * cards.
 * */
function disableAllCards() {
    Array.prototype.filter.call(cardArray, function (card){
        card.classList.add('stop-clicking');
    });
}

/**
 * @description this function is used to enable user to select cards
 * after running out of timeout interval except for the correct ones
 * */
function enableAllCards() {
    Array.prototype.filter.call(cardArray, function (card){
        card.classList.remove('stop-clicking');
        for(let index = 0; index < correctCards.length; index++){
            correctCards[index].classList.add('stop-clicking');
        };
    });
}

/**
 * @description two functions below checking the cards is the same or not and there is an
 * appropriate animation for each case
 */
function theSame() {
    // when the cards are the same, remove the open-clip animation class and add correct animation class
    openedCardStore[0].classList.remove("open-flip");
    openedCardStore[1].classList.remove("open-flip");
    openedCardStore[0].classList.add("correct", "stop-clicking");
    openedCardStore[1].classList.add("correct", "stop-clicking");
    // reset opened cards to an empty array
    openedCardStore = [];
}

function notTheSame() {
    // Add animation
    openedCardStore[0].classList.add("wobble");
    openedCardStore[1].classList.add("wobble");
    // Using setTimeout so there will be an interval before removing the added classes
    // and user will have a small time to memorize the symbol
    disableAllCards();
    setTimeout(function (){
        // Add animation
        openedCardStore[0].classList.add("close-flip");
        openedCardStore[1].classList.add("close-flip");
        // Remove added classes
        openedCardStore[0].classList.remove("show", "stop-clicking", "open-flip", "wobble");
        openedCardStore[1].classList.remove("show", "stop-clicking", "open-flip", "wobble");
        setTimeout(function () {
            // Add animation
            openedCardStore[0].classList.remove("close-flip");
            openedCardStore[1].classList.remove("close-flip");
            enableAllCards();
            openedCardStore = [];
        }, 150);
    }, 500);
}

// To check two cards is the same or not. Adding a type attribute to li tags to make them unique
// depend on the attribute, we can check two cards is the same or not
/**
 * @description store two opened cards into an array, then get type attribute of the cards to check their attribute
 */
function openedCards() {
    openedCardStore.push(this);
    // Declare the length letiable of the opened cards
    let cardNumber = openedCardStore.length;
    if(cardNumber === 2){
        countTheMove();
        if(openedCardStore[0].type === openedCardStore[1].type){
            theSame();
        } else {
            notTheSame();
        }
    };
}

/**
 * @description count the move, start the timer and set the star rating
 */

function countTheMove(){
    // Increase the move by one, everytime user selects a pair of cards then show the move on the page
    move++;
    counter.innerHTML = move.toString();
    // Start the timer when there is a pair of cards is opened
    if(move === 1){
        seconds = 0;
        minutes = 0;
        timer();
    };

    // Set the star rating in consistent with the moves
    if(move > 7 && move < 10){
      // When the move greater than seven and smaller than 10, the star at index 2 will be removed
      // and replace it with an empty star
        for(let i = 1; i < 3; i++){
            if(i === 2){
                stars[i].classList.remove('fa-star');
                stars[i].classList.add('fa-star-o');
            };
        };
    }
    else if(move >= 12){
      // When the move greater than twelve, the star at index 1 will be removed
      // and replace it with an empty star
        for(let i = 1; i < 3; i++){
            if(i >= 1){
                stars[i].classList.remove('fa-star');
                stars[i].classList.add('fa-star-o');
            };
        };
    };
}

/**
 * @description the timer
 */
function timer(){
    myTimer = setInterval(function (){
        seconds++;
        if(seconds === 60){
            minutes++;
            seconds = 0;
        };

        timerElement.innerHTML = minutes + " mins " + seconds + " secs";
    }, 1000);
}

/**
 * @description modal for winning situation. It will show timer, star rating and final move
 */

function winningModal(){
    let totalTime;
    if(correctCards.length === 16){
        clearInterval(myTimer);
        totalTime = timerElement.innerHTML;
        // Show modal
        successModal.classList.add('popup-modal');
        // render total time and moves to the page
        document.getElementById('time').innerHTML = totalTime;
        document.getElementById("total-move").innerHTML = move.toString();

        // counting the star
        // declare letiables for the stars
        let lostStars = document.querySelectorAll(".fa-star-o");
        const defaultStars = 3;
        let remainedStars = defaultStars - lostStars.length;

        document.getElementById("star-rate").innerHTML = remainedStars.toString();
    };
}

/**
 * @description close the modal via no button of the modal
 */

function closeModal() {
    successModal.classList.remove('popup-modal');
}

/**
 * @description play the game again via play again button of the modal
 */

function playAgain() {
    successModal.classList.remove('popup-modal');
    restartGame();
}

/**
 * @description showing content of a card
 */

function showContent(){
    this.classList.toggle("show");
    this.classList.toggle("stop-clicking");
    this.classList.toggle("open-flip");
}

/**
 * @description add click event listener to the cards
 */
for(let index = 0; index < cardArray.length; index++){
    cardItem = cardArray[index];
    cardItem.addEventListener("click", showContent);
    cardItem.addEventListener("click", openedCards);
    cardItem.addEventListener("click", winningModal);
};
