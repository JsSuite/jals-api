const toJSON = (model) => {
  const clonedModel = JSON.parse(JSON.stringify(model));
  clonedModel.id = clonedModel._id;
  delete clonedModel._id;
  delete clonedModel.__v;
  return clonedModel;
};

module.exports = toJSON;
