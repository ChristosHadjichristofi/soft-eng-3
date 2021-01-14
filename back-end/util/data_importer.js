const fs = require('fs');
const csv = require('fast-csv');

function data_importer(path, model) {

    console.log(path)

    let data = [];

    fs.createReadStream(path)
      .pipe(csv.parse({ headers : true }))
      .on("error", (error) => {
          throw error.message;
      })
      .on("data", (row) => {
          data.push(row);
      })
      .on("end", () => { 
          model.bulkCreate(data);
      })

}

module.exports = data_importer;