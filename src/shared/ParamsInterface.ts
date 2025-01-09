export type ParamsResponse = {
    circleFill: string;
    rectFill: string;
    triangleFill: string;
};

export type StoredParamsResponse = {
    circleBorder: string;
};

export const paramsTypes = [
    { key: "circleFill", type: "string" },
    { key: "rectFill", type: "string" },
    { key: "triangleFill", type: "string" },
];
