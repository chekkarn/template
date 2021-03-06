var highligted_dates = [];

function select_handler(date) {
  var iso = date2iso(date);
  for(var i = 0; i < highligted_dates.length; ++i) {
    if (highligted_dates[i] == iso) {
      jQuery('#form-date').val(date2iso(date));
      return true;
    }
  }
  jQuery('#form-date').val('');
  return false;
}

function giftcard_toggle() {
  if (jQuery('#pay-now').prop('checked')) {
    jQuery('#online-agreement').show();
  } else {
    jQuery('#online-agreement').hide();
  }
  if (jQuery('#pay-giftcard').prop('checked')) {
    jQuery('#book-giftcard').show();
  } else {
    jQuery('#book-giftcard').hide();
  }
}
function navigate(date) {
  var calender = document.getElementsByClassName('cal_cont')[0];
  cal_draw_f(calender, true, date, select_handler, function(d) {
    var iso = date2iso(d);
    for(var i = 0; i < highligted_dates.length; ++i) {
      if (highligted_dates[i] == iso) {
        return 'hl_outer_green';
      }
    }
  }, function(d) {
    navigate(d);
  });
}

jQuery(document).ready(function() {
  jQuery('#pay-giftcard').click(giftcard_toggle);
  jQuery('#pay-now').click(giftcard_toggle);
  jQuery('#pay-later').click(giftcard_toggle);
  jQuery('#is-gift').change(function() {
    var show = jQuery(this).prop('checked');
    jQuery('.contact-row').toggle(show);
  });

  var show = jQuery(this).prop('checked');
  jQuery('.contact-row').toggle(show);

  jQuery.getJSON('/templates/lfk/book_proxy.php', function(data) {
    highligted_dates = data;
    var d = iso2date(data[0]);
    // Show the first bookable day if it's after today
    if (d < new Date()) {
      d = undefined;
    }
    navigate(iso2date(data[0]));
  });

  jQuery('#tandemform').submit(function() {
    var name = jQuery('input[name="name"]');
    var email = jQuery('input[name="email"]');
    var contact = jQuery('input[name="contact"]');
    var mail = jQuery('textarea[name="mail"]');
    var height = jQuery('input[name="height"]');
    var weight = jQuery('input[name="weight"]');
    var date = jQuery('input[name="date"]');
    var phone = jQuery('input[name="phone"]');
    var giftcard = jQuery('input[name="cardid"]');
    var agreement = jQuery('#agreement');

    if (name.val().length < 2) {
      alert("Skriv in ett namn");
      name.focus();
      return false;
    }

    if (email.val().length < 2 || email.val().indexOf('@') == -1) {
      alert("Skriv in en giltig e-post");
      email.focus();
      return false;
    }

    if (phone.val().length < 7) {
      alert("Ange ett giltigt telefonnummer (m. riktnummer)");
      phone.focus();
      return false;
    }

    // Giftcard specific checks
    if (mail.length > 0) {
      if (mail.val().length < 2) {
        alert("Skriv in vart vi ska posta presentkortet");
        mail.focus();
        return false;
      }

      if (!agreement.prop('checked')) {
        alert("Du måste läsa försäljningsvilkoren för att köpa presentkort online");
        agreement.focus();
        return false;
      }
    }

    // Booking specific checks
    if (height.length > 0) {
      var payment = jQuery('input[name="payment"]:checked');
      if (isNaN(parseInt(height.val())) || parseInt(height.val()) < 10 || parseInt(height.val()) > 300) {
        alert("Skriv in en giltig längd");
        height.focus();
        return false;
      }

      if (isNaN(parseInt(weight.val())) || parseInt(weight.val()) < 10 || parseInt(weight.val()) > 500) {
        alert("Skriv in en giltig vikt");
        weight.focus();
        return false;
      }

      if (date.val() == "") {
        alert("Välj ett grönmarkerat datum");
        return false;
      }

      if (payment.val() == "giftcard" && (isNaN(parseInt(giftcard.val())) || parseInt(giftcard.val()) < 10)) {
        alert("Ange ett giltigt presentkortsnummer");
        giftcard.focus();
        return false;
      }

      if (payment.val() == "now" && !agreement.prop('checked')) {
        alert("Du måste läsa försäljningsvilkoren för att betala online");
        agreement.focus();
        return false;
      }
    }

    return true;
  });
});
