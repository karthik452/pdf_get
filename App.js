const express = require('express');
const { PDFDocument, StandardFonts, rgb } = require('pdf-lib');
const stream = require("stream");
const fs = require('fs');
const fetch = require('cross-fetch');
const app = express()
app.get('', (req, res) => {
  res.send('Hello express!')
})
app.get('/afd_pdf', (req, res) => {
  console.log('You provided Customer Name:' + req.query.custName + ', Location:' + req.query.location + ', Model:' + req.query.model
    + ', WordOrder:' + req.query.workorder + ', Rev:' + req.query.rev + ', Rel:' + req.query.rel + ', serail:' + req.query.serial);

    run().catch(err => console.log(err));

  async function run() {
    //const content = await PDFDocument.load(fs.readFileSync('./forms/' + req.query.form + '.pdf'));
    const url = req.query.url;
    const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())
    const content = await PDFDocument.load(existingPdfBytes)
    const form = content.getForm();
    const nameField = form.getTextField('Master.WORK_ORDER_ASSET_SHIP_TO_CUSTOMER_NAME_FORMULA');
    const locField = form.getTextField('Master.WORK_ORDER_ASSET_SHIPPING_CITY_AND_STATE_FORMULA');
    const prodField = form.getTextField('Master.WORK_ORDER_ASSET_PRODUCT_NAME');
    const workField = form.getTextField('Master.WORK_ORDER_ASSET_WORK_ORDER_WORKORDERNUMBER');
    const revField = form.getTextField('QueryData.PRODUCT_MODEL_REASON_PROCEDURE_REV');
    const relField = form.getTextField('QueryData.PRODUCT_MODEL_REASON_PROCEDURE_RELEASE');
    const serialField = form.getTextField('Master.WORK_ORDER_ASSET_SERIALNUMBER');
    nameField.setText(req.query.custName);
    locField.setText(req.query.location);
    prodField.setText(req.query.model);
    workField.setText(req.query.workorder);
    revField.setText(req.query.rev);
    relField.setText(req.query.rel);
    serialField.setText(req.query.serial);
    //res.setHeader('Content-disposition', 'attachment; filename=' + req.query.form + '_' + req.query.workorder + '.pdf');
    res.setHeader('Content-disposition', 'inline; filename=' + req.query.form + '_' + req.query.workorder + '.pdf');
    res.setHeader('Content-type', 'application/pdf');
    // Write the PDF to a file
    const pdfBytes = await content.save();
    const readStream = new stream.PassThrough();
    readStream.end(pdfBytes);
    readStream.pipe(res);
  }
})

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log('Server is up on port ',  port)
})