﻿
/*This file is generated by code generator*/

#include "book.h"
#include "mvvm/base/view_model.h"

#ifndef TK_BOOK_VIEW_MODEL_H
#define TK_BOOK_VIEW_MODEL_H

BEGIN_C_DECLS
/**
 * @class book_view_model_t
 *
 * view model of book
 *
 */
typedef struct _book_view_model_t {
  view_model_t view_model;

  /*model object*/
  book_t* abook;
} book_view_model_t;

/**
 * @method book_view_model_create
 * 创建book view model对象。
 *
 * @annotation ["constructor"]
 * @param {navigator_request_t*} req 请求参数。
 *
 * @return {view_model_t} 返回view_model_t对象。
 */
view_model_t* book_view_model_create(navigator_request_t* req);

/**
 * @method book_view_model_create_with
 * 创建book view model对象。
 *
 * @annotation ["constructor"]
 * @param {book_t*}  abook book对象。
 *
 * @return {view_model_t} 返回view_model_t对象。
 */
view_model_t* book_view_model_create_with(book_t* abook);

/**
 * @method book_view_model_attach
 * 关联到book对象。
 *
 * @param {view_model_t*} view_model view_model对象。
 * @param {book_t*} book book对象。
 *
 * @return {ret_t} 返回RET_OK表示成功，否则表示失败。
 */
ret_t book_view_model_attach(view_model_t* vm, book_t* abook);

END_C_DECLS

#endif /*TK_BOOK_VIEW_MODEL_H*/