/*global fetch*/
import { getParameter } from '../../opt/parameterStore.mjs';

const CT_DEMO_URL = process.env.CT_DEMO_URL;
const ENDPOINT = process.env.MARKET_CATEGORIES_ENDPOINT

export const handler = async (event) => {
  const BASE_URL = await getParameter(CT_DEMO_URL, false);
  const session = event.session;
  const data = event.data;

  const url = new URL(BASE_URL + ENDPOINT + `/${data.nodeId}`);
  const params = new URLSearchParams();
  if (data.limit)
    params.append('limit', data.limit);

  url.search = params.toString();

  const headers = {
    CST: session.CST,                       //-> CST is retrieved from the return object of GetSession state machine
    'X-SECURITY-TOKEN': session.TOKEN       //-> TOKEN is retrieved from the return object of GetSession state machine
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: headers
  })

  if (response.status == 200) {
    return await response.json();
    //-> Format of this json: https://open-api.capital.com/#tag/Markets-Info-greater-Markets/paths/~1api~1v1~1marketnavigation/get
  }

  const errCode = await response.json();
  return {
    message: `
          Error getting top market categories from capital.com
          Capital.com Error Code: ${errCode?.errorCode}
        `
  }
}
