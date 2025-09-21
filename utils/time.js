function getSingaporeTime() {
    return new Date().toLocaleString("en-SG", {
      timeZone: "Asia/Singapore",
      hour12: false,
    }).replace(",", "");
  }
  
  module.exports = {
    getSingaporeTime
  };
  