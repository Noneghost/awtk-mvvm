const fs = require('fs')
const path = require('path')
const CodeGen = require('./code_gen');

class ViewModelGen extends CodeGen {
  genHeader(json) {
    const desc = json.desc || "";
    const clsName = this.toClassName(json.name);
    const uclsName = clsName.toUpperCase();

    let result = `
/*This file is generated by code generator*/

#include "${clsName}.h"
#include "mvvm/base/view_model.h"

#ifndef TK_${uclsName}_VIEW_MODEL_H
#define TK_${uclsName}_VIEW_MODEL_H

BEGIN_C_DECLS
/**
 * @class ${clsName}_view_model_t
 *
 * view model of ${clsName}
 *
 */
typedef struct _${clsName}_view_model_t {
  view_model_t view_model;

  /*model object*/
  ${clsName}_t* ${clsName};
} ${clsName}_view_model_t;

/**
 * @method ${clsName}_view_model_create
 * 创建${clsName} view model对象。
 *
 * @annotation ["constructor"]
 * @param {navigator_request_t*} req 请求参数。
 *
 * @return {view_model_t} 返回view_model_t对象。
 */
view_model_t* ${clsName}_view_model_create(navigator_request_t* req);

/**
 * @method ${clsName}_view_model_create_with
 * 创建${clsName} view model对象。
 *
 * @annotation ["constructor"]
 * @param {${clsName}_t*}  ${clsName} ${clsName}对象。
 *
 * @return {view_model_t} 返回view_model_t对象。
 */
view_model_t* ${clsName}_view_model_create_with(${clsName}_t* ${clsName});

/**
 * @method ${clsName}_view_model_attach
 * 关联到${clsName}对象。
 *
 * @param {view_model_t*} view_model view_model对象。
 * @param {${clsName}_t*} ${clsName} ${clsName}对象。
 *
 * @return {ret_t} 返回RET_OK表示成功，否则表示失败。
 */
ret_t ${clsName}_view_model_attach(view_model_t* vm, ${clsName}_t* ${clsName});

END_C_DECLS

#endif /*TK_${uclsName}_VIEW_MODEL_H*/
`

    return result;
  }

  genContent(json) {
    const desc = json.desc || "";
    const clsName = this.toClassName(json.name);
    const uclsName = clsName.toUpperCase();
    const setPropsDispatch = this.genSetPropDispatch(json);
    const getPropsDispatch = this.genGetPropDispatch(json);
    const canExecDispatch = this.genCanExecDispatch(json);
    const execDispatch = this.genExecDispatch(json);
    const constructor = this.genConstructor(json);
    const destructor = this.genDestructor(json);
    const forwardEvents = this.genForwardEvents(json);

    let result = `
/*This file is generated by code generator*/

#include "tkc/mem.h"
#include "tkc/utils.h"
#include "mvvm/base/utils.h"
#include "${clsName}_view_model.h"

static ret_t ${clsName}_view_model_set_prop(object_t* obj, const char* name, const value_t* v) {
  ${clsName}_t* ${clsName} = ((${clsName}_view_model_t*)(obj))->${clsName};

${setPropsDispatch}
  
  return RET_NOT_FOUND;
}


static ret_t ${clsName}_view_model_get_prop(object_t* obj, const char* name, value_t* v) {
  ${clsName}_t* ${clsName} = ((${clsName}_view_model_t*)(obj))->${clsName};

${getPropsDispatch}

  return RET_NOT_FOUND;
}


static bool_t ${clsName}_view_model_can_exec(object_t* obj, const char* name, const char* args) {
${canExecDispatch}
  return FALSE;
}

static ret_t ${clsName}_view_model_exec(object_t* obj, const char* name, const char* args) {
${execDispatch}
  return RET_NOT_FOUND;
}

static ret_t ${clsName}_view_model_on_destroy(object_t* obj) {
  ${clsName}_view_model_t* vm = (${clsName}_view_model_t*)(obj);
  return_value_if_fail(vm != NULL, RET_BAD_PARAMS);

  ${destructor}(vm->${clsName});

  return view_model_deinit(VIEW_MODEL(obj));
}

static const object_vtable_t s_${clsName}_view_model_vtable = {
  .type = "${clsName}_view_model_t",
  .desc = "${clsName}_view_model_t",
  .size = sizeof(${clsName}_view_model_t),
  .exec = ${clsName}_view_model_exec,
  .can_exec = ${clsName}_view_model_can_exec,
  .get_prop = ${clsName}_view_model_get_prop,
  .set_prop = ${clsName}_view_model_set_prop,
  .on_destroy = ${clsName}_view_model_on_destroy
};

view_model_t* ${clsName}_view_model_create_with(${clsName}_t* ${clsName}) {
  object_t* obj = object_create(&s_${clsName}_view_model_vtable);
  view_model_t* vm = view_model_init(VIEW_MODEL(obj));
  ${clsName}_view_model_t* ${clsName}_view_model = (${clsName}_view_model_t*)(vm);

  return_value_if_fail(vm != NULL, NULL);

  ${clsName}_view_model->${clsName} = ${clsName};
  ${forwardEvents}

  return vm;
}

ret_t ${clsName}_view_model_attach(view_model_t* vm, ${clsName}_t* ${clsName}) {
  ${clsName}_view_model_t* ${clsName}_view_model = (${clsName}_view_model_t*)(vm);
  return_value_if_fail(vm != NULL, RET_BAD_PARAMS);

  ${clsName}_view_model->${clsName} = ${clsName};

  return RET_OK;
}

view_model_t* ${clsName}_view_model_create(navigator_request_t* req) {
  ${clsName}_t* ${clsName} = ${constructor};
  return_value_if_fail(${clsName} != NULL, NULL);

  return ${clsName}_view_model_create_with(${clsName});
}
`;

    return result;
  }

  filter(json) {
    return json.filter(iter => {
      return this.isModel(iter) && !this.isCollectionModel(iter)
    });
  }

  static run(filename) {
    const gen = new ViewModelGen();
    gen.genFile(filename);
  }
}

if (process.argv.length < 3) {
  console.log(`Usage: node index.js idl.json`);
  process.exit(0);
}

ViewModelGen.run(process.argv[2]);
