const Chance = require("chance");
const chance = new Chance();
const crypto = require("crypto");
const { getRandomNumber, getRandomXForCrash } = require('./random')

/**
 * JACKPOT MODE
 *
 * The result of the round is determined by three independent participants in the round: the game mode and the first 2 players of the round.
 * Game mode generates a seed when a new round is initiated (random 16 characters).
 * A hashed version of this seed is publicly available prior to the start of the round (SHA256).
 * The client seed is generated for each player separately (random 20 symbols) and is updated after each successful bet in any of the game modes.
 * Each player can see his own seed, which will be used when placing a bet.
 * When a round starts, the function combines the seed of the round of the given game mode with the seeds of the first two players.
 * The SHA512 hash is generated from the concatenated characters, and the result of the game is generated from this hash.
 * The result of the game is a winning ticket.
 * The player who owns the given ticket wins.
 */
console.log("***********************************************");
console.log("********************JACKPOT********************");
console.log("***********************************************");
console.log("\n");

class PlayerJackpot {
  constructor(id) {
    this.id = id;
    this.seed = chance.string({ length: 20 });
    this.bet = 0;
    this.tickets = [undefined, undefined];
  }

  get firstTicket() {
    return this.tickets[0];
  }

  get lastTicket() {
    return this.tickets[1];
  }

  setBet(bet) {
    this.bet = bet;
  }

  setTicketRange(first, last) {
    this.tickets[0] = first;
    this.tickets[1] = last;
  }

  toString() {
    return `Player ${this.id}: bet ${this.bet}$ tickets[${this.tickets[0]}, ${this.tickets[1]}]`;
  }
}

class Jackpot {
  constructor() {
    this.roundId = 0;
    this.roundSeed = "";
    this.bank = 0;
    this.tickets = 0;
    this.players = [];
  }

  generateRound() {
    this.roundId += 1;
    this.roundSeed = chance.string({ length: 16 });
    this.bank = 0;
    this.tickets = 0;
    this.players = [];
  }

  addPlayer(player) {
    this.bank += player.bet;
    player.setTicketRange(this.tickets + 1, this.tickets + player.bet * 100);
    this.tickets += player.bet * 100;
    this.players.push(player);
  }

  draw() {
    const firstTwoPlayers = this.players.slice(0, 2);
    const randomNum = getRandomNumber(
      1,
      this.tickets,
      this.seed,
      ...firstTwoPlayers.map((p) => p.seed)
    );
    const winPlayer = this.players.find(
      (p) => p.firstTicket <= randomNum && p.lastTicket >= randomNum
    );
    console.log(`===============Round ID: ${this.roundId}================`);
    console.log("Player length: ", this.players.length);
    console.log("All tickets: ", this.tickets);
    console.log("Random ticket: ", randomNum);
    console.log(winPlayer.toString());
  }
}

/**
 * Generate 10 test Jackpot rounds
 */
const jackpotInstance = new Jackpot();

for (let i = 1; i <= 10; i++) {
  let pIndex = 1;
  jackpotInstance.generateRound();
  for (let _ of new Array(Math.ceil(Math.random() * 49 + 1))) {
    const player = new PlayerJackpot(pIndex);
    player.setBet(Math.ceil(Math.random() * 100));
    jackpotInstance.addPlayer(player);
    pIndex += 1;
  }
  jackpotInstance.draw();
}
console.log("\n");

/**
 * COINFLIP MODE
 *
 * The result of the round is determined by three independent participants of the round: the game mode and the participants of the round (there are always 2 of them).
 * Game mode generates a seed when a new round is initiated (random 16 characters).
 * A hashed version of this seed is publicly available prior to the start of the round (SHA256).
 * The client seed is generated for each player separately (random 20 symbols) and is updated after each successful bet in any of the game modes.
 * Each player can see his own seed, which will be used when placing a bet.
 * When a round starts, the function combines the seed of the round of the given game mode with the seeds of the players.
 * The SHA512 hash is generated from the concatenated characters, and the result of the game is generated from this hash.
 * The result of the game is a winning ticket.
 * The player who owns the given ticket wins.
 */
console.log("************************************************");
console.log("********************COINFLIP********************");
console.log("************************************************");
console.log("\n");

class PlayerCoinflip {
  constructor(id) {
    this.id = id;
    this.seed = chance.string({ length: 20 });
    this.bet = 0;
    this.tickets = [undefined, undefined];
  }

  get firstTicket() {
    return this.tickets[0];
  }

  get lastTicket() {
    return this.tickets[1];
  }

  setBet(bet) {
    this.bet = bet;
  }

  setTicketRange(first, last) {
    this.tickets[0] = first;
    this.tickets[1] = last;
  }

  toString() {
    return `Player ${this.id}: bet ${this.bet}$ tickets[${this.tickets[0]}, ${this.tickets[1]}]`;
  }
}

class Coinflip {
  constructor() {
    this.roundId = 0;
    this.roundSeed = "";
    this.bank = 0;
    this.tickets = 0;
    this.players = [];
  }

  generateRound() {
    this.roundId += 1;
    this.roundSeed = chance.string({ length: 16 });
    this.bank = 0;
    this.tickets = 0;
    this.players = [];
  }

  addPlayer(player) {
    this.bank += player.bet;
    player.setTicketRange(this.tickets + 1, this.tickets + player.bet * 100);
    this.tickets += player.bet * 100;
    this.players.push(player);
  }

  draw() {
    const randomNum = getRandomNumber(
      1,
      this.tickets,
      this.seed,
      ...this.players.map((p) => p.seed)
    );
    const winPlayer = this.players.find(
      (p) => p.firstTicket <= randomNum && p.lastTicket >= randomNum
    );
    console.log(`===============Round ID: ${this.id}================`);
    console.log("All tickets: ", this.tickets);
    console.log("Random ticket: ", randomNum);
    console.log(winPlayer.toString());
  }
}
/**
 * Generate 10 test Coinflip rounds
 */
const coinflipInstance = new Coinflip();

for (let i = 1; i <= 10; i++) {
  coinflipInstance.generateRound();
  const bet = Math.ceil(Math.random() * 100);
  for (let j = 1; j <= 2; j++) {
    const player = new PlayerCoinflip(j);
    player.setBet(bet);
    coinflipInstance.addPlayer(player);
  }
  coinflipInstance.draw();
}
console.log("\n");

/**
 * DICE MODE
 *
 * The result of the round is determined by three independent participants: the game mode, the player, and the round.
 * Game mode generates a mode seed every day at 00:00 UTC (random 16 characters).
 * A hashed version of this seed is publicly available prior to the start of the round (SHA256).
 * The client seed is generated for each player separately (random 20 symbols) and is updated after each successful bet in any of the game modes.
 * Each player can see his own seed, which will be used when placing a bet.
 * When a round starts, the function combines the game mode seed, player seed, and round ID. The SHA512 hash is generated from the concatenated characters, and the result of the game is generated from this hash.
 * The result of the game is a random number between 0 and 10000 divided by 100.
 * At the time of the bet, the player selects a random number from 0.00 to 96.00, step 0.01.
 * The player wins if his guess is less than the result of the round.
 */
console.log("********************************************");
console.log("********************DICE********************");
console.log("********************************************");
console.log("\n");

class PlayerDice {
  constructor(amount, randChance) {
    this.seed = chance.string({ length: 20 });
    this.amount = amount;
    this.randChance = randChance;
    this.gain = 0;
  }

  getAmount() {
    return this.amount;
  }

  getRandChance() {
    return this.randChance;
  }

  getSeed() {
    return this.seed;
  }

  getGain() {
    return this.gain;
  }

  setGain(gain) {
    this.gain = gain;
  }

  toString() {
    return `Player: bet ${this.bet}$, chance ${this.randChance}`;
  }
}

class Dice {
  constructor() {
    this.roundId = 0;
    this.seed = chance.string({ length: 16 });
  }

  generateRound() {
    this.roundId = 1;
  }

  drawForPlayer(player) {
    const randomNum = getRandomNumber(
      0,
      999999,
      this.seed,
      player.getSeed(),
      this.roundId.toString()
    );
    const maxNumber = 1000000 * (player.getRandChance() / 100) - 1;
    if (randomNum < maxNumber) {
      const x = 96 / player.getRandChance();
      const gain = player.getAmount() * x;
      player.setGain(gain);
    }
    console.log(`===============Round ID: ${this.roundId}================`);
    console.log("Bet amount: ", player.getAmount());
    console.log("Bet chance: ", player.getRandChance());
    console.log("Gain: ", player.getGain());
  }
}

const diceInstance = new Dice();

/**
 * Generate 10 test Dice rounds
 */
for (let i = 1; i <= 10; i++) {
  diceInstance.generateRound();
  const amount = Math.ceil(Math.random() * 100);
  const randChance = Math.floor(Math.random() * 9400) / 100 + 1;
  const player = new PlayerDice(amount, randChance);
  diceInstance.drawForPlayer(player);
}
console.log("\n");

/**
 * ROULETTE MODE
 *
 * The result of the round is determined by two or three independent participants: the game mode and the first players of the round.
 * The game mode generates a seed when a new round is initiated (random 16 characters).
 * A hashed version of this seed is publicly available prior to the start of the round (SHA256).
 * The client seed is generated for each player separately (random 20 symbols) and is updated after each successful bet in any of the game modes.
 * Each player can see his own seed, which will be used when placing a bet.
 * When a round starts, the function combines the game mode seed with the seed of the first players (1 to 2).
 * The SHA512 hash is generated from the concatenated characters, and the result of the game is generated from this hash.
 * The result of the game is a random number from 0 to 14.
 * These colors determine the colors of the roulette:
 * - 0 - green
 * - > = 1 && <= 7 - red
 * - > 7 - black
 * At the time of the bet, the player chooses one of three colors.
 * The player wins if his guessed color matches the color of the round.
 */
console.log("************************************************");
console.log("********************ROULETTE********************");
console.log("************************************************");
console.log("\n");

class PlayerRoulette {
  constructor(amount, color) {
    this.seed = chance.string({ length: 20 });
    this.amount = amount;
    this.color = color;
    this.gain = 0;
  }

  getAmount() {
    return this.amount;
  }

  getColor() {
    return this.color;
  }

  getSeed() {
    return this.seed;
  }

  getGain() {
    return this.gain;
  }

  setColor(color) {
    this.color = color;
  }

  setGain(gain) {
    this.gain = gain;
  }
}

class Roulette {
  constructor() {
    this.roundId = 0;
    this.roundSeed = "";
    this.players = [];
  }

  generateRound() {
    this.roundId += 1;
    this.roundSeed = chance.string({ length: 16 });
    this.players = [];
  }

  addPlayer(player) {
    this.players.push(player);
  }

  drawRound() {
    const firstTwoPlayers = this.players.slice(0, 2);
    const roundNumber = getRandomNumber(
      0,
      14,
      this.roundSeed,
      ...firstTwoPlayers.map((p) => p.getSeed())
    );
    const x = roundNumber === 0 ? 14 : 2;
    const roundColor =
      roundNumber === 0
        ? 0
        : [1, 2, 3, 4, 5, 6, 7].includes(roundNumber)
          ? 1
          : 2;
    let sumAmount = 0;
    let sumGain = 0;
    for (let player of this.players) {
      sumAmount += player.getAmount();
      if (roundColor === player.getColor()) {
        const gain = player.getAmount() * x;
        player.setGain(gain);
        sumGain += gain;
      }
    }
    console.log(`===============Round ID: ${this.roundId}================`);
    console.log("Player length: ", this.players.length);
    console.log("Sum amount: ", sumAmount);
    console.log("Sum gain: ", sumGain);
  }
}

const rouletteInstance = new Roulette();

/**
 * Generate 10 test Roulette rounds
 */
for (let i = 1; i <= 10; i++) {
  rouletteInstance.generateRound();
  for (let _ of new Array(Math.ceil(Math.random() * 20))) {
    const amount = Math.ceil(Math.random() * 100);
    const color = Math.ceil(Math.random() * 2);
    const player = new PlayerRoulette(amount, color);
    rouletteInstance.addPlayer(player);
  }
  rouletteInstance.drawRound();
}
console.log("\n");

/**
 * CRASH MODE
 *
 * The result of the round is determined by three independent participants of the round: the game mode and the participants of the round (up to 2 first players).
 * Game mode generates a seed when a new round is initiated (random 16 characters).
 * A hashed version of this seed is publicly available prior to the start of the round (SHA256).
 * The client seed is generated for each player separately (random 20 symbols) and is updated after each successful bet in any of the game modes.
 * Each player can see his own seed, which will be used when placing a bet.
 * When a round starts, the function combines the seed of the round of the given game mode with the seeds of the players.
 * The SHA512 hash is generated from the concatenated characters, and the result of the game is generated from this hash.
 * The result of the game is the winning odds (X).
 * The winners are the players who managed to collect their bet before the counter reaches the given coefficient.
 */
console.log("*********************************************");
console.log("********************CRASH********************");
console.log("*********************************************");
console.log("\n");

class PlayerCrash {
  constructor(amount, finishX) {
    this.seed = chance.string({ length: 20 });
    this.amount = amount;
    this.finishX = finishX;
    this.gain = 0;
  }

  getAmount() {
    return this.amount;
  }

  getFinishX() {
    return this.finishX;
  }

  getSeed() {
    return this.seed;
  }

  getGain() {
    return this.gain;
  }

  setFinishX(finishX) {
    this.finishX = finishX;
  }

  setGain(gain) {
    this.gain = gain;
  }
}

class Crash {
  constructor() {
    this.roundId = 0;
    this.roundSeed = "";
    this.players = [];
  }

  generateRound() {
    this.roundId += 1;
    this.roundSeed = chance.string({ length: 16 });
    this.players = [];
  }

  addPlayer(player) {
    this.players.push(player);
  }

  drawRound() {
    const firstTwoPlayers = this.players.slice(0, 2);
    const randomX = getRandomXForCrash(
      this.roundSeed,
      ...firstTwoPlayers.map((p) => p.getSeed())
    );

    let sumAmount = 0;
    let sumGain = 0;
    for (let player of this.players) {
      sumAmount += player.getAmount();
      const gain =
        randomX == 1
          ? 0
          : player.getFinishX() <= randomX
            ? player.getAmount() * player.getFinishX()
            : 0;
      player.setGain(gain);
      sumGain += gain;
    }
    console.log(`===============Round ID: ${this.roundId}================`);
    console.log("Player length: ", this.players.length);
    console.log("Sum amount: ", sumAmount);
    console.log("Sum gain: ", sumGain);
  }
}

const crashInstance = new Crash();

/**
 * Generate 10 test Crash rounds
 */
for (let i = 1; i <= 10; i++) {
  crashInstance.generateRound();
  for (let _ of new Array(Math.ceil(Math.random() * 20))) {
    const amount = Math.ceil(Math.random() * 100);
    const betSeed = chance.string({ length: 20 });
    const betHash = crypto.createHash("sha512").update(betSeed).digest("hex");
    const finishX = Math.max(
      1,
      Math.floor(
        100 / (1 - parseInt(betHash.substr(0, 13), 16) / Math.pow(2, 52))
      ) / 100
    );
    const player = new PlayerCrash(amount, finishX);
    crashInstance.addPlayer(player);
  }
  crashInstance.drawRound();
}
