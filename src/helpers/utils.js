export const BuildFireStoreBoolean = bool => {
  return { booleanValue: bool };
};

export const BuildFireStoreNumber = number => {
  return { integerValue: number };
};

export const BuildFireStoreString = string => {
  return { stringValue: string };
};

export const BuildFireStoreArrayFromArray = array => {
  let itemArray = [];
  array.forEach(function(item) {
    itemArray.push({ stringValue: item });
  });

  return { arrayValue: { values: itemArray } };
};

export const BuildFireStoreArrayFromObject = object => {
  let itemArray = [];
  Object.keys(object).forEach(function(i) {
    itemArray.push({ stringValue: i });
  });

  return { arrayValue: { values: itemArray } };
};
