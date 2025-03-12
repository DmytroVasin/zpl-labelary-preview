const axios = require('axios').default;

const FACTORS = {
  inches: 1,
  cm: 0.393701,
  mm: 0.0393701
};

const buildLabelaryUrl = (density, width, height, units, page) => {
  const factor = FACTORS[units];
  const widthInches = width * factor;
  const heightInches = height * factor;

  return `https://api.labelary.com/v1/printers/${density}dpmm/labels/${widthInches}x${heightInches}/${page}`
};

const makeLabelaryRequest = async (url, dataText, format = 'png') => {
  const acceptHeader = format === 'pdf' ? 'application/pdf' : 'image/png';

  const response = await axios.post(
    url,
    dataText,
    {
      responseType: 'arraybuffer',
      responseEncoding: 'binary',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': acceptHeader,
      },
      timeout: 5000,
    }
  )

  if (response.status !== 200) {
    throw new Error(`Labelary API returned status code ${response.status}`);
  }

  return response
};

module.exports = {
  buildLabelaryUrl,
  makeLabelaryRequest,
};
