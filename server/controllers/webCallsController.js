const fetch = require('node-fetch');
const citationModel = require("../models/citationModel.js");


function checkAuthor(author) {
  var author_name = "";
  if (author !== undefined) {
    if (author.length > 0 && "given" in author[0] && "family" in author[0]) {
      author_name = author[0]["family"] + "+" + author[0]["given"];
    }
  }
  return author_name;
}

function checkTitle(title) {
  var title_name = "";
  if (title !== undefined) {
    if (title.length > 0) {
      title_name = title[0];
    }
  }
  return title_name;
}

async function crossRef(url) {
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

async function s2(data) {
  let doi = data.message.items[0].DOI;
  const response = await fetch("http://api.semanticscholar.org/v1/paper/" + doi);
  const metaData = await response.json();
  return metaData;
}

async function buildCitation(metaData, citation) {

  const builtCitation = new citationModel(citation);
  builtCitation.set({
    "doi": await metaData.doi,
    "citationVelocity": await metaData.citationVelocity,
    "influentialCitationCount": await metaData.influentialCitationCount,
    "s2PaperUrl": await metaData.url
  });
  return builtCitation;
}

async function saveCitation(finalCitation) {
  finalCitation.save(function (err, citation) {
    if (err) {
      console.log(err);
    }
  });
  return await finalCitation;
}

module.exports = {
  checkAuthor,
  checkTitle,
  getData: async (url, citation) => {
    let data = await crossRef(url);
    let metaData = await s2(data);
    let finalCitation = await buildCitation(metaData, citation);
    let saved = await saveCitation(finalCitation);
    return saved;
  }
};
