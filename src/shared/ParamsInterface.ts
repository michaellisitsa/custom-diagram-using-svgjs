export type ParamsResponse = {
    columnDepth: string;
    columnFlangeTf: string;
    beamDepth: string;
    beamFlangeTf: string;
};

export type StoredParamsResponse = {};

export const paramsTypes = [
    { key: "columnDepth", type: "string" },
    { key: "columnFlangeTf", type: "string" },
    { key: "beamDepth", type: "string" },
    { key: "beamFlangeTf", type: "string" },
];

export const defaultParams = {
    columnDepth: 100,
    columnFlangeTf: 7,
    beamDepth: 150,
    beamFlangeTf: 12,
};
