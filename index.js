var express = require("express");
var app = express();
const fetch = require("node-fetch");
const PORT = process.env.PORT || 5000;
function numberWithCommas(n) {
  var parts = n.toString().split(".");
  return (
    parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
    (parts[1] ? "." + parts[1] : "")
  );
}

app.get("/api/supply", (req, res, next) => {
  fetch(
    "https://api.bscscan.com/api?module=stats&action=tokensupply&contractaddress=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82"
  )
    .then((response) => response.json())
    .then((supplyData) => {
      if (supplyData) {
        const supply = supplyData.result;
        const supplyLength = supply.length;
        const supplyFirstHalfLength = supplyLength - 18;
        const supplyFirstHalf = supply.slice(0, supplyFirstHalfLength);
        const supplySecondHalf = supply.slice(-18);
        const formatedSupply = supplyFirstHalf.concat(".", supplySecondHalf);
        fetch(
          "https://api.bscscan.com/api?module=account&action=tokenbalance&contractaddress=0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82&address=0x000000000000000000000000000000000000dead&tag=latest"
        )
          .then((response) => response.json())
          .then((burnData) => {
            const burnAmount = burnData.result;
            const burnAmountLength = burnAmount.length;
            const burnAmountFirstHalfLength = burnAmountLength - 18;
            const burnAmountFirstHalf = burnAmount.slice(
              0,
              burnAmountFirstHalfLength
            );
            const burnAmountSecondHalf = burnAmount.slice(-18);
            const formatedBurnAmount = burnAmountFirstHalf.concat(
              ".",
              burnAmountSecondHalf
            );
            const totalSupplyNumber =
              Number(formatedSupply) - formatedBurnAmount;
            res.json({
              data: {
                // Supply: supply,
                // FormatedSupply: Number(formatedSupply),
                // BurnTotal: burnAmount,
                // FormatedBurnAmount: Number(formatedBurnAmount),
                totalNumber: totalSupplyNumber,
                totalFormated: numberWithCommas(totalSupplyNumber),
              },
            });
          });
      } else {
        res.json("No Response from https://bscscan.com/");
      }
    });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
