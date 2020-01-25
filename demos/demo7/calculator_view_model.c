﻿
/*This file is generated by code generator*/

#include "tkc/mem.h"
#include "tkc/utils.h"
#include "mvvm/base/utils.h"
#include "calculator_view_model.h"

static ret_t calculator_view_model_set_prop(object_t* obj, const char* name, const value_t* v) {
  calculator_view_model_t* vm = (calculator_view_model_t*)(obj);
  calculator_t* calculator = vm->calculator;
  str_t* str = &(vm->temp);

  if (tk_str_eq("expr", name)) {
     str_from_value(str, v);
     calculator_set_expr(calculator, str->str);

     return RET_OK;
  }
  
  return RET_NOT_FOUND;
}


static ret_t calculator_view_model_get_prop(object_t* obj, const char* name, value_t* v) {
  calculator_view_model_t* vm = (calculator_view_model_t*)(obj);
  calculator_t* calculator = vm->calculator;

  if (tk_str_eq("expr", name)) {
     value_set_str(v, calculator_get_expr(calculator));
     return RET_OK;
  }

  return RET_NOT_FOUND;
}


static bool_t calculator_view_model_can_exec(object_t* obj, const char* name, const char* args) {
  calculator_view_model_t* vm = (calculator_view_model_t*)(obj);
  calculator_t* calculator = vm->calculator;

  if (tk_str_eq("add_char", name)) {
    return TRUE;

  } else if (tk_str_eq("remove_char", name)) {
    return calculator_can_remove_char(calculator);

  } else if (tk_str_eq("eval", name)) {
    return calculator_can_eval(calculator);
  }

  return FALSE;
}

static ret_t calculator_view_model_exec(object_t* obj, const char* name, const char* args) {
  calculator_view_model_t* vm = (calculator_view_model_t*)(obj);
  calculator_t* calculator = vm->calculator;

  if (tk_str_eq("add_char", name)) {
    calculator_add_char(calculator, args);
    return RET_OBJECT_CHANGED;

  } else if (tk_str_eq("remove_char", name)) {
    calculator_remove_char(calculator);
    return RET_OBJECT_CHANGED;

  } else if (tk_str_eq("eval", name)) {
    calculator_eval(calculator);
    return RET_OBJECT_CHANGED;
  }

  return RET_NOT_FOUND;
}

static ret_t calculator_view_model_on_destroy(object_t* obj) {
  calculator_view_model_t* vm = (calculator_view_model_t*)(obj);
  return_value_if_fail(vm != NULL, RET_BAD_PARAMS);

  calculator_destroy(vm->calculator);
  str_reset(&(vm->temp));

  return view_model_deinit(VIEW_MODEL(obj));
}

static const object_vtable_t s_calculator_view_model_vtable = {
  .type = "calculator_view_model_t",
  .desc = "calculator_view_model_t",
  .size = sizeof(calculator_view_model_t),
  .exec = calculator_view_model_exec,
  .can_exec = calculator_view_model_can_exec,
  .get_prop = calculator_view_model_get_prop,
  .set_prop = calculator_view_model_set_prop,
  .on_destroy = calculator_view_model_on_destroy
};

view_model_t* calculator_view_model_create(navigator_request_t* req) {
  object_t* obj = object_create(&s_calculator_view_model_vtable);
  view_model_t* vm = view_model_init(VIEW_MODEL(obj));
  calculator_view_model_t* calculator_view_model = (calculator_view_model_t*)(vm);

  return_value_if_fail(vm != NULL, NULL);

  calculator_view_model->calculator = calculator_create();
  ENSURE(calculator_view_model->calculator != NULL);
  str_init(&(calculator_view_model->temp), 0);

  return vm;
}