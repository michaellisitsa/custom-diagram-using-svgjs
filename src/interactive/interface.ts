import {
    ParamsResponse,
    StoredParamsResponse,
    paramsTypes,
} from "../shared/ParamsInterface";
import { update } from "../shared/render";

export async function initialize(getStoredParams, setStoredParams) {
    const storedParams = getStoredParams();

    return update({} as ParamsResponse, storedParams);
}

export async function render(params: ParamsResponse, getStoredParams) {
    const storedParams = getStoredParams();

    return update(params, storedParams);
}

export async function params() {
    return paramsTypes;
}

export async function storedParams() {
    return [];
}
