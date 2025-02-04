let personalMoney = 500;
let debt = 0;
let spinCount = 0;
let isSpinning = false;
const symbols = ['🍒', '🍊', '🍇', '💎', '7️⃣', '🍀'];
const DEBT_LIMIT = 50000;

function updateDisplay() {
  document.getElementById('personalMoney').textContent = personalMoney;
  document.getElementById('debt').textContent = debt;
  document.getElementById('spinButton').disabled = personalMoney < 100;

  if (debt >= DEBT_LIMIT) {
    showGameOver();
  }
}

// Fungsi notifikasi kustom untuk menggantikan alert()
function showNotification(message, type = 'info') {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification ${type}`;
  notification.style.display = 'block';
  setTimeout(() => {
    notification.style.display = 'none';
  }, 3000);
}

function takeLoan(amount) {
  personalMoney += amount;  // Tambahkan uang pinjaman ke uang pribadi
  debt += amount;           // Tambahkan hutang
  updateDisplay();
  showNotification(`Anda meminjam $${amount}! Hutang saat ini: $${debt}`, 'loan');
}

function getWinProbability() {
  if (spinCount === 1) return 1.0;
  if (spinCount <= 3) return 0.6;
  return 0.1;
}

function spin() {
    if (personalMoney < 100 || isSpinning) return;
  
    personalMoney -= 100;
    spinCount++;
    isSpinning = true;
    updateDisplay();
  
    const slotElems = [
      document.getElementById('slot1'),
      document.getElementById('slot2'),
      document.getElementById('slot3')
    ];
  
    const winProbability = getWinProbability();
    const isWin = Math.random() < winProbability;
  
    // Interval untuk animasi slot yang berputar
    const spinInterval = setInterval(() => {
      slotElems.forEach(slot => {
        slot.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      });
    }, 50);
  
    setTimeout(() => {
      clearInterval(spinInterval);
  
      let results = [];
      if (isWin) {
        const winAmount = 500;
        // Jika pemain memiliki hutang, gunakan jackpot untuk mengurangi hutang terlebih dahulu.
        if (debt > 0) {
          // Hitung sisa jackpot setelah mengurangi hutang
          const bonus = winAmount - debt;
          // Pastikan hutang tidak menjadi negatif
          debt = Math.max(debt - winAmount, 0);
          // Jika sisa jackpot (bonus) positif, tambahkan ke uang pribadi
          if (bonus > 0) {
            personalMoney += bonus;
          }
          showNotification(`JACKPOT! 🎉 Hutang berkurang dan uang bertambah $${bonus > 0 ? bonus : 0}!`, 'win');
        } else {
          // Jika tidak ada hutang, jackpot menambah uang pribadi seperti biasa.
          personalMoney += winAmount;
          showNotification(`JACKPOT! 🎉 Menang $${winAmount}!`, 'win');
        }
        showWinAnimation();
        // Tampilkan simbol yang sama untuk ketiga slot
        const winSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        results = [winSymbol, winSymbol, winSymbol];
      } else {
        // Jika kalah, pastikan ketiga simbol tidak semuanya sama.
        do {
          results = [
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)],
            symbols[Math.floor(Math.random() * symbols.length)]
          ];
        } while (results[0] === results[1] && results[1] === results[2]);
      }
  
      slotElems.forEach((slot, index) => {
        slot.textContent = results[index];
      });
  
      isSpinning = false;
      updateDisplay();
    }, 2000);
  }
  

function showWinAnimation() {
  const slotElems = document.querySelectorAll('.slot');
  slotElems.forEach(slot => {
    slot.style.animation = 'win-glow 1s 3';
  });
  setTimeout(() => {
    slotElems.forEach(slot => {
      slot.style.animation = '';
    });
  }, 3000);
}

function showGameOver() {
  const overlay = document.getElementById('gameOverOverlay');
  overlay.style.display = 'flex';
}

function resetGame() {
  personalMoney = 500;
  debt = 0;
  spinCount = 0;
  document.getElementById('gameOverOverlay').style.display = 'none';
  updateDisplay();
}

// Inisialisasi tampilan awal game
updateDisplay();
