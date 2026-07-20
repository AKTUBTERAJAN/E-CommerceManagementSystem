import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const downloadInvoice = (order) => {

  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text("BigMall Invoice", 70, 20);

  doc.setFontSize(12);

  doc.text("Order ID : " + order.orderId, 15, 40);

  doc.text("Customer : " + order.customer.name, 15, 48);

  doc.text("Mobile : " + order.customer.mobile, 15, 56);

  doc.text("Email : " + order.customer.email, 15, 64);

  doc.text("Address : " + order.customer.address, 15, 72);

  doc.text("Date : " + order.added_date, 15, 80);

  autoTable(doc,{

    startY: 90,

    head: [["Product","Qty","Price","Total"]],

    body: [[
      order.subcategory_name,
      order.quantity,
      order.discount_price,
      order.total_price
    ]]

  });

  doc.text(
    "Payment Method : Wallet",
    15,
    doc.lastAutoTable.finalY + 15
  );

  doc.text(
    "Order Status : " + order.status,
    15,
    doc.lastAutoTable.finalY + 25
  );

  doc.setFontSize(14);

  doc.text(
    "Thank You For Shopping With BigMall",
    35,
    doc.lastAutoTable.finalY + 45
  );

  doc.save(order.orderId + ".pdf");

};

export default downloadInvoice;