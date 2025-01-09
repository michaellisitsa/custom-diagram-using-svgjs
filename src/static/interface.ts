import {
    ParamsResponse,
    StoredParamsResponse,
    paramsTypes,
} from "../shared/ParamsInterface";
import update from "./render";

export function render(
    params: ParamsResponse,
    storedParams: StoredParamsResponse,
) {
    return update(params, storedParams);
}

export function params() {
    return paramsTypes;
}
