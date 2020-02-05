var payButton = document.getElementById("pay-button");
var form = document.getElementById("payment-form");

Frames.init({
  publicKey: 'pk_test_6ff46046-30af-41d9-bf58-929022d2cd14',
  localization: {
    cardNumberPlaceholder: "1234 1234 1234 1234",
    expiryMonthPlaceholder: "MM",
    expiryYearPlaceholder: "YY",
    cvvPlaceholder: "•••",
  },
  debug: true,
  style: {
    base: {
      color: "#000",
      fontWeight: 'bold'
    },
    placeholder: {
      // base: {
      //   color: "red"
      // },
      // focus: {
      //   color: "blue"
      // }
    }
  }
})
var logos = generateLogos();

function generateLogos() {
  var logos = {};
  logos["card-number"] = {
    src: "card",
    alt: "card number logo"
  };
  logos["expiry-date"] = {
    src: "exp-date",
    alt: "expiry date logo"
  };
  logos["cvv"] = {
    src: "cvv",
    alt: "cvv logo"
  };
  return logos;
};

var errors = {
  ["card-number"]: "Please enter a valid card number",
  ["expiry-date"]: "Please enter a valid expiry date",
  ["cvv"]: "Please enter a valid cvv code",
};
Frames.addEventHandler(
  Frames.Events.FRAME_VALIDATION_CHANGED,
  onValidationChanged
);

function onValidationChanged(event) {
  var e = event.element;

  if (event.isValid || event.isEmpty) {
    if (e == "card-number" && !event.isEmpty) {
      showPaymentMethodIcon();
    }
    clearErrorMessage(e);
  } else {
    if (e == "card-number") {
      clearPaymentMethodIcon();
    }
    setErrorMessage(e);
  }
}

function clearErrorMessage(el) {
  var selector = ".error-message__" + el;
  var message = document.querySelector(selector);
  message.textContent = "";
}

function clearErrorIcon(el) {
  var logo = document.getElementById("icon-" + el + "-error");
  logo.style.removeProperty("display");
}

function showPaymentMethodIcon(parent, pm) {
  if (parent) parent.classList.add("show");

  var logo = document.getElementById("logo-payment-method");
  if (pm) {
    var name = pm.toLowerCase();
    logo.setAttribute("src", "images/card-icons/" + name + ".svg");
    logo.setAttribute("alt", pm || "payment method");
  }
  logo.style.removeProperty("display");
}

function clearPaymentMethodIcon(parent) {
  if (parent) parent.classList.remove("show");

  var logo = document.getElementById("logo-payment-method");
  logo.style.setProperty("display", "none");
}

function setErrorMessage(el) {
  var selector = ".error-message__" + el;
  var message = document.querySelector(selector);
  message.textContent = errors[el];
}

function setDefaultIcon(el) {
  var selector = "icon-" + el;
  var logo = document.getElementById(selector);
  logo.setAttribute("src", "images/card-icons/" + logos[el].src + ".svg");
  logo.setAttribute("alt", logos[el].alt);
}

function setDefaultErrorIcon(el) {
  var selector = "icon-" + el;
  var logo = document.getElementById(selector);
  logo.setAttribute("src", "images/card-icons/" + logos[el].src + "-error.svg");
  logo.setAttribute("alt", logos[el].alt);
}

function setErrorIcon(el) {
  var logo = document.getElementById("icon-" + el + "-error");
  logo.style.setProperty("display", "block");
}

Frames.addEventHandler(
  Frames.Events.CARD_VALIDATION_CHANGED,
  cardValidationChanged
);

function cardValidationChanged(event) {
  payButton.disabled = !Frames.isCardValid();
}

Frames.addEventHandler(Frames.Events.CARD_TOKENIZED, onCardTokenized);

function onCardTokenized(event) {
  var el = document.querySelector(".success-payment-message");
  el.innerHTML = "Card tokenization completed<br>" +
    "Your card token is: <span class=\"token\">" + event.token + "</span>";
}

Frames.addEventHandler(
  Frames.Events.PAYMENT_METHOD_CHANGED,
  paymentMethodChanged
);

function paymentMethodChanged(event) {
  var pm = event.paymentMethod;
  let container = document.querySelector(".icon-container.payment-method");

  if (!pm) {
    clearPaymentMethodIcon(container);
  } else {
    clearErrorIcon("card-number");
    showPaymentMethodIcon(container, pm);
  }
}

form.addEventListener("submit", onSubmit);

function onSubmit(event) {
  event.preventDefault();
  Frames.submitCard();
}