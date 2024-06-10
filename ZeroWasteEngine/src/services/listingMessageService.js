async function generateListingMessage(listing) {
  // convert availabilty time to date and time
  let availabilityTime = new Date(listing.availabilityTime);
  availabilityTime = `${availabilityTime.getDate()}/${availabilityTime.getMonth()}/${availabilityTime.getFullYear()} ${availabilityTime
    .getHours()
    .toString()
    .padStart(2, "0")}:${availabilityTime
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  let message = `
  _*New food listing available\\!*_
  
    *Food type:* \`${listing.foodType}\`

    *Quantity:* \`${listing.quantity}\` \\(Remaining\:  \`${listing.remaining}\`\\)

    *Location:* \`${listing.location}\`

    *Availability time:* \`${availabilityTime}\`
  `;
  // add description if description exists in listing
  if (listing.description) {
    message += `
    *Description:* \`${listing.description}\`
    `;
  }
  return message;
}

module.exports = { generateListingMessage };
