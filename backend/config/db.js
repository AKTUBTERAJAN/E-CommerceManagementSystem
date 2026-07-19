const dns = require("dns");
const mongoose = require("mongoose");

const dnsServers = (process.env.DNS_SERVERS || "8.8.8.8,1.1.1.1")
  .split(",")
  .map((server) => server.trim())
  .filter(Boolean);

if (dnsServers.length > 0) {
  dns.setServers(dnsServers);
}

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is missing in .env file");
    }

    await mongoose.connect(process.env.MONGO_URI, {
      family: 4,
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB Connected Successfully");
  } catch (err) {
    console.error("MongoDB Error:", err.message);

    if (err.code === "ECONNREFUSED" && err.syscall === "querySrv") {
      console.error(
        "DNS SRV lookup failed. Try another network/DNS, or use MongoDB Atlas standard connection string instead of mongodb+srv."
      );
    }

    process.exit(1);
  }
};

module.exports = connectDB;
