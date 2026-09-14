const splash = document.querySelector("[data-splash]");
const closeSplashButtons = document.querySelectorAll("[data-close-splash]");
const menuButton = document.querySelector("[data-menu]");
const nav = document.querySelector("[data-nav]");
const signup = document.querySelector("[data-signup]");
const note = document.querySelector("[data-form-note]");
const paymentConfig = {
  btcUsdRate: 100000,
  address: "bc1qmeys52n8lke7xcnnpvatlszxkjv4j5x9dxe9t8",
  expiresInSeconds: 45 * 60,
};

const paymentButtons = document.querySelectorAll("[data-pay-item]");
const paymentModal = document.querySelector("[data-payment-modal]");
const closePaymentButtons = document.querySelectorAll("[data-close-payment]");
const paymentItem = document.querySelector("[data-payment-item]");
const paymentUsd = document.querySelector("[data-payment-usd]");
const paymentBtc = document.querySelector("[data-payment-btc]");
const paymentRate = document.querySelector("[data-payment-rate]");
const paymentAddress = document.querySelector("[data-payment-address]");
const paymentQr = document.querySelector("[data-payment-qr]");
const paymentQrPlaceholder = document.querySelector("[data-payment-qr-placeholder]");
const paymentTimer = document.querySelector("[data-payment-timer]");
const paymentForm = document.querySelector("[data-payment-form]");
const paymentNote = document.querySelector("[data-payment-note]");
const copyPayment = document.querySelector("[data-copy-payment]");
const copyNote = document.querySelector("[data-copy-note]");
const paymentRangeField = document.querySelector("[data-payment-range-field]");
const paymentAmountSelect = document.querySelector("[data-payment-amount-select]");

let paymentCountdown;
let activePaymentAmount = 0;

if (splash) {
  document.body.classList.add("splash-open");
}

const closeSplash = () => {
  splash.classList.add("is-hidden");
  document.body.classList.remove("splash-open");
};

closeSplashButtons.forEach((button) => {
  button.addEventListener("click", closeSplash);
});

document.addEventListener("keydown", (event) => {
  if (splash && event.key === "Escape" && !splash.classList.contains("is-hidden")) {
    closeSplash();
  }
});

if (menuButton && nav) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!isOpen));
    menuButton.classList.toggle("is-open", !isOpen);
    nav.classList.toggle("is-open", !isOpen);
  });

  nav.addEventListener("click", (event) => {
    if (event.target.matches("a")) {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.classList.remove("is-open");
      nav.classList.remove("is-open");
    }
  });
}

if (signup && note) {
  signup.addEventListener("submit", (event) => {
    event.preventDefault();
    note.textContent = "Thanks. This preview keeps the signup local for now.";
    signup.reset();
  });
}

const formatUsd = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);

const formatBtc = (amount) => `${(amount / paymentConfig.btcUsdRate).toFixed(8)} BTC`;

const updatePaymentAmount = (amount) => {
  activePaymentAmount = Number(amount);

  if (paymentUsd) {
    paymentUsd.textContent = formatUsd(activePaymentAmount);
  }

  if (paymentBtc) {
    paymentBtc.textContent = formatBtc(activePaymentAmount);
  }
};

const makeRangeOptions = (min, max) => {
  const middle = Math.round((Number(min) + Number(max)) / 2);
  return [...new Set([Number(min), middle, Number(max)])];
};

const startPaymentTimer = () => {
  let secondsLeft = paymentConfig.expiresInSeconds;

  clearInterval(paymentCountdown);

  const render = () => {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    if (paymentTimer) {
      paymentTimer.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")} remaining`;
      paymentTimer.classList.toggle("is-expired", secondsLeft <= 0);
    }

    if (secondsLeft <= 0) {
      clearInterval(paymentCountdown);
      if (paymentTimer) {
        paymentTimer.textContent = "Payment address expired. Reopen checkout for a fresh 45-minute window.";
      }
    }

    secondsLeft -= 1;
  };

  render();
  paymentCountdown = setInterval(render, 1000);
};

const openPayment = (button) => {
  const min = button.dataset.payMin;
  const max = button.dataset.payMax;
  const amount = button.dataset.payAmount || min;
  const title = button.dataset.payItem;

  if (!paymentModal) {
    return;
  }

  if (paymentItem) {
    paymentItem.textContent = title;
  }

  if (paymentRate) {
    paymentRate.textContent = `1 BTC = ${formatUsd(paymentConfig.btcUsdRate)}`;
  }

  if (paymentAddress) {
    paymentAddress.textContent = paymentConfig.address;
  }

  if (paymentQr && paymentQrPlaceholder) {
    const qrSource = paymentQr.dataset.paymentQrSrc || paymentQr.getAttribute("src");

    paymentQr.onload = () => {
      paymentQr.hidden = false;
      paymentQrPlaceholder.hidden = true;
    };

    paymentQr.onerror = () => {
      paymentQr.hidden = true;
      paymentQrPlaceholder.hidden = false;
    };

    paymentQr.hidden = true;
    paymentQrPlaceholder.hidden = true;
    paymentQr.src = qrSource;
  }

  if (paymentRangeField && paymentAmountSelect) {
    paymentAmountSelect.innerHTML = "";
    const isRange = min && max && min !== max;
    paymentRangeField.hidden = !isRange;

    if (isRange) {
      makeRangeOptions(min, max).forEach((optionAmount) => {
        const option = document.createElement("option");
        option.value = String(optionAmount);
        option.textContent = formatUsd(optionAmount);
        paymentAmountSelect.append(option);
      });
    }
  }

  updatePaymentAmount(amount);

  if (paymentForm) {
    paymentForm.reset();
  }

  if (paymentNote) {
    paymentNote.textContent = "";
  }

  if (copyNote) {
    copyNote.textContent = "";
  }

  paymentModal.classList.add("is-open");
  paymentModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("payment-open");
  startPaymentTimer();
};

const closePayment = () => {
  if (!paymentModal) {
    return;
  }

  paymentModal.classList.remove("is-open");
  paymentModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("payment-open");
  clearInterval(paymentCountdown);
};

paymentButtons.forEach((button) => {
  button.addEventListener("click", () => openPayment(button));
});

closePaymentButtons.forEach((button) => {
  button.addEventListener("click", closePayment);
});

if (paymentAmountSelect) {
  paymentAmountSelect.addEventListener("change", () => {
    updatePaymentAmount(paymentAmountSelect.value);
  });
}

if (copyPayment && copyNote) {
  copyPayment.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(paymentConfig.address);
      copyNote.textContent = "Bitcoin address copied.";
    } catch {
      copyNote.textContent = "Copy failed. Select and copy the address manually.";
    }
  });
}

if (paymentForm && paymentNote) {
  paymentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const txHash = new FormData(paymentForm).get("txHash");
    paymentNote.textContent = `Payment marked for review. Transaction hash received: ${txHash}`;
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && paymentModal?.classList.contains("is-open")) {
    closePayment();
  }
});
