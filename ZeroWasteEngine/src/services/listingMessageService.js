async function generateListingMessage(listing) {
  const message = `
  _*New food listing available\\!*_
  
    *Food type:* \`${listing.foodType}\`
    *Quantity:* \`${listing.quantity}\`
    *Location:* \`${listing.location}\`
    *Availability time:* \`${listing.availabilityTime}\`
  `;
  return message;
}

module.exports = { generateListingMessage };
