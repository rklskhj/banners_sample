import api_product from "./product";
import api_partner from "./partner";
import api_inquiry from "./inquiry";
import api_board from "./board";
import api_exhibition from "./exhibition";
let api = {};

Object.assign(api, api_product);
Object.assign(api, api_partner);
Object.assign(api, api_inquiry);
Object.assign(api, api_board);
Object.assign(api, api_exhibition);

export default api;