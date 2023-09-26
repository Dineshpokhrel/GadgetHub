const fs = require("fs");
const PDFDocument = require("pdfkit");
const moment = require("moment");

const PAGE_SIZE = 700;

async function generatePdfInvoice(order, systemInfo, path) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 50 });

      const writeStream = fs.createWriteStream(path);
      doc.pipe(writeStream);
      generateHeader(doc, systemInfo);
      generateCustomerInformation(doc, order);
      generateInvoiceTable(doc, order, systemInfo);
      generateFooter(doc);
      doc.end();

      writeStream.on("error", (error) => {
        reject(error);
      });

      writeStream.on("finish", () => {
        resolve(path);
      });
    } catch (e) {
      reject(e);
    }
  });
}

function generateHeader(doc, settings) {
  doc
    .image("src/public/logo.png", 50, 45, { width: 50 })
    .fillColor("#444444")
    .fontSize(15)
    .text("GadgetHub", 110, 50)
    .fontSize(10)
    .text(settings.email, 200, 65, { align: "right" })
    .text(settings.address, 200, 80, { align: "right" })
    .moveDown();
}

function generateFooter(doc) {
  doc
    .fontSize(10)
    .text(
      "Payment is due within 7 days. Thank you for your business.",
      50,
      770,
      { align: "center", width: 500 }
    );
}

function generateCustomerInformation(doc, order) {
  const shipping = order.shippingAddress;

  doc
    .fontSize(10)
    .text(`Order ID: #${order.orderID}`, 50, 150)
    .text(
      `Order Date: ${
        order.createdAt
          ? moment(order.createdAt).format("dddd, MMMM YYYY")
          : "-"
      }`,
      50,
      175
    )
    .text(`Name: ${order.user.name}`, 50, 190)
    .text(`Email: ${order.user.email}`, 50, 205)
    .text(`Phone No: ${order.user.phone}`, 50, 220)

    .fontSize(16)
    .text("Shipping Address", 350, 150)
    .fontSize(10)
    .text(shipping.address, 350, 175)
    .text(shipping.country, 350, 190)
    .text(shipping.postalCode, 350, 205)

    .moveDown();
}

function generateInvoiceTable(doc, order, settings) {
  let i,
    position = 330;
  generateHr(doc, position - 15);

  generateTableRow(
    doc,
    position,
    "Sl. No.",
    "Product Name",
    "Unit Price",
    "Quantity",
    "Total"
  );
  generateHr(doc, position + 20);

  for (i = 0; i < order.orderItems.length; i++) {
    const item = order.orderItems[i];
    position = position + 30;
    if (position > PAGE_SIZE) {
      doc.addPage({ size: "A4", margin: 50 });
      position = 50;
    }
    generateTableRow(
      doc,
      position,
      i + 1 + ".",
      item.name,
      settings.symbol + item.price,
      item.quantity,
      settings.symbol + item.price * item.quantity
    );
    generateHr(doc, position + 20);
  }

  if (position > PAGE_SIZE) {
    doc.addPage({ size: "A4", margin: 50 });
    position = 50;
  }

  position = position + 80;
  doc.fontSize(12).text(`Customer Message`, 50, position - 20);
  doc
    .fontSize(10)
    .text(`${order.note ? order.note : "-"}`, 50, position);

  if (position > PAGE_SIZE) {
    doc.addPage({ size: "A4", margin: 50 });
    position = 50;
  }

  position = position + 30;
  generateTableRow(
    doc,
    position,
    "",
    "",
    "Subtotal",
    "",
    settings.symbol + order.orderPrice
  );

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(570, position + 13)
    .lineTo(300, position + 13)
    .stroke();

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(300, position - 12)
    .lineTo(300, position + 12)
    .stroke();

  if (position > PAGE_SIZE) {
    doc.addPage({ size: "A4", margin: 50 });
    position = 50;
  }

  position = position + 25;
  generateTableRow(
    doc,
    position,
    "",
    "",
    "Discount",
    "",
    settings.symbol + order.discount
  );

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(570, position + 13)
    .lineTo(300, position + 13)
    .stroke();

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(300, position - 12)
    .lineTo(300, position + 12)
    .stroke();

  if (position > PAGE_SIZE) {
    doc.addPage({ size: "A4", margin: 50 });
    position = 50;
  }

  position = position + 25;
  generateTableRow(
    doc,
    position,
    "",
    "",
    "Grand Total",
    "",
    settings.symbol + order.totalPrice
  );

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(570, position + 13)
    .lineTo(300, position + 13)
    .stroke();

  doc
    .strokeColor("#aaaaaa")
    .lineWidth(1)
    .moveTo(300, position - 12)
    .lineTo(300, position + 12)
    .stroke();
}

function generateTableRow(doc, y, id, name, price, quantity, total) {
  doc
    .fontSize(10)
    .text(`${id}`, 50, y)
    .text(name, 150, y)
    .text(`${price}`, 280, y, { width: 90, align: "right" })
    .text(`${quantity}`, 370, y, { width: 90, align: "right" })
    .text(`${total}`, 0, y, { align: "right" });
}

function generateHr(doc, y) {
  doc.strokeColor("#aaaaaa").lineWidth(1).moveTo(30, y).lineTo(570, y).stroke();
}

module.exports = {
  generatePdfInvoice,
};
