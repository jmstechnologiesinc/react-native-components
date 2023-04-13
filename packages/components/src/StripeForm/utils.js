

export const selectPaymentFrequency = (index, paymentOptions, setMethodsPayments, inputActionHandler) => {
  for (let i = 0; i < paymentOptions.length; i++) {
    if (i === index) {
      if (paymentOptions[i].hasOwnProperty('selected')) {
        inputActionHandler('payoutsSchedule', paymentOptions[i].value);
        paymentOptions[i].selected = true;
      }
    } else {
      if (paymentOptions[i].hasOwnProperty('selected')) {
        paymentOptions[i].selected = false;
      }
    }
  }

  return setMethodsPayments([...paymentOptions]);
}