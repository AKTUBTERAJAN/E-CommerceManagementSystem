const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.e-commerce-cluster0.b3txq9c.mongodb.net",
  (err, records) => {
    if (err) {
      console.error(err);
    } else {
      console.log(records);
    }
  }
);