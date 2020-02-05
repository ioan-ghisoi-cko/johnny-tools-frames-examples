var payButton = document.getElementById("pay-button");
var form = document.getElementById("payment-form");
var front = document.getElementById("front");

Frames.init({
	publicKey: 'pk_test_6ff46046-30af-41d9-bf58-929022d2cd14',
	localization: {
		cardNumberPlaceholder: "1234 1234 1234 1234",
		expiryMonthPlaceholder: "02",
		expiryYearPlaceholder: "29",
		cvvPlaceholder: "CVC",
	},
	debug: true,
	style: {
		base :{
			fontSize: "40px"
		}
	}
})

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
  } else {
    if (e == "card-number") {
      clearPaymentMethodIcon();
    }
  }
}

function showPaymentMethodIcon(parent, pm) {
  if (parent) parent.classList.add("show");

  var logo = document.getElementById("logo-payment-method");
  if (pm) {
    var name = pm.toLowerCase();
    logo.setAttribute("src", "card-icons/" + name + ".svg");
    logo.setAttribute("alt", pm || "payment method");
  }
  logo.style.removeProperty("display");
}

function clearPaymentMethodIcon(parent) {
  if (parent) parent.classList.remove("show");
  
  var logo = document.getElementById("logo-payment-method");
  logo.style.setProperty("display", "none");
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
  let container = document.querySelector(".payment-method");

  if (!pm) {
    clearPaymentMethodIcon(container);
  } else {
    showPaymentMethodIcon(container, pm);
  }
}

var flipper = document.getElementById('flip');

flipper.addEventListener('click', function () {
	document.getElementById('front').classList.toggle("nice-front");
	document.getElementById('back').classList.toggle("nice-back");
});

front.addEventListener("mouseenter", function() {
	document.getElementById('main-wrapper').classList.add("bring-forward");
});


// form.addEventListener("submit", onSubmit);
// function onSubmit(event) {
//   event.preventDefault();
//   Frames.submitCard();
// }
